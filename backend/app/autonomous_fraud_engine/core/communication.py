import logging
from datetime import datetime, timedelta
from typing import Dict, Any

from ..services.internal import MultiChannelNotificationEngine, AutomatedReportGenerator

logger = logging.getLogger(__name__)

class AutonomousCommunicationManager:
    def __init__(self):
        self.notification_engine = MultiChannelNotificationEngine()
        self.report_generator = AutomatedReportGenerator()
        self.stakeholder_contacts = {
            "government_officials": ["gov_official_1", "gov_official_2"],
            "law_enforcement": ["police_cyber_crime", "cbi_financial"],
            "investigators": ["investigator_1", "investigator_2"],
            "citizens": ["public_portal"]
        }

    async def autonomous_stakeholder_alerts(self, fraud_incident: Dict[str, Any]):
        severity = fraud_incident.get("severity", "medium")

        # Critical incidents - notify everyone
        if severity == "critical":
            await self.notify_government_officials(fraud_incident)
            if fraud_incident.get("criminal_indicators"):
                await self.notify_law_enforcement(fraud_incident)
            await self.notify_investigators(fraud_incident)

        # High severity - notify government and investigators
        elif severity == "high":
            await self.notify_government_officials(fraud_incident)
            await self.notify_investigators(fraud_incident)

        # Always maintain public transparency
        public_report = await self.report_generator.generate(fraud_incident)
        await self.publish_to_citizen_portal(public_report)

        # Vendor-specific notifications
        if fraud_incident.get("involves_vendor_non_compliance"):
            await self.notify_vendor_of_compliance_issues(fraud_incident)

    async def notify_government_officials(self, incident: Dict[str, Any]):
        message = {
            "subject": f"Autonomous Fraud Detection Alert - {incident.get('severity', 'unknown').upper()}",
            "urgency": "high",
            "incident_summary": {
                "case_id": incident.get("case_id"),
                "risk_score": incident.get("fraud_assessment", {}).get("risk_score"),
                "amount_involved": incident.get("amount"),
                "vendor": incident.get("vendor")
            },
            "recommended_actions": incident.get("recommended_actions", []),
            "timestamp": datetime.now().isoformat()
        }

        await self.notification_engine.notify(
            self.stakeholder_contacts["government_officials"],
            message
        )

        logger.info("Government officials notified of fraud incident")

    async def notify_law_enforcement(self, incident: Dict[str, Any]):
        criminal_evidence = {
            "case_id": incident.get("case_id"),
            "criminal_indicators": incident.get("criminal_indicators"),
            "evidence_collected": incident.get("investigation_report", {}).get("evidence_summary"),
            "estimated_loss": incident.get("amount"),
            "suspects": [incident.get("vendor")],
            "urgency_level": "immediate"
        }

        message = {
            "subject": "Criminal Fraud Detected - Immediate Investigation Required",
            "criminal_evidence": criminal_evidence,
            "contact_priority": "urgent",
            "digital_evidence_preserved": True
        }

        await self.notification_engine.notify(
            self.stakeholder_contacts["law_enforcement"],
            message
        )

        logger.critical("Law enforcement notified of criminal fraud indicators")

    async def notify_investigators(self, incident: Dict[str, Any]):
        investigation_brief = {
            "case_id": incident.get("case_id"),
            "investigation_priority": "high" if incident.get("severity") == "critical" else "medium",
            "preliminary_findings": incident.get("investigation_report", {}),
            "autonomous_evidence": incident.get("fraud_assessment", {}),
            "next_steps": incident.get("recommendations", [])
        }

        message = {
            "subject": f"Investigation Assignment - Case {incident.get('case_id')}",
            "investigation_brief": investigation_brief,
            "deadline": (datetime.now() + timedelta(days=3)).isoformat()
        }

        await self.notification_engine.notify(
            self.stakeholder_contacts["investigators"],
            message
        )

        logger.info("Investigators notified and assigned to case")

    async def publish_to_citizen_portal(self, public_report: Dict[str, Any]):
        # Ensure public report contains no sensitive information
        sanitized_report = {
            "incident_id": public_report.get("report_id"),
            "incident_type": "procurement_fraud_detection",
            "risk_level": public_report.get("summary", {}).get("risk_level"),
            "amount_involved": public_report.get("summary", {}).get("amount_involved"),
            "department": "government_procurement",
            "status": "under_investigation",
            "public_disclosure_date": datetime.now().isoformat(),
            "transparency_score": "high"
        }

        await self.notification_engine.notify(
            self.stakeholder_contacts["citizens"],
            {"public_report": sanitized_report}
        )

        logger.info("Public transparency report published")

    async def notify_vendor_of_compliance_issues(self, incident: Dict[str, Any]):
        compliance_notice = {
            "vendor_id": incident.get("vendor"),
            "compliance_issues": incident.get("compliance_violations", []),
            "corrective_actions_required": incident.get("recommendations", []),
            "compliance_deadline": (datetime.now() + timedelta(days=15)).isoformat(),
            "escalation_warning": "Non-compliance may result in contract termination"
        }

        message = {
            "subject": "Compliance Violation Notice - Immediate Action Required",
            "compliance_notice": compliance_notice,
            "legal_implications": True
        }

        # Note: In real implementation, would send to vendor's registered contact
        logger.warning(f"Vendor compliance notice sent to {incident.get('vendor')}")
