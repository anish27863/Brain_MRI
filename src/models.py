import torch
import torch.nn as nn


class BaselineCNN(nn.Module):
    """
    Simple CNN baseline for brain tumor classification.
    4 conv blocks + 2 FC layers.
    """
    
    def __init__(self, num_classes=30, dropout=0.5):
        super(BaselineCNN, self).__init__()
        
        self.features = nn.Sequential(
            # Block 1
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),
            nn.Dropout2d(0.25),
            
            # Block 2
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),
            nn.Dropout2d(0.25),
            
            # Block 3
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),
            nn.Dropout2d(0.25),
            
            # Block 4
            nn.Conv2d(128, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),
            nn.Dropout2d(0.25),
            
            # Global average pooling
            nn.AdaptiveAvgPool2d((1, 1))
        )
        
        self.classifier = nn.Sequential(
            nn.Linear(256, 128),
            nn.ReLU(inplace=True),
            nn.Dropout(dropout),
            nn.Linear(128, num_classes)
        )
    
    def forward(self, x):
        x = self.features(x)
        x = x.view(x.size(0), -1)
        x = self.classifier(x)
        return x


class TransferLearningModel(nn.Module):
    """
    Transfer learning wrapper for pretrained backbones.
    Replaces final layer with custom classifier.
    """
    
    def __init__(self, backbone, num_classes=30, freeze_backbone=True, dropout=0.5):
        """
        Args:
            backbone: Pretrained torchvision model
            num_classes: Number of output classes
            freeze_backbone: Whether to freeze backbone weights
            dropout: Dropout rate for classifier
        """
        super(TransferLearningModel, self).__init__()
        
        self.backbone = backbone
        
        # Freeze backbone if requested
        if freeze_backbone:
            for param in self.backbone.parameters():
                param.requires_grad = False
        
        # Get the input size of the final layer
        if hasattr(backbone, 'fc'):
            in_features = backbone.fc.in_features
            self.backbone.fc = nn.Identity()  # Remove original fc layer
        elif hasattr(backbone, 'classifier'):
            in_features = backbone.classifier[-1].in_features
            self.backbone.classifier = nn.Identity()
        else:
            raise ValueError("Model architecture not recognized")
        
        # Custom classifier
        self.classifier = nn.Sequential(
            nn.Dropout(dropout),
            nn.Linear(in_features, 256),
            nn.ReLU(inplace=True),
            nn.Dropout(dropout),
            nn.Linear(256, num_classes)
        )
    
    def forward(self, x):
        x = self.backbone(x)
        if x.dim() > 2:
            x = x.view(x.size(0), -1)
        x = self.classifier(x)
        return x


if __name__ == "__main__":
    # Test baseline model
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    model = BaselineCNN(num_classes=30)
    model = model.to(device)
    
    # Dummy input
    x = torch.randn(4, 3, 224, 224).to(device)
    out = model(x)
    
    print(f"Input shape: {x.shape}")
    print(f"Output shape: {out.shape}")
    print(f"Model parameters: {sum(p.numel() for p in model.parameters()):,}")