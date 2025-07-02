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

print(f"🔍 Testing health endpoint at: {API_URL}")

def print_test_header(title):
    print(f"\n📋 {title}")
    print("=" * 50)

def print_test_result(test_name, success, details=None):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} - {test_name}")
    if details:
        print(f"    {details}")

def test_health_endpoint():
    """Test the health endpoint"""
    try:
        print(f"Sending request to {API_URL}/health")
        
        response = requests.get(f"{API_URL}/health")
        
        print(f"Response status code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response data: {json.dumps(data, indent=2)}")
            
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

def test_root_endpoint():
    """Test the root endpoint"""
    try:
        print(f"Sending request to {API_URL}/")
        
        response = requests.get(f"{API_URL}/")
        
        print(f"Response status code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response data: {json.dumps(data, indent=2)}")
            
            if 'message' in data and 'status' in data:
                print_test_result("Root endpoint", True, f"API is active: {data.get('message')}")
                return True
            else:
                print_test_result("Root endpoint", False, f"Unexpected response: {data}")
                return False
        else:
            print_test_result("Root endpoint", False, f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("Root endpoint", False, f"Request failed: {e}")
        return False

def run_health_tests():
    """Run all health endpoint tests"""
    print_test_header("Health Endpoint Tests")
    
    # Test health endpoint
    health_test = test_health_endpoint()
    
    # Test root endpoint
    root_test = test_root_endpoint()
    
    # Summary
    print("\n" + "="*50)
    print("📊 HEALTH ENDPOINT TEST SUMMARY:")
    print(f"  Health Endpoint: {'✅ PASS' if health_test else '❌ FAIL'}")
    print(f"  Root Endpoint: {'✅ PASS' if root_test else '❌ FAIL'}")
    
    overall_status = health_test and root_test
    print(f"\n🏁 Overall Health Status: {'✅ PASS' if overall_status else '❌ FAIL'}")
    print("\n" + "="*50)
    
    return overall_status

if __name__ == "__main__":
    run_health_tests()