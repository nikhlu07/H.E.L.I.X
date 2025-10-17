# Frontend Source (`src/`)

## Overview

This directory contains the complete React + TypeScript frontend application for H.E.L.I.X., providing multi-role dashboards, Internet Identity authentication, and real-time fraud detection visualization.

## Purpose

The frontend application provides:

- **Multi-Role Dashboards**: Six specialized interfaces for different user roles
- **Internet Identity Integration**: Passwordless authentication via ICP
- **Real-Time Data Visualization**: Live fraud detection and transaction monitoring
- **Hierarchical Data Flow**: Visual representation of government → state → deputy → vendor flow
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Type Safety**: Full TypeScript implementation for reliability

## Contents

### Files

- **main.tsx** - Application entry point with React providers and routing setup
- **App.tsx** - Main application component with route configuration
- **index.css** - Global styles and Tailwind CSS imports
- **vite-env.d.ts** - Vite environment type definitions
- **App-Working.tsx** - Working version backup
- **SimpleApp.tsx** - Simplified app for testing
- **SimpleTest.tsx** - Test component

### Subdirectories

- **auth/** - Authentication services and Internet Identity integration
- **components/** - React components organized by feature (Admin, Auth, Dashboard, Landing, etc.)
- **contexts/** - React Context providers for global state (AuthContext)
- **data/** - Mock data and test data
- **docs/** - Documentation components and content
- **examples/** - Example implementations and demos
- **hooks/** - Custom React hooks (useContracts, use-media-query)
- **lib/** - Utility libraries and helper functions
- **services/** - API clients and service integrations
- **types/** - TypeScript type definitions

## Architecture Context

The frontend follows a modern React architecture:

```
User Browser
    ↓
React Application (main.tsx)
    ↓
├─→ AuthProvider (Authentication State)
├─→ ToastProvider (Notifications)
└─→ Router (Navigation)
    ↓
Components (UI)
    ↓
Services (API Calls)
    ↓
Backend API / ICP Canisters
```

## Application Structure

### Entry Point (`main.tsx`)

```tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
```

### Routing (`App.tsx`)

Main routes:
- `/` - Landing page
- `/login` - Authentication page
- `/dashboard/government` - Main Government dashboard
- `/dashboard/state-head` - State Head dashboard
- `/dashboard/deputy` - Deputy dashboard
- `/dashboard/vendor` - Vendor dashboard
- `/dashboard/sub-supplier` - Sub-Supplier dashboard
- `/dashboard/citizen` - Citizen dashboard
- `/dashboard/auditor` - Auditor dashboard
- `/docs` - Documentation
- `/profile` - User profile


## Key Features

### Multi-Role Dashboard System

Six specialized dashboards for different user roles:

1. **Main Government** - National oversight, budget creation, role management
2. **State Head** - Regional budget allocation, deputy management
3. **Deputy** - District operations, vendor selection, claim review
4. **Vendor** - Claim submission, payment tracking, supplier management
5. **Sub-Supplier** - Delivery coordination, quality assurance
6. **Citizen** - Public transparency, corruption reporting, verification

### Authentication Flow

```tsx
// User clicks login
→ LoginPage component
→ Internet Identity authentication
→ Backend validates and returns JWT + role
→ AuthContext stores user data
→ Navigate to role-specific dashboard
```

### State Management

Global state managed via React Context:

- **AuthContext**: User authentication state, role, permissions
- **ToastProvider**: Global notification system

### Component Organization

Components are organized by feature:

- **Admin/**: Admin panel components
- **Auth/**: Login and authentication UI
- **Dashboard/**: Role-specific dashboard components
- **Landing/**: Landing page sections
- **common/**: Shared/reusable components
- **ui/**: UI component library (shadcn/ui)

## Technology Stack

### Core Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling

### UI Components

- **shadcn/ui** - Component library
- **Lucide React** - Icon library
- **Recharts** - Data visualization

### State Management

- **React Context** - Global state
- **React Hooks** - Local state

### API Integration

- **Axios/Fetch** - HTTP requests
- **@dfinity/agent** - ICP canister calls
- **@dfinity/auth-client** - Internet Identity

## Development Workflow

### Starting Development Server

```bash
cd frontend
npm install
npm run dev
```

Access at: http://localhost:5173

### Building for Production

```bash
npm run build
npm run preview  # Preview production build
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Environment Configuration

Create `.env` file in frontend directory:

```bash
# Backend API
VITE_API_URL=http://localhost:8000

# ICP Configuration
VITE_ICP_NETWORK=local
VITE_CANISTER_ID=rdmx6-jaaaa-aaaah-qcaiq-cai
VITE_II_URL=https://identity.ic0.app

# Feature Flags
VITE_ENABLE_DEMO_MODE=true
VITE_ENABLE_ANALYTICS=false
```

## Component Patterns

### Functional Components

```tsx
import React from 'react';

interface Props {
  title: string;
  onAction: () => void;
}

export const MyComponent: React.FC<Props> = ({ title, onAction }) => {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Action</button>
    </div>
  );
};
```

### Custom Hooks

```tsx
import { useState, useEffect } from 'react';

export const useData = (id: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(id).then(setData).finally(() => setLoading(false));
  }, [id]);

  return { data, loading };
};
```

### Context Usage

```tsx
import { useAuth } from '@/contexts/AuthContext';

export const ProtectedComponent = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <div>Welcome {user.name}</div>;
};
```

## Styling Approach

### Tailwind CSS

Utility-first CSS framework:

```tsx
<div className="flex items-center justify-between p-4 bg-blue-500 text-white rounded-lg shadow-md">
  <h1 className="text-2xl font-bold">Title</h1>
  <button className="px-4 py-2 bg-white text-blue-500 rounded hover:bg-gray-100">
    Action
  </button>
</div>
```

### Component Variants

Using class variance authority (cva):

```tsx
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'px-4 py-2 rounded font-medium',
  {
    variants: {
      variant: {
        primary: 'bg-blue-500 text-white',
        secondary: 'bg-gray-200 text-gray-800',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
  }
);
```

## Performance Optimization

### Code Splitting

```tsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./components/Dashboard'));

<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

### Memoization

```tsx
import { useMemo, useCallback } from 'react';

const expensiveValue = useMemo(() => computeExpensive(data), [data]);
const handleClick = useCallback(() => doSomething(), []);
```

## Testing

### Component Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

## Related Documentation

- [Authentication](./auth/README.md) - Authentication services
- [Components](./components/README.md) - Component library
- [Services](./services/README.md) - API integration
- [Contexts](./contexts/README.md) - State management
- [Types](./types/README.md) - TypeScript definitions
- [Main README](../../README.md) - Project overview
