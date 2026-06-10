import pickle
import numpy as np
from PIL import Image
from pathlib import Path
import os

def unpickle(file):
    """Load CIFAR-100 pickle file."""
    with open(file, 'rb') as fo:
        dict_data = pickle.load(fo, encoding='bytes')
    return dict_data

def extract_cifar100(data_dir, output_dir):
    """
    Extract CIFAR-100 binary files to individual PNG images.
    
    CIFAR-100 format:
    - Each image is 3x32x32 (3 channels, 32x32 pixels)
    - Images are stored as flattened arrays in pickle files
    """
    
    data_dir = Path(data_dir)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Load metadata (class names)
    with open(data_dir / 'meta', 'rb') as f:
        meta = pickle.load(f, encoding='bytes')
    
    class_names = meta[b'fine_label_names']  # Fixed: was b'fine_meta'
    print(f"Found {len(class_names)} classes")
    
    # Process train and test splits
    for split in ['train', 'test']:
        print(f"\nExtracting {split} split...")
        
        file_path = data_dir / split
        data = unpickle(file_path)
        
        # Extract arrays
        images = data[b'data']  # Shape: (num_images, 3072)
        labels = data[b'fine_labels']  # Shape: (num_images,)
        
        print(f"  {len(images)} images")
        
        # Create class directories
        split_output = output_dir / split
        for class_idx, class_name in enumerate(class_names):
            class_dir = split_output / class_name.decode('utf-8')
            class_dir.mkdir(parents=True, exist_ok=True)
        
        # Convert each image
        for img_idx, (img_data, label) in enumerate(zip(images, labels)):
            if img_idx % 5000 == 0:
                print(f"  Processing image {img_idx}/{len(images)}...")
            
            # Reshape from (3072,) to (3, 32, 32)
            img_array = img_data.reshape(3, 32, 32)
            # Convert from CHW to HWC
            img_array = np.transpose(img_array, (1, 2, 0))
            # Convert to uint8
            img_array = img_array.astype(np.uint8)
            
            # Create PIL image
            img = Image.fromarray(img_array)
            # Upscale to 224x224 (for compatibility with our model)
            img = img.resize((224, 224), Image.LANCZOS)
            
            # Save
            class_name = class_names[label].decode('utf-8')
            class_dir = split_output / class_name
            img_path = class_dir / f"image_{img_idx:05d}.png"
            img.save(img_path)
        
        print(f"  ✓ {split} split extracted")
    
    print(f"\n✓ CIFAR-100 extraction complete!")
    print(f"Output directory: {output_dir}")
    print(f"Structure:")
    print(f"  {output_dir}/")
    print(f"  ├── train/")
    print(f"  │   ├── class_1/")
    print(f"  │   │   ├── image_00000.png")
    print(f"  │   │   └── ...")
    print(f"  │   └── class_100/")
    print(f"  └── test/")
    print(f"      ├── class_1/")
    print(f"      └── ...")

if __name__ == "__main__":
    # Paths
    CIFAR100_DIR = "data/cifar100_raw"  # Where you extracted the CIFAR-100 files
    OUTPUT_DIR = "data/non_mri"  # Where we'll save the images
    
    print("="*60)
    print("CIFAR-100 EXTRACTION")
    print("="*60)
    
    if not Path(CIFAR100_DIR).exists():
        print(f"Error: {CIFAR100_DIR} not found")
        print("Please extract CIFAR-100 data there first")
    else:
        extract_cifar100(CIFAR100_DIR, OUTPUT_DIR)