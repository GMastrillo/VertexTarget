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

print(f"🔍 Testing protected endpoints at: {API_URL}")

def print_test_header(title):
    print(f"\n📋 {title}")
    print("=" * 50)

def print_test_result(test_name, success, details=None):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} - {test_name}")
    if details:
        print(f"    {details}")

def get_auth_token():
    """Get an authentication token for testing"""
    try:
        payload = {
            "email": "admin@vertextarget.com",
            "password": "VT@admin2025!"
        }
        
        response = requests.post(f"{API_URL}/auth/login", json=payload)
        
        if response.status_code == 200:
            data = response.json()
            if 'access_token' in data:
                return data['access_token']
        
        print(f"❌ Failed to get auth token: {response.status_code}, {response.text}")
        return None
    except Exception as e:
        print(f"❌ Error getting auth token: {e}")
        return None

def test_protected_endpoints():
    """Test various protected endpoints with a valid token"""
    token = get_auth_token()
    if not token:
        print_test_result("Get auth token", False, "Failed to obtain authentication token")
        return False
    
    print_test_result("Get auth token", True, f"Successfully obtained token: {token[:20]}...")
    
    # Set up headers with the token
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    # List of protected endpoints to test
    protected_endpoints = [
        {"method": "GET", "url": f"{API_URL}/contact", "name": "Get contact submissions"},
        {"method": "POST", "url": f"{API_URL}/portfolio", "name": "Create portfolio item", 
         "payload": {
             "title": "Test Portfolio Item",
             "category": "Test",
             "image": "https://example.com/image.jpg",
             "metric": "Test Metric",
             "description": "Test Description",
             "technologies": ["Tech1", "Tech2"],
             "results": {"metric1": "value1", "metric2": "value2"},
             "challenge": "Test Challenge",
             "solution": "Test Solution",
             "outcome": "Test Outcome"
         }},
        {"method": "GET", "url": f"{API_URL}/v1/ai/cache/stats", "name": "Get AI cache stats"},
    ]
    
    # Test each endpoint
    all_passed = True
    for endpoint in protected_endpoints:
        try:
            print(f"\nTesting protected endpoint: {endpoint['name']} ({endpoint['method']} {endpoint['url']})")
            
            if endpoint['method'] == 'GET':
                response = requests.get(endpoint['url'], headers=headers)
            elif endpoint['method'] == 'POST':
                response = requests.post(endpoint['url'], headers=headers, json=endpoint.get('payload', {}))
            elif endpoint['method'] == 'PUT':
                response = requests.put(endpoint['url'], headers=headers, json=endpoint.get('payload', {}))
            elif endpoint['method'] == 'DELETE':
                response = requests.delete(endpoint['url'], headers=headers)
            
            print(f"Response status code: {response.status_code}")
            
            if response.status_code in [200, 201, 204]:
                print_test_result(endpoint['name'], True, f"Successfully accessed with token")
                
                # For GET requests, print a sample of the response data
                if endpoint['method'] == 'GET' and response.status_code == 200:
                    data = response.json()
                    if isinstance(data, list):
                        print(f"    Received {len(data)} items")
                    else:
                        print(f"    Response data sample: {str(data)[:100]}...")
            else:
                print_test_result(endpoint['name'], False, 
                                 f"Failed with status {response.status_code}: {response.text}")
                all_passed = False
                
        except Exception as e:
            print_test_result(endpoint['name'], False, f"Request failed: {e}")
            all_passed = False
    
    return all_passed

def test_endpoints_without_token():
    """Test protected endpoints without a token to ensure they're properly secured"""
    # List of protected endpoints to test
    protected_endpoints = [
        {"method": "GET", "url": f"{API_URL}/contact", "name": "Get contact submissions"},
        {"method": "POST", "url": f"{API_URL}/portfolio", "name": "Create portfolio item", 
         "payload": {
             "title": "Test Portfolio Item",
             "category": "Test",
             "image": "https://example.com/image.jpg",
             "metric": "Test Metric",
             "description": "Test Description",
             "technologies": ["Tech1", "Tech2"],
             "results": {"metric1": "value1", "metric2": "value2"},
             "challenge": "Test Challenge",
             "solution": "Test Solution",
             "outcome": "Test Outcome"
         }},
        {"method": "GET", "url": f"{API_URL}/v1/ai/cache/stats", "name": "Get AI cache stats"},
    ]
    
    # Test each endpoint
    all_passed = True
    for endpoint in protected_endpoints:
        try:
            print(f"\nTesting endpoint without token: {endpoint['name']} ({endpoint['method']} {endpoint['url']})")
            
            if endpoint['method'] == 'GET':
                response = requests.get(endpoint['url'])
            elif endpoint['method'] == 'POST':
                response = requests.post(endpoint['url'], json=endpoint.get('payload', {}))
            elif endpoint['method'] == 'PUT':
                response = requests.put(endpoint['url'], json=endpoint.get('payload', {}))
            elif endpoint['method'] == 'DELETE':
                response = requests.delete(endpoint['url'])
            
            print(f"Response status code: {response.status_code}")
            
            if response.status_code in [401, 403]:
                print_test_result(f"{endpoint['name']} without token", True, 
                                 f"Correctly rejected unauthenticated request with status {response.status_code}")
            else:
                print_test_result(f"{endpoint['name']} without token", False, 
                                 f"Expected 401/403 but got: {response.status_code}")
                all_passed = False
                
        except Exception as e:
            print_test_result(f"{endpoint['name']} without token", False, f"Request failed: {e}")
            all_passed = False
    
    return all_passed

def run_protected_endpoint_tests():
    """Run all protected endpoint tests"""
    print_test_header("Protected Endpoint Tests")
    
    # Test with valid token
    with_token_test = test_protected_endpoints()
    
    # Test without token
    without_token_test = test_endpoints_without_token()
    
    # Summary
    print("\n" + "="*50)
    print("📊 PROTECTED ENDPOINT TEST SUMMARY:")
    print(f"  Protected Endpoints with Token: {'✅ PASS' if with_token_test else '❌ FAIL'}")
    print(f"  Protected Endpoints without Token: {'✅ PASS' if without_token_test else '❌ FAIL'}")
    
    overall_status = with_token_test and without_token_test
    print(f"\n🏁 Overall Protected Endpoint Status: {'✅ PASS' if overall_status else '❌ FAIL'}")
    print("\n" + "="*50)
    
    return overall_status

if __name__ == "__main__":
    run_protected_endpoint_tests()