#!/usr/bin/env python3
"""
Simple script to test backend authentication endpoints
"""

import requests
import json
import sys

BASE_URL = "http://localhost:8000"

def test_health():
    """Test if backend is running"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Backend is running and healthy")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Make sure it's running on http://localhost:8000")
        return False

def test_demo_login():
    """Test demo login endpoint"""
    try:
        response = requests.post(f"{BASE_URL}/auth/demo-login/main_government")
        if response.status_code == 200:
            data = response.json()
            print("✅ Demo login successful")
            print(f"   Role: {data['role']}")
            print(f"   Token: {data['access_token'][:20]}...")
            print(f"   User: {data['user_info']['name']}")
            return data['access_token']
        else:
            print(f"❌ Demo login failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Demo login error: {e}")
        return None

def test_protected_endpoint(token):
    """Test a protected endpoint with the token"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/auth/profile", headers=headers)
        if response.status_code == 200:
            data = response.json()
            print("✅ Protected endpoint access successful")
            print(f"   User: {data['name']}")
            print(f"   Role: {data['role']}")
            return True
        else:
            print(f"❌ Protected endpoint failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Protected endpoint error: {e}")
        return False

def test_system_stats(token):
    """Test system stats endpoint"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/v1/icp/stats", headers=headers)
        if response.status_code == 200:
            data = response.json()
            print("✅ System stats access successful")
            print(f"   Total Budget: {data['total_budget']}")
            print(f"   Active Claims: {data['active_claims']}")
            print(f"   Flagged Claims: {data['flagged_claims']}")
            return True
        else:
            print(f"❌ System stats failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ System stats error: {e}")
        return False

def main():
    print("🔍 Testing CorruptGuard Backend Authentication")
    print("=" * 50)
    
    # Test 1: Health check
    if not test_health():
        sys.exit(1)
    
    print()
    
    # Test 2: Demo login
    token = test_demo_login()
    if not token:
        sys.exit(1)
    
    print()
    
    # Test 3: Protected endpoint
    if not test_protected_endpoint(token):
        sys.exit(1)
    
    print()
    
    # Test 4: System stats
    if not test_system_stats(token):
        sys.exit(1)
    
    print()
    print("🎉 All backend authentication tests passed!")
    print("   The backend is working correctly.")
    print("   You can now test the frontend authentication.")

if __name__ == "__main__":
    main()
