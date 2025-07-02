#!/usr/bin/env python3
import requests
import json
import os
import sys
import time
import uuid
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

print(f"🔍 Testing CMS Admin API at: {API_URL}")

# Global variables to store test data
auth_token = None
test_portfolio_id = None
test_testimonial_id = None

# Test helper functions
def print_test_header(title):
    print(f"\n📋 {title}")
    print("=" * 50)

def print_test_result(test_name, success, details=None):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} - {test_name}")
    if details:
        print(f"    {details}")

# Authentication tests
def test_login_with_admin():
    """Test login with admin credentials"""
    global auth_token
    try:
        print("Attempting login with admin credentials...")
        payload = {
            "email": "admin@vertextarget.com",
            "password": "VT@admin2025!"
        }
        response = requests.post(f"{API_URL}/auth/login", json=payload)
        
        print(f"Login response status code: {response.status_code}")
        print(f"Login response body: {response.text}")
        
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

# Portfolio tests
def test_get_portfolio():
    """Test getting all portfolio items"""
    try:
        response = requests.get(f"{API_URL}/portfolio")
        
        print(f"GET /portfolio response status code: {response.status_code}")
        print(f"GET /portfolio response body: {response.text[:200]}...")  # Show first 200 chars
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_test_result("GET /portfolio", True, f"Retrieved {len(data)} portfolio items")
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

