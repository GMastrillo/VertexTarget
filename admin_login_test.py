#!/usr/bin/env python3
import requests
import json
import os
import sys
import time
from datetime import datetime

# Get the backend URL from the frontend .env file
def get_backend_url():
    with open('/app/frontend/.env', 'r') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                return line.strip().split('=')[1].strip('"\'')
    return None

BACKEND_URL = get_backend_url()
if not BACKEND_URL:
    print("❌ ERROR: Could not find REACT_APP_BACKEND_URL in frontend/.env")
    sys.exit(1)

# Ensure the URL ends with /api for all backend requests
if not BACKEND_URL.endswith('/api'):
    API_URL = f"{BACKEND_URL}/api"
else:
    API_URL = BACKEND_URL

print(f"🔍 Testing admin login at: {API_URL}")

def print_test_header(title):
    print(f"\n📋 {title}")
    print("=" * 50)

def print_test_result(test_name, success, details=None):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} - {test_name}")
    if details:
        print(f"    {details}")

def test_login_with_admin():
    """Test login with admin credentials"""
    try:
        payload = {
            "email": "admin@vertextarget.com",
            "password": "VT@admin2025!"
        }
        print(f"Attempting login with: {payload['email']} / {payload['password']}")
        
        response = requests.post(f"{API_URL}/auth/login", json=payload)
        
        print(f"Response status code: {response.status_code}")
        print(f"Response headers: {response.headers}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response data: {json.dumps(data, indent=2)}")
            
            if 'access_token' in data and 'token_type' in data:
                auth_token = data['access_token']
                print_test_result("Admin login", True, "Successfully logged in and received JWT token")
                
                # Test the token with a protected endpoint
                print("\nTesting token with a protected endpoint...")
                headers = {
                    "Authorization": f"Bearer {auth_token}"
                }
                
                # Try to access the contact submissions endpoint which requires authentication
                contact_response = requests.get(f"{API_URL}/contact", headers=headers)
                print(f"Protected endpoint response status: {contact_response.status_code}")
                
                if contact_response.status_code == 200:
                    print_test_result("Protected endpoint access", True, "Successfully accessed protected endpoint with token")
                    return True
                else:
                    print_test_result("Protected endpoint access", False, f"Failed to access protected endpoint: {contact_response.status_code}, {contact_response.text}")
                    return False
            else:
                print_test_result("Admin login", False, "Response missing token data")
                return False
        else:
            print_test_result("Admin login", False, f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("Admin login", False, f"Request failed: {e}")
        return False

def test_login_with_wrong_password():
    """Test login with wrong password"""
    try:
        payload = {
            "email": "admin@vertextarget.com",
            "password": "WrongPassword123!"
        }
        print(f"Attempting login with wrong password: {payload['email']}")
        
        response = requests.post(f"{API_URL}/auth/login", json=payload)
        
        print(f"Response status code: {response.status_code}")
        
        if response.status_code == 401:
            print_test_result("Wrong password rejection", True, "Correctly rejected login with wrong password")
            return True
        else:
            print_test_result("Wrong password rejection", False, f"Expected 401 but got: {response.status_code}, {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("Wrong password rejection", False, f"Request failed: {e}")
        return False

def test_login_with_nonexistent_user():
    """Test login with nonexistent user"""
    try:
        payload = {
            "email": "nonexistent@vertextarget.com",
            "password": "Password123!"
        }
        print(f"Attempting login with nonexistent user: {payload['email']}")
        
        response = requests.post(f"{API_URL}/auth/login", json=payload)
        
        print(f"Response status code: {response.status_code}")
        
        if response.status_code == 401:
            print_test_result("Nonexistent user rejection", True, "Correctly rejected login with nonexistent user")
            return True
        else:
            print_test_result("Nonexistent user rejection", False, f"Expected 401 but got: {response.status_code}, {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("Nonexistent user rejection", False, f"Request failed: {e}")
        return False

def run_admin_login_tests():
    """Run all admin login tests"""
    print_test_header("Admin Login Tests")
    
    # Test login with correct credentials
    admin_login_success = test_login_with_admin()
    
    # Test login with wrong password
    wrong_password_test = test_login_with_wrong_password()
    
    # Test login with nonexistent user
    nonexistent_user_test = test_login_with_nonexistent_user()
    
    # Summary
    print("\n" + "="*50)
    print("📊 ADMIN LOGIN TEST SUMMARY:")
    print(f"  Admin Login with Correct Credentials: {'✅ PASS' if admin_login_success else '❌ FAIL'}")
    print(f"  Login Rejection with Wrong Password: {'✅ PASS' if wrong_password_test else '❌ FAIL'}")
    print(f"  Login Rejection with Nonexistent User: {'✅ PASS' if nonexistent_user_test else '❌ FAIL'}")
    
    overall_status = admin_login_success and wrong_password_test and nonexistent_user_test
    print(f"\n🏁 Overall Admin Login Status: {'✅ PASS' if overall_status else '❌ FAIL'}")
    print("\n" + "="*50)
    
    return overall_status

if __name__ == "__main__":
    run_admin_login_tests()