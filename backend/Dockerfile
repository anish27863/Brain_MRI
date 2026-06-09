# Use official Python lightweight image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install dependencies
# We install PyTorch CPU version to save space and memory, since VPS/cloud deployments usually don't have GPUs
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Copy requirements and install remaining deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose the port
EXPOSE 8000

# Run the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
