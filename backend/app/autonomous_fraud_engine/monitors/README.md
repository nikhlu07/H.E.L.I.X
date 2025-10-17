# Health Monitors (`autonomous_fraud_engine/monitors/`)

## Overview

This directory contains health monitoring components that continuously track system performance, data quality, and fraud detection accuracy. These monitors feed into the self-healing pipeline to enable autonomous remediation.

## Purpose

The health monitors provide real-time system observability for:

- **Model Performance Tracking**: Monitor fraud detection model accuracy and effectiveness
- **Data Quality Assurance**: Validate input data quality and completeness
- **Latency Monitoring**: Track system response times and performance
- **Accuracy Measurement**: Measure fraud detection precision and recall
- **Anomaly Detection**: Identify system degradation before failure

## Contents

### Files

- **__init__.py** - Python package initialization
- **health.py** - Health monitor implementations

## Health Monitor Components

### ModelHealthMonitor

Monitors fraud detection model performance and triggers retraining when needed.

**Metrics Tracked**:
- Model accuracy
- Prediction confidence
- False positive rate
- False negative rate
- Model drift detection

**Usage**:
```python
from app.autonomous_fraud_engine.monitors.health import ModelHealthMonitor

monitor = ModelHealthMonitor()
status = await monitor.check_health()

# Returns HealthStatus with:
# - status: HEALTHY/DEGRADED/CRITICAL
# - details: {"accuracy": 0.87, "drift_score": 0.12}
# - timestamp: datetime.now()
```

### DataQualityMonitor

Validates input data quality and completeness.

**Checks Performed**:
- Missing field detection
- Data type validation
- Value range verification
- Duplicate detection
- Consistency checking

**Usage**:
```python
from app.autonomous_fraud_engine.monitors.health import DataQualityMonitor

monitor = DataQualityMonitor()
status = await monitor.check_health()

# Triggers remediation if data quality issues detected
```


### LatencyMonitor

Tracks system response times and performance bottlenecks.

**Metrics Tracked**:
- Request processing time
- Model inference latency
- Database query time
- API response time
- Queue depth

**Usage**:
```python
from app.autonomous_fraud_engine.monitors.health import LatencyMonitor

monitor = LatencyMonitor()
status = await monitor.check_health()

# Triggers resource scaling if latency exceeds thresholds
```

### AccuracyMonitor

Measures fraud detection accuracy over time.

**Metrics Tracked**:
- True positive rate
- True negative rate
- Precision
- Recall
- F1 score

**Usage**:
```python
from app.autonomous_fraud_engine.monitors.health import AccuracyMonitor

monitor = AccuracyMonitor()
status = await monitor.check_health()

# Triggers threshold recalibration if accuracy degrades
```

## Integration with Self-Healing

Monitors are used by the SelfHealingFraudPipeline:

```python
from app.autonomous_fraud_engine.core.self_healing import SelfHealingFraudPipeline

pipeline = SelfHealingFraudPipeline()

# Monitors are automatically checked
health_results = await pipeline.autonomous_health_check()

# Automatic remediation based on monitor results:
# - DEGRADED → auto_remediate()
# - CRITICAL → emergency_failover()
```

## Related Documentation

- [Self-Healing Pipeline](../core/README.md) - Self-healing component using monitors
- [Data Types](../data/README.md) - HealthStatus and SystemStatus types
