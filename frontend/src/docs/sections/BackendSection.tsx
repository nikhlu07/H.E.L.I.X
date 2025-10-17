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

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Key Features</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• FastAPI for high-performance REST APIs</li>
              <li>• Pydantic for data validation</li>
              <li>• JWT token authentication</li>
              <li>• Role-based access control (RBAC)</li>
              <li>• Async/await for concurrent operations</li>
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2">Performance</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Response Time: &lt; 2 seconds</li>
              <li>• Throughput: 1000+ requests/sec</li>
              <li>• Uptime: 99.9% availability</li>
              <li>• Fraud Analysis: &lt; 3 seconds</li>
            </ul>
          </div>
        </div>
      </div>

      <div id="backend-auth" className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Authentication & RBAC</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
          <h4 className="font-semibold text-lg mb-3">Role-Based Access Control</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget Control</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fraud Oversight</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor Mgmt</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Main Government</td>
                  <td className="px-6 py-4 text-sm text-green-600">✓ Full</td>
                  <td className="px-6 py-4 text-sm text-green-600">✓ National</td>
                  <td className="px-6 py-4 text-sm text-green-600">✓ All States</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">State Head</td>
                  <td className="px-6 py-4 text-sm text-green-600">✓ State-level</td>
                  <td className="px-6 py-4 text-sm text-green-600">✓ Regional</td>
                  <td className="px-6 py-4 text-sm text-green-600">✓ State Vendors</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Deputy</td>
                  <td className="px-6 py-4 text-sm text-yellow-600">○ View Only</td>
                  <td className="px-6 py-4 text-sm text-green-600">✓ District</td>
                  <td className="px-6 py-4 text-sm text-green-600">✓ Local Vendors</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Vendor</td>
                  <td className="px-6 py-4 text-sm text-red-600">✗ No</td>
                  <td className="px-6 py-4 text-sm text-yellow-600">○ Own Data</td>
                  <td className="px-6 py-4 text-sm text-green-600">✓ Own Contracts</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Citizen</td>
                  <td className="px-6 py-4 text-sm text-red-600">✗ No</td>
                  <td className="px-6 py-4 text-sm text-green-600">✓ View Alerts</td>
                  <td className="px-6 py-4 text-sm text-yellow-600">○ Public Data</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-lg mb-3">Authentication Code Example</h4>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
            <pre>{`from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    token = credentials.credentials
    payload = auth_service.decode_token(token)
    return {
        "principal": payload.get("principal"),
        "role": payload.get("role"),
    }

def require_role(allowed_roles: List[UserRole]):
    async def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user.get("role") not in allowed_roles:
            raise HTTPException(status_code=403, detail="Access denied")
        return current_user
    return role_checker`}</pre>
          </div>
        </div>
      </div>
    </section>
  );
};
