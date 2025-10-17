from dataclasses import dataclass
from enum import Enum
from datetime import datetime
from typing import Dict, Any

class FraudSeverity(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class SystemStatus(Enum):
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    CRITICAL = "critical"


@dataclass
class FraudCase:
    case_id: str
    vendor: str
    amount: float
    timestamp: datetime
    risk_score: float
    evidence: Dict[str, Any]


@dataclass
class Transaction:
    transaction_id: str
    vendor: str
    amount: float
    description: str
    timestamp: datetime
    status: str


@dataclass
class HealthStatus:
    status: SystemStatus
    details: Dict[str, Any]
    timestamp: datetime
