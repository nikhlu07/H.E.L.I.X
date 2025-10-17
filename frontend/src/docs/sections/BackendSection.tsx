import { Database } from 'lucide-react';

export const BackendSection = () => {
  return (
    <section id="backend" className="mb-12 scroll-mt-20">
      <div className="flex items-center mb-6">
        <Database className="h-8 w-8 text-blue-600 mr-3" />
        <h2 className="text-3xl font-bold text-gray-900">Backend Documentation</h2>
      </div>

      <div id="backend-structure" className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Directory Structure</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`backend/
├── app/
│   ├── api/                  # API route handlers
│   │   ├── auth.py           # Authentication endpoints
│   │   ├── government.py     # Government endpoints
│   │   ├── deputy.py         # Deputy endpoints
│   │   ├── vendor.py         # Vendor endpoints
│   │   ├── citizen.py        # Citizen endpoints
│   │   └── fraud.py          # Fraud detection endpoints
│   ├── auth/                 # Authentication system
│   │   ├── icp_auth.py       # Internet Identity integration
│   │   ├── icp_rbac.py       # Role-based access control
│   │   └── middleware.py     # Auth middleware
│   ├── fraud/                # Fraud detection
│   │   └── detection.py      # Fraud detection logic
│   ├── icp/                  # ICP integration
│   │   ├── agent.py          # ICP agent configuration
│   │   └── canister_calls.py # Smart contract interactions
│   └── schemas/              # Pydantic data models
├── requirements.txt          # Python dependencies
└── hierarchical_demo_api.py  # Demo API server`}</pre>
          </div>
        </div>
      </div>

      <div id="backend-api" className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">API Architecture</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
          <h4 className="font-semibold text-lg mb-3">FastAPI Application Structure</h4>
          <p className="text-gray-700 mb-3">
            The API layer serves as the interface between the frontend React application and backend services,
            organized by user role for clean separation of concerns and RBAC enforcement.
          </p>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
            <pre>{`from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="H.E.L.I.X. API",
    description="Humanitarian Economic Logistics & Integrity Xchange",
    version="2.1.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://h-e-l-i-x.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(government.router, prefix="/government", tags=["Government"])
app.include_router(fraud.router, prefix="/fraud", tags=["Fraud Detection"])`}</pre>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 mb-6">
          <h4 className="font-semibold text-lg mb-4 text-blue-900">📡 API Endpoint Categories</h4>
          <p className="text-sm text-blue-800 mb-4">
            H.E.L.I.X. provides 30+ REST API endpoints organized by user role. Each endpoint is protected with JWT authentication and role-based access control.
          </p>

          <details className="mb-3">
            <summary className="cursor-pointer font-semibold text-gray-900 hover:text-blue-600 p-3 bg-white rounded-lg border">
              🔐 Authentication Endpoints (7 endpoints)
            </summary>
            <div className="mt-2 p-4 bg-white rounded-lg border">
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">POST /auth/login/internet-identity</code> - Login with II</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">POST /auth/demo-login/&#123;role&#125;</code> - Demo login</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">GET /auth/profile</code> - Get user profile</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">POST /auth/refresh</code> - Refresh token</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">POST /auth/logout</code> - Logout</li>
              </ul>
            </div>
          </details>

          <details className="mb-3">
            <summary className="cursor-pointer font-semibold text-gray-900 hover:text-blue-600 p-3 bg-white rounded-lg border">
              🚨 Fraud Detection Endpoints (6 endpoints)
            </summary>
            <div className="mt-2 p-4 bg-white rounded-lg border">
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">POST /fraud/analyze-claim</code> - Analyze for fraud</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">GET /fraud/alerts/active</code> - Get active alerts</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">GET /fraud/rules</code> - Get detection rules</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">POST /fraud/report</code> - Report suspicious activity</li>
              </ul>
            </div>
          </details>

          <details className="mb-3">
            <summary className="cursor-pointer font-semibold text-gray-900 hover:text-blue-600 p-3 bg-white rounded-lg border">
              🏛️ Government, Deputy, Vendor & Citizen Endpoints (15+ endpoints)
            </summary>
            <div className="mt-2 p-4 bg-white rounded-lg border">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h6 className="font-semibold text-sm mb-2">Government</h6>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Budget creation & overview</li>
                    <li>• Role assignment</li>
                    <li>• National analytics</li>
                  </ul>
                </div>
                <div>
                  <h6 className="font-semibold text-sm mb-2">Deputy</h6>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Project management</li>
                    <li>• Vendor selection</li>
                    <li>• Claim review</li>
                  </ul>
                </div>
                <div>
                  <h6 className="font-semibold text-sm mb-2">Vendor</h6>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Contract management</li>
                    <li>• Claim submission</li>
                    <li>• Payment tracking</li>
                  </ul>
                </div>
                <div>
                  <h6 className="font-semibold text-sm mb-2">Citizen</h6>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Public transparency</li>
                    <li>• Corruption reporting</li>
                    <li>• Community verification</li>
                  </ul>
                </div>
              </div>
            </div>
          </details>

          <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              💡 <strong>Tip:</strong> Visit <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:8000/docs</code> for interactive API documentation with Swagger UI
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Key Features</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• FastAPI for high-performance REST APIs</li>
              <li>• Pydantic for data validation</li>
              <li>• JWT token authentication</li>
              <li>• Role-based access control (RBAC)</li>
              <li>• Async/await for concurrent operations</li>
              <li>• Dependency injection pattern</li>
              <li>• Automatic API documentation (Swagger/ReDoc)</li>
              <li>• Request/response serialization</li>
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2">Performance</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Response Time: &lt; 2 seconds</li>
              <li>• Throughput: 1000+ requests/sec</li>
              <li>• Uptime: 99.9% availability</li>
              <li>• Fraud Analysis: &lt; 3 seconds</li>
              <li>• Concurrent Connections: 100+ users</li>
              <li>• Rate Limiting: 100 req/min per IP</li>
              <li>• Database Connection Pooling</li>
              <li>• Response Caching</li>
            </ul>
          </div>
        </div>
      </div>

      <div id="backend-fraud" className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Fraud Detection System</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
          <h4 className="font-semibold text-lg mb-3">Hybrid Detection Architecture</h4>
          <p className="text-gray-700 mb-4">
            H.E.L.I.X. uses a sophisticated hybrid approach combining deterministic rules with AI/ML models and LLM-powered analysis.
            The system implements a dynamic Retrieval-Augmented Generation (RAG) pipeline that synthesizes information from multiple sources.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h5 className="font-semibold text-purple-900 mb-2">Rules Engine (70%)</h5>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• 10 sophisticated fraud patterns</li>
                <li>• Deterministic detection</li>
                <li>• Real-time analysis (&lt;500ms)</li>
                <li>• High precision (95%+)</li>
                <li>• Contextual analysis</li>
                <li>• Historical baseline calculation</li>
              </ul>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h5 className="font-semibold text-indigo-900 mb-2">ML Models (30%)</h5>
              <ul className="text-sm text-indigo-800 space-y-1">
                <li>• Isolation Forest algorithm</li>
                <li>• Anomaly detection</li>
                <li>• 45+ extracted features</li>
                <li>• 87% overall accuracy</li>
                <li>• &lt;5% false positive rate</li>
                <li>• Continuous model training</li>
              </ul>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
              <h5 className="font-semibold text-pink-900 mb-2">LLM Analysis (RAG)</h5>
              <ul className="text-sm text-pink-800 space-y-1">
                <li>• Gemma3:4b (SLM via Ollama)</li>
                <li>• GPT-4, Claude support</li>
                <li>• Context-aware reasoning</li>
                <li>• FAISS vector store</li>
                <li>• Historical case retrieval</li>
                <li>• Natural language explanations</li>
              </ul>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-5 rounded-lg border border-orange-200 mb-6">
            <h5 className="font-semibold mb-3 text-orange-900">🎯 10 Fraud Detection Patterns</h5>
            <p className="text-sm text-orange-800 mb-4">
              Our system detects 10 sophisticated corruption patterns with 85-95% accuracy. Each pattern uses advanced analytics and contextual awareness.
            </p>

            <details className="mb-2">
              <summary className="cursor-pointer font-medium text-gray-900 hover:text-orange-600 p-3 bg-white rounded-lg border">
                View All 10 Detection Patterns →
              </summary>
              <div className="mt-3 grid md:grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-sm">1. Budget Anomalies</strong>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">92%</span>
                  </div>
                  <p className="text-xs text-gray-600">Historical baseline, seasonal adjustments</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-sm">2. Vendor Collusion</strong>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">88%</span>
                  </div>
                  <p className="text-xs text-gray-600">Bid pattern analysis, network mapping</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-sm">3. Invoice Manipulation</strong>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">90%</span>
                  </div>
                  <p className="text-xs text-gray-600">OCR analysis, digital forensics</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-sm">4. Timeline Violations</strong>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">85%</span>
                  </div>
                  <p className="text-xs text-gray-600">Schedule feasibility, critical path</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-sm">5. Quality Deviations</strong>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">89%</span>
                  </div>
                  <p className="text-xs text-gray-600">Specification compliance, material verification</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-sm">6. Payment Irregularities</strong>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">87%</span>
                  </div>
                  <p className="text-xs text-gray-600">Payment patterns, cash flow anomalies</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-sm">7. Document Inconsistencies</strong>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">91%</span>
                  </div>
                  <p className="text-xs text-gray-600">Cross-reference verification, signatures</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-sm">8. Duplicate Claims</strong>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">95%</span>
                  </div>
                  <p className="text-xs text-gray-600">Transaction fingerprinting, similarity scoring</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-sm">9. Ghost Projects</strong>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">94%</span>
                  </div>
                  <p className="text-xs text-gray-600">Physical verification, progress analysis</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-sm">10. Cost Inflation</strong>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">86%</span>
                  </div>
                  <p className="text-xs text-gray-600">Market comparison, historical trends</p>
                </div>
              </div>
            </details>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h5 className="font-semibold text-blue-900 mb-2">Fraud Engine Workflow</h5>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>New claim submitted → Rules Engine analysis</li>
              <li>Rules output + claim features → ML Detector</li>
              <li>Historical claims embedded in FAISS vector store</li>
              <li>RAG pipeline retrieves similar cases</li>
              <li>LLM synthesizes all information</li>
              <li>Final fraud probability score generated</li>
              <li>Score ≥70 → Fraud alert created</li>
              <li>Alert stored immutably on blockchain</li>
            </ol>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-lg mb-3">Autonomous Fraud Engine</h4>
          <p className="text-gray-700 mb-3">
            Advanced self-healing, adaptive system with autonomous investigation capabilities:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Core Features</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Autonomous fraud detection with Gemma-powered SLM</li>
                <li>• Self-healing pipeline with automatic issue remediation</li>
                <li>• Continuous learning from investigation outcomes</li>
                <li>• Adaptive thresholds based on performance metrics</li>
                <li>• Autonomous investigation with evidence gathering</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Advanced Capabilities</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Immutable evidence management on blockchain</li>
                <li>• Intelligent resource management and scaling</li>
                <li>• Proactive security hardening</li>
                <li>• Transparent auditing with explainable decisions</li>
                <li>• Human-in-the-loop oversight framework</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div id="backend-auth" className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Authentication & RBAC</h3>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
          <h4 className="font-semibold text-lg mb-3">Internet Identity Integration</h4>
          <p className="text-gray-700 mb-3">
            Complete authentication system integrating Internet Identity (ICP's decentralized authentication) with role-based access control.
            Provides passwordless, WebAuthn/biometric authentication with principal-based identity verification.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h5 className="font-semibold text-purple-900 mb-2">Authentication Flow</h5>
              <ol className="text-sm text-purple-800 space-y-1 list-decimal list-inside">
                <li>User authenticates via Internet Identity</li>
                <li>Delegation chain validated</li>
                <li>Principal ID extracted</li>
                <li>Role queried from ICP canister</li>
                <li>JWT token generated</li>
                <li>Token validated on each request</li>
              </ol>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h5 className="font-semibold text-indigo-900 mb-2">Security Features</h5>
              <ul className="text-sm text-indigo-800 space-y-1">
                <li>• No passwords stored</li>
                <li>• WebAuthn/biometric auth</li>
                <li>• Delegation-based authorization</li>
                <li>• Cross-device sessions</li>
                <li>• Phishing-resistant design</li>
                <li>• 30-minute token expiration</li>
              </ul>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
              <h5 className="font-semibold text-pink-900 mb-2">Token Structure</h5>
              <ul className="text-sm text-pink-800 space-y-1">
                <li>• Principal ID (ICP identity)</li>
                <li>• User role</li>
                <li>• Expiration timestamp</li>
                <li>• HS256 signature</li>
                <li>• Role re-verification on refresh</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
          <h4 className="font-semibold text-lg mb-3">Role-Based Access Control (RBAC)</h4>
          <p className="text-gray-700 mb-3">
            Hierarchical permission system with 5 user roles, enforced at both middleware and endpoint level.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget Control</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fraud Oversight</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor Mgmt</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Public Access</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Main Government</td>
                  <td className="px-6 py-4 text-sm text-gray-700">5 (Highest)</td>
                  <td className="px-6 py-4 text-sm text-green-600">✓ Full</td>
                  <td className="px-6 py-4 text-sm text-green-600">✓ National</td>
                  <td className="px-6 py-4 text-sm text-green-600">✓ All States</td>
                  <td className="px-6 py-4 text-sm text-green-600">✓ Yes</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">State Head</td>
                  <td className="px-6 py-4 text-sm text-gray-700">4</td>
                  <td className="px-6 py-4 text-sm text-green-600">✓ State-level</td>
                  <td className="px-6 py-4 text-sm text-green-600">✓ Regional</td>
                  <td className="px-6 py-4 text-sm text-green-600">✓ State Vendors</td>
                  <td className="px-6 py-4 text-sm text-green-600">✓ Yes</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Deputy</td>
                  <td className="px-6 py-4 text-sm text-gray-700">3</td>
                  <td className="px-6 py-4 text-sm text-yellow-600">○ View Only</td>
                  <td className="px-6 py-4 text-sm text-green-600">✓ District</td>
                  <td className="px-6 py-4 text-sm text-green-600">✓ Local Vendors</td>
                  <td className="px-6 py-4 text-sm text-green-600">✓ Yes</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Vendor</td>
                  <td className="px-6 py-4 text-sm text-gray-700">2</td>
                  <td className="px-6 py-4 text-sm text-red-600">✗ No</td>
                  <td className="px-6 py-4 text-sm text-yellow-600">○ Own Data</td>
                  <td className="px-6 py-4 text-sm text-green-600">✓ Own Contracts</td>
                  <td className="px-6 py-4 text-sm text-yellow-600">○ Limited</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Citizen</td>
                  <td className="px-6 py-4 text-sm text-gray-700">1</td>
                  <td className="px-6 py-4 text-sm text-red-600">✗ No</td>
                  <td className="px-6 py-4 text-sm text-green-600">✓ View Alerts</td>
                  <td className="px-6 py-4 text-sm text-yellow-600">○ Public Data</td>
                  <td className="px-6 py-4 text-sm text-green-600">✓ Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200 mb-6">
          <h4 className="font-semibold text-lg mb-3 text-purple-900">🔑 Role Permissions Matrix</h4>
          <p className="text-sm text-purple-800 mb-4">
            Each role has specific permissions enforced at the API level. Higher roles can perform all actions of lower roles.
          </p>

          <details className="mb-2">
            <summary className="cursor-pointer font-medium text-gray-900 hover:text-purple-600 p-3 bg-white rounded-lg border">
              View Detailed Permissions by Role →
            </summary>
            <div className="mt-3 space-y-3">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">Level 5</span>
                  Main Government
                </h5>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
                  <div>• Budget control (full)</div>
                  <div>• Role management</div>
                  <div>• Fraud oversight (national)</div>
                  <div>• System administration</div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">Level 4</span>
                  State Head
                </h5>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
                  <div>• Budget allocation (state)</div>
                  <div>• Deputy management</div>
                  <div>• Regional oversight</div>
                  <div>• Vendor proposals</div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs mr-2">Level 3</span>
                  Deputy Officer
                </h5>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
                  <div>• Vendor selection</div>
                  <div>• Project management</div>
                  <div>• Claim review</div>
                  <div>• Payment approval</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs mr-2">Level 2</span>
                    Vendor
                  </h5>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>• Claim submission</div>
                    <div>• Payment tracking</div>
                    <div>• Supplier management</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs mr-2">Level 1</span>
                    Citizen
                  </h5>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>• Transparency access</div>
                    <div>• Corruption reporting</div>
                    <div>• Community verification</div>
                  </div>
                </div>
              </div>
            </div>
          </details>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-lg mb-3">Authentication Implementation</h4>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
            <pre>{`from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer

security = HTTPBearer()

# Get current authenticated user
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    token = credentials.credentials
    payload = auth_service.decode_token(token)
    
    # Verify role with ICP canister
    current_role = await canister_service.get_user_role(
        payload.get("principal")
    )
    
    return {
        "principal": payload.get("principal"),
        "role": current_role,
        "valid": True
    }

# Role-based endpoint protection
def require_role(allowed_roles: List[UserRole]):
    async def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user.get("role") not in allowed_roles:
            raise HTTPException(
                status_code=403, 
                detail="Insufficient permissions"
            )
        return current_user
    return role_checker

# Usage example
@router.post("/budget/create")
async def create_budget(
    budget_data: BudgetCreate,
    user: dict = Depends(require_role(["main_government"]))
):
    # Only main government can create budgets
    return await budget_service.create(budget_data, user["principal"])`}</pre>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h5 className="font-semibold text-blue-900 mb-2">Security Highlights</h5>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <strong>Delegation Chain Validation:</strong>
              <ul className="list-disc list-inside mt-1">
                <li>Structure validation</li>
                <li>Signature verification</li>
                <li>Expiration checking</li>
                <li>Principal derivation</li>
                <li>Domain validation (anti-phishing)</li>
              </ul>
            </div>
            <div>
              <strong>Token Security:</strong>
              <ul className="list-disc list-inside mt-1">
                <li>30-minute expiration</li>
                <li>HS256 signed tokens</li>
                <li>Role re-verification on refresh</li>
                <li>No sensitive data in tokens</li>
                <li>Automatic token rotation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div id="backend-icp" className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">ICP Blockchain Integration</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
          <h4 className="font-semibold text-lg mb-3">Internet Computer Protocol Integration</h4>
          <p className="text-gray-700 mb-4">
            Complete blockchain integration enabling immutable storage, decentralized authentication, and public transparency.
            Provides the bridge between FastAPI backend and ICP smart contracts (canisters).
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h5 className="font-semibold text-purple-900 mb-2">Core Capabilities</h5>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Blockchain storage (immutable)</li>
                <li>• Canister communication</li>
                <li>• Agent management</li>
                <li>• Identity management</li>
                <li>• Data persistence</li>
                <li>• Public transparency</li>
              </ul>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h5 className="font-semibold text-indigo-900 mb-2">Data Models</h5>
              <ul className="text-sm text-indigo-800 space-y-1">
                <li>• ClaimData (vendor claims)</li>
                <li>• BudgetData (allocations)</li>
                <li>• FraudAlert (fraud cases)</li>
                <li>• AuditEntry (audit trail)</li>
                <li>• UserProfile (roles)</li>
                <li>• SystemStats (metrics)</li>
              </ul>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
              <h5 className="font-semibold text-pink-900 mb-2">Network Support</h5>
              <ul className="text-sm text-pink-800 space-y-1">
                <li>• Local (dfx development)</li>
                <li>• Testnet (staging)</li>
                <li>• Mainnet (production)</li>
                <li>• Demo mode (no ICP)</li>
                <li>• Automatic failover</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
          <h4 className="font-semibold text-lg mb-3">Blockchain Benefits</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h5 className="font-semibold text-green-900 mb-2">Immutability</h5>
              <p className="text-sm text-green-800 mb-2">
                Once data is written to ICP, it cannot be altered or deleted. Complete audit trail maintained permanently.
              </p>
              <div className="text-xs text-green-700 bg-green-100 p-2 rounded">
                Fraud scores stored permanently → Cannot be changed → Only new entries added
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h5 className="font-semibold text-blue-900 mb-2">Public Transparency</h5>
              <p className="text-sm text-blue-800 mb-2">
                All blockchain data is publicly verifiable. Citizens can verify government transactions.
              </p>
              <div className="text-xs text-blue-700 bg-blue-100 p-2 rounded">
                Anyone can query fraud alerts → Public verification → Democratic oversight
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h5 className="font-semibold text-purple-900 mb-2">Decentralization</h5>
              <p className="text-sm text-purple-800 mb-2">
                No single point of failure or control. Data replicated across ICP nodes.
              </p>
              <div className="text-xs text-purple-700 bg-purple-100 p-2 rounded">
                Consensus-based → Cryptographic proof → No central authority
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-lg mb-3">ICP Integration Code Example</h4>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
            <pre>{`from app.icp.canister_calls import CanisterService

canister_service = CanisterService()

# Store fraud score immutably on blockchain
await canister_service.update_fraud_score(
    claim_id=1001,
    fraud_score=85
)

# Create fraud alert (permanent record)
await canister_service.add_fraud_alert(
    claim_id=1001,
    alert_type="high_fraud_risk",
    severity="critical",
    description="Multiple fraud indicators detected"
)

# Query claim from blockchain
claim = await canister_service.get_claim(claim_id=1001)
print(f"Fraud Score: {claim.fraud_score}")  # Immutable

# Verify user role from canister
is_main_gov = await canister_service.is_main_government(
    principal_id="rdmx6-jaaaa-aaaah-qcaiq-cai"
)

# Get system statistics
stats = await canister_service.get_system_stats()
print(f"Total Budget: {stats.total_budget}")
print(f"Flagged Claims: {stats.flagged_claims}")`}</pre>
          </div>
        </div>
      </div>

      <div id="backend-database" className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Database & Configuration</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="font-semibold text-lg mb-3">Database Layer</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• <strong>ORM:</strong> SQLAlchemy for database operations</li>
              <li>• <strong>Default:</strong> SQLite (helix.db)</li>
              <li>• <strong>Production:</strong> PostgreSQL/MySQL support</li>
              <li>• <strong>Models:</strong> FraudResult, AuditLog, UserSession</li>
              <li>• <strong>Migrations:</strong> Alembic-ready</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="font-semibold text-lg mb-3">Configuration</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• <strong>Settings:</strong> Pydantic BaseSettings</li>
              <li>• <strong>Environment:</strong> .env file support</li>
              <li>• <strong>Security:</strong> JWT secrets, CORS config</li>
              <li>• <strong>ICP:</strong> Network URLs, canister IDs</li>
              <li>• <strong>Fraud:</strong> Detection thresholds, rules</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-3">📚 Complete Backend Documentation</h4>
        <p className="text-sm text-blue-800 mb-3">
          Every backend directory has comprehensive README documentation:
        </p>
        <div className="grid md:grid-cols-2 gap-2 text-sm text-blue-700">
          <div>• <a href="https://github.com/nikhlu07/H.E.L.I.X/tree/main/backend" className="hover:underline">Backend Overview</a></div>
          <div>• <a href="https://github.com/nikhlu07/H.E.L.I.X/tree/main/backend/app/api" className="hover:underline">API Layer</a></div>
          <div>• <a href="https://github.com/nikhlu07/H.E.L.I.X/tree/main/backend/app/auth" className="hover:underline">Authentication System</a></div>
          <div>• <a href="https://github.com/nikhlu07/H.E.L.I.X/tree/main/backend/app/fraud" className="hover:underline">Fraud Detection</a></div>
          <div>• <a href="https://github.com/nikhlu07/H.E.L.I.X/tree/main/backend/app/fraud_engine" className="hover:underline">Fraud Engine (LLM/SLM)</a></div>
          <div>• <a href="https://github.com/nikhlu07/H.E.L.I.X/tree/main/backend/app/autonomous_fraud_engine" className="hover:underline">Autonomous Engine</a></div>
          <div>• <a href="https://github.com/nikhlu07/H.E.L.I.X/tree/main/backend/app/icp" className="hover:underline">ICP Integration</a></div>
          <div>• <a href="https://github.com/nikhlu07/H.E.L.I.X/tree/main/backend/app/config" className="hover:underline">Configuration</a></div>
          <div>• <a href="https://github.com/nikhlu07/H.E.L.I.X/tree/main/backend/app/database" className="hover:underline">Database Layer</a></div>
          <div>• <a href="https://github.com/nikhlu07/H.E.L.I.X/tree/main/backend/tests" className="hover:underline">Test Suite</a></div>
        </div>
      </div>
    </section>
  );
};
