# Brain Tumor MRI Classification & Web App

A complete end-to-end deep learning project for classifying brain tumors from MRI images across 30 different tumor types. Achieves **98.97% test accuracy** using a fine-tuned EfficientNet-B0, guards against non-brain-MRI uploads with a purpose-built out-of-distribution detector, and is deployed as a full-stack web application with Grad-CAM explainability.

## 🎯 Project Overview

This project demonstrates the complete ML lifecycle: from data exploration, baseline model development, and transfer learning, to building a production-ready REST API and a modern web interface — including the unglamorous but critical work of hardening the system against real-world misuse (e.g., users uploading spine MRIs or chest X-rays instead of brain scans).

**Key Achievements:**
- ✅ **Test Accuracy:** 98.97%
- ✅ **F1-Score (Macro):** 0.9898
- ✅ **Out-of-Distribution Detection:** Rejects non-brain-MRI images (spine MRI, chest X-ray, bone X-ray) with >99% separation
- ✅ **Explainability:** Grad-CAM visualizations show what the model is "looking at" for both OOD validation and tumor classification
- ✅ **Full-Stack Deployment:** Built with Next.js 16 and FastAPI
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
- **OpenCV (headless), Matplotlib/Seaborn:** Image processing, Grad-CAM overlays & visualization

---

## 🛡️ Out-of-Distribution (OOD) Detection

Early versions of the tumor classifier would confidently misclassify **any** medical image handed to it — including spine MRIs — since it was never trained to reject inputs outside its domain. To fix this, a separate binary classifier sits in front of the tumor model:

- **Architecture:** MobileNetV3-Small binary classifier (brain MRI vs. not)
- **Training data (v2):** Brain MRI (positive) vs. **hard negatives** — spine MRI, chest X-ray, and bone/extremity X-ray datasets (negative). Using visually similar medical images as negatives (rather than random photos) forces the model to learn real anatomical features instead of a trivial "grayscale vs. color" shortcut.
- **Result:** Brain MRI confidence ~100%, spine MRI ~0.05%, chest X-ray ~0.00%, bone X-ray ~0.00% — >99.9% separation
- **Pipeline:** Every upload passes through the OOD gate before reaching the tumor classifier; rejected images return a `422` with the model's confidence score instead of a fabricated tumor prediction

---

## 🔍 Grad-CAM Explainability

The web app generates Grad-CAM (Gradient-weighted Class Activation Mapping) heatmaps for every accepted upload, exposing two views:

- **MRI Check:** Highlights the regions the OOD detector used to confirm the image is a brain MRI
- **Tumor Focus:** Highlights the regions the classifier used to reach its tumor prediction

This turns both models from black boxes into something a user (or reviewer) can sanity-check visually, directly in the results panel.

---

## 🌐 Running the Web Application

The project includes a production-ready web interface to test the model locally.

