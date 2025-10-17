# 🎨 H.E.L.I.X. Frontend

**React + TypeScript Anti-Corruption Dashboard**

> The face of transparency - where citizens, officials, and vendors unite against corruption.

## 🎯 Empowering Every Stakeholder

This frontend transforms complex fraud detection into **intuitive, actionable interfaces** for 6 different user roles. From government officials monitoring national corruption patterns to citizens reporting local fraud - every stakeholder has the tools they need to fight corruption.

## 🎭 Role-Based Dashboard System

### 🏛️ Government Official Dashboard
**National Oversight & Policy Control**
- 📊 **National Fraud Overview** - Real-time corruption metrics across all states
- 💰 **Budget Allocation Monitoring** - Track fund distribution and usage patterns
- 🗺️ **Inter-state Corruption Patterns** - Geographic fraud analysis and trends
- 📋 **Policy Recommendation Engine** - AI-driven anti-corruption policy suggestions
- 🚨 **Critical Alert Management** - High-priority fraud cases requiring immediate action

### 🏆 State Head Dashboard  
**Regional Management & Coordination**
- 🎯 **State-level Procurement Tracking** - Monitor all state government purchases
- 👥 **Deputy Performance Metrics** - Evaluate district officer effectiveness
- 🔔 **Regional Fraud Alerts** - State-specific corruption notifications
- 📈 **Resource Allocation Optimization** - Data-driven budget recommendations
- 🤝 **Inter-department Coordination** - Cross-department fraud prevention

### 👮 Deputy Dashboard
**District Execution & Investigation**
- 🏗️ **District Project Management** - Track local infrastructure projects
- 🔍 **Vendor Evaluation Tools** - Assess contractor reliability and performance
- 📄 **Claim Processing Workflow** - Review and approve vendor payment claims
- 🕵️ **Local Fraud Investigation** - Investigate suspicious activities in district
- 📊 **Performance Reporting** - Generate reports for state headquarters

### 🏗️ Vendor Dashboard
**Contract & Payment Management**
- 📋 **Contract Management** - View active contracts and obligations
- 💳 **Payment Tracking** - Monitor payment status and invoice processing
- 📊 **Compliance Reporting** - Submit required compliance documentation
- 📈 **Performance Analytics** - Track performance metrics and ratings
- 💬 **Communication Hub** - Direct communication with government officials

### 📦 Sub-Supplier Dashboard
**Delivery & Quality Assurance**
- 🚚 **Delivery Coordination** - Schedule and track material deliveries
- ✅ **Quality Assurance Tools** - Document quality checks and certifications
- 🤝 **Vendor Communication** - Coordinate with main contractors
- 📦 **Material Tracking** - Track inventory and supply chain status
- 📋 **Documentation Management** - Manage delivery receipts and quality certificates

### 👩‍💻 Citizen Dashboard
**Transparency & Oversight**
- 🔍 **Public Procurement Transparency** - Access to all public spending data
- 🚨 **Corruption Reporting Tools** - Easy-to-use fraud reporting interface
- ✅ **Community Verification** - Verify project completion and quality
- 📊 **Impact Tracking** - See the real-world impact of reported corruption
- 📱 **Mobile-First Design** - Optimized for smartphone access

## 🏗️ Component Architecture

```
frontend/src/
├── components/
│   ├── Landing/              # Public landing pages
│   │   ├── HeroSection.tsx   # Main hero with call-to-action
│   │   ├── WhyWeBuilt.tsx    # Jhalawar tragedy story
│   │   ├── CorruptionCases.tsx # Real corruption examples
│   │   ├── ICPSolution.tsx   # Blockchain explanation
│   │   └── StatsDashboard.tsx # Live fraud prevention stats
│   ├── Auth/                 # Authentication system
│   │   ├── LoginPage.tsx     # Role selection + Internet Identity
│   │   └── ICPAuthDemo.tsx   # Internet Identity integration
│   ├── Dashboard/            # Role-specific dashboards
│   │   ├── MainGovernmentDashboard.tsx
│   │   ├── StateHeadDashboard.tsx
│   │   ├── DeputyDashboard.tsx
│   │   ├── VendorDashboard.tsx
│   │   ├── SubSupplierDashboard.tsx
│   │   └── CitizenDashboard.tsx
│   ├── Admin/                # Administrative tools
│   │   └── PrincipalRoleManager.tsx # Map ICP principals to roles
│   └── common/               # Shared components
│       ├── PDFReader.tsx     # Document analysis tool
│       ├── RoleGate.tsx      # Permission-based rendering
│       └── Toast.tsx         # Notification system
├── services/                 # External service integrations
│   ├── authService.ts        # Internet Identity authentication
│   └── icpCanisterService.ts # Blockchain interactions
├── data/                     # Mock data and types
│   └── mockData.ts           # Realistic fraud scenarios
└── types/                    # TypeScript type definitions
    └── index.ts              # Shared type definitions
```

