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

print(f"🔍 Testing database data at: {API_URL}")

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

def test_portfolio_data():
    """Test if portfolio data exists and has the expected structure"""
    try:
        print(f"Checking portfolio data...")
        
        response = requests.get(f"{API_URL}/portfolio")
        
        print(f"Response status code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            if isinstance(data, list):
                print(f"Found {len(data)} portfolio items")
                
                if len(data) >= 4:  # We expect at least 4 seeded items
                    # Check if the data has the expected structure
                    required_fields = ['id', 'title', 'category', 'image', 'description', 'technologies', 'results']
                    
                    # Check the first item for required fields
                    first_item = data[0]
                    missing_fields = [field for field in required_fields if field not in first_item]
                    
                    if not missing_fields:
                        print_test_result("Portfolio data", True, 
                                         f"Found {len(data)} portfolio items with all required fields")
                        
                        # Print a sample of the data
                        print(f"Sample portfolio item: {json.dumps(first_item, indent=2)}")
                        
                        return True
                    else:
                        print_test_result("Portfolio data", False, 
                                         f"Missing required fields: {missing_fields}")
                        return False
                else:
                    print_test_result("Portfolio data", False, 
                                     f"Expected at least 4 items but found {len(data)}")
                    return False
            else:
                print_test_result("Portfolio data", False, "Response is not a list")
                return False
        else:
            print_test_result("Portfolio data", False, 
                             f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        print_test_result("Portfolio data", False, f"Request failed: {e}")
        return False

def test_testimonials_data():
    """Test if testimonials data exists and has the expected structure"""
    try:
        print(f"Checking testimonials data...")
        
        response = requests.get(f"{API_URL}/testimonials")
        
        print(f"Response status code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            if isinstance(data, list):
                print(f"Found {len(data)} testimonials")
                
                if len(data) >= 3:  # We expect at least 3 seeded items
                    # Check if the data has the expected structure
                    required_fields = ['id', 'name', 'position', 'company', 'avatar', 'quote', 'rating']
                    
                    # Check the first item for required fields
                    first_item = data[0]
                    missing_fields = [field for field in required_fields if field not in first_item]
                    
                    if not missing_fields:
                        print_test_result("Testimonials data", True, 
                                         f"Found {len(data)} testimonials with all required fields")
                        
                        # Print a sample of the data
                        print(f"Sample testimonial: {json.dumps(first_item, indent=2)}")
                        
                        return True
                    else:
                        print_test_result("Testimonials data", False, 
                                         f"Missing required fields: {missing_fields}")
                        return False
                else:
                    print_test_result("Testimonials data", False, 
                                     f"Expected at least 3 items but found {len(data)}")
                    return False
            else:
                print_test_result("Testimonials data", False, "Response is not a list")
                return False
        else:
            print_test_result("Testimonials data", False, 
                             f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        print_test_result("Testimonials data", False, f"Request failed: {e}")
        return False

def test_admin_user():
    """Test if the admin user exists and can be authenticated"""
    try:
        print(f"Checking admin user...")
        
        payload = {
            "email": "admin@vertextarget.com",
            "password": "VT@admin2025!"
        }
        
        response = requests.post(f"{API_URL}/auth/login", json=payload)
        
        print(f"Response status code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            if 'access_token' in data and 'token_type' in data:
                print_test_result("Admin user", True, "Admin user exists and can be authenticated")
                return True
            else:
                print_test_result("Admin user", False, "Response missing token data")
                return False
        else:
            print_test_result("Admin user", False, 
                             f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        print_test_result("Admin user", False, f"Request failed: {e}")
        return False

def run_database_tests():
    """Run all database data tests"""
    print_test_header("Database Data Tests")
    
    # Test portfolio data
    portfolio_test = test_portfolio_data()
    
    # Test testimonials data
    testimonials_test = test_testimonials_data()
    
    # Test admin user
    admin_test = test_admin_user()
    
    # Summary
    print("\n" + "="*50)
    print("📊 DATABASE DATA TEST SUMMARY:")
    print(f"  Portfolio Data: {'✅ PASS' if portfolio_test else '❌ FAIL'}")
    print(f"  Testimonials Data: {'✅ PASS' if testimonials_test else '❌ FAIL'}")
    print(f"  Admin User: {'✅ PASS' if admin_test else '❌ FAIL'}")
    
    overall_status = portfolio_test and testimonials_test and admin_test
    print(f"\n🏁 Overall Database Data Status: {'✅ PASS' if overall_status else '❌ FAIL'}")
    print("\n" + "="*50)
    
    return overall_status

if __name__ == "__main__":
    run_database_tests()