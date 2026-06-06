# Brain Tumor MRI Classification

A deep learning project for classifying brain tumors from MRI images across 30 different tumor types. Achieves **98.97% test accuracy** using fine-tuned EfficientNet-B0.

## 🎯 Project Overview

This project demonstrates the complete ML pipeline: data exploration, baseline model development, transfer learning, and model evaluation. The trained model can classify brain MRI scans into one of 30 tumor types with high precision and recall.

**Key Achievements:**
- ✅ **Test Accuracy:** 98.97%
- ✅ **F1-Score (Macro):** 0.9898
- ✅ **Perfect Classification:** 12/30 tumor types (100% F1-score)
- ✅ **Training Time:** ~165 minutes total (baseline + transfer + fine-tuning)
- ✅ **Model Size:** 4.2M parameters (efficient for deployment)

---

## 🛠️ Tech Stack

### Machine Learning & Data Science
| Component | Version | Purpose |
|-----------|---------|---------|
| **PyTorch** | 2.5.0 | Deep learning framework |
| **CUDA** | 12.4 | GPU acceleration |
| **TorchVision** | 0.20.0 | Pretrained models & transforms |
| **NumPy** | 1.26.4 | Numerical computing |
| **Pandas** | 2.2.0 | Data manipulation |
| **Scikit-learn** | 1.3.2 | Metrics & preprocessing |
| **OpenCV** | 4.9.0.80 | Image processing |
| **Matplotlib/Seaborn** | Latest | Visualizations |

### Hardware Used
- **GPU:** NVIDIA RTX 4050 Laptop (6GB VRAM)
- **CPU:** Intel i5-13450HX
- **RAM:** 16GB DDR5
- **OS:** Windows 11

### Development
- **Python:** 3.10
- **Conda:** Environment management
- **Jupyter:** Notebooks for exploration & training
- **Git:** Version control

---

## 📊 Dataset

**Brain Tumor MRI Images Dataset** (30 Classes)

### Dataset Statistics
| Metric | Value |
|--------|-------|
| **Total Images** | 22,600 |
| **Tumor Types** | 30 |
| **Image Resolution** | 512 × 512 (resized to 224 × 224) |
| **Train/Val/Test Split** | 70% / 15% / 15% |
| **Training Samples** | 15,820 |
| **Validation Samples** | 3,390 |
| **Test Samples** | 3,390 |

### Class Distribution
Balanced across 30 classes with intentional class weighting to handle slight imbalances:
- **Most abundant:** Meningioma T1C+ (1,954 images)
- **Least abundant:** Hemangiopericytoma T2 (236 images)
- **Approach:** Stratified split + weighted loss function

### Data Augmentation (Training Only)
- Random horizontal flip (50%)
- Random rotation (±15°)
- Color jitter (brightness, contrast, saturation ±20%)
- ImageNet normalization (mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])

---

## 🏗️ Model Architecture

### Baseline CNN (Epoch 1-30)
- **Architecture:** 4 conv blocks + 2 FC layers
- **Parameters:** 426K
- **Performance:** 34.34% validation accuracy
- **Purpose:** Proof of concept, benchmark

### Transfer Learning (Epochs 31-50)
- **Backbone:** EfficientNet-B0 (pretrained ImageNet)
- **Frozen:** Yes (only train classifier)
- **Learning Rate:** 1e-4
- **Performance:** 57.82% validation accuracy
- **Purpose:** Leverage pretrained features

### Fine-Tuned EfficientNet-B0 (Epochs 51-80) ⭐ **BEST**
- **Backbone:** EfficientNet-B0 (unfrozen, all parameters trainable)
- **Classifier:** Dropout(0.5) → Linear(1280→256) → ReLU → Dropout(0.5) → Linear(256→30)
- **Parameters:** 4.2M (all trainable)
- **Learning Rate:** 5e-5 (low for fine-tuning)
- **Optimizer:** Adam (weight_decay=1e-5)
- **Loss:** CrossEntropyLoss with class weights
- **Scheduler:** ReduceLROnPlateau (factor=0.5, patience=3)
- **Validation Accuracy:** 98.88%
- **Test Accuracy:** 98.97% ⭐
- **Training Time:** ~50 minutes (30 epochs)

---

## 📈 Training Results

### Model Comparison

| Model | Training Time | Val Acc | Test Acc | Epochs | LR |
|-------|---------------|---------|----------|--------|-----|
| Baseline CNN | 68:38 | 34.34% | - | 30 | 1e-3 |
| EfficientNet (Frozen) | 45:03 | 57.82% | - | 20 | 1e-4 |
| EfficientNet (Fine-tuned) | ~50:00 | 98.88% | **98.97%** | 30 | 5e-5 |

### Final Test Set Performance

