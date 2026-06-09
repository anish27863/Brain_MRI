import torch
import torch.nn as nn
from torchvision import transforms
from torchvision.models import efficientnet_b0
from PIL import Image
import io

# 30 class names in EXACT order (alphabetically sorted, matching training)
CLASS_NAMES = [
    "Astrocytoma T1",
    "Astrocytoma T1C+",
    "Astrocytoma T2",
    "Ependymoma T1",
    "Ependymoma T1C+",
    "Ependymoma T2",
    "Glioma T1",
    "Glioma T1C+",
    "Glioma T2",
    "Hemangiopericytoma T1",
    "Hemangiopericytoma T1C+",
    "Hemangiopericytoma T2",
    "Meningioma T1",
    "Meningioma T1C+",
    "Meningioma T2",
    "Neurocytoma T1",
    "Neurocytoma T1C+",
    "Neurocytoma T2",
    "Normal T1",
    "Normal T1C+",
    "Normal T2",
    "Oligodendroglioma T1",
    "Oligodendroglioma T1C+",
    "Oligodendroglioma T2",
    "Other T1",
    "Other T1C+",
    "Other T2",
    "Schwannoma T1",
    "Schwannoma T1C+",
    "Schwannoma T2",
]

# EXACT same transform used during training/validation — do NOT modify
INFERENCE_TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


def load_model(weights_path: str, device: str = "cpu"):
    """Load EfficientNet-B0 with the custom classifier head used during training."""
    backbone = efficientnet_b0(weights=None)
    in_features = backbone.classifier[1].in_features

    backbone.classifier = nn.Sequential(
        nn.Dropout(0.5),
        nn.Linear(in_features, 256),
        nn.ReLU(inplace=True),
        nn.Dropout(0.5),
        nn.Linear(256, 30)
    )

    checkpoint = torch.load(weights_path, map_location=device, weights_only=False)
    state_dict = checkpoint["model_state_dict"]

    # The checkpoint may have been saved with a 'backbone.' prefix if the
    # EfficientNet was wrapped in a parent module during training.
    # Strip it so we can load directly into the bare efficientnet_b0.
    if any(k.startswith("backbone.") for k in state_dict):
        state_dict = {k.replace("backbone.", "", 1): v for k, v in state_dict.items()}

    backbone.load_state_dict(state_dict)
    backbone.eval()

    return backbone.to(device)


def predict(model, image_bytes: bytes, device: str = "cpu", top_k: int = 5):
    """
    Run inference on raw image bytes.

    Args:
        model: Loaded EfficientNet-B0 model.
        image_bytes: Raw bytes of the uploaded image file.
        device: Torch device string ("cpu" or "cuda").
        top_k: Number of top predictions to return.

    Returns:
        List of dicts with keys: class_name, class_index, confidence (%).
    """
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    tensor = INFERENCE_TRANSFORM(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(tensor)
        probabilities = torch.softmax(outputs, dim=1)[0]

    top_probs, top_indices = torch.topk(probabilities, top_k)

    predictions = []
    for prob, idx in zip(top_probs.tolist(), top_indices.tolist()):
        predictions.append({
            "class_name": CLASS_NAMES[idx],
            "class_index": idx,
            "confidence": round(prob * 100, 2),
        })

    return predictions
