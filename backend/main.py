from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import torch
import os
import urllib.request

from model import load_model, predict, CLASS_NAMES

# ---------------------------------------------------------------------------
# Global state
# ---------------------------------------------------------------------------
ml_model = None
device = "cuda" if torch.cuda.is_available() else "cpu"

MODEL_URL = (
    "https://github.com/anish27863/brain-tumor-mri/releases/download/v1.0/"
    "efficientnet_finetuned_best.pth"
)


def _ensure_weights(weights_path: str) -> None:
    """Download model weights if not present locally."""
    if not os.path.exists(weights_path):
        print(f"[startup] Model weights not found at '{weights_path}'. Downloading...")
        os.makedirs(os.path.dirname(weights_path), exist_ok=True)
        try:
            urllib.request.urlretrieve(MODEL_URL, weights_path)
            print("[startup] Model weights downloaded successfully.")
        except Exception as e:
            print(f"[startup] WARNING: Could not download model weights: {e}")
            print("[startup] Place weights manually at:", weights_path)


# ---------------------------------------------------------------------------
# Lifespan (startup / shutdown)
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    global ml_model
    weights_path = os.getenv("MODEL_PATH", "models/efficientnet_finetuned_best.pth")
    _ensure_weights(weights_path)

    if os.path.exists(weights_path):
        print(f"[startup] Loading model from '{weights_path}' on {device} ...")
        ml_model = load_model(weights_path, device)
        print("[startup] Model loaded successfully!")
    else:
        print("[startup] Model weights unavailable — /predict will return 503.")

    yield

    # Cleanup
    del ml_model


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="NeuroScan AI",
    description="Brain Tumor MRI Classification API — EfficientNet-B0, 98.97% accuracy, 30 classes.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow Next.js dev & production
# In development, ALLOW_ALL_ORIGINS=true skips the origin whitelist entirely
_allow_all = os.getenv("ALLOW_ALL_ORIGINS", "true").lower() == "true"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if _allow_all else [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://your-app.vercel.app",     # ← replace with your Vercel URL
    ],
    allow_credentials=not _allow_all,      # credentials require explicit origins
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "NeuroScan AI API is running"}


@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "healthy",
        "model_loaded": ml_model is not None,
        "device": device,
    }


@app.post("/predict", tags=["Inference"])
async def predict_tumor(file: UploadFile = File(...)):
    """
    Upload an MRI image and receive top-5 tumor classification predictions.

    - **Accepts:** JPEG, PNG
    - **Max size:** 10 MB
    - **Returns:** Top-5 predictions with class names and confidence scores (%)
    """
    if ml_model is None:
        raise HTTPException(
            status_code=503,
            detail="Model is not loaded yet. Please wait a moment and try again.",
        )

    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only JPEG and PNG images are supported.",
        )

    image_bytes = await file.read()

    if len(image_bytes) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File too large. Maximum allowed size is 10 MB.",
        )

    try:
        predictions = predict(ml_model, image_bytes, device, top_k=5)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}",
        )

    return {
        "predictions": predictions,
        "top_prediction": predictions[0],
        "disclaimer": (
            "NeuroScan AI is a research demonstration project built for educational "
            "purposes. It is NOT a medical device and should NOT be used for clinical "
            "diagnosis, medical decision-making, or patient care. Always consult a "
            "qualified radiologist or medical professional for actual diagnosis."
        ),
    }


@app.get("/model-info", tags=["Model"])
def model_info():
    """Return model architecture and training statistics."""
    return {
        "model_name": "EfficientNet-B0 (Fine-tuned)",
        "num_classes": 30,
        "test_accuracy": 98.97,
        "f1_macro": 0.9898,
        "f1_weighted": 0.9897,
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
            "hardware": "NVIDIA RTX 4050 (6 GB VRAM)",
        },
    }


