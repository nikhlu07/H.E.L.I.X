// ================================================================================
// CORRUPTGUARD PROCUREMENT CANISTER - TYPES DEFINITION
// ================================================================================

import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Bool "mo:base/Bool";
import Int "mo:base/Int";

// ================================================================================
// CORE DATA TYPES
// ================================================================================

public type Budget = {
    amount: Nat;
    purpose: Text;
    locked: Bool;
    lockTime: Int;
};

public type Allocation = {
    stateHead: Principal;
    amount: Nat;
    area: Text;
    deputy: Principal;
    assigned: Bool;
    vendorAssigned: ?Principal;
};

public type Claim = {
    vendor: Principal;
    amount: Nat;
    invoiceHash: Text;
    deputy: Principal;
    aiApproved: Bool;
    flagged: Bool;
    paid: Bool;
    escrowTime: Int;
    totalPaidToSuppliers: Nat;
    fraudScore: ?Nat; // Fraud risk score (0-100)
    challengeCount: Nat; // Number of active challenges
};

public type SupplierPayment = {
    supplier: Principal;
    amount: Nat;
    invoiceHash: Text;
    verified: Bool;
    timestamp: Int;
};

public type Challenge = {
    staker: Principal;
    amount: Nat;
    withdrawn: Bool;
    reason: Text; // Challenge reason
    evidence: Text; // IPFS hash of evidence
    timestamp: Int;
};

public type RoleProposal = {
    candidate: Principal;
    proposalTime: Int;
    confirmed: Bool;
};

public type FraudAlert = {
    claimId: Nat;
    alertType: Text; // "cost_variance", "timeline_anomaly", "vendor_pattern"
    severity: Text; // "low", "medium", "high", "critical"
    description: Text;
    timestamp: Int;
    resolved: Bool;
};

// ================================================================================
// QUERY RESPONSE TYPES
// ================================================================================

public type ClaimInfo = {
    vendor: Principal;
    amount: Nat;
    invoiceHash: Text;
    paid: Bool;
    flagged: Bool;
    fraudScore: ?Nat;
    challengeCount: Nat;
    totalPaidToSuppliers: Nat;
};

public type ClaimSummary = {
    vendor: Principal;
    amount: Nat;
    flagged: Bool;
    fraudScore: ?Nat;
    challengeCount: Nat;
};

public type BudgetInfo = {
    amount: Nat;
    purpose: Text;
    allocated: Nat;
    remaining: Nat;
};

public type AllocationInfo = {
    stateHead: Principal;
    amount: Nat;
    area: Text;
    deputy: Principal;
    assigned: Bool;
    vendorAssigned: ?Principal;
};

public type RoleInfo = {
    isMainGovernment: Bool;
    isStateHead: Bool;
    isDeputy: Bool;
    isVendor: Bool;
};

public type SystemStats = {
    totalBudget: Nat;
    activeClaims: Nat;
    flaggedClaims: Nat;
    totalChallenges: Nat;
    vendorCount: Nat;
};

public type SystemInfo = {
    mainGovernment: Principal;
    totalStateHeads: Nat;
    totalDeputies: Nat;
    totalVendors: Nat;
    systemPaused: Bool;
    totalBudget: Nat;
    totalClaims: Nat;
};

public type FraudStats = {
    totalAlerts: Nat;
    criticalAlerts: Nat;
    highRiskClaims: Nat;
    averageFraudScore: Nat;
    totalChallenges: Nat;
};

public type PendingProposals = {
    stateHeadProposals: [(Principal, RoleProposal)];
    deputyProposals: [(Principal, RoleProposal)];
    vendorProposals: [Principal];
};

// ================================================================================
// CONSTANTS
// ================================================================================

public let STAKE_AMOUNT: Nat = 1_000_000; // 1 ICP
public let REWARD_AMOUNT: Nat = 5_000_000; // 5 ICP
public let MAX_STATE_HEADS: Nat = 10;
public let MAX_DEPUTIES: Nat = 50;
public let MAX_VENDORS: Nat = 50;
public let ROLE_CONFIRMATION_DELAY: Int = 0; // 0 for testing
public let TIME_LOCK_DURATION: Int = 0; // 0 for testing
public let ESCROW_DURATION: Int = 86_400_000_000_000; // 1 day in nanoseconds

// ================================================================================
// ERROR TYPES
// ================================================================================

public type Error = {
    code: Nat;
    message: Text;
    details: ?Text;
};

public let ERRORS = {
    UNAUTHORIZED = { code = 401; message = "Unauthorized access"; details = null };
    INVALID_INPUT = { code = 400; message = "Invalid input parameters"; details = null };
    NOT_FOUND = { code = 404; message = "Resource not found"; details = null };
    SYSTEM_PAUSED = { code = 503; message = "System is currently paused"; details = null };
    ALREADY_EXISTS = { code = 409; message = "Resource already exists"; details = null };
    INSUFFICIENT_FUNDS = { code = 402; message = "Insufficient funds"; details = null };
    FRAUD_DETECTED = { code = 422; message = "Fraud detected in transaction"; details = null };
};
