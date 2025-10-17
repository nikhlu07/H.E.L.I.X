# Library (`src/lib/`)

## Overview

Utility libraries and helper functions for H.E.L.I.X. frontend.

## Contents

- **utils.ts** - General utility functions (cn, formatters, validators)
- **store.ts** - State management utilities
- **mockData.ts** - Mock data for development/testing

## Key Utilities

```typescript
import { cn, formatCurrency, formatDate } from '@/lib/utils';

// Class name merging
const className = cn('base-class', condition && 'conditional-class');

// Formatting
const formatted = formatCurrency(1500000); // "₹15,00,000"
const date = formatDate(new Date()); // "Jan 15, 2024"
```
