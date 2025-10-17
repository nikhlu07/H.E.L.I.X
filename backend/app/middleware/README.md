# Middleware (`app/middleware/`)

## Overview

This directory contains FastAPI middleware components for request/response processing, including authentication enforcement, logging, rate limiting, and CORS handling.

## Purpose

Middleware provides cross-cutting concerns:
- Request authentication and authorization
- Request/response logging and timing
- Rate limiting and throttling
- CORS policy enforcement
- Error handling and transformation

## Key Middleware

### AuthenticationMiddleware

Enforces authentication on protected endpoints via dependency injection (see `auth/middleware.py`).

### Request Timing

Adds `X-Process-Time` header to all responses showing request processing time.

### Rate Limiting

IP-based rate limiting to prevent abuse (configurable via settings).

## Usage

Middleware is automatically applied in `main.py`:

```python
app.add_middleware(AuthenticationMiddleware)
app.add_middleware(CORSMiddleware, allow_origins=settings.CORS_ORIGINS)
```

## Related Documentation

- [Authentication](../auth/README.md) - Authentication middleware details
- [Configuration](../config/README.md) - Middleware configuration
