# 🎨 H.E.L.I.X. Frontend

**React + TypeScript Anti-Corruption Dashboard**

> The face of transparency - where citizens, officials, and vendors unite against corruption.

## 🎯 Empowering Every Stakeholder

This frontend transforms complex fraud detection into **intuitive, actionable interfaces** for multiple user roles across both Government and NGO sectors. From government officials monitoring national corruption patterns to NGO field officers managing on-the-ground operations, every stakeholder has the tools they need.

## 🎭 Role-Based Dashboard System

### 🏛️ Government Sector

- **Main Government Dashboard**: National oversight & policy control.
- **State Head Dashboard**: Regional management & coordination.
- **Deputy Dashboard**: District execution & investigation.
- **Vendor Dashboard**: Contract & payment management.
- **Sub-Supplier Dashboard**: Delivery & quality assurance.
- **Citizen Dashboard**: Transparency & public oversight.
- **Auditor Dashboard**: Compliance & financial verification.

### ❤️ NGO Sector

- **NGO Head Dashboard**: Leadership overview of programs, donations, and budget allocation.
- **NGO Program Manager Dashboard**: Detailed management of specific programs, tasks, and volunteers.
- **NGO Field Officer Dashboard**: Tools for on-the-ground task reporting and site management.
- **NGO Volunteer Coordinator Dashboard**: Interface for managing volunteer applications, events, and communications.
- **NGO Admin Dashboard**: Administrative tools for user management, system announcements, and audit logs.

## 🏗️ Component Architecture

```
frontend/src/
├── components/
│   ├── Landing/              # Public landing pages
│   ├── Auth/                 # Authentication system
│   │   ├── LoginPage.tsx     # GOV Role selection + Internet Identity
│   │   └── NgoLoginPage.tsx  # NGO Role selection + Internet Identity
│   ├── Dashboard/            # Role-specific dashboards
│   │   ├── MainGovernmentDashboard.tsx
│   │   ├── StateHeadDashboard.tsx
│   │   ├── ... (other GOV dashboards)
│   │   ├── NgoHeadDashboard.tsx
│   │   ├── NgoProgramManagerDashboard.tsx
│   │   ├── ... (other NGO dashboards)
│   │   ├── Header.tsx
│   │   └── NgoHeader.tsx
│   ├── Admin/                # Administrative tools
│   └── common/               # Shared components
├── services/                 # External service integrations
├── data/                     # Mock data and types
└── types/                    # TypeScript type definitions
```

## 🚀 Key Features

### 🔐 Internet Identity Integration
**Passwordless, Secure Authentication**
- **WebAuthn Support** - Biometric authentication (fingerprint, face ID)
- **Principal ID Mapping** - Blockchain identity to user roles
- **Session Management** - Secure, persistent login sessions

### 📊 Real-time Fraud Monitoring
**Live Corruption Detection**
- **Risk Score Visualization** - Color-coded fraud risk indicators
- **Alert Dashboard** - Real-time fraud notifications
- **Trend Analysis** - Historical corruption pattern visualization

### 📱 Responsive Design
**Mobile-First Approach**
- **Touch-Optimized UI** - Designed for smartphone interaction
- **Progressive Web App** - Install like native mobile app
- **Cross-Platform** - Works on iOS, Android, desktop

## 🔌 State Management

### Context-Based Architecture
```typescript
// Auth Context - User authentication state
interface AuthContextType {
  user: User | null;
  login: (principal: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}
```

## 📱 Pages & Navigation

### Public Pages
- **Landing Page** (`/`) - Main entry point with sector selection.

### Authentication
- **Government Login** (`/login`) - Role selection for government users.
- **NGO Login** (`/login/ngo`) - Role selection for NGO users.

### Role-Based Dashboards
- **/dashboard/government**: National oversight dashboard.
- **/dashboard/state-head**: Regional management interface.
- **/dashboard/ngo-head**: NGO leadership dashboard.
- ... and other role-specific routes.

### Administrative
- **Principal Manager** (`/admin/roles`) - Map ICP principals to roles.

## 🚀 Getting Started

### Prerequisites
`Node.js 18+`, `npm 9+`

### Installation & Development
```bash
# Clone and install
git clone https://github.com/nikhlu07/H.E.L.I.X.git
cd H.E.L.I.X/frontend
npm install

# Environment setup
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
# Opens http://localhost:5173
```

## 🤝 Contributing

See the main repository [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## 📝 License

MIT License - see [LICENSE](../LICENSE) for details.
