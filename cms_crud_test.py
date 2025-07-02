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

print(f"🔍 Testing CMS CRUD operations at: {API_URL}")

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
    try:
        payload = {
            "email": "admin@vertextarget.com",
            "password": "VT@admin2025!"
        }
        response = requests.post(f"{API_URL}/auth/login", json=payload)
        
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

# Portfolio CRUD Tests
def test_portfolio_get():
    """Test GET /api/portfolio (public endpoint)"""
    try:
        response = requests.get(f"{API_URL}/portfolio")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_test_result("GET /portfolio (public)", True, f"Retrieved {len(data)} portfolio items")
                
                # Validate structure of returned data
                if len(data) > 0:
                    item = data[0]
                    required_fields = ['id', 'title', 'category', 'image', 'description', 'technologies', 'results']
                    missing_fields = [field for field in required_fields if field not in item]
                    
                    if missing_fields:
                        print_test_result("Portfolio data structure", False, f"Missing fields: {missing_fields}")
                    else:
                        print_test_result("Portfolio data structure", True, "All required fields present")
                
                return True
            else:
                print_test_result("GET /portfolio (public)", False, "Response is not a list")
                return False
        else:
            print_test_result("GET /portfolio (public)", False, f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("GET /portfolio (public)", False, f"Request failed: {e}")
        return False

def test_portfolio_post_without_auth():
    """Test POST /api/portfolio without authentication (should fail)"""
    try:
        payload = {
            "title": "Test Portfolio Item",
            "category": "Test Category",
            "image": "https://example.com/test.jpg",
            "metric": "Test Metric +100%",
            "description": "This is a test portfolio item created by automated tests",
            "technologies": ["Python", "FastAPI", "Testing"],
            "results": {"metric1": "+100%", "metric2": "+200%"},
            "challenge": "Testing the API endpoints thoroughly",
            "solution": "Created comprehensive test suite",
            "outcome": "All tests passing successfully"
        }
        response = requests.post(f"{API_URL}/portfolio", json=payload)
        
        if response.status_code in [401, 403]:
            print_test_result("POST /portfolio without auth", True, f"Correctly rejected with status {response.status_code}")
            return True
        else:
            print_test_result("POST /portfolio without auth", False, f"Expected 401/403 but got: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("POST /portfolio without auth", False, f"Request failed: {e}")
        return False

def test_portfolio_post_with_auth():
    """Test POST /api/portfolio with authentication"""
    global auth_token, test_portfolio_id
    
    if not auth_token:
        print_test_result("POST /portfolio with auth", False, "No auth token available")
        return False
    
    try:
        headers = {
            "Authorization": f"Bearer {auth_token}"
        }
        payload = {
            "title": "Teste Portfolio Projeto",
            "description": "Descrição do projeto de teste",
            "technologies": ["React", "FastAPI", "MongoDB"],
            "category": "Web Development",
            "image": "https://example.com/image.jpg",
            "metric": "Conversão +45%",
            "results": {"metric1": "valor1", "metric2": "valor2"},
            "challenge": "Desafio do projeto de teste",
            "solution": "Solução implementada no projeto",
            "outcome": "Resultados obtidos no projeto"
        }
        response = requests.post(f"{API_URL}/portfolio", json=payload, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            test_portfolio_id = data.get('id')
            print_test_result("POST /portfolio with auth", True, f"Successfully created portfolio item with ID: {test_portfolio_id}")
            return True
        else:
            print_test_result("POST /portfolio with auth", False, f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("POST /portfolio with auth", False, f"Request failed: {e}")
        return False

def test_portfolio_post_invalid_data():
    """Test POST /api/portfolio with invalid data (Pydantic validation)"""
    global auth_token
    
    if not auth_token:
        print_test_result("POST /portfolio invalid data", False, "No auth token available")
        return False
    
    try:
        headers = {
            "Authorization": f"Bearer {auth_token}"
        }
        # Missing required fields
        payload = {
            "title": "Invalid Portfolio Item",
            "category": "Test Category"
            # Missing other required fields
        }
        response = requests.post(f"{API_URL}/portfolio", json=payload, headers=headers)
        
        if response.status_code == 422:
            print_test_result("POST /portfolio invalid data", True, "Correctly rejected invalid data with 422 status")
            return True
        else:
            print_test_result("POST /portfolio invalid data", False, f"Expected 422 but got: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("POST /portfolio invalid data", False, f"Request failed: {e}")
        return False

def test_portfolio_put_with_auth():
    """Test PUT /api/portfolio/{id} with authentication"""
    global auth_token, test_portfolio_id
    
    if not auth_token or not test_portfolio_id:
        print_test_result("PUT /portfolio/{id} with auth", False, "No auth token or portfolio ID available")
        return False
    
    try:
        headers = {
            "Authorization": f"Bearer {auth_token}"
        }
        payload = {
            "title": "Updated Portfolio Project",
            "description": "This portfolio item has been updated by automated tests"
        }
        response = requests.put(f"{API_URL}/portfolio/{test_portfolio_id}", json=payload, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('title') == payload['title'] and data.get('description') == payload['description']:
                print_test_result("PUT /portfolio/{id} with auth", True, f"Successfully updated portfolio item {test_portfolio_id}")
                return True
            else:
                print_test_result("PUT /portfolio/{id} with auth", False, "Update didn't apply correctly")
                return False
        else:
            print_test_result("PUT /portfolio/{id} with auth", False, f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("PUT /portfolio/{id} with auth", False, f"Request failed: {e}")
        return False

def test_portfolio_put_without_auth():
    """Test PUT /api/portfolio/{id} without authentication (should fail)"""
    global test_portfolio_id
    
    if not test_portfolio_id:
        print_test_result("PUT /portfolio/{id} without auth", False, "No portfolio ID available")
        return False
    
    try:
        payload = {
            "title": "Unauthorized Update Attempt",
            "description": "This update should be rejected"
        }
        response = requests.put(f"{API_URL}/portfolio/{test_portfolio_id}", json=payload)
        
        if response.status_code in [401, 403]:
            print_test_result("PUT /portfolio/{id} without auth", True, f"Correctly rejected with status {response.status_code}")
            return True
        else:
            print_test_result("PUT /portfolio/{id} without auth", False, f"Expected 401/403 but got: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("PUT /portfolio/{id} without auth", False, f"Request failed: {e}")
        return False

def test_portfolio_put_invalid_id():
    """Test PUT /api/portfolio/{id} with invalid ID (should return 404)"""
    global auth_token
    
    if not auth_token:
        print_test_result("PUT /portfolio/{id} invalid ID", False, "No auth token available")
        return False
    
    try:
        headers = {
            "Authorization": f"Bearer {auth_token}"
        }
        payload = {
            "title": "Update Non-existent Item",
            "description": "This update should fail with 404"
        }
        invalid_id = "non-existent-id-12345"
        response = requests.put(f"{API_URL}/portfolio/{invalid_id}", json=payload, headers=headers)
        
        if response.status_code == 404:
            print_test_result("PUT /portfolio/{id} invalid ID", True, "Correctly returned 404 for non-existent ID")
            return True
        else:
            print_test_result("PUT /portfolio/{id} invalid ID", False, f"Expected 404 but got: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("PUT /portfolio/{id} invalid ID", False, f"Request failed: {e}")
        return False

def test_portfolio_delete_without_auth():
    """Test DELETE /api/portfolio/{id} without authentication (should fail)"""
    global test_portfolio_id
    
    if not test_portfolio_id:
        print_test_result("DELETE /portfolio/{id} without auth", False, "No portfolio ID available")
        return False
    
    try:
        response = requests.delete(f"{API_URL}/portfolio/{test_portfolio_id}")
        
        if response.status_code in [401, 403]:
            print_test_result("DELETE /portfolio/{id} without auth", True, f"Correctly rejected with status {response.status_code}")
            return True
        else:
            print_test_result("DELETE /portfolio/{id} without auth", False, f"Expected 401/403 but got: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("DELETE /portfolio/{id} without auth", False, f"Request failed: {e}")
        return False

def test_portfolio_delete_with_auth():
    """Test DELETE /api/portfolio/{id} with authentication"""
    global auth_token, test_portfolio_id
    
    if not auth_token or not test_portfolio_id:
        print_test_result("DELETE /portfolio/{id} with auth", False, "No auth token or portfolio ID available")
        return False
    
    try:
        headers = {
            "Authorization": f"Bearer {auth_token}"
        }
        response = requests.delete(f"{API_URL}/portfolio/{test_portfolio_id}", headers=headers)
        
        if response.status_code == 200:
            print_test_result("DELETE /portfolio/{id} with auth", True, f"Successfully deleted portfolio item {test_portfolio_id}")
            
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
            print_test_result("DELETE /portfolio/{id} with auth", False, f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("DELETE /portfolio/{id} with auth", False, f"Request failed: {e}")
        return False

def test_portfolio_delete_invalid_id():
    """Test DELETE /api/portfolio/{id} with invalid ID (should return 404)"""
    global auth_token
    
    if not auth_token:
        print_test_result("DELETE /portfolio/{id} invalid ID", False, "No auth token available")
        return False
    
    try:
        headers = {
            "Authorization": f"Bearer {auth_token}"
        }
        invalid_id = "non-existent-id-12345"
        response = requests.delete(f"{API_URL}/portfolio/{invalid_id}", headers=headers)
        
        if response.status_code == 404:
            print_test_result("DELETE /portfolio/{id} invalid ID", True, "Correctly returned 404 for non-existent ID")
            return True
        else:
            print_test_result("DELETE /portfolio/{id} invalid ID", False, f"Expected 404 but got: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("DELETE /portfolio/{id} invalid ID", False, f"Request failed: {e}")
        return False

# Testimonial CRUD Tests
def test_testimonials_get():
    """Test GET /api/testimonials (public endpoint)"""
    try:
        response = requests.get(f"{API_URL}/testimonials")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_test_result("GET /testimonials (public)", True, f"Retrieved {len(data)} testimonials")
                
                # Validate structure of returned data
                if len(data) > 0:
                    item = data[0]
                    required_fields = ['id', 'name', 'company', 'quote', 'rating']
                    missing_fields = [field for field in required_fields if field not in item]
                    
                    if missing_fields:
                        print_test_result("Testimonial data structure", False, f"Missing fields: {missing_fields}")
                    else:
                        print_test_result("Testimonial data structure", True, "All required fields present")
                
                return True
            else:
                print_test_result("GET /testimonials (public)", False, "Response is not a list")
                return False
        else:
            print_test_result("GET /testimonials (public)", False, f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("GET /testimonials (public)", False, f"Request failed: {e}")
        return False

def test_testimonials_post_without_auth():
    """Test POST /api/testimonials without authentication (should fail)"""
    try:
        payload = {
            "name": "Cliente Teste",
            "company": "Empresa Teste",
            "position": "CEO",
            "quote": "Excelente trabalho da equipe!",
            "rating": 5,
            "avatar": "https://example.com/avatar.jpg",
            "project": "Projeto Teste"
        }
        response = requests.post(f"{API_URL}/testimonials", json=payload)
        
        if response.status_code in [401, 403]:
            print_test_result("POST /testimonials without auth", True, f"Correctly rejected with status {response.status_code}")
            return True
        else:
            print_test_result("POST /testimonials without auth", False, f"Expected 401/403 but got: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("POST /testimonials without auth", False, f"Request failed: {e}")
        return False

def test_testimonials_post_with_auth():
    """Test POST /api/testimonials with authentication"""
    global auth_token, test_testimonial_id
    
    if not auth_token:
        print_test_result("POST /testimonials with auth", False, "No auth token available")
        return False
    
    try:
        headers = {
            "Authorization": f"Bearer {auth_token}"
        }
        payload = {
            "name": "Cliente Teste",
            "company": "Empresa Teste",
            "position": "CEO",
            "quote": "Excelente trabalho da equipe!",
            "rating": 5,
            "avatar": "https://example.com/avatar.jpg",
            "project": "Projeto Teste"
        }
        response = requests.post(f"{API_URL}/testimonials", json=payload, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            test_testimonial_id = data.get('id')
            print_test_result("POST /testimonials with auth", True, f"Successfully created testimonial with ID: {test_testimonial_id}")
            return True
        else:
            print_test_result("POST /testimonials with auth", False, f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("POST /testimonials with auth", False, f"Request failed: {e}")
        return False

def test_testimonials_post_invalid_data():
    """Test POST /api/testimonials with invalid data (Pydantic validation)"""
    global auth_token
    
    if not auth_token:
        print_test_result("POST /testimonials invalid data", False, "No auth token available")
        return False
    
    try:
        headers = {
            "Authorization": f"Bearer {auth_token}"
        }
        # Missing required fields
        payload = {
            "name": "Invalid Testimonial",
            "rating": 10  # Invalid rating (should be 1-5)
            # Missing other required fields
        }
        response = requests.post(f"{API_URL}/testimonials", json=payload, headers=headers)
        
        if response.status_code == 422:
            print_test_result("POST /testimonials invalid data", True, "Correctly rejected invalid data with 422 status")
            return True
        else:
            print_test_result("POST /testimonials invalid data", False, f"Expected 422 but got: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("POST /testimonials invalid data", False, f"Request failed: {e}")
        return False

def test_testimonials_put_with_auth():
    """Test PUT /api/testimonials/{id} with authentication"""
    global auth_token, test_testimonial_id
    
    if not auth_token or not test_testimonial_id:
        print_test_result("PUT /testimonials/{id} with auth", False, "No auth token or testimonial ID available")
        return False
    
    try:
        headers = {
            "Authorization": f"Bearer {auth_token}"
        }
        payload = {
            "quote": "Este depoimento foi atualizado pelos testes automatizados!",
            "rating": 5
        }
        response = requests.put(f"{API_URL}/testimonials/{test_testimonial_id}", json=payload, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('quote') == payload['quote'] and data.get('rating') == payload['rating']:
                print_test_result("PUT /testimonials/{id} with auth", True, f"Successfully updated testimonial {test_testimonial_id}")
                return True
            else:
                print_test_result("PUT /testimonials/{id} with auth", False, "Update didn't apply correctly")
                return False
        else:
            print_test_result("PUT /testimonials/{id} with auth", False, f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("PUT /testimonials/{id} with auth", False, f"Request failed: {e}")
        return False

def test_testimonials_put_without_auth():
    """Test PUT /api/testimonials/{id} without authentication (should fail)"""
    global test_testimonial_id
    
    if not test_testimonial_id:
        print_test_result("PUT /testimonials/{id} without auth", False, "No testimonial ID available")
        return False
    
    try:
        payload = {
            "quote": "Unauthorized Update Attempt",
            "rating": 1
        }
        response = requests.put(f"{API_URL}/testimonials/{test_testimonial_id}", json=payload)
        
        if response.status_code in [401, 403]:
            print_test_result("PUT /testimonials/{id} without auth", True, f"Correctly rejected with status {response.status_code}")
            return True
        else:
            print_test_result("PUT /testimonials/{id} without auth", False, f"Expected 401/403 but got: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("PUT /testimonials/{id} without auth", False, f"Request failed: {e}")
        return False

def test_testimonials_put_invalid_id():
    """Test PUT /api/testimonials/{id} with invalid ID (should return 404)"""
    global auth_token
    
    if not auth_token:
        print_test_result("PUT /testimonials/{id} invalid ID", False, "No auth token available")
        return False
    
    try:
        headers = {
            "Authorization": f"Bearer {auth_token}"
        }
        payload = {
            "quote": "Update Non-existent Item",
            "rating": 5
        }
        invalid_id = "non-existent-id-12345"
        response = requests.put(f"{API_URL}/testimonials/{invalid_id}", json=payload, headers=headers)
        
        if response.status_code == 404:
            print_test_result("PUT /testimonials/{id} invalid ID", True, "Correctly returned 404 for non-existent ID")
            return True
        else:
            print_test_result("PUT /testimonials/{id} invalid ID", False, f"Expected 404 but got: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("PUT /testimonials/{id} invalid ID", False, f"Request failed: {e}")
        return False

def test_testimonials_delete_without_auth():
    """Test DELETE /api/testimonials/{id} without authentication (should fail)"""
    global test_testimonial_id
    
    if not test_testimonial_id:
        print_test_result("DELETE /testimonials/{id} without auth", False, "No testimonial ID available")
        return False
    
    try:
        response = requests.delete(f"{API_URL}/testimonials/{test_testimonial_id}")
        
        if response.status_code in [401, 403]:
            print_test_result("DELETE /testimonials/{id} without auth", True, f"Correctly rejected with status {response.status_code}")
            return True
        else:
            print_test_result("DELETE /testimonials/{id} without auth", False, f"Expected 401/403 but got: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("DELETE /testimonials/{id} without auth", False, f"Request failed: {e}")
        return False

def test_testimonials_delete_with_auth():
    """Test DELETE /api/testimonials/{id} with authentication"""
    global auth_token, test_testimonial_id
    
    if not auth_token or not test_testimonial_id:
        print_test_result("DELETE /testimonials/{id} with auth", False, "No auth token or testimonial ID available")
        return False
    
    try:
        headers = {
            "Authorization": f"Bearer {auth_token}"
        }
        response = requests.delete(f"{API_URL}/testimonials/{test_testimonial_id}", headers=headers)
        
        if response.status_code == 200:
            print_test_result("DELETE /testimonials/{id} with auth", True, f"Successfully deleted testimonial {test_testimonial_id}")
            
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
            print_test_result("DELETE /testimonials/{id} with auth", False, f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("DELETE /testimonials/{id} with auth", False, f"Request failed: {e}")
        return False

def test_testimonials_delete_invalid_id():
    """Test DELETE /api/testimonials/{id} with invalid ID (should return 404)"""
    global auth_token
    
    if not auth_token:
        print_test_result("DELETE /testimonials/{id} invalid ID", False, "No auth token available")
        return False
    
    try:
        headers = {
            "Authorization": f"Bearer {auth_token}"
        }
        invalid_id = "non-existent-id-12345"
        response = requests.delete(f"{API_URL}/testimonials/{invalid_id}", headers=headers)
        
        if response.status_code == 404:
            print_test_result("DELETE /testimonials/{id} invalid ID", True, "Correctly returned 404 for non-existent ID")
            return True
        else:
            print_test_result("DELETE /testimonials/{id} invalid ID", False, f"Expected 404 but got: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print_test_result("DELETE /testimonials/{id} invalid ID", False, f"Request failed: {e}")
        return False

def run_all_tests():
    """Run all CMS CRUD tests and return overall status"""
    print("\n🔍 STARTING CMS CRUD TESTS\n" + "="*80)
    
    # Login first to get auth token
    login_success = login_admin()
    if not login_success:
        print("\n❌ CRITICAL ERROR: Admin login failed. Aborting further tests.")
        return False
    
    # Portfolio CRUD Tests
    print_test_header("Portfolio CRUD Tests")
    portfolio_get = test_portfolio_get()
    portfolio_post_without_auth = test_portfolio_post_without_auth()
    portfolio_post_with_auth = test_portfolio_post_with_auth()
    portfolio_post_invalid = test_portfolio_post_invalid_data()
    portfolio_put_with_auth = test_portfolio_put_with_auth()
    portfolio_put_without_auth = test_portfolio_put_without_auth()
    portfolio_put_invalid_id = test_portfolio_put_invalid_id()
    portfolio_delete_without_auth = test_portfolio_delete_without_auth()
    portfolio_delete_with_auth = test_portfolio_delete_with_auth()
    portfolio_delete_invalid_id = test_portfolio_delete_invalid_id()
    
    # Testimonial CRUD Tests
    print_test_header("Testimonial CRUD Tests")
    testimonials_get = test_testimonials_get()
    testimonials_post_without_auth = test_testimonials_post_without_auth()
    testimonials_post_with_auth = test_testimonials_post_with_auth()
    testimonials_post_invalid = test_testimonials_post_invalid_data()
    testimonials_put_with_auth = test_testimonials_put_with_auth()
    testimonials_put_without_auth = test_testimonials_put_without_auth()
    testimonials_put_invalid_id = test_testimonials_put_invalid_id()
    testimonials_delete_without_auth = test_testimonials_delete_without_auth()
    testimonials_delete_with_auth = test_testimonials_delete_with_auth()
    testimonials_delete_invalid_id = test_testimonials_delete_invalid_id()
    
    # Summary
    print("\n" + "="*80)
    print("📊 CMS CRUD TEST SUMMARY:")
    
    # Portfolio CRUD summary
    print("\nPortfolio CRUD Tests:")
    print(f"  GET /portfolio (public): {'✅ PASS' if portfolio_get else '❌ FAIL'}")
    print(f"  POST /portfolio without auth: {'✅ PASS' if portfolio_post_without_auth else '❌ FAIL'}")
    print(f"  POST /portfolio with auth: {'✅ PASS' if portfolio_post_with_auth else '❌ FAIL'}")
    print(f"  POST /portfolio invalid data: {'✅ PASS' if portfolio_post_invalid else '❌ FAIL'}")
    print(f"  PUT /portfolio/{'{id}'} with auth: {'✅ PASS' if portfolio_put_with_auth else '❌ FAIL'}")
    print(f"  PUT /portfolio/{'{id}'} without auth: {'✅ PASS' if portfolio_put_without_auth else '❌ FAIL'}")
    print(f"  PUT /portfolio/{'{id}'} invalid ID: {'✅ PASS' if portfolio_put_invalid_id else '❌ FAIL'}")
    print(f"  DELETE /portfolio/{'{id}'} without auth: {'✅ PASS' if portfolio_delete_without_auth else '❌ FAIL'}")
    print(f"  DELETE /portfolio/{'{id}'} with auth: {'✅ PASS' if portfolio_delete_with_auth else '❌ FAIL'}")
    print(f"  DELETE /portfolio/{'{id}'} invalid ID: {'✅ PASS' if portfolio_delete_invalid_id else '❌ FAIL'}")
    
    # Testimonial CRUD summary
    print("\nTestimonial CRUD Tests:")
    print(f"  GET /testimonials (public): {'✅ PASS' if testimonials_get else '❌ FAIL'}")
    print(f"  POST /testimonials without auth: {'✅ PASS' if testimonials_post_without_auth else '❌ FAIL'}")
    print(f"  POST /testimonials with auth: {'✅ PASS' if testimonials_post_with_auth else '❌ FAIL'}")
    print(f"  POST /testimonials invalid data: {'✅ PASS' if testimonials_post_invalid else '❌ FAIL'}")
    print(f"  PUT /testimonials/{'{id}'} with auth: {'✅ PASS' if testimonials_put_with_auth else '❌ FAIL'}")
    print(f"  PUT /testimonials/{'{id}'} without auth: {'✅ PASS' if testimonials_put_without_auth else '❌ FAIL'}")
    print(f"  PUT /testimonials/{'{id}'} invalid ID: {'✅ PASS' if testimonials_put_invalid_id else '❌ FAIL'}")
    print(f"  DELETE /testimonials/{'{id}'} without auth: {'✅ PASS' if testimonials_delete_without_auth else '❌ FAIL'}")
    print(f"  DELETE /testimonials/{'{id}'} with auth: {'✅ PASS' if testimonials_delete_with_auth else '❌ FAIL'}")
    print(f"  DELETE /testimonials/{'{id}'} invalid ID: {'✅ PASS' if testimonials_delete_invalid_id else '❌ FAIL'}")
    
    # Overall status
    portfolio_tests = (
        portfolio_get and portfolio_post_without_auth and portfolio_post_with_auth and 
        portfolio_post_invalid and portfolio_put_with_auth and portfolio_put_without_auth and 
        portfolio_put_invalid_id and portfolio_delete_without_auth and 
        portfolio_delete_with_auth and portfolio_delete_invalid_id
    )
    
    testimonial_tests = (
        testimonials_get and testimonials_post_without_auth and testimonials_post_with_auth and 
        testimonials_post_invalid and testimonials_put_with_auth and testimonials_put_without_auth and 
        testimonials_put_invalid_id and testimonials_delete_without_auth and 
        testimonials_delete_with_auth and testimonials_delete_invalid_id
    )
    
    print("\n" + "="*80)
    print("🎯 FEATURE TEST RESULTS:")
    print(f"  Portfolio CRUD Endpoints: {'✅ PASS' if portfolio_tests else '❌ FAIL'}")
    print(f"  Testimonial CRUD Endpoints: {'✅ PASS' if testimonial_tests else '❌ FAIL'}")
    
    overall_status = login_success and portfolio_tests and testimonial_tests
    
    print(f"\n🏁 Overall CMS CRUD Status: {'✅ PASS' if overall_status else '❌ FAIL'}")
    print("\n" + "="*80)
    
    return overall_status

if __name__ == "__main__":
    run_all_tests()