# Services (`autonomous_fraud_engine/services/`)

## Overview

This directory contains service integration modules that connect the autonomous fraud engine to external systems (blockchain, notifications) and internal components (SLM, vector store).

## Purpose

The services modules provide integration with:

- **External Services**: Blockchain storage, notification systems, law enforcement APIs
- **Internal Services**: Small Language Model (SLM), vector database, pattern storage
- **Communication**: Email, SMS, webhook notifications
- **Data Persistence**: Immutable evidence storage on ICP blockchain

## Contents

### Files

- **__init__.py** - Python package initialization
- **external.py** - External service integrations (blockchain, notifications)
- **internal.py** - Internal service integrations (SLM, vector store)

## External Services

### ICPBlockchainStorage

Stores evidence and audit logs immutably on Internet Computer blockchain.

**Capabilities**:
- Evidence preservation
- Audit trail storage
- Transaction verification
- Tamper-proof records

**Usage**:
```python
from app.autonomous_fraud_engine.services.external import ICPBlockchainStorage

blockchain = ICPBlockchainStorage()

evidence = {
    "case_id": "case_123",
    "evidence_type": "transaction_block",
    "data": {...}
}

await blockchain.store_evidence(evidence)
```

### NotificationService

Sends alerts and notifications to stakeholders.

**Channels**:
- Email notifications
- SMS alerts
- Webhook callbacks
- In-app notifications

**Usage**:
```python
from app.autonomous_fraud_engine.services.external import NotificationService

notifier = NotificationService()

await notifier.send_alert(
    recipient="fraud-team@example.com",
    severity="critical",
    message="High-risk fraud detected",
    case_id="case_123"
)
```


## Internal Services

### LLM/SLM Service

Interfaces with Language Models (both Small and Large) for fraud analysis. Supports multiple models including Gemma3 (SLM), GPT-4, Claude, and other LLMs.

**Supported Models**:
- **Gemma3 (4B)** - Small Language Model via Ollama (default for MVP)
- **GPT-4** - OpenAI's large language model (production upgrade)
- **Claude** - Anthropic's language model (alternative)
- **Custom LLMs** - Extensible architecture for other models

**Capabilities**:
- Fraud risk assessment with contextual reasoning
- Pattern recognition and anomaly detection
- Evidence synthesis and analysis
- Natural language explanations
- Multi-model fallback support

**Usage**:
```python
from app.autonomous_fraud_engine.services.internal import LLMService

# Initialize with preferred model
llm = LLMService(model="gemma3")  # or "gpt-4", "claude"

analysis = await llm.analyze_fraud_case({
    "transaction_id": "tx_123",
    "amount": 500000,
    "vendor": "vendor_456",
    "features": {...}
})

# Returns fraud probability and reasoning
# {
#   "fraud_probability": 0.87,
#   "reasoning": "Multiple fraud indicators detected...",
#   "confidence": 0.92,
#   "model_used": "gemma3"
# }
```

### VectorStoreService

Manages vector embeddings for similarity search and pattern matching.

**Capabilities**:
- Historical case storage
- Similarity search
- Pattern retrieval
- Embedding generation

**Usage**:
```python
from app.autonomous_fraud_engine.services.internal import VectorStoreService

vector_store = VectorStoreService()

# Find similar historical cases
similar_cases = await vector_store.find_similar(
    case_features={...},
    top_k=5
)
```

## Service Integration Architecture

```
Autonomous Core Components
    ↓
┌─────────────────────────────────┐
│   Service Layer                 │
├─────────────────────────────────┤
│ External Services:              │
│  - ICP Blockchain               │
│  - Notification System          │
│  - Law Enforcement API          │
│                                 │
│ Internal Services:              │
│  - SLM (Gemma3)                 │
│  - Vector Store (FAISS)         │
│  - Pattern Memory               │
└─────────────────────────────────┘
```

## Related Documentation

- [Core Components](../core/README.md) - Components using these services
- [ICP Integration](../../icp/README.md) - Blockchain integration details
- [Fraud Engine](../../fraud_engine/README.md) - SLM integration
