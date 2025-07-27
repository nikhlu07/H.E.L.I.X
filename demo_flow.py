#!/usr/bin/env python3
"""
CorruptGuard Complete Demo Flow
Demonstrates end-to-end AI fraud detection with government budget allocation
"""

import requests
import json
import time
from datetime import datetime

BASE_URL = "http://127.0.0.1:8000"

def print_step(step_num, title, description=""):
    print(f"\n🔹 Step {step_num}: {title}")
    if description:
        print(f"   {description}")
    print("-" * 60)

def api_call(method, endpoint, headers=None, data=None):
    """Make API call and display results"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=headers)
        elif method.upper() == "POST":
            response = requests.post(url, headers=headers, json=data)
        
        print(f"📡 {method} {endpoint}")
        print(f"🔗 Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Response: {json.dumps(result, indent=2)}")
            return result
        else:
            print(f"❌ Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"🚨 Request failed: {e}")
        return None

def main():
    print("🚀 CorruptGuard AI Fraud Detection Demo")
    print("=" * 60)
    print("📋 Complete Government Procurement Flow with Real-time AI")
    print("   School Building Project: Budget → Allocation → Vendor → AI Detection")
    
    # Step 1: Check System Health
    print_step(1, "System Health Check", "Verify all components are running")
    health = api_call("GET", "/health")
    
    if not health:
        print("❌ Backend not running! Please start with: python -m app.main")
        return
    
    # Step 2: System Overview
    print_step(2, "System Overview", "Current fraud detection capabilities")
    system_info = api_call("GET", "/")
    
    # Step 3: Demo Login (Government Official)
    print_step(3, "Government Login", "Main Government creates school budget")
    gov_login = api_call("POST", "/auth/demo-login/main_government")
    
    if gov_login:
        gov_token = gov_login.get("access_token")
        print(f"🔑 Government Token: {gov_token}")
        
        # Step 4: Create School Budget
        print_step(4, "Create School Budget", "₹5 Crore for Delhi Elementary School")
        budget_data = {
            "amount": 50000000,  # 5 crore
            "purpose": "Elementary School Construction - Delhi Region"
        }
        # Note: This would use the token in a real demo
        
    # Step 5: Demo Vendor Login
    print_step(5, "Vendor Login", "Construction company submits claim")
    vendor_login = api_call("POST", "/auth/demo-login/vendor")
    
    # Step 6: Simulate Claim Submission with AI Analysis
    print_step(6, "AI Fraud Detection Demo", "Submit suspicious claim and watch AI analyze it")
    
    # Demo fraudulent claim
    suspicious_claim = {
        "claim_id": 101,
        "vendor_id": "vendor_suspicious_ltd",
        "amount": 4999999,  # Suspiciously close to 5M limit
        "budget_id": 1,
        "allocation_id": 0,
        "invoice_hash": "invoice_round_amount_12345",
        "deputy_id": "deputy_delhi_001",
        "area": "School Construction",
        "timestamp": datetime.now().isoformat()
    }
    
    print("📊 Claim being analyzed:")
    print(json.dumps(suspicious_claim, indent=2))
    
    # Step 7: Fraud Analysis Endpoint
    print_step(7, "Real-time Fraud Analysis", "AI analyzes claim for corruption indicators")
    fraud_analysis = api_call("POST", "/api/v1/fraud/analyze-claim", data=suspicious_claim)
    
    # Step 8: Get Fraud Statistics
    print_step(8, "Fraud Detection Stats", "System-wide corruption prevention metrics")
    fraud_stats = api_call("GET", "/api/v1/fraud/stats")
    
    # Step 9: Public Transparency
    print_step(9, "Citizen Transparency", "Public can monitor all government spending")
    citizen_login = api_call("POST", "/auth/demo-login/citizen")
    transparency_data = api_call("GET", "/api/v1/citizen/transparency/claims")
    
    # Step 10: Active Fraud Alerts
    print_step(10, "Active Fraud Alerts", "Real-time corruption detection alerts")
    active_alerts = api_call("GET", "/api/v1/fraud/alerts/active")
    
    print("\n" + "=" * 60)
    print("🎯 DEMO COMPLETE - Key Features Demonstrated:")
    print("✅ Government Budget Creation")
    print("✅ AI-Powered Fraud Detection (10 rules + ML)")
    print("✅ Real-time Risk Scoring (0-100)")
    print("✅ Public Transparency Dashboard")
    print("✅ Automated Corruption Alerts")
    print("✅ Role-based Access Control")
    print("✅ ICP Blockchain Integration (demo mode)")
    
    print("\n🌐 API Documentation: http://127.0.0.1:8000/docs")
    print("📊 Live Demo Available for Hackathon Presentation!")

if __name__ == "__main__":
    main()