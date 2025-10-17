# ICP Integration (`app/icp/`)

## Overview

This directory contains the Internet Computer Protocol (ICP) integration layer for H.E.L.I.X., enabling blockchain-based data storage, immutable audit trails, and decentralized authentication. It provides the bridge between the FastAPI backend and ICP smart contracts (canisters).

## Purpose

The ICP integration module provides:

- **Blockchain Storage**: Immutable storage of transactions, fraud scores, and audit logs
- **Canister Communication**: Direct interaction with Motoko smart contracts
- **Agent Management**: ICP agent configuration and connection handling
- **Identity Management**: Principal-based identity verification
- **Data Persistence**: Permanent, tamper-proof record keeping
- **Public Transparency**: Publicly verifiable audit trails

## Contents

### Files

- **__init__.py** - Python package initialization
- **agent.py** - ICP agent setup and configuration management
- **canister_calls.py** - Canister service for smart contract interactions

## Architecture Context

The ICP integration connects H.E.L.I.X. to the Internet Computer blockchain:

```
FastAPI Backend
    ↓
ICP Agent (agent.py)
    ↓
Canister Service (canister_calls.py)
    ↓
ICP Network (Local/Testnet/Mainnet)
    ↓
Motoko Canisters (Smart Contracts)
    ↓
Blockchain Storage (Immutable)
```

## Key Components

### ICPAgent (`agent.py`)

Manages connection to ICP network and canister communication.

**Configuration**:
```python
@dataclass
class ICPConfig:
    network_url: str              # ICP network endpoint
    canister_id: str              # Target canister ID
    identity_pem_path: Optional[str]  # Identity file path
    fetch_root_key: bool          # True for local, False for mainnet
```

**Initialization**:
```python
from app.icp.agent import ICPAgent, ICPConfig

config = ICPConfig(
    network_url="http://127.0.0.1:4943",  # Local dfx
    canister_id="rdmx6-jaaaa-aaaah-qcaiq-cai",
    fetch_root_key=True  # Required for local development
)

agent = ICPAgent(config)
await agent.initialize()
```


### CanisterService (`canister_calls.py`)

Provides high-level interface for canister interactions.

**Data Models**:
```python
@dataclass
class ClaimData:
    claim_id: int
    vendor: str
    amount: int
    invoice_hash: str
    deputy: str
    ai_approved: bool
    flagged: bool
    paid: bool
    fraud_score: Optional[int]
    challenge_count: int

@dataclass
class BudgetData:
    budget_id: int
    amount: int
    purpose: str
    allocated: int
    remaining: int

@dataclass
class FraudAlert:
    claim_id: int
    alert_type: str
    severity: str
    description: str
    timestamp: int
    resolved: bool
```

## Usage Examples

### Initializing ICP Connection

```python
from app.icp.agent import get_default_agent

# Get configured agent
agent = await get_default_agent()

# Agent is now ready for canister calls
```

### Storing Fraud Score on Blockchain

```python
from app.icp.canister_calls import CanisterService

canister_service = CanisterService()

# Update fraud score immutably
await canister_service.update_fraud_score(
    claim_id=1001,
    fraud_score=85
)

# Score is now permanently stored on blockchain
```

### Creating Fraud Alert

```python
# Generate fraud alert on blockchain
await canister_service.add_fraud_alert(
    claim_id=1001,
    alert_type="high_fraud_risk",
    severity="critical",
    description="Multiple fraud indicators detected"
)

# Alert is immutable and publicly verifiable
```

### Querying Claim Data

```python
# Retrieve claim from blockchain
claim = await canister_service.get_claim(claim_id=1001)

# Access claim data
print(f"Vendor: {claim.vendor}")
print(f"Amount: {claim.amount}")
print(f"Fraud Score: {claim.fraud_score}")
print(f"Flagged: {claim.flagged}")
```

### Role Verification

```python
# Check if principal is main government
is_main_gov = await canister_service.is_main_government(
    principal_id="rdmx6-jaaaa-aaaah-qcaiq-cai"
)

# Check if principal is state head
is_state_head = await canister_service.is_state_head(
    principal_id="renrk-eyaaa-aaaah-qcaia-cai"
)

# Check if principal is deputy
is_deputy = await canister_service.is_deputy(
    principal_id="rrkah-fqaaa-aaaah-qcaiq-cai"
)

# Check if principal is vendor
is_vendor = await canister_service.is_vendor(
    principal_id="radvj-tiaaa-aaaah-qcaiq-cai"
)
```

### Budget Management

```python
# Create budget on blockchain
budget_id = await canister_service.create_budget(
    amount=10000000,  # 10M
    purpose="Infrastructure Development Q1 2025"
)

# Get budget details
budget = await canister_service.get_budget(budget_id)

print(f"Total: {budget.amount}")
print(f"Allocated: {budget.allocated}")
print(f"Remaining: {budget.remaining}")
```

### System Statistics

```python
# Get system-wide statistics
stats = await canister_service.get_system_stats()

print(f"Total Budget: {stats.total_budget}")
print(f"Active Claims: {stats.active_claims}")
print(f"Flagged Claims: {stats.flagged_claims}")
print(f"Total Challenges: {stats.total_challenges}")
print(f"Vendor Count: {stats.vendor_count}")
```

