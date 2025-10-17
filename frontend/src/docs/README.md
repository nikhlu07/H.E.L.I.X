# Documentation Components (`src/docs/`)

## Overview

In-app documentation components for H.E.L.I.X., providing interactive documentation and guides.

## Contents

### documentation.tsx
Main documentation component with navigation and content rendering.

### documentation.data.ts
Documentation content data and structure.

### sections/
Subdirectory containing individual documentation section components.

## Usage

```tsx
import Documentation from '@/docs/documentation';

<Route path="/docs" element={<Documentation />} />
```

## Documentation Sections

- Getting Started
- Authentication Guide
- Dashboard Overview
- Fraud Detection
- API Reference
- Deployment Guide
- Troubleshooting

## Related Documentation

- [Main README](../../../README.md) - Project overview
- [Backend Docs](../../../backend/README.md) - Backend documentation