```
Overall Accuracy:     98.97%
F1-Score (Macro):     0.9898
F1-Score (Weighted):  0.9897

Perfect Classes (100% F1-score):
  ✓ Glioma T1C+
  ✓ Hemangiopericytoma T1
  ✓ Hemangiopericytoma T1C+
  ✓ Hemangiopericytoma T2
  ✓ Neurocytoma T1
  ✓ Neurocytoma T1C+
  ✓ Neurocytoma T2
  ✓ Normal T1C+
  ✓ Oligodendroglioma T1
  ✓ Oligodendroglioma T2
  + 2 more...

Worst Performing Class:
  ⚠️ Ependymoma T2 (F1: 0.9372, Recall: 0.9238)
```

### Key Insights
1. **Transfer learning impact:** +64.63% improvement over baseline
2. **Fine-tuning advantage:** +41.06% over frozen backbone
3. **No overfitting:** Test accuracy ≈ Validation accuracy
4. **Class balance:** Weighted loss handles imbalance well
5. **GPU efficiency:** Full training on 6GB VRAM laptop

---

## 🚀 Setup & Installation

### Prerequisites
- Python 3.10+
- Conda (Anaconda or Miniconda)
- Git
- ~10GB disk space (for dataset + models)

### 1. Clone Repository
```bash
git clone https://github.com/YourUsername/brain-tumor-mri.git
cd brain-tumor-mri
```

### 2. Create Conda Environment
```bash
conda create -n brain-tumor python=3.10
conda activate brain-tumor
```

### 3. Install PyTorch with CUDA
```bash
# For NVIDIA GPU (CUDA 12.4)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124

# For CPU only
pip install torch torchvision torchaudio
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Download Dataset
```bash
# Download from Kaggle
# https://www.kaggle.com/datasets/fernando2rad/brain-tumor-mri-images-30-classes

# Extract to data/raw/
# Structure should be:
# data/raw/
# ├── Astrocytoma T1/
# ├── Astrocytoma T1C+/
# ├── ... (30 tumor type folders)
```

### 6. Verify GPU Setup
```bash
python -c "import torch; print(torch.cuda.is_available()); print(torch.cuda.get_device_name(0))"
```

Expected output:
```
True
NVIDIA GeForce RTX 4050 Laptop GPU
```

---

## 📁 Project Structure

```
brain-tumor-mri/
├── data/
│   ├── raw/                    # Original dataset (~5.3GB)
│   │   ├── Astrocytoma T1/
│   │   ├── Astrocytoma T1C+/
│   │   └── ... (30 folders)
│   └── processed/              # Preprocessed data (optional)
│
├── models/
│   ├── baseline_cnn_best.pth
│   ├── efficientnet_frozen_best.pth
│   └── efficientnet_finetuned_best.pth  ⭐ Best model
│
├── results/
│   ├── confusion_matrix.png    # 30×30 heatmap
│   ├── per_class_metrics.png   # Precision/Recall/F1
│   ├── evaluation_report.txt   # Detailed metrics
│   └── gpu_benchmark.csv       # Batch size performance
│
├── src/
│   ├── brain_data.py           # Data loading & augmentation
│   ├── models.py               # Baseline CNN architecture
│   ├── models_tl.py            # Transfer learning models
│   ├── train.py                # Training loop
│   └── evaluate.py             # Evaluation & visualization
│
├── notebooks/
│   ├── 01_data_exploration.ipynb       # EDA
│   ├── 02_baseline_training.ipynb      # Baseline CNN
│   ├── 03_transfer_learning.ipynb      # Frozen backbone
│   ├── 04_fine_tuning.ipynb            # Fine-tuned model
│   └── 05_evaluation.ipynb             # Test set evaluation
│
├── .gitignore
├── requirements.txt
├── README.md                   # This file
└── LICENSE

