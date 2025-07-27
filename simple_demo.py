#!/usr/bin/env python3
"""
CorruptGuard Simple Demo - Complete AI Fraud Detection Flow
"""

import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000"

def test_endpoint(name, endpoint, method="GET", data=None):
    print(f"\n=== {name} ===")
    try:
        if method == "GET":
            response = requests.get(f"{BASE_URL}{endpoint}")
        else:
            response = requests.post(f"{BASE_URL}{endpoint}", json=data)
        
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Response: {json.dumps(result, indent=2)}")
            return result
        else:
            print(f"Error: {response.text}")
            return None
    except Exception as e:
        print(f"Failed: {e}")
        return None

def main():
    print("CorruptGuard AI Fraud Detection Demo")
    print("====================================")
    
    # 1. System Health
    test_endpoint("System Health Check", "/health")
    
    # 2. System Overview  
    test_endpoint("System Overview", "/")
    
    # 3. Demo Authentication
    print("\n=== Demo User Logins ===")
    test_endpoint("Government Login", "/auth/demo-login/main_government", "POST")
    test_endpoint("Vendor Login", "/auth/demo-login/vendor", "POST") 
    test_endpoint("Citizen Login", "/auth/demo-login/citizen", "POST")
    
    # 4. AI Fraud Detection Demo
    print("\n=== AI FRAUD DETECTION DEMO ===")
    
    # Suspicious claim data
    suspicious_claim = {
        "claim_id": 999,
        "vendor_id": "suspicious_vendor_ltd", 
        "amount": 4999999.0,  # Very round number, close to limit
        "budget_id": 1,
        "allocation_id": 0,
        "invoice_hash": "suspicious_round_amount_999",
        "deputy_id": "deputy_test",
        "area": "School Construction",
        "timestamp": "2025-07-26T18:00:00"
    }
    
    print("\nSubmitting SUSPICIOUS claim for AI analysis:")
    print(json.dumps(suspicious_claim, indent=2))
    
    fraud_result = test_endpoint("AI Fraud Analysis", "/api/v1/fraud/analyze-claim", "POST", suspicious_claim)
    
    # 5. Fraud Statistics
    test_endpoint("Fraud Detection Statistics", "/api/v1/fraud/stats")
    
    # 6. Demo Scenarios
    print("\n=== DEMO FRAUD PATTERNS ===")
    test_endpoint("Fraud Pattern Information", "/api/v1/demo/fraud-patterns")
    
    print("\n=== DEMO COMPLETE ===")
    print("Key Features Demonstrated:")
    print("- Advanced AI Fraud Detection (10 rules + ML)")
    print("- Real-time Risk Scoring (0-100)")
    print("- Multi-role Authentication System")
    print("- Government Budget Management")
    print("- Public Transparency Features")
    print("- ICP Blockchain Integration")
    print("\nAPI Documentation: http://127.0.0.1:8000/docs")

if __name__ == "__main__":
    main()