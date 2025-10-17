# Configuration (`app/config/`)

## Overview

This directory contains application configuration management for H.E.L.I.X., including settings, environment variables, and ICP-specific configuration. It provides centralized configuration using Pydantic for type-safe settings management.

## Purpose

The configuration module manages:

- **Application Settings**: Core application configuration (host, port, debug mode)
- **Security Configuration**: JWT secrets, CORS settings, authentication parameters
- **ICP Integration**: Internet Computer network settings and canister IDs
- **Fraud Detection**: Fraud scoring thresholds and detection rules
- **Database Configuration**: Database connection strings and settings
- **Rate Limiting**: API rate limiting configuration
- **Role Management**: Principal IDs and role-specific settings

## Contents

### Files

- **__init__.py** - Python package initialization
- **settings.py** - Main application settings using Pydantic BaseSettings
- **icp_config.py** - Internet Computer Protocol specific configuration

## Key Configuration Sections

### Application Settings

```python
APP_NAME: str = "H.E.L.I.X. API"
VERSION: str = "1.0.0"
DEBUG: bool = True
ENVIRONMENT: str = "development"
HOST: str = "127.0.0.1"
PORT: int = 8000
```

### Security Configuration

```python
# JWT Authentication
SECRET_KEY: str = secrets.token_urlsafe(32)
JWT_SECRET_KEY: str = secrets.token_urlsafe(32)
JWT_ALGORITHM: str = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

# CORS Settings
CORS_ORIGINS: List[str] = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # React dev server
]
cors_allow_credentials: bool = True
cors_allow_methods: list = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
```


### ICP Configuration

```python
# Network Settings
icp_network: str = "local"  # local, testnet, mainnet
icp_canister_id: str = "rdmx6-jaaaa-aaaah-qcaiq-cai"
icp_agent_host: str = "http://127.0.0.1:4943"  # Local dfx
icp_identity_provider: str = "https://identity.ic0.app"

# Internet Identity
ii_canister_id: str = "rdmx6-jaaaa-aaaah-qcaiq-cai"
ii_derivation_origin: Optional[str] = None

# Demo Principals
demo_principals: dict = {
    "main_government": "rdmx6-jaaaa-aaaah-qcaiq-cai",
    "state_head": "renrk-eyaaa-aaaah-qcaia-cai",
    "deputy": "rrkah-fqaaa-aaaah-qcaiq-cai",
    "vendor": "radvj-tiaaa-aaaah-qcaiq-cai",
    "citizen": "raahe-xyaaa-aaaah-qcaiq-cai"
}
```

### Fraud Detection Configuration

```python
# Fraud Detection
FRAUD_DETECTION_ENABLED: bool = True
fraud_alert_threshold: int = 70
fraud_critical_threshold: int = 85

# Corruption Detection Rules
corruption_rules: dict = {
    "high_amount_threshold": 1_000_000,
    "round_number_penalty": 30,
    "new_vendor_penalty": 25,
    "after_hours_penalty": 15,
    "similar_claims_penalty": 10,
    "max_fraud_score": 100
}
```

### Database Configuration

```python
database_url: str = "sqlite:///./helix.db"
database_echo: bool = False
```

### Rate Limiting

```python
rate_limit_enabled: bool = True
rate_limit_requests: int = 100
rate_limit_window: int = 60  # seconds
```

## Usage Examples

### Accessing Settings

```python
from app.config.settings import get_settings

settings = get_settings()

# Access configuration values
debug_mode = settings.DEBUG
jwt_secret = settings.JWT_SECRET_KEY
canister_id = settings.icp_canister_id
fraud_threshold = settings.fraud_alert_threshold
```

### Environment Variables

Create a `.env` file in the backend directory:

```bash
# Application
DEBUG=true
ENVIRONMENT=development

# Security
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here

# ICP Configuration
ICP_NETWORK=local
ICP_CANISTER_ID=rdmx6-jaaaa-aaaah-qcaiq-cai
ICP_AGENT_HOST=http://127.0.0.1:4943

# Database
DATABASE_URL=sqlite:///./helix.db

# Fraud Detection
FRAUD_DETECTION_ENABLED=true
FRAUD_ALERT_THRESHOLD=70

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=100
```

### Production Configuration

For production deployment:

```python
# Production settings
DEBUG: bool = False
ENVIRONMENT: str = "production"
icp_network: str = "mainnet"
icp_agent_host: str = "https://ic0.app"

# Stronger security
ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # Shorter token lifetime
rate_limit_requests: int = 50  # Stricter rate limiting

# Production CORS
CORS_ORIGINS: List[str] = [
    "https://h-e-l-i-x.vercel.app",
    "https://your-production-domain.com"
]
```

## Configuration Best Practices

### Security

- **Never commit secrets**: Use environment variables for sensitive data
- **Rotate secrets regularly**: Change JWT secrets periodically
- **Use strong secrets**: Generate secrets with `secrets.token_urlsafe(32)`
- **Restrict CORS**: Only allow trusted origins in production

### Environment-Specific Settings

```python
# Development
DEBUG = True
icp_network = "local"
rate_limit_requests = 1000

# Staging
DEBUG = False
icp_network = "testnet"
rate_limit_requests = 200

# Production
DEBUG = False
icp_network = "mainnet"
rate_limit_requests = 50
```

### ICP Network Configuration

```python
# Local Development (dfx)
icp_network = "local"
icp_agent_host = "http://127.0.0.1:4943"
ICP_FETCH_ROOT_KEY = True  # Required for local

# Testnet
icp_network = "testnet"
icp_agent_host = "https://ic0.app"
ICP_FETCH_ROOT_KEY = False

# Mainnet
icp_network = "mainnet"
icp_agent_host = "https://ic0.app"
ICP_FETCH_ROOT_KEY = False
```

## Configuration Validation

Pydantic automatically validates configuration:

```python
from pydantic import ValidationError

try:
    settings = get_settings()
except ValidationError as e:
    print(f"Configuration error: {e}")
```

## Related Documentation

- [Main Application](../README.md) - Application using these settings
- [ICP Integration](../icp/README.md) - ICP-specific configuration usage
- [Authentication](../auth/README.md) - JWT and security settings
- [API Layer](../api/README.md) - CORS and rate limiting configuration
