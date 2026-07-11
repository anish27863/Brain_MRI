from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import torch
import torch.nn.functional as F
import numpy as np
from PIL import Image
import cv2
import io
import base64
import os

from model import load_model, predict, CLASS_NAMES
from ood_detector import load_ood_detector, is_brain_mri

# ============================================================================
# GRAD-CAM IMPLEMENTATION
# ============================================================================

class GradCAM:
    """Generates Grad-CAM visualizations"""
    
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None
        
        self.target_layer.register_forward_hook(self.save_activations)
        self.target_layer.register_backward_hook(self.save_gradients)
    
    def save_activations(self, module, input, output):
        self.activations = output.detach()
    
    def save_gradients(self, module, grad_input, grad_output):
        self.gradients = grad_output[0].detach()
    
    def generate_cam(self, input_tensor):
        """Generate Grad-CAM heatmap"""
        self.model.eval()
        output = self.model(input_tensor)
        
        self.model.zero_grad()
        target_score = output[0].max()
        target_score.backward()
        
        gradients = self.gradients[0]
        activations = self.activations[0]
        
        weights = gradients.mean(dim=[1, 2])
        cam = (weights.unsqueeze(-1).unsqueeze(-1) * activations).sum(dim=0)
        cam = F.relu(cam)
        
        cam_min = cam.min()
        cam_max = cam.max()
        if cam_max > cam_min:
            cam = (cam - cam_min) / (cam_max - cam_min)
        
        return cam.cpu().numpy()


def overlay_heatmap(image_tensor, heatmap, alpha=0.4):
    """Overlay Grad-CAM heatmap on image"""
    # Denormalize image
    mean = np.array([0.485, 0.456, 0.406]).reshape(3, 1, 1)
    std = np.array([0.229, 0.224, 0.225]).reshape(3, 1, 1)
    
    image_array = image_tensor.cpu().numpy()
    image_array = (image_array * std + mean) * 255
    image_array = np.clip(image_array, 0, 255).astype(np.uint8)
    image_array = np.transpose(image_array, (1, 2, 0))
    
    # Convert to BGR
    image_array = cv2.cvtColor(image_array, cv2.COLOR_RGB2BGR)
    
    # Resize heatmap
    heatmap = cv2.resize(heatmap, (image_array.shape[1], image_array.shape[0]))
    heatmap_uint8 = (heatmap * 255).astype(np.uint8)
    heatmap_colored = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
    
    # Blend
    overlaid = cv2.addWeighted(image_array, 1 - alpha, heatmap_colored, alpha, 0)
    overlaid = cv2.cvtColor(overlaid, cv2.COLOR_BGR2RGB)
    
    return overlaid


def image_to_base64(image_array):
    """Convert image array to base64 PNG"""
    img = Image.fromarray(image_array.astype(np.uint8))
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    return base64.b64encode(img_bytes.getvalue()).decode()

# ============================================================================
# GLOBAL VARIABLES & LIFESPAN
# ============================================================================

ml_model = None
ood_model = None
grad_cam_ood = None
grad_cam_tumor = None
device = "cuda" if torch.cuda.is_available() else "cpu"

@asynccontextmanager
async def lifespan(app: FastAPI):
    global ml_model, ood_model, grad_cam_ood, grad_cam_tumor
    
    print(f"\n{'='*60}")
    print("LOADING MODELS")
    print(f"{'='*60}")
    print(f"Device: {device}")
    
    # Load tumor classifier
    tumor_weights = os.getenv("TUMOR_MODEL_PATH", "models/efficientnet_finetuned_best.pth")
    print(f"\nLoading tumor classifier from {tumor_weights}...")
    ml_model = load_model(tumor_weights, device)
    print("✓ Tumor classifier loaded")
    
    # Load OOD detector
    ood_weights = os.getenv("OOD_MODEL_PATH", "models/ood_detector.pth")
    print(f"\nLoading OOD detector from {ood_weights}...")
    ood_model = load_ood_detector(ood_weights, device)
    print("✓ OOD detector loaded")
    
    # Initialize Grad-CAM
    print("\nInitializing Grad-CAM...")
    grad_cam_ood = GradCAM(ood_model, ood_model.backbone.features[-1])
    grad_cam_tumor = GradCAM(ml_model, ml_model.features[-1])
    print("✓ Grad-CAM initialized")
    
    print(f"\n{'='*60}")
    print("ALL MODELS READY")
    print(f"{'='*60}\n")
    
    yield
    
    del ml_model, ood_model, grad_cam_ood, grad_cam_tumor

