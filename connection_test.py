#!/usr/bin/env python3
import requests
import json
import sys
import time
from urllib.parse import urlparse

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

print(f"🔍 Testing frontend-backend connection at: {API_URL}")

# Test helper functions
def print_test_result(test_name, success, details=None):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} - {test_name}")
    if details:
        print(f"    {details}")

def test_backend_reachability():
    """Test if the backend is reachable from the frontend"""
    try:
        # Parse the URL to get host and port
        parsed_url = urlparse(BACKEND_URL)
        host = parsed_url.hostname
        port = parsed_url.port or (443 if parsed_url.scheme == 'https' else 80)
        
        print(f"Testing connection to {host}:{port}...")
        
        # Test basic connectivity
        response = requests.get(f"{API_URL}/health", timeout=5)
        
        if response.status_code == 200:
            print_test_result("Backend reachability", True, f"Backend is reachable at {BACKEND_URL}")
            return True
        else:
            print_test_result("Backend reachability", False, 
                             f"Backend returned unexpected status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError as e:
        print_test_result("Backend reachability", False, f"Connection error: {e}")
        return False
    except requests.exceptions.Timeout as e:
        print_test_result("Backend reachability", False, f"Connection timeout: {e}")
        return False
    except requests.exceptions.RequestException as e:
        print_test_result("Backend reachability", False, f"Request failed: {e}")
        return False

def test_login_endpoint():
    """Test the login endpoint specifically"""
    try:
        payload = {
            "email": "admin@vertextarget.com",
            "password": "VT@admin2025!"
        }
        
        print(f"Testing login endpoint at {API_URL}/auth/login...")
        
        # Make the login request
        response = requests.post(f"{API_URL}/auth/login", json=payload, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            if 'access_token' in data and data['access_token']:
                print_test_result("Login endpoint", True, "Login endpoint is working correctly")
                return data['access_token']
            else:
                print_test_result("Login endpoint", False, "Response missing token")
                return None
        else:
            print_test_result("Login endpoint", False, 
                             f"Status code: {response.status_code}, Response: {response.text}")
            return None
    except requests.exceptions.ConnectionError as e:
        print_test_result("Login endpoint", False, f"Connection error: {e}")
        return None
    except requests.exceptions.Timeout as e:
        print_test_result("Login endpoint", False, f"Connection timeout: {e}")
        return None
    except requests.exceptions.RequestException as e:
        print_test_result("Login endpoint", False, f"Request failed: {e}")
        return None

def test_protected_endpoints(token):
    """Test protected endpoints with the token"""
    if not token:
        print_test_result("Protected endpoints", False, "No token available")
        return False
    
    endpoints = [
        {"url": f"{API_URL}/portfolio", "method": "get", "name": "Portfolio (GET)"},
        {"url": f"{API_URL}/testimonials", "method": "get", "name": "Testimonials (GET)"},
        {"url": f"{API_URL}/v1/ai/cache/stats", "method": "get", "name": "AI Cache Stats (GET)", "protected": True}
    ]
    
    all_passed = True
    
    for endpoint in endpoints:
        try:
            headers = {}
            if endpoint.get("protected", False):
                headers["Authorization"] = f"Bearer {token}"
            
            if endpoint["method"] == "get":
                response = requests.get(endpoint["url"], headers=headers, timeout=5)
            
            if response.status_code == 200:
                print_test_result(f"Endpoint: {endpoint['name']}", True, 
                                 f"Status code: {response.status_code}")
            else:
                print_test_result(f"Endpoint: {endpoint['name']}", False, 
                                 f"Status code: {response.status_code}, Response: {response.text}")
                all_passed = False
                
        except requests.exceptions.RequestException as e:
            print_test_result(f"Endpoint: {endpoint['name']}", False, f"Request failed: {e}")
            all_passed = False
    
    return all_passed

def test_cors_headers():
    """Test if CORS headers are correctly set for frontend origin"""
    try:
        # Use localhost:3000 as the frontend origin
        headers = {
            'Origin': 'http://localhost:3000',
        }
        
        response = requests.get(f"{API_URL}/health", headers=headers)
        
        cors_headers = [
            'Access-Control-Allow-Origin',
            'Access-Control-Allow-Credentials'
        ]
        
        missing_headers = [header for header in cors_headers if header not in response.headers]
        
        if not missing_headers:
            print_test_result("CORS headers", True, "All required CORS headers present")
            
            # Check if the origin is correctly reflected
            if response.headers.get('Access-Control-Allow-Origin') == 'http://localhost:3000':
                print_test_result("CORS origin", True, 
                                 f"Origin correctly set to: {response.headers.get('Access-Control-Allow-Origin')}")
            else:
                print_test_result("CORS origin", False, 
                                 f"Expected origin 'http://localhost:3000' but got: {response.headers.get('Access-Control-Allow-Origin')}")
                return False
            
            return True
        else:
            print_test_result("CORS headers", False, 
                             f"Missing CORS headers: {', '.join(missing_headers)}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("CORS headers", False, f"Request failed: {e}")
        return False

def test_preflight_request():
    """Test if preflight OPTIONS requests are correctly handled"""
    try:
        headers = {
            'Origin': 'http://localhost:3000',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type, Authorization'
        }
        
        response = requests.options(f"{API_URL}/auth/login", headers=headers)
        
        cors_headers = [
            'Access-Control-Allow-Origin',
            'Access-Control-Allow-Methods',
            'Access-Control-Allow-Headers'
        ]
        
        missing_headers = [header for header in cors_headers if header not in response.headers]
        
        if not missing_headers:
            print_test_result("Preflight request", True, "All required CORS headers present in preflight response")
            
            # Check if the methods include POST (needed for login)
            methods = response.headers.get('Access-Control-Allow-Methods', '')
            if 'POST' in methods:
                print_test_result("Preflight methods", True, f"Methods include POST: {methods}")
            else:
                print_test_result("Preflight methods", False, f"Methods missing POST: {methods}")
                return False
            
            # Check if the headers include Content-Type and Authorization
            allowed_headers = response.headers.get('Access-Control-Allow-Headers', '')
            if 'Content-Type' in allowed_headers and 'Authorization' in allowed_headers:
                print_test_result("Preflight headers", True, f"Headers include required values: {allowed_headers}")
            else:
                print_test_result("Preflight headers", False, f"Headers missing required values: {allowed_headers}")
                return False
            
            return True
        else:
            print_test_result("Preflight request", False, 
                             f"Missing CORS headers: {', '.join(missing_headers)}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("Preflight request", False, f"Request failed: {e}")
        return False

def run_connection_tests():
    """Run all connection tests"""
    print("\n🔍 STARTING FRONTEND-BACKEND CONNECTION TESTS\n" + "="*50)
    
    # Test backend reachability
    reachability = test_backend_reachability()
    
    if not reachability:
        print("\n❌ CRITICAL ERROR: Backend is not reachable. Aborting further tests.")
        return False
    
    # Test login endpoint
    token = test_login_endpoint()
    
    # Test protected endpoints
    protected_endpoints = test_protected_endpoints(token)
    
    # Test CORS headers
    cors_headers = test_cors_headers()
    
    # Test preflight request
    preflight = test_preflight_request()
    
    # Summary
    print("\n" + "="*50)
    print("📊 CONNECTION TEST SUMMARY:")
    print(f"  Backend Reachability: {'✅ PASS' if reachability else '❌ FAIL'}")
    print(f"  Login Endpoint: {'✅ PASS' if token else '❌ FAIL'}")
    print(f"  Protected Endpoints: {'✅ PASS' if protected_endpoints else '❌ FAIL'}")
    print(f"  CORS Headers: {'✅ PASS' if cors_headers else '❌ FAIL'}")
    print(f"  Preflight Request: {'✅ PASS' if preflight else '❌ FAIL'}")
    
    overall_status = reachability and token and protected_endpoints and cors_headers and preflight
    print(f"\n🏁 Overall Connection Status: {'✅ PASS' if overall_status else '❌ FAIL'}")
    
    if overall_status:
        print("\n✅ The backend is properly configured and accessible from the frontend.")
        print("✅ CORS is correctly configured to allow requests from the frontend.")
        print("✅ The login endpoint is working correctly and returning valid tokens.")
        print("✅ The 'Failed to fetch' issue should be resolved.")
    else:
        print("\n❌ There are still issues with the frontend-backend connection.")
        print("❌ Please check the detailed test results above to identify the specific problems.")
    
    print("\n" + "="*50)
    
    return overall_status

if __name__ == "__main__":
    run_connection_tests()