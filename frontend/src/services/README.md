# Services (`src/services/`)

## Overview

API clients and service integrations for H.E.L.I.X. frontend.

## Contents

- **api.ts** - Main API client with axios configuration
- **authService.ts** - Authentication API calls
- **helixService.ts** - H.E.L.I.X. backend API integration
- **icpCanisterService.ts** - ICP canister interactions
- **corruptGuardService.ts** - Fraud detection API (legacy name)
- **ckusdcLedgerService.ts** - CKUSDC ledger operations
- **demoMode.ts** - Demo mode utilities

## Usage

```typescript
import { api } from '@/services/api';
import { helixService } from '@/services/helixService';

// Make API call
const response = await api.post('/fraud/analyze', claimData);

// Use service
const fraudScore = await helixService.analyzeFraud(claimData);
```

## Related Documentation

- [Auth](../auth/README.md) - Authentication services
- [Types](../types/README.md) - API type definitions
