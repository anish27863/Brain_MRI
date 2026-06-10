from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import torch
import os

from model import load_model, predict, CLASS_NAMES
from ood_detector import load_ood_detector, is_brain_mri

# Global model variables
ml_model = None
ood_model = None
device = "cuda" if torch.cuda.is_available() else "cpu"

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load models on startup
    global ml_model, ood_model
    
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
    
    print(f"\n{'='*60}")
    print("ALL MODELS READY")
    print(f"{'='*60}\n")
    
    yield
    
    # Cleanup on shutdown
    del ml_model, ood_model

app = FastAPI(
    title="NeuroScan AI",
    description="Brain Tumor MRI Classification API with OOD Detection",
    version="1.0.0",
    lifespan=lifespan
)

# CORS — allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",              # Local dev
        "https://yourdomain.vercel.app",      # Production (update this)
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
    """Health check endpoint."""
    return {
        "status": "ok",
        "message": "NeuroScan AI API running",
        "version": "1.0.0"
    }

@app.get("/health")
def health():
    """Detailed health check."""
    return {
        "status": "healthy",
        "tumor_classifier_loaded": ml_model is not None,
        "ood_detector_loaded": ood_model is not None,
        "device": str(device)
    }

@app.post("/predict")
async def predict_tumor(file: UploadFile = File(...)):
    """
    Upload an MRI image and get tumor classification predictions.
    
    - First validates the image is a brain MRI (OOD detection)
    - Then classifies the tumor type
    - Returns top 5 predictions with confidence scores
    """
    
    # ========== VALIDATION ==========
    
    # File type check
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only JPEG and PNG are supported."
        )
    
    # Read image bytes
    image_bytes = await file.read()
    
    # File size check (max 10MB)
    if len(image_bytes) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File too large. Maximum size is 10MB."
        )
    
    # ========== OOD DETECTION ==========
    
    print(f"[OOD Detection] Checking if image is a brain MRI...")
    is_valid, mri_confidence = is_brain_mri(ood_model, image_bytes, device, threshold=0.5)
    
    if not is_valid:
        print(f"[OOD Detection] ❌ Rejected (confidence: {mri_confidence}%)")
        raise HTTPException(
            status_code=422,
            detail={
                "error": "NOT_BRAIN_MRI",
                "message": "This image does not appear to be a brain MRI scan.",
                "mri_confidence": mri_confidence,
                "suggestion": "Please upload a valid brain MRI image (T1, T1C+, or T2 weighted scan)."
            }
        )
    
    print(f"[OOD Detection] ✓ Valid brain MRI (confidence: {mri_confidence}%)")
    
    # ========== TUMOR CLASSIFICATION ==========
    
    print(f"[Classification] Running tumor classification...")
    try:
        predictions = predict(ml_model, image_bytes, device, top_k=5)
    except Exception as e:
        print(f"[Classification] ❌ Error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )
    
    top_confidence = predictions[0]["confidence"]
    print(f"[Classification] ✓ Top prediction: {predictions[0]['class_name']} ({top_confidence}%)")
    
    # ========== RESPONSE ==========
    
    return {
        "valid": True,
        "mri_confidence": mri_confidence,
        "predictions": predictions,
        "top_prediction": predictions[0],
        "disclaimer": "NeuroScan AI is a research demonstration. Not for clinical use. Always consult a qualified radiologist."
    }


@app.get("/model-info")
def model_info():
    """Return model statistics and class information."""
    return {
        "model_name": "EfficientNet-B0 (Fine-tuned)",
        "ood_detector": "MobileNetV3-Small (Binary Classifier)",
        "num_classes": 30,
        "test_accuracy": 98.97,
        "f1_macro": 0.9898,
        "f1_weighted": 0.9897,
        "ood_accuracy": 100.0,
        "ood_mri_confidence": 99.99,
        "ood_non_mri_confidence": 0.02,
        "training_images": 15820,
        "validation_images": 3390,
        "test_images": 3390,
        "total_images": 22600,
        "image_size": 224,
        "parameters": 4200000,
        "classes": CLASS_NAMES,
        "training_details": {
            "optimizer": "Adam",
            "learning_rate": 5e-5,
            "epochs": 30,
            "batch_size": 32,
            "hardware": "NVIDIA RTX 4050 (6GB VRAM)"
        }
    }


@app.get("/class-stats")
def class_stats():
    """Return per-class performance statistics."""
    return {
        "class_performance": [
            {"class_name": "Astrocytoma T1", "f1_score": 0.9917, "precision": 0.9835, "recall": 1.0000},
            {"class_name": "Astrocytoma T1C+", "f1_score": 0.9924, "precision": 0.9924, "recall": 0.9924},
            {"class_name": "Astrocytoma T2", "f1_score": 0.9884, "precision": 0.9770, "recall": 1.0000},
            {"class_name": "Ependymoma T1", "f1_score": 0.9519, "precision": 0.9570, "recall": 0.9468},
            {"class_name": "Ependymoma T1C+", "f1_score": 0.9956, "precision": 0.9912, "recall": 1.0000},
            {"class_name": "Ependymoma T2", "f1_score": 0.9372, "precision": 0.9510, "recall": 0.9238},
            {"class_name": "Glioma T1", "f1_score": 0.9871, "precision": 1.0000, "recall": 0.9745},
            {"class_name": "Glioma T1C+", "f1_score": 1.0000, "precision": 1.0000, "recall": 1.0000},
            {"class_name": "Glioma T2", "f1_score": 0.9918, "precision": 0.9837, "recall": 1.0000},
            {"class_name": "Hemangiopericytoma T1", "f1_score": 1.0000, "precision": 1.0000, "recall": 1.0000},
            {"class_name": "Hemangiopericytoma T1C+", "f1_score": 1.0000, "precision": 1.0000, "recall": 1.0000},
            {"class_name": "Hemangiopericytoma T2", "f1_score": 1.0000, "precision": 1.0000, "recall": 1.0000},
            {"class_name": "Meningioma T1", "f1_score": 0.9974, "precision": 0.9948, "recall": 1.0000},
            {"class_name": "Meningioma T1C+", "f1_score": 0.9966, "precision": 0.9966, "recall": 0.9966},
            {"class_name": "Meningioma T2", "f1_score": 0.9815, "precision": 1.0000, "recall": 0.9638},
            {"class_name": "Neurocytoma T1", "f1_score": 1.0000, "precision": 1.0000, "recall": 1.0000},
            {"class_name": "Neurocytoma T1C+", "f1_score": 1.0000, "precision": 1.0000, "recall": 1.0000},
            {"class_name": "Neurocytoma T2", "f1_score": 1.0000, "precision": 1.0000, "recall": 1.0000},
            {"class_name": "Normal T1", "f1_score": 0.9919, "precision": 1.0000, "recall": 0.9839},
            {"class_name": "Normal T1C+", "f1_score": 1.0000, "precision": 1.0000, "recall": 1.0000},
            {"class_name": "Normal T2", "f1_score": 0.9741, "precision": 0.9496, "recall": 1.0000},
            {"class_name": "Oligodendroglioma T1", "f1_score": 1.0000, "precision": 1.0000, "recall": 1.0000},
            {"class_name": "Oligodendroglioma T1C+", "f1_score": 0.9912, "precision": 1.0000, "recall": 0.9825},
            {"class_name": "Oligodendroglioma T2", "f1_score": 1.0000, "precision": 1.0000, "recall": 1.0000},
            {"class_name": "Other T1", "f1_score": 0.9714, "precision": 0.9754, "recall": 0.9675},
            {"class_name": "Other T1C+", "f1_score": 0.9978, "precision": 1.0000, "recall": 0.9956},
            {"class_name": "Other T2", "f1_score": 0.9864, "precision": 0.9732, "recall": 1.0000},
            {"class_name": "Schwannoma T1", "f1_score": 0.9909, "precision": 0.9820, "recall": 1.0000},
            {"class_name": "Schwannoma T1C+", "f1_score": 0.9912, "precision": 0.9882, "recall": 0.9941},
            {"class_name": "Schwannoma T2", "f1_score": 0.9890, "precision": 1.0000, "recall": 0.9783}
        ]
    }