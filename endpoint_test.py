#!/usr/bin/env python3
import requests
import json
import os
import sys
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

print(f"🔍 Testing backend endpoints at: {API_URL}")

# Test helper functions
def print_test_header(title):
    print(f"\n📋 {title}")
    print("=" * 50)

def print_test_result(test_name, success, details=None):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} - {test_name}")
    if details:
        print(f"    {details}")

# Test GET /api/portfolio
def test_get_portfolio():
    print_test_header("Testing GET /api/portfolio")
    try:
        response = requests.get(f"{API_URL}/portfolio")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                if len(data) >= 4:  # Should have at least 4 seeded items
                    print_test_result("GET /portfolio", True, f"Retrieved {len(data)} portfolio items")
                    
                    # Print some details about the first few items
                    for i, item in enumerate(data[:3]):  # Show first 3 items
                        print(f"    Item {i+1}: {item.get('title')} - {item.get('category')}")
                    
                    if len(data) > 3:
                        print(f"    ... and {len(data) - 3} more items")
                    
                    return True
                else:
                    print_test_result("GET /portfolio", False, 
                                     f"Expected at least 4 items but got only {len(data)}")
                    return False
            else:
                print_test_result("GET /portfolio", False, "Response is not a list")
                return False
        else:
            print_test_result("GET /portfolio", False, 
                             f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("GET /portfolio", False, f"Request failed: {e}")
        return False

# Test GET /api/testimonials
def test_get_testimonials():
    print_test_header("Testing GET /api/testimonials")
    try:
        response = requests.get(f"{API_URL}/testimonials")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                if len(data) >= 3:  # Should have at least 3 seeded items
                    print_test_result("GET /testimonials", True, f"Retrieved {len(data)} testimonials")
                    
                    # Print some details about the testimonials
                    for i, item in enumerate(data[:3]):  # Show first 3 items
                        print(f"    Testimonial {i+1}: {item.get('name')} from {item.get('company')} - Rating: {item.get('rating')}/5")
                    
                    if len(data) > 3:
                        print(f"    ... and {len(data) - 3} more testimonials")
                    
                    return True
                else:
                    print_test_result("GET /testimonials", False, 
                                     f"Expected at least 3 items but got only {len(data)}")
                    return False
            else:
                print_test_result("GET /testimonials", False, "Response is not a list")
                return False
        else:
            print_test_result("GET /testimonials", False, 
                             f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("GET /testimonials", False, f"Request failed: {e}")
        return False

# Test POST /api/contact
def test_contact_submission():
    print_test_header("Testing POST /api/contact")
    try:
        # Using the provided test data
        payload = {
            "name": "João Silva",
            "email": "joao.silva@email.com", 
            "message": "Olá, gostaria de saber mais sobre os serviços de marketing digital.",
            "phone": "(11) 99999-9999",
            "company": "Empresa ABC",
            "service_interest": ["Marketing Digital", "SEO"]
        }
        
        print("Sending contact form with data:")
        for key, value in payload.items():
            print(f"    {key}: {value}")
        
        response = requests.post(f"{API_URL}/contact", json=payload)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('name') == payload['name'] and data.get('email') == payload['email']:
                print_test_result("Contact form submission", True, "Successfully submitted contact form")
                print(f"    Response ID: {data.get('id')}")
                print(f"    Submission timestamp: {data.get('created_at')}")
                return True
            else:
                print_test_result("Contact form submission", False, "Response data doesn't match submitted data")
                return False
        else:
            print_test_result("Contact form submission", False, 
                             f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("Contact form submission", False, f"Request failed: {e}")
        return False

# Test contact form validation
def test_contact_validation():
    print_test_header("Testing Contact Form Validation")
    
    # Test with invalid email
    try:
        payload = {
            "name": "João Silva",
            "email": "invalid-email", 
            "message": "Olá, gostaria de saber mais sobre os serviços de marketing digital."
        }
        
        response = requests.post(f"{API_URL}/contact", json=payload)
        
        if response.status_code == 422:  # Validation error expected
            print_test_result("Invalid email validation", True, "Correctly rejected invalid email format")
        else:
            print_test_result("Invalid email validation", False, 
                             f"Expected 422 but got: {response.status_code}, {response.text}")
    except requests.exceptions.RequestException as e:
        print_test_result("Invalid email validation", False, f"Request failed: {e}")
    
    # Test with missing required field (message)
    try:
        payload = {
            "name": "João Silva",
            "email": "joao.silva@email.com"
            # Missing message field
        }
        
        response = requests.post(f"{API_URL}/contact", json=payload)
        
        if response.status_code == 422:  # Validation error expected
            print_test_result("Missing required field validation", True, "Correctly rejected missing required field")
        else:
            print_test_result("Missing required field validation", False, 
                             f"Expected 422 but got: {response.status_code}, {response.text}")
    except requests.exceptions.RequestException as e:
        print_test_result("Missing required field validation", False, f"Request failed: {e}")
    
    # Test with valid minimal data
    try:
        payload = {
            "name": "João Silva",
            "email": "joao.silva@email.com", 
            "message": "Olá, gostaria de saber mais sobre os serviços."
        }
        
        response = requests.post(f"{API_URL}/contact", json=payload)
        
        if response.status_code == 200:
            print_test_result("Valid minimal data", True, "Correctly accepted valid minimal data")
        else:
            print_test_result("Valid minimal data", False, 
                             f"Expected 200 but got: {response.status_code}, {response.text}")
    except requests.exceptions.RequestException as e:
        print_test_result("Valid minimal data", False, f"Request failed: {e}")

def run_endpoint_tests():
    print("\n🔍 STARTING ENDPOINT TESTS\n" + "="*50)
    
    # Run the tests
    portfolio_status = test_get_portfolio()
    testimonials_status = test_get_testimonials()
    contact_status = test_contact_submission()
    test_contact_validation()
    
    # Summary
    print("\n" + "="*50)
    print("📊 ENDPOINT TEST SUMMARY:")
    print(f"  GET /api/portfolio: {'✅ PASS' if portfolio_status else '❌ FAIL'}")
    print(f"  GET /api/testimonials: {'✅ PASS' if testimonials_status else '❌ FAIL'}")
    print(f"  POST /api/contact: {'✅ PASS' if contact_status else '❌ FAIL'}")
    
    overall_status = portfolio_status and testimonials_status and contact_status
    print(f"\n🏁 Overall Endpoint Status: {'✅ PASS' if overall_status else '❌ FAIL'}")
    print("\n" + "="*50)
    
    return overall_status

if __name__ == "__main__":
    run_endpoint_tests()