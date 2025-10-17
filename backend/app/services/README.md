# Services (`app/services/`)

## Overview

This directory contains business logic services that orchestrate operations across multiple components, providing a clean separation between API endpoints and implementation details.

## Purpose

Services provide:
- Business logic encapsulation
- Multi-component orchestration
- Reusable functionality
- Transaction management
- External service integration

## Service Architecture

```
API Endpoints
    ↓
Service Layer (Business Logic)
    ↓
├─→ Database Operations
├─→ ICP Canister Calls
├─→ Fraud Detection
├─→ Authentication
└─→ External APIs
```

## Key Services

### FraudDetectionService

Orchestrates fraud analysis combining rules engine, ML models, and LLM analysis.

### UserManagementService

Handles user operations including role assignment, profile management, and permissions.

### TransactionService

Manages transaction lifecycle from submission to blockchain storage.

### NotificationService

Sends alerts and notifications via email, SMS, or webhooks.

## Usage Examples

### Service Pattern

```python
class TransactionService:
    def __init__(self):
        self.db = get_db()
        self.canister = CanisterService()
        self.fraud_detector = FraudDetectionService()
    
    async def process_transaction(self, transaction_data):
        # 1. Validate transaction
        # 2. Run fraud detection
        fraud_score = await self.fraud_detector.analyze(transaction_data)
        
        # 3. Store in database
        db_record = self.db.add(transaction_data)
        
        # 4. Store on blockchain
        await self.canister.store_transaction(transaction_data)
        
        # 5. Generate alerts if needed
        if fraud_score > 70:
            await self.notify_fraud_team(transaction_data)
        
        return db_record
```

## Related Documentation

- [API Layer](../api/README.md) - API endpoints using services
- [Fraud Detection](../fraud/README.md) - Fraud detection service
- [ICP Integration](../icp/README.md) - Blockchain service integration
