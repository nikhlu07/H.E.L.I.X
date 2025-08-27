// ================================================================================
// CORRUPTGUARD PROCUREMENT CANISTER - VALIDATION & ERROR HANDLING
// ================================================================================

import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Time "mo:base/Time";

import Types "types";

// ================================================================================
// VALIDATION FUNCTIONS
// ================================================================================

public func validatePrincipal(principal: Principal): Result.Result<(), Text> {
    if (Principal.isAnonymous(principal)) {
        return #err("Anonymous principals are not allowed");
    };
    #ok(())
};

public func validateAmount(amount: Nat): Result.Result<(), Text> {
    if (amount == 0) {
        return #err("Amount must be greater than 0");
    };
    if (amount > 1_000_000_000_000_000) { // 1 quadrillion (reasonable max)
        return #err("Amount exceeds maximum allowed");
    };
    #ok(())
};

public func validateText(text: Text, minLength: Nat, maxLength: Nat): Result.Result<(), Text> {
    let length = Text.size(text);
    if (length < minLength) {
        return #err("Text too short, minimum " # Nat.toText(minLength) # " characters");
    };
    if (length > maxLength) {
        return #err("Text too long, maximum " # Nat.toText(maxLength) # " characters");
    };
    #ok(())
};

public func validateInvoiceHash(invoiceHash: Text): Result.Result<(), Text> {
    if (Text.size(invoiceHash) < 10) {
        return #err("Invoice hash too short");
    };
    if (Text.size(invoiceHash) > 100) {
        return #err("Invoice hash too long");
    };
    // Basic format validation (should contain alphanumeric characters)
    let pattern = #text("^[a-zA-Z0-9_-]+$");
    if (not Text.contains(invoiceHash, pattern)) {
        return #err("Invalid invoice hash format");
    };
    #ok(())
};

public func validateArea(area: Text): Result.Result<(), Text> {
    let validAreas = [
        "Road Construction",
        "School Building", 
        "Hospital Equipment",
        "IT Infrastructure",
        "Water Supply",
        "Public Transport",
        "Government Buildings",
        "Educational Technology"
    ];
    
    for (validArea in validAreas.vals()) {
        if (Text.equal(area, validArea)) {
            return #ok(());
        };
    };
    
    #err("Invalid area, must be one of: " # Text.join("; ", validAreas.vals()))
};

public func validateFraudScore(score: Nat): Result.Result<(), Text> {
    if (score > 100) {
        return #err("Fraud score must be between 0 and 100");
    };
    #ok(())
};

public func validateSeverity(severity: Text): Result.Result<(), Text> {
    let validSeverities = ["low", "medium", "high", "critical"];
    
    for (validSeverity in validSeverities.vals()) {
        if (Text.equal(severity, validSeverity)) {
            return #ok(());
        };
    };
    
    #err("Invalid severity, must be one of: " # Text.join("; ", validSeverities.vals()))
};

// ================================================================================
// BUSINESS LOGIC VALIDATION
// ================================================================================

public func validateBudgetAllocation(
    budgetAmount: Nat, 
    allocationAmount: Nat, 
    alreadyAllocated: Nat
): Result.Result<(), Text> {
    if (allocationAmount == 0) {
        return #err("Allocation amount must be greater than 0");
    };
    
    if (allocationAmount > budgetAmount) {
        return #err("Allocation amount exceeds budget");
    };
    
    if ((alreadyAllocated + allocationAmount) > budgetAmount) {
        return #err("Total allocations would exceed budget");
    };
    
    #ok(())
};

public func validateClaimSubmission(
    claimAmount: Nat,
    allocationAmount: Nat,
    alreadyClaimed: Nat
): Result.Result<(), Text> {
    if (claimAmount == 0) {
        return #err("Claim amount must be greater than 0");
    };
    
    if (claimAmount > allocationAmount) {
        return #err("Claim amount exceeds allocation");
    };
    
    if ((alreadyClaimed + claimAmount) > allocationAmount) {
        return #err("Total claims would exceed allocation");
    };
    
    #ok(())
};

