import torch
import torch.nn as nn
from torchvision import models


class EfficientNetTransfer(nn.Module):
    """EfficientNet-B0 with custom classifier for brain tumor classification."""
    
    def __init__(self, num_classes=30, freeze_backbone=True, dropout=0.5):
        super(EfficientNetTransfer, self).__init__()
        
        # Load pretrained EfficientNet-B0
        self.backbone = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.IMAGENET1K_V1)
        
        # Freeze backbone if requested
        if freeze_backbone:
            for param in self.backbone.parameters():
                param.requires_grad = False
        
        # Get feature dimension from backbone
        in_features = self.backbone.classifier[1].in_features
        
        # Replace classifier
        self.backbone.classifier = nn.Sequential(
            nn.Dropout(dropout),
            nn.Linear(in_features, 256),
            nn.ReLU(inplace=True),
            nn.Dropout(dropout),
            nn.Linear(256, num_classes)
        )
    
    def forward(self, x):
        return self.backbone(x)


class ResNet50Transfer(nn.Module):
    """ResNet-50 with custom classifier for brain tumor classification."""
    
    def __init__(self, num_classes=30, freeze_backbone=True, dropout=0.5):
        super(ResNet50Transfer, self).__init__()
        
        # Load pretrained ResNet-50
        self.backbone = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V2)
        
        # Freeze backbone if requested
        if freeze_backbone:
            for param in self.backbone.parameters():
                param.requires_grad = False
        
        # Get feature dimension
        in_features = self.backbone.fc.in_features
        
        # Replace fc layer
        self.backbone.fc = nn.Sequential(
            nn.Dropout(dropout),
            nn.Linear(in_features, 512),
            nn.ReLU(inplace=True),
            nn.Dropout(dropout),
            nn.Linear(512, num_classes)
        )
    
    def forward(self, x):
        return self.backbone(x)


class MobileNetV3Transfer(nn.Module):
    """MobileNet-V3 Large with custom classifier for brain tumor classification."""
    
    def __init__(self, num_classes=30, freeze_backbone=True, dropout=0.5):
        super(MobileNetV3Transfer, self).__init__()
        
        # Load pretrained MobileNet-V3
        self.backbone = models.mobilenet_v3_large(weights=models.MobileNet_V3_Large_Weights.IMAGENET1K_V2)
        
        # Freeze backbone if requested
        if freeze_backbone:
            for param in self.backbone.parameters():
                param.requires_grad = False
        
        # Get feature dimension
        in_features = self.backbone.classifier[0].in_features
        
        # Replace classifier
        self.backbone.classifier = nn.Sequential(
            nn.Linear(in_features, 256),
            nn.ReLU(inplace=True),
            nn.Dropout(dropout),
            nn.Linear(256, num_classes)
        )
    
    def forward(self, x):
        return self.backbone(x)


if __name__ == "__main__":
    import torch
    
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    # Test EfficientNet
    model = EfficientNetTransfer(num_classes=30)
    model = model.to(device)
    
    x = torch.randn(4, 3, 224, 224).to(device)
    out = model(x)
    
    print(f"EfficientNet-B0")
    print(f"Input shape: {x.shape}")
    print(f"Output shape: {out.shape}")
    print(f"Parameters: {sum(p.numel() for p in model.parameters()):,}")
    print(f"Trainable parameters: {sum(p.numel() for p in model.parameters() if p.requires_grad):,}")