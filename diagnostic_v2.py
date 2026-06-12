import torch
import torch.nn as nn
from torchvision import models, transforms
from pathlib import Path
from PIL import Image
import random

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# ============================================================================
# 1. OOD DETECTOR MODEL
# ============================================================================

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

# ============================================================================
# 2. TRANSFORMS
# ============================================================================

val_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                        std=[0.229, 0.224, 0.225])
])

# ============================================================================
# 3. LOAD MODEL V2
# ============================================================================

print("="*70)
print("OOD DETECTOR V2 DIAGNOSTIC")
print("="*70)

model = OODDetector().to(device)
model.eval()

try:
    checkpoint = torch.load("models/ood_detector_v2.pth", map_location=device, weights_only=False)
    model.load_state_dict(checkpoint['model_state_dict'])
    print(f"\n✓ Model loaded from: models/ood_detector_v2.pth")
    print(f"Best validation accuracy: {checkpoint['best_val_acc']*100:.2f}%")
except FileNotFoundError:
    print("\n❌ ERROR: models/ood_detector_v2.pth not found!")
    print("Make sure you've trained the model first")
    exit(1)

# ============================================================================
# 4. TEST FUNCTION
# ============================================================================

def test_images(image_dir, category_name, max_samples=6):
    """Test a directory of images and return confidence scores."""
    image_dir = Path(image_dir)
    
    if not image_dir.exists():
        print(f"  ⚠️  Directory not found: {image_dir}")
        return None
    
    # Find images RECURSIVELY (including subdirectories)
    images = list(image_dir.rglob("*.jpg")) + list(image_dir.rglob("*.png")) + list(image_dir.rglob("*.JPG"))
    
    if not images:
        print(f"  ⚠️  No images found in {image_dir}")
        return None
    
    # Sample randomly
    sample_images = random.sample(images, min(max_samples, len(images)))
    
    confidences = []
    for img_path in sample_images:
        try:
            img = Image.open(img_path).convert("RGB")
            tensor = val_transform(img).unsqueeze(0).to(device)
            
            with torch.no_grad():
                output = torch.sigmoid(model(tensor)).item()
            
            confidence = output * 100
            confidences.append(confidence)
            
            print(f"  {img_path.name[:40]:40s} → {confidence:6.2f}%")
        except Exception as e:
            print(f"  Error loading {img_path.name}: {e}")
    
    return confidences

# ============================================================================
# 5. RUN DIAGNOSTICS
# ============================================================================

print("\n" + "="*70)
print("TESTING ON SAMPLE IMAGES")
print("="*70)

# TEST 1: Brain MRI (POSITIVE - should be ~99%)
print("\n1. BRAIN MRI SAMPLES (should be HIGH, ~95-100%)")
print("-"*70)
brain_dir = Path("data/raw")
brain_classes = sorted([d for d in brain_dir.iterdir() if d.is_dir()])[:3]
brain_confidences = []

for class_dir in brain_classes:
    images = list(class_dir.glob("*.jpg"))[:2]
    for img_path in images:
        try:
            img = Image.open(img_path).convert("RGB")
            tensor = val_transform(img).unsqueeze(0).to(device)
            with torch.no_grad():
                output = torch.sigmoid(model(tensor)).item()
            confidence = output * 100
            brain_confidences.append(confidence)
            print(f"  {class_dir.name:30s} → {confidence:6.2f}% (brain MRI)")
        except Exception as e:
            print(f"  Error: {e}")

if brain_confidences:
    avg_brain = sum(brain_confidences) / len(brain_confidences)
    print(f"\n  Average brain MRI confidence: {avg_brain:.2f}%")

# TEST 2: Spine MRI (NEGATIVE - should be ~0-5%)
print("\n2. SPINE MRI SAMPLES (should be LOW, ~0-5%) ← KEY TEST!")
print("-"*70)
spine_confidences = test_images("data/hard_negatives/spine_mri", "Spine MRI", max_samples=6)
if spine_confidences:
    avg_spine = sum(spine_confidences) / len(spine_confidences)
    print(f"\n  Average spine MRI confidence: {avg_spine:.2f}%")
    if avg_spine < 10:
        print(f"  ✅ EXCELLENT: Spine MRI correctly rejected!")
    else:
        print(f"  ⚠️  WARNING: Spine MRI not strongly rejected")

