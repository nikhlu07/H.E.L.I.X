# Utilities (`autonomous_fraud_engine/utils/`)

## Overview

This directory contains utility functions and helper classes used throughout the autonomous fraud engine. These utilities provide common functionality for pattern management, performance tracking, and data processing.

## Purpose

The utilities module provides reusable components for:

- **Pattern Management**: Storage and retrieval of fraud patterns
- **Performance Tracking**: Metrics collection and analysis
- **Data Processing**: Common data transformation operations
- **Helper Functions**: Shared utility functions across components

## Contents

### Files

- **__init__.py** - Python package initialization
- **helpers.py** - Utility functions and helper classes

## Key Utilities

### PatternMemoryBank

Stores and manages fraud detection patterns learned over time.

**Capabilities**:
- Pattern storage and retrieval
- Pattern weighting
- Pattern similarity matching
- Pattern evolution tracking

**Usage**:
```python
from app.autonomous_fraud_engine.utils.helpers import PatternMemoryBank

memory = PatternMemoryBank()

# Add fraud pattern
memory.add_pattern(
    pattern_type="fraud_invoice_manipulation",
    features={"round_amount": True, "duplicate_hash": True},
    weight=1.2
)

# Retrieve patterns
patterns = memory.get_patterns("fraud_invoice_manipulation")
```

### PerformanceTracker

Tracks system performance metrics over time.

**Metrics Tracked**:
- Request latency
- Model accuracy
- Throughput
- Error rates
- Resource utilization

**Usage**:
```python
from app.autonomous_fraud_engine.utils.helpers import PerformanceTracker

tracker = PerformanceTracker()

# Record metric
tracker.record_metric("model_accuracy", 0.89)

# Get statistics
stats = tracker.get_statistics("model_accuracy")
# Returns: {"mean": 0.87, "std": 0.03, "min": 0.82, "max": 0.91}
```

## Related Documentation

- [Core Components](../core/README.md) - Components using these utilities
- [Data Types](../data/README.md) - Data structures used by utilities
