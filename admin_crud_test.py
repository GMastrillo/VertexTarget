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

print(f"🔍 Testing admin CRUD operations at: {API_URL}")

# Global variables to store test data
auth_token = None
test_portfolio_id = None
test_testimonial_id = None

# Test helper functions
def print_test_header(title):
    print(f"\n📋 {title}")
    print("=" * 80)

def print_test_result(test_name, success, details=None):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} - {test_name}")
    if details:
        print(f"    {details}")

def login_admin():
    """Login with admin credentials and get JWT token"""
    global auth_token
    
    print_test_header("Admin Login")
    
    try:
        payload = {
            "email": "admin@vertextarget.com",
            "password": "VT@admin2025!"
        }
        print(f"Logging in with admin credentials: {payload['email']} / {payload['password']}")
        
        response = requests.post(f"{API_URL}/auth/login", json=payload)
        
        if response.status_code == 200:
            data = response.json()
            if 'access_token' in data and 'token_type' in data:
                auth_token = data['access_token']
                print_test_result("Admin login", True, "Successfully logged in and received JWT token")
                
                # Decode and print token information
                try:
                    import base64
                    import json
                    
                    # Fix padding for base64 decoding
                    def fix_padding(encoded):
                        padding = 4 - (len(encoded) % 4)
                        if padding < 4:
                            return encoded + ("=" * padding)
                        return encoded
                    
                    token_parts = auth_token.split('.')
                    if len(token_parts) == 3:
                        payload_part = token_parts[1]
                        padded_payload = fix_padding(payload_part)
                        decoded_bytes = base64.b64decode(padded_payload)
                        decoded_payload = json.loads(decoded_bytes)
                        
                        print_test_result("JWT token payload", True, f"Decoded payload: {decoded_payload}")
                        
                        # Check token expiration
                        if 'exp' in decoded_payload:
                            exp_timestamp = decoded_payload['exp']
                            exp_datetime = datetime.fromtimestamp(exp_timestamp)
                            now = datetime.now()
                            time_left = exp_datetime - now
                            print_test_result("Token expiration", True, 
                                             f"Token expires at {exp_datetime} ({time_left.total_seconds()/3600:.1f} hours from now)")
                    else:
                        print_test_result("JWT token structure", False, "Invalid token format")
                except Exception as e:
                    print_test_result("JWT token decoding", False, f"Failed to decode token: {e}")
                
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

