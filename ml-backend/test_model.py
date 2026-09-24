"""
Quick test script to verify model accuracy on dataset images.
Picks random images from each class and checks if the model predicts correctly.
"""

import os
import sys
import json
import glob
import random
import numpy as np

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import cv2
import mediapipe as mp
import tensorflow as tf
from tensorflow import keras

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "models", "isl_model.h5")
LABELS_PATH = os.path.join(BASE_DIR, "models", "labels.json")
HAND_LANDMARKER_PATH = os.path.join(BASE_DIR, "data", "hand_landmarker.task")
DATA_PATH = os.path.join(BASE_DIR, "data", "data")

NUM_SAMPLES_PER_CLASS = 5  # test 5 random images per class


def extract_features(hand_landmarks):
    """Extract 63 features from hand landmarks, normalized relative to wrist."""
    wrist = hand_landmarks[0]
    features = []
    for lm in hand_landmarks:
        features.extend([lm.x - wrist.x, lm.y - wrist.y, lm.z - wrist.z])
    features = np.array(features, dtype=np.float32)
    max_val = np.max(np.abs(features))
    if max_val > 0:
        features = features / max_val
    return features


def main():
    print("=" * 60)
    print("  ISL Model Accuracy Test")
    print("=" * 60)
    
    # Load model
    print("\nLoading model...")
    model = keras.models.load_model(MODEL_PATH)
    print(f"  ✓ Model loaded")
    
    # Load labels
    with open(LABELS_PATH, 'r') as f:
        labels = json.load(f)
    print(f"  ✓ {len(labels)} labels loaded: {labels}")
    
    # Create HandLandmarker
    print("\nInitializing HandLandmarker...")
    BaseOptions = mp.tasks.BaseOptions
    HandLandmarker = mp.tasks.vision.HandLandmarker
    HandLandmarkerOptions = mp.tasks.vision.HandLandmarkerOptions
    VisionRunningMode = mp.tasks.vision.RunningMode
    
    options = HandLandmarkerOptions(
        base_options=BaseOptions(model_asset_path=HAND_LANDMARKER_PATH),
        running_mode=VisionRunningMode.IMAGE,
        num_hands=1,
        min_hand_detection_confidence=0.5,
        min_hand_presence_confidence=0.5,
        min_tracking_confidence=0.5
    )
    landmarker = HandLandmarker.create_from_options(options)
    print("  ✓ HandLandmarker initialized")
    
    # Test each class
    print(f"\nTesting {NUM_SAMPLES_PER_CLASS} random images per class...\n")
    
    total_correct = 0
    total_tested = 0
    total_no_hand = 0
    class_results = {}
    
    class_dirs = sorted([d for d in os.listdir(DATA_PATH) if os.path.isdir(os.path.join(DATA_PATH, d))])
    
    for class_name in class_dirs:
        class_path = os.path.join(DATA_PATH, class_name)
        image_files = glob.glob(os.path.join(class_path, '*.jpg')) + \
                      glob.glob(os.path.join(class_path, '*.png')) + \
                      glob.glob(os.path.join(class_path, '*.jpeg'))
        
        if not image_files:
            print(f"  {class_name}: No images found")
            continue
        
        # Pick random samples
        samples = random.sample(image_files, min(NUM_SAMPLES_PER_CLASS, len(image_files)))
        
        correct = 0
        tested = 0
        no_hand = 0
        wrong_predictions = []
        
        for img_path in samples:
            image = cv2.imread(img_path)
            if image is None:
                continue
            
            rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_image)
            result = landmarker.detect(mp_image)
            
            if not result.hand_landmarks or len(result.hand_landmarks) == 0:
                no_hand += 1
                total_no_hand += 1
                continue
            
            features = extract_features(result.hand_landmarks[0])
            features_batch = features.reshape(1, -1)
            prediction = model.predict(features_batch, verbose=0)
            predicted_idx = np.argmax(prediction[0])
            confidence = float(prediction[0][predicted_idx])
            predicted_label = labels[predicted_idx]
            
            tested += 1
            total_tested += 1
            
            if predicted_label == class_name:
                correct += 1
                total_correct += 1
            else:
                wrong_predictions.append(f"{predicted_label}({confidence:.2f})")
        
        accuracy = (correct / tested * 100) if tested > 0 else 0
        status = "✓" if accuracy >= 80 else "✗"
        
        wrong_str = f" | Wrong: {', '.join(wrong_predictions)}" if wrong_predictions else ""
        no_hand_str = f" | No hand: {no_hand}" if no_hand > 0 else ""
        print(f"  {status} Class '{class_name}': {correct}/{tested} correct ({accuracy:.0f}%){wrong_str}{no_hand_str}")
        
        class_results[class_name] = {
            "correct": correct,
            "tested": tested,
            "no_hand": no_hand,
            "accuracy": accuracy
        }
    
    landmarker.close()
    
    # Summary
    overall_accuracy = (total_correct / total_tested * 100) if total_tested > 0 else 0
    print(f"\n{'=' * 60}")
    print(f"  OVERALL RESULTS")
    print(f"{'=' * 60}")
    print(f"  Total tested:     {total_tested}")
    print(f"  Correct:          {total_correct}")
    print(f"  Wrong:            {total_tested - total_correct}")
    print(f"  No hand detected: {total_no_hand}")
    print(f"  Accuracy:         {overall_accuracy:.1f}%")
    print(f"{'=' * 60}")
    
    if overall_accuracy >= 90:
        print("\n  ✅ Model is performing EXCELLENTLY!")
    elif overall_accuracy >= 70:
        print("\n  ⚠ Model is performing OKAY, could be improved.")
    else:
        print("\n  ❌ Model accuracy is LOW, needs retraining.")


if __name__ == '__main__':
    import io as _io
    import sys
    # Capture output to file
    old_stdout = sys.stdout
    buf = _io.StringIO()
    
    class Tee:
        def __init__(self, *streams):
            self.streams = streams
        def write(self, data):
            for s in self.streams:
                s.write(data)
        def flush(self):
            for s in self.streams:
                s.flush()
    
    sys.stdout = Tee(old_stdout, buf)
    main()
    sys.stdout = old_stdout
    
    results_path = os.path.join(BASE_DIR, "test_results.txt")
    with open(results_path, 'w', encoding='utf-8') as f:
        f.write(buf.getvalue())
    print(f"\nResults also saved to {results_path}")