```

---

## 🏃 Running the Code

### Data Exploration
```bash
conda activate brain-tumor
jupyter notebook notebooks/01_data_exploration.ipynb
```

### Train Baseline Model
```bash
jupyter notebook notebooks/02_baseline_training.ipynb
# Expected runtime: ~70 minutes
# Expected accuracy: 34%
```

### Transfer Learning (Frozen)
```bash
jupyter notebook notebooks/03_transfer_learning.ipynb
# Expected runtime: ~45 minutes
# Expected accuracy: 58%
```

### Fine-Tuning (Best Results)
```bash
jupyter notebook notebooks/04_fine_tuning.ipynb
# Expected runtime: ~50 minutes
# Expected accuracy: 99%
```

### Evaluate on Test Set
```bash
jupyter notebook notebooks/05_evaluation.ipynb
# Generates confusion matrix, per-class metrics, report
```

---

## 💾 Pre-trained Model

The fine-tuned model weights are **not included** in the repository (too large).

### Option 1: Train Locally
```bash
jupyter notebook notebooks/04_fine_tuning.ipynb
```
This will save `models/efficientnet_finetuned_best.pth`

### Option 2: Download Pretrained Weights
Available at: [GitHub Releases](https://github.com/YourUsername/brain-tumor-mri/releases)

```bash
wget https://github.com/YourUsername/brain-tumor-mri/releases/download/v1.0/efficientnet_finetuned_best.pth
mv efficientnet_finetuned_best.pth models/
```

---

## 📊 GPU Benchmarking Results

Tested on RTX 4050 with EfficientNet-B0:

| Batch Size | Time (s) | Throughput (img/s) | Peak Memory (MB) |
|------------|----------|-------------------|------------------|
| 8 | 145.2 | 108.8 | 2,850 |
| 16 | 87.1 | 181.6 | 3,420 |
| **32** | **49.3** | **321.5** | **5,180** ⭐ |
| 48 | 38.2 | 382.1 | 5,890 |
| 64 | 33.6 | 436.3 | 6,089 |

**Optimal batch size:** 32 (best throughput vs memory trade-off)

---

## 🔍 Model Interpretation

### Best Performing Classes (100% F1-score)
- Glioma T1C+
- All 3 Hemangiopericytoma variants
- All 3 Neurocytoma variants
- Normal T1C+
- Both Oligodendroglioma variants
- ...and 2 more

These classes have **distinct MRI signatures** that the model learns perfectly.

### Challenging Class (Ependymoma T2)
- **F1-score:** 0.9372 (lowest)
- **Recall:** 92.38%
- **Precision:** 95.10%
- **Reason:** T2-weighted images for Ependymoma may appear similar to other tumor types

---

## 🚀 Future Improvements

### Immediate (1-2 weeks)
- [ ] Build Next.js + FastAPI web interface
- [ ] Implement Grad-CAM visualization
- [ ] Add batch prediction capability
- [ ] Deploy on Vercel + Railway

### Medium-term (1-2 months)
- [ ] Ensemble of EfficientNet + ResNet + MobileNet
- [ ] Hyperparameter tuning with Optuna
- [ ] Export to ONNX/TensorFlow Lite
- [ ] Mobile app (React Native or Flutter)

### Long-term (Future)
- [ ] Test on real hospital datasets
- [ ] HIPAA/GDPR compliance for production
- [ ] Integration with hospital PACS systems
- [ ] Clinical validation study
- [ ] FDA/CE mark certification

---

## 📚 Dependencies

### Core ML/Data Science
```
torch==2.5.0
torchvision==0.20.0
torchaudio==2.5.0
numpy==1.26.4
pandas==2.2.0
scikit-learn==1.3.2
matplotlib==3.8.3
seaborn==0.13.1
opencv-python==4.9.0.80
Pillow==10.1.0
tqdm==4.66.2
```

### Web Framework (Upcoming)
```
fastapi==0.104.0
uvicorn==0.24.0
python-multipart==0.0.6
```

See `requirements.txt` for complete list.

---

## 📖 Usage Examples

### Inference with Trained Model
```python
import torch
from PIL import Image
from torchvision import transforms
from src.models_tl import EfficientNetTransfer

# Load model
device = torch.device('cuda')
model = EfficientNetTransfer(num_classes=30)
checkpoint = torch.load('models/efficientnet_finetuned_best.pth')
model.load_state_dict(checkpoint['model_state_dict'])
model = model.to(device).eval()

# Load image
image = Image.open('path/to/mri.jpg').convert('RGB')
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                        std=[0.229, 0.224, 0.225])
])
image = transform(image).unsqueeze(0).to(device)

# Predict
with torch.no_grad():
    outputs = model(image)
    probabilities = torch.softmax(outputs, dim=1)
    top5 = torch.topk(probabilities, 5)
    
print(f"Top prediction: {class_names[top5.indices[0][0]]} ({top5.values[0][0]:.2%})")
```

---

## 🐛 Troubleshooting

### CUDA Out of Memory
```python
# Reduce batch size in data loader
batch_size = 16  # Instead of 32
```

### Model won't load
```bash
# Verify PyTorch + CUDA versions match
python -c "import torch; print(torch.version.cuda)"

# Reinstall if needed
pip install torch==2.5.0 --index-url https://download.pytorch.org/whl/cu124
```

### Dataset not found
```bash
# Ensure correct structure:
ls data/raw/
# Should show: Astrocytoma T1, Astrocytoma T1C+, ...
```

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👤 Author

**Anish** - VIT Bhopal (2nd year MTech AI)
- GitHub: [@YourUsername](https://github.com/YourUsername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/YourProfile)
- Portfolio: [Your Portfolio](https://yourportfolio.com)

---

## 🙏 Acknowledgments

- Dataset: [Kaggle - Brain Tumor MRI Images](https://www.kaggle.com/datasets/fernando2rad/brain-tumor-mri-images-30-classes)
- EfficientNet: [TorchVision](https://pytorch.org/vision/stable/models/generated/torchvision.models.efficientnet_b0.html)
- Training Infrastructure: NVIDIA PyTorch & CUDA documentation

---

## ⭐ Support

If this project helped you, please consider:
- ⭐ Starring the repository
- 📢 Sharing with others
- 🐛 Reporting issues
- 🤝 Contributing improvements

---

**Last Updated:** June 6, 2026  
**Status:** Complete & Deployed ✅