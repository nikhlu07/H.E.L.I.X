# Contexts (`src/contexts/`)

## Overview

React Context providers for global state management in H.E.L.I.X.

## Contents

- **AuthContext.tsx** - Authentication state management (user, role, permissions)
- **SimpleAuthContext.tsx** - Simplified auth context for demos

## AuthContext

Provides global authentication state:

```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

**State**:
- `user`: Current user data (principal, role, name)
- `isAuthenticated`: Boolean authentication status
- `login()`: Login function
- `logout()`: Logout function

## Usage

```tsx
import { useAuth } from '@/contexts/AuthContext';

export const ProtectedComponent = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return <div>Welcome {user.name}</div>;
};
```
