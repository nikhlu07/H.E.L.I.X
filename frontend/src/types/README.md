# Types (`src/types/`)

## Overview

TypeScript type definitions for H.E.L.I.X. frontend.

## Contents

- **index.ts** - Centralized type exports

## Key Types

```typescript
// User types
interface User {
  principal: string;
  role: string;
  name: string;
  permissions: string[];
}

// Transaction types
interface Transaction {
  id: string;
  amount: number;
  vendor: string;
  status: string;
  fraudScore?: number;
}

// Fraud analysis types
interface FraudAnalysis {
  score: number;
  riskLevel: string;
  flags: string[];
  reasoning: string;
}
```

## Usage

```typescript
import type { User, Transaction, FraudAnalysis } from '@/types';
```