# TEST 3: Chest X-rays (NEGATIVE - should be ~0-3%)
print("\n3. CHEST X-RAY SAMPLES (should be LOW, ~0-3%)")
print("-"*70)
chest_confidences = test_images("data/hard_negatives/chest_xray/train", "Chest X-ray", max_samples=6)
if chest_confidences:
    avg_chest = sum(chest_confidences) / len(chest_confidences)
    print(f"\n  Average chest X-ray confidence: {avg_chest:.2f}%")
    if avg_chest < 10:
        print(f"  ✅ EXCELLENT: Chest X-rays correctly rejected!")
    else:
        print(f"  ⚠️  WARNING: Chest X-rays not strongly rejected")

# TEST 4: Bone X-rays (NEGATIVE - should be ~0-3%)
print("\n4. BONE X-RAY SAMPLES (should be LOW, ~0-3%)")
print("-"*70)
bone_confidences = test_images("data/hard_negatives/bone_xray/train", "Bone X-ray", max_samples=6)
if bone_confidences:
    avg_bone = sum(bone_confidences) / len(bone_confidences)
    print(f"\n  Average bone X-ray confidence: {avg_bone:.2f}%")
    if avg_bone < 10:
        print(f"  ✅ EXCELLENT: Bone X-rays correctly rejected!")
    else:
        print(f"  ⚠️  WARNING: Bone X-rays not strongly rejected")

# ============================================================================
# 6. SUMMARY & ANALYSIS
# ============================================================================

print("\n" + "="*70)
print("ANALYSIS & SUMMARY")
print("="*70)

if brain_confidences and spine_confidences:
    avg_brain = sum(brain_confidences) / len(brain_confidences)
    avg_spine = sum(spine_confidences) / len(spine_confidences)
    separation = avg_brain - avg_spine
    
    print(f"\nBrain MRI vs Spine MRI Separation: {separation:.2f}%")
    print(f"  Brain MRI average: {avg_brain:.2f}%")
    print(f"  Spine MRI average: {avg_spine:.2f}%")
    
    print("\n" + "-"*70)
    if separation > 80:
        print("✅ EXCELLENT SEPARATION")
        print("   - Model successfully distinguishes brain MRI from spine MRI")
        print("   - Ready to deploy!")
    elif separation > 50:
        print("✅ GOOD SEPARATION")
        print("   - Model working well, but could be better")
    else:
        print("⚠️  POOR SEPARATION")
        print("   - Model needs improvement")
        print("   - Consider retraining with more epochs or different architecture")

print("\n" + "="*70)
print("DEPLOYMENT CHECKLIST")
print("="*70)

checks = {
    "Brain MRI confidence > 90%": brain_confidences and avg_brain > 90,
    "Spine MRI confidence < 10%": spine_confidences and avg_spine < 10,
    "Chest X-ray confidence < 10%": chest_confidences and avg_chest < 10,
    "Brain vs Spine separation > 80%": brain_confidences and spine_confidences and (avg_brain - avg_spine) > 80,
}

print()
for check, passed in checks.items():
    status = "✅" if passed else "❌"
    print(f"{status} {check}")

all_passed = all(checks.values())
print("\n" + "="*70)
if all_passed:
    print("✅ READY TO DEPLOY!")
    print("\nNext steps:")
    print("1. Copy model to backend: cp models/ood_detector_v2.pth backend/models/ood_detector.pth")
    print("2. Redeploy to Hugging Face Spaces")
    print("3. Test with spine MRI image → should be REJECTED")
else:
    print("⚠️  NOT READY YET")
    print("\nIssues found:")
    for check, passed in checks.items():
        if not passed:
            print(f"  - {check}")

print("="*70)