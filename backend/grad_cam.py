import torch
import torch.nn.functional as F
import numpy as np
from PIL import Image
import cv2
import io

class GradCAM:
    """
    Grad-CAM (Gradient-weighted Class Activation Mapping)
    Shows which regions of the image the model is focusing on
    """
    
    def __init__(self, model, target_layer):
        """
        Args:
            model: PyTorch model
            target_layer: Layer to compute gradients for (e.g., model.backbone.features[-1])
        """
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None
        
        # Register hooks
        self.target_layer.register_forward_hook(self.save_activations)
        self.target_layer.register_backward_hook(self.save_gradients)
    
    def save_activations(self, module, input, output):
        """Hook to save activations during forward pass"""
        self.activations = output.detach()
    
    def save_gradients(self, module, grad_input, grad_output):
        """Hook to save gradients during backward pass"""
        self.gradients = grad_output[0].detach()
    
    def generate_cam(self, input_tensor, target_class=None):
        """
        Generate Grad-CAM heatmap
        
        Args:
            input_tensor: Input image tensor (1, 3, 224, 224)
            target_class: Target class index (None for highest output)
        
        Returns:
            cam: Heatmap (224, 224)
        """
        # Forward pass
        self.model.eval()
        output = self.model(input_tensor)
        
        # Get target class
        if target_class is None:
            target_class = output.argmax(dim=1)
        
        # Backward pass
        self.model.zero_grad()
        target_score = output[0, target_class]
        target_score.backward()
        
        # Compute Grad-CAM
        # Shape: (batch, channels, height, width)
        gradients = self.gradients[0]  # (channels, height, width)
        activations = self.activations[0]  # (channels, height, width)
        
        # Channel-wise average of gradients
        weights = gradients.mean(dim=[1, 2])  # (channels,)
        
        # Weighted sum of activations
        cam = (weights.unsqueeze(-1).unsqueeze(-1) * activations).sum(dim=0)
        
        # ReLU to keep only positive activations
        cam = F.relu(cam)
        
        # Normalize to 0-1
        cam_min = cam.min()
        cam_max = cam.max()
        if cam_max > cam_min:
            cam = (cam - cam_min) / (cam_max - cam_min)
        
        return cam.cpu().numpy()


def create_grad_cam_for_ood_detector(model):
    """Create Grad-CAM for OOD detector"""
    # Target the last convolutional layer of MobileNetV3
    target_layer = model.backbone.features[-1]
    return GradCAM(model, target_layer)


def create_grad_cam_for_tumor_classifier(model):
    """Create Grad-CAM for tumor classifier (EfficientNet)"""
    # Target the last convolutional layer
    target_layer = model.features[-1]
    return GradCAM(model, target_layer)


def overlay_heatmap(image_array, heatmap, alpha=0.4, colormap=cv2.COLORMAP_JET):
    """
    Overlay Grad-CAM heatmap on original image
    
    Args:
        image_array: Original image (3, 224, 224) numpy array
        heatmap: Grad-CAM heatmap (224, 224)
        alpha: Blending factor (0-1)
        colormap: OpenCV colormap
    
    Returns:
        overlaid_image: Image with heatmap overlay (224, 224, 3)
    """
    # Convert image to numpy if needed
    if isinstance(image_array, torch.Tensor):
        image_array = image_array.cpu().numpy()
    
    # Denormalize image (reverse ImageNet normalization)
    mean = np.array([0.485, 0.456, 0.406]).reshape(3, 1, 1)
    std = np.array([0.229, 0.224, 0.225]).reshape(3, 1, 1)
    image_array = (image_array * std + mean) * 255
    image_array = np.clip(image_array, 0, 255).astype(np.uint8)
    
    # Convert CHW to HWC
    image_array = np.transpose(image_array, (1, 2, 0))
    
    # Convert to BGR for OpenCV
    image_array = cv2.cvtColor(image_array, cv2.COLOR_RGB2BGR)
    
    # Resize heatmap to image size if needed
    heatmap = cv2.resize(heatmap, (image_array.shape[1], image_array.shape[0]))
    
    # Convert heatmap to 0-255
    heatmap_uint8 = (heatmap * 255).astype(np.uint8)
    
    # Apply colormap
    heatmap_colored = cv2.applyColorMap(heatmap_uint8, colormap)
    
    # Blend
    overlaid = cv2.addWeighted(image_array, 1 - alpha, heatmap_colored, alpha, 0)
    
    # Convert back to RGB
    overlaid = cv2.cvtColor(overlaid, cv2.COLOR_BGR2RGB)
    
    return overlaid


def save_grad_cam_image(overlaid_image, save_path):
    """Save Grad-CAM visualization as PNG"""
    # Convert to PIL Image
    img = Image.fromarray(overlaid_image.astype(np.uint8))
    img.save(save_path)


def grad_cam_to_bytes(overlaid_image):
    """Convert Grad-CAM visualization to bytes for HTTP response"""
    img = Image.fromarray(overlaid_image.astype(np.uint8))
    
    # Save to bytes
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    
    return img_bytes.getvalue()


# ============================================================================
# EXAMPLE USAGE IN FASTAPI
# ============================================================================

"""
In your backend/main.py, add this:

from grad_cam import (
    create_grad_cam_for_ood_detector,
    create_grad_cam_for_tumor_classifier,
    overlay_heatmap,
    grad_cam_to_bytes
)
from fastapi.responses import StreamingResponse
import base64

# At startup
grad_cam_ood = create_grad_cam_for_ood_detector(ood_model)
grad_cam_tumor = create_grad_cam_for_tumor_classifier(ml_model)

# Add new endpoint
@app.post("/predict-with-visualization")
async def predict_with_grad_cam(file: UploadFile = File(...)):
    '''
    Same as /predict but also returns Grad-CAM visualizations
    '''
    image_bytes = await file.read()
    
    # Validate file...
    # Check if brain MRI...
    # Classify tumor...
    
    # Generate Grad-CAM for OOD detector
    image_tensor = transform(Image.open(io.BytesIO(image_bytes))).unsqueeze(0).to(device)
    ood_cam = grad_cam_ood.generate_cam(image_tensor)
    ood_overlay = overlay_heatmap(image_tensor[0], ood_cam)
    
    # Generate Grad-CAM for tumor classifier
    tumor_cam = grad_cam_tumor.generate_cam(image_tensor)
    tumor_overlay = overlay_heatmap(image_tensor[0], tumor_cam)
    
    # Encode as base64 for JSON response
    ood_vis = grad_cam_to_bytes(ood_overlay)
    tumor_vis = grad_cam_to_bytes(tumor_overlay)
    
    ood_b64 = base64.b64encode(ood_vis).decode()
    tumor_b64 = base64.b64encode(tumor_vis).decode()
    
    return {
        "valid": True,
        "mri_confidence": mri_confidence,
        "predictions": predictions,
        "top_prediction": predictions[0],
        "visualizations": {
            "ood_detector_gradcam": f"data:image/png;base64,{ood_b64}",
            "tumor_classifier_gradcam": f"data:image/png;base64,{tumor_b64}"
        }
    }

# In frontend (Next.js), display the visualizations:
if (result.visualizations) {
    setOodVisualization(result.visualizations.ood_detector_gradcam);
    setTumorVisualization(result.visualizations.tumor_classifier_gradcam);
}

// In JSX:
<img src={oodVisualization} alt="OOD Detector Grad-CAM" />
<img src={tumorVisualization} alt="Tumor Classifier Grad-CAM" />
"""