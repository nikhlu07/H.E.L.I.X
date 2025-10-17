import asyncio
import random
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, List

from ..utils.helpers import OverrideProtocols, EscalationManager
from .communication import AutonomousCommunicationManager
from .audit import AutonomousAuditManager

logger = logging.getLogger(__name__)

class HumanOverrideManager:
    def __init__(self):
        self.override_protocols = OverrideProtocols()
        self.escalation_manager = EscalationManager()
        self.override_requests = []
        self.approved_overrides = []

    async def enable_human_review(self, autonomous_decision: Dict[str, Any]):
        if autonomous_decision.get("reviewable", True):
            review_case = await self.create_human_review_case(autonomous_decision)
            await self.notify_appropriate_officials(review_case)

            if review_case.get("requires_pause", False):
                await self.pause_autonomous_execution(autonomous_decision)

            logger.info(f"Human review enabled for decision: {autonomous_decision.get('decision_id')}")

    async def create_human_review_case(self, decision: Dict[str, Any]) -> Dict[str, Any]:
        review_case = {
            "review_case_id": f"review_{int(time.time())}_{random.randint(1000, 9999)}",
            "original_decision": decision,
            "review_priority": self._determine_review_priority(decision),
            "requires_pause": decision.get("risk_score", 0) > 0.95,
            "review_deadline": (datetime.now() + timedelta(hours=24)).isoformat(),
            "reviewer_required_role": self._determine_required_reviewer_role(decision),
            "created_at": datetime.now().isoformat(),
            "status": "pending_review"
        }

        self.override_requests.append(review_case)
        return review_case

    def _determine_review_priority(self, decision: Dict[str, Any]) -> str:
        risk_score = decision.get("risk_score", 0)
        amount = decision.get("amount", 0)

        if risk_score > 0.9 or amount > 50000000:  # 5 crore
            return "urgent"
        elif risk_score > 0.7 or amount > 10000000:  # 1 crore
            return "high"
        else:
            return "normal"

    def _determine_required_reviewer_role(self, decision: Dict[str, Any]) -> str:
        if decision.get("criminal_indicators"):
            return "investigator"
        elif decision.get("amount", 0) > 50000000:
            return "government_official"
        else:
            return "deputy"

    async def notify_appropriate_officials(self, review_case: Dict[str, Any]):
        required_role = review_case["reviewer_required_role"]
        priority = review_case["review_priority"]

        notification_message = {
            "subject": f"Human Review Required - {priority.upper()} Priority",
            "review_case": review_case,
            "deadline": review_case["review_deadline"],
            "override_authority": True
        }

        communication_manager = AutonomousCommunicationManager()
        recipients = self._get_reviewers_for_role(required_role)

        await communication_manager.notification_engine.notify(recipients, notification_message)
        logger.info(f"Review request sent to {required_role} officials")

    def _get_reviewers_for_role(self, role: str) -> List[str]:
        reviewer_mapping = {
            "government_official": ["senior_gov_official", "finance_secretary"],
            "investigator": ["chief_investigator", "fraud_specialist"],
            "deputy": ["district_collector", "project_manager"]
        }
        return reviewer_mapping.get(role, ["default_reviewer"])

    async def pause_autonomous_execution(self, decision: Dict[str, Any]):
        decision_id = decision.get("decision_id", "unknown")
        logger.warning(f"PAUSING AUTONOMOUS EXECUTION for decision: {decision_id}")

        # Implementation to pause the specific autonomous action
        pause_record = {
            "decision_id": decision_id,
            "paused_at": datetime.now().isoformat(),
            "reason": "human_review_required",
            "automatic_resume": False
        }

        # Log the pause for audit
        audit_manager = AutonomousAuditManager()
        await audit_manager.log_autonomous_decision({
            "action_taken": "execution_paused",
            "pause_record": pause_record
        })

    async def process_human_override(self, override_request: Dict[str, Any]) -> Dict[str, Any]:
        """Process a human override of an autonomous decision"""
        override_decision = override_request.get("override_decision")  # "approve", "reject", "modify"
        original_decision = override_request.get
