# Authentication Layer (`src/auth/`)

## Overview

Frontend authentication services for H.E.L.I.X., providing Internet Identity integration, simple II demo mode, and authentication utilities.

## Contents

- **authService.ts** - Main authentication service with backend API integration
- **internetIdentity.ts** - Internet Identity authentication implementation
- **simpleII.ts** - Simplified Internet Identity for demos
- **types.ts** - Authentication type definitions

## Key Features

### Internet Identity Authentication

```typescript
import { authenticateWithII } from './auth/internetIdentity';

// Authenticate user
const authResult = await authenticateWithII();
// Returns: { principal, delegation, authenticated: true }
```

### Backend Integration

```typescript
import { loginWithBackend } from './auth/authService';

// Login and get JWT
const { accessToken, role, userInfo } = await loginWithBackend(principal, delegation);
```

### Demo Mode

```typescript
import { demoLogin } from './auth/simpleII';

// Quick demo login
const auth = await demoLogin('main_government');
```

## Related Documentation

- [Contexts](../contexts/README.md) - AuthContext using these services
- [Services](../services/README.md) - API service integration