### 1. Start the Backend (FastAPI)
The backend loads the PyTorch models (tumor classifier + OOD detector) and serves predictions via a REST API.
```bash
conda activate gridlock
cd backend
# Run the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
*Note: The backend will attempt to auto-download the model weights (`efficientnet_finetuned_best.pth`, `ood_detector.pth`) from GitHub Releases on first startup if they are not found in the `backend/models/` directory.*

**Available endpoints:**
- `POST /predict` — tumor classification only
- `POST /predict-with-gradcam` — tumor classification + Grad-CAM visualizations
- `GET /health` — model load status
- `GET /model-info`, `GET /class-stats` — model metadata

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

Because PyTorch requires significant RAM (~1GB+ to load the models), it cannot run on Vercel's serverless functions (250MB limit) or standard free VPS tiers (which typically only offer 512MB RAM). We use a hybrid approach:

1. **Frontend (Vercel):** Perfect for Next.js. Simply push to GitHub and import the `frontend` folder into Vercel. Add a `NEXT_PUBLIC_API_URL` environment variable pointing to your deployed backend.
2. **Backend (Hugging Face Spaces):** HF Spaces provide a **free 16GB RAM Docker container**.
   - Create a free "Docker Blank" space on Hugging Face.
   - Upload the contents of the `backend/` folder (including the specialized `Dockerfile`).
   - Include a `packages.txt` at the Space root with `libgl1` and `libglib2.0-0` — required by OpenCV for Grad-CAM overlay generation; without it the container fails on startup with a `libGL.so.1` import error.
   - Hugging Face will automatically build and run the FastAPI server securely on Port 7860.

**Note on concurrency:** Grad-CAM generation uses forward/backward hooks on shared model instances, which are not safe under concurrent requests. The backend serializes Grad-CAM calls with a `threading.Lock` to prevent race conditions between simultaneous uploads.

---

## 📊 Dataset

**Brain Tumor MRI Images Dataset** (30 Classes) — used to train the tumor classifier.

| Metric | Value |
|--------|-------|
| **Total Images** | 22,600 |
| **Tumor Types** | 30 |
| **Image Resolution** | 512 × 512 (resized to 224 × 224) |
| **Train/Val/Test Split** | 70% / 15% / 15% |

Balanced across 30 classes with intentional class weighting to handle slight imbalances. Augmented with random horizontal flips, rotation (±15°), and color jitter during training.

**Hard Negatives Dataset** — used to train the OOD detector alongside the brain MRI set above:
- Spine MRI (lumbar/cervical)
- Chest X-ray (COVID-19, pneumonia, normal)
- Bone/extremity X-ray (MURA-style musculoskeletal radiographs)

---

## 🏗️ Model Architecture

### Fine-Tuned EfficientNet-B0 (Tumor Classifier) ⭐ **BEST**
- **Backbone:** EfficientNet-B0 (unfrozen, all parameters trainable)
- **Classifier:** Dropout(0.5) → Linear(1280→256) → ReLU → Dropout(0.5) → Linear(256→30)
- **Parameters:** 4.2M (all trainable)
- **Learning Rate:** 5e-5 (low for fine-tuning)
- **Optimizer:** Adam (weight_decay=1e-5)
- **Loss:** CrossEntropyLoss with class weights
- **Test Accuracy:** 98.97% ⭐

### MobileNetV3-Small (OOD Detector, v2)
- **Backbone:** MobileNetV3-Small (ImageNet pretrained)
- **Classifier:** Linear(1024→64) → ReLU → Dropout(0.3) → Linear(64→1)
- **Task:** Binary — brain MRI vs. hard negatives
- **Loss:** BCEWithLogitsLoss
- **Val Accuracy:** 100% (legitimate separation task — see OOD Detection section above)
- **Brain vs. Spine MRI Separation:** 99.95%

---

## 📈 Training Results

| Model | Training Time | Val Acc | Test Acc | Epochs | LR |
|-------|---------------|---------|----------|--------|-----|
| Baseline CNN | 68:38 | 34.34% | - | 30 | 1e-3 |
| EfficientNet (Frozen) | 45:03 | 57.82% | - | 20 | 1e-4 |
| EfficientNet (Fine-tuned) | ~50:00 | 98.88% | **98.97%** | 30 | 5e-5 |
| OOD Detector v1 (CIFAR-100 negatives) | ~20:00 | 100%* | - | 20 | 1e-4 |
| OOD Detector v2 (hard negatives) | ~25:00 | 100% | - | 20 | 1e-4 |

*v1 hit 100% val accuracy on an easy task (grayscale medical vs. colorful natural images) and failed in production on spine MRIs — see OOD Detection section for the fix.*

### Final Test Set Performance (Tumor Classifier)
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

### OOD Detector v2 Diagnostic
```
Brain MRI confidence:     100.00%
Spine MRI confidence:       0.05%   ✅ rejected
Chest X-ray confidence:     0.00%   ✅ rejected
Bone X-ray confidence:      0.00%   ✅ rejected
Brain vs. Spine separation: 99.95%
```

---

## 📁 Project Structure

```text
brain-tumor-mri/
├── frontend/                   # Next.js Web Application
│   ├── app/                    # UI Pages (Home, Demo, Stats, About)
│   ├── components/             # React Components (UploadZone, PredictionResults, StatsTable)
│   └── lib/api.ts              # API Client
│
├── backend/                    # FastAPI Server
│   ├── main.py                 # REST API Endpoints (/predict, /predict-with-gradcam, /health)
│   ├── model.py                # PyTorch tumor classifier inference logic
│   ├── ood_detector.py         # OOD detector model + inference logic
│   ├── grad_cam.py             # Grad-CAM implementation & heatmap overlay
│   ├── schemas.py              # Pydantic Types
│   ├── packages.txt            # System-level apt deps for Hugging Face (libgl1, libglib2.0-0)
│   └── Dockerfile              # Hugging Face deployment config
│
├── data/
│   ├── raw/                    # Brain MRI images (30 classes)
│   └── hard_negatives/         # Spine MRI, chest X-ray, bone X-ray (OOD training)
├── models/                     # Saved PyTorch .pth weights (tumor classifier + OOD detector)
├── results/                    # Confusion matrices, training curves, diagnostic reports
├── src/                        # ML Training source code (data loading, models)
└── notebooks/                  # Jupyter notebooks for EDA and training
    └── 06_train_ood_detector.ipynb  # OOD detector training (hard negatives)
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

2. Train the tumor classifier:
```bash
jupyter notebook notebooks/04_fine_tuning.ipynb
```

3. Train the OOD detector (requires `data/hard_negatives/` populated first):
```bash
jupyter notebook notebooks/06_train_ood_detector.ipynb
```

### Download Pretrained Weights
Pretrained weights are available at GitHub Releases (if uploaded). Place the `.pth` files in `backend/models/efficientnet_finetuned_best.pth` and `backend/models/ood_detector.pth`.

---

## 🚀 Future Improvements

### Medium-term
- [ ] Add batch prediction capability
- [ ] Train ensemble of EfficientNet + ResNet + MobileNet
- [ ] Build mobile app version (React Native or Flutter)
- [ ] Expand hard-negative set (ultrasound, CT scans of other body parts)

### Long-term
- [ ] Test on real hospital datasets
- [ ] Integration with hospital PACS systems
- [ ] Clinical validation study