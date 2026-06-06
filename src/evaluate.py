import torch
import torch.nn as nn
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score, f1_score
import numpy as np
import pandas as pd
from pathlib import Path
import matplotlib.pyplot as plt
import seaborn as sns
from tqdm import tqdm
import sys

sys.path.insert(0, str(Path("../src").resolve()))

from brain_data import prepare_data_loaders


def evaluate_model(model, test_loader, device, class_names):
    """
    Evaluate model on test set and compute metrics.
    
    Args:
        model: PyTorch model
        test_loader: Test dataloader
        device: torch device
        class_names: List of class names
    
    Returns:
        Dictionary with metrics and predictions
    """
    model.eval()
    all_preds = []
    all_labels = []
    
    with torch.no_grad():
        pbar = tqdm(test_loader, desc="Evaluating", leave=True)
        for images, labels in pbar:
            images = images.to(device)
            labels = labels.to(device)
            
            outputs = model(images)
            _, predicted = torch.max(outputs, 1)
            
            all_preds.extend(predicted.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
    
    all_preds = np.array(all_preds)
    all_labels = np.array(all_labels)
    
    # Overall metrics
    accuracy = accuracy_score(all_labels, all_preds)
    f1_macro = f1_score(all_labels, all_preds, average='macro')
    f1_weighted = f1_score(all_labels, all_preds, average='weighted')
    
    print(f"\n{'='*60}")
    print("TEST SET EVALUATION")
    print(f"{'='*60}")
    print(f"Overall Accuracy: {accuracy*100:.2f}%")
    print(f"F1-Score (Macro): {f1_macro:.4f}")
    print(f"F1-Score (Weighted): {f1_weighted:.4f}")
    
    # Per-class metrics
    print(f"\n{'='*60}")
    print("PER-CLASS METRICS")
    print(f"{'='*60}")
    
    class_report = classification_report(
        all_labels, all_preds, 
        target_names=class_names,
        digits=4,
        output_dict=True
    )
    
    print(classification_report(
        all_labels, all_preds,
        target_names=class_names,
        digits=4
    ))
    
    # Confusion matrix
    cm = confusion_matrix(all_labels, all_preds)
    
    return {
        'accuracy': accuracy,
        'f1_macro': f1_macro,
        'f1_weighted': f1_weighted,
        'predictions': all_preds,
        'labels': all_labels,
        'confusion_matrix': cm,
        'class_report': class_report,
        'class_names': class_names
    }


def plot_confusion_matrix(eval_results, save_path="../results/confusion_matrix.png"):
    """Plot and save confusion matrix."""
    cm = eval_results['confusion_matrix']
    class_names = eval_results['class_names']
    
    plt.figure(figsize=(16, 14))
    sns.heatmap(cm, 
                annot=True, 
                fmt='d', 
                cmap='Blues',
                xticklabels=class_names,
                yticklabels=class_names,
                cbar_kws={'label': 'Count'})
    plt.xlabel('Predicted')
    plt.ylabel('True')
    plt.title('Confusion Matrix - Brain Tumor Classification')
    plt.xticks(rotation=45, ha='right')
    plt.yticks(rotation=0)
    plt.tight_layout()
    
    Path(save_path).parent.mkdir(parents=True, exist_ok=True)
    plt.savefig(save_path, dpi=150, bbox_inches='tight')
    print(f"\n✓ Confusion matrix saved: {save_path}")
    plt.close()


def plot_per_class_metrics(eval_results, save_path="../results/per_class_metrics.png"):
    """Plot per-class precision, recall, F1-score."""
    report = eval_results['class_report']
    class_names = eval_results['class_names']
    
    # Extract metrics
    precisions = [report[cn]['precision'] for cn in class_names]
    recalls = [report[cn]['recall'] for cn in class_names]
    f1_scores = [report[cn]['f1-score'] for cn in class_names]
    
    df = pd.DataFrame({
        'Class': class_names,
        'Precision': precisions,
        'Recall': recalls,
        'F1-Score': f1_scores
    })
    
    # Sort by F1-score
    df = df.sort_values('F1-Score')
    
    fig, ax = plt.subplots(figsize=(12, 10))
    x = np.arange(len(df))
    width = 0.25
    
    ax.barh(x - width, df['Precision'], width, label='Precision', alpha=0.8)
    ax.barh(x, df['Recall'], width, label='Recall', alpha=0.8)
    ax.barh(x + width, df['F1-Score'], width, label='F1-Score', alpha=0.8)
    
    ax.set_yticks(x)
    ax.set_yticklabels(df['Class'], fontsize=9)
    ax.set_xlabel('Score')
    ax.set_title('Per-Class Performance Metrics')
    ax.legend()
    ax.grid(axis='x', alpha=0.3)
    
    plt.tight_layout()
    Path(save_path).parent.mkdir(parents=True, exist_ok=True)
    plt.savefig(save_path, dpi=150, bbox_inches='tight')
    print(f"✓ Per-class metrics plot saved: {save_path}")
    plt.close()


def save_evaluation_report(eval_results, save_path="../results/evaluation_report.txt"):
    """Save detailed evaluation report to text file."""
    Path(save_path).parent.mkdir(parents=True, exist_ok=True)
    
    with open(save_path, 'w') as f:
        f.write("="*60 + "\n")
        f.write("BRAIN TUMOR MRI CLASSIFICATION - EVALUATION REPORT\n")
        f.write("="*60 + "\n\n")
        
        f.write("OVERALL METRICS\n")
        f.write("-"*60 + "\n")
        f.write(f"Accuracy: {eval_results['accuracy']*100:.2f}%\n")
        f.write(f"F1-Score (Macro): {eval_results['f1_macro']:.4f}\n")
        f.write(f"F1-Score (Weighted): {eval_results['f1_weighted']:.4f}\n")
        f.write("\n")
        
        # Per-class report
        f.write("PER-CLASS METRICS\n")
        f.write("-"*60 + "\n")
        report_df = pd.DataFrame(eval_results['class_report']).transpose()
        f.write(report_df.to_string())
        f.write("\n\n")
        
        # Worst and best performing classes
        class_names = eval_results['class_names']
        f1_scores = [eval_results['class_report'][cn]['f1-score'] for cn in class_names]
        
        worst_idx = np.argmin(f1_scores)
        best_idx = np.argmax(f1_scores)
        
        f.write("ANALYSIS\n")
        f.write("-"*60 + "\n")
        f.write(f"Best performing class: {class_names[best_idx]} (F1: {f1_scores[best_idx]:.4f})\n")
        f.write(f"Worst performing class: {class_names[worst_idx]} (F1: {f1_scores[worst_idx]:.4f})\n")
    
    print(f"✓ Evaluation report saved: {save_path}")


# Usage example
if __name__ == "__main__":
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    # Load test data
    print("Loading test data...")
    _, _, test_loader, _, info = prepare_data_loaders(
        data_dir="../data/raw",
        batch_size=32,
        img_size=224,
    )
    
    # Load best model
    checkpoint_path = Path("../models/efficientnet_finetuned_best.pth")
    if not checkpoint_path.exists():
        print(f"Model not found: {checkpoint_path}")
        print("Please train a model first or update the checkpoint path")
    else:
        # Import model class
        from models_tl import EfficientNetTransfer
        
        # Load model
        model = EfficientNetTransfer(num_classes=info['num_classes'])
        checkpoint = torch.load(checkpoint_path)
        model.load_state_dict(checkpoint['model_state_dict'])
        model = model.to(device)
        
        # Evaluate
        eval_results = evaluate_model(model, test_loader, device, info['class_names'])
        
        # Visualizations
        plot_confusion_matrix(eval_results)
        plot_per_class_metrics(eval_results)
        save_evaluation_report(eval_results)
        
        print(f"\n{'='*60}")
        print("Evaluation complete! Check results/ folder for visualizations.")
        print(f"{'='*60}")