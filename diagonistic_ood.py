import torch
import torch.nn as nn
from torchvision import models, transforms
from pathlib import Path
from PIL import Image
import random

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Load the trained OOD detector
class OODDetector(nn.Module):
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

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                        std=[0.229, 0.224, 0.225])
])

print("="*70)
print("OOD DETECTOR DIAGNOSTIC")
print("="*70)

# Load model
model = OODDetector().to(device)
checkpoint = torch.load("models/ood_detector.pth", map_location=device)
model.load_state_dict(checkpoint['model_state_dict'])
model.eval()

print(f"\n✓ Model loaded")
print(f"Best validation accuracy: {checkpoint['best_val_acc']*100:.2f}%")

# Test on sample images
print("\n" + "="*70)
print("TESTING ON SAMPLE IMAGES")
print("="*70)

# Test 1: Brain MRI samples
print("\n1. BRAIN MRI SAMPLES (should be high, ~100%)")
print("-"*70)
mri_dir = Path("data/raw")
mri_samples = []
for class_dir in list(mri_dir.iterdir())[:3]:  # First 3 classes
    for img in list(class_dir.glob("*.jpg"))[:2]:  # First 2 images per class
        mri_samples.append(img)

mri_confidences = []
for img_path in mri_samples[:6]:
    try:
        img = Image.open(img_path).convert("RGB")
        tensor = transform(img).unsqueeze(0).to(device)
        with torch.no_grad():
            output = torch.sigmoid(model(tensor)).item()
        confidence = output * 100
        mri_confidences.append(confidence)
        print(f"  {img_path.parent.name:30s} → {confidence:.2f}% (MRI)")
    except Exception as e:
        print(f"  Error: {e}")

print(f"\n  Average MRI confidence: {sum(mri_confidences)/len(mri_confidences):.2f}%")

# Test 2: Non-MRI samples (CIFAR-100)
print("\n2. NON-MRI SAMPLES (should be low, ~0%)")
print("-"*70)
non_mri_dir = Path("data/non_mri/train")
non_mri_samples = []
for class_dir in sorted(list(non_mri_dir.iterdir()))[:3]:  # First 3 classes
    for img in list(class_dir.glob("*.png"))[:2]:  # First 2 images
        non_mri_samples.append(img)

non_mri_confidences = []
for img_path in non_mri_samples[:6]:
    try:
        img = Image.open(img_path).convert("RGB")
        tensor = transform(img).unsqueeze(0).to(device)
        with torch.no_grad():
            output = torch.sigmoid(model(tensor)).item()
        confidence = output * 100
        non_mri_confidences.append(confidence)
        print(f"  {img_path.parent.name:30s} → {confidence:.2f}% (not MRI)")
    except Exception as e:
        print(f"  Error: {e}")

print(f"\n  Average non-MRI confidence: {sum(non_mri_confidences)/len(non_mri_confidences):.2f}%")

# Analysis
print("\n" + "="*70)
print("ANALYSIS")
print("="*70)

mri_mean = sum(mri_confidences) / len(mri_confidences)
non_mri_mean = sum(non_mri_confidences) / len(non_mri_confidences)
separation = mri_mean - non_mri_mean

print(f"\nMRI vs Non-MRI Separation: {separation:.2f}%")
print(f"  MRI average: {mri_mean:.2f}%")
print(f"  Non-MRI average: {non_mri_mean:.2f}%")

if separation > 50:
    print(f"\n✓ Good separation — model learned meaningful features")
elif separation > 30:
    print(f"\n⚠️  Moderate separation — model is working but could be better")
else:
    print(f"\n❌ Poor separation — model may have overfitted or data is too similar")

# Show confusion about edge cases
print("\n" + "="*70)
print("EDGE CASE TESTING")
print("="*70)

print("\nTesting on blurry/unclear non-MRI images...")
# These CIFAR images are 32x32 upscaled to 224x224 — very pixelated
edge_case_samples = []
for class_dir in sorted(list(non_mri_dir.iterdir()))[10:13]:
    for img in list(class_dir.glob("*.png"))[:1]:
        edge_case_samples.append(img)

for img_path in edge_case_samples:
    try:
        img = Image.open(img_path).convert("RGB")
        tensor = transform(img).unsqueeze(0).to(device)
        with torch.no_grad():
            output = torch.sigmoid(model(tensor)).item()
        confidence = output * 100
        
        status = "❌ PROBLEM: Thinks this is MRI!" if confidence > 70 else "✓ Correctly rejected"
        print(f"  {img_path.parent.name:30s} → {confidence:.2f}% — {status}")
    except Exception as e:
        print(f"  Error: {e}")

print("\n" + "="*70)
print("CONCLUSION")
print("="*70)
print("""
If separation > 50%: Model is working well despite high validation accuracy
If separation < 30%: Consider:
  1. Using a harder non-MRI dataset (medical images, not CIFAR)
  2. Adding data augmentation to make task harder
  3. Training longer with lower learning rate
  4. Using ensemble of both models instead of just OOD detector
""")