import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io

class OODDetector(nn.Module):
    """Binary classifier: Is this a brain MRI?"""
    def __init__(self):
        super().__init__()
        backbone = models.mobilenet_v3_small(
            weights=models.MobileNet_V3_Small_Weights.IMAGENET1K_V1
        )
        in_features = backbone.classifier[0].in_features
        backbone.classifier = nn.Sequential(
            nn.Linear(in_features, 64),
            nn.ReLU(inplace=True),
            nn.Dropout(0.3),
            nn.Linear(64, 1)
        )
        self.backbone = backbone
    
    def forward(self, x):
        return self.backbone(x)


INFERENCE_TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


def load_ood_detector(weights_path: str, device: str = "cpu"):
    """Load the pretrained OOD detector."""
    model = OODDetector()
    checkpoint = torch.load(weights_path, map_location=device, weights_only=False)
    model.load_state_dict(checkpoint['model_state_dict'])
    model.eval()
    return model.to(device)


def is_brain_mri(
    model,
    image_bytes: bytes,
    device: str = "cpu",
    threshold: float = 0.5
) -> tuple:
    """
    Check if image is a valid brain MRI scan.
    
    Args:
        model: OOD detector model
        image_bytes: Raw image bytes
        device: torch device
        threshold: Confidence threshold (0.5 = 50% confidence it's MRI)
    
    Returns:
        (is_valid: bool, confidence: float 0-100)
    """
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        tensor = INFERENCE_TRANSFORM(image).unsqueeze(0).to(device)
        
        with torch.no_grad():
            output = torch.sigmoid(model(tensor)).item()
        
        confidence = round(output * 100, 2)
        is_valid = output > threshold
        
        return is_valid, confidence
    
    except Exception as e:
        print(f"OOD detection error: {e}")
        return False, 0.0