import { Shield } from 'lucide-react';

export const BlockchainSection = () => {
  return (
    <section id="blockchain" className="mb-12 scroll-mt-20">
      <div className="flex items-center mb-6">
        <Shield className="h-8 w-8 text-blue-600 mr-3" />
        <h2 className="text-3xl font-bold text-gray-900">Blockchain/ICP Integration</h2>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200 mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">⛓️ Canister Architecture</h3>
        <p className="text-gray-700 mb-4">
          H.E.L.I.X. uses Internet Computer canisters (smart contracts) for immutable data storage and decentralized execution. 
          Two main canisters work together to provide complete transparency and fraud detection.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-lg mb-3 text-purple-900">📋 Procurement Canister</h4>
            <p className="text-sm text-gray-700 mb-3">Core government procurement management on blockchain</p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span><strong>Budget Management:</strong> Immutable budget allocation and tracking</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span><strong>Project Lifecycle:</strong> End-to-end project tracking</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span><strong>Vendor Management:</strong> Contractor registration and evaluation</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span><strong>Claim Processing:</strong> Payment claims with fraud detection</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span><strong>Public Transparency:</strong> Citizen-accessible APIs</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-lg mb-3 text-indigo-900">🚨 Fraud Engine Canister</h4>
            <p className="text-sm text-gray-700 mb-3">AI-powered fraud detection on blockchain</p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span><strong>ML Model Execution:</strong> Run fraud detection algorithms on-chain</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span><strong>Risk Scoring:</strong> Generate immutable fraud scores (0-100)</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span><strong>Alert Generation:</strong> Create tamper-proof fraud alerts</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span><strong>Pattern Analysis:</strong> Track fraud patterns across time</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span><strong>Evidence Preservation:</strong> Store fraud evidence permanently</span>
              </li>
            </ul>
          </div>
        </div>

        <details className="mb-4">
          <summary className="cursor-pointer font-medium text-gray-900 hover:text-purple-600 p-4 bg-white rounded-lg border">
            View Canister Directory Structure →
          </summary>
          <div className="mt-3 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto">
            <pre>{`canisters/
├── procurement/                    # Main procurement canister
│   ├── src/
│   │   ├── main.mo                # Primary canister logic
│   │   ├── types.mo               # Data type definitions
│   │   ├── rbac.mo                # Role-based access control
│   │   ├── budget.mo              # Budget management
│   │   ├── projects.mo            # Project lifecycle
│   │   ├── vendors.mo             # Vendor management
│   │   ├── claims.mo              # Payment claims
│   │   └── audit.mo               # Audit trail functions
│   └── procurement.did            # Candid interface
├── fraud_engine/                  # AI fraud detection canister
│   ├── src/
│   │   ├── main.mo                # Canister entry point
│   │   ├── ml_interface.mo        # ML model interface
│   │   ├── rules.mo               # Fraud detection rules
│   │   └── analytics.mo           # Pattern analysis
│   ├── python/                    # Python ML components
│   │   ├── ml_detector.py         # ML models
│   │   ├── feature_extractor.py   # Feature engineering
│   │   └── rules_engine.py        # Business rules
│   └── fraud_engine.did           # Candid interface
└── shared/                        # Shared utilities
    ├── types.mo                   # Common data types
    └── utils.mo                   # Shared functions`}</pre>
          </div>
        </details>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-lg border border-purple-300">
            <h4 className="font-semibold text-purple-900 mb-3">🎯 Blockchain Benefits</h4>
            <ul className="text-sm text-purple-800 space-y-2">
              <li>✓ <strong>Immutable Records:</strong> Cannot be altered or deleted</li>
              <li>✓ <strong>Decentralized Storage:</strong> Replicated across ICP nodes</li>
              <li>✓ <strong>Tamper-proof Audit Trails:</strong> Complete transaction history</li>
              <li>✓ <strong>Public Verification:</strong> Anyone can audit the ledger</li>
              <li>✓ <strong>No Single Point of Failure:</strong> Consensus-based validation</li>
              <li>✓ <strong>Cryptographic Proof:</strong> Mathematically verifiable authenticity</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-4 rounded-lg border border-blue-300">
            <h4 className="font-semibold text-blue-900 mb-3">⚡ Performance Metrics</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-blue-800">Query Response:</span>
                <span className="font-bold text-blue-900">&lt; 100ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-800">Update Calls:</span>
                <span className="font-bold text-blue-900">&lt; 2 seconds</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-800">Throughput:</span>
                <span className="font-bold text-blue-900">1,000+ tx/sec</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-800">Uptime:</span>
                <span className="font-bold text-blue-900">99.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-800">Storage:</span>
                <span className="font-bold text-blue-900">Unlimited</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="smart-contracts" className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Smart Contract Implementation</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-lg mb-3">Motoko Smart Contract Example</h4>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
            <pre>{`import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";

actor ProcurementCanister {
    private var budgets = HashMap.HashMap<Text, Budget>(10, Text.equal, Text.hash);
    
    // Budget allocation
    public shared(msg) func allocate_budget(
        amount: Nat,
        allocated_to: Text,
        purpose: Text
    ) : async Result.Result<Text, Text> {
        let caller = Principal.toText(msg.caller);
        
        // Verify caller has permission
        if (not RBAC.hasPermission(caller, #AllocateBudget)) {
            return #err("Permission denied");
        };
        
        // Create budget record
        let budget_id = generateId();
        let budget : Budget = {
            id = budget_id;
            amount = amount;
            allocated_to = allocated_to;
            allocated_by = caller;
            purpose = purpose;
            timestamp = Time.now();
            status = #Pending;
        };
        
        budgets.put(budget_id, budget);
        #ok(budget_id)
    };
    
    // Get transaction history
    public query func get_transaction_history(principal: Text) : async [Transaction] {
        // Return transactions for principal
    };
}`}</pre>
          </div>
        </div>
      </div>

      <div id="internet-identity" className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Internet Identity Integration</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
          <h4 className="font-semibold text-lg mb-3">Authentication Flow</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">1</span>
                <span>User clicks Login → Redirect to Internet Identity</span>
              </div>
              <div className="flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">2</span>
                <span>User authenticates with WebAuthn (biometric/hardware key)</span>
              </div>
              <div className="flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">3</span>
                <span>Internet Identity returns Principal ID + Delegation</span>
              </div>
              <div className="flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">4</span>
                <span>Frontend calls canister with Principal</span>
              </div>
              <div className="flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">5</span>
                <span>Canister verifies Principal and returns user data</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-lg mb-3">Frontend Integration Code</h4>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
            <pre>{`import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';

const authClient = await AuthClient.create();

// Login with Internet Identity
await authClient.login({
  identityProvider: 'https://identity.ic0.app',
  onSuccess: async () => {
    const identity = authClient.getIdentity();
    const principal = identity.getPrincipal().toString();
    
    // Create actor with authenticated identity
    const actor = Actor.createActor(idlFactory, {
      agent: new HttpAgent({ identity }),
      canisterId: CANISTER_ID
    });
    
    // Make authenticated canister call
    const result = await actor.allocate_budget({
      amount: 1000000,
      allocated_to: "recipient-principal",
      purpose: "School infrastructure"
    });
  }
});`}</pre>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
        <h4 className="font-semibold text-lg mb-3">Deployment Commands</h4>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Local Development:</p>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs">
              dfx start --clean --background<br />
              dfx deploy
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Mainnet Deployment:</p>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs">
              dfx deploy --network ic
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