def test_create_portfolio_item():
    """Test creating a portfolio item"""
    global auth_token, test_portfolio_id
    
    if not auth_token:
        print_test_result("CREATE portfolio item", False, "No auth token available")
        return False
    
    try:
        headers = {
            "Authorization": f"Bearer {auth_token}"
        }
        payload = {
            "title": "Test CMS Portfolio Item",
            "category": "Test Category",
            "image": "https://example.com/test.jpg",
            "metric": "Test Metric +100%",
            "description": "This is a test portfolio item created by CMS admin tests",
            "technologies": ["Python", "FastAPI", "Testing"],
            "results": {"metric1": "+100%", "metric2": "+200%"},
            "challenge": "Testing the CMS admin API endpoints thoroughly",
            "solution": "Created comprehensive test suite",
            "outcome": "All tests passing successfully"
        }
        
        print("Creating portfolio item with payload:", json.dumps(payload, indent=2))
        response = requests.post(f"{API_URL}/portfolio", json=payload, headers=headers)
        
        print(f"CREATE portfolio response status code: {response.status_code}")
        print(f"CREATE portfolio response body: {response.text[:200]}...")  # Show first 200 chars
        
        if response.status_code == 200:
            data = response.json()
            test_portfolio_id = data.get('id')
            print_test_result("CREATE portfolio item", True, 
                             f"Successfully created portfolio item with ID: {test_portfolio_id}")
            return True
        else:
            print_test_result("CREATE portfolio item", False, 
                             f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("CREATE portfolio item", False, f"Request failed: {e}")
        return False

def test_update_portfolio_item():
    """Test updating a portfolio item"""
    global auth_token, test_portfolio_id
    
    if not auth_token or not test_portfolio_id:
        print_test_result("UPDATE portfolio item", False, "No auth token or portfolio ID available")
        return False
    
    try:
        headers = {
            "Authorization": f"Bearer {auth_token}"
        }
        payload = {
            "title": "Updated CMS Test Portfolio Item",
            "description": "This portfolio item has been updated by CMS admin tests"
        }
        
        print(f"Updating portfolio item {test_portfolio_id} with payload:", json.dumps(payload, indent=2))
        response = requests.put(f"{API_URL}/portfolio/{test_portfolio_id}", json=payload, headers=headers)
        
        print(f"UPDATE portfolio response status code: {response.status_code}")
        print(f"UPDATE portfolio response body: {response.text[:200]}...")  # Show first 200 chars
        
        if response.status_code == 200:
            data = response.json()
            if data.get('title') == payload['title'] and data.get('description') == payload['description']:
                print_test_result("UPDATE portfolio item", True, f"Successfully updated portfolio item {test_portfolio_id}")
                return True
            else:
                print_test_result("UPDATE portfolio item", False, "Update didn't apply correctly")
                return False
        else:
            print_test_result("UPDATE portfolio item", False, 
                             f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("UPDATE portfolio item", False, f"Request failed: {e}")
        return False

def test_delete_portfolio_item():
    """Test deleting a portfolio item"""
    global auth_token, test_portfolio_id
    
    if not auth_token or not test_portfolio_id:
        print_test_result("DELETE portfolio item", False, "No auth token or portfolio ID available")
        return False
    
    try:
        headers = {
            "Authorization": f"Bearer {auth_token}"
        }
        
        print(f"Deleting portfolio item {test_portfolio_id}")
        response = requests.delete(f"{API_URL}/portfolio/{test_portfolio_id}", headers=headers)
        
        print(f"DELETE portfolio response status code: {response.status_code}")
        print(f"DELETE portfolio response body: {response.text[:200]}...")  # Show first 200 chars
        
        if response.status_code == 200:
            print_test_result("DELETE portfolio item", True, f"Successfully deleted portfolio item {test_portfolio_id}")
            
            # Verify it's actually deleted
            verify_response = requests.get(f"{API_URL}/portfolio")
            if verify_response.status_code == 200:
                items = verify_response.json()
                for item in items:
                    if item.get('id') == test_portfolio_id:
                        print_test_result("DELETE verification", False, "Item still exists after deletion")
                        return False
                print_test_result("DELETE verification", True, "Item no longer exists in portfolio list")
                return True
            else:
                print_test_result("DELETE verification", False, "Failed to verify deletion")
                return False
        else:
            print_test_result("DELETE portfolio item", False, 
                             f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("DELETE portfolio item", False, f"Request failed: {e}")
        return False

# Testimonial tests
def test_get_testimonials():
    """Test getting all testimonials"""
    try:
        response = requests.get(f"{API_URL}/testimonials")
        
        print(f"GET /testimonials response status code: {response.status_code}")
        print(f"GET /testimonials response body: {response.text[:200]}...")  # Show first 200 chars
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_test_result("GET /testimonials", True, f"Retrieved {len(data)} testimonials")
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

def test_create_testimonial():
    """Test creating a testimonial"""
    global auth_token, test_testimonial_id
    
    if not auth_token:
        print_test_result("CREATE testimonial", False, "No auth token available")
        return False
    
    try:
        headers = {
            "Authorization": f"Bearer {auth_token}"
        }
        payload = {
            "name": "Test CMS Client",
            "position": "Test Position",
            "company": "Test Company",
            "avatar": "https://example.com/avatar.jpg",
            "quote": "This is a test testimonial created by CMS admin tests. The service was excellent!",
            "rating": 5,
            "project": "Test Project"
        }
        
        print("Creating testimonial with payload:", json.dumps(payload, indent=2))
        response = requests.post(f"{API_URL}/testimonials", json=payload, headers=headers)
        
        print(f"CREATE testimonial response status code: {response.status_code}")
        print(f"CREATE testimonial response body: {response.text[:200]}...")  # Show first 200 chars
        
        if response.status_code == 200:
            data = response.json()
            test_testimonial_id = data.get('id')
            print_test_result("CREATE testimonial", True, f"Successfully created testimonial with ID: {test_testimonial_id}")
            return True
        else:
            print_test_result("CREATE testimonial", False, 
                             f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("CREATE testimonial", False, f"Request failed: {e}")
        return False

def test_update_testimonial():
    """Test updating a testimonial"""
    global auth_token, test_testimonial_id
    
    if not auth_token or not test_testimonial_id:
        print_test_result("UPDATE testimonial", False, "No auth token or testimonial ID available")
        return False
    
    try:
        headers = {
            "Authorization": f"Bearer {auth_token}"
        }
        payload = {
            "quote": "This testimonial has been updated by CMS admin tests. The service was outstanding!",
            "rating": 5
        }
        
        print(f"Updating testimonial {test_testimonial_id} with payload:", json.dumps(payload, indent=2))
        response = requests.put(f"{API_URL}/testimonials/{test_testimonial_id}", json=payload, headers=headers)
        
        print(f"UPDATE testimonial response status code: {response.status_code}")
        print(f"UPDATE testimonial response body: {response.text[:200]}...")  # Show first 200 chars
        
        if response.status_code == 200:
            data = response.json()
            if data.get('quote') == payload['quote'] and data.get('rating') == payload['rating']:
                print_test_result("UPDATE testimonial", True, f"Successfully updated testimonial {test_testimonial_id}")
                return True
            else:
                print_test_result("UPDATE testimonial", False, "Update didn't apply correctly")
                return False
        else:
            print_test_result("UPDATE testimonial", False, 
                             f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("UPDATE testimonial", False, f"Request failed: {e}")
        return False

def test_delete_testimonial():
    """Test deleting a testimonial"""
    global auth_token, test_testimonial_id
    
    if not auth_token or not test_testimonial_id:
        print_test_result("DELETE testimonial", False, "No auth token or testimonial ID available")
        return False
    
    try:
        headers = {
            "Authorization": f"Bearer {auth_token}"
        }
        
        print(f"Deleting testimonial {test_testimonial_id}")
        response = requests.delete(f"{API_URL}/testimonials/{test_testimonial_id}", headers=headers)
        
        print(f"DELETE testimonial response status code: {response.status_code}")
        print(f"DELETE testimonial response body: {response.text[:200]}...")  # Show first 200 chars
        
        if response.status_code == 200:
            print_test_result("DELETE testimonial", True, f"Successfully deleted testimonial {test_testimonial_id}")
            
            # Verify it's actually deleted
            verify_response = requests.get(f"{API_URL}/testimonials")
            if verify_response.status_code == 200:
                items = verify_response.json()
                for item in items:
                    if item.get('id') == test_testimonial_id:
                        print_test_result("DELETE verification", False, "Testimonial still exists after deletion")
                        return False
                print_test_result("DELETE verification", True, "Testimonial no longer exists in list")
                return True
            else:
                print_test_result("DELETE verification", False, "Failed to verify deletion")
                return False
        else:
            print_test_result("DELETE testimonial", False, 
                             f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("DELETE testimonial", False, f"Request failed: {e}")
        return False

# JWT Protection tests
def test_protected_endpoints_without_token():
    """Test accessing protected endpoints without a token"""
    protected_endpoints = [
        {"method": "post", "url": f"{API_URL}/portfolio", "payload": {"title": "Test", "category": "Test"}},
        {"method": "post", "url": f"{API_URL}/testimonials", "payload": {"name": "Test", "quote": "Test"}},
        {"method": "get", "url": f"{API_URL}/contact"}
    ]
    
    all_passed = True
    for endpoint in protected_endpoints:
        try:
            if endpoint["method"] == "post":
                response = requests.post(endpoint["url"], json=endpoint["payload"])
            elif endpoint["method"] == "get":
                response = requests.get(endpoint["url"])
            
            if response.status_code == 401 or response.status_code == 403:
                print_test_result(f"Protected endpoint {endpoint['url']} without token", True, 
                                 f"Correctly rejected unauthenticated request with status {response.status_code}")
            else:
                print_test_result(f"Protected endpoint {endpoint['url']} without token", False, 
                                 f"Expected 401/403 but got: {response.status_code}, {response.text}")
                all_passed = False
                    
        except requests.exceptions.RequestException as e:
            print_test_result(f"Protected endpoint {endpoint['url']} without token", False, f"Request failed: {e}")
            all_passed = False
    
    return all_passed

def run_cms_admin_tests():
    """Run all CMS admin tests and return overall status"""
    print("\n🔍 STARTING CMS ADMIN TESTS\n" + "="*50)
    
    # Authentication tests
    print_test_header("Authentication Tests")
    login_status = test_login_with_admin()
    
    # If login fails, no point in continuing with protected endpoint tests
    if not login_status:
        print("\n❌ CRITICAL ERROR: Admin login failed. Aborting further tests.")
        return False
    
    # JWT Protection tests
    print_test_header("JWT Protection Tests")
    protected_endpoints_status = test_protected_endpoints_without_token()
    
    # Portfolio tests
    print_test_header("Portfolio Endpoint Tests")
    get_portfolio_status = test_get_portfolio()
    create_portfolio_status = test_create_portfolio_item()
    update_portfolio_status = test_update_portfolio_item()
    delete_portfolio_status = test_delete_portfolio_item()
    
    # Testimonial tests
    print_test_header("Testimonial Endpoint Tests")
    get_testimonials_status = test_get_testimonials()
    create_testimonial_status = test_create_testimonial()
    update_testimonial_status = test_update_testimonial()
    delete_testimonial_status = test_delete_testimonial()
    
    # Summary
    print("\n" + "="*50)
    print("📊 CMS ADMIN TEST SUMMARY:")
    
    # Authentication tests
    print("\nAuthentication Tests:")
    print(f"  Admin Login: {'✅ PASS' if login_status else '❌ FAIL'}")
    
    # JWT Protection tests
    print("\nJWT Protection Tests:")
    print(f"  Protected Endpoints Without Token: {'✅ PASS' if protected_endpoints_status else '❌ FAIL'}")
    
    # Portfolio tests
    print("\nPortfolio Endpoint Tests:")
    print(f"  GET /portfolio: {'✅ PASS' if get_portfolio_status else '❌ FAIL'}")
    print(f"  CREATE Portfolio Item: {'✅ PASS' if create_portfolio_status else '❌ FAIL'}")
    print(f"  UPDATE Portfolio Item: {'✅ PASS' if update_portfolio_status else '❌ FAIL'}")
    print(f"  DELETE Portfolio Item: {'✅ PASS' if delete_portfolio_status else '❌ FAIL'}")
    
    # Testimonial tests
    print("\nTestimonial Endpoint Tests:")
    print(f"  GET /testimonials: {'✅ PASS' if get_testimonials_status else '❌ FAIL'}")
    print(f"  CREATE Testimonial: {'✅ PASS' if create_testimonial_status else '❌ FAIL'}")
    print(f"  UPDATE Testimonial: {'✅ PASS' if update_testimonial_status else '❌ FAIL'}")
    print(f"  DELETE Testimonial: {'✅ PASS' if delete_testimonial_status else '❌ FAIL'}")
    
    # Overall status
    portfolio_tests = get_portfolio_status and create_portfolio_status and update_portfolio_status and delete_portfolio_status
    testimonial_tests = get_testimonials_status and create_testimonial_status and update_testimonial_status and delete_testimonial_status
    
    print("\n" + "="*50)
    print("🎯 FEATURE TEST RESULTS:")
    print(f"  Authentication System: {'✅ PASS' if login_status else '❌ FAIL'}")
    print(f"  JWT Protection: {'✅ PASS' if protected_endpoints_status else '❌ FAIL'}")
    print(f"  Portfolio Endpoints: {'✅ PASS' if portfolio_tests else '❌ FAIL'}")
    print(f"  Testimonial Endpoints: {'✅ PASS' if testimonial_tests else '❌ FAIL'}")
    
    overall_status = login_status and protected_endpoints_status and portfolio_tests and testimonial_tests
    
    print(f"\n🏁 Overall CMS Admin Status: {'✅ PASS' if overall_status else '❌ FAIL'}")
    print("\n" + "="*50)
    
    return overall_status

if __name__ == "__main__":
    run_cms_admin_tests()