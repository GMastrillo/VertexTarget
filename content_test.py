#!/usr/bin/env python3
import requests
import json
import os
import sys
from pprint import pprint

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

print(f"🔍 Testing content seeder data at: {API_URL}")

# Test helper functions
def print_test_header(title):
    print(f"\n📋 {title}")
    print("=" * 50)

def print_test_result(test_name, success, details=None):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} - {test_name}")
    if details:
        print(f"    {details}")

def test_portfolio_content():
    """Test if the portfolio endpoint returns the expected content from content_seeder.py"""
    print_test_header("Testing Portfolio Content")
    
    try:
        response = requests.get(f"{API_URL}/portfolio")
        
        if response.status_code != 200:
            print_test_result("Portfolio API Response", False, 
                             f"Status code: {response.status_code}, Response: {response.text}")
            return False
        
        data = response.json()
        
        if not isinstance(data, list):
            print_test_result("Portfolio Data Format", False, "Response is not a list")
            return False
        
        # Check if we have at least 3 items (from content_seeder.py)
        if len(data) < 3:
            print_test_result("Portfolio Item Count", False, 
                             f"Expected at least 3 items but got {len(data)}")
            return False
        
        print_test_result("Portfolio Item Count", True, f"Found {len(data)} portfolio items")
        
        # Expected project titles from content_seeder.py
        expected_titles = [
            "EcommerceBoost - Plataforma de Marketing Digital",
            "FinanceFlow - Aplicativo de Gestão Financeira",
            "MedAssist - Automação Inteligente para Clínicas"
        ]
        
        # Check if all expected titles are present
        found_titles = [item.get('title') for item in data]
        missing_titles = [title for title in expected_titles if title not in found_titles]
        
        if missing_titles:
            print_test_result("Portfolio Content", False, 
                             f"Missing expected titles: {', '.join(missing_titles)}")
            return False
        
        print_test_result("Portfolio Content", True, "All expected project titles found")
        
        # Validate structure of each expected item
        for expected_title in expected_titles:
            # Find the item with this title
            item = next((item for item in data if item.get('title') == expected_title), None)
            
            if not item:
                continue  # Already reported missing above
            
            # Check required fields
            required_fields = [
                'id', 'title', 'category', 'image', 'metric', 'description', 
                'technologies', 'results', 'challenge', 'solution', 'outcome'
            ]
            
            missing_fields = [field for field in required_fields if field not in item or not item.get(field)]
            
            if missing_fields:
                print_test_result(f"Portfolio Item Structure: {expected_title}", False, 
                                 f"Missing required fields: {', '.join(missing_fields)}")
                return False
            
            # Check if image URL is valid
            image_url = item.get('image')
            if not image_url or not image_url.startswith('http'):
                print_test_result(f"Portfolio Image URL: {expected_title}", False, 
                                 f"Invalid image URL: {image_url}")
                return False
            
            # Check if technologies is a list
            technologies = item.get('technologies')
            if not isinstance(technologies, list) or not technologies:
                print_test_result(f"Portfolio Technologies: {expected_title}", False, 
                                 f"Technologies is not a valid list: {technologies}")
                return False
            
            print_test_result(f"Portfolio Item Structure: {expected_title}", True, 
                             "All required fields present and valid")
        
        return True
        
    except Exception as e:
        print_test_result("Portfolio Content Test", False, f"Exception: {str(e)}")
        return False

