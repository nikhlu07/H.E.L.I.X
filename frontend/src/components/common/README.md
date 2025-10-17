# Common Components (`components/common/`)

## Overview

Shared, reusable components used throughout H.E.L.I.X.

## Components

### Toast.tsx
Global notification/toast system.

**Usage**:
```tsx
import { useToast } from '@/components/common/Toast';

const { showToast } = useToast();
showToast('Success!', 'success');
```

### AnimatedCounter.tsx
Animated number counter for statistics.

**Usage**:
```tsx
<AnimatedCounter value={1500000} duration={2000} />
```

### CorruptGuardLogo.tsx
H.E.L.I.X. logo component (legacy component name).

### RoleGate.tsx
Role-based access control component.

**Usage**:
```tsx
<RoleGate allowedRoles={['main_government', 'state_head']}>
  <AdminPanel />
</RoleGate>
```

### ICPConnectionTest.tsx
ICP connection testing component.

### PDFReader.tsx
PDF document viewer component.

## Usage

```tsx
import { Toast, AnimatedCounter, RoleGate } from '@/components/common';
```

## Related Documentation

- [UI Components](../ui/README.md) - UI component library
- [Contexts](../../contexts/README.md) - Global state