app = FastAPI(
    title="NeuroScan AI",
    description="Brain Tumor MRI Classification API with OOD Detection & Grad-CAM",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://yourdomain.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# ENDPOINTS
# ============================================================================

@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "NeuroScan AI API running with Grad-CAM",
        "version": "1.0.0"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "tumor_classifier_loaded": ml_model is not None,
        "ood_detector_loaded": ood_model is not None,
        "grad_cam_ready": grad_cam_ood is not None,
        "device": str(device)
    }

@app.post("/predict")
async def predict_tumor(file: UploadFile = File(...)):
    """Basic prediction endpoint (no Grad-CAM)"""
    
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        raise HTTPException(status_code=400, detail="Only JPEG/PNG supported")
    
    image_bytes = await file.read()
    
    if len(image_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File must be under 10MB")
    
    # OOD Detection
    is_valid, mri_confidence = is_brain_mri(ood_model, image_bytes, device, threshold=0.5)
    
    if not is_valid:
        raise HTTPException(
            status_code=422,
            detail={
                "error": "NOT_BRAIN_MRI",
                "message": "This image does not appear to be a brain MRI scan.",
                "mri_confidence": mri_confidence,
            }
        )
    
    # Tumor Classification
    predictions = predict(ml_model, image_bytes, device, top_k=5)
    
    return {
        "valid": True,
        "mri_confidence": mri_confidence,
        "predictions": predictions,
        "top_prediction": predictions[0],
        "disclaimer": "Research demo only. Not for clinical use."
    }

@app.post("/predict-with-gradcam")
async def predict_with_visualization(file: UploadFile = File(...)):
    """
    Prediction with Grad-CAM visualizations
    Shows which regions the model is focusing on
    """
    
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        raise HTTPException(status_code=400, detail="Only JPEG/PNG supported")
    
    image_bytes = await file.read()
    
    if len(image_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File must be under 10MB")
    
    # Prepare image tensor
    from torchvision import transforms
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                           std=[0.229, 0.224, 0.225])
    ])
    
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image_tensor = transform(image).unsqueeze(0).to(device)
    
    # OOD Detection
    is_valid, mri_confidence = is_brain_mri(ood_model, image_bytes, device, threshold=0.5)
    
    if not is_valid:
        raise HTTPException(
            status_code=422,
            detail={
                "error": "NOT_BRAIN_MRI",
                "message": "This image does not appear to be a brain MRI scan.",
                "mri_confidence": mri_confidence,
            }
        )
    
    # Tumor Classification
    predictions = predict(ml_model, image_bytes, device, top_k=5)
    
    # Generate Grad-CAM visualizations
    print("[Grad-CAM] Generating visualizations...")
    try:
        ood_cam = grad_cam_ood.generate_cam(image_tensor)
        ood_overlay = overlay_heatmap(image_tensor[0], ood_cam)
        ood_b64 = image_to_base64(ood_overlay)
        
        tumor_cam = grad_cam_tumor.generate_cam(image_tensor)
        tumor_overlay = overlay_heatmap(image_tensor[0], tumor_cam)
        tumor_b64 = image_to_base64(tumor_overlay)
        
        print("[Grad-CAM] ✓ Visualizations generated")
    except Exception as e:
        print(f"[Grad-CAM] ❌ Error: {e}")
        ood_b64 = None
        tumor_b64 = None
    
    return {
        "valid": True,
        "mri_confidence": mri_confidence,
        "predictions": predictions,
        "top_prediction": predictions[0],
        "visualizations": {
            "ood_detector": f"data:image/png;base64,{ood_b64}" if ood_b64 else None,
            "tumor_classifier": f"data:image/png;base64,{tumor_b64}" if tumor_b64 else None
        },
        "disclaimer": "Research demo only. Not for clinical use."
    }

@app.get("/model-info")
def model_info():
    return {
        "model_name": "EfficientNet-B0 (Fine-tuned)",
        "ood_detector": "MobileNetV3-Small (Binary Classifier)",
        "visualizations": "Grad-CAM available",
        "test_accuracy": 98.97,
        "f1_macro": 0.9898,
        "num_classes": 30,
        "classes": CLASS_NAMES,
    }