def test_portfolio_crud():
    """Test CRUD operations for portfolio with authentication"""
    global auth_token, test_portfolio_id
    
    if not auth_token:
        print_test_result("Portfolio CRUD", False, "No auth token available, login test must have failed")
        return False
    
    print_test_header("Portfolio CRUD Operations Test")
    
    try:
        headers = {
            "Authorization": f"Bearer {auth_token}"
        }
        
        # 1. CREATE: Create a new portfolio item
        create_payload = {
            "title": "Admin Test Portfolio Item",
            "category": "Admin Test",
            "image": "https://example.com/admin-test.jpg",
            "metric": "Admin Test Metric +150%",
            "description": "This is a test portfolio item created by admin CRUD tests",
            "technologies": ["Python", "FastAPI", "Admin Testing"],
            "results": {"metric1": "+150%", "metric2": "+250%"},
            "challenge": "Testing admin access to CRUD operations",
            "solution": "Created focused test suite for admin functionality",
            "outcome": "All admin tests passing successfully"
        }
        
        print("Creating portfolio item...")
        create_response = requests.post(f"{API_URL}/portfolio", json=create_payload, headers=headers)
        
        if create_response.status_code == 200:
            create_data = create_response.json()
            test_portfolio_id = create_data.get('id')
            print_test_result("CREATE portfolio item", True, f"Successfully created portfolio item with ID: {test_portfolio_id}")
            
            # 2. READ: Get the created item
            print("Reading portfolio items...")
            get_response = requests.get(f"{API_URL}/portfolio")
            
            if get_response.status_code == 200:
                get_data = get_response.json()
                found = False
                for item in get_data:
                    if item.get('id') == test_portfolio_id:
                        found = True
                        break
                
                if found:
                    print_test_result("READ portfolio item", True, "Successfully retrieved created portfolio item")
                else:
                    print_test_result("READ portfolio item", False, "Created item not found in portfolio list")
            else:
                print_test_result("READ portfolio item", False, f"Failed to get portfolio items: {get_response.status_code}")
            
            # 3. UPDATE: Update the created item
            update_payload = {
                "title": "Updated Admin Test Portfolio Item",
                "description": "This portfolio item has been updated by admin CRUD tests"
            }
            
            print("Updating portfolio item...")
            update_response = requests.put(f"{API_URL}/portfolio/{test_portfolio_id}", json=update_payload, headers=headers)
            
            if update_response.status_code == 200:
                update_data = update_response.json()
                if update_data.get('title') == update_payload['title'] and update_data.get('description') == update_payload['description']:
                    print_test_result("UPDATE portfolio item", True, f"Successfully updated portfolio item")
                else:
                    print_test_result("UPDATE portfolio item", False, "Update didn't apply correctly")
            else:
                print_test_result("UPDATE portfolio item", False, f"Failed to update portfolio item: {update_response.status_code}")
            
            # 4. DELETE: Delete the created item
            print("Deleting portfolio item...")
            delete_response = requests.delete(f"{API_URL}/portfolio/{test_portfolio_id}", headers=headers)
            
            if delete_response.status_code == 200:
                print_test_result("DELETE portfolio item", True, f"Successfully deleted portfolio item")
                
                # Verify deletion
                verify_response = requests.get(f"{API_URL}/portfolio")
                if verify_response.status_code == 200:
                    verify_data = verify_response.json()
                    still_exists = False
                    for item in verify_data:
                        if item.get('id') == test_portfolio_id:
                            still_exists = True
                            break
                    
                    if not still_exists:
                        print_test_result("DELETE verification", True, "Item successfully removed from database")
                    else:
                        print_test_result("DELETE verification", False, "Item still exists after deletion")
                else:
                    print_test_result("DELETE verification", False, f"Failed to verify deletion: {verify_response.status_code}")
            else:
                print_test_result("DELETE portfolio item", False, f"Failed to delete portfolio item: {delete_response.status_code}")
            
            return True
        else:
            print_test_result("CREATE portfolio item", False, f"Failed to create portfolio item: {create_response.status_code}, {create_response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("Portfolio CRUD", False, f"Request failed: {e}")
        return False

def test_testimonials_crud():
    """Test CRUD operations for testimonials with authentication"""
    global auth_token, test_testimonial_id
    
    if not auth_token:
        print_test_result("Testimonials CRUD", False, "No auth token available, login test must have failed")
        return False
    
    print_test_header("Testimonials CRUD Operations Test")
    
    try:
        headers = {
            "Authorization": f"Bearer {auth_token}"
        }
        
        # 1. CREATE: Create a new testimonial
        create_payload = {
            "name": "Admin Test Client",
            "position": "Admin Test Position",
            "company": "Admin Test Company",
            "avatar": "https://example.com/admin-avatar.jpg",
            "quote": "This is a test testimonial created by admin CRUD tests. The service was excellent!",
            "rating": 5,
            "project": "Admin Test Project"
        }
        
        print("Creating testimonial...")
        create_response = requests.post(f"{API_URL}/testimonials", json=create_payload, headers=headers)
        
        if create_response.status_code == 200:
            create_data = create_response.json()
            test_testimonial_id = create_data.get('id')
            print_test_result("CREATE testimonial", True, f"Successfully created testimonial with ID: {test_testimonial_id}")
            
            # 2. READ: Get the created item
            print("Reading testimonials...")
            get_response = requests.get(f"{API_URL}/testimonials")
            
            if get_response.status_code == 200:
                get_data = get_response.json()
                found = False
                for item in get_data:
                    if item.get('id') == test_testimonial_id:
                        found = True
                        break
                
                if found:
                    print_test_result("READ testimonial", True, "Successfully retrieved created testimonial")
                else:
                    print_test_result("READ testimonial", False, "Created item not found in testimonials list")
            else:
                print_test_result("READ testimonial", False, f"Failed to get testimonials: {get_response.status_code}")
            
            # 3. UPDATE: Update the created item
            update_payload = {
                "quote": "This testimonial has been updated by admin CRUD tests. The service was outstanding!",
                "rating": 5
            }
            
            print("Updating testimonial...")
            update_response = requests.put(f"{API_URL}/testimonials/{test_testimonial_id}", json=update_payload, headers=headers)
            
            if update_response.status_code == 200:
                update_data = update_response.json()
                if update_data.get('quote') == update_payload['quote'] and update_data.get('rating') == update_payload['rating']:
                    print_test_result("UPDATE testimonial", True, f"Successfully updated testimonial")
                else:
                    print_test_result("UPDATE testimonial", False, "Update didn't apply correctly")
            else:
                print_test_result("UPDATE testimonial", False, f"Failed to update testimonial: {update_response.status_code}")
            
            # 4. DELETE: Delete the created item
            print("Deleting testimonial...")
            delete_response = requests.delete(f"{API_URL}/testimonials/{test_testimonial_id}", headers=headers)
            
            if delete_response.status_code == 200:
                print_test_result("DELETE testimonial", True, f"Successfully deleted testimonial")
                
                # Verify deletion
                verify_response = requests.get(f"{API_URL}/testimonials")
                if verify_response.status_code == 200:
                    verify_data = verify_response.json()
                    still_exists = False
                    for item in verify_data:
                        if item.get('id') == test_testimonial_id:
                            still_exists = True
                            break
                    
                    if not still_exists:
                        print_test_result("DELETE verification", True, "Item successfully removed from database")
                    else:
                        print_test_result("DELETE verification", False, "Item still exists after deletion")
                else:
                    print_test_result("DELETE verification", False, f"Failed to verify deletion: {verify_response.status_code}")
            else:
                print_test_result("DELETE testimonial", False, f"Failed to delete testimonial: {delete_response.status_code}")
            
            return True
        else:
            print_test_result("CREATE testimonial", False, f"Failed to create testimonial: {create_response.status_code}, {create_response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("Testimonials CRUD", False, f"Request failed: {e}")
        return False

def test_verify_sample_data():
    """Verify that sample data exists in the database"""
    print_test_header("Sample Data Verification Test")
    
    # Check portfolio data
    try:
        portfolio_response = requests.get(f"{API_URL}/portfolio")
        
        if portfolio_response.status_code == 200:
            portfolio_data = portfolio_response.json()
            if isinstance(portfolio_data, list) and len(portfolio_data) >= 4:
                print_test_result("Portfolio sample data", True, f"Found {len(portfolio_data)} portfolio items")
                
                # Print some details about the portfolio items
                print("\nPortfolio Items:")
                for i, item in enumerate(portfolio_data[:3]):  # Show first 3 items
                    print(f"  {i+1}. {item.get('title')} - {item.get('category')}")
                if len(portfolio_data) > 3:
                    print(f"  ... and {len(portfolio_data) - 3} more items")
            else:
                print_test_result("Portfolio sample data", False, 
                                 f"Expected at least 4 items but got: {len(portfolio_data) if isinstance(portfolio_data, list) else 'not a list'}")
        else:
            print_test_result("Portfolio sample data", False, 
                             f"Status code: {portfolio_response.status_code}, Response: {portfolio_response.text}")
    except requests.exceptions.RequestException as e:
        print_test_result("Portfolio sample data", False, f"Request failed: {e}")
    
    # Check testimonials data
    try:
        testimonials_response = requests.get(f"{API_URL}/testimonials")
        
        if testimonials_response.status_code == 200:
            testimonials_data = testimonials_response.json()
            if isinstance(testimonials_data, list) and len(testimonials_data) >= 3:
                print_test_result("Testimonials sample data", True, f"Found {len(testimonials_data)} testimonials")
                
                # Print some details about the testimonials
                print("\nTestimonials:")
                for i, item in enumerate(testimonials_data[:3]):  # Show first 3 items
                    print(f"  {i+1}. {item.get('name')} from {item.get('company')} - Rating: {item.get('rating')}/5")
                if len(testimonials_data) > 3:
                    print(f"  ... and {len(testimonials_data) - 3} more testimonials")
            else:
                print_test_result("Testimonials sample data", False, 
                                 f"Expected at least 3 items but got: {len(testimonials_data) if isinstance(testimonials_data, list) else 'not a list'}")
        else:
            print_test_result("Testimonials sample data", False, 
                             f"Status code: {testimonials_response.status_code}, Response: {testimonials_response.text}")
    except requests.exceptions.RequestException as e:
        print_test_result("Testimonials sample data", False, f"Request failed: {e}")

def run_admin_crud_tests():
    """Run all admin CRUD tests"""
    print("\n🔍 STARTING ADMIN CRUD OPERATIONS TESTS\n" + "="*80)
    
    # Login first
    login_success = login_admin()
    
    # If login fails, no point in continuing
    if not login_success:
        print("\n❌ CRITICAL ERROR: Admin login failed. Aborting further tests.")
        return False
    
    # Test CRUD operations
    portfolio_crud_success = test_portfolio_crud()
    testimonials_crud_success = test_testimonials_crud()
    
    # Verify sample data
    test_verify_sample_data()
    
    # Summary
    print("\n" + "="*80)
    print("📊 ADMIN CRUD TEST SUMMARY:")
    
    print(f"  Admin Login: {'✅ PASS' if login_success else '❌ FAIL'}")
    print(f"  Portfolio CRUD Operations: {'✅ PASS' if portfolio_crud_success else '❌ FAIL'}")
    print(f"  Testimonials CRUD Operations: {'✅ PASS' if testimonials_crud_success else '❌ FAIL'}")
    
    overall_success = login_success and portfolio_crud_success and testimonials_crud_success
    
    print(f"\n🏁 Overall Admin CRUD Functionality: {'✅ PASS' if overall_success else '❌ FAIL'}")
    print("\n" + "="*80)
    
    return overall_success

if __name__ == "__main__":
    run_admin_crud_tests()