# Auth Components (`components/Auth/`)

## Overview

Authentication UI components for H.E.L.I.X., including login pages for different user sectors.

## Components

### LoginPage.tsx

Main login page for **Government sector** users, with Internet Identity integration.

**Features**:
- Internet Identity authentication
- Role selection for government roles
- Role-based redirection
- Error handling

**Usage**:
```tsx
import { LoginPage } from '@/components/Auth/LoginPage';

<LoginPage onLogin={(role, sector) => navigate(`/dashboard/${role}`)} />
```

### NgoLoginPage.tsx

Login page for **NGO sector** users, with a similar interface to the government login.

**Features**:
- Internet Identity authentication
- Role selection for NGO roles (NGO Head, Program Manager, etc.)
- Role-based redirection to NGO dashboards

**Usage**:
```tsx
import { NgoLoginPage } from '@/components/Auth/NgoLoginPage';

<NgoLoginPage onLogin={(role, sector) => navigate(`/dashboard/${role}`)} />
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

1. User selects a sector (Government or NGO) and navigates to the corresponding login page.
2. User clicks "Login with Internet Identity"
3. Redirects to Internet Identity service
4. User authenticates (biometric/WebAuthn)
5. Returns with delegation and principal
6. Backend validates and issues JWT
7. User redirected to role-specific dashboard

## Related Documentation

- [Auth Services](../../auth/README.md) - Authentication services
- [Auth Context](../../contexts/README.md) - Authentication state management
