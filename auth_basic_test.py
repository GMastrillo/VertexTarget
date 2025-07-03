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

print(f"🔍 Testing backend at: {API_URL}")

# Global variables to store test data
auth_token = None

# Test helper functions
def print_test_header(title):
    print(f"\n📋 {title}")
    print("=" * 50)

def print_test_result(test_name, success, details=None):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} - {test_name}")
    if details:
        print(f"    {details}")

# 1. Health Check Test
def test_health_endpoint():
    """Test the health endpoint"""
    print_test_header("1. Health Check Test")
    try:
        response = requests.get(f"{API_URL}/health")
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'healthy' and data.get('database') == 'connected':
                print_test_result("Health endpoint", True, "Database is connected and healthy")
                return True
            else:
                print_test_result("Health endpoint", False, f"Unexpected response: {data}")
                return False
        else:
            print_test_result("Health endpoint", False, f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("Health endpoint", False, f"Request failed: {e}")
        return False

# 2. Login Tests
def test_login_with_admin():
    """Test login with admin credentials"""
    print_test_header("2. Admin Login Test")
    global auth_token
    try:
        payload = {
            "email": "admin@vertextarget.com",
            "password": "VT@admin2025!"
        }
        response = requests.post(f"{API_URL}/auth/login", json=payload)
        
        if response.status_code == 200:
            data = response.json()
            if 'access_token' in data and 'token_type' in data:
                auth_token = data['access_token']
                print_test_result("Admin login", True, "Successfully logged in and received JWT token")
                return True
            else:
                print_test_result("Admin login", False, "Response missing token data")
                return False
        else:
            print_test_result("Admin login", False, f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("Admin login", False, f"Request failed: {e}")
        return False

def test_login_with_user():
    """Test login with user credentials"""
    print_test_header("2.1 User Login Test")
    try:
        payload = {
            "email": "user@vertextarget.com",
            "password": "User@2025!"
        }
        response = requests.post(f"{API_URL}/auth/login", json=payload)
        
        if response.status_code == 200:
            data = response.json()
            if 'access_token' in data and 'token_type' in data:
                print_test_result("User login", True, "Successfully logged in and received JWT token")
                return True
            else:
                print_test_result("User login", False, "Response missing token data")
                return False
        else:
            print_test_result("User login", False, f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("User login", False, f"Request failed: {e}")
        return False

# 3. Data Endpoint Tests
def test_get_portfolio():
    """Test getting all portfolio items"""
    print_test_header("3. Portfolio Data Endpoint Test")
    try:
        response = requests.get(f"{API_URL}/portfolio")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_test_result("GET /portfolio", True, f"Retrieved {len(data)} portfolio items")
                # Print the first item to verify data structure
                if len(data) > 0:
                    print(f"    Sample item: {json.dumps(data[0], indent=2)[:200]}...")
                return True
            else:
                print_test_result("GET /portfolio", False, 
                                 f"Expected a list but got: {type(data)}")
                return False
        else:
            print_test_result("GET /portfolio", False, 
                             f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("GET /portfolio", False, f"Request failed: {e}")
        return False

def test_get_testimonials():
    """Test getting all testimonials"""
    print_test_header("4. Testimonials Data Endpoint Test")
    try:
        response = requests.get(f"{API_URL}/testimonials")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_test_result("GET /testimonials", True, f"Retrieved {len(data)} testimonials")
                # Print the first item to verify data structure
                if len(data) > 0:
                    print(f"    Sample item: {json.dumps(data[0], indent=2)[:200]}...")
                return True
            else:
                print_test_result("GET /testimonials", False, 
                                 f"Expected a list but got: {type(data)}")
                return False
        else:
            print_test_result("GET /testimonials", False, 
                             f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("GET /testimonials", False, f"Request failed: {e}")
        return False

def run_basic_tests():
    """Run the basic authentication and data endpoint tests"""
    print("\n🔍 STARTING BASIC BACKEND TESTS\n" + "="*50)
    
    # 1. Health Check
    health_status = test_health_endpoint()
    
    # 2. Authentication Tests
    admin_login_status = test_login_with_admin()
    user_login_status = test_login_with_user()
    
    # 3. Data Endpoint Tests
    portfolio_status = test_get_portfolio()
    testimonials_status = test_get_testimonials()
    
    # Summary
    print("\n" + "="*50)
    print("📊 TEST SUMMARY:")
    
    print(f"  1. Health Check: {'✅ PASS' if health_status else '❌ FAIL'}")
    print(f"  2. Admin Login: {'✅ PASS' if admin_login_status else '❌ FAIL'}")
    print(f"  2.1 User Login: {'✅ PASS' if user_login_status else '❌ FAIL'}")
    print(f"  3. Portfolio Data: {'✅ PASS' if portfolio_status else '❌ FAIL'}")
    print(f"  4. Testimonials Data: {'✅ PASS' if testimonials_status else '❌ FAIL'}")
    
    overall_status = health_status and admin_login_status and user_login_status and portfolio_status and testimonials_status
    
    print(f"\n🏁 Overall Basic Backend Status: {'✅ PASS' if overall_status else '❌ FAIL'}")
    print("\n" + "="*50)
    
    return overall_status

if __name__ == "__main__":
    run_basic_tests()