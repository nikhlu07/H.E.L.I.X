# Hooks (`src/hooks/`)

## Overview

Custom React hooks for H.E.L.I.X. frontend.

## Contents

- **useContracts.ts** - ICP canister contract interactions
- **use-media-query.ts** - Responsive design media query hook

## Usage

```typescript
import { useContracts } from '@/hooks/useContracts';
import { useMediaQuery } from '@/hooks/use-media-query';

// Use canister contracts
const { callCanister, loading } = useContracts();

// Responsive design
const isMobile = useMediaQuery('(max-width: 768px)');
```
