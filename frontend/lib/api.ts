const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Prediction {
  class_name: string;
  class_index: number;
  confidence: number;
}

export interface PredictionResponse {
  predictions: Prediction[];
  top_prediction: Prediction;
  disclaimer: string;
}

export interface ClassPerformance {
  class_name: string;
  f1_score: number;
  precision: number;
  recall: number;
}

export interface ModelInfo {
  model_name: string;
  num_classes: number;
  test_accuracy: number;
  f1_macro: number;
  f1_weighted: number;
  training_images: number;
  validation_images: number;
  test_images: number;
  total_images: number;
  image_size: number;
  parameters: number;
  classes: string[];
  training_details: {
    optimizer: string;
    learning_rate: number;
    epochs: number;
    batch_size: number;
    hardware: string;
  };
}


export async function predictTumor(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    
    // Handle OOD detection error
    if (error.detail?.error === "NOT_BRAIN_MRI") {
      throw new Error(JSON.stringify({
        type: "NOT_BRAIN_MRI",
        message: error.detail.message,
        mri_confidence: error.detail.mri_confidence
      }));
    }
    
    throw new Error(error.detail || "Prediction failed");
  }

  return response.json();
}

export async function getModelInfo(): Promise<ModelInfo> {
  const response = await fetch(`${API_BASE}/model-info`);
  if (!response.ok) throw new Error("Failed to fetch model info");
  return response.json();
}

export async function getClassStats(): Promise<{ class_performance: ClassPerformance[] }> {
  const response = await fetch(`${API_BASE}/class-stats`);
  if (!response.ok) throw new Error("Failed to fetch class stats");
  return response.json();
}

export async function checkHealth(): Promise<{ status: string; model_loaded: boolean; device: string }> {
  const response = await fetch(`${API_BASE}/health`);
  if (!response.ok) throw new Error("Health check failed");
  return response.json();
}

