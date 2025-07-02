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

print(f"🔍 Testing backend for VertexTarget at: {API_URL}")

def print_test_header(title):
    print(f"\n📋 {title}")
    print("=" * 80)

def print_test_result(test_name, success, details=None):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} - {test_name}")
    if details:
        print(f"    {details}")

def test_login_endpoint():
    """Test the login endpoint with admin credentials"""
    try:
        print(f"Testing POST {API_URL}/auth/login with admin credentials...")
        
        payload = {
            "email": "admin@vertextarget.com",
            "password": "VT@admin2025!"
        }
        
        response = requests.post(f"{API_URL}/auth/login", json=payload)
        
        print(f"Response status code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response data: {json.dumps(data, indent=2)}")
            
            if 'access_token' in data and 'token_type' in data:
                token = data['access_token']
                print_test_result("Login endpoint", True, 
                                 f"Successfully logged in with admin credentials and received JWT token")
                return token
            else:
                print_test_result("Login endpoint", False, "Response missing token data")
                return None
        else:
            print_test_result("Login endpoint", False, 
                             f"Status code: {response.status_code}, Response: {response.text}")
            return None
    except Exception as e:
        print_test_result("Login endpoint", False, f"Request failed: {e}")
        return None

def test_jwt_token(token):
    """Test if the JWT token is valid and has the expected structure"""
    if not token:
        print_test_result("JWT token", False, "No token provided")
        return False
    
    try:
        # Decode the JWT payload without verification (for testing purposes only)
        import base64
        
        # Split the token into header, payload, and signature
        parts = token.split('.')
        if len(parts) != 3:
            print_test_result("JWT token structure", False, "Token does not have three parts")
            return False
        
        # Decode the payload (middle part)
        payload_b64 = parts[1]
        # Add padding if needed
        payload_b64 += '=' * (4 - len(payload_b64) % 4) if len(payload_b64) % 4 != 0 else ''
        
        try:
            payload_bytes = base64.b64decode(payload_b64)
            payload = json.loads(payload_bytes)
            print(f"Decoded token payload: {json.dumps(payload, indent=2)}")
            
            # Check for required fields in the token
            if 'sub' in payload and 'exp' in payload:
                print_test_result("JWT token structure", True, 
                                 f"Token contains required fields: sub={payload['sub']}, exp={payload['exp']}")
                
                # Calculate token expiration time
                exp_time = datetime.fromtimestamp(payload['exp'])
                now = datetime.now()
                hours_valid = (exp_time - now).total_seconds() / 3600
                
                print_test_result("JWT token expiration", True, 
                                 f"Token expires at {exp_time} (valid for {hours_valid:.1f} hours)")
                
                return True
            else:
                print_test_result("JWT token structure", False, 
                                 f"Token missing required fields. Found: {list(payload.keys())}")
                return False
        except Exception as e:
            print_test_result("JWT token structure", False, f"Failed to decode token: {e}")
            return False
    except Exception as e:
        print_test_result("JWT token", False, f"Test failed with error: {e}")
        return False

def test_protected_endpoints(token):
    """Test if protected endpoints work with the JWT token"""
    if not token:
        print_test_result("Protected endpoints", False, "No token provided")
        return False
    
    try:
        headers = {
            "Authorization": f"Bearer {token}"
        }
        
        # Test a few protected endpoints
        protected_endpoints = [
            {"method": "GET", "url": f"{API_URL}/contact", "name": "Get contact submissions"},
            {"method": "GET", "url": f"{API_URL}/v1/ai/cache/stats", "name": "Get AI cache stats"},
        ]
        
        all_passed = True
        for endpoint in protected_endpoints:
            print(f"Testing protected endpoint: {endpoint['name']} ({endpoint['method']} {endpoint['url']})")
            
            if endpoint['method'] == 'GET':
                response = requests.get(endpoint['url'], headers=headers)
            elif endpoint['method'] == 'POST':
                response = requests.post(endpoint['url'], headers=headers, json=endpoint.get('payload', {}))
            
            print(f"Response status code: {response.status_code}")
            
            if response.status_code == 200:
                print_test_result(endpoint['name'], True, "Successfully accessed with token")
            else:
                print_test_result(endpoint['name'], False, 
                                 f"Failed with status {response.status_code}: {response.text}")
                all_passed = False
        
        return all_passed
    except Exception as e:
        print_test_result("Protected endpoints", False, f"Test failed with error: {e}")
        return False

