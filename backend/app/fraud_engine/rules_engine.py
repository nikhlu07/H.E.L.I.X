"""
Advanced Rule-based Fraud Detection Engine
Implements sophisticated corruption detection patterns for government procurement
"""

import numpy as np
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class FraudRule:
    name: str
    weight: float
    threshold: float
    description: str
    category: str

@dataclass
class FraudScore:
    claim_id: int
    score: int
    risk_level: str
    flags: List[str]
    reasoning: str
    confidence: float

class FraudRulesEngine:
    """
    Comprehensive rule-based fraud detection system
    Implements real-world corruption patterns found in government procurement
    """
    
    def __init__(self):
        self.rules = {
            # Financial Pattern Rules
            "cost_variance": FraudRule(
                "Cost Variance", 0.25, 0.30, 
                "Cost significantly different from similar projects",
                "financial"
            ),
            "round_numbers": FraudRule(
                "Round Numbers", 0.15, 0.80, 
                "Suspiciously round invoice amounts",
                "financial"
            ),
            "budget_maxing": FraudRule(
                "Budget Maxing", 0.20, 0.95, 
                "Invoice amount suspiciously close to budget limit",
                "financial"
            ),
            "price_inflation": FraudRule(
                "Price Inflation", 0.30, 0.70,
                "Prices significantly above market rates",
                "financial"
            ),
            
            # Vendor Behavior Rules
            "new_vendor": FraudRule(
                "New Vendor", 0.12, 0.60, 
                "Vendor with limited track record",
                "vendor"
            ),
            "vendor_frequency": FraudRule(
                "Vendor Frequency", 0.18, 0.75, 
                "Same vendor winning too many contracts",
                "vendor"
            ),
            "shell_company": FraudRule(
                "Shell Company", 0.35, 0.85,
                "Vendor shows characteristics of shell company",
                "vendor"
            ),
            "vendor_pattern": FraudRule(
                "Vendor Pattern", 0.22, 0.70, 
                "Unusual pattern in vendor submissions",
                "vendor"
            ),
            
            # Timeline and Process Rules
            "rushed_approval": FraudRule(
                "Rushed Approval", 0.16, 0.80, 
                "Unusually fast approval process",
                "process"
            ),
            "after_hours": FraudRule(
                "After Hours", 0.10, 0.60,
                "Submission outside normal business hours",
                "process"
            ),
            "holiday_submission": FraudRule(
                "Holiday Submission", 0.14, 0.75,
                "Submission during holidays or weekends",
                "process"
            ),
            
            # Geographic and Project Rules
            "area_mismatch": FraudRule(
                "Area Mismatch", 0.20, 0.90, 
                "Vendor location doesn't match project area",
                "geographic"
            ),
            "phantom_project": FraudRule(
                "Phantom Project", 0.40, 0.95,
                "Project characteristics suggest it may not exist",
                "project"
            ),
            
            # Document and Invoice Rules
            "duplicate_invoice": FraudRule(
                "Duplicate Invoice", 0.30, 0.95, 
                "Similar invoice hash or pattern detected",
                "document"
            ),
            "invoice_anomaly": FraudRule(
                "Invoice Anomaly", 0.18, 0.70,
                "Invoice shows suspicious characteristics",
                "document"
            )
        }
        
        self.historical_claims = []
        self.vendor_stats = {}
        self.market_rates = self._initialize_market_rates()
    
    def _initialize_market_rates(self) -> Dict[str, float]:
        """Initialize market rate database for comparison"""
        return {
            "Road Construction": 2500,  # per sq meter
            "School Building": 3200,
            "Hospital Equipment": 150000,  # per unit
            "IT Infrastructure": 85000,
            "Water Supply": 1800,
            "Public Transport": 4500000,  # per vehicle
            "Government Buildings": 3800,
            "Educational Technology": 45000
        }
    
    def add_historical_claim(self, claim):
        """Add a claim to historical data"""
        self.historical_claims.append(claim)
        self._update_vendor_stats(claim)
    
    def _update_vendor_stats(self, claim):
        """Update vendor statistics with new claim"""
        vendor_id = claim.vendor_id
        
        if vendor_id not in self.vendor_stats:
            self.vendor_stats[vendor_id] = {
                'total_claims': 0,
                'total_amount': 0,
                'recent_submissions': 0,
                'success_rate': 0.5,
                'avg_amount': 0,
                'first_seen': claim.timestamp,
                'last_seen': claim.timestamp,
                'areas': set()
            }
        
        stats = self.vendor_stats[vendor_id]
        stats['total_claims'] += 1
        stats['total_amount'] += claim.amount
        stats['avg_amount'] = stats['total_amount'] / stats['total_claims']
        stats['last_seen'] = max(stats['last_seen'], claim.timestamp)
        stats['areas'].add(claim.area)
        
        # Count recent submissions (last 30 days)
        recent_count = sum(1 for c in self.historical_claims 
                          if c.vendor_id == vendor_id and 
                          (datetime.now() - c.timestamp).days <= 30)
        stats['recent_submissions'] = recent_count
    
    def analyze_claim(self, claim) -> FraudScore:
        """
        Comprehensive fraud analysis using all available rules
        """
        flags = []
        total_score = 0.0
        reasoning_parts = []
        confidence_factors = []
        
        # Financial Pattern Analysis
        cost_score = self._check_cost_variance(claim)
        if cost_score > self.rules["cost_variance"].threshold:
            flags.append("COST_VARIANCE")
            reasoning_parts.append(f"Cost variance: {cost_score:.2f}")
            confidence_factors.append(0.8)
        total_score += cost_score * self.rules["cost_variance"].weight
        
        # Round numbers check
        round_score = self._check_round_numbers(claim.amount)
        if round_score > self.rules["round_numbers"].threshold:
            flags.append("ROUND_NUMBERS")
            reasoning_parts.append(f"Suspicious round amount: ₹{claim.amount:,.0f}")
            confidence_factors.append(0.9)
        total_score += round_score * self.rules["round_numbers"].weight
        
        # Price inflation check
        inflation_score = self._check_price_inflation(claim)
        if inflation_score > self.rules["price_inflation"].threshold:
            flags.append("PRICE_INFLATION")
            reasoning_parts.append("Prices above market rates")
            confidence_factors.append(0.85)
        total_score += inflation_score * self.rules["price_inflation"].weight
        
        # Budget maxing check
        budget_score = self._check_budget_maxing(claim)
        if budget_score > self.rules["budget_maxing"].threshold:
            flags.append("BUDGET_MAXING")
            reasoning_parts.append("Amount close to budget limit")
            confidence_factors.append(0.75)
        total_score += budget_score * self.rules["budget_maxing"].weight
        
        # Vendor analysis
        vendor_score = self._check_vendor_patterns(claim)
        if vendor_score > self.rules["vendor_pattern"].threshold:
            flags.append("VENDOR_PATTERN")
            reasoning_parts.append("Unusual vendor behavior")
            confidence_factors.append(0.8)
        total_score += vendor_score * self.rules["vendor_pattern"].weight
        
        # Shell company detection
        shell_score = self._check_shell_company(claim)
        if shell_score > self.rules["shell_company"].threshold:
            flags.append("SHELL_COMPANY")
            reasoning_parts.append("Shell company indicators")
            confidence_factors.append(0.95)
        total_score += shell_score * self.rules["shell_company"].weight
        
        # Timeline analysis
        timeline_score = self._check_timeline_anomalies(claim)
        if timeline_score > self.rules["after_hours"].threshold:
            flags.append("TIMELINE_ANOMALY")
            reasoning_parts.append("Suspicious timing")
            confidence_factors.append(0.7)
        total_score += timeline_score * self.rules["after_hours"].weight
        
        # Phantom project detection
        phantom_score = self._check_phantom_project(claim)
        if phantom_score > self.rules["phantom_project"].threshold:
            flags.append("PHANTOM_PROJECT")
            reasoning_parts.append("Possible phantom project")
            confidence_factors.append(0.9)
        total_score += phantom_score * self.rules["phantom_project"].weight
        
        # Duplicate detection
        duplicate_score = self._check_duplicates(claim)
        if duplicate_score > self.rules["duplicate_invoice"].threshold:
            flags.append("DUPLICATE_INVOICE")
            reasoning_parts.append("Similar invoice detected")
            confidence_factors.append(0.95)
        total_score += duplicate_score * self.rules["duplicate_invoice"].weight
        
        # Calculate final score and confidence
        final_score = min(100, max(0, int(total_score * 100)))
        confidence = np.mean(confidence_factors) if confidence_factors else 0.5
        
        # Determine risk level
        if final_score >= 85:
            risk_level = "critical"
        elif final_score >= 70:
            risk_level = "high"
        elif final_score >= 40:
            risk_level = "medium"
        else:
            risk_level = "low"
        
        reasoning = "; ".join(reasoning_parts) if reasoning_parts else "No significant fraud indicators detected"
        
        return FraudScore(
            claim_id=claim.claim_id,
            score=final_score,
            risk_level=risk_level,
            flags=flags,
            reasoning=reasoning,
            confidence=confidence
        )
    
    def _check_cost_variance(self, claim) -> float:
        """Analyze cost variance against similar projects"""
        if not self.historical_claims:
            return 0.1
        
        # Find similar projects
        similar_projects = [
            c for c in self.historical_claims 
            if c.area == claim.area and 
            abs(c.amount - claim.amount) / max(claim.amount, 1) < 3.0 and
            (datetime.now() - c.timestamp).days < 730  # Within 2 years
        ]
        
        if len(similar_projects) < 3:
            return 0.2
        
        amounts = [p.amount for p in similar_projects]
        mean_amount = np.mean(amounts)
        std_amount = np.std(amounts)
        
        if std_amount == 0:
            return 0.1
        
        # Calculate z-score
        z_score = abs(claim.amount - mean_amount) / std_amount
        
        # Convert to fraud probability
        if z_score > 3:
            return 0.95
        elif z_score > 2.5:
            return 0.8
        elif z_score > 2:
            return 0.6
        elif z_score > 1.5:
            return 0.3
        else:
            return 0.1
    
    def _check_round_numbers(self, amount: float) -> float:
        """Check for suspiciously round amounts"""
        amount_str = str(int(amount))
        
        # Check for different levels of roundness
        if amount_str.endswith('00000'):  # Ends in 5 zeros
            return 0.95
        elif amount_str.endswith('0000'):  # Ends in 4 zeros
            return 0.8
        elif amount_str.endswith('000'):   # Ends in 3 zeros
            return 0.6
        elif amount_str.endswith('00'):    # Ends in 2 zeros
            return 0.3
        else:
            return 0.05
    
    def _check_price_inflation(self, claim) -> float:
        """Check if prices are inflated compared to market rates"""
        area = claim.area
        if area not in self.market_rates:
            return 0.2  # Unknown area, moderate suspicion
        
        market_rate = self.market_rates[area]
        
        # Estimate expected cost (simplified calculation)
        # In reality, this would use more sophisticated cost models
        estimated_cost = market_rate * 100  # Simplified multiplier
        
        if claim.amount > estimated_cost * 2:  # More than 2x expected
            return 0.9
        elif claim.amount > estimated_cost * 1.5:  # 1.5x expected
            return 0.7
        elif claim.amount > estimated_cost * 1.2:  # 1.2x expected
            return 0.4
        else:
            return 0.1
    
    def _check_budget_maxing(self, claim) -> float:
        """Check if invoice amount suspiciously maxes out budget"""
        # Simplified calculation - in production would use actual budget data
        estimated_budget = claim.amount * 1.1  # Assume budget is 10% higher
        utilization = claim.amount / estimated_budget
        
        if utilization > 0.99:
            return 0.95
        elif utilization > 0.95:
            return 0.8
        elif utilization > 0.90:
            return 0.5
        else:
            return 0.1
    
    def _check_vendor_patterns(self, claim) -> float:
        """Analyze vendor submission patterns for anomalies"""
        vendor_id = claim.vendor_id
        
        if vendor_id not in self.vendor_stats:
            return 0.6  # New vendor, moderate risk
        
        stats = self.vendor_stats[vendor_id]
        
        # Check submission frequency
        if stats['recent_submissions'] > 8:  # More than 8 in 30 days
            return 0.85
        elif stats['recent_submissions'] > 5:
            return 0.7
        
        # Check success rate (too high is suspicious)
        if stats['success_rate'] > 0.95:
            return 0.8
        
        # Check amount patterns
        if claim.amount > stats['avg_amount'] * 4:  # 4x higher than usual
            return 0.75
        elif claim.amount > stats['avg_amount'] * 2.5:
            return 0.5
        
        # Check vendor age (very new vendors are risky)
        vendor_age_days = (datetime.now() - stats['first_seen']).days
        if vendor_age_days < 30:
            return 0.7
        elif vendor_age_days < 90:
            return 0.4
        
        return 0.15
    
    def _check_shell_company(self, claim) -> float:
        """Detect shell company characteristics"""
        vendor_id = claim.vendor_id
        
        if vendor_id not in self.vendor_stats:
            return 0.3  # New vendor, some suspicion
        
        stats = self.vendor_stats[vendor_id]
        shell_indicators = 0
        
        # Very few total claims but high amounts
        if stats['total_claims'] <= 3 and claim.amount > 1000000:
            shell_indicators += 1
        
        # Only works in one area (lack of diversification)
        if len(stats['areas']) == 1 and stats['total_claims'] > 1:
            shell_indicators += 1
        
        # Very new vendor with large claim
        vendor_age = (datetime.now() - stats['first_seen']).days
        if vendor_age < 60 and claim.amount > 500000:
            shell_indicators += 1
        
        # Unusually high success rate for new vendor
        if vendor_age < 180 and stats['success_rate'] > 0.9:
            shell_indicators += 1
        
        # Convert indicators to score
        if shell_indicators >= 3:
            return 0.9
        elif shell_indicators == 2:
            return 0.7
        elif shell_indicators == 1:
            return 0.4
        else:
            return 0.1
    
    def _check_timeline_anomalies(self, claim) -> float:
        """Check for unusual timing patterns"""
        timestamp = claim.timestamp
        hour = timestamp.hour
        day_of_week = timestamp.weekday()
        
        anomaly_score = 0.0
        
        # After hours submission (outside 8 AM - 6 PM)
        if hour < 8 or hour > 18:
            anomaly_score += 0.4
        
        # Weekend submission
        if day_of_week >= 5:  # Saturday = 5, Sunday = 6
            anomaly_score += 0.3
        
        # Very late night or very early morning
        if hour < 6 or hour > 22:
            anomaly_score += 0.3
        
        # Holiday check (simplified - would use real holiday calendar)
        if timestamp.month == 12 and timestamp.day in [25, 26]:  # Christmas period
            anomaly_score += 0.4
        elif timestamp.month == 1 and timestamp.day == 1:  # New Year
            anomaly_score += 0.4
        
        return min(0.95, anomaly_score)
    
    def _check_phantom_project(self, claim) -> float:
        """Detect characteristics of phantom (non-existent) projects"""
        phantom_score = 0.0
        
        # Very round amounts often indicate made-up projects
        if str(int(claim.amount)).endswith('00000'):
            phantom_score += 0.3
        
        # Extremely high amounts for certain project types
        area_risk_thresholds = {
            "IT Infrastructure": 2000000,
            "Educational Technology": 1000000,
            "Hospital Equipment": 5000000,
            "Government Buildings": 10000000
        }
        
        if claim.area in area_risk_thresholds:
            if claim.amount > area_risk_thresholds[claim.area]:
                phantom_score += 0.4
        
        # Generic project descriptions (would analyze invoice_hash in real implementation)
        # For demo, we'll use a simple heuristic
        if len(claim.invoice_hash) < 20:  # Very short invoice data
            phantom_score += 0.2
        
        # New vendor with large project
        if claim.vendor_id not in self.vendor_stats and claim.amount > 1000000:
            phantom_score += 0.3
        
        return min(0.95, phantom_score)
    
    def _check_duplicates(self, claim) -> float:
        """Check for duplicate or similar invoices"""
        if not self.historical_claims:
            return 0.05
        
        # Check for exact invoice hash matches
        exact_matches = [
            c for c in self.historical_claims 
            if c.invoice_hash == claim.invoice_hash and c.claim_id != claim.claim_id
        ]
        
        if exact_matches:
            return 0.98
        
        # Check for similar amounts from same vendor
        similar_amounts = [
            c for c in self.historical_claims 
            if c.vendor_id == claim.vendor_id and 
            abs(c.amount - claim.amount) < 1000 and
            c.claim_id != claim.claim_id and
            (claim.timestamp - c.timestamp).days < 365
        ]
        
        if len(similar_amounts) > 3:
            return 0.8
        elif len(similar_amounts) > 1:
            return 0.5
        
        # Check for hash similarity (simplified)
        similar_hashes = [
            c for c in self.historical_claims 
            if self._calculate_hash_similarity(claim.invoice_hash, c.invoice_hash) > 0.8 and
            c.claim_id != claim.claim_id
        ]
        
        if len(similar_hashes) > 0:
            return 0.7
        
        return 0.05
    
    def _calculate_hash_similarity(self, hash1: str, hash2: str) -> float:
        """Calculate similarity between two invoice hashes"""
        if len(hash1) != len(hash2):
            return 0.0
        
        if len(hash1) == 0:
            return 0.0
        
        matches = sum(1 for a, b in zip(hash1, hash2) if a == b)
        return matches / len(hash1)
    
    def get_rule_explanations(self) -> Dict[str, Dict[str, str]]:
        """Get detailed explanations of all fraud detection rules"""
        explanations = {}
        
        for rule_name, rule in self.rules.items():
            explanations[rule_name] = {
                "name": rule.name,
                "description": rule.description,
                "category": rule.category,
                "weight": f"{rule.weight:.2f}",
                "threshold": f"{rule.threshold:.2f}",
                "examples": self._get_rule_examples(rule_name)
            }
        
        return explanations
    
    def _get_rule_examples(self, rule_name: str) -> str:
        """Get examples for each rule type"""
        examples = {
            "cost_variance": "Project costs 300% higher than similar road construction projects",
            "round_numbers": "Invoice amount exactly ₹5,00,000 (suspicious round number)",
            "price_inflation": "School supplies priced 60% above market rates",
            "shell_company": "New vendor with no business history winning large contracts",
            "phantom_project": "Claimed road construction with no physical evidence",
            "duplicate_invoice": "Same invoice submitted multiple times or very similar patterns"
        }
        
        return examples.get(rule_name, "Pattern analysis based on historical data")
    
    def get_vendor_risk_profile(self, vendor_id: str) -> Dict[str, any]:
        """Get comprehensive risk profile for a vendor"""
        if vendor_id not in self.vendor_stats:
            return {
                "vendor_id": vendor_id,
                "risk_level": "unknown",
                "total_claims": 0,
                "message": "New vendor - insufficient data for risk assessment"
            }
        
        stats = self.vendor_stats[vendor_id]
        
        # Calculate risk factors
        risk_factors = []
        risk_score = 0
        
        # Age factor
        vendor_age_days = (datetime.now() - stats['first_seen']).days
        if vendor_age_days < 90:
            risk_factors.append("Very new vendor")
            risk_score += 30
        
        # Frequency factor
        if stats['recent_submissions'] > 5:
            risk_factors.append("High submission frequency")
            risk_score += 25
        
        # Success rate factor
        if stats['success_rate'] > 0.9:
            risk_factors.append("Unusually high success rate")
            risk_score += 20
        
        # Diversification factor
        if len(stats['areas']) == 1 and stats['total_claims'] > 3:
            risk_factors.append("Limited business diversification")
            risk_score += 15
        
        # Amount volatility
        vendor_claims = [c for c in self.historical_claims if c.vendor_id == vendor_id]
        if len(vendor_claims) > 2:
            amounts = [c.amount for c in vendor_claims]
            volatility = np.std(amounts) / np.mean(amounts)
            if volatility > 1.5:
                risk_factors.append("High amount volatility")
                risk_score += 20
        
        # Determine risk level
        if risk_score >= 70:
            risk_level = "high"
        elif risk_score >= 40:
            risk_level = "medium"
        elif risk_score >= 20:
            risk_level = "low"
        else:
            risk_level = "very_low"
        
        return {
            "vendor_id": vendor_id,
            "risk_level": risk_level,
            "risk_score": risk_score,
            "risk_factors": risk_factors,
            "statistics": {
                "total_claims": stats['total_claims'],
                "total_amount": stats['total_amount'],
                "average_amount": stats['avg_amount'],
                "recent_submissions": stats['recent_submissions'],
                "success_rate": stats['success_rate'],
                "business_areas": list(stats['areas']),
                "vendor_age_days": vendor_age_days,
                "first_seen": stats['first_seen'].isoformat(),
                "last_seen": stats['last_seen'].isoformat()
            }
        }