def test_testimonials_content():
    """Test if the testimonials endpoint returns the expected content from content_seeder.py"""
    print_test_header("Testing Testimonials Content")
    
    try:
        response = requests.get(f"{API_URL}/testimonials")
        
        if response.status_code != 200:
            print_test_result("Testimonials API Response", False, 
                             f"Status code: {response.status_code}, Response: {response.text}")
            return False
        
        data = response.json()
        
        if not isinstance(data, list):
            print_test_result("Testimonials Data Format", False, "Response is not a list")
            return False
        
        # Check if we have at least 3 items (from content_seeder.py)
        if len(data) < 3:
            print_test_result("Testimonials Item Count", False, 
                             f"Expected at least 3 items but got {len(data)}")
            return False
        
        print_test_result("Testimonials Item Count", True, f"Found {len(data)} testimonials")
        
        # Expected testimonial names from content_seeder.py
        expected_names = [
            "Carolina Mendes",
            "Ricardo Santos",
            "Dr. Luiza Oliveira"
        ]
        
        # Check if all expected names are present
        found_names = [item.get('name') for item in data]
        missing_names = [name for name in expected_names if name not in found_names]
        
        if missing_names:
            print_test_result("Testimonials Content", False, 
                             f"Missing expected names: {', '.join(missing_names)}")
            return False
        
        print_test_result("Testimonials Content", True, "All expected testimonial names found")
        
        # Validate structure of each expected item
        for expected_name in expected_names:
            # Find the item with this name
            item = next((item for item in data if item.get('name') == expected_name), None)
            
            if not item:
                continue  # Already reported missing above
            
            # Check required fields
            required_fields = [
                'id', 'name', 'position', 'company', 'avatar', 'quote', 'rating', 'project'
            ]
            
            missing_fields = [field for field in required_fields if field not in item or not item.get(field)]
            
            if missing_fields:
                print_test_result(f"Testimonial Structure: {expected_name}", False, 
                                 f"Missing required fields: {', '.join(missing_fields)}")
                return False
            
            # Check if avatar URL is valid
            avatar_url = item.get('avatar')
            if not avatar_url or not avatar_url.startswith('http'):
                print_test_result(f"Testimonial Avatar URL: {expected_name}", False, 
                                 f"Invalid avatar URL: {avatar_url}")
                return False
            
            # Check if rating is valid
            rating = item.get('rating')
            if not isinstance(rating, int) or rating < 1 or rating > 5:
                print_test_result(f"Testimonial Rating: {expected_name}", False, 
                                 f"Invalid rating: {rating}")
                return False
            
            # Check if project field is valid
            project = item.get('project')
            if not project:
                print_test_result(f"Testimonial Project: {expected_name}", False, 
                                 "Project field is empty")
                return False
            
            print_test_result(f"Testimonial Structure: {expected_name}", True, 
                             "All required fields present and valid")
        
        return True
        
    except Exception as e:
        print_test_result("Testimonials Content Test", False, f"Exception: {str(e)}")
        return False

def test_image_urls():
    """Test if the image URLs in portfolio and testimonials are valid"""
    print_test_header("Testing Image URLs")
    
    try:
        # Get portfolio items
        portfolio_response = requests.get(f"{API_URL}/portfolio")
        if portfolio_response.status_code != 200:
            print_test_result("Portfolio API Response", False, 
                             f"Status code: {portfolio_response.status_code}")
            return False
        
        portfolio_data = portfolio_response.json()
        
        # Get testimonials
        testimonials_response = requests.get(f"{API_URL}/testimonials")
        if testimonials_response.status_code != 200:
            print_test_result("Testimonials API Response", False, 
                             f"Status code: {testimonials_response.status_code}")
            return False
        
        testimonials_data = testimonials_response.json()
        
        # Collect all image URLs
        image_urls = []
        
        for item in portfolio_data:
            if 'image' in item and item['image']:
                image_urls.append(('Portfolio', item.get('title', 'Unknown'), item['image']))
        
        for item in testimonials_data:
            if 'avatar' in item and item['avatar']:
                image_urls.append(('Testimonial', item.get('name', 'Unknown'), item['avatar']))
        
        # Test each URL
        all_valid = True
        for source, item_name, url in image_urls:
            try:
                # Just check if the URL is accessible, don't download the full image
                response = requests.head(url, timeout=5)
                
                if response.status_code < 200 or response.status_code >= 400:
                    print_test_result(f"{source} Image URL: {item_name}", False, 
                                     f"URL {url} returned status code {response.status_code}")
                    all_valid = False
                else:
                    print_test_result(f"{source} Image URL: {item_name}", True, 
                                     f"URL {url} is accessible")
            except requests.exceptions.RequestException as e:
                print_test_result(f"{source} Image URL: {item_name}", False, 
                                 f"Error accessing URL {url}: {str(e)}")
                all_valid = False
        
        return all_valid
        
    except Exception as e:
        print_test_result("Image URLs Test", False, f"Exception: {str(e)}")
        return False

def run_tests():
    """Run all content tests"""
    print("\n🔍 TESTING CONTENT SEEDER DATA\n" + "="*50)
    
    portfolio_status = test_portfolio_content()
    testimonials_status = test_testimonials_content()
    image_urls_status = test_image_urls()
    
    # Summary
    print("\n" + "="*50)
    print("📊 CONTENT TEST SUMMARY:")
    print(f"  Portfolio Content: {'✅ PASS' if portfolio_status else '❌ FAIL'}")
    print(f"  Testimonials Content: {'✅ PASS' if testimonials_status else '❌ FAIL'}")
    print(f"  Image URLs: {'✅ PASS' if image_urls_status else '❌ FAIL'}")
    
    overall_status = portfolio_status and testimonials_status and image_urls_status
    
    print(f"\n🏁 Overall Content Status: {'✅ PASS' if overall_status else '❌ FAIL'}")
    print("\n" + "="*50)
    
    return overall_status

if __name__ == "__main__":
    run_tests()