public func validateSupplierPayment(
    paymentAmount: Nat,
    claimAmount: Nat,
    alreadyPaidToSuppliers: Nat
): Result.Result<(), Text> {
    if (paymentAmount == 0) {
        return #err("Payment amount must be greater than 0");
    };
    
    if (paymentAmount > claimAmount) {
        return #err("Payment amount exceeds claim amount");
    };
    
    if ((alreadyPaidToSuppliers + paymentAmount) > claimAmount) {
        return #err("Total supplier payments would exceed claim amount");
    };
    
    #ok(())
};

// ================================================================================
// ERROR HANDLING UTILITIES
// ================================================================================

public func handleError<T>(result: Result.Result<T, Text>, operation: Text): Result.Result<T, Text> {
    switch (result) {
        case (#ok(value)) { #ok(value) };
        case (#err(error)) {
            Debug.print("Error in " # operation # ": " # error);
            #err("Operation failed: " # error)
        };
    }
};

public func safeOperation<T>(operation: () -> T, operationName: Text): Result.Result<T, Text> {
    try {
        #ok(operation())
    } catch (error) {
        Debug.print("Exception in " # operationName # ": " # error);
        #err("Operation failed with exception: " # error)
    }
};

// ================================================================================
// INPUT SANITIZATION
// ================================================================================

public func sanitizeText(text: Text): Text {
    // Remove potentially dangerous characters
    let sanitized = Text.replace(text, #char('<'), "&lt;");
    let sanitized2 = Text.replace(sanitized, #char('>'), "&gt;");
    let sanitized3 = Text.replace(sanitized2, #char('"'), "&quot;");
    let sanitized4 = Text.replace(sanitized3, #char('\''), "&#39;");
    sanitized4
};

public func sanitizeInvoiceData(invoiceData: Text): Text {
    // Remove newlines and extra whitespace
    let noNewlines = Text.replace(invoiceData, #text("\n"), " ");
    let noTabs = Text.replace(noNewlines, #text("\t"), " ");
    let trimmed = Text.trim(noTabs, #char(' '));
    sanitizeText(trimmed)
};

// ================================================================================
// RATE LIMITING HELPERS
// ================================================================================

public type RateLimit = {
    lastCall: Int;
    callCount: Nat;
    maxCalls: Nat;
    timeWindow: Int;
};

public func checkRateLimit(
    rateLimit: RateLimit, 
    currentTime: Int
): Result.Result<RateLimit, Text> {
    let timeSinceLastCall = currentTime - rateLimit.lastCall;
    
    if (timeSinceLastCall > rateLimit.timeWindow) {
        // Reset rate limit
        let newRateLimit: RateLimit = {
            lastCall = currentTime;
            callCount = 1;
            maxCalls = rateLimit.maxCalls;
            timeWindow = rateLimit.timeWindow;
        };
        #ok(newRateLimit)
    } else if (rateLimit.callCount >= rateLimit.maxCalls) {
        #err("Rate limit exceeded, please wait before making another request")
    } else {
        let newRateLimit: RateLimit = {
            lastCall = rateLimit.lastCall;
            callCount = rateLimit.callCount + 1;
            maxCalls = rateLimit.maxCalls;
            timeWindow = rateLimit.timeWindow;
        };
        #ok(newRateLimit)
    }
};

// ================================================================================
// AUDIT LOGGING
// ================================================================================

public type AuditLog = {
    timestamp: Int;
    caller: Principal;
    operation: Text;
    details: Text;
    success: Bool;
};

public func createAuditLog(
    caller: Principal,
    operation: Text,
    details: Text,
    success: Bool,
    timestamp: Int
): AuditLog {
    {
        timestamp = timestamp;
        caller = caller;
        operation = operation;
        details = details;
        success = success;
    }
};

public func logOperation(
    caller: Principal,
    operation: Text,
    details: Text,
    success: Bool
): () {
    let log = createAuditLog(caller, operation, details, success, Time.now());
    Debug.print("AUDIT: " # Principal.toText(log.caller) # " | " # log.operation # " | " # log.details # " | " # (if log.success "SUCCESS" else "FAILED"));
};
