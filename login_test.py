#!/usr/bin/env python3
import requests
import json
import sys
import time

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

print(f"🔍 Testing login functionality at: {API_URL}")

# Test helper functions
def print_test_result(test_name, success, details=None):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} - {test_name}")
    if details:
        print(f"    {details}")

def test_login(email, password, expected_role=None):
    """Test login with specific credentials"""
    try:
        payload = {
            "email": email,
            "password": password
        }
        
        print(f"\nTesting login with: {email} / {password}")
        
        # Make the login request
        response = requests.post(f"{API_URL}/auth/login", json=payload)
        
        # Print the full response for debugging
        print(f"Response status code: {response.status_code}")
        print(f"Response headers: {response.headers}")
        
        try:
            response_data = response.json()
            print(f"Response data: {json.dumps(response_data, indent=2)}")
        except json.JSONDecodeError:
            print(f"Response text (not JSON): {response.text}")
            response_data = {}
        
        if response.status_code == 200:
            # Check if we got a token
            if 'access_token' in response_data and response_data['access_token']:
                token = response_data['access_token']
                
                # Check if the role matches expected role (if provided)
                if expected_role and 'user' in response_data:
                    actual_role = response_data['user'].get('role')
                    if actual_role == expected_role:
                        print_test_result(f"Login with {email}", True, 
                                        f"Successfully logged in with role: {actual_role}")
                    else:
                        print_test_result(f"Login with {email}", False, 
                                        f"Expected role {expected_role}, but got {actual_role}")
                        return None
                else:
                    print_test_result(f"Login with {email}", True, "Successfully logged in")
                
                # Test a protected endpoint with the token
                print("\nTesting protected endpoint with token...")
                headers = {
                    "Authorization": f"Bearer {token}"
                }
                
                # Try to access a protected endpoint (admin users)
                admin_response = requests.get(f"{API_URL}/admin/users", headers=headers)
                
                if expected_role == "admin" and admin_response.status_code == 200:
                    print_test_result("Access to admin endpoint", True, "Admin access successful")
                elif expected_role != "admin" and admin_response.status_code == 403:
                    print_test_result("Access to admin endpoint", True, "Non-admin correctly denied access")
                elif expected_role == "admin":
                    print_test_result("Access to admin endpoint", False, 
                                    f"Admin access failed with status: {admin_response.status_code}")
                
                return token
            else:
                print_test_result(f"Login with {email}", False, "Response missing token")
                return None
        else:
            print_test_result(f"Login with {email}", False, 
                            f"Status code: {response.status_code}, Response: {response.text}")
            return None
    except requests.exceptions.RequestException as e:
        print_test_result(f"Login with {email}", False, f"Request failed: {e}")
        return None

def run_login_tests():
    """Run all login tests"""
    print("\n🔍 STARTING LOGIN TESTS\n" + "="*50)
    
    # Test with all three sets of credentials
    admin_token = test_login("admin@vertextarget.com", "VT@admin2025!", "admin")
    time.sleep(1)  # Add a small delay between requests
    
    user_token = test_login("user@vertextarget.com", "User@2025!", "user")
    time.sleep(1)  # Add a small delay between requests
    
    joao_token = test_login("joao@empresa.com", "Joao@123!", "user")
    
    # Test with invalid credentials
    time.sleep(1)  # Add a small delay between requests
    invalid_token = test_login("admin@vertextarget.com", "WrongPassword123!")
    
    # Summary
    print("\n" + "="*50)
    print("📊 LOGIN TEST SUMMARY:")
    print(f"  Admin Login: {'✅ PASS' if admin_token else '❌ FAIL'}")
    print(f"  User Login: {'✅ PASS' if user_token else '❌ FAIL'}")
    print(f"  Joao Login: {'✅ PASS' if joao_token else '❌ FAIL'}")
    print(f"  Invalid Login: {'✅ PASS' if not invalid_token else '❌ FAIL'}")
    
    overall_status = admin_token and user_token and joao_token and not invalid_token
    print(f"\n🏁 Overall Login Status: {'✅ PASS' if overall_status else '❌ FAIL'}")
    print("\n" + "="*50)
    
    return overall_status

if __name__ == "__main__":
    run_login_tests()