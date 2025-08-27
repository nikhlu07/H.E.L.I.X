# 🛡️ CorruptGuard - Quick Start Guide

## 🚀 **Getting Started with Improved Canisters**

This guide will help you get CorruptGuard running with the newly improved canister architecture.

### 📋 **Prerequisites**

- Windows 10/11
- PowerShell (Administrator recommended)
- Internet connection for downloading dependencies

### 🔧 **Step 1: Install DFX SDK**

Run the automated installation script:

```powershell
# Run as Administrator for best results
.\install-dfx.ps1
```

This script will automatically install:
- ✅ Chocolatey package manager
- ✅ Git
- ✅ Node.js
- ✅ Python
- ✅ DFX SDK
- ✅ Internet Identity

### 🔧 **Step 2: Verify Installation**

After installation, restart your terminal and verify:

```powershell
# Check DFX version
dfx --version

# Check Node.js version
node --version

# Check Python version
python --version
```

### 🔧 **Step 3: Start Local Network**

```powershell
# Start local Internet Computer network
dfx start --background

# Wait for network to be ready (check output for "Network is ready")
```

### 🔧 **Step 4: Deploy Canisters**

```powershell
# Deploy all canisters
dfx deploy

# Or deploy specific canisters
dfx deploy procurement
dfx deploy rbac
dfx deploy validation
dfx deploy tests
```

### 🔧 **Step 5: Initialize Demo Data**

```powershell
# Initialize demo data for testing
dfx canister call procurement initializeDemoData
dfx canister call rbac initializeDemoData
```

### 🔧 **Step 6: Run Tests**

```powershell
# Run comprehensive test suite
dfx canister call tests runAllTests

# Run performance benchmarks
dfx canister call tests benchmarkValidationFunctions
```

## 🏗️ **New Architecture Overview**

### **Modular Design**

The canisters have been refactored into a clean, modular architecture:

```
canisters/procurement/src/
├── main.mo          # Main procurement logic
├── types.mo         # All type definitions
├── rbac.mo          # Role-based access control
├── validation.mo    # Input validation & error handling
└── tests.mo         # Comprehensive testing framework
```

### **Key Improvements**

#### ✅ **Code Organization**
- **Separated concerns**: Each module has a specific responsibility
- **Type safety**: Centralized type definitions in `types.mo`
- **Clean interfaces**: Proper Candid interface definitions

#### ✅ **Security Enhancements**
- **Input validation**: Comprehensive validation in `validation.mo`
- **Error handling**: Structured error responses
- **Rate limiting**: Built-in protection against abuse
- **Input sanitization**: XSS and injection protection

#### ✅ **Testing Framework**
- **Unit tests**: Individual function testing
- **Integration tests**: End-to-end workflow testing
- **Performance benchmarks**: Speed and efficiency testing
- **Automated test runner**: Easy test execution

#### ✅ **Developer Experience**
- **Clear documentation**: Comprehensive Candid interfaces
- **Error messages**: Descriptive error responses
- **Debug logging**: Built-in audit trails
- **Demo data**: Ready-to-use test data

## 🔍 **Testing Your Installation**

### **Basic Functionality Test**

```powershell
# Check system status
dfx canister call procurement getSystemStats

# Check role information
dfx canister call rbac checkRole '(principal "rdmx6-jaaaa-aaaah-qcaiq-cai")'

# Get pending proposals
dfx canister call rbac getPendingProposals
```

### **Validation Testing**

```powershell
# Test validation functions
dfx canister call validation validateAmount '(1000)'
dfx canister call validation validateArea '("Road Construction")'
dfx canister call validation validateFraudScore '(50)'
```

### **Comprehensive Testing**

```powershell
# Run all tests
dfx canister call tests runAllTests

# Run specific test suites
dfx canister call tests testValidationFunctions
dfx canister call tests testBusinessLogicValidation
dfx canister call tests testRateLimiting
```

## 🚀 **Development Workflow**

### **1. Start Development Environment**

```powershell
# Start local network
dfx start --background

# Deploy canisters
dfx deploy
```

### **2. Make Changes**

Edit the Motoko files in `canisters/procurement/src/`:
- `main.mo` - Core business logic
- `types.mo` - Type definitions
- `rbac.mo` - Access control
- `validation.mo` - Input validation
- `tests.mo` - Testing framework

### **3. Test Changes**

```powershell
# Run tests after changes
dfx canister call tests runAllTests

# Deploy updated canisters
dfx deploy
```

### **4. Verify Functionality**

```powershell
# Test specific functions
dfx canister call procurement lockBudget '(1000000, "Test Budget")'
dfx canister call procurement getSystemStats
```

## 🔧 **Troubleshooting**

### **Common Issues**

#### **DFX Not Found**
```powershell
# Restart terminal after installation
# Or manually add to PATH:
$env:Path += ";$env:USERPROFILE\.dfx\bin"
```

#### **Network Connection Issues**
```powershell
# Stop and restart network
dfx stop
dfx start --background
```

#### **Canister Deployment Fails**
```powershell
# Clean and redeploy
dfx stop
dfx start --clean --background
dfx deploy
```

#### **Test Failures**
```powershell
# Check canister status
dfx canister status procurement
dfx canister status rbac

# Reinitialize demo data
dfx canister call procurement initializeDemoData
dfx canister call rbac initializeDemoData
```

### **Getting Help**

1. **Check logs**: Look at terminal output for error messages
2. **Verify installation**: Run `dfx --version` to confirm DFX is installed
3. **Restart network**: Use `dfx stop` then `dfx start --background`
4. **Clean deployment**: Use `dfx start --clean --background`

## 📊 **Performance Monitoring**

### **Benchmark Results**

After running benchmarks, you should see results like:

```
Benchmark Results (1000 iterations):
- Principal validation: ~50,000 ns
- Amount validation: ~30,000 ns  
- Text validation: ~40,000 ns
- Area validation: ~60,000 ns
- Fraud score validation: ~20,000 ns
```

### **System Statistics**

```powershell
# Get system performance stats
dfx canister call procurement getSystemStats
dfx canister call procurement getFraudStats
dfx canister call rbac getRoleStats
```

## 🎯 **Next Steps**

### **For Developers**

1. **Explore the codebase**: Review the modular architecture
2. **Add new features**: Extend functionality in appropriate modules
3. **Write tests**: Add tests for new features in `tests.mo`
4. **Update documentation**: Keep Candid interfaces current

### **For Deployment**

1. **Production setup**: Configure for mainnet deployment
2. **Security audit**: Review access controls and validation
3. **Performance tuning**: Optimize based on benchmark results
4. **Monitoring**: Set up logging and alerting

### **For Integration**

1. **Frontend integration**: Connect React app to canisters
2. **Backend integration**: Connect FastAPI to canisters
3. **Fraud engine**: Integrate Python fraud detection
4. **External APIs**: Connect to government systems

## 🏆 **Success Indicators**

You'll know everything is working when you see:

✅ **DFX installation**: `dfx --version` shows version info  
✅ **Network running**: `dfx start --background` completes successfully  
✅ **Canisters deployed**: `dfx deploy` shows all canisters deployed  
✅ **Tests passing**: `dfx canister call tests runAllTests` shows all tests pass  
✅ **Demo data loaded**: System stats show initialized data  
✅ **Validation working**: Input validation functions return expected results  

## 🛡️ **CorruptGuard is Ready!**

Your improved CorruptGuard canisters are now:
- **Well-organized** with modular architecture
- **Secure** with comprehensive validation
- **Tested** with automated test suites
- **Documented** with clear interfaces
- **Production-ready** for deployment

**Happy coding! 🚀**

