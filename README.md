# Brain Tumor MRI Classification & Web App

A complete end-to-end deep learning project for classifying brain tumors from MRI images across 30 different tumor types. Achieves **98.97% test accuracy** using a fine-tuned EfficientNet-B0 and is deployed as a full-stack web application.

## 🎯 Project Overview

This project demonstrates the complete ML lifecycle: from data exploration, baseline model development, and transfer learning, to building a production-ready REST API and a modern web interface.

**Key Achievements:**
- ✅ **Test Accuracy:** 98.97%
- ✅ **F1-Score (Macro):** 0.9898
- ✅ **Full-Stack Deployment:** Built with Next.js 16 and FastAPI.
- ✅ **Perfect Classification:** 12/30 tumor types (100% F1-score)
- ✅ **Model Size:** 4.2M parameters (efficient for deployment)

---

## 🛠️ Tech Stack

### Web Application
- **Frontend:** Next.js 16, React, Tailwind CSS v4, TypeScript, Lucide Icons
- **Backend:** FastAPI, Uvicorn, Python-Multipart
- **Deployment:** Vercel (Frontend), Hugging Face Docker Spaces (Backend)

### Machine Learning & Data Science
- **PyTorch (2.5.0) & TorchVision:** Deep learning framework
- **CUDA 12.4:** GPU acceleration
- **NumPy, Pandas, Scikit-learn:** Data manipulation & metrics
- **OpenCV, Matplotlib/Seaborn:** Image processing & visualization

---

## 🌐 Running the Web Application

The project includes a production-ready web interface to test the model locally.

### 1. Start the Backend (FastAPI)
The backend loads the PyTorch model and serves predictions via a REST API.
```bash
conda activate gridlock
cd backend
# Run the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
*Note: The backend will attempt to auto-download the model weights (`efficientnet_finetuned_best.pth`) from GitHub Releases on first startup if they are not found in the `backend/models/` directory.*

### 2. Start the Frontend (Next.js)
The frontend is a modern React application. Open a **new terminal**:
```bash
cd frontend
npm install
npm run dev
```
Navigate to **`http://localhost:3000`** in your browser to use the app.

---

## 🚀 100% Free Deployment

Because PyTorch requires significant RAM (~1GB+ to load the model), it cannot run on Vercel's serverless functions (250MB limit) or standard free VPS tiers (which typically only offer 512MB RAM). We use a hybrid approach:

1. **Frontend (Vercel):** Perfect for Next.js. Simply push to GitHub and import the `frontend` folder into Vercel. Add a `NEXT_PUBLIC_API_URL` environment variable pointing to your deployed backend.
2. **Backend (Hugging Face Spaces):** HF Spaces provide a **free 16GB RAM Docker container**. 
   - Create a free "Docker Blank" space on Hugging Face.
   - Upload the contents of the `backend/` folder (including the specialized `Dockerfile`).
   - Hugging Face will automatically build and run the FastAPI server securely on Port 7860.

---

## 📊 Dataset

**Brain Tumor MRI Images Dataset** (30 Classes)

| Metric | Value |
|--------|-------|
| **Total Images** | 22,600 |
| **Tumor Types** | 30 |
| **Image Resolution** | 512 × 512 (resized to 224 × 224) |
| **Train/Val/Test Split** | 70% / 15% / 15% |

Balanced across 30 classes with intentional class weighting to handle slight imbalances. Augmented with random horizontal flips, rotation (±15°), and color jitter during training.

---

## 🏗️ Model Architecture

### Fine-Tuned EfficientNet-B0 ⭐ **BEST**
- **Backbone:** EfficientNet-B0 (unfrozen, all parameters trainable)
- **Classifier:** Dropout(0.5) → Linear(1280→256) → ReLU → Dropout(0.5) → Linear(256→30)
- **Parameters:** 4.2M (all trainable)
- **Learning Rate:** 5e-5 (low for fine-tuning)
- **Optimizer:** Adam (weight_decay=1e-5)
- **Loss:** CrossEntropyLoss with class weights
- **Test Accuracy:** 98.97% ⭐

---

## 📈 Training Results

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
  ✓ Neurocytoma T1
  ✓ Normal T1C+
  ✓ Oligodendroglioma T2
  + 7 more...
```

---

## 📁 Project Structure

```text
brain-tumor-mri/
├── frontend/                   # Next.js Web Application
│   ├── app/                    # UI Pages (Home, Demo, Stats, About)
│   ├── components/             # React Components (UploadZone, StatsTable)
│   └── lib/api.ts              # API Client
│
├── backend/                    # FastAPI Server
│   ├── main.py                 # REST API Endpoints
│   ├── model.py                # PyTorch Inference Logic
│   ├── schemas.py              # Pydantic Types
│   └── Dockerfile              # Hugging Face deployment config
│
├── data/                       # Raw and processed MRI images
├── models/                     # Saved PyTorch .pth weights
├── results/                    # Confusion matrices and metrics
├── src/                        # ML Training source code (data loading, models)
└── notebooks/                  # Jupyter notebooks for EDA and training
```

---

## 🏃 ML Training & Setup

If you want to explore the data or train the model from scratch:

1. Clone repo and create environment:
```bash
conda create -n gridlock python=3.10
conda activate gridlock
pip install -r backend/requirements.txt
```

2. Train models using the Jupyter Notebooks:
```bash
jupyter notebook notebooks/04_fine_tuning.ipynb
```

### Download Pretrained Weights
Pretrained weights are available at GitHub Releases (if uploaded). Place the `.pth` file in `backend/models/efficientnet_finetuned_best.pth`.

---

## 🚀 Future Improvements

### Medium-term
- [ ] Implement Grad-CAM visualization in the web UI for explainability
- [ ] Add batch prediction capability
- [ ] Train ensemble of EfficientNet + ResNet + MobileNet
- [ ] Build mobile app version (React Native or Flutter)

### Long-term
- [ ] Test on real hospital datasets
- [ ] Integration with hospital PACS systems
- [ ] Clinical validation study