def test_health_endpoint():
    """Test the health endpoint"""
    try:
        print(f"Testing GET {API_URL}/health...")
        
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
            print_test_result("Health endpoint", False, 
                             f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        print_test_result("Health endpoint", False, f"Request failed: {e}")
        return False

def test_database_data():
    """Test if the database has the necessary data"""
    try:
        # Test portfolio data
        print(f"Testing GET {API_URL}/portfolio...")
        
        portfolio_response = requests.get(f"{API_URL}/portfolio")
        
        print(f"Portfolio response status code: {portfolio_response.status_code}")
        
        portfolio_ok = False
        if portfolio_response.status_code == 200:
            portfolio_data = portfolio_response.json()
            
            if isinstance(portfolio_data, list) and len(portfolio_data) >= 4:
                print_test_result("Portfolio data", True, f"Found {len(portfolio_data)} portfolio items")
                portfolio_ok = True
            else:
                print_test_result("Portfolio data", False, 
                                 f"Expected at least 4 items but found {len(portfolio_data) if isinstance(portfolio_data, list) else 'not a list'}")
        else:
            print_test_result("Portfolio data", False, 
                             f"Status code: {portfolio_response.status_code}, Response: {portfolio_response.text}")
        
        # Test testimonials data
        print(f"Testing GET {API_URL}/testimonials...")
        
        testimonials_response = requests.get(f"{API_URL}/testimonials")
        
        print(f"Testimonials response status code: {testimonials_response.status_code}")
        
        testimonials_ok = False
        if testimonials_response.status_code == 200:
            testimonials_data = testimonials_response.json()
            
            if isinstance(testimonials_data, list) and len(testimonials_data) >= 3:
                print_test_result("Testimonials data", True, f"Found {len(testimonials_data)} testimonials")
                testimonials_ok = True
            else:
                print_test_result("Testimonials data", False, 
                                 f"Expected at least 3 items but found {len(testimonials_data) if isinstance(testimonials_data, list) else 'not a list'}")
        else:
            print_test_result("Testimonials data", False, 
                             f"Status code: {testimonials_response.status_code}, Response: {testimonials_response.text}")
        
        return portfolio_ok and testimonials_ok
    except Exception as e:
        print_test_result("Database data", False, f"Test failed with error: {e}")
        return False

def run_comprehensive_tests():
    """Run all tests for the VertexTarget backend"""
    print_test_header("VertexTarget Backend Tests")
    
    # Test login endpoint
    token = test_login_endpoint()
    login_ok = token is not None
    
    # Test JWT token
    jwt_ok = test_jwt_token(token) if token else False
    
    # Test protected endpoints
    protected_ok = test_protected_endpoints(token) if token else False
    
    # Test health endpoint
    health_ok = test_health_endpoint()
    
    # Test database data
    data_ok = test_database_data()
    
    # Summary
    print("\n" + "="*80)
    print("📊 VERTEXTARGET BACKEND TEST SUMMARY:")
    print(f"  1. Login Endpoint (POST /api/auth/login): {'✅ PASS' if login_ok else '❌ FAIL'}")
    print(f"  2. JWT Token Generation: {'✅ PASS' if jwt_ok else '❌ FAIL'}")
    print(f"  3. Protected Endpoints with Token: {'✅ PASS' if protected_ok else '❌ FAIL'}")
    print(f"  4. Health Endpoint (GET /api/health): {'✅ PASS' if health_ok else '❌ FAIL'}")
    print(f"  5. Database Data (admin user, projects, testimonials): {'✅ PASS' if data_ok else '❌ FAIL'}")
    
    overall_status = login_ok and jwt_ok and protected_ok and health_ok and data_ok
    print(f"\n🏁 Overall Backend Status: {'✅ PASS' if overall_status else '❌ FAIL'}")
    
    if overall_status:
        print("\n✅ The backend is working correctly. The issue with frontend redirection after login")
        print("   is likely not related to the backend API, as authentication is working properly.")
        print("   The problem might be in the frontend code handling the redirect after successful login.")
    else:
        print("\n❌ There are issues with the backend that need to be addressed.")
        print("   Fix the failing tests before investigating the frontend redirection issue.")
    
    print("\n" + "="*80)
    
    return overall_status

if __name__ == "__main__":
    run_comprehensive_tests()