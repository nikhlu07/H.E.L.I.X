// ================================================================================
// CORRUPTGUARD PROCUREMENT CANISTER - COMPREHENSIVE TESTING MODULE
// ================================================================================

import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Bool "mo:base/Bool";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Time "mo:base/Time";

import Types "types";
import Validation "validation";

// ================================================================================
// TEST TYPES AND UTILITIES
// ================================================================================

public type TestResult = {
    testName: Text;
    passed: Bool;
    error: ?Text;
    executionTime: Int;
};

public type TestSuite = {
    name: Text;
    tests: [TestResult];
    totalTests: Nat;
    passedTests: Nat;
    failedTests: Nat;
    executionTime: Int;
};

// Test principals for different roles
private let TEST_MAIN_GOVERNMENT = Principal.fromText("rdmx6-jaaaa-aaaah-qcaiq-cai");
private let TEST_STATE_HEAD = Principal.fromText("renrk-eyaaa-aaaah-qcaia-cai");
private let TEST_DEPUTY = Principal.fromText("rrkah-fqaaa-aaaah-qcaiq-cai");
private let TEST_VENDOR = Principal.fromText("radvj-tiaaa-aaaah-qcaiq-cai");
private let TEST_CITIZEN = Principal.fromText("r7inp-6aaaa-aaaah-qcaia-cai");

// ================================================================================
// TEST EXECUTION FRAMEWORK
// ================================================================================

public func runTest(testName: Text, testFunction: () -> Bool): TestResult {
    let startTime = Time.now();
    let result = try {
        let passed = testFunction();
        if (passed) {
            {
                testName = testName;
                passed = true;
                error = null;
                executionTime = Time.now() - startTime;
            }
        } else {
            {
                testName = testName;
                passed = false;
                error = ?"Test failed without specific error";
                executionTime = Time.now() - startTime;
            }
        }
    } catch (error) {
        {
            testName = testName;
            passed = false;
            error = ?error;
            executionTime = Time.now() - startTime;
        }
    };
    result
};

public func runTestSuite(suiteName: Text, tests: [() -> TestResult]): TestSuite {
    let startTime = Time.now();
    var passedCount: Nat = 0;
    var failedCount: Nat = 0;
    
    let results = Array.map<() -> TestResult, TestResult>(tests, func(test) {
        let result = test();
        if (result.passed) {
            passedCount += 1;
        } else {
            failedCount += 1;
        };
        result
    });
    
    {
        name = suiteName;
        tests = results;
        totalTests = tests.size();
        passedTests = passedCount;
        failedTests = failedCount;
        executionTime = Time.now() - startTime;
    }
};

// ================================================================================
// VALIDATION TESTS
// ================================================================================

