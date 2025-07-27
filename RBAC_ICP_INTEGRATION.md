# 🔐 RBAC Model with ICP Integration - CorruptGuard

## **Overview: How RBAC Works with Internet Computer**

The RBAC system in CorruptGuard uses a **dual-layer approach**:
1. **ICP Canister Level**: Blockchain-enforced role verification
2. **Backend API Level**: Application-level permission checking
3. **Frontend Level**: UI access control and role-based features

---

## **🏗️ Architecture Flow**

```
User Authentication → ICP Principal → Canister Role Check → Backend JWT → Frontend Permissions
```

### **Step-by-Step Process:**

1. **User logs in** via Internet Identity
2. **Principal Generated** (unique blockchain identity)
3. **Canister Checks Role** (stored on blockchain)
4. **Backend Issues JWT** (with role claims)
5. **Frontend Applies Permissions** (UI customization)

---

## **🎯 Role Hierarchy & Permissions**

### **1. Main Government** 
**Principal**: `rdmx6-jaaaa-aaaah-qcaiq-cai`
```typescript
permissions: [
  "budget_control",        // Create & lock budgets
  "role_management",       // Assign roles to principals
  "fraud_oversight",       // Override fraud decisions
  "system_administration", // Pause/resume system
  "canister_upgrade"       // Upgrade smart contracts
]
```

### **2. State Heads**
**Principals**: Assigned by Main Government
```typescript
permissions: [
  "budget_allocation",     // Allocate budget to deputies
  "deputy_management",     // Assign deputy roles
  "regional_oversight",    // Monitor regional claims
  "vendor_proposal"        // Propose new vendors
]
```

### **3. Deputies**
**Principals**: Assigned by State Heads
```typescript
permissions: [
  "vendor_selection",      // Select vendors for projects
  "project_management",    // Manage local projects
  "claim_review",          // Review vendor claims
  "local_oversight"        // Monitor local vendors
]
```

### **4. Vendors**
**Principals**: Approved by Government
```typescript
permissions: [
  "claim_submission",      // Submit payment claims
  "payment_tracking",      // Track payment status
  "supplier_management",   // Pay sub-suppliers
  "document_upload"        // Upload invoices/receipts
]
```

### **5. Citizens**
**Principals**: Self-registered (any II user)
```typescript
permissions: [
  "transparency_access",   // View public data
  "corruption_reporting",  // Report suspicious activity
  "community_verification", // Verify project completion
  "challenge_stakes"       // Stake challenges on claims
]
```

---

## **🔧 Technical Implementation**

### **A. ICP Canister Role Storage**

```motoko
// main.mo - Role verification functions
private var stateHeads = HashMap.HashMap<Principal, Bool>(10, Principal.equal, Principal.hash);
private var deputies = HashMap.HashMap<Principal, Principal>(50, Principal.equal, Principal.hash);
private var isVendor = HashMap.HashMap<Principal, Bool>(50, Principal.equal, Principal.hash);

public query func checkRole(principal: Principal): async {
    isMainGovernment: Bool;
    isStateHead: Bool;
    isDeputy: Bool;
    isVendor: Bool;
} {
    {
        isMainGovernment = isMainGovernment(principal);
        isStateHead = isStateHead(principal);
        isDeputy = isDeputy(principal);
        isVendor = switch (isVendor.get(principal)) {
            case (?true) { true };
            case _ { false };
        };
    }
}
```

### **B. Backend Role Validation**

```python
# backend/app/auth/middleware.py
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = credentials.credentials
    
    # Extract principal from JWT
    user_principal = extract_principal_from_token(token)
    
    # Verify role with ICP canister
    canister_roles = await canister_service.check_role(user_principal)
    
    # Create user object with verified roles
    return {
        "principal_id": user_principal,
        "role": determine_primary_role(canister_roles),
        "permissions": get_permissions_for_roles(canister_roles),
        "canister_verified": True
    }
```

### **C. Frontend Permission Guards**

```typescript
// frontend/src/contexts/AuthContext.tsx
export function useRoleAccess() {
    const { user } = useAuth();
    
    return {
        // Role checks
        isMainGovernment: user?.role === 'main_government',
        isStateHead: user?.role === 'state_head',
        isDeputy: user?.role === 'deputy',
        isVendor: user?.role === 'vendor',
        isCitizen: user?.role === 'citizen',
        
        // Permission checks
        canCreateBudgets: user?.permissions?.includes('budget_control'),
        canAllocateBudgets: user?.permissions?.includes('budget_allocation'),
        canSubmitClaims: user?.permissions?.includes('claim_submission'),
        canReportCorruption: user?.permissions?.includes('corruption_reporting'),
        
        // UI visibility
        showAdminPanel: user?.role === 'main_government',
        showVendorFeatures: user?.role === 'vendor',
        showPublicData: true // Everyone can see public transparency data
    };
}
```

---

## **🔄 Real-World RBAC Flow Examples**

### **Example 1: Government Creates Budget**