## 🚀 Key Features

### 🔐 Internet Identity Integration
**Passwordless, Secure Authentication**
- **WebAuthn Support** - Biometric authentication (fingerprint, face ID)
- **Principal ID Mapping** - Blockchain identity to user roles
- **Session Management** - Secure, persistent login sessions
- **Multi-device Support** - Login from any device securely

### 📄 PDF Document Analysis
**Intelligent Contract Review**
- **Real-time PDF Parsing** - Extract key information from contracts
- **Fraud Pattern Detection** - Highlight suspicious contract terms
- **Comparison Tools** - Compare contract versions for changes
- **Annotation System** - Mark and comment on problematic sections

### 📊 Real-time Fraud Monitoring
**Live Corruption Detection**
- **Risk Score Visualization** - Color-coded fraud risk indicators
- **Alert Dashboard** - Real-time fraud notifications
- **Trend Analysis** - Historical corruption pattern visualization
- **Geographic Mapping** - Location-based fraud visualization

### 📱 Responsive Design
**Mobile-First Approach**
- **Touch-Optimized UI** - Designed for smartphone interaction
- **Offline Capability** - Basic functionality without internet
- **Progressive Web App** - Install like native mobile app
- **Cross-Platform** - Works on iOS, Android, desktop

## 🎨 Design System

### Color Palette
```css
/* Primary Colors - Trust & Authority */
--blue-primary: #3B82F6;    /* Government/Trust */
--blue-dark: #1E40AF;       /* Authority */

/* Secondary Colors - Action & Alerts */
--red-danger: #EF4444;      /* Fraud Alerts */
--green-success: #10B981;   /* Safe/Verified */
--yellow-warning: #F59E0B;  /* Caution */

/* Role-Specific Colors */
--government: #3B82F6;      /* Government Blue */
--state: #10B981;           /* State Green */
--deputy: #F97316;          /* Deputy Orange */
--vendor: #8B5CF6;          /* Vendor Purple */
--supplier: #06B6D4;        /* Supplier Teal */
--citizen: #6B7280;         /* Citizen Gray */
```

### Typography
```css
/* Headings - Professional & Authoritative */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Body Text - Clear & Readable */
font-family: 'Inter', system-ui, sans-serif;

/* Code/Data - Monospace for accuracy */
font-family: 'JetBrains Mono', 'Courier New', monospace;
```

### Component Guidelines
- **Consistent Spacing** - 8px grid system for all components
- **Accessible Colors** - WCAG AA compliance for all text
- **Loading States** - Skeleton screens for all data fetching
- **Error Handling** - User-friendly error messages with recovery options

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

// Fraud Context - Real-time fraud detection
interface FraudContextType {
  alerts: FraudAlert[];
  riskScore: number;
  isMonitoring: boolean;
  reportFraud: (report: FraudReport) => Promise<void>;
}
```

### Data Flow
```
User Action → Component → Service → Backend API → Blockchain
                ↓                        ↓
           State Update ← Response ← API Response ← Smart Contract
