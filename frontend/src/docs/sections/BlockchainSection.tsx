import { Shield } from 'lucide-react';

export const BlockchainSection = () => {
  return (
    <section id="blockchain" className="mb-12 scroll-mt-20">
      <div className="flex items-center mb-6">
        <Shield className="h-8 w-8 text-blue-600 mr-3" />
        <h2 className="text-3xl font-bold text-gray-900">Blockchain/ICP Integration</h2>
      </div>

      <div id="canister" className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Canister Architecture</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
          <p className="text-gray-700 mb-4">
            H.E.L.I.X. uses Internet Computer canisters for immutable data storage and smart contract execution.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre className="text-gray-800">{`canisters/
├── procurement/              # Main procurement canister
│   ├── src/
│   │   ├── main.mo          # Primary canister logic
│   │   ├── types.mo         # Data type definitions
│   │   ├── rbac.mo          # Role-based access control
│   │   └── validation.mo    # Input validation
│   └── procurement.did      # Candid interface
└── fraud_engine/            # Fraud detection canister
    ├── main.py              # Python fraud engine
    ├── ml_detector.py       # ML-based detection
    └── rules_engine.py      # Rules-based detection`}</pre>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-2">Canister Benefits</h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Immutable transaction records</li>
              <li>• Decentralized storage</li>
              <li>• Tamper-proof audit trails</li>
              <li>• Public verification</li>
              <li>• No single point of failure</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Performance</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Query Response: &lt; 100ms</li>
              <li>• Update Calls: &lt; 2 seconds</li>
              <li>• Throughput: 1,000+ tx/sec</li>
              <li>• Uptime: 99.9%</li>
            </ul>
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
