import asyncio
import time
import random
import logging
from datetime import datetime
from typing import Dict, Any, Optional

from .audit import AutonomousAuditManager
from ..services.external import ICPBlockchainStorage, SLM
from .communication import AutonomousCommunicationManager

logger = logging.getLogger(__name__)

class AutonomousTransactionGuard:
    def __init__(self):
        self.response_time_target = 0.5  # 500ms
        self.blocked_transactions = []
        self.monitoring_active = True
        self.slm = SLM()

    async def autonomous_transaction_screening(self, transaction_data: Dict[str, Any]):
        start_time = time.time()

        # Comprehensive fraud analysis using SLM
        fraud_assessment = await self.comprehensive_fraud_analysis(transaction_data)

        processing_time = time.time() - start_time

        # Autonomous response based on risk
        risk_score = fraud_assessment.get("risk_score", 0.0)

        if risk_score >= 0.90:
            await self.block_transaction_immediately(transaction_data)
            await self.freeze_related_accounts(transaction_data.get("vendor"))
            await self.alert_law_enforcement(fraud_assessment)

        elif risk_score >= 0.70:
            await self.flag_for_manual_review(transaction_data, fraud_assessment)

        elif risk_score >= 0.50:
            await self.enable_enhanced_monitoring(transaction_data)

        # Ensure real-time performance
        if processing_time > self.response_time_target:
            logger.warning(f"Transaction screening exceeded target time: {processing_time:.3f}s")

        # Log transaction screening
        screening_record = {
            "transaction_id": transaction_data.get("transaction_id"),
            "processing_time": processing_time,
            "fraud_score": risk_score,
            "action_taken": self._determine_action(risk_score),
            "timestamp": datetime.now().isoformat()
        }

        audit_manager = AutonomousAuditManager()
        await audit_manager.log_autonomous_decision(screening_record)

    async def comprehensive_fraud_analysis(self, transaction_data: Dict[str, Any]) -> Dict[str, Any]:
        logger.info("Calling SLM for comprehensive fraud analysis...")
        
        serializable_transaction_data = transaction_data.copy()
        if 'timestamp' in serializable_transaction_data and isinstance(serializable_transaction_data['timestamp'], datetime):
            serializable_transaction_data['timestamp'] = serializable_transaction_data['timestamp'].isoformat()

        slm_assessment = await self.slm.analyze_with_context(
            document=serializable_transaction_data,
            context={}
        )
        
        slm_assessment['analysis_timestamp'] = datetime.now().isoformat()
        
        logger.info(f"SLM analysis complete. Risk score: {slm_assessment.get('risk_score')}, Reasoning: {slm_assessment.get('reasoning')}")
        
        return slm_assessment

    def _determine_action(self, risk_score: float) -> str:
        if risk_score >= 0.90:
            return "blocked"
        elif risk_score >= 0.70:
            return "flagged_for_review"
        elif risk_score >= 0.50:
            return "enhanced_monitoring"
        else:
            return "approved"

    async def block_transaction_immediately(self, transaction_data: Dict[str, Any]):
        transaction_id = transaction_data.get("transaction_id", "unknown")

        block_record = {
            "transaction_id": transaction_id,
            "blocked_at": datetime.now().isoformat(),
            "block_reason": "autonomous_fraud_prevention",
            "transaction_data": transaction_data
        }

        self.blocked_transactions.append(block_record)
        logger.critical(f"TRANSACTION BLOCKED AUTONOMOUSLY: {transaction_id}")

        # Store block record on blockchain
        blockchain_storage = ICPBlockchainStorage()
        await blockchain_storage.store_evidence(block_record)

    async def freeze_related_accounts(self, vendor: str):
        if vendor:
            logger.critical(f"FREEZING ACCOUNTS related to vendor: {vendor}")
            # Implementation for account freezing

    async def alert_law_enforcement(self, fraud_assessment: Dict[str, Any]):
        communication_manager = AutonomousCommunicationManager()
        incident_data = {
            "severity": "critical",
            "criminal_indicators": True,
            "fraud_assessment": fraud_assessment,
            "immediate_response_required": True
        }
        await communication_manager.autonomous_stakeholder_alerts(incident_data)

    async def flag_for_manual_review(self, transaction_data: Dict[str, Any], fraud_assessment: Dict[str, Any]):
        logger.warning(f"Transaction flagged for manual review: {transaction_data.get('transaction_id')}")
        # Implementation for manual review flagging

    async def enable_enhanced_monitoring(self, transaction_data: Dict[str, Any]):
        logger.info(f"Enhanced monitoring enabled for transaction: {transaction_data.get('transaction_id')}")
        # Implementation for enhanced monitoring

class AutonomousEthicsGuard:
    def __init__(self):
        self.boundaries = {
            "max_auto_block_amount": 10000000,  # 1 crore max auto-block
            "min_evidence_threshold": 3,  # Minimum evidence pieces
            "max_investigation_duration": 30,  # 30 days max
            "human_review_required_score": 0.95  # Scores above this need human review
        }

    def is_proportional(self, decision: Dict[str, Any]) -> bool:
        decision_severity = decision.get("severity", "low")
        risk_score = decision.get("risk_score", 0.0)
        amount_involved = decision.get("amount", 0)

        # Check proportionality rules
        if decision_severity == "critical" and risk_score < 0.8:
            return False  # Critical action requires high risk score

        if amount_involved > self.boundaries["max_auto_block_amount"] and decision.get("auto_executed"):
            return False  # Large amounts need human oversight

        return True

    def requires_human_review(self, risk_score: float) -> bool:
        return risk_score >= self.boundaries["human_review_required_score"]

    async def validate_autonomous_decision(self, fraud_assessment: Dict[str, Any]):
        # This is a placeholder for the actual validation logic
        logger.info(f"Validating ethical boundaries for decision on case {fraud_assessment.get('case_id')}")
        if not self.is_proportional(fraud_assessment):
            logger.warning("Decision may not be proportional.")
        if self.requires_human_review(fraud_assessment.get("risk_score", 0.0)):
            logger.warning("Decision requires human review.")