```

## 📱 Pages & Navigation

### Public Pages
- **Landing Page** (`/`) - Compelling story + call to action
- **About Jhalawar** (`/jhalawar`) - Detailed tragedy story
- **How It Works** (`/how-it-works`) - System explanation
- **Impact Stories** (`/impact`) - Success stories and metrics

### Authentication
- **Login** (`/login`) - Role selection + Internet Identity
- **Demo Access** (`/demo`) - Quick demo mode for testing

### Role-Based Dashboards
- **Government** (`/government`) - National oversight dashboard
- **State Head** (`/state`) - Regional management interface
- **Deputy** (`/deputy`) - District execution tools
- **Vendor** (`/vendor`) - Contract management portal
- **Supplier** (`/supplier`) - Delivery coordination interface
- **Citizen** (`/citizen`) - Transparency and reporting tools

### Administrative
- **Principal Manager** (`/admin/principals`) - Map ICP principals to roles
- **System Status** (`/admin/status`) - System health monitoring

## 🚀 Getting Started

### Prerequisites
```bash
# Required
Node.js 18+ 
npm 9+

# Optional for full ICP integration
DFX SDK 0.15+
```

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

# Build for production
npm run build
npm run preview
```

### Environment Variables
```bash
# .env.local
VITE_DFX_NETWORK=local
VITE_II_URL=https://identity.ic0.app
VITE_BACKEND_URL=http://localhost:8000
VITE_ENABLE_DEMO_MODE=true
VITE_CANISTER_ID_PROCUREMENT=your-canister-id
```

## 🧪 Testing

### Component Testing
```bash
# Unit tests with Vitest
npm run test

# Component tests with Testing Library
npm run test:components

# Visual regression tests
npm run test:visual
```

### E2E Testing
```bash
# Playwright end-to-end tests
npm run test:e2e

# Test specific user journeys
npm run test:e2e -- --grep "citizen reporting"
npm run test:e2e -- --grep "vendor payment tracking"
```

### Accessibility Testing
```bash
# Automated a11y testing
npm run test:a11y

# Manual testing with screen readers
npm run test:screen-reader
```

## 📊 Performance Optimization

### Core Web Vitals
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms  
- **Cumulative Layout Shift (CLS)**: < 0.1

### Optimization Strategies
- **Code Splitting** - Lazy load dashboard components by role
- **Image Optimization** - WebP format with responsive sizing
- **Bundle Analysis** - Regular bundle size monitoring
- **Caching Strategy** - Service worker for offline functionality

### Monitoring
```bash
# Bundle analysis
npm run analyze

# Lighthouse CI
npm run lighthouse

# Performance monitoring
npm run monitor
```

## 🔧 Development Tools

### Code Quality
```bash
# TypeScript type checking
npm run type-check

# ESLint for code quality
npm run lint
npm run lint:fix

# Prettier for formatting
npm run format

# Stylelint for CSS
npm run style-lint
```

### Development Utilities
```bash
# Storybook for component development
npm run storybook

# Component generation
npm run generate:component ComponentName

# Mock data generation
npm run generate:mockdata
```

## 🎯 Hackathon Highlights

### Innovation Showcase
- **Real-world Problem Solving** - Built to prevent actual corruption deaths
- **Cutting-edge Technology** - React 18, TypeScript, Internet Identity
- **User Experience Excellence** - 6 role-specific interfaces with intuitive design
- **Accessibility First** - WCAG AA compliant for inclusive access
- **Mobile Optimization** - Citizens can report corruption from anywhere

### Technical Excellence
- **Type Safety** - 100% TypeScript coverage with strict mode
- **Component Architecture** - Modular, reusable, testable components
- **Performance** - Sub-3 second load times with code splitting
- **Security** - Internet Identity integration with proper authentication
- **Testing** - Comprehensive unit, component, and E2E test coverage

### Social Impact Features
- **Citizen Empowerment** - Easy corruption reporting with mobile-first design
- **Transparency Tools** - Public access to all procurement data
- **Real-time Alerts** - Immediate fraud notifications to prevent damage
- **Community Verification** - Crowd-sourced project quality verification
- **Impact Tracking** - Visible metrics showing corruption prevented

---

**"Every pixel, every component, every interaction is designed to save lives by exposing corruption."** 🛡️

## 🤝 Contributing

See the main repository [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## 📝 License

MIT License - see [LICENSE](../LICENSE) for details.