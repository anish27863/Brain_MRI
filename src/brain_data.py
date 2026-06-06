import os
from pathlib import Path
import torch
from torch.utils.data import Dataset, DataLoader
from PIL import Image
import numpy as np
import pandas as pd
from torchvision import transforms
from sklearn.model_selection import train_test_split


class BrainTumorDataset(Dataset):
    """Brain tumor MRI dataset loader with proper Windows path handling."""
    
    def __init__(self, image_paths, labels, class_names, transform=None):
        """
        Args:
            image_paths: List of image file paths
            labels: List of class indices
            class_names: List of class names
            transform: torchvision transforms
        """
        self.image_paths = image_paths
        self.labels = labels
        self.class_names = class_names
        self.transform = transform
    
    def __len__(self):
        return len(self.image_paths)
    
    def __getitem__(self, idx):
        img_path = Path(self.image_paths[idx])
        
        try:
            image = Image.open(img_path).convert('RGB')
        except Exception as e:
            print(f"Error loading {img_path}: {e}")
            raise
        
        label = self.labels[idx]
        
        if self.transform:
            image = self.transform(image)
        else:
            image = transforms.ToTensor()(image)
        
        return image, label


def prepare_data_loaders(data_dir, batch_size=32, img_size=224, val_size=0.15, test_size=0.15, random_seed=42):
    """
    Create train, val, test dataloaders with proper splitting and class weighting.
    
    Args:
        data_dir: Path to data/raw folder (relative or absolute)
        batch_size: Batch size for training
        img_size: Image size for resizing
        val_size: Fraction of data for validation
        test_size: Fraction of data for testing
        random_seed: For reproducibility
    
    Returns:
        train_loader, val_loader, test_loader, class_weights, dataset_info
    """
    
    data_dir = Path(data_dir)
    
    if not data_dir.exists():
        raise FileNotFoundError(f"Data directory not found: {data_dir.absolute()}")
    
    np.random.seed(random_seed)
    torch.manual_seed(random_seed)
    
    # Collect all images and labels
    all_image_paths = []
    all_labels = []
    class_names = sorted([d.name for d in data_dir.iterdir() if d.is_dir()])
    
    print(f"Found {len(class_names)} classes")
    print("="*60)
    
    for class_idx, class_name in enumerate(class_names):
        class_dir = data_dir / class_name
        image_files = sorted(list(class_dir.glob('*.jpg')) + list(class_dir.glob('*.JPG')) + list(class_dir.glob('*.png')))
        
        for img_path in image_files:
            all_image_paths.append(str(img_path))  # Store as string
            all_labels.append(class_idx)
        
        print(f"{class_name:30s} | {len(image_files):4d} images")
    
    print("="*60)
    all_labels = np.array(all_labels)
    
    # First split: train vs (val + test)
    train_paths, temp_paths, train_labels, temp_labels = train_test_split(
        all_image_paths, all_labels, 
        test_size=(val_size + test_size), 
        random_state=random_seed, 
        stratify=all_labels
    )
    
    # Second split: val vs test
    val_paths, test_paths, val_labels, test_labels = train_test_split(
        temp_paths, temp_labels,
        test_size=test_size / (val_size + test_size),
        random_state=random_seed,
        stratify=temp_labels
    )
    
    print(f"\nTrain: {len(train_paths)} | Val: {len(val_paths)} | Test: {len(test_paths)}")
    print("="*60)
    
    # Define transforms
    train_transform = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(degrees=15),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                           std=[0.229, 0.224, 0.225])
    ])
    
    val_test_transform = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                           std=[0.229, 0.224, 0.225])
    ])
    
    # Create datasets
    train_dataset = BrainTumorDataset(train_paths, train_labels, class_names, train_transform)
    val_dataset = BrainTumorDataset(val_paths, val_labels, class_names, val_test_transform)
    test_dataset = BrainTumorDataset(test_paths, test_labels, class_names, val_test_transform)
    
    # Calculate class weights (to handle imbalance)
    unique, counts = np.unique(train_labels, return_counts=True)
    class_weights = torch.tensor(1.0 / counts, dtype=torch.float32)
    class_weights = class_weights / class_weights.sum() * len(class_weights)
    
    print(f"Class weights (for loss function):")
    for i, w in enumerate(class_weights):
        print(f"  {class_names[i]:30s}: {w:.4f}")
    print("="*60)
    
    # Create dataloaders
    train_loader = DataLoader(
        train_dataset, 
        batch_size=batch_size, 
        shuffle=True, 
        num_workers=0,  # Windows requirement
        pin_memory=True
    )
    
    val_loader = DataLoader(
        val_dataset, 
        batch_size=batch_size, 
        shuffle=False, 
        num_workers=0,
        pin_memory=True
    )
    
    test_loader = DataLoader(
        test_dataset, 
        batch_size=batch_size, 
        shuffle=False, 
        num_workers=0,
        pin_memory=True
    )
    
    dataset_info = {
        'num_classes': len(class_names),
        'class_names': class_names,
        'train_size': len(train_dataset),
        'val_size': len(val_dataset),
        'test_size': len(test_dataset),
        'img_size': img_size,
    }
    
    return train_loader, val_loader, test_loader, class_weights, dataset_info