1. **User Action**: Main Government clicks "Create Budget"
2. **Frontend Check**: `canCreateBudgets` permission verified
3. **API Call**: POST to `/api/v1/government/budget/create`
4. **Backend Validation**: 
   ```python
   @require_main_government  # Role decorator
   async def create_budget(user: dict = Depends(get_current_user)):
   ```
5. **Canister Verification**: 
   ```motoko
   if (not isMainGovernment(msg.caller)) {
       return #err("Only main government");
   };
   ```
6. **Action Executed**: Budget locked on blockchain

### **Example 2: Vendor Submits Claim**

1. **User Action**: Vendor uploads invoice and submits claim
2. **Frontend Check**: `canSubmitClaims` permission verified
3. **API Call**: POST to `/api/v1/vendor/claim/submit`
4. **Backend Validation**:
   ```python
   @require_vendor_operations
   async def submit_claim(user: dict = Depends(get_current_user)):
   ```
5. **Canister Verification**:
   ```motoko
   switch (isVendor.get(msg.caller)) {
       case (?true) { /* Allow */ };
       case _ { return #err("Not a vendor") };
   };
   ```
6. **Fraud Analysis**: AI automatically analyzes claim
7. **Blockchain Storage**: Claim recorded immutably

### **Example 3: Citizen Reports Corruption**

1. **User Action**: Citizen challenges suspicious claim
2. **Frontend Check**: `canReportCorruption` permission (all citizens have this)
3. **API Call**: POST to `/api/v1/citizen/challenge/stake`
4. **Backend Validation**: Any authenticated user can challenge
5. **Canister Action**: Challenge recorded with stake
6. **Community Review**: Other citizens can validate

---

## **🛡️ Security Mechanisms**

### **1. Multi-Layer Validation**
- **Frontend**: Immediate UI feedback
- **Backend**: Server-side permission checking  
- **Canister**: Blockchain-enforced final validation

### **2. Principal-Based Identity**
```typescript
// Each user has unique cryptographic identity
const userPrincipal = "abc123-def456-ghi789-jkl012-mno345";

// Roles tied to principals on blockchain
const roleMapping = {
    "rdmx6-jaaaa-aaaah-qcaiq-cai": "main_government",
    "renrk-eyaaa-aaaah-qcaia-cai": "state_head",
    "rrkah-fqaaa-aaaah-qcaiq-cai": "deputy",
    "radvj-tiaaa-aaaah-qcaiq-cai": "vendor"
};
```

### **3. Immutable Audit Trail**
- All role assignments recorded on blockchain
- Permission changes create audit events
- Cannot be tampered with or deleted

---

## **📊 Permission Matrix**

| Action | Main Gov | State Head | Deputy | Vendor | Citizen |
|--------|----------|------------|--------|--------|---------|
| Create Budget | ✅ | ❌ | ❌ | ❌ | ❌ |
| Allocate Budget | ✅ | ✅ | ❌ | ❌ | ❌ |
| Select Vendor | ✅ | ✅ | ✅ | ❌ | ❌ |
| Submit Claim | ❌ | ❌ | ❌ | ✅ | ❌ |
| Pay Suppliers | ❌ | ❌ | ❌ | ✅ | ❌ |
| View Transparency | ✅ | ✅ | ✅ | ✅ | ✅ |
| Challenge Claims | ✅ | ✅ | ✅ | ❌ | ✅ |
| Fraud Override | ✅ | ❌ | ❌ | ❌ | ❌ |
| Role Management | ✅ | Limited | ❌ | ❌ | ❌ |

---

## **🚀 Implementation in Your Demo**

### **1. Role Assignment Demo**
```bash
# Main Government assigns State Head
curl -X POST "http://127.0.0.1:8000/api/v1/government/roles/assign" \
  -H "Authorization: Bearer {main_gov_token}" \
  -d '{"principal_id": "new-state-head-principal", "role": "state_head"}'
```

### **2. Permission Validation Demo**
```typescript
// Frontend component with role-based rendering
function GovernmentPanel() {
    const { canCreateBudgets, canManageRoles } = useRoleAccess();
    
    return (
        <div>
            {canCreateBudgets && (
                <button onClick={createBudget}>Create Budget</button>
            )}
            {canManageRoles && (
                <button onClick={assignRoles}>Manage Roles</button>
            )}
        </div>
    );
}
```

### **3. Cross-Validation Demo**
Show how the system validates at all three levels:
1. **Frontend**: Button disabled if no permission
2. **Backend**: API returns 403 if unauthorized
3. **Canister**: Transaction fails if role not verified

---

## **🎯 Benefits of This RBAC + ICP Model**

### **1. Trustless Verification**
- No central authority controls roles
- Blockchain consensus verifies permissions
- Cannot be hacked or corrupted

### **2. Complete Transparency**
- All role assignments are public
- Permission changes create audit trail
- Citizens can verify government authority

### **3. Scalable Governance**
- New roles can be added programmatically
- Permissions can be modified via governance
- Supports complex organizational hierarchies

### **4. Fraud Prevention**
- Role-based access prevents unauthorized actions
- All permission checks logged for audit
- Multi-signature requirements for sensitive operations

---

This RBAC model ensures that your government fraud detection system is not only technically secure but also governmentally compliant with proper separation of powers and public accountability.