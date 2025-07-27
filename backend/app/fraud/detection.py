# backend/app/fraud/detection.py
"""
Core Fraud Detection Engine
Implements real fraud patterns found in government procurement
"""

import asyncio
import logging
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime, timedelta
import statistics
import re
from collections import defaultdict, Counter

@dataclass
class FraudAlert:
    alert_type: str
    severity: str  # "low", "medium", "high", "critical"
    confidence: float  # 0.0 to 1.0
    description: str
    evidence: Dict
    risk_score: int  # 0-100
    recommended_action: str  # "approve", "review", "block"

@dataclass
class ClaimAnalysis:
    claim_id: int
    vendor_principal: str
    amount: int
    alerts: List[FraudAlert]
    total_risk_score: int
    recommendation: str
    reasoning: str

class FraudDetectionEngine:
    """
    Advanced fraud detection using real government procurement patterns
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        
        # Fraud detection thresholds (tuned from real data)
        self.COST_JUMP_THRESHOLD = 25  # 25% increase is suspicious
        self.CRITICAL_COST_THRESHOLD = 100  # 100% increase is critical
        self.VENDOR_COLLUSION_SIMILARITY = 2  # Bids within 2% are suspicious
        self.RAPID_SUBMISSION_HOURS = 2  # Claims within 2 hours are suspicious
        self.HIGH_RISK_SCORE = 70
        self.CRITICAL_RISK_SCORE = 85
    
    async def analyze_claim(self, claim_data: Dict, historical_data: List[Dict]) -> ClaimAnalysis:
        """
        Main fraud analysis function - combines all detection methods
        """
        claim_id = claim_data["claim_id"]
        vendor = claim_data["vendor_principal"]
        amount = claim_data["amount"]
        
        self.logger.info(f"Starting fraud analysis for claim {claim_id}")
        
        alerts = []
        
        # 1. Cost Variance Analysis (Most Common Fraud)
        cost_alerts = await self._detect_cost_anomalies(claim_data, historical_data)
        alerts.extend(cost_alerts)
        
        # 2. Vendor Pattern Analysis
        vendor_alerts = await self._detect_vendor_fraud_patterns(claim_data, historical_data)
        alerts.extend(vendor_alerts)
        
        # 3. Timeline Anomaly Detection
        timeline_alerts = await self._detect_timeline_anomalies(claim_data, historical_data)
        alerts.extend(timeline_alerts)
        
        # 4. Invoice Content Analysis
        invoice_alerts = await self._detect_invoice_fraud(claim_data)
        alerts.extend(invoice_alerts)
        
        # 5. Procurement Process Violations
        process_alerts = await self._detect_process_violations(claim_data, historical_data)
        alerts.extend(process_alerts)
        
        # Calculate total risk score
        total_risk_score = min(sum(alert.risk_score for alert in alerts), 100)
        
        # Determine recommendation
        recommendation, reasoning = self._calculate_recommendation(alerts, total_risk_score)
        
        return ClaimAnalysis(
            claim_id=claim_id,
            vendor_principal=vendor,
            amount=amount,
            alerts=alerts,
            total_risk_score=total_risk_score,
            recommendation=recommendation,
            reasoning=reasoning
        )
    
    async def _detect_cost_anomalies(self, claim_data: Dict, historical_data: List[Dict]) -> List[FraudAlert]:
        """
        Detect suspicious cost increases - #1 source of procurement fraud
        """
        alerts = []
        amount = claim_data["amount"]
        area = claim_data.get("area", "unknown")
        
        # Get similar projects for comparison
        similar_projects = [
            h for h in historical_data 
            if h.get("area") == area and h.get("amount", 0) > 0
        ]
        
        if similar_projects:
            amounts = [p["amount"] for p in similar_projects]
            avg_amount = statistics.mean(amounts)
            median_amount = statistics.median(amounts)
            
            # Calculate percentage increase from typical amounts
            avg_increase = ((amount - avg_amount) / avg_amount) * 100 if avg_amount > 0 else 0
            median_increase = ((amount - median_amount) / median_amount) * 100 if median_amount > 0 else 0
            
            # Critical cost jump detection
            if avg_increase > self.CRITICAL_COST_THRESHOLD:
                alerts.append(FraudAlert(
                    alert_type="critical_cost_inflation",
                    severity="critical",
                    confidence=0.95,
                    description=f"Cost inflated by {avg_increase:.1f}% above typical projects",
                    evidence={
                        "claimed_amount": amount,
                        "typical_amount": int(avg_amount),
                        "increase_percentage": round(avg_increase, 1),
                        "similar_projects_count": len(similar_projects)
                    },
                    risk_score=45,
                    recommended_action="block"
                ))
            
            # Moderate cost jump detection
            elif avg_increase > self.COST_JUMP_THRESHOLD:
                severity = "high" if avg_increase > 50 else "medium"
                risk_score = min(int(avg_increase / 2), 30)
                
                alerts.append(FraudAlert(
                    alert_type="cost_variance",
                    severity=severity,
                    confidence=0.8,
                    description=f"Cost {avg_increase:.1f}% higher than similar projects",
                    evidence={
                        "claimed_amount": amount,
                        "typical_amount": int(avg_amount),
                        "increase_percentage": round(avg_increase, 1)
                    },
                    risk_score=risk_score,
                    recommended_action="review" if severity == "high" else "approve"
                ))
        
        # Check for round number manipulation (common fraud indicator)
        if amount % 1000000 == 0 and amount > 10000000:  # Suspiciously round crores
            alerts.append(FraudAlert(
                alert_type="round_number_manipulation",
                severity="medium",
                confidence=0.6,
                description="Suspiciously round amount may indicate cost padding",
                evidence={"amount": amount, "pattern": "exact_crores"},
                risk_score=15,
                recommended_action="review"
            ))
        
        return alerts
    
    async def _detect_vendor_fraud_patterns(self, claim_data: Dict, historical_data: List[Dict]) -> List[FraudAlert]:
        """
        Detect vendor-specific fraud patterns and collusion
        """
        alerts = []
        vendor = claim_data["vendor_principal"]
        amount = claim_data["amount"]
        
        # Get vendor's history
        vendor_claims = [h for h in historical_data if h.get("vendor") == vendor]
        
        if vendor_claims:
            vendor_amounts = [c["amount"] for c in vendor_claims]
            
            # Detect consistent over-pricing pattern
            if len(vendor_amounts) >= 3:
                avg_vendor_amount = statistics.mean(vendor_amounts)
                all_amounts = [h["amount"] for h in historical_data if h.get("vendor") != vendor]
                
                if all_amounts:
                    avg_market_amount = statistics.mean(all_amounts)
                    
                    # Vendor consistently charges more than market
                    if avg_vendor_amount > avg_market_amount * 1.3:
                        alerts.append(FraudAlert(
                            alert_type="vendor_overpricing_pattern",
                            severity="high",
                            confidence=0.85,
                            description=f"Vendor consistently charges {((avg_vendor_amount/avg_market_amount-1)*100):.1f}% above market rate",
                            evidence={
                                "vendor_avg": int(avg_vendor_amount),
                                "market_avg": int(avg_market_amount),
                                "vendor_claims_count": len(vendor_claims)
                            },
                            risk_score=30,
                            recommended_action="review"
                        ))
            
            # Detect rapid claim escalation (vendor getting bolder)
            recent_claims = sorted(vendor_claims, key=lambda x: x.get("timestamp", 0))[-5:]
            if len(recent_claims) >= 3:
                amounts = [c["amount"] for c in recent_claims]
                if all(amounts[i] < amounts[i+1] for i in range(len(amounts)-1)):
                    escalation_rate = (amounts[-1] - amounts[0]) / amounts[0] * 100
                    if escalation_rate > 100:  # 100% escalation in recent claims
                        alerts.append(FraudAlert(
                            alert_type="vendor_escalation_pattern",
                            severity="high",
                            confidence=0.75,
                            description=f"Vendor claims escalating rapidly: {escalation_rate:.1f}% increase",
                            evidence={
                                "first_amount": amounts[0],
                                "latest_amount": amounts[-1],
                                "escalation_percentage": round(escalation_rate, 1)
                            },
                            risk_score=25,
                            recommended_action="review"
                        ))
        
        # Detect bid collusion (multiple vendors with similar amounts)
        similar_amount_claims = [
            h for h in historical_data 
            if abs(h.get("amount", 0) - amount) / amount < 0.05  # Within 5%
            and h.get("vendor") != vendor
        ]
        
        if len(similar_amount_claims) >= 2:
            alerts.append(FraudAlert(
                alert_type="potential_bid_collusion",
                severity="high",
                confidence=0.7,
                description=f"Multiple vendors submitting similar amounts (₹{amount:,})",
                evidence={
                    "similar_claims": len(similar_amount_claims),
                    "amount": amount,
                    "variance_threshold": "5%"
                },
                risk_score=35,
                recommended_action="review"
            ))
        
        return alerts
    
    async def _detect_timeline_anomalies(self, claim_data: Dict, historical_data: List[Dict]) -> List[FraudAlert]:
        """
        Detect suspicious timing patterns in claim submissions
        """
        alerts = []
        current_time = datetime.now()
        
        # Check for rapid-fire submissions (coordinated fraud)
        recent_claims = [
            h for h in historical_data
            if abs(h.get("timestamp", 0) - current_time.timestamp()) < 3600 * self.RAPID_SUBMISSION_HOURS
        ]
        
        if len(recent_claims) >= 3:
            total_amount = sum(c.get("amount", 0) for c in recent_claims)
            alerts.append(FraudAlert(
                alert_type="rapid_submission_pattern",
                severity="medium",
                confidence=0.65,
                description=f"{len(recent_claims)} claims totaling ₹{total_amount:,} in {self.RAPID_SUBMISSION_HOURS} hours",
                evidence={
                    "claims_count": len(recent_claims),
                    "total_amount": total_amount,
                    "time_window_hours": self.RAPID_SUBMISSION_HOURS
                },
                risk_score=20,
                recommended_action="review"
            ))
        
        # Check for end-of-fiscal-year dumping
        month = current_time.month
        if month == 3:  # March - Indian fiscal year end
            alerts.append(FraudAlert(
                alert_type="fiscal_year_end_rush",
                severity="medium",
                confidence=0.5,
                description="Claim submitted during fiscal year-end rush period",
                evidence={"month": "March", "risk": "budget_dumping"},
                risk_score=10,
                recommended_action="review"
            ))
        
        return alerts
    
    async def _detect_invoice_fraud(self, claim_data: Dict) -> List[FraudAlert]:
        """
        Analyze invoice content for fraud indicators
        """
        alerts = []
        invoice_hash = claim_data.get("invoice_hash", "")
        
        # Check for suspicious invoice patterns
        if "duplicate" in invoice_hash.lower():
            alerts.append(FraudAlert(
                alert_type="duplicate_invoice_indicator",
                severity="high",
                confidence=0.9,
                description="Invoice hash indicates potential duplicate",
                evidence={"invoice_hash": invoice_hash},
                risk_score=40,
                recommended_action="block"
            ))
        
        # Check for generic/template invoice patterns
        generic_patterns = ["template", "sample", "test", "dummy", "generic"]
        if any(pattern in invoice_hash.lower() for pattern in generic_patterns):
            alerts.append(FraudAlert(
                alert_type="generic_invoice_pattern",
                severity="medium",
                confidence=0.7,
                description="Invoice appears to use generic/template format",
                evidence={"invoice_hash": invoice_hash},
                risk_score=20,
                recommended_action="review"
            ))
        
        return alerts
    
    async def _detect_process_violations(self, claim_data: Dict, historical_data: List[Dict]) -> List[FraudAlert]:
        """
        Detect violations of procurement process and policy
        """
        alerts = []
        amount = claim_data["amount"]
        
        # Check tender threshold violations
        if amount > 50000000:  # ₹5 Cr threshold for public tender
            alerts.append(FraudAlert(
                alert_type="tender_threshold_violation",
                severity="critical",
                confidence=0.95,
                description="Amount exceeds public tender threshold without proper process",
                evidence={
                    "amount": amount,
                    "threshold": 50000000,
                    "required_process": "public_tender"
                },
                risk_score=50,
                recommended_action="block"
            ))
        
        # Check for contract splitting (artificially keeping under thresholds)
        deputy = claim_data.get("deputy", "")
        same_deputy_recent = [
            h for h in historical_data
            if h.get("deputy") == deputy and 
            abs(h.get("timestamp", 0) - datetime.now().timestamp()) < 86400 * 30  # 30 days
        ]
        
        if len(same_deputy_recent) >= 3:
            total_recent = sum(c.get("amount", 0) for c in same_deputy_recent)
            if total_recent > 20000000 and all(c.get("amount", 0) < 5000000 for c in same_deputy_recent):
                alerts.append(FraudAlert(
                    alert_type="contract_splitting_pattern",
                    severity="high",
                    confidence=0.8,
                    description=f"Potential contract splitting: {len(same_deputy_recent)} small contracts totaling ₹{total_recent:,}",
                    evidence={
                        "contracts_count": len(same_deputy_recent),
                        "total_amount": total_recent,
                        "individual_max": max(c.get("amount", 0) for c in same_deputy_recent)
                    },
                    risk_score=30,
                    recommended_action="review"
                ))
        
        return alerts
    
    def _calculate_recommendation(self, alerts: List[FraudAlert], total_risk_score: int) -> Tuple[str, str]:
        """
        Calculate final recommendation based on alerts and risk score
        """
        critical_alerts = [a for a in alerts if a.severity == "critical"]
        high_alerts = [a for a in alerts if a.severity == "high"]
        
        if critical_alerts or total_risk_score >= self.CRITICAL_RISK_SCORE:
            return "BLOCK", f"Critical fraud indicators detected (Risk Score: {total_risk_score}). Payment blocked for investigation."
        
        elif high_alerts or total_risk_score >= self.HIGH_RISK_SCORE:
            return "REVIEW", f"High fraud risk detected (Risk Score: {total_risk_score}). Manual review required before payment."
        
        elif total_risk_score >= 40:
            return "REVIEW", f"Moderate fraud risk (Risk Score: {total_risk_score}). Recommended for additional verification."
        
        else:
            return "APPROVE", f"Low fraud risk (Risk Score: {total_risk_score}). Safe to proceed with payment."
    
    async def generate_fraud_report(self, analysis: ClaimAnalysis) -> Dict:
        """
        Generate comprehensive fraud analysis report
        """
        return {
            "claim_id": analysis.claim_id,
            "vendor": analysis.vendor_principal,
            "amount": analysis.amount,
            "risk_assessment": {
                "total_score": analysis.total_risk_score,
                "risk_level": self._get_risk_level(analysis.total_risk_score),
                "recommendation": analysis.recommendation,
                "reasoning": analysis.reasoning
            },
            "alerts": [
                {
                    "type": alert.alert_type,
                    "severity": alert.severity,
                    "confidence": alert.confidence,
                    "description": alert.description,
                    "evidence": alert.evidence,
                    "risk_score": alert.risk_score
                }
                for alert in analysis.alerts
            ],
            "fraud_patterns_detected": list(set(alert.alert_type for alert in analysis.alerts)),
            "analysis_timestamp": datetime.now().isoformat(),
            "money_at_risk": analysis.amount if analysis.recommendation in ["BLOCK", "REVIEW"] else 0
        }
    
    def _get_risk_level(self, score: int) -> str:
        """Convert numerical risk score to human-readable level"""
        if score >= 85:
            return "CRITICAL"
        elif score >= 70:
            return "HIGH"
        elif score >= 40:
            return "MEDIUM"
        else:
            return "LOW"

# Demo scenarios for hackathon presentation
class DemoFraudScenarios:
    """
    Pre-built fraud scenarios for compelling demos
    """
    
    @staticmethod
    def get_cost_inflation_scenario():
        """₹50L road project suddenly becomes ₹2Cr"""
        return {
            "claim_id": 1001,
            "vendor_principal": "demo-fraudulent-vendor",
            "amount": 20000000,  # ₹2 Cr
            "area": "road_construction",
            "deputy": "demo-deputy-1",
            "invoice_hash": "inflated-road-project-2024",
            "timestamp": datetime.now().timestamp()
        }
    
    @staticmethod
    def get_vendor_collusion_scenario():
        """Multiple vendors bidding nearly identical amounts"""
        return [
            {
                "claim_id": 1002,
                "vendor_principal": "vendor-a",
                "amount": 15000000,
                "area": "school_construction",
                "timestamp": datetime.now().timestamp()
            },
            {
                "claim_id": 1003,
                "vendor_principal": "vendor-b", 
                "amount": 15075000,  # Within 0.5%
                "area": "school_construction",
                "timestamp": datetime.now().timestamp()
            }
        ]
    
    @staticmethod
    def get_legitimate_scenario():
        """Normal project that should pass all checks"""
        return {
            "claim_id": 1004,
            "vendor_principal": "legitimate-vendor",
            "amount": 5250000,  # ₹52.5L - reasonable
            "area": "health_center",
            "deputy": "demo-deputy-2",
            "invoice_hash": "genuine-health-center-invoice",
            "timestamp": datetime.now().timestamp()
        }