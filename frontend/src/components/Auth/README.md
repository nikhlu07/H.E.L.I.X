# Auth Components (`components/Auth/`)

## Overview

Authentication UI components for H.E.L.I.X., including login pages and authentication providers.

## Components

### LoginPage.tsx

Main login page with Internet Identity integration.

**Features**:
- Internet Identity authentication
- Demo mode login
- Role-based redirection
- Error handling

**Usage**:
```tsx
import { LoginPage } from '@/components/Auth/LoginPage';

<LoginPage onLogin={(role, sector) => navigate(`/dashboard/${role}`)} />
```

### SimpleLoginPage.tsx

Simplified login page for testing and demos.

**Features**:
- Quick role selection
- No Internet Identity required
- Instant authentication

### AuthProvider.jsx

React context provider for authentication state.

### ICPAuthDemo.tsx

Demo component showing Internet Identity integration.

## Authentication Flow

1. User clicks "Login with Internet Identity"
2. Redirects to Internet Identity service
3. User authenticates (biometric/WebAuthn)
4. Returns with delegation and principal
5. Backend validates and issues JWT
6. User redirected to role-specific dashboard

## Related Documentation

- [Auth Services](../../auth/README.md) - Authentication services
- [Auth Context](../../contexts/README.md) - Authentication state management
