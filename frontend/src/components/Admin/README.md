# Admin Components (`components/Admin/`)

## Overview

Admin panel components for H.E.L.I.X. system administration and role management.

## Components

### PrincipalRoleManager.tsx

Admin interface for managing user roles and principal IDs.

**Features**:
- Assign roles to ICP principals
- View all registered users
- Modify user permissions
- Audit role changes

**Usage**:
```tsx
import { PrincipalRoleManager } from '@/components/Admin/PrincipalRoleManager';

// Only accessible to main_government role
<PrincipalRoleManager />
```

**Access**: Restricted to `main_government` role only

## Related Documentation

- [Auth Components](../Auth/README.md) - Authentication UI
- [Dashboard Components](../Dashboard/README.md) - Dashboard interfaces
