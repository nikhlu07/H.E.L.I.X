# Utilities (`app/utils/`)

## Overview

This directory contains utility functions and helper classes used throughout the H.E.L.I.X. backend for common operations like logging, exception handling, and data processing.

## Purpose

Utilities provide:
- Centralized logging configuration
- Custom exception classes
- Helper functions for common operations
- Data transformation utilities
- Validation helpers

## Key Utilities

### Logging (`logging.py`)

Structured logging configuration:

```python
from app.utils.logging import get_logger, log_user_action

logger = get_logger(__name__)
logger.info("Processing transaction")

# Log security events
log_user_action(
    event_type="LOGIN",
    user_principal="principal-id",
    description="User logged in"
)
```

### Exceptions (`exceptions.py`)

Custom exception classes:

```python
from app.utils.exceptions import (
    HelixException,
    ValidationError,
    AuthenticationError,
    ICPError
)

# Raise custom exceptions
if not valid:
    raise ValidationError("Invalid input data")

if not authenticated:
    raise AuthenticationError("Authentication required")
```

### Helper Functions

Common utility functions:

```python
from app.utils.helpers import (
    format_currency,
    calculate_hash,
    validate_principal_id,
    parse_timestamp
)

# Format amounts
formatted = format_currency(1500000)  # "₹15,00,000"

# Generate hashes
hash_value = calculate_hash(data)

# Validate ICP principals
is_valid = validate_principal_id("rdmx6-jaaaa-aaaah-qcaiq-cai")
```

## Exception Hierarchy

```
HelixException (Base)
├── ValidationError
├── AuthenticationError
├── AuthorizationError
├── ICPError
├── ConfigurationError
└── FraudDetectionError
```

## Logging Configuration

### Log Levels

- **DEBUG**: Detailed diagnostic information
- **INFO**: General informational messages
- **WARNING**: Warning messages for potential issues
- **ERROR**: Error messages for failures
- **CRITICAL**: Critical errors requiring immediate attention

### Log Format

```
%(asctime)s - %(name)s - %(levelname)s - %(message)s
2024-01-15 10:30:45 - app.fraud.detection - INFO - Analyzing claim 1001
```

## Related Documentation

- [Main Application](../README.md) - Application using utilities
- [Configuration](../config/README.md) - Logging configuration
