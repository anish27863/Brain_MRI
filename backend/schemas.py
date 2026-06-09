from pydantic import BaseModel
from typing import List


class Prediction(BaseModel):
    class_name: str
    class_index: int
    confidence: float


class PredictionResponse(BaseModel):
    predictions: List[Prediction]
    top_prediction: Prediction
    disclaimer: str
