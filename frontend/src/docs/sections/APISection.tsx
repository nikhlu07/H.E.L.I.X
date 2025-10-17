import { FileText } from 'lucide-react';

export const APISection = () => {
  return (
    <section id="api" className="mb-12 scroll-mt-20">
      <div className="flex items-center mb-6">
        <FileText className="h-8 w-8 text-blue-600 mr-3" />
        <h2 className="text-3xl font-bold text-gray-900">API Reference</h2>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Base URL:</strong> <code className="bg-blue-100 px-2 py-1 rounded">http://localhost:8000</code> (development) or 
          <code className="bg-blue-100 px-2 py-1 rounded ml-2">https://api.helix.com</code> (production)
        </p>
      </div>

      <div id="api-auth" className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Authentication Endpoints</h3>
        
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-lg">POST /auth/login</h4>
              <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">Public</span>
            </div>
            <p className="text-gray-700 mb-3">Authenticate user with Internet Identity principal</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Request:</p>
                <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-xs">
                  <pre>{`{
  "principal": "aaaaa-aa",
  "auth_mode": "internet-identity"
}`}</pre>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Response:</p>
                <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-xs">
                  <pre>{`{
  "access_token": "eyJhbG...",
  "token_type": "bearer",
  "principal": "aaaaa-aa",
  "role": "main-government"
}`}</pre>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-lg">GET /auth/me</h4>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full">Protected</span>
            </div>
            <p className="text-gray-700 mb-3">Get current user information</p>
            
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Headers:</p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-xs mb-3">
                <pre>Authorization: Bearer &lt;token&gt;</pre>
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Response:</p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-xs">
                <pre>{`{
  "principal": "aaaaa-aa",
  "role": "main-government",
  "permissions": ["allocate_budget", "view_fraud_alerts"]
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="api-government" className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Government Endpoints</h3>
        
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-lg">POST /government/allocate</h4>
              <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full">Admin Only</span>
            </div>
            <p className="text-gray-700 mb-3">Allocate budget to state or district</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Request:</p>
                <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-xs">
                  <pre>{`{
  "amount": 10000000,
  "allocated_to": "state-head-principal",
  "purpose": "Infrastructure development",
  "state": "Rajasthan",
  "fiscal_year": 2025
}`}</pre>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Response:</p>
                <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-xs">
                  <pre>{`{
  "transaction_id": "tx_123456",
  "status": "success",
  "fraud_score": 15.5
}`}</pre>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-lg">GET /government/overview</h4>
              <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full">Admin Only</span>
            </div>
            <p className="text-gray-700 mb-3">Get national overview statistics</p>
            
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Response:</p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-xs">
                <pre>{`{
  "total_budget": 1000000000,
  "allocated_budget": 750000000,
  "fraud_alerts": 12,
  "active_projects": 145,
  "states": [...]
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="api-fraud" className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Fraud Detection Endpoints</h3>
        
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-lg">POST /fraud/analyze</h4>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full">Protected</span>
            </div>
            <p className="text-gray-700 mb-3">Analyze transaction for fraud indicators</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Request:</p>
                <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-xs">
                  <pre>{`{
  "transaction_id": "tx_123",
  "amount": 1000000,
  "vendor_id": "vendor_456",
  "description": "Material procurement",
  "timestamp": "2025-10-17T10:30:00Z"
}`}</pre>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Response:</p>
                <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-xs">
                  <pre>{`{
  "fraud_score": 75.5,
  "risk_level": "high",
  "triggered_rules": [
    "Budget Anomaly",
    "Cost Inflation"
  ],
  "explanation": "Amount significantly...",
  "recommendations": [
    "Request additional documentation",
    "Conduct site visit"
  ]
}`}</pre>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-lg">GET /fraud/alerts</h4>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full">Protected</span>
            </div>
            <p className="text-gray-700 mb-3">Get active fraud alerts</p>
            
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Query Parameters:</p>
              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <code>status</code>: pending, investigating, resolved</li>
                  <li>• <code>severity</code>: low, medium, high, critical</li>
                </ul>
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Response:</p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-xs">
                <pre>{`[
  {
    "id": "alert_123",
    "transaction_id": "tx_456",
    "risk_score": 85.2,
    "severity": "critical",
    "detected_at": "2025-10-17T10:30:00Z",
    "investigated": false
  }
]`}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
        <h4 className="font-semibold text-lg mb-3">📚 Complete API Documentation</h4>
        <p className="text-gray-700 mb-4">
          For complete API documentation with all endpoints, visit the interactive Swagger UI:
        </p>
        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Open Swagger UI →
        </a>
      </div>
    </section>
  );
};
