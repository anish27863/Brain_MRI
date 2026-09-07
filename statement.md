# Brain Tumor MRI Classification and Explainable Web Application

## 1. Problem Statement

Brain MRI interpretation is a specialized medical imaging task that requires substantial expertise and can be time-consuming when many images need to be reviewed. Different MRI sequences and tumor categories can also make automated classification challenging.

This project, **NeuroScan AI**, aims to provide an AI-assisted system that analyzes uploaded brain MRI images, first checks whether the input is a valid brain MRI image, and then classifies it into one of the supported tumor/sequence classes. The system also provides an explainability mechanism using Grad-CAM so that the user can visualize regions of the image that contributed to the model's prediction.

The project is intended as an **educational and research/demo system**, not as a clinical diagnostic tool. Its predictions should not be used as a substitute for evaluation by a qualified medical professional.

---

## 2. Project Scope

The project covers a staged medical image processing pipeline:

1. **Input validation** checks the uploaded file type and size.
2. A dedicated **brain-MRI out-of-distribution (OOD) detector** determines whether the image is sufficiently similar to a brain MRI input.
3. A fine-tuned **EfficientNet-B0 classifier** predicts one of the supported brain MRI classes.
4. **Grad-CAM** generates a visual explanation of the classifier's prediction.
5. A **FastAPI backend** exposes the inference functionality through HTTP endpoints.
6. A **Next.js web frontend** provides an interface for uploading images and viewing prediction results.

The classifier supports **30 classes** representing combinations of tumor/diagnostic categories and MRI sequences.

### Included in Scope

- Brain MRI image upload and validation
- Input rejection for unsupported/invalid images
- Brain MRI OOD detection
- 30-class brain MRI classification
- Prediction confidence/top-k results
- Grad-CAM visual explanations
- REST API for inference
- Web-based user interface
- Model and API health/status endpoints
- Evaluation using accuracy, macro F1, weighted F1, confusion matrix, and per-class metrics

### Outside the Current Scope

- Clinical diagnosis or treatment recommendation
- Direct integration with hospital/PACS systems
- Patient medical-record management
- Persistent patient data storage
- Automated treatment planning
- Real-time clinical decision making
- Replacement of radiologists or other medical professionals

---

## 3. Target Users

The system is primarily intended for:

- **Students and researchers** studying AI/ML for medical imaging
- **Developers** experimenting with computer vision and medical image classification
- **Educators** demonstrating transfer learning, OOD detection, and explainable AI
- **Researchers** evaluating staged medical-image inference pipelines

The application is not intended to be used independently by patients for medical diagnosis.

---

## 4. High-Level Features

### 4.1 Image Input and Validation

Users can upload an image through the web interface. The backend validates the uploaded file before inference.

- Supported image formats: JPEG and PNG
- Maximum upload size: 10 MB
- Invalid file types and oversized files are rejected
- Images are converted and preprocessed for model inference

### 4.2 Brain MRI OOD Detection

A dedicated MobileNetV3-Small based OOD detector is used before the main classifier.

Its purpose is to reduce inappropriate predictions when users upload images that are not brain MRI scans.

Examples of hard-negative/non-target images used for OOD training include:

- Spine MRI
- Chest X-ray
- Bone/extremity X-ray

If the input is rejected by the OOD gate, the system does not continue to the tumor classifier.

### 4.3 Brain MRI Classification

A fine-tuned **EfficientNet-B0** model performs the final 30-class classification.

The classification system combines diagnostic/tumor categories with MRI sequence information. Supported category groups include:

- Astrocytoma
- Ependymoma
- Glioma
- Hemangiopericytoma
- Meningioma
- Neurocytoma
- Normal
- Oligodendroglioma
- Other
- Schwannoma

These are represented across supported MRI sequences such as T1, T1C+, and T2.

### 4.4 Explainable AI

The application uses **Grad-CAM** to generate a visual explanation for a prediction.

The generated heatmap highlights image regions that had greater influence on the classifier's decision, helping users understand the model output rather than receiving only a class label.

### 4.5 Web Application

The frontend is implemented using:

- Next.js
- React
- TypeScript
- Tailwind CSS

The application provides pages/interfaces for the main application, demonstration, statistics, and project information.

### 4.6 REST API

The FastAPI backend provides endpoints for:

- Prediction
- Prediction with Grad-CAM
- Health checking
- Model information

The API acts as the service boundary between the web frontend and the trained machine-learning models.

---

## 5. Technology Stack

### Machine Learning

- Python
- PyTorch
- Torchvision
- EfficientNet-B0
- MobileNetV3-Small
- Scikit-learn
- OpenCV/Pillow
- Grad-CAM based explainability

### Backend

- FastAPI
- Uvicorn
- Python

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Development and Version Control

- Git
- GitHub

---

## 6. Dataset and Model Overview

The project uses a brain MRI dataset containing approximately **22,600 images across 30 classes**.

The dataset pipeline uses a stratified:

- 70% training split
- 15% validation split
- 15% test split

Training images use augmentation such as horizontal flipping, rotation, and color jitter. Images are resized to **224 × 224 pixels** and normalized using ImageNet normalization statistics.

The primary classifier is a fine-tuned EfficientNet-B0 model with a custom classification head for the 30 output classes.

The OOD detector uses a MobileNetV3-Small architecture with a binary classification head.

---

## 7. Expected System Output

For a valid brain MRI input, the system produces:

- Predicted class
- Prediction confidence
- Top-k class probabilities where applicable
- Grad-CAM explanation when requested

For an image that fails the OOD check, the system returns an appropriate rejection response instead of forwarding the image to the tumor classifier.

For invalid uploads, the API returns an error describing the input validation failure.

---

## 8. Project Objective

The main objective is to demonstrate how multiple machine-learning components can be combined into a practical, staged medical-image analysis application.

The project specifically demonstrates:

- Transfer learning for medical image classification
- Multi-stage model routing
- Out-of-distribution detection
- Explainable AI
- REST API based ML inference
- Web-based model deployment architecture
- Modular software engineering for an ML application

---

## 9. Disclaimer

**NeuroScan AI is an academic/research demonstration project. It is not a certified medical device and is not intended to provide medical diagnosis, treatment recommendations, or other clinical decisions. Model predictions may be incorrect or unreliable for images outside the training distribution. All medical decisions must be made by qualified healthcare professionals using appropriate clinical information.**
