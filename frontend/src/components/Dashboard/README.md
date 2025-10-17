# Dashboard Components (`components/Dashboard/`)

## Overview

Role-specific dashboard components for H.E.L.I.X., providing specialized interfaces for each user role.

## Main Dashboards

### MainGovernmentDashboard.tsx
National-level oversight dashboard with:
- Budget creation and allocation
- System-wide fraud analytics
- Role management
- Cross-state monitoring

### StateHeadDashboard.tsx
Regional management dashboard with:
- State budget allocation
- Deputy management
- Regional fraud oversight
- Performance metrics

### DeputyDashboard.tsx
District operations dashboard with:
- Vendor selection
- Project management
- Claim review and approval
- Local fraud monitoring

### VendorDashboard.tsx
Contractor interface with:
- Claim submission
- Payment tracking
- Supplier management
- Project updates

### SubSupplierDashboard.tsx
Supplier coordination dashboard with:
- Delivery tracking
- Quality assurance
- Vendor coordination
- Payment status

### CitizenDashboard.tsx
Public transparency dashboard with:
- Transaction viewing
- Corruption reporting
- Community verification
- Impact tracking

### AuditorDashboard.tsx
Audit and compliance dashboard with:
- Audit trail review
- Compliance checking
- Report generation

## Supporting Components

### Header.tsx
Common navigation header for all dashboards.

### Profile.tsx
User profile management component.

### DeputyProfile.tsx
Deputy-specific profile with additional fields.

## Generic Dashboards

### GenericDashboard.tsx
Base dashboard template for custom roles.

### TransparencyDashboard.tsx
Public transparency view.

## Specialized Dashboards

### FieldDirectorDashboard.tsx
Field operations management.

### LeadAgencyDashboard.tsx
Lead agency coordination.

### LocalSupplierDashboard.tsx
Local supplier interface.

### LogisticsPartnerDashboard.tsx
Logistics coordination.

### ProgramManagerDashboard.tsx
Program management interface.

## Usage

```tsx
import { MainGovernmentDashboard } from '@/components/Dashboard/MainGovernmentDashboard';

// Protected route
<Route path="/dashboard/government" element={<MainGovernmentDashboard />} />
```

## Related Documentation

- [Auth Components](../Auth/README.md) - Authentication
- [Common Components](../common/README.md) - Shared components
