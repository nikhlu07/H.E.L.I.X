# Test Components (`components/Test/`)

## Overview

Test components for development and integration testing.

## Components

### AuthTest.tsx
Authentication flow testing component.

**Tests**:
- Internet Identity login
- JWT token validation
- Role-based access
- Session management

### DemoTest.tsx
Demo mode testing component.

**Tests**:
- Demo authentication
- Mock data loading
- UI component rendering

### IntegrationTest.tsx
Integration testing component for end-to-end flows.

**Tests**:
- API integration
- ICP canister calls
- Fraud detection flow
- Data persistence

## Usage

```tsx
import { AuthTest } from '@/components/Test/AuthTest';

// Development only
{process.env.NODE_ENV === 'development' && <AuthTest />}
```

## Related Documentation

- [Auth Components](../Auth/README.md) - Authentication components
- [Services](../../services/README.md) - API services
