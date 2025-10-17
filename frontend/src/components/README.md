# Components (`src/components/`)

## Overview

React components for H.E.L.I.X. organized by feature and functionality.

## Structure

- **Admin/** - Admin panel components for role management
- **Auth/** - Authentication UI (LoginPage, role selection)
- **Dashboard/** - Role-specific dashboard components (6 dashboards)
- **Landing/** - Landing page sections and hero
- **Demo/** - Demo and presentation components
- **Test/** - Test components for development
- **common/** - Shared/reusable components (Toast, Loading, etc.)
- **ui/** - UI component library (shadcn/ui components)
- **pitch/** - Pitch presentation components

## Key Components

### Dashboards

Six role-specific dashboards:
- `MainGovernmentDashboard` - National oversight
- `StateHeadDashboard` - Regional management
- `DeputyDashboard` - District operations
- `VendorDashboard` - Contractor interface
- `SubSupplierDashboard` - Supplier coordination
- `CitizenDashboard` - Public transparency

### Common Components

Reusable across application:
- `Header` - Navigation header
- `Toast` - Notification system
- `Loading` - Loading states
- `ErrorBoundary` - Error handling

### UI Components

shadcn/ui library components:
- `Button`, `Card`, `Dialog`, `Input`, `Select`, etc.

## Usage

```tsx
import { Button } from '@/components/ui/button';
import { Toast } from '@/components/common/Toast';
import { MainGovernmentDashboard } from '@/components/Dashboard/MainGovernmentDashboard';
```

## Component Patterns

All components follow:
- TypeScript for type safety
- Functional components with hooks
- Props interface definitions
- Tailwind CSS for styling
