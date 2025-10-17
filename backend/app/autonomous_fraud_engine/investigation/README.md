# Investigation Tools (`autonomous_fraud_engine/investigation/`)

## Overview

This directory contains specialized investigation tools used by the autonomous investigator to gather evidence, analyze patterns, and build fraud cases. These tools enable automated, intelligent investigation of suspicious transactions.

## Purpose

The investigation tools provide automated capabilities for:

- **Document Analysis**: Semantic analysis of procurement documents for anomalies
- **Network Mapping**: Vendor relationship and collusion detection
- **Financial Tracing**: Money flow analysis and suspicious transaction identification
- **Pattern Recognition**: Historical pattern matching and fraud indicator detection
- **Evidence Collection**: Automated gathering and organization of investigation evidence

## Contents

### Files

- **__init__.py** - Python package initialization
- **tools.py** - Investigation tool implementations
- **README.md** - This documentation file

## Investigation Tools

### SemanticDocumentAnalyzer

Analyzes procurement documents using semantic understanding to detect anomalies.

**Capabilities**:
- Document authenticity verification
- Signature consistency checking
- Date and timeline validation
- Template deviation detection
- Cross-document consistency analysis

**Usage**:
```python
from app.autonomous_fraud_engine.investigation.tools import SemanticDocumentAnalyzer

analyzer = SemanticDocumentAnalyzer()

documents = [
    {"id": "invoice_001", "content": "...", "signatures": [...]},
    {"id": "contract_002", "content": "...", "signatures": [...]}
]

analysis = await analyzer.analyze(documents)
# Returns:
# {
#     "total_documents": 2,
#     "anomalies_detected": [
#         {
#             "document_id": "invoice_001",
#             "anomaly_type": "signature_mismatch",
#             "confidence": 0.85
#         }
#     ],
#     "consistency_score": 0.78,
#     "authenticity_score": 0.92
# }
```


### VendorNetworkAnalyzer

Maps vendor relationships and detects potential collusion patterns.

**Capabilities**:
- Vendor relationship mapping
- Collusion indicator detection
- Network centrality analysis
- Bid coordination pattern recognition
- Shared resource identification

**Usage**:
```python
from app.autonomous_fraud_engine.investigation.tools import VendorNetworkAnalyzer

analyzer = VendorNetworkAnalyzer()

network_analysis = await analyzer.map_relationships("vendor_123")
# Returns:
# {
#     "primary_vendor": "vendor_123",
#     "related_vendors": ["vendor_456", "vendor_789"],
#     "relationship_strength": {"vendor_456": 0.85, "vendor_789": 0.62},
#     "collusion_indicators": [
#         {
#             "vendor_pair": ["vendor_123", "vendor_456"],
#             "indicator_type": "bid_timing",
#             "strength": 0.78
#         }
#     ],
#     "network_centrality": 0.65
# }
```

### MoneyFlowTracer

Traces payment flows to identify suspicious financial patterns.

**Capabilities**:
- Payment trail reconstruction
- Multi-hop transaction tracking
- Offshore transfer detection
- Round amount flagging
- Timing anomaly identification

**Usage**:
```python
from app.autonomous_fraud_engine.investigation.tools import MoneyFlowTracer

tracer = MoneyFlowTracer()

case = {
    "case_id": "case_789",
    "amount": 500000,
    "vendor": "vendor_123"
}

payment_trail = await tracer.trace_payments(case)
# Returns:
# {
#     "case_id": "case_789",
#     "total_amount_traced": 500000,
#     "payment_hops": [
#         {
#             "hop_id": 1,
#             "from_account": "account_1234",
#             "to_account": "account_5678",
#             "amount": 500000,
#             "timestamp": "2024-01-15T10:30:00"
#         }
#     ],
#     "suspicious_transactions": [
#         {
#             "transaction_id": "tx_1",
#             "suspicion_type": "round_amount",
#             "risk_score": 0.75
#         }
#     ],
#     "flow_complexity": 0.68
# }
```

## Integration with Autonomous Investigator

These tools are orchestrated by the AutonomousInvestigator:

```python
from app.autonomous_fraud_engine.core.investigator import AutonomousInvestigator

investigator = AutonomousInvestigator()

# Tools are automatically used during investigation
investigation_result = await investigator.conduct_autonomous_investigation(fraud_case)

# Investigation workflow:
# 1. Document analysis using SemanticDocumentAnalyzer
# 2. Network mapping using VendorNetworkAnalyzer
# 3. Financial tracing using MoneyFlowTracer
# 4. Evidence compilation and report generation
```

## Related Documentation

- [Core Investigator](../core/README.md) - Autonomous investigator component
- [Data Types](../data/README.md) - Investigation data structures
- [Services](../services/README.md) - External service integrations
