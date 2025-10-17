# Data Types (`autonomous_fraud_engine/data/`)

## Overview

This directory defines the core data structures and type definitions used throughout the autonomous fraud detection engine. It provides strongly-typed models for fraud cases, transactions, system status, and health monitoring.

## Purpose

The data module ensures type safety and consistency across the autonomous fraud engine by:

- Defining standardized data structures for fraud cases and transactions
- Providing enums for fraud severity and system status
- Enabling type checking and validation
- Facilitating serialization and deserialization
- Supporting clear API contracts between components

## Contents

### Files

- **__init__.py** - Python package initialization
- **types.py** - Core data type definitions using dataclasses and enums

## Key Data Types

### FraudSeverity Enum

Categorizes fraud risk levels:

```python
class FraudSeverity(Enum):
    LOW = "low"          # Risk score < 0.30
    MEDIUM = "medium"    # Risk score 0.30-0.65
    HIGH = "high"        # Risk score 0.65-0.90
    CRITICAL = "critical" # Risk score > 0.90
```

### SystemStatus Enum

Represents system health states:

```python
class SystemStatus(Enum):
    HEALTHY = "healthy"      # All systems operational
    DEGRADED = "degraded"    # Performance issues detected
    CRITICAL = "critical"    # System failure or emergency
```

### FraudCase Dataclass

Represents a fraud investigation case:

```python
@dataclass
class FraudCase:
    case_id: str              # Unique case identifier
    vendor: str               # Vendor under investigation
    amount: float             # Transaction amount
    timestamp: datetime       # Case creation time
    risk_score: float         # Fraud risk score (0.0-1.0)
    evidence: Dict[str, Any]  # Collected evidence
```


### Transaction Dataclass

Represents a procurement transaction:

```python
@dataclass
class Transaction:
    transaction_id: str    # Unique transaction ID
    vendor: str            # Vendor name
    amount: float          # Transaction amount
    description: str       # Transaction description
    timestamp: datetime    # Transaction time
    status: str            # Transaction status
```

### HealthStatus Dataclass

Represents component health status:

```python
@dataclass
class HealthStatus:
    status: SystemStatus      # Current status (healthy/degraded/critical)
    details: Dict[str, Any]   # Detailed health metrics
    timestamp: datetime       # Status check time
```

## Usage Examples

### Creating a Fraud Case

```python
from app.autonomous_fraud_engine.data.types import FraudCase, FraudSeverity
from datetime import datetime

fraud_case = FraudCase(
    case_id="case_12345",
    vendor="ABC Construction",
    amount=500000.00,
    timestamp=datetime.now(),
    risk_score=0.87,
    evidence={
        "invoice_anomalies": ["duplicate_hash", "round_amount"],
        "vendor_flags": ["new_vendor", "high_frequency"],
        "timing_issues": ["rushed_approval"]
    }
)

# Determine severity
if fraud_case.risk_score >= 0.90:
    severity = FraudSeverity.CRITICAL
elif fraud_case.risk_score >= 0.65:
    severity = FraudSeverity.HIGH
```

### Health Status Reporting

```python
from app.autonomous_fraud_engine.data.types import HealthStatus, SystemStatus

health_status = HealthStatus(
    status=SystemStatus.DEGRADED,
    details={
        "component": "model_performance",
        "accuracy": 0.82,
        "expected_accuracy": 0.90,
        "issue": "accuracy_below_threshold"
    },
    timestamp=datetime.now()
)
```

## Related Documentation

- [Core Components](../core/README.md) - Components using these data types
- [Investigation Tools](../investigation/README.md) - Investigation data structures
- [Monitors](../monitors/README.md) - Health monitoring using these types
