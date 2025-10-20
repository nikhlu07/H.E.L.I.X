# Dashboard Components (`components/Dashboard/`)

## Overview

Role-specific dashboard components for H.E.L.I.X., providing specialized interfaces for each user role in both Government and NGO sectors.

## Government Dashboards

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

## NGO Dashboards

### NgoHeadDashboard.tsx
Overall NGO leadership dashboard with:
- Program monitoring
- Budget allocation planning
- Donation tracking

### NgoProgramManagerDashboard.tsx
Manages specific NGO programs with:
- Program details and task management
- Volunteer roster and assignments

### NgoFieldOfficerDashboard.tsx
For on-the-ground operations with:
- Task reporting and status updates
- Site locations and details

### NgoVolunteerCoordinatorDashboard.tsx
Manages all volunteer-related activities with:
- Volunteer application management
- Event coordination and broadcast messaging

### NgoAdminDashboard.tsx
Administrative tasks for the NGO section with:
- User management and role assignments
- System announcements and audit logs

## Supporting Components

### Header.tsx
Common navigation header for all government-related dashboards.

### NgoHeader.tsx
Dedicated navigation header for all NGO-related dashboards.

### Profile.tsx
User profile management component.

### DeputyProfile.tsx
Deputy-specific profile with additional fields.


## Usage

```tsx
import { MainGovernmentDashboard } from '@/components/Dashboard/MainGovernmentDashboard';
import { NgoHeadDashboard } from '@/components/Dashboard/NgoHeadDashboard';

// Protected route for a government dashboard
<Route path="/dashboard/government" element={<MainGovernmentDashboard />} />

// Protected route for an NGO dashboard
<Route path="/dashboard/ngo-head" element={<NgoHeadDashboard />} />
```

## Related Documentation

- [Auth Components](../Auth/README.md) - Authentication
- [Common Components](../common/README.md) - Shared components