public func testValidationFunctions(): [TestResult] {
    let tests = [
        // Test principal validation
        func() : TestResult = runTest("validatePrincipal - valid principal", func() {
            let result = Validation.validatePrincipal(TEST_MAIN_GOVERNMENT);
            switch (result) {
                case (#ok(_)) { true };
                case (#err(_)) { false };
            }
        }),
        
        func() : TestResult = runTest("validatePrincipal - anonymous principal", func() {
            let result = Validation.validatePrincipal(Principal.fromText("2vxsx-fae"));
            switch (result) {
                case (#ok(_)) { false };
                case (#err(_)) { true };
            }
        }),
        
        // Test amount validation
        func() : TestResult = runTest("validateAmount - valid amount", func() {
            let result = Validation.validateAmount(1000);
            switch (result) {
                case (#ok(_)) { true };
                case (#err(_)) { false };
            }
        }),
        
        func() : TestResult = runTest("validateAmount - zero amount", func() {
            let result = Validation.validateAmount(0);
            switch (result) {
                case (#ok(_)) { false };
                case (#err(_)) { true };
            }
        }),
        
        func() : TestResult = runTest("validateAmount - excessive amount", func() {
            let result = Validation.validateAmount(2_000_000_000_000_000);
            switch (result) {
                case (#ok(_)) { false };
                case (#err(_)) { true };
            }
        }),
        
        // Test text validation
        func() : TestResult = runTest("validateText - valid text", func() {
            let result = Validation.validateText("Valid text", 1, 100);
            switch (result) {
                case (#ok(_)) { true };
                case (#err(_)) { false };
            }
        }),
        
        func() : TestResult = runTest("validateText - too short", func() {
            let result = Validation.validateText("", 5, 100);
            switch (result) {
                case (#ok(_)) { false };
                case (#err(_)) { true };
            }
        }),
        
        func() : TestResult = runTest("validateText - too long", func() {
            let longText = Text.repeat("a", 200);
            let result = Validation.validateText(longText, 1, 100);
            switch (result) {
                case (#ok(_)) { false };
                case (#err(_)) { true };
            }
        }),
        
        // Test area validation
        func() : TestResult = runTest("validateArea - valid area", func() {
            let result = Validation.validateArea("Road Construction");
            switch (result) {
                case (#ok(_)) { true };
                case (#err(_)) { false };
            }
        }),
        
        func() : TestResult = runTest("validateArea - invalid area", func() {
            let result = Validation.validateArea("Invalid Area");
            switch (result) {
                case (#ok(_)) { false };
                case (#err(_)) { true };
            }
        }),
        
        // Test fraud score validation
        func() : TestResult = runTest("validateFraudScore - valid score", func() {
            let result = Validation.validateFraudScore(50);
            switch (result) {
                case (#ok(_)) { true };
                case (#err(_)) { false };
            }
        }),
        
        func() : TestResult = runTest("validateFraudScore - invalid score", func() {
            let result = Validation.validateFraudScore(150);
            switch (result) {
                case (#ok(_)) { false };
                case (#err(_)) { true };
            }
        }),
        
        // Test severity validation
        func() : TestResult = runTest("validateSeverity - valid severity", func() {
            let result = Validation.validateSeverity("high");
            switch (result) {
                case (#ok(_)) { true };
                case (#err(_)) { false };
            }
        }),
        
        func() : TestResult = runTest("validateSeverity - invalid severity", func() {
            let result = Validation.validateSeverity("invalid");
            switch (result) {
                case (#ok(_)) { false };
                case (#err(_)) { true };
            }
        })
    ];
    
    Array.map<() -> TestResult, TestResult>(tests, func(test) { test() })
};

// ================================================================================
// BUSINESS LOGIC TESTS
// ================================================================================

public func testBusinessLogicValidation(): [TestResult] {
    let tests = [
        // Test budget allocation validation
        func() : TestResult = runTest("validateBudgetAllocation - valid allocation", func() {
            let result = Validation.validateBudgetAllocation(10000, 5000, 0);
            switch (result) {
                case (#ok(_)) { true };
                case (#err(_)) { false };
            }
        }),
        
        func() : TestResult = runTest("validateBudgetAllocation - exceeds budget", func() {
            let result = Validation.validateBudgetAllocation(10000, 15000, 0);
            switch (result) {
                case (#ok(_)) { false };
                case (#err(_)) { true };
            }
        }),
        
        func() : TestResult = runTest("validateBudgetAllocation - total exceeds budget", func() {
            let result = Validation.validateBudgetAllocation(10000, 6000, 5000);
            switch (result) {
                case (#ok(_)) { false };
                case (#err(_)) { true };
            }
        }),
        
        // Test claim submission validation
        func() : TestResult = runTest("validateClaimSubmission - valid claim", func() {
            let result = Validation.validateClaimSubmission(5000, 10000, 0);
            switch (result) {
                case (#ok(_)) { true };
                case (#err(_)) { false };
            }
        }),
        
        func() : TestResult = runTest("validateClaimSubmission - exceeds allocation", func() {
            let result = Validation.validateClaimSubmission(15000, 10000, 0);
            switch (result) {
                case (#ok(_)) { false };
                case (#err(_)) { true };
            }
        }),
        
        // Test supplier payment validation
        func() : TestResult = runTest("validateSupplierPayment - valid payment", func() {
            let result = Validation.validateSupplierPayment(2000, 10000, 0);
            switch (result) {
                case (#ok(_)) { true };
                case (#err(_)) { false };
            }
        }),
        
        func() : TestResult = runTest("validateSupplierPayment - exceeds claim", func() {
            let result = Validation.validateSupplierPayment(15000, 10000, 0);
            switch (result) {
                case (#ok(_)) { false };
                case (#err(_)) { true };
            }
        })
    ];
    
    Array.map<() -> TestResult, TestResult>(tests, func(test) { test() })
};

// ================================================================================
// RATE LIMITING TESTS
// ================================================================================

public func testRateLimiting(): [TestResult] {
    let tests = [
        func() : TestResult = runTest("checkRateLimit - first call", func() {
            let rateLimit: Validation.RateLimit = {
                lastCall = 0;
                callCount = 0;
                maxCalls = 5;
                timeWindow = 60_000_000_000; // 1 minute
            };
            let result = Validation.checkRateLimit(rateLimit, Time.now());
            switch (result) {
                case (#ok(_)) { true };
                case (#err(_)) { false };
            }
        }),
        
        func() : TestResult = runTest("checkRateLimit - within limits", func() {
            let currentTime = Time.now();
            let rateLimit: Validation.RateLimit = {
                lastCall = currentTime - 30_000_000_000; // 30 seconds ago
                callCount = 3;
                maxCalls = 5;
                timeWindow = 60_000_000_000; // 1 minute
            };
            let result = Validation.checkRateLimit(rateLimit, currentTime);
            switch (result) {
                case (#ok(_)) { true };
                case (#err(_)) { false };
            }
        }),
        
        func() : TestResult = runTest("checkRateLimit - exceeded limit", func() {
            let currentTime = Time.now();
            let rateLimit: Validation.RateLimit = {
                lastCall = currentTime - 30_000_000_000; // 30 seconds ago
                callCount = 5;
                maxCalls = 5;
                timeWindow = 60_000_000_000; // 1 minute
            };
            let result = Validation.checkRateLimit(rateLimit, currentTime);
            switch (result) {
                case (#ok(_)) { false };
                case (#err(_)) { true };
            }
        })
    ];
    
    Array.map<() -> TestResult, TestResult>(tests, func(test) { test() })
};

// ================================================================================
// INPUT SANITIZATION TESTS
// ================================================================================

public func testInputSanitization(): [TestResult] {
    let tests = [
        func() : TestResult = runTest("sanitizeText - removes dangerous chars", func() {
            let input = "<script>alert('xss')</script>";
            let sanitized = Validation.sanitizeText(input);
            not Text.contains(sanitized, #text("<script>"))
        }),
        
        func() : TestResult = runTest("sanitizeInvoiceData - removes newlines", func() {
            let input = "Invoice\nData\twith\ttabs";
            let sanitized = Validation.sanitizeInvoiceData(input);
            not Text.contains(sanitized, #text("\n")) and not Text.contains(sanitized, #text("\t"))
        })
    ];
    
    Array.map<() -> TestResult, TestResult>(tests, func(test) { test() })
};

// ================================================================================
// COMPREHENSIVE TEST RUNNER
// ================================================================================

public func runAllTests(): [TestSuite] {
    let suites = [
        runTestSuite("Validation Functions", Array.map<() -> TestResult, () -> TestResult>(testValidationFunctions(), func(test) { func() { test } })),
        runTestSuite("Business Logic Validation", Array.map<() -> TestResult, () -> TestResult>(testBusinessLogicValidation(), func(test) { func() { test } })),
        runTestSuite("Rate Limiting", Array.map<() -> TestResult, () -> TestResult>(testRateLimiting(), func(test) { func() { test } })),
        runTestSuite("Input Sanitization", Array.map<() -> TestResult, () -> TestResult>(testInputSanitization(), func(test) { func() { test } }))
    ];
    
    // Print test results
    for (suite in suites.vals()) {
        Debug.print("=== " # suite.name # " ===");
        Debug.print("Total: " # Nat.toText(suite.totalTests) # " | Passed: " # Nat.toText(suite.passedTests) # " | Failed: " # Nat.toText(suite.failedTests));
        Debug.print("Execution time: " # Int.toText(suite.executionTime) # " ns");
        
        for (test in suite.tests.vals()) {
            let status = if (test.passed) "✅" else "❌";
            Debug.print(status # " " # test.testName);
            switch (test.error) {
                case (?error) { Debug.print("   Error: " # error) };
                case null { };
            };
        };
        Debug.print("");
    };
    
    suites
};

// ================================================================================
// PERFORMANCE BENCHMARKS
// ================================================================================

public func benchmarkValidationFunctions(): {
    principalValidation: Int;
    amountValidation: Int;
    textValidation: Int;
    areaValidation: Int;
    fraudScoreValidation: Int;
} {
    let iterations = 1000;
    
    // Benchmark principal validation
    let principalStart = Time.now();
    for (i in Array.tabulate<Nat>(iterations, func(n) { n }).vals()) {
        let _ = Validation.validatePrincipal(TEST_MAIN_GOVERNMENT);
    };
    let principalTime = Time.now() - principalStart;
    
    // Benchmark amount validation
    let amountStart = Time.now();
    for (i in Array.tabulate<Nat>(iterations, func(n) { n }).vals()) {
        let _ = Validation.validateAmount(1000);
    };
    let amountTime = Time.now() - amountStart;
    
    // Benchmark text validation
    let textStart = Time.now();
    for (i in Array.tabulate<Nat>(iterations, func(n) { n }).vals()) {
        let _ = Validation.validateText("Test text", 1, 100);
    };
    let textTime = Time.now() - textStart;
    
    // Benchmark area validation
    let areaStart = Time.now();
    for (i in Array.tabulate<Nat>(iterations, func(n) { n }).vals()) {
        let _ = Validation.validateArea("Road Construction");
    };
    let areaTime = Time.now() - areaStart;
    
    // Benchmark fraud score validation
    let fraudStart = Time.now();
    for (i in Array.tabulate<Nat>(iterations, func(n) { n }).vals()) {
        let _ = Validation.validateFraudScore(50);
    };
    let fraudTime = Time.now() - fraudStart;
    
    {
        principalValidation = principalTime;
        amountValidation = amountTime;
        textValidation = textTime;
        areaValidation = areaTime;
        fraudScoreValidation = fraudTime;
    }
};

// ================================================================================
// TEST UTILITIES
// ================================================================================

public func generateTestData(): {
    principals: [Principal];
    amounts: [Nat];
    areas: [Text];
    invoiceHashes: [Text];
} {
    let principals = [
        Principal.fromText("rdmx6-jaaaa-aaaah-qcaiq-cai"),
        Principal.fromText("renrk-eyaaa-aaaah-qcaia-cai"),
        Principal.fromText("rrkah-fqaaa-aaaah-qcaiq-cai"),
        Principal.fromText("radvj-tiaaa-aaaah-qcaiq-cai"),
        Principal.fromText("r7inp-6aaaa-aaaah-qcaia-cai")
    ];
    
    let amounts = [1000, 5000, 10000, 50000, 100000, 500000, 1000000];
    
    let areas = [
        "Road Construction",
        "School Building",
        "Hospital Equipment",
        "IT Infrastructure",
        "Water Supply"
    ];
    
    let invoiceHashes = [
        "INV_001_ABC123",
        "INV_002_DEF456",
        "INV_003_GHI789",
        "INV_004_JKL012",
        "INV_005_MNO345"
    ];
    
    {
        principals = principals;
        amounts = amounts;
        areas = areas;
        invoiceHashes = invoiceHashes;
    }
};

