"""
Machine Learning Fraud Detection Module
Advanced anomaly detection for government procurement corruption
"""

import numpy as np
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.preprocessing import StandardScaler, RobustScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score
import joblib
import os

logger = logging.getLogger(__name__)

class MLFraudDetector:
    """
    Advanced Machine Learning fraud detection using multiple algorithms
    Combines anomaly detection with supervised learning for maximum accuracy
    """
    
    def __init__(self):
        self.anomaly_model = None
        self.classification_model = None
        self.scaler = RobustScaler()  # More robust to outliers than StandardScaler
        self.is_trained = False
        self.model_version = "1.0.0"
        self.last_training = None
        
        # Enhanced feature set for better detection
        self.feature_columns = [
            # Amount-based features
            'amount', 'amount_log', 'amount_zscore',
            
            # Vendor-based features
            'vendor_submissions_count', 'vendor_success_rate', 'vendor_age_days',
            'vendor_avg_amount', 'amount_vs_vendor_avg', 'vendor_area_diversity',
            
            # Temporal features
            'time_since_last_submission', 'submission_hour', 'is_weekend',
            'is_after_hours', 'days_since_first_claim',
            
            # Project-based features
            'project_complexity_score', 'area_frequency', 'seasonal_factor',
            
            # Pattern-based features
            'amount_roundness', 'invoice_length', 'duplicate_similarity'
        ]
        
        # Area complexity mapping for project assessment
        self.area_complexity = {
            "Road Construction": 0.6,
            "School Building": 0.7,
            "Hospital Equipment": 0.9,
            "IT Infrastructure": 0.8,
            "Water Supply": 0.6,
            "Public Transport": 0.9,
            "Government Buildings": 0.7,
            "Educational Technology": 0.8
        }
    
    def prepare_features(self, claim, historical_data: List) -> np.ndarray:
        """
        Extract comprehensive feature set for ML analysis
        """
        try:
            vendor_history = [c for c in historical_data if c.vendor_id == claim.vendor_id]
            all_amounts = [c.amount for c in historical_data]
            
            # Amount-based features
            amount = claim.amount
            amount_log = np.log(max(amount, 1))
            amount_zscore = (amount - np.mean(all_amounts)) / (np.std(all_amounts) + 1e-8) if all_amounts else 0
            
            # Vendor-based features
            vendor_submissions_count = len(vendor_history)
            vendor_success_rate = 0.7 if not vendor_history else min(0.95, len(vendor_history) * 0.1 + 0.5)
            vendor_age_days = self._get_vendor_age_days(claim, vendor_history)
            vendor_avg_amount = np.mean([c.amount for c in vendor_history]) if vendor_history else amount
            amount_vs_vendor_avg = amount / max(vendor_avg_amount, 1)
            vendor_area_diversity = len(set(c.area for c in vendor_history)) if vendor_history else 1
            
            # Temporal features
            time_since_last = self._get_time_since_last_submission(claim, vendor_history)
            submission_hour = claim.timestamp.hour
            is_weekend = 1.0 if claim.timestamp.weekday() >= 5 else 0.0
            is_after_hours = 1.0 if submission_hour < 8 or submission_hour > 18 else 0.0
            days_since_first = (claim.timestamp - min(h.timestamp for h in vendor_history)).days if vendor_history else 0
            
            # Project-based features
            project_complexity = self.area_complexity.get(claim.area, 0.5)
            area_frequency = sum(1 for c in historical_data if c.area == claim.area)
            seasonal_factor = self._get_seasonal_factor(claim.timestamp)
            
            # Pattern-based features
            amount_roundness = self._calculate_roundness(amount)
            invoice_length = len(claim.invoice_hash)
            duplicate_similarity = self._calculate_duplicate_similarity(claim, historical_data)
            
            features = {
                'amount': amount,
                'amount_log': amount_log,
                'amount_zscore': amount_zscore,
                'vendor_submissions_count': vendor_submissions_count,
                'vendor_success_rate': vendor_success_rate,
                'vendor_age_days': vendor_age_days,
                'vendor_avg_amount': vendor_avg_amount,
                'amount_vs_vendor_avg': amount_vs_vendor_avg,
                'vendor_area_diversity': vendor_area_diversity,
                'time_since_last_submission': time_since_last,
                'submission_hour': submission_hour,
                'is_weekend': is_weekend,
                'is_after_hours': is_after_hours,
                'days_since_first_claim': days_since_first,
                'project_complexity_score': project_complexity,
                'area_frequency': area_frequency,
                'seasonal_factor': seasonal_factor,
                'amount_roundness': amount_roundness,
                'invoice_length': invoice_length,
                'duplicate_similarity': duplicate_similarity
            }
            
            return np.array([features[col] for col in self.feature_columns]).reshape(1, -1)
            
        except Exception as e:
            logger.error(f"Feature extraction failed: {e}")
            # Return safe default features
            return np.zeros((1, len(self.feature_columns)))
    
    def _get_vendor_age_days(self, claim, vendor_history: List) -> float:
        """Calculate vendor age in days"""
        if not vendor_history:
            return 0.0
        
        first_claim = min(vendor_history, key=lambda x: x.timestamp)
        age_days = (claim.timestamp - first_claim.timestamp).days
        return min(age_days, 3650)  # Cap at 10 years
    
    def _get_time_since_last_submission(self, claim, vendor_history: List) -> float:
        """Calculate time since vendor's last submission"""
        if not vendor_history:
            return 365.0  # New vendor
        
        last_submission = max(vendor_history, key=lambda x: x.timestamp)
        time_diff = (claim.timestamp - last_submission.timestamp).days
        return min(time_diff, 730.0)  # Cap at 2 years
    
    def _get_seasonal_factor(self, timestamp: datetime) -> float:
        """Calculate seasonal factor (end of fiscal year rush, etc.)"""
        month = timestamp.month
        
        # End of fiscal year (March in India) - higher fraud risk
        if month == 3:
            return 0.9
        # Beginning of fiscal year - lower risk
        elif month == 4:
            return 0.3
        # Holiday seasons - medium risk
        elif month in [12, 1]:
            return 0.6
        else:
            return 0.5
    
    def _calculate_roundness(self, amount: float) -> float:
        """Calculate how 'round' a number is (suspicious pattern)"""
        amount_str = str(int(amount))
        
        if amount_str.endswith('00000'):
            return 1.0
        elif amount_str.endswith('0000'):
            return 0.8
        elif amount_str.endswith('000'):
            return 0.6
        elif amount_str.endswith('00'):
            return 0.4
        elif amount_str.endswith('0'):
            return 0.2
        else:
            return 0.0
    
    def _calculate_duplicate_similarity(self, claim, historical_data: List) -> float:
        """Calculate similarity to existing claims"""
        if not historical_data:
            return 0.0
        
        max_similarity = 0.0
        
        for hist_claim in historical_data[-50]:  # Check last 50 claims for efficiency
            if hist_claim.claim_id == claim.claim_id:
                continue
            
            # Amount similarity
            amount_diff = abs(claim.amount - hist_claim.amount) / max(claim.amount, hist_claim.amount)
            amount_sim = 1.0 - min(amount_diff, 1.0)
            
            # Hash similarity
            hash_sim = self._string_similarity(claim.invoice_hash, hist_claim.invoice_hash)
            
            # Vendor similarity
            vendor_sim = 1.0 if claim.vendor_id == hist_claim.vendor_id else 0.0
            
            # Area similarity
            area_sim = 1.0 if claim.area == hist_claim.area else 0.0
            
            # Combined similarity
            combined_sim = (amount_sim * 0.4 + hash_sim * 0.3 + vendor_sim * 0.2 + area_sim * 0.1)
            max_similarity = max(max_similarity, combined_sim)
        
        return max_similarity
    
    def _string_similarity(self, str1: str, str2: str) -> float:
        """Calculate string similarity between two invoice hashes"""
        if not str1 or not str2:
            return 0.0
        
        if len(str1) != len(str2):
            return 0.0
        
        matches = sum(1 for a, b in zip(str1, str2) if a == b)
        return matches / len(str1)
    
    def train(self, historical_data: List, fraud_labels: List[bool]):
        """
        Train both anomaly detection and classification models
        """
        try:
            if len(historical_data) < 20:
                logger.warning("Insufficient training data for ML model")
                return
            
            logger.info(f"Training ML models with {len(historical_data)} samples...")
            
            # Prepare feature matrix
            features_list = []
            for claim in historical_data:
                features = self.prepare_features(claim, historical_data)
                features_list.append(features.flatten())
            
            X = np.array(features_list)
            y = np.array(fraud_labels)
            
            # Handle any NaN or infinite values
            X = np.nan_to_num(X, nan=0.0, posinf=999999, neginf=-999999)
            
            # Scale features
            X_scaled = self.scaler.fit_transform(X)
            
            # Train anomaly detection model (unsupervised)
            self.anomaly_model = IsolationForest(
                contamination=min(0.15, sum(fraud_labels) / len(fraud_labels) + 0.05),
                random_state=42,
                n_estimators=200,
                max_samples='auto',
                bootstrap=True
            )
            self.anomaly_model.fit(X_scaled)
            
            # Train classification model (supervised) if we have enough fraud cases
            fraud_count = sum(fraud_labels)
            if fraud_count >= 5:
                try:
                    # Split data for validation
                    X_train, X_test, y_train, y_test = train_test_split(
                        X_scaled, y, test_size=0.2, random_state=42, stratify=y
                    )
                    
                    # Train Random Forest classifier
                    self.classification_model = RandomForestClassifier(
                        n_estimators=100,
                        max_depth=10,
                        min_samples_split=5,
                        min_samples_leaf=2,
                        random_state=42,
                        class_weight='balanced'
                    )
                    self.classification_model.fit(X_train, y_train)
                    
                    # Evaluate model performance
                    y_pred = self.classification_model.predict(X_test)
                    y_prob = self.classification_model.predict_proba(X_test)[:, 1]
                    
                    auc_score = roc_auc_score(y_test, y_prob)
                    logger.info(f"Classification model AUC: {auc_score:.3f}")
                    
                except Exception as e:
                    logger.warning(f"Classification model training failed: {e}")
                    self.classification_model = None
            
            self.is_trained = True
            self.last_training = datetime.now()
            
            logger.info(f"ML models trained successfully. Fraud cases: {fraud_count}/{len(fraud_labels)}")
            
            # Save models for persistence
            self._save_models()
            
        except Exception as e:
            logger.error(f"ML model training failed: {e}")
            self.is_trained = False
    
    def predict_fraud_probability(self, claim, historical_data: List) -> float:
        """
        Predict fraud probability using ensemble of models
        """
        try:
            if not self.is_trained:
                return 0.5  # Neutral score if not trained
            
            features = self.prepare_features(claim, historical_data)
            features_scaled = self.scaler.transform(features)
            
            # Anomaly detection score
            anomaly_score = self.anomaly_model.decision_function(features_scaled)[0]
            # Convert to probability (Isolation Forest returns negative values for anomalies)
            anomaly_prob = max(0, min(1, 0.5 - (anomaly_score / 2)))
            
            # Classification score (if available)
            if self.classification_model is not None:
                try:
                    class_prob = self.classification_model.predict_proba(features_scaled)[0][1]
                    # Ensemble prediction: weighted average
                    final_prob = 0.6 * class_prob + 0.4 * anomaly_prob
                except Exception as e:
                    logger.warning(f"Classification prediction failed: {e}")
                    final_prob = anomaly_prob
            else:
                final_prob = anomaly_prob
            
            # Apply business logic constraints
            final_prob = max(0.0, min(1.0, final_prob))
            
            return final_prob
            
        except Exception as e:
            logger.error(f"ML prediction failed: {e}")
            return 0.5  # Return neutral score on error
    
    def get_feature_importance(self) -> Dict[str, float]:
        """Get feature importance from trained models"""
        if not self.is_trained or self.classification_model is None:
            return {}
        
        try:
            importances = self.classification_model.feature_importances_
            feature_importance = dict(zip(self.feature_columns, importances))
            
            # Sort by importance
            sorted_features = sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)
            
            return dict(sorted_features)
            
        except Exception as e:
            logger.error(f"Failed to get feature importance: {e}")
            return {}
    
    def get_model_stats(self) -> Dict[str, any]:
        """Get comprehensive model statistics"""
        stats = {
            "is_trained": self.is_trained,
            "model_version": self.model_version,
            "last_training": self.last_training.isoformat() if self.last_training else None,
            "has_anomaly_model": self.anomaly_model is not None,
            "has_classification_model": self.classification_model is not None,
            "feature_count": len(self.feature_columns),
            "scaler_type": type(self.scaler).__name__
        }
        
        if self.is_trained and self.classification_model:
            stats["feature_importance"] = self.get_feature_importance()
        
        return stats
    
    def _save_models(self):
        """Save trained models to disk"""
        try:
            model_dir = "models"
            os.makedirs(model_dir, exist_ok=True)
            
            if self.anomaly_model:
                joblib.dump(self.anomaly_model, f"{model_dir}/anomaly_model.joblib")
            
            if self.classification_model:
                joblib.dump(self.classification_model, f"{model_dir}/classification_model.joblib")
            
            joblib.dump(self.scaler, f"{model_dir}/scaler.joblib")
            
            # Save metadata
            metadata = {
                "model_version": self.model_version,
                "last_training": self.last_training.isoformat() if self.last_training else None,
                "feature_columns": self.feature_columns
            }
            
            with open(f"{model_dir}/metadata.json", 'w') as f:
                json.dump(metadata, f, indent=2)
            
            logger.info("Models saved successfully")
            
        except Exception as e:
            logger.error(f"Failed to save models: {e}")
    
    def load_models(self):
        """Load previously trained models from disk"""
        try:
            model_dir = "models"
            
            if os.path.exists(f"{model_dir}/anomaly_model.joblib"):
                self.anomaly_model = joblib.load(f"{model_dir}/anomaly_model.joblib")
            
            if os.path.exists(f"{model_dir}/classification_model.joblib"):
                self.classification_model = joblib.load(f"{model_dir}/classification_model.joblib")
            
            if os.path.exists(f"{model_dir}/scaler.joblib"):
                self.scaler = joblib.load(f"{model_dir}/scaler.joblib")
            
            if os.path.exists(f"{model_dir}/metadata.json"):
                with open(f"{model_dir}/metadata.json", 'r') as f:
                    metadata = json.load(f)
                    self.model_version = metadata.get("model_version", "1.0.0")
                    if metadata.get("last_training"):
                        self.last_training = datetime.fromisoformat(metadata["last_training"])
            
            self.is_trained = self.anomaly_model is not None
            
            if self.is_trained:
                logger.info("Models loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load models: {e}")
            self.is_trained = False
    
    def explain_prediction(self, claim, historical_data: List) -> Dict[str, any]:
        """
        Provide explanation for a fraud prediction
        """
        if not self.is_trained:
            return {"error": "Model not trained"}
        
        try:
            features = self.prepare_features(claim, historical_data)
            fraud_prob = self.predict_fraud_probability(claim, historical_data)
            
            # Get feature values
            feature_values = dict(zip(self.feature_columns, features.flatten()))
            
            # Get feature importance (if available)
            feature_importance = self.get_feature_importance()
            
            # Calculate contribution of each feature
            explanations = []
            for feature, value in feature_values.items():
                importance = feature_importance.get(feature, 0)
                contribution = importance * value if importance > 0.05 else 0
                
                if contribution > 0.01:  # Only show significant contributions
                    explanations.append({
                        "feature": feature,
                        "value": round(value, 3),
                        "importance": round(importance, 3),
                        "contribution": round(contribution, 3)
                    })
            
            # Sort