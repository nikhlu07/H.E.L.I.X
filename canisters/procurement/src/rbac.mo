// ================================================================================
// CORRUPTGUARD PROCUREMENT CANISTER - ROLE-BASED ACCESS CONTROL
// ================================================================================

import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Bool "mo:base/Bool";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Nat "mo:base/Nat";

import Types "types";

// ================================================================================
// RBAC STATE MANAGEMENT
// ================================================================================

actor class RBAC() {
    
    // Role storage
    private stable var mainGovernment: Principal = Principal.fromText("rdmx6-jaaaa-aaaah-qcaiq-cai");
    private var stateHeads = HashMap.HashMap<Principal, Bool>(10, Principal.equal, Principal.hash);
    private var deputies = HashMap.HashMap<Principal, Principal>(50, Principal.equal, Principal.hash);
    private var vettedVendors = HashMap.HashMap<Principal, Bool>(50, Principal.equal, Principal.hash);
    private var pendingVendors = HashMap.HashMap<Principal, Bool>(50, Principal.equal, Principal.hash);
    private var approvedStakers = HashMap.HashMap<Principal, Bool>(100, Principal.equal, Principal.hash);
    
    // Role proposals
    private var stateHeadProposals = HashMap.HashMap<Principal, Types.RoleProposal>(10, Principal.equal, Principal.hash);
    private var deputyProposals = HashMap.HashMap<Principal, Types.RoleProposal>(50, Principal.equal, Principal.hash);
    
    // Counters
    private stable var vendorCount: Nat = 0;
    
    // ================================================================================
    // ROLE CHECKING FUNCTIONS
    // ================================================================================
    
    public func isMainGovernment(caller: Principal): Bool {
        Principal.equal(caller, mainGovernment)
    };
    
    public func isStateHead(caller: Principal): Bool {
        switch (stateHeads.get(caller)) {
            case (?true) { true };
            case _ { false };
        }
    };
    
    public func isDeputy(caller: Principal): Bool {
        switch (deputies.get(caller)) {
            case (?_) { true };
            case null { false };
        }
    };
    
    public func isVendor(caller: Principal): Bool {
        switch (vettedVendors.get(caller)) {
            case (?true) { true };
            case _ { false };
        }
    };
    
    public func isApprovedStaker(caller: Principal): Bool {
        switch (approvedStakers.get(caller)) {
            case (?true) { true };
            case _ { false };
        }
    };
    
    public func isAuthorized(caller: Principal): Bool {
        isMainGovernment(caller) or isStateHead(caller) or isDeputy(caller)
    };
    
    public func isVendorOrAuthorized(caller: Principal): Bool {
        isAuthorized(caller) or isVendor(caller)
    };
    
    // ================================================================================
    // ROLE MANAGEMENT FUNCTIONS
    // ================================================================================
    
    public func setMainGovernment(newMainGov: Principal): async Result.Result<(), Text> {
        if (not isMainGovernment(msg.caller)) {
            return #err("Only current main government can transfer authority");
        };
        mainGovernment := newMainGov;
        #ok(())
    };
    
    public func proposeStateHead(stateHead: Principal): async Result.Result<(), Text> {
        if (not isMainGovernment(msg.caller)) {
            return #err("Only main government can propose state heads");
        };
        
        let currentCount = stateHeads.size();
        if (currentCount >= Types.MAX_STATE_HEADS) {
            return #err("Max state heads reached");
        };
        
        switch (stateHeads.get(stateHead)) {
            case (?true) { return #err("Already a state head") };
            case _ { };
        };
        
        let proposal: Types.RoleProposal = {
            candidate = stateHead;
            proposalTime = Time.now();
            confirmed = false;
        };
        stateHeadProposals.put(stateHead, proposal);
        #ok(())
    };
    
    public func confirmStateHead(stateHead: Principal): async Result.Result<(), Text> {
        if (not isMainGovernment(msg.caller)) {
            return #err("Only main government can confirm state heads");
        };
        
        switch (stateHeadProposals.get(stateHead)) {
            case (?proposal) {
                if (proposal.confirmed) {
                    return #err("Already confirmed");
                };
                if (Time.now() < proposal.proposalTime + Types.ROLE_CONFIRMATION_DELAY) {
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
    
    public func proposeDeputy(deputy: Principal, stateHead: Principal): async Result.Result<(), Text> {
        if (not isStateHead(msg.caller) and not isMainGovernment(msg.caller)) {
            return #err("Only state heads or main government can propose deputies");
        };
        
        let currentCount = deputies.size();
        if (currentCount >= Types.MAX_DEPUTIES) {
            return #err("Max deputies reached");
        };
        
        switch (deputies.get(deputy)) {
            case (?_) { return #err("Already a deputy") };
            case null { };
        };
        
        let proposal: Types.RoleProposal = {
            candidate = deputy;
            proposalTime = Time.now();
            confirmed = false;
        };
        deputyProposals.put(deputy, proposal);
        #ok(())
    };
    
    public func confirmDeputy(deputy: Principal, stateHead: Principal): async Result.Result<(), Text> {
        if (not isStateHead(msg.caller) and not isMainGovernment(msg.caller)) {
            return #err("Only state heads or main government can confirm deputies");
        };
        
        switch (deputyProposals.get(deputy)) {
            case (?proposal) {
                if (proposal.confirmed) {
                    return #err("Already confirmed");
                };
                if (Time.now() < proposal.proposalTime + Types.ROLE_CONFIRMATION_DELAY) {
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
    
    public func proposeVendor(vendor: Principal): async Result.Result<(), Text> {
        if (not isMainGovernment(msg.caller)) {
            return #err("Only main government can propose vendors");
        };
        
        switch (vettedVendors.get(vendor)) {
            case (?true) { return #err("Already a vendor") };
            case _ { };
        };
        
        switch (pendingVendors.get(vendor)) {
            case (?true) { return #err("Already proposed") };
            case _ { };
        };
        
        if (vendorCount >= Types.MAX_VENDORS) {
            return #err("Max vendors reached");
        };
        
        pendingVendors.put(vendor, true);
        #ok(())
    };
    
    public func approveVendor(vendor: Principal): async Result.Result<(), Text> {
        if (not isMainGovernment(msg.caller)) {
            return #err("Only main government can approve vendors");
        };
        
        switch (pendingVendors.get(vendor)) {
            case (?true) {
                vettedVendors.put(vendor, true);
                vendorCount += 1;
                pendingVendors.delete(vendor);
                #ok(())
            };
            case _ { #err("Vendor not proposed") };
        }
    };
    
    // ================================================================================
    // QUERY FUNCTIONS
    // ================================================================================
    
    public query func checkRole(principal: Principal): async Types.RoleInfo {
        {
            isMainGovernment = isMainGovernment(principal);
            isStateHead = isStateHead(principal);
            isDeputy = isDeputy(principal);
            isVendor = isVendor(principal);
        }
    };
    
    public query func getPendingProposals(): async Types.PendingProposals {
        var stateHeadList: [(Principal, Types.RoleProposal)] = [];
        for ((principal, proposal) in stateHeadProposals.entries()) {
            if (not proposal.confirmed) {
                stateHeadList := Array.append(stateHeadList, [(principal, proposal)]);
            };
        };
        
        var deputyList: [(Principal, Types.RoleProposal)] = [];
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
    
    public query func getRoleStats(): async {
        totalStateHeads: Nat;
        totalDeputies: Nat;
        totalVendors: Nat;
        pendingStateHeads: Nat;
        pendingDeputies: Nat;
        pendingVendors: Nat;
    } {
        var pendingStateHeadCount: Nat = 0;
        var pendingDeputyCount: Nat = 0;
        
        for ((_, proposal) in stateHeadProposals.entries()) {
            if (not proposal.confirmed) {
                pendingStateHeadCount += 1;
            };
        };
        
        for ((_, proposal) in deputyProposals.entries()) {
            if (not proposal.confirmed) {
                pendingDeputyCount += 1;
            };
        };
        
        {
            totalStateHeads = stateHeads.size();
            totalDeputies = deputies.size();
            totalVendors = vendorCount;
            pendingStateHeads = pendingStateHeadCount;
            pendingDeputies = pendingDeputyCount;
            pendingVendors = pendingVendors.size();
        }
    };
    
    // ================================================================================
    // DEMO DATA INITIALIZATION
    // ================================================================================
    
    public func initializeDemoData(): async Result.Result<(), Text> {
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
        
        vettedVendors.put(demoVendor1, true);
        vettedVendors.put(demoVendor2, true);
        vendorCount += 2;
        
        Debug.print("Demo RBAC data initialized successfully");
        #ok(())
    };
    
    // ================================================================================
    // SYSTEM RESET (FOR TESTING)
    // ================================================================================
    
    public func resetRBAC(): async Result.Result<(), Text> {
        if (not isMainGovernment(msg.caller)) {
            return #err("Only main government can reset RBAC");
        };
        
        stateHeads := HashMap.HashMap<Principal, Bool>(10, Principal.equal, Principal.hash);
        deputies := HashMap.HashMap<Principal, Principal>(50, Principal.equal, Principal.hash);
        vettedVendors := HashMap.HashMap<Principal, Bool>(50, Principal.equal, Principal.hash);
        pendingVendors := HashMap.HashMap<Principal, Bool>(50, Principal.equal, Principal.hash);
        approvedStakers := HashMap.HashMap<Principal, Bool>(100, Principal.equal, Principal.hash);
        stateHeadProposals := HashMap.HashMap<Principal, Types.RoleProposal>(10, Principal.equal, Principal.hash);
        deputyProposals := HashMap.HashMap<Principal, Types.RoleProposal>(50, Principal.equal, Principal.hash);
        
        vendorCount := 0;
        
        Debug.print("RBAC system reset successfully");
        #ok(())
    };
};