## Network Configuration

### Local Development (dfx)

```python
# Configuration for local dfx
ICP_NETWORK_URL = "http://127.0.0.1:4943"
ICP_CANISTER_ID = "rdmx6-jaaaa-aaaah-qcaiq-cai"
ICP_FETCH_ROOT_KEY = True  # Required for local

# Start local dfx
# dfx start --clean --background
# dfx deploy
```

### Testnet

```python
# Configuration for ICP testnet
ICP_NETWORK_URL = "https://ic0.app"
ICP_CANISTER_ID = "your-testnet-canister-id"
ICP_FETCH_ROOT_KEY = False
```

### Mainnet (Production)

```python
# Configuration for ICP mainnet
ICP_NETWORK_URL = "https://ic0.app"
ICP_CANISTER_ID = "your-mainnet-canister-id"
ICP_FETCH_ROOT_KEY = False
```

## Demo Mode

For development without ICP dependencies:

```python
# Enable demo mode in settings
demo_mode = True

# CanisterService will use mock data
canister_service = CanisterService()

# All calls return demo data instead of blockchain queries
claim = await canister_service.get_claim(1)
# Returns demo claim data
```

## Error Handling

### Connection Errors

```python
from app.utils.exceptions import ICPError

try:
    agent = await get_default_agent()
except ICPError as e:
    logger.error(f"ICP connection failed: {e}")
    # Fallback to demo mode or retry
```

### Canister Call Errors

```python
try:
    await canister_service.update_fraud_score(claim_id, score)
except Exception as e:
    logger.error(f"Canister call failed: {e}")
    # Log error, retry, or alert admin
```

## Identity Management

### Anonymous Identity

```python
# Read-only operations
identity = Identity()  # Anonymous
agent = Agent(identity, host=network_url)
```

### PEM File Identity

```python
# Write operations require identity
identity = Identity.from_pem_file("identity.pem")
agent = Agent(identity, host=network_url)
```

### Principal Verification

```python
from ic.principal import Principal

# Convert string to Principal
principal = Principal.from_str("rdmx6-jaaaa-aaaah-qcaiq-cai")

# Verify principal format
is_valid = principal.is_valid()
```

## Blockchain Benefits

### Immutability

Once data is written to ICP, it cannot be altered or deleted:

```python
# Fraud score stored permanently
await canister_service.update_fraud_score(claim_id, 85)

# Score cannot be changed, only new entries can be added
# Complete audit trail maintained
```

### Public Transparency

All blockchain data is publicly verifiable:

```python
# Anyone can query fraud alerts
alerts = await canister_service.get_fraud_alerts(claim_id)

# Citizens can verify government transactions
claim = await canister_service.get_claim(claim_id)
```

### Decentralization

No single point of failure or control:

- Data replicated across ICP nodes
- No central authority can manipulate records
- Consensus-based validation
- Cryptographic proof of authenticity

## Performance Considerations

### Async Operations

All canister calls are asynchronous:

```python
# Non-blocking canister calls
fraud_score_task = canister_service.update_fraud_score(claim_id, score)
alert_task = canister_service.add_fraud_alert(claim_id, alert_data)

# Execute concurrently
await asyncio.gather(fraud_score_task, alert_task)
```

### Caching

Cache frequently accessed data:

```python
# Cache role checks
role_cache = {}

async def get_user_role_cached(principal_id: str):
    if principal_id in role_cache:
        return role_cache[principal_id]
    
    role = await canister_service.check_role(principal_id)
    role_cache[principal_id] = role
    return role
```

### Batch Operations

Batch multiple operations when possible:

```python
# Batch fraud score updates
scores = [(claim_id_1, score_1), (claim_id_2, score_2)]

tasks = [
    canister_service.update_fraud_score(cid, score)
    for cid, score in scores
]

await asyncio.gather(*tasks)
```

## Testing

### Unit Tests

```bash
# Test ICP agent
pytest backend/tests/test_icp/test_agent.py -v

# Test canister service
pytest backend/tests/test_icp/test_canister_calls.py -v
```

### Integration Tests

```bash
# Test with local dfx
dfx start --clean --background
dfx deploy
pytest backend/tests/test_icp/ --integration -v
```

### Mock Canister

```python
# Mock canister for testing
class MockCanisterService:
    async def update_fraud_score(self, claim_id, score):
        return {"success": True, "claim_id": claim_id}
    
    async def get_claim(self, claim_id):
        return ClaimData(claim_id=claim_id, ...)
```

## Related Documentation

- [Authentication](../auth/README.md) - Principal-based authentication
- [Fraud Detection](../fraud/README.md) - Fraud score storage on blockchain
- [Configuration](../config/README.md) - ICP configuration settings
- [Main Application](../README.md) - Overall architecture
- [Canisters](../../../../canisters/README.md) - Motoko smart contract implementation

## Security Considerations

- **Identity Protection**: Never commit PEM files to version control
- **Network Security**: Use HTTPS for mainnet connections
- **Principal Validation**: Always validate principal IDs before operations
- **Error Handling**: Implement proper error handling for network failures
- **Rate Limiting**: Respect ICP network rate limits
