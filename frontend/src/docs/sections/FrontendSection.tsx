import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code } from 'lucide-react';

export const FrontendSection = () => (
    <Card id="frontend" className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg scroll-mt-24">
        <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center"><Code className="mr-3 h-7 w-7" /> Frontend</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">⚛️ React + TypeScript Frontend</h4>
                <p className="text-sm text-blue-800">
                    Modern, type-safe frontend with 60+ components, 6 role-specific dashboards, and comprehensive documentation for every directory.
                </p>
            </div>

            <section id="frontend-structure" className="scroll-mt-24">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Complete Directory Structure</h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto mb-4">
                    <pre>{`frontend/src/
├── components/          # UI Components (60+)
│   ├── Dashboard/      # 6 Role-Specific Dashboards
│   │   ├── MainGovernmentDashboard.tsx
│   │   ├── StateHeadDashboard.tsx
│   │   ├── DeputyDashboard.tsx
│   │   ├── VendorDashboard.tsx
│   │   ├── SubSupplierDashboard.tsx
│   │   └── CitizenDashboard.tsx
│   ├── Auth/           # Authentication UI
│   │   ├── LoginPage.tsx
│   │   └── SimpleLoginPage.tsx
│   ├── Landing/        # Landing Page Sections
│   ├── Admin/          # Admin Components
│   ├── common/         # Shared Components
│   └── ui/             # UI Library (shadcn/ui)
├── auth/               # Auth Services
│   ├── internetIdentity.ts
│   ├── authService.ts
│   └── simpleII.ts
├── services/           # API Integration
│   ├── api.ts
│   ├── helixService.ts
│   ├── icpCanisterService.ts
│   └── corruptGuardService.ts
├── contexts/           # State Management
│   └── AuthContext.tsx
├── hooks/              # Custom Hooks
├── lib/                # Utilities
├── types/              # TypeScript Types
└── docs/               # Documentation`}</pre>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-purple-900 mb-2">Technology Stack</h4>
                        <ul className="text-sm text-purple-800 space-y-1">
                            <li>• React 18</li>
                            <li>• TypeScript</li>
                            <li>• Vite (Build Tool)</li>
                            <li>• Tailwind CSS</li>
                            <li>• shadcn/ui</li>
                            <li>• React Router</li>
                        </ul>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-900 mb-2">Key Features</h4>
                        <ul className="text-sm text-green-800 space-y-1">
                            <li>• 6 Role Dashboards</li>
                            <li>• 60+ UI Components</li>
                            <li>• Type-Safe APIs</li>
                            <li>• Real-time Updates</li>
                            <li>• Responsive Design</li>
                            <li>• Dark Mode Ready</li>
                        </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-2">Performance</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Fast Refresh</li>
                            <li>• Code Splitting</li>
                            <li>• Lazy Loading</li>
                            <li>• Optimized Build</li>
                            <li>• Tree Shaking</li>
                            <li>• Asset Optimization</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section id="frontend-dashboards" className="scroll-mt-24">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Multi-Role Dashboard System</h3>
                
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-lg border border-indigo-200 mb-6">
                    <p className="text-gray-700 mb-4">
                        Six specialized dashboards providing role-specific interfaces for all stakeholders. Each dashboard is optimized
                        for its user role with tailored features, data visualization, and workflows.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-3 mb-4">
                        <div className="bg-white p-3 rounded-lg border text-center">
                            <div className="text-2xl mb-1">🏛️</div>
                            <div className="font-semibold text-sm">Main Government</div>
                            <div className="text-xs text-gray-600">National Oversight</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border text-center">
                            <div className="text-2xl mb-1">🏢</div>
                            <div className="font-semibold text-sm">State Head</div>
                            <div className="text-xs text-gray-600">Regional Management</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border text-center">
                            <div className="text-2xl mb-1">👮</div>
                            <div className="font-semibold text-sm">Deputy Officer</div>
                            <div className="text-xs text-gray-600">District Operations</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border text-center">
                            <div className="text-2xl mb-1">🏗️</div>
                            <div className="font-semibold text-sm">Vendor</div>
                            <div className="text-xs text-gray-600">Contract Management</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border text-center">
                            <div className="text-2xl mb-1">📦</div>
                            <div className="font-semibold text-sm">Sub-Supplier</div>
                            <div className="text-xs text-gray-600">Delivery & QA</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border text-center">
                            <div className="text-2xl mb-1">👥</div>
                            <div className="font-semibold text-sm">Citizen</div>
                            <div className="text-xs text-gray-600">Public Transparency</div>
                        </div>
                    </div>
                </div>

                <details className="mb-4">
                    <summary className="cursor-pointer font-medium text-gray-900 hover:text-indigo-600 p-4 bg-white rounded-lg border">
                        View Detailed Dashboard Features →
                    </summary>
                    <div className="mt-3 grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-lg mb-2">🏛️ Main Government Dashboard</h4>
                        <p className="text-xs text-gray-600 mb-2">National-level oversight dashboard</p>
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li>• <strong>Budget Creation:</strong> Create and allocate national budgets</li>
                            <li>• <strong>System-wide Analytics:</strong> Real-time fraud metrics across all states</li>
                            <li>• <strong>Role Management:</strong> Assign roles to ICP principals</li>
                            <li>• <strong>Cross-state Monitoring:</strong> Geographic fraud analysis and trends</li>
                            <li>• <strong>Policy Recommendations:</strong> AI-driven anti-corruption policies</li>
                            <li>• <strong>Critical Alerts:</strong> High-priority fraud cases</li>
                        </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-lg mb-2">🏢 State Head Dashboard</h4>
                        <p className="text-xs text-gray-600 mb-2">Regional management interface</p>
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li>• <strong>State Budget Allocation:</strong> Manage regional budgets</li>
                            <li>• <strong>Deputy Management:</strong> Evaluate district officer performance</li>
                            <li>• <strong>Regional Fraud Oversight:</strong> State-specific corruption alerts</li>
                            <li>• <strong>Resource Optimization:</strong> Data-driven budget recommendations</li>
                            <li>• <strong>Performance Metrics:</strong> Track state-level KPIs</li>
                            <li>• <strong>Inter-department Coordination:</strong> Cross-department fraud prevention</li>
                        </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-lg mb-2">👮 Deputy Officer Dashboard</h4>
                        <p className="text-xs text-gray-600 mb-2">District execution & investigation</p>
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li>• <strong>Project Management:</strong> Track local infrastructure projects</li>
                            <li>• <strong>Vendor Evaluation:</strong> Assess contractor reliability</li>
                            <li>• <strong>Claim Processing:</strong> Review and approve payment claims</li>
                            <li>• <strong>Fraud Investigation:</strong> Investigate suspicious activities</li>
                            <li>• <strong>Performance Reporting:</strong> Generate reports for state HQ</li>
                            <li>• <strong>Vendor Selection:</strong> Select contractors for projects</li>
                        </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-lg mb-2">🏗️ Vendor Dashboard</h4>
                        <p className="text-xs text-gray-600 mb-2">Contract & payment management</p>
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li>• <strong>Contract Management:</strong> View active contracts and obligations</li>
                            <li>• <strong>Payment Tracking:</strong> Monitor payment status and invoices</li>
                            <li>• <strong>Claim Submission:</strong> Submit new payment claims</li>
                            <li>• <strong>Compliance Reporting:</strong> Submit required documentation</li>
                            <li>• <strong>Performance Analytics:</strong> Track ratings and metrics</li>
                            <li>• <strong>Communication Hub:</strong> Direct communication with officials</li>
                        </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-lg mb-2">📦 Sub-Supplier Dashboard</h4>
                        <p className="text-xs text-gray-600 mb-2">Delivery & quality assurance</p>
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li>• <strong>Delivery Coordination:</strong> Schedule and track deliveries</li>
                            <li>• <strong>Quality Assurance:</strong> Document quality checks</li>
                            <li>• <strong>Vendor Communication:</strong> Coordinate with main contractors</li>
                            <li>• <strong>Material Tracking:</strong> Track inventory and supply chain</li>
                            <li>• <strong>Documentation:</strong> Manage receipts and certificates</li>
                            <li>• <strong>Payment Status:</strong> Track payment from vendors</li>
                        </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-lg mb-2">👥 Citizen Dashboard</h4>
                        <p className="text-xs text-gray-600 mb-2">Transparency & oversight</p>
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li>• <strong>Public Transparency:</strong> Access all public spending data</li>
                            <li>• <strong>Corruption Reporting:</strong> Easy-to-use fraud reporting</li>
                            <li>• <strong>Community Verification:</strong> Verify project completion</li>
                            <li>• <strong>Impact Tracking:</strong> See real-world impact of reports</li>
                            <li>• <strong>Transaction Viewing:</strong> Browse all government transactions</li>
                            <li>• <strong>Mobile-First Design:</strong> Optimized for smartphones</li>
                        </ul>
                    </div>
                    </div>
                </details>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                    <h5 className="font-semibold text-blue-900 mb-3">✨ Common Dashboard Features</h5>
                    <div className="grid md:grid-cols-3 gap-3 text-sm">
                        <div className="bg-white p-3 rounded-lg">
                            <div className="font-semibold text-gray-900 mb-1">📊 Data Visualization</div>
                            <div className="text-xs text-gray-600">Charts, graphs, real-time metrics, trend analysis</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                            <div className="font-semibold text-gray-900 mb-1">📱 Responsive Design</div>
                            <div className="text-xs text-gray-600">Mobile-optimized, touch-friendly, adaptive layouts</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                            <div className="font-semibold text-gray-900 mb-1">🔔 Real-time Updates</div>
                            <div className="text-xs text-gray-600">Live notifications, instant data refresh</div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="frontend-auth" className="scroll-mt-24">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Authentication System</h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                    <h4 className="font-semibold mb-2">Internet Identity Integration</h4>
                    <p className="text-sm text-gray-700 mb-3">
                        Passwordless authentication using ICP's Internet Identity with WebAuthn/biometric support.
                    </p>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                        <pre>{`import { AuthClient } from '@dfinity/auth-client';

// Initialize auth client
const authClient = await AuthClient.create();

// Login with Internet Identity
await authClient.login({
  identityProvider: 'https://identity.ic0.app',
  onSuccess: async () => {
    const identity = authClient.getIdentity();
    const principal = identity.getPrincipal();
    
    // Send to backend for JWT
    const response = await fetch('/auth/login/internet-identity', {
      method: 'POST',
      body: JSON.stringify({
        principal_id: principal.toText(),
        delegation_chain: await identity.getDelegation()
      })
    });
    
    const { access_token, role } = await response.json();
    // Navigate to role-specific dashboard
    navigate(\`/dashboard/\${role}\`);
  }
});`}</pre>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                        <h4 className="font-semibold text-indigo-900 mb-2">Auth Methods</h4>
                        <ul className="text-sm text-indigo-800 space-y-1">
                            <li>• Internet Identity (Production)</li>
                            <li>• Simple II Demo (Testing)</li>
                            <li>• Demo Mode (Quick Access)</li>
                        </ul>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                        <h4 className="font-semibold text-pink-900 mb-2">Security</h4>
                        <ul className="text-sm text-pink-800 space-y-1">
                            <li>• Biometric Authentication</li>
                            <li>• JWT Token Management</li>
                            <li>• Secure Session Storage</li>
                        </ul>
                    </div>
                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                        <h4 className="font-semibold text-teal-900 mb-2">State Management</h4>
                        <ul className="text-sm text-teal-800 space-y-1">
                            <li>• React Context (AuthContext)</li>
                            <li>• Global User State</li>
                            <li>• Role-Based Routing</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section id="frontend-components" className="scroll-mt-24">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Component Library</h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                    <h4 className="font-semibold mb-3">60+ UI Components (shadcn/ui)</h4>
                    <p className="text-sm text-gray-700 mb-3">
                        Comprehensive UI component library based on shadcn/ui with custom components for H.E.L.I.X.
                        All components support dark mode, responsive design, and accessibility (ARIA).
                    </p>
                    <div className="grid md:grid-cols-4 gap-3">
                        <div className="bg-gray-50 p-3 rounded">
                            <h5 className="font-semibold text-sm mb-2">Form Components</h5>
                            <div className="text-xs text-gray-700 space-y-1">
                                <div>• Button (variants)</div>
                                <div>• Input</div>
                                <div>• Textarea</div>
                                <div>• Select</div>
                                <div>• Checkbox</div>
                                <div>• Radio Group</div>
                                <div>• Switch</div>
                                <div>• Slider</div>
                                <div>• Form wrapper</div>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                            <h5 className="font-semibold text-sm mb-2">Layout Components</h5>
                            <div className="text-xs text-gray-700 space-y-1">
                                <div>• Card</div>
                                <div>• Separator</div>
                                <div>• Tabs</div>
                                <div>• Accordion</div>
                                <div>• Collapsible</div>
                                <div>• Resizable</div>
                                <div>• Sidebar</div>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                            <h5 className="font-semibold text-sm mb-2">Overlay Components</h5>
                            <div className="text-xs text-gray-700 space-y-1">
                                <div>• Dialog</div>
                                <div>• Alert Dialog</div>
                                <div>• Sheet</div>
                                <div>• Drawer</div>
                                <div>• Popover</div>
                                <div>• Tooltip</div>
                                <div>• Hover Card</div>
                                <div>• Modal</div>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                            <h5 className="font-semibold text-sm mb-2">Navigation</h5>
                            <div className="text-xs text-gray-700 space-y-1">
                                <div>• Navigation Menu</div>
                                <div>• Menubar</div>
                                <div>• Dropdown Menu</div>
                                <div>• Context Menu</div>
                                <div>• Breadcrumb</div>
                                <div>• Pagination</div>
                                <div>• Command Palette</div>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                            <h5 className="font-semibold text-sm mb-2">Feedback</h5>
                            <div className="text-xs text-gray-700 space-y-1">
                                <div>• Toast</div>
                                <div>• Toaster</div>
                                <div>• Sonner</div>
                                <div>• Alert</div>
                                <div>• Progress</div>
                                <div>• Skeleton</div>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                            <h5 className="font-semibold text-sm mb-2">Data Display</h5>
                            <div className="text-xs text-gray-700 space-y-1">
                                <div>• Table</div>
                                <div>• Badge</div>
                                <div>• Avatar</div>
                                <div>• Calendar</div>
                                <div>• Chart</div>
                                <div>• Scroll Area</div>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                            <h5 className="font-semibold text-sm mb-2">Custom Components</h5>
                            <div className="text-xs text-gray-700 space-y-1">
                                <div>• Lamp Effect</div>
                                <div>• Globe Visualization</div>
                                <div>• Timeline Animation</div>
                                <div>• Testimonials</div>
                                <div>• Case Studies</div>
                                <div>• Pricing Section</div>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                            <h5 className="font-semibold text-sm mb-2">Utilities</h5>
                            <div className="text-xs text-gray-700 space-y-1">
                                <div>• Carousel</div>
                                <div>• Aspect Ratio</div>
                                <div>• Toggle</div>
                                <div>• Toggle Group</div>
                                <div>• OTP Input</div>
                                <div>• Label</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold mb-2">Component Usage Example</h4>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                        <pre>{`import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

export const LoginForm = () => {
  const { toast } = useToast();
  
  const handleSubmit = () => {
    toast({
      title: "Success",
      description: "Logged in successfully"
    });
  };
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login to H.E.L.I.X.</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter principal ID" />
        <Button onClick={handleSubmit} className="w-full mt-4">
          Login with Internet Identity
        </Button>
      </CardContent>
    </Card>
  );
};`}</pre>
                    </div>
                </div>
            </section>

            <section id="frontend-state" className="scroll-mt-24">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">State Management & Hooks</h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                    <h4 className="font-semibold mb-3">React Context Architecture</h4>
                    <p className="text-sm text-gray-700 mb-3">
                        Global state managed via React Context for authentication, notifications, and shared data.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                            <h5 className="font-semibold text-purple-900 mb-2">AuthContext</h5>
                            <p className="text-sm text-purple-800 mb-2">
                                Manages authentication state across the application:
                            </p>
                            <ul className="text-xs text-purple-700 space-y-1">
                                <li>• <strong>user:</strong> Current user data (principal, role, name)</li>
                                <li>• <strong>isAuthenticated:</strong> Boolean authentication status</li>
                                <li>• <strong>login():</strong> Login function with II integration</li>
                                <li>• <strong>logout():</strong> Logout and clear session</li>
                                <li>• <strong>refreshToken():</strong> Token refresh mechanism</li>
                            </ul>
                        </div>
                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                            <h5 className="font-semibold text-indigo-900 mb-2">Custom Hooks</h5>
                            <p className="text-sm text-indigo-800 mb-2">
                                Reusable hooks for common functionality:
                            </p>
                            <ul className="text-xs text-indigo-700 space-y-1">
                                <li>• <strong>useAuth():</strong> Access authentication context</li>
                                <li>• <strong>useContracts():</strong> ICP canister interactions</li>
                                <li>• <strong>useMediaQuery():</strong> Responsive design hooks</li>
                                <li>• <strong>useToast():</strong> Notification system</li>
                                <li>• <strong>useDebounce():</strong> Input debouncing</li>
                            </ul>
                        </div>
                    </div>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto mt-4">
                        <pre>{`// Using AuthContext
