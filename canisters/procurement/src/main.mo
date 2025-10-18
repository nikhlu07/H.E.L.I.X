import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Buffer "mo:base/Buffer";
import Blob "mo:base/Blob";

actor ClearGov {
    // ================================================================================
    // ckUSDC LEDGER INTEGRATION
    // ================================================================================
    
    // ckUSDC Ledger Canister Interface (ICRC-1 Standard)
    type Subaccount = Blob;
    type Account = { owner: Principal; subaccount: ?Subaccount };
    
    type TransferArgs = {
        from_subaccount: ?Subaccount;
        to: Account;
        amount: Nat;
        fee: ?Nat;
        memo: ?Blob;
        created_at_time: ?Nat64;
    };
    
    type TransferError = {
        #BadFee: { expected_fee: Nat };
        #BadBurn: { min_burn_amount: Nat };
        #InsufficientFunds: { balance: Nat };
        #TooOld;
        #CreatedInFuture: { ledger_time: Nat64 };
        #Duplicate: { duplicate_of: Nat };
        #TemporarilyUnavailable;
        #GenericError: { error_code: Nat; message: Text };
    };
    
    type TransferResult = Result.Result<Nat, TransferError>;
    
    // ICP Ledger Actor for ALL payments (you have ICP tokens)
    let ICP_ledger : actor {
        icrc1_balance_of: (Account) -> async Nat;
        icrc1_transfer: (TransferArgs) -> async TransferResult;
        icrc1_fee: () -> async Nat;
    } = actor("ryjl3-tyaaa-aaaaa-aaaba-cai"); // Official ICP ledger
    // Types
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

    // State variables
    private stable var systemAuditor: Principal = Principal.fromText("rdmx6-jaaaa-aaaah-qcaiq-cai"); // SUPER ADMIN - deployer
    private stable var mainGovernment: Principal = Principal.fromText("2vxsx-fae"); // Placeholder - will be set by auditor
    private stable var canisterPrincipal: Principal = Principal.fromText("aaaaa-aa"); // Will be set after deployment
    private var stateHeads = HashMap.HashMap<Principal, Bool>(10, Principal.equal, Principal.hash);
    private var deputies = HashMap.HashMap<Principal, Principal>(50, Principal.equal, Principal.hash);
    
    // DEMO MODE - Allows one principal to act as multiple roles
    private stable var demoMode: Bool = true; // Set to true for hackathon demo
    private stable var demoMasterPrincipal: ?Principal = null; // The one II that can be everything
    private stable var simulateTransfers: Bool = true; // Set to false when you have real ICP tokens
    private stable var allowPublicDemo: Bool = true; // Allow anyone to use demo mode (for judges)
    
    private stable var budget: Nat = 0;
    private stable var reservedBudget: Nat = 0;
    private stable var paused: Bool = false;
    private stable var isLocked: Bool = false;

    // Budgets and allocations
    private var budgets = HashMap.HashMap<Nat, Budget>(100, Nat.equal, func(n: Nat) : Nat32 { Nat32.fromNat(n % 2**32) });
    private var allocations = HashMap.HashMap<Nat, [Allocation]>(100, Nat.equal, func(n: Nat) : Nat32 { Nat32.fromNat(n % 2**32) });
    private stable var budgetCount: Nat = 0;

    // Vendor management
    private var vettedVendors = Buffer.Buffer<Principal>(50);
    private var isVendor = HashMap.HashMap<Principal, Bool>(50, Principal.equal, Principal.hash);
    private var pendingVendors = HashMap.HashMap<Principal, Bool>(50, Principal.equal, Principal.hash);
    private stable var vendorCount: Nat = 0;

    // Claims and payments
    private var claims = HashMap.HashMap<Nat, Claim>(1000, Nat.equal, func(n: Nat) : Nat32 { Nat32.fromNat(n % 2**32) });
    private var supplierPayments = HashMap.HashMap<Nat, [SupplierPayment]>(1000, Nat.equal, func(n: Nat) : Nat32 { Nat32.fromNat(n % 2**32) });
    private var invoiceClaimed = HashMap.HashMap<Text, Bool>(1000, Text.equal, Text.hash);
    private var invoiceToClaimId = HashMap.HashMap<Text, Nat>(1000, Text.equal, Text.hash);
    private stable var claimCount: Nat = 0;

    // Challenges and fraud detection
    private var invoiceChallenges = HashMap.HashMap<Text, [Challenge]>(1000, Text.equal, Text.hash);
    private var approvedStakers = HashMap.HashMap<Principal, Bool>(100, Principal.equal, Principal.hash);
    private var fraudAlerts = HashMap.HashMap<Nat, [FraudAlert]>(1000, Nat.equal, func(n: Nat) : Nat32 { Nat32.fromNat(n % 2**32) });

    // Role proposals
    private var stateHeadProposals = HashMap.HashMap<Principal, RoleProposal>(10, Principal.equal, Principal.hash);
    private var deputyProposals = HashMap.HashMap<Principal, RoleProposal>(50, Principal.equal, Principal.hash);

    // Constants
    private let STAKE_AMOUNT: Nat = 1_000_000; // 1 ICP
    private let REWARD_AMOUNT: Nat = 5_000_000; // 5 ICP
    private let MAX_STATE_HEADS: Nat = 10;
    private let MAX_DEPUTIES: Nat = 50;
    private let MAX_VENDORS: Nat = 50;
    private let ROLE_CONFIRMATION_DELAY: Int = 0; // 0 for testing
    private let TIME_LOCK_DURATION: Int = 0; // 0 for testing
    private let ESCROW_DURATION: Int = 86_400_000_000_000; // 1 day in nanoseconds

    // Role checking functions
    private func isAuditor(caller: Principal): Bool {
        // In demo mode, master principal OR anyone if public demo
        if (demoMode) {
            if (allowPublicDemo) { return true }; // ANYONE can be auditor in public demo
            switch (demoMasterPrincipal) {
                case (?master) { 
                    if (Principal.equal(caller, master)) { return true };
                };
                case null {};
            };
        };
        Principal.equal(caller, systemAuditor)
    };

    private func isMainGovernment(caller: Principal): Bool {
        // In demo mode, master principal OR anyone if public demo
        if (demoMode) {
            if (allowPublicDemo) { return true }; // ANYONE can be government in public demo
            switch (demoMasterPrincipal) {
                case (?master) { 
                    if (Principal.equal(caller, master)) { return true };
                };
                case null {};
            };
        };
        Principal.equal(caller, mainGovernment)
    };

    private func isStateHead(caller: Principal): Bool {
        // In demo mode, master principal OR anyone if public demo
        if (demoMode) {
            if (allowPublicDemo) { return true };
            switch (demoMasterPrincipal) {
                case (?master) { 
                    if (Principal.equal(caller, master)) { return true };
                };
                case null {};
            };
        };
        switch (stateHeads.get(caller)) {
            case (?true) { true };
            case _ { false };
        }
    };

    private func isDeputy(caller: Principal): Bool {
        // In demo mode, master principal OR anyone if public demo
        if (demoMode) {
            if (allowPublicDemo) { return true };
            switch (demoMasterPrincipal) {
                case (?master) { 
                    if (Principal.equal(caller, master)) { return true };
                };
                case null {};
            };
        };
        switch (deputies.get(caller)) {
            case (?_) { true };
            case null { false };
        }
    };

    private func isAuthorized(caller: Principal): Bool {
        isAuditor(caller) or isMainGovernment(caller) or isStateHead(caller) or isDeputy(caller)
    };

    private func isSuperAdmin(caller: Principal): Bool {
        isAuditor(caller) // Only auditor has super admin rights
    };

    // ================================================================================
    // FRAUD DETECTION INTEGRATION FUNCTIONS
    // ================================================================================

    public shared(msg) func updateFraudScore(claimId: Nat, score: Nat): async Result.Result<(), Text> {
        if (not isMainGovernment(msg.caller) and not isAuditor(msg.caller)) {
            return #err("Only main government or auditor can update fraud scores");
        };

        switch (claims.get(claimId)) {
            case (?claim) {
                let updatedClaim = {
                    claim with fraudScore = ?score
                };
                claims.put(claimId, updatedClaim);
                
                // Auto-flag high-risk claims
                if (score >= 80) {
                    let _ = await flagClaimForReview(claimId, "High fraud risk score: " # Nat.toText(score));
                };
                
                #ok(())
            };
            case null { #err("Claim not found") };
        }
    };

    public shared(msg) func addFraudAlert(claimId: Nat, alertType: Text, severity: Text, description: Text): async Result.Result<(), Text> {
        if (not isMainGovernment(msg.caller)) {
            return #err("Only main government can add fraud alerts");
        };

        let alert: FraudAlert = {
            claimId = claimId;
            alertType = alertType;
            severity = severity;
            description = description;
            timestamp = Time.now();
            resolved = false;
        };

        switch (fraudAlerts.get(claimId)) {
            case (?existingAlerts) {
                fraudAlerts.put(claimId, Array.append(existingAlerts, [alert]));
            };
            case null {
                fraudAlerts.put(claimId, [alert]);
            };
        };

        #ok(())
    };

    // ================================================================================
    // MAIN GOVERNMENT FUNCTIONS
    // ================================================================================

    public shared(msg) func proposeStateHead(stateHead: Principal): async Result.Result<(), Text> {
        if (not isMainGovernment(msg.caller) and not isAuditor(msg.caller)) {
            return #err("Only main government or auditor");
        };
        if (paused) {
            return #err("System paused");
        };

        let currentCount = stateHeads.size();
        if (currentCount >= MAX_STATE_HEADS) {
            return #err("Max state heads reached");
        };

        switch (stateHeads.get(stateHead)) {
            case (?true) { return #err("Already a state head") };
            case _ { };
        };

        let proposal: RoleProposal = {
            candidate = stateHead;
            proposalTime = Time.now();
            confirmed = false;
        };
        stateHeadProposals.put(stateHead, proposal);
        #ok(())
    };

    public shared(msg) func confirmStateHead(stateHead: Principal): async Result.Result<(), Text> {
        if (not isMainGovernment(msg.caller) and not isAuditor(msg.caller)) {
            return #err("Only main government or auditor");
        };

        switch (stateHeadProposals.get(stateHead)) {
            case (?proposal) {
                if (proposal.confirmed) {
                    return #err("Already confirmed");
                };
                if (Time.now() < proposal.proposalTime + ROLE_CONFIRMATION_DELAY) {
                    return #err("Confirmation delay not met");
                };
                
                stateHeads.put(stateHead, true);
                approvedStakers.put(stateHead, true);
                
                let updatedProposal = { proposal with confirmed = true };
                stateHeadProposals.put(stateHead, updatedProposal);
                #ok(())
            };
            case null { #err("Not proposed") };
        }
    };

    // ================================================================================
    // DEPUTY MANAGEMENT FUNCTIONS (MISSING FROM YOUR CODE)
    // ================================================================================

    public shared(msg) func proposeDeputy(deputy: Principal, stateHead: Principal): async Result.Result<(), Text> {
        if (not isStateHead(msg.caller) and not isMainGovernment(msg.caller)) {
            return #err("Only state heads or main government can propose deputies");
        };
        if (paused) {
            return #err("System paused");
        };

        let currentCount = deputies.size();
        if (currentCount >= MAX_DEPUTIES) {
            return #err("Max deputies reached");
        };

        switch (deputies.get(deputy)) {
            case (?_) { return #err("Already a deputy") };
            case null { };
        };

        let proposal: RoleProposal = {
            candidate = deputy;
            proposalTime = Time.now();
            confirmed = false;
        };
        deputyProposals.put(deputy, proposal);
        #ok(())
    };

    public shared(msg) func confirmDeputy(deputy: Principal, stateHead: Principal): async Result.Result<(), Text> {
        if (not isStateHead(msg.caller) and not isMainGovernment(msg.caller)) {
            return #err("Only state heads or main government can confirm deputies");
        };

        switch (deputyProposals.get(deputy)) {
            case (?proposal) {
                if (proposal.confirmed) {
                    return #err("Already confirmed");
                };
                if (Time.now() < proposal.proposalTime + ROLE_CONFIRMATION_DELAY) {
                    return #err("Confirmation delay not met");
                };
                
                deputies.put(deputy, stateHead);
                approvedStakers.put(deputy, true);
                
                let updatedProposal = { proposal with confirmed = true };
                deputyProposals.put(deputy, updatedProposal);
                #ok(())
            };
            case null { #err("Not proposed") };
        }
    };

    // Vendor selection by deputy
    public shared(msg) func selectVendor(budgetId: Nat, allocationId: Nat, vendor: Principal): async Result.Result<(), Text> {
        if (not isDeputy(msg.caller)) {
            return #err("Only deputies can select vendors");
        };
        if (paused) {
            return #err("System paused");
        };

        // Check if vendor is approved
        switch (isVendor.get(vendor)) {
            case (?true) { };
            case _ { return #err("Vendor not approved") };
        };

        switch (allocations.get(budgetId)) {
            case (?allocationList) {
                if (allocationId >= allocationList.size()) {
                    return #err("Invalid allocation ID");
                };
                
                let allocation = allocationList[allocationId];
                
                // Check if deputy has authority over this allocation
                if (not Principal.equal(allocation.deputy, msg.caller)) {
                    return #err("Not authorized for this allocation");
                };
                
                if (allocation.assigned) {
                    return #err("Vendor already assigned");
                };
                
                // Update allocation with vendor assignment
                let updatedAllocation = {
                    allocation with 
                    assigned = true;
                    vendorAssigned = ?vendor;
                };
                
                // Update the allocation in the list
                let updatedList = Array.tabulate<Allocation>(allocationList.size(), func(i) {
                    if (i == allocationId) { updatedAllocation } else { allocationList[i] }
                });
                
                allocations.put(budgetId, updatedList);
                #ok(())
            };
            case null { #err("Invalid budget ID") };
        }
    };

    // ================================================================================
    // BUDGET MANAGEMENT
    // ================================================================================

    public shared(msg) func lockBudget(amount: Nat, purpose: Text): async Result.Result<Nat, Text> {
        if (not isMainGovernment(msg.caller)) {
            return #err("Only main government");
        };
        if (paused) {
            return #err("System paused");
        };
        if (amount == 0) {
            return #err("Invalid amount");
        };

        budgetCount += 1;
        let newBudget: Budget = {
            amount = amount;
            purpose = purpose;
            locked = true;
            lockTime = Time.now();
        };
        budgets.put(budgetCount, newBudget);
        budget += amount;
        
        #ok(budgetCount)
    };

    public shared(msg) func allocateBudget(budgetId: Nat, amount: Nat, area: Text, deputy: Principal): async Result.Result<(), Text> {
        if (not isAuthorized(msg.caller)) {
            return #err("Not authorized");
        };
        if (paused) {
            return #err("System paused");
        };

        switch (budgets.get(budgetId)) {
            case (?budgetItem) {
                if (not budgetItem.locked) {
                    return #err("Budget not locked");
                };
                if (amount == 0 or amount > budgetItem.amount) {
                    return #err("Invalid amount");
                };
                if (Time.now() < budgetItem.lockTime + TIME_LOCK_DURATION) {
                    return #err("Budget still in time lock");
                };

                switch (deputies.get(deputy)) {
                    case (?_) {
                        let allocation: Allocation = {
                            stateHead = msg.caller;
                            amount = amount;
                            area = area;
                            deputy = deputy;
                            assigned = false;
                            vendorAssigned = null;
                        };
                        
                        switch (allocations.get(budgetId)) {
                            case (?existingAllocations) {
                                allocations.put(budgetId, Array.append(existingAllocations, [allocation]));
                            };
                            case null {
                                allocations.put(budgetId, [allocation]);
                            };
                        };
                        #ok(())
                    };
                    case null { #err("Invalid deputy") };
                }
            };
            case null { #err("Invalid budget ID") };
        }
    };

    // ================================================================================
    // VENDOR MANAGEMENT
    // ================================================================================

    public shared(msg) func proposeVendor(vendor: Principal): async Result.Result<(), Text> {
        if (not isMainGovernment(msg.caller)) {
            return #err("Only main government");
        };

        switch (isVendor.get(vendor)) {
            case (?true) { return #err("Already a vendor") };
            case _ { };
        };

        switch (pendingVendors.get(vendor)) {
            case (?true) { return #err("Already proposed") };
            case _ { };
        };

        if (vendorCount >= MAX_VENDORS) {
            return #err("Max vendors reached");
        };

        pendingVendors.put(vendor, true);
        #ok(())
    };

    public shared(msg) func approveVendor(vendor: Principal): async Result.Result<(), Text> {
        if (not isMainGovernment(msg.caller)) {
            return #err("Only main government");
        };

        switch (pendingVendors.get(vendor)) {
            case (?true) {
                vettedVendors.add(vendor);
                isVendor.put(vendor, true);
                vendorCount += 1;
                pendingVendors.delete(vendor);
                #ok(())
            };
            case _ { #err("Vendor not proposed") };
        }
    };

    // ================================================================================
    // CLAIM SUBMISSION AND MANAGEMENT
    // ================================================================================

    public shared(msg) func submitClaim(budgetId: Nat, allocationId: Nat, amount: Nat, invoiceData: Text): async Result.Result<Nat, Text> {
        // Check if caller is vendor (or demo user)
        let isCallerVendor = switch (isVendor.get(msg.caller)) {
            case (?true) { true };
            case _ { 
                // In demo mode, check permissions
                if (demoMode) {
                    if (allowPublicDemo) { true } // Anyone can be vendor in public demo
                    else {
                        switch (demoMasterPrincipal) {
                            case (?master) { Principal.equal(msg.caller, master) };
                            case null { false };
                        }
                    }
                } else { false }
            };
        };
        
        if (not isCallerVendor) {
            return #err("Not a vendor");
        };

        if (paused) {
            return #err("System paused");
        };

        switch (allocations.get(budgetId)) {
            case (?allocationList) {
                if (allocationId >= allocationList.size()) {
                    return #err("Invalid allocation ID");
                };
                
                let allocation = allocationList[allocationId];
                if (not allocation.assigned) {
                    return #err("Vendor not selected");
                };
                if (amount == 0 or amount > allocation.amount) {
                    return #err("Invalid amount");
                };

                let invoiceHash = Text.concat(invoiceData, Principal.toText(msg.caller));
                
                switch (invoiceClaimed.get(invoiceHash)) {
                    case (?true) { return #err("Invoice already claimed") };
                    case _ { };
                };

                claimCount += 1;
                let claim: Claim = {
                    vendor = msg.caller;
                    amount = amount;
                    invoiceHash = invoiceHash;
                    deputy = allocation.deputy;
                    aiApproved = false;
                    flagged = false;
                    paid = false;
                    escrowTime = 0;
                    totalPaidToSuppliers = 0;
                    fraudScore = null; // Will be set by fraud detection engine
                    challengeCount = 0;
                };

                claims.put(claimCount, claim);
                invoiceClaimed.put(invoiceHash, true);
                invoiceToClaimId.put(invoiceHash, claimCount);
                reservedBudget += amount;

                // Trigger fraud detection webhook
                Debug.print("FRAUD_DETECTION_TRIGGER: ClaimID=" # Nat.toText(claimCount) # " Amount=" # Nat.toText(amount));

                #ok(claimCount)
            };
            case null { #err("Invalid budget ID") };
        }
    };

    // AI/Fraud detection functions
    public shared(msg) func approveClaimByAI(claimId: Nat, approve: Bool, flagReason: Text): async Result.Result<(), Text> {
        if (not isMainGovernment(msg.caller)) {
            return #err("Only main government");
        };

        switch (claims.get(claimId)) {
            case (?claim) {
                if (claim.aiApproved or claim.flagged) {
                    return #err("Already processed by AI");
                };

                if (approve) {
                    let updatedClaim = {
                        claim with 
                        aiApproved = true;
                        escrowTime = Time.now();
                    };
                    claims.put(claimId, updatedClaim);
                } else {
                    let updatedClaim = {
                        claim with flagged = true
                    };
                    claims.put(claimId, updatedClaim);
                    
                    // Add fraud alert
                    let _ = await addFraudAlert(claimId, "ai_review", "high", flagReason);
                };
                #ok(())
            };
            case null { #err("Invalid claim") };
        }
    };

    private func flagClaimForReview(claimId: Nat, reason: Text): async Result.Result<(), Text> {
        switch (claims.get(claimId)) {
            case (?claim) {
                let updatedClaim = {
                    claim with flagged = true
                };
                claims.put(claimId, updatedClaim);
                #ok(())
            };
            case null { #err("Claim not found") };
        }
    };

    // ================================================================================
    // CHALLENGE SYSTEM
    // ================================================================================

    public shared(msg) func stakeChallenge(invoiceHash: Text, reason: Text, evidence: Text): async Result.Result<Nat, Text> {
        switch (invoiceClaimed.get(invoiceHash)) {
            case (?true) { };
            case _ { return #err("Invoice not found") };
        };

        // REAL ICP TRANSFER - Citizen stakes 1 ICP
        // Transfer from citizen to this canister
        let stakeTransferArgs : TransferArgs = {
            from_subaccount = null;
            to = { owner = canisterPrincipal; subaccount = null }; // Canister holds the stake
            amount = STAKE_AMOUNT; // 1 ICP in e8s
            fee = null;
            memo = null;
            created_at_time = null;
        };

        let stakeResult = await ICP_ledger.icrc1_transfer(stakeTransferArgs);

        switch (stakeResult) {
            case (#Ok(blockIndex)) {
                // Stake successful! Record challenge
                let challenge: Challenge = {
                    staker = msg.caller;
                    amount = STAKE_AMOUNT;
                    withdrawn = false;
                    reason = reason;
                    evidence = evidence;
                    timestamp = Time.now();
                };

                switch (invoiceChallenges.get(invoiceHash)) {
                    case (?existingChallenges) {
                        invoiceChallenges.put(invoiceHash, Array.append(existingChallenges, [challenge]));
                    };
                    case null {
                        invoiceChallenges.put(invoiceHash, [challenge]);
                    };
                };

                // Update challenge count on claim
                switch (invoiceToClaimId.get(invoiceHash)) {
                    case (?claimId) {
                        switch (claims.get(claimId)) {
                            case (?claim) {
                                let updatedClaim = {
                                    claim with challengeCount = claim.challengeCount + 1
                                };
                                claims.put(claimId, updatedClaim);
                            };
                            case null { };
                        };
                    };
                    case null { };
                };

                Debug.print("CITIZEN CHALLENGE: " # Principal.toText(msg.caller) # " staked 1 ICP at block " # Nat.toText(blockIndex));
                
                #ok(blockIndex) // Return block index as proof
            };
            case (#Err(error)) {
                #err("Failed to stake ICP - ensure you have 1 ICP balance")
            };
        }
    };

    // ================================================================================
    // QUERY FUNCTIONS FOR TRANSPARENCY (ENHANCED)
    // ================================================================================

    public query func getClaim(claimId: Nat): async ?{
        vendor: Principal;
        amount: Nat;
        invoiceHash: Text;
        paid: Bool;
        flagged: Bool;
        fraudScore: ?Nat;
        challengeCount: Nat;
        totalPaidToSuppliers: Nat;
    } {
        switch (claims.get(claimId)) {
            case (?claim) {
                ?{
                    vendor = claim.vendor;
                    amount = claim.amount;
                    invoiceHash = claim.invoiceHash;
                    paid = claim.paid;
                    flagged = claim.flagged;
                    fraudScore = claim.fraudScore;
                    challengeCount = claim.challengeCount;
                    totalPaidToSuppliers = claim.totalPaidToSuppliers;
                }
            };
            case null { null };
        }
    };

    public query func getFraudAlerts(claimId: Nat): async [FraudAlert] {
        switch (fraudAlerts.get(claimId)) {
            case (?alerts) { alerts };
            case null { [] };
        }
    };

    public query func getAllClaims(): async [(Nat, {
        vendor: Principal;
        amount: Nat;
        flagged: Bool;
        fraudScore: ?Nat;
        challengeCount: Nat;
    })] {
        var result: [(Nat, {vendor: Principal; amount: Nat; flagged: Bool; fraudScore: ?Nat; challengeCount: Nat})] = [];
        for ((id, claim) in claims.entries()) {
            result := Array.append(result, [(id, {
                vendor = claim.vendor;
                amount = claim.amount;
                flagged = claim.flagged;
                fraudScore = claim.fraudScore;
                challengeCount = claim.challengeCount;
            })]);
        };
        result
    };

    public query func getHighRiskClaims(): async [(Nat, Nat)] {
        var result: [(Nat, Nat)] = [];
        for ((id, claim) in claims.entries()) {
            switch (claim.fraudScore) {
                case (?score) {
                    if (score >= 70) {
                        result := Array.append(result, [(id, score)]);
                    };
                };
                case null { };
            };
        };
        result
    };

    public query func getBudgetTransparency(): async [(Nat, {
        amount: Nat;
        purpose: Text;
        allocated: Nat;
        remaining: Nat;
    })] {
        var result: [(Nat, {amount: Nat; purpose: Text; allocated: Nat; remaining: Nat})] = [];
        for ((id, budget) in budgets.entries()) {
            var totalAllocated: Nat = 0;
            switch (allocations.get(id)) {
                case (?allocationList) {
                    for (allocation in allocationList.vals()) {
                        totalAllocated += allocation.amount;
                    };
                };
                case null { };
            };
            
            result := Array.append(result, [(id, {
                amount = budget.amount;
                purpose = budget.purpose;
                allocated = totalAllocated;
                remaining = budget.amount - totalAllocated;
            })]);
        };
        result
    };

    // ================================================================================
    // NEW QUERY FUNCTIONS FOR FRONTEND INTEGRATION
    // ================================================================================

    public query func getVendorClaims(vendor: Principal): async [(Nat, {
        amount: Nat;
        invoiceHash: Text;
        deputy: Principal;
        aiApproved: Bool;
        flagged: Bool;
        paid: Bool;
        fraudScore: ?Nat;
        challengeCount: Nat;
    })] {
        var result: [(Nat, {amount: Nat; invoiceHash: Text; deputy: Principal; aiApproved: Bool; flagged: Bool; paid: Bool; fraudScore: ?Nat; challengeCount: Nat})] = [];
        for ((id, claim) in claims.entries()) {
            if (Principal.equal(claim.vendor, vendor)) {
                result := Array.append(result, [(id, {
                    amount = claim.amount;
                    invoiceHash = claim.invoiceHash;
                    deputy = claim.deputy;
                    aiApproved = claim.aiApproved;
                    flagged = claim.flagged;
                    paid = claim.paid;
                    fraudScore = claim.fraudScore;
                    challengeCount = claim.challengeCount;
                })]);
            };
        };
        result
    };

    public query func getAllocations(budgetId: Nat): async ?[{
        stateHead: Principal;
        amount: Nat;
        area: Text;
        deputy: Principal;
        assigned: Bool;
        vendorAssigned: ?Principal;
    }] {
        switch (allocations.get(budgetId)) {
            case (?allocationList) {
                ?Array.map<Allocation, {stateHead: Principal; amount: Nat; area: Text; deputy: Principal; assigned: Bool; vendorAssigned: ?Principal}>(allocationList, func(a) {
                    {
                        stateHead = a.stateHead;
                        amount = a.amount;
                        area = a.area;
                        deputy = a.deputy;
                        assigned = a.assigned;
                        vendorAssigned = a.vendorAssigned;
                    }
                })
            };
            case null { null };
        }
    };

    public query func checkRole(principal: Principal): async {
        isAuditor: Bool;
        isMainGovernment: Bool;
        isStateHead: Bool;
        isDeputy: Bool;
        isVendor: Bool;
        isDemoMaster: Bool;
    } {
        let isDemoMaster = switch (demoMasterPrincipal) {
            case (?master) { Principal.equal(principal, master) };
            case null { false };
        };
        
        {
            isAuditor = isAuditor(principal);
            isMainGovernment = isMainGovernment(principal);
            isStateHead = isStateHead(principal);
            isDeputy = isDeputy(principal);
            isVendor = switch (isVendor.get(principal)) {
                case (?true) { true };
                case _ { isDemoMaster and demoMode }; // Demo master can be vendor
            };
            isDemoMaster = isDemoMaster;
        }
    };

    public query func getPendingProposals(): async {
        stateHeadProposals: [(Principal, RoleProposal)];
        deputyProposals: [(Principal, RoleProposal)];
        vendorProposals: [Principal];
    } {
        var stateHeadList: [(Principal, RoleProposal)] = [];
        for ((principal, proposal) in stateHeadProposals.entries()) {
            if (not proposal.confirmed) {
                stateHeadList := Array.append(stateHeadList, [(principal, proposal)]);
            };
        };
        
        var deputyList: [(Principal, RoleProposal)] = [];
        for ((principal, proposal) in deputyProposals.entries()) {
            if (not proposal.confirmed) {
                deputyList := Array.append(deputyList, [(principal, proposal)]);
            };
        };
        
        var vendorList: [Principal] = [];
        for ((vendor, _) in pendingVendors.entries()) {
            vendorList := Array.append(vendorList, [vendor]);
        };
        
        {
            stateHeadProposals = stateHeadList;
            deputyProposals = deputyList;
            vendorProposals = vendorList;
        }
    };

    // ================================================================================
    // SYSTEM STATUS
    // ================================================================================

    public query func getSystemStats(): async {
        totalBudget: Nat;
        activeClaims: Nat;
        flaggedClaims: Nat;
        totalChallenges: Nat;
        vendorCount: Nat;
    } {
        var flaggedCount: Nat = 0;
        var totalChallengeCount: Nat = 0;
        
        for ((_, claim) in claims.entries()) {
            if (claim.flagged) {
                flaggedCount += 1;
            };
            totalChallengeCount += claim.challengeCount;
        };

        {
            totalBudget = budget;
            activeClaims = claimCount;
            flaggedClaims = flaggedCount;
            totalChallenges = totalChallengeCount;
            vendorCount = vendorCount;
        }
    };

    // ================================================================================
    // ADMINISTRATION FUNCTIONS
    // ================================================================================

    public shared(msg) func pauseSystem(): async Result.Result<(), Text> {
        if (not isMainGovernment(msg.caller)) {
            return #err("Only main government can pause system");
        };
        paused := true;
        #ok(())
    };

    public shared(msg) func resumeSystem(): async Result.Result<(), Text> {
        if (not isMainGovernment(msg.caller)) {
            return #err("Only main government can resume system");
        };
        paused := false;
        #ok(())
    };

    public shared(msg) func setMainGovernment(newMainGov: Principal): async Result.Result<(), Text> {
        if (not isAuditor(msg.caller)) {
            return #err("Only auditor can set main government");
        };
        mainGovernment := newMainGov;
        #ok(())
    };

    public shared(msg) func setAuditor(newAuditor: Principal): async Result.Result<(), Text> {
        if (not isAuditor(msg.caller)) {
            return #err("Only current auditor can transfer auditor role");
        };
        systemAuditor := newAuditor;
        #ok(())
    };

    // ================================================================================
    // DEMO MODE MANAGEMENT
    // ================================================================================

    public shared(msg) func setCanisterPrincipal(principal: Principal): async Result.Result<(), Text> {
        if (not isAuditor(msg.caller)) {
            return #err("Only auditor can set canister principal");
        };
        canisterPrincipal := principal;
        #ok(())
    };

    public shared(msg) func enableDemoMode(masterPrincipal: Principal): async Result.Result<(), Text> {
        if (not isAuditor(msg.caller)) {
            return #err("Only auditor can enable demo mode");
        };
        demoMode := true;
        demoMasterPrincipal := ?masterPrincipal;
        Debug.print("DEMO MODE ENABLED: " # Principal.toText(masterPrincipal) # " can act as all roles");
        #ok(())
    };

    public shared(msg) func enablePublicDemo(): async Result.Result<(), Text> {
        if (not isAuditor(msg.caller)) {
            return #err("Only auditor can enable public demo");
        };
        allowPublicDemo := true;
        demoMode := true;
        Debug.print("PUBLIC DEMO ENABLED: Any user can demonstrate all roles");
        #ok(())
    };

    public shared(msg) func disablePublicDemo(): async Result.Result<(), Text> {
        if (not isAuditor(msg.caller)) {
            return #err("Only auditor can disable public demo");
        };
        allowPublicDemo := false;
        Debug.print("PUBLIC DEMO DISABLED: Strict role enforcement");
        #ok(())
    };

    public shared(msg) func disableDemoMode(): async Result.Result<(), Text> {
        if (not isAuditor(msg.caller)) {
            return #err("Only auditor can disable demo mode");
        };
        demoMode := false;
        demoMasterPrincipal := null;
        Debug.print("DEMO MODE DISABLED: Strict role enforcement enabled");
        #ok(())
    };

    public query func getDemoStatus(): async {
        demoModeEnabled: Bool;
        demoMasterPrincipal: ?Principal;
        allowPublicDemo: Bool;
    } {
        {
            demoModeEnabled = demoMode;
            demoMasterPrincipal = demoMasterPrincipal;
            allowPublicDemo = allowPublicDemo;
        }
    };

    // ================================================================================
    // PAYMENT FUNCTIONS WITH REAL ckUSDC TRANSFERS
    // ================================================================================

    public shared(msg) func approveAndPayClaim(claimId: Nat): async Result.Result<Nat, Text> {
        // Approve claim and transfer REAL ckUSDC to vendor
        if (not isMainGovernment(msg.caller) and not isDeputy(msg.caller)) {
            return #err("Only government or deputy can approve payments");
        };

        switch (claims.get(claimId)) {
            case (?claim) {
                if (claim.paid) {
                    return #err("Claim already paid");
                };
                if (claim.flagged) {
                    return #err("Cannot pay flagged claim");
                };

                // ICP TRANSFER to vendor (real or simulated)
                if (simulateTransfers) {
                    // SIMULATED for demo (no ICP needed)
                    let updatedClaim = {
                        claim with 
                        paid = true;
                        aiApproved = true;
                    };
                    claims.put(claimId, updatedClaim);
                    
                    Debug.print("SIMULATED PAYMENT: Claim " # Nat.toText(claimId) # " - would pay " # Nat.toText(claim.amount) # " ICP to vendor");
                    
                    #ok(99999) // Fake block index for demo
                } else {
                    // REAL ICP TRANSFER
                    let transferArgs : TransferArgs = {
                        from_subaccount = null;
                        to = { owner = claim.vendor; subaccount = null };
                        amount = claim.amount;
                        fee = null;
                        memo = null;
                        created_at_time = null;
                    };

                    let transferResult = await ICP_ledger.icrc1_transfer(transferArgs);

                    switch (transferResult) {
                        case (#Ok(blockIndex)) {
                            let updatedClaim = {
                                claim with 
                                paid = true;
                                aiApproved = true;
                            };
                            claims.put(claimId, updatedClaim);
                            
                            Debug.print("REAL ICP PAYMENT: Claim " # Nat.toText(claimId) # " paid " # Nat.toText(claim.amount) # " ICP at block " # Nat.toText(blockIndex));
                            
                            #ok(blockIndex)
                        };
                        case (#Err(error)) {
                            let errorMsg = switch (error) {
                                case (#InsufficientFunds(details)) { "Insufficient ICP balance: " # Nat.toText(details.balance) };
                                case _ { "ICP transfer failed" };
                            };
                            #err(errorMsg)
                        };
                    };
                };
            };
            case null { #err("Claim not found") };
        }
    };

    // ================================================================================
    // SUPPLIER PAYMENT FUNCTIONS
    // ================================================================================

    public shared(msg) func paySupplier(claimId: Nat, supplier: Principal, amount: Nat, invoiceHash: Text): async Result.Result<Nat, Text> {
        // Vendor pays sub-supplier with REAL ckUSDC
        switch (claims.get(claimId)) {
            case (?claim) {
                if (not Principal.equal(claim.vendor, msg.caller)) {
                    return #err("Only claim vendor can pay suppliers");
                };
                
                if (not claim.paid) {
                    return #err("Claim must be paid before supplier payments");
                };
                
                if (amount == 0 or (claim.totalPaidToSuppliers + amount) > claim.amount) {
                    return #err("Invalid payment amount");
                };
                
                // ICP TRANSFER from vendor to supplier (real or simulated)
                if (simulateTransfers) {
                    // SIMULATED payment
                    let payment: SupplierPayment = {
                        supplier = supplier;
                        amount = amount;
                        invoiceHash = invoiceHash;
                        verified = true;
                        timestamp = Time.now();
                    };
                    
                    switch (supplierPayments.get(claimId)) {
                        case (?existingPayments) {
                            supplierPayments.put(claimId, Array.append(existingPayments, [payment]));
                        };
                        case null {
                            supplierPayments.put(claimId, [payment]);
                        };
                    };
                    
                    let updatedClaim = {
                        claim with totalPaidToSuppliers = claim.totalPaidToSuppliers + amount
                    };
                    claims.put(claimId, updatedClaim);
                    
                    Debug.print("SIMULATED SUB-SUPPLIER PAYMENT: " # Nat.toText(amount) # " ICP");
                    #ok(88888) // Fake block index
                } else {
                    // REAL ICP TRANSFER
                    let transferArgs : TransferArgs = {
                        from_subaccount = null;
                        to = { owner = supplier; subaccount = null };
                        amount = amount;
                        fee = null;
                        memo = null;
                        created_at_time = null;
                    };

                    let transferResult = await ICP_ledger.icrc1_transfer(transferArgs);

                    switch (transferResult) {
                        case (#Ok(blockIndex)) {
                            let payment: SupplierPayment = {
                                supplier = supplier;
                                amount = amount;
                                invoiceHash = invoiceHash;
                                verified = true;
                                timestamp = Time.now();
                            };
                            
                            switch (supplierPayments.get(claimId)) {
                                case (?existingPayments) {
                                    supplierPayments.put(claimId, Array.append(existingPayments, [payment]));
                                };
                                case null {
                                    supplierPayments.put(claimId, [payment]);
                                };
                            };
                            
                            let updatedClaim = {
                                claim with totalPaidToSuppliers = claim.totalPaidToSuppliers + amount
                            };
                            claims.put(claimId, updatedClaim);
                            
                            Debug.print("REAL SUB-SUPPLIER PAYMENT: " # Nat.toText(amount) # " ICP at block " # Nat.toText(blockIndex));
                            
                            #ok(blockIndex)
                        };
                        case (#Err(error)) {
                            #err("ICP transfer to supplier failed")
                        };
                    };
                };
            };
            case null { #err("Claim not found") };
        }
    };

    public shared(msg) func paySubSupplier(claimId: Nat, paymentIndex: Nat, subSupplier: Principal, amount: Nat, invoiceHash: Text): async Result.Result<(), Text> {
        // Check if caller is authorized to make sub-supplier payments
        switch (claims.get(claimId)) {
            case (?claim) {
                // For demo purposes, allow any authorized entity to make sub-supplier payments
                if (not isAuthorized(msg.caller)) {
                    return #err("Not authorized to make sub-supplier payments");
                };
                
                if (amount == 0) {
                    return #err("Invalid payment amount");
                };
                
                let payment: SupplierPayment = {
                    supplier = subSupplier;
                    amount = amount;
                    invoiceHash = invoiceHash;
                    verified = false;
                    timestamp = Time.now();
                };
                
                // Add to supplier payments
                switch (supplierPayments.get(claimId)) {
                    case (?existingPayments) {
                        supplierPayments.put(claimId, Array.append(existingPayments, [payment]));
                    };
                    case null {
                        supplierPayments.put(claimId, [payment]);
                    };
                };
                
                #ok(())
            };
            case null { #err("Claim not found") };
        }
    };

    // ================================================================================
    // REWARD SYSTEM
    // ================================================================================

    public shared(msg) func rewardStaker(invoiceHash: Text, staker: Principal): async Result.Result<(), Text> {
        if (not isMainGovernment(msg.caller)) {
            return #err("Only main government can distribute rewards");
        };
        
        // In production, this would transfer ICP tokens to the staker
        // For demo, we just log the reward
        Debug.print("REWARD_DISTRIBUTED: " # Principal.toText(staker) # " for challenge on " # invoiceHash);
        
        #ok(())
    };

    // ================================================================================
    // ADDITIONAL QUERY FUNCTIONS
    // ================================================================================

    public query func getSupplierPayments(claimId: Nat): async [SupplierPayment] {
        switch (supplierPayments.get(claimId)) {
            case (?payments) { payments };
            case null { [] };
        }
    };

    public query func getChallenges(invoiceHash: Text): async [Challenge] {
        switch (invoiceChallenges.get(invoiceHash)) {
            case (?challenges) { challenges };
            case null { [] };
        }
    };

    public query func getAllBudgets(): async [(Nat, Budget)] {
        var result: [(Nat, Budget)] = [];
        for ((id, budget) in budgets.entries()) {
            result := Array.append(result, [(id, budget)]);
        };
        result
    };

    public query func getSystemInfo(): async {
        systemAuditor: Principal;
        mainGovernment: Principal;
        totalStateHeads: Nat;
        totalDeputies: Nat;
        totalVendors: Nat;
        systemPaused: Bool;
        totalBudget: Nat;
        totalClaims: Nat;
        demoMode: Bool;
        demoMasterPrincipal: ?Principal;
    } {
        {
            systemAuditor = systemAuditor;
            mainGovernment = mainGovernment;
            totalStateHeads = stateHeads.size();
            totalDeputies = deputies.size();
            totalVendors = vendorCount;
            systemPaused = paused;
            totalBudget = budget;
            totalClaims = claimCount;
            demoMode = demoMode;
            demoMasterPrincipal = demoMasterPrincipal;
        }
    };

    // ================================================================================
    // FRAUD DETECTION STATISTICS
    // ================================================================================

    public query func getFraudStats(): async {
        totalAlerts: Nat;
        criticalAlerts: Nat;
        highRiskClaims: Nat;
        averageFraudScore: Nat;
        totalChallenges: Nat;
    } {
        var totalAlerts: Nat = 0;
        var criticalAlerts: Nat = 0;
        var totalFraudScore: Nat = 0;
        var claimsWithScore: Nat = 0;
        var highRiskClaims: Nat = 0;
        var totalChallenges: Nat = 0;
        
        // Count fraud alerts
        for ((_, alerts) in fraudAlerts.entries()) {
            totalAlerts += alerts.size();
            for (alert in alerts.vals()) {
                if (alert.severity == "critical") {
                    criticalAlerts += 1;
                };
            };
        };
        
        // Calculate fraud score statistics
        for ((_, claim) in claims.entries()) {
            switch (claim.fraudScore) {
                case (?score) {
                    totalFraudScore += score;
                    claimsWithScore += 1;
                    if (score >= 70) {
                        highRiskClaims += 1;
                    };
                };
                case null { };
            };
            totalChallenges += claim.challengeCount;
        };
        
        let averageScore = if (claimsWithScore > 0) {
            totalFraudScore / claimsWithScore
        } else { 0 };
        
        {
            totalAlerts = totalAlerts;
            criticalAlerts = criticalAlerts;
            highRiskClaims = highRiskClaims;
            averageFraudScore = averageScore;
            totalChallenges = totalChallenges;
        }
    };

    // ================================================================================
    // DEMO AND TESTING FUNCTIONS
    // ================================================================================

    public shared(msg) func initializeDemoData(): async Result.Result<(), Text> {
        if (not isMainGovernment(msg.caller)) {
            return #err("Only main government can initialize demo data");
        };
        
        // Add demo state heads
        let demoStateHead1 = Principal.fromText("renrk-eyaaa-aaaah-qcaia-cai");
        let demoStateHead2 = Principal.fromText("r7inp-6aaaa-aaaah-qcaia-cai");
        
        stateHeads.put(demoStateHead1, true);
        stateHeads.put(demoStateHead2, true);
        approvedStakers.put(demoStateHead1, true);
        approvedStakers.put(demoStateHead2, true);
        
        // Add demo deputies
        let demoDeputy1 = Principal.fromText("rrkah-fqaaa-aaaah-qcaiq-cai");
        let demoDeputy2 = Principal.fromText("rdmx6-jaaaa-aaaah-qcair-cai");
        
        deputies.put(demoDeputy1, demoStateHead1);
        deputies.put(demoDeputy2, demoStateHead2);
        approvedStakers.put(demoDeputy1, true);
        approvedStakers.put(demoDeputy2, true);
        
        // Add demo vendors
        let demoVendor1 = Principal.fromText("radvj-tiaaa-aaaah-qcaiq-cai");
        let demoVendor2 = Principal.fromText("r7inp-6aaaa-aaaah-qcair-cai");
        
        vettedVendors.add(demoVendor1);
        vettedVendors.add(demoVendor2);
        isVendor.put(demoVendor1, true);
        isVendor.put(demoVendor2, true);
        vendorCount += 2;
        
        Debug.print("Demo data initialized successfully");
        #ok(())
    };

    public shared(msg) func resetSystem(): async Result.Result<(), Text> {
        if (not isMainGovernment(msg.caller)) {
            return #err("Only main government can reset system");
        };
        
        // Reset all data structures (for demo purposes only)
        stateHeads := HashMap.HashMap<Principal, Bool>(10, Principal.equal, Principal.hash);
        deputies := HashMap.HashMap<Principal, Principal>(50, Principal.equal, Principal.hash);
        budgets := HashMap.HashMap<Nat, Budget>(100, Nat.equal, func(n: Nat) : Nat32 { Nat32.fromNat(n % 2**32) });
        allocations := HashMap.HashMap<Nat, [Allocation]>(100, Nat.equal, func(n: Nat) : Nat32 { Nat32.fromNat(n % 2**32) });
        claims := HashMap.HashMap<Nat, Claim>(1000, Nat.equal, func(n: Nat) : Nat32 { Nat32.fromNat(n % 2**32) });
        fraudAlerts := HashMap.HashMap<Nat, [FraudAlert]>(1000, Nat.equal, func(n: Nat) : Nat32 { Nat32.fromNat(n % 2**32) });
        
        // Reset counters
        budgetCount := 0;
        claimCount := 0;
        vendorCount := 0;
        budget := 0;
        reservedBudget := 0;
        
        Debug.print("System reset successfully");
        #ok(())
    };
}