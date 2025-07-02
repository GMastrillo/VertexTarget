#!/usr/bin/env python3
import requests
import json
import os
import sys
from colorama import init, Fore, Style

# Initialize colorama for colored output
init()

# Get the backend URL from the frontend .env file
def get_backend_url():
    with open('/app/frontend/.env', 'r') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                return line.strip().split('=')[1].strip('"\'')
    return None

BACKEND_URL = get_backend_url()
if not BACKEND_URL:
    print(f"{Fore.RED}❌ ERROR: Could not find REACT_APP_BACKEND_URL in frontend/.env{Style.RESET_ALL}")
    sys.exit(1)

# Ensure the URL ends with /api for all backend requests
if not BACKEND_URL.endswith('/api'):
    API_URL = f"{BACKEND_URL}/api"
else:
    API_URL = BACKEND_URL

print(f"{Fore.CYAN}🔍 Testing CORS configuration at: {API_URL}{Style.RESET_ALL}")

def print_test_header(title):
    print(f"\n{Fore.CYAN}📋 {title}{Style.RESET_ALL}")
    print("=" * 60)

def print_test_result(test_name, success, details=None):
    status = f"{Fore.GREEN}✅ PASS" if success else f"{Fore.RED}❌ FAIL"
    print(f"{status} - {test_name}{Style.RESET_ALL}")
    if details:
        print(f"    {details}")

def test_cors_with_origin(origin):
    """Test if CORS is properly configured for a specific origin"""
    try:
        headers = {
            'Origin': origin,
        }
        response = requests.get(f"{API_URL}/health", headers=headers)
        
        # Check if the Access-Control-Allow-Origin header is present
        if 'Access-Control-Allow-Origin' in response.headers:
            allowed_origin = response.headers['Access-Control-Allow-Origin']
            if allowed_origin == origin:
                print_test_result(f"CORS for origin: {origin}", True, 
                                f"Access-Control-Allow-Origin: {allowed_origin}")
                return True
            else:
                print_test_result(f"CORS for origin: {origin}", False, 
                                f"Expected: {origin}, Got: {allowed_origin}")
                return False
        else:
            print_test_result(f"CORS for origin: {origin}", False, 
                            "CORS headers are missing in the response")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result(f"CORS for origin: {origin}", False, f"Request failed: {e}")
        return False

def test_cors_with_invalid_origin(origin):
    """Test if CORS is properly rejecting invalid origins"""
    try:
        headers = {
            'Origin': origin,
        }
        response = requests.get(f"{API_URL}/health", headers=headers)
        
        # For invalid origins, the Access-Control-Allow-Origin header should not match the requested origin
        if 'Access-Control-Allow-Origin' in response.headers:
            allowed_origin = response.headers['Access-Control-Allow-Origin']
            if allowed_origin != origin:
                print_test_result(f"CORS rejection for invalid origin: {origin}", True, 
                                f"Access-Control-Allow-Origin: {allowed_origin} (correctly not matching request)")
                return True
            else:
                print_test_result(f"CORS rejection for invalid origin: {origin}", False, 
                                f"Invalid origin {origin} was incorrectly allowed")
                return False
        else:
            # If no CORS header is returned, that's also a valid rejection
            print_test_result(f"CORS rejection for invalid origin: {origin}", True, 
                            "No CORS headers returned (correctly rejected)")
            return True
    except requests.exceptions.RequestException as e:
        print_test_result(f"CORS rejection for invalid origin: {origin}", False, f"Request failed: {e}")
        return False

def test_cors_preflight(origin):
    """Test CORS preflight requests with OPTIONS method"""
    try:
        headers = {
            'Origin': origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type, Authorization'
        }
        response = requests.options(f"{API_URL}/health", headers=headers)
        
        # Check if the preflight response contains the necessary headers
        cors_headers = [
            'Access-Control-Allow-Origin',
            'Access-Control-Allow-Methods',
            'Access-Control-Allow-Headers'
        ]
        
        missing_headers = [header for header in cors_headers if header not in response.headers]
        
        if not missing_headers:
            print_test_result(f"CORS preflight for origin: {origin}", True, 
                            f"All required CORS headers present")
            
            # Print the actual headers for verification
            for header in cors_headers:
                print(f"    {header}: {response.headers.get(header)}")
            
            return True
        else:
            print_test_result(f"CORS preflight for origin: {origin}", False, 
                            f"Missing CORS headers: {', '.join(missing_headers)}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result(f"CORS preflight for origin: {origin}", False, f"Request failed: {e}")
        return False

def test_all_cors_configurations():
    """Test all CORS configurations"""
    print_test_header("CORS Configuration Tests")
    
    # Valid origins that should be allowed
    valid_origins = [
        "https://vertex-target.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173"
    ]
    
    # Invalid origins that should be rejected
    invalid_origins = [
        "https://malicious-site.com",
        "http://localhost:8080",
        "https://example.com"
    ]
    
    # Test valid origins
    valid_results = []
    print(f"{Fore.CYAN}Testing valid origins that should be allowed:{Style.RESET_ALL}")
    for origin in valid_origins:
        result = test_cors_with_origin(origin)
        valid_results.append(result)
    
    # Test invalid origins
    invalid_results = []
    print(f"\n{Fore.CYAN}Testing invalid origins that should be rejected:{Style.RESET_ALL}")
    for origin in invalid_origins:
        result = test_cors_with_invalid_origin(origin)
        invalid_results.append(result)
    
    # Test preflight requests
    preflight_results = []
    print(f"\n{Fore.CYAN}Testing CORS preflight requests:{Style.RESET_ALL}")
    for origin in valid_origins:
        result = test_cors_preflight(origin)
        preflight_results.append(result)
    
    # Summary
    print_test_header("CORS Test Summary")
    
    valid_success = all(valid_results)
    invalid_success = all(invalid_results)
    preflight_success = all(preflight_results)
    
    print(f"Valid Origins Test: {Fore.GREEN if valid_success else Fore.RED}{valid_success}{Style.RESET_ALL}")
    print(f"Invalid Origins Test: {Fore.GREEN if invalid_success else Fore.RED}{invalid_success}{Style.RESET_ALL}")
    print(f"Preflight Requests Test: {Fore.GREEN if preflight_success else Fore.RED}{preflight_success}{Style.RESET_ALL}")
    
    overall_success = valid_success and invalid_success and preflight_success
    
    print(f"\n{Fore.CYAN}Overall CORS Configuration: {Fore.GREEN if overall_success else Fore.RED}{overall_success}{Style.RESET_ALL}")
    
    if overall_success:
        print(f"\n{Fore.GREEN}✅ CORS is correctly configured with the following allowed origins:{Style.RESET_ALL}")
        for origin in valid_origins:
            print(f"  - {origin}")
    else:
        print(f"\n{Fore.RED}❌ CORS configuration has issues. Please check the detailed test results above.{Style.RESET_ALL}")
    
    return overall_success

if __name__ == "__main__":
    test_all_cors_configurations()