import { useAuth } from '@/contexts/AuthContext';

export const ProtectedComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div>
      <h1>Welcome {user.name}</h1>
      <p>Role: {user.role}</p>
      <p>Principal: {user.principal}</p>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
};`}</pre>
                    </div>
                </div>
            </section>

            <section id="frontend-services" className="scroll-mt-24">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">API Services</h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                    <h4 className="font-semibold mb-3">Service Layer Architecture</h4>
                    <p className="text-sm text-gray-700 mb-3">
                        Comprehensive API client layer for backend integration, ICP canister communication, and external services.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <h5 className="font-semibold text-blue-900 mb-2">Core Services</h5>
                            <ul className="text-xs text-blue-800 space-y-1">
                                <li>• <strong>api.ts:</strong> Main API client (axios)</li>
                                <li>• <strong>helixService.ts:</strong> Backend API integration</li>
                                <li>• <strong>authService.ts:</strong> Authentication APIs</li>
                            </ul>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <h5 className="font-semibold text-green-900 mb-2">Blockchain Services</h5>
                            <ul className="text-xs text-green-800 space-y-1">
                                <li>• <strong>icpCanisterService.ts:</strong> ICP interactions</li>
                                <li>• <strong>corruptGuardService.ts:</strong> Fraud detection</li>
                                <li>• <strong>ckusdcLedgerService.ts:</strong> Ledger operations</li>
                            </ul>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                            <h5 className="font-semibold text-purple-900 mb-2">Utilities</h5>
                            <ul className="text-xs text-purple-800 space-y-1">
                                <li>• <strong>demoMode.ts:</strong> Demo mode utilities</li>
                                <li>• Request interceptors</li>
                                <li>• Error handling</li>
                            </ul>
                        </div>
                    </div>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                        <pre>{`// API Client Configuration
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// H.E.L.I.X. Service
export const helixService = {
  // Fraud Detection
  analyzeFraud: (claimData) => 
    api.post('/fraud/analyze', claimData),
  getFraudAlerts: () => 
    api.get('/fraud/alerts/active'),
  
  // Budget Management
  getBudgets: () => 
    api.get('/government/budgets'),
  allocateBudget: (data) => 
    api.post('/government/allocate', data),
  
  // Claim Operations
  submitClaim: (data) => 
    api.post('/vendor/claim', data),
  reviewClaim: (claimId, decision) => 
    api.post(\`/deputy/claims/\${claimId}/review\`, decision),
  
  // Transparency
  getPublicTransactions: (filters) => 
    api.get('/citizen/transparency', { params: filters }),
  reportCorruption: (report) => 
    api.post('/citizen/report', report)
};

// ICP Canister Service
export const icpService = {
  // Canister interactions
  getClaimFromBlockchain: async (claimId) => {
    const actor = await getCanisterActor();
    return await actor.getClaim(claimId);
  },
  
  updateFraudScore: async (claimId, score) => {
    const actor = await getCanisterActor();
    return await actor.updateFraudScore(claimId, score);
  }
};`}</pre>
                    </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h5 className="font-semibold text-blue-900 mb-2">Service Features</h5>
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800">
                        <div>
                            <strong>Request Handling:</strong>
                            <ul className="list-disc list-inside mt-1 text-xs">
                                <li>Automatic token injection</li>
                                <li>Request/response interceptors</li>
                                <li>Error handling</li>
                                <li>Retry logic</li>
                            </ul>
                        </div>
                        <div>
                            <strong>Type Safety:</strong>
                            <ul className="list-disc list-inside mt-1 text-xs">
                                <li>TypeScript interfaces</li>
                                <li>Request validation</li>
                                <li>Response typing</li>
                                <li>Error types</li>
                            </ul>
                        </div>
                        <div>
                            <strong>Performance:</strong>
                            <ul className="list-disc list-inside mt-1 text-xs">
                                <li>Request caching</li>
                                <li>Debouncing</li>
                                <li>Lazy loading</li>
                                <li>Optimistic updates</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3">📚 Complete Frontend Documentation</h4>
                <p className="text-sm text-blue-800 mb-3">
                    Every frontend directory has comprehensive README documentation:
                </p>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-blue-700">
                    <div>• <a href="https://github.com/nikhlu07/H.E.L.I.X/tree/main/frontend/src" className="hover:underline">Frontend Overview</a></div>
                    <div>• <a href="https://github.com/nikhlu07/H.E.L.I.X/tree/main/frontend/src/components" className="hover:underline">Component Library</a></div>
                    <div>• <a href="https://github.com/nikhlu07/H.E.L.I.X/tree/main/frontend/src/components/Dashboard" className="hover:underline">Dashboard Components</a></div>
                    <div>• <a href="https://github.com/nikhlu07/H.E.L.I.X/tree/main/frontend/src/auth" className="hover:underline">Authentication Services</a></div>
                    <div>• <a href="https://github.com/nikhlu07/H.E.L.I.X/tree/main/frontend/src/services" className="hover:underline">API Services</a></div>
                    <div>• <a href="https://github.com/nikhlu07/H.E.L.I.X/tree/main/frontend/src/contexts" className="hover:underline">State Management</a></div>
                    <div>• <a href="https://github.com/nikhlu07/H.E.L.I.X/tree/main/frontend/src/components/ui" className="hover:underline">UI Component Library</a></div>
                    <div>• <a href="https://github.com/nikhlu07/H.E.L.I.X/tree/main/frontend/src/types" className="hover:underline">TypeScript Types</a></div>
                </div>
            </div>
        </CardContent>
    </Card>
);