@app.get("/class-stats", tags=["Model"])
def class_stats():
    """Return per-class precision, recall, and F1-score for all 30 classes."""
    return {
        "class_performance": [
            {"class_name": "Astrocytoma T1",         "f1_score": 0.9917, "precision": 0.9835, "recall": 1.0000},
            {"class_name": "Astrocytoma T1C+",        "f1_score": 0.9924, "precision": 0.9924, "recall": 0.9924},
            {"class_name": "Astrocytoma T2",          "f1_score": 0.9884, "precision": 0.9770, "recall": 1.0000},
            {"class_name": "Ependymoma T1",           "f1_score": 0.9519, "precision": 0.9570, "recall": 0.9468},
            {"class_name": "Ependymoma T1C+",         "f1_score": 0.9956, "precision": 0.9912, "recall": 1.0000},
            {"class_name": "Ependymoma T2",           "f1_score": 0.9372, "precision": 0.9510, "recall": 0.9238},
            {"class_name": "Glioma T1",               "f1_score": 0.9871, "precision": 1.0000, "recall": 0.9745},
            {"class_name": "Glioma T1C+",             "f1_score": 1.0000, "precision": 1.0000, "recall": 1.0000},
            {"class_name": "Glioma T2",               "f1_score": 0.9918, "precision": 0.9837, "recall": 1.0000},
            {"class_name": "Hemangiopericytoma T1",   "f1_score": 1.0000, "precision": 1.0000, "recall": 1.0000},
            {"class_name": "Hemangiopericytoma T1C+", "f1_score": 1.0000, "precision": 1.0000, "recall": 1.0000},
            {"class_name": "Hemangiopericytoma T2",   "f1_score": 1.0000, "precision": 1.0000, "recall": 1.0000},
            {"class_name": "Meningioma T1",           "f1_score": 0.9974, "precision": 0.9948, "recall": 1.0000},
            {"class_name": "Meningioma T1C+",         "f1_score": 0.9966, "precision": 0.9966, "recall": 0.9966},
            {"class_name": "Meningioma T2",           "f1_score": 0.9815, "precision": 1.0000, "recall": 0.9638},
            {"class_name": "Neurocytoma T1",          "f1_score": 1.0000, "precision": 1.0000, "recall": 1.0000},
            {"class_name": "Neurocytoma T1C+",        "f1_score": 1.0000, "precision": 1.0000, "recall": 1.0000},
            {"class_name": "Neurocytoma T2",          "f1_score": 1.0000, "precision": 1.0000, "recall": 1.0000},
            {"class_name": "Normal T1",               "f1_score": 0.9919, "precision": 1.0000, "recall": 0.9839},
            {"class_name": "Normal T1C+",             "f1_score": 1.0000, "precision": 1.0000, "recall": 1.0000},
            {"class_name": "Normal T2",               "f1_score": 0.9741, "precision": 0.9496, "recall": 1.0000},
            {"class_name": "Oligodendroglioma T1",    "f1_score": 1.0000, "precision": 1.0000, "recall": 1.0000},
            {"class_name": "Oligodendroglioma T1C+",  "f1_score": 0.9912, "precision": 1.0000, "recall": 0.9825},
            {"class_name": "Oligodendroglioma T2",    "f1_score": 1.0000, "precision": 1.0000, "recall": 1.0000},
            {"class_name": "Other T1",                "f1_score": 0.9714, "precision": 0.9754, "recall": 0.9675},
            {"class_name": "Other T1C+",              "f1_score": 0.9978, "precision": 1.0000, "recall": 0.9956},
            {"class_name": "Other T2",                "f1_score": 0.9864, "precision": 0.9732, "recall": 1.0000},
            {"class_name": "Schwannoma T1",           "f1_score": 0.9909, "precision": 0.9820, "recall": 1.0000},
            {"class_name": "Schwannoma T1C+",         "f1_score": 0.9912, "precision": 0.9882, "recall": 0.9941},
            {"class_name": "Schwannoma T2",           "f1_score": 0.9890, "precision": 1.0000, "recall": 0.9783},
        ]
    }
