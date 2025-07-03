#!/usr/bin/env python3
import requests
import json
import unittest
import os
import sys
from dotenv import load_dotenv
import random
import string

# Load environment variables from frontend/.env
load_dotenv("frontend/.env")

# Get the backend URL from environment variables
BACKEND_URL = os.environ.get("REACT_APP_BACKEND_URL")
API_BASE_URL = f"{BACKEND_URL}/api"

print(f"Testing API at: {API_BASE_URL}")

class TestVertexTargetAPI(unittest.TestCase):
    """Test suite for VertexTarget API endpoints"""

    @classmethod
    def setUpClass(cls):
        """Set up test data and seed the database"""
        # Seed the database with sample data
        response = requests.post(f"{API_BASE_URL}/seed-data")
        cls.assertTrue = unittest.TestCase.assertTrue
        cls.assertEqual = unittest.TestCase.assertEqual
        cls.assertIn = unittest.TestCase.assertIn
        cls.assertTrue(cls, response.status_code == 200, f"Failed to seed database: {response.text}")
        print(f"Database seeded successfully: {response.json()}")
        
        # Store created IDs for cleanup
        cls.portfolio_ids = []
        cls.testimonial_ids = []

    @classmethod
    def tearDownClass(cls):
        """Clean up created test data"""
        print("\nCleaning up test data...")
        
        # Delete created portfolio items
        for portfolio_id in cls.portfolio_ids:
            try:
                requests.delete(f"{API_BASE_URL}/portfolio/{portfolio_id}")
            except Exception as e:
                print(f"Error deleting portfolio {portfolio_id}: {e}")
        
        # Delete created testimonials
        for testimonial_id in cls.testimonial_ids:
            try:
                requests.delete(f"{API_BASE_URL}/testimonials/{testimonial_id}")
            except Exception as e:
                print(f"Error deleting testimonial {testimonial_id}: {e}")

    def generate_random_string(self, length=10):
        """Generate a random string for test data"""
        return ''.join(random.choices(string.ascii_letters, k=length))

    def test_01_portfolio_list(self):
        """Test GET /api/portfolio endpoint"""
        response = requests.get(f"{API_BASE_URL}/portfolio")
        self.assertEqual(response.status_code, 200, f"Failed to get portfolio list: {response.text}")
        data = response.json()
        self.assertTrue(isinstance(data, list), "Response should be a list")
        print(f"Portfolio list retrieved successfully. Count: {len(data)}")
        
        # Print first item for debugging
        if data:
            print(f"Sample portfolio item: {json.dumps(data[0], indent=2)}")

    def test_02_create_portfolio(self):
        """Test POST /api/portfolio endpoint"""
        test_data = {
            "title": f"Test Portfolio {self.generate_random_string()}",
            "description": "A test project for validation",
            "technologies": ["React", "FastAPI"],
            "status": "active"
        }
        
        response = requests.post(f"{API_BASE_URL}/portfolio", json=test_data)
        self.assertEqual(response.status_code, 200, f"Failed to create portfolio: {response.text}")
        data = response.json()
        self.assertEqual(data["title"], test_data["title"], "Title should match")
        self.assertEqual(data["description"], test_data["description"], "Description should match")
        self.assertEqual(data["technologies"], test_data["technologies"], "Technologies should match")
        self.assertEqual(data["status"], test_data["status"], "Status should match")
        self.assertIn("id", data, "Response should include an ID")
        
        # Store ID for later tests and cleanup
        self.__class__.portfolio_ids.append(data["id"])
        print(f"Portfolio created successfully with ID: {data['id']}")
        return data["id"]

    def test_03_get_portfolio_item(self):
        """Test GET /api/portfolio/{id} endpoint"""
        # First create a portfolio item
        portfolio_id = self.test_02_create_portfolio()
        
        # Then retrieve it
        response = requests.get(f"{API_BASE_URL}/portfolio/{portfolio_id}")
        self.assertEqual(response.status_code, 200, f"Failed to get portfolio item: {response.text}")
        data = response.json()
        self.assertEqual(data["id"], portfolio_id, "ID should match")
        print(f"Portfolio item retrieved successfully: {data['title']}")

    def test_04_update_portfolio(self):
        """Test PUT /api/portfolio/{id} endpoint"""
        # First create a portfolio item
        portfolio_id = self.test_02_create_portfolio()
        
        # Then update it
        update_data = {
            "title": f"Updated Portfolio {self.generate_random_string()}",
            "description": "This portfolio has been updated",
            "technologies": ["React", "FastAPI", "MongoDB"]
        }
        
        response = requests.put(f"{API_BASE_URL}/portfolio/{portfolio_id}", json=update_data)
        self.assertEqual(response.status_code, 200, f"Failed to update portfolio: {response.text}")
        data = response.json()
        self.assertEqual(data["title"], update_data["title"], "Title should be updated")
        self.assertEqual(data["description"], update_data["description"], "Description should be updated")
        self.assertEqual(data["technologies"], update_data["technologies"], "Technologies should be updated")
        print(f"Portfolio item updated successfully: {data['title']}")

    def test_05_delete_portfolio(self):
        """Test DELETE /api/portfolio/{id} endpoint"""
        # First create a portfolio item
        portfolio_id = self.test_02_create_portfolio()
        
        # Then delete it
        response = requests.delete(f"{API_BASE_URL}/portfolio/{portfolio_id}")
        self.assertEqual(response.status_code, 200, f"Failed to delete portfolio: {response.text}")
        data = response.json()
        self.assertIn("message", data, "Response should include a message")
        print(f"Portfolio item deleted successfully: {data['message']}")
        
        # Verify it's deleted
        response = requests.get(f"{API_BASE_URL}/portfolio/{portfolio_id}")
        self.assertEqual(response.status_code, 404, "Portfolio item should not exist after deletion")
        
        # Remove from cleanup list since it's already deleted
        if portfolio_id in self.__class__.portfolio_ids:
            self.__class__.portfolio_ids.remove(portfolio_id)

    def test_06_portfolio_error_handling(self):
        """Test error handling for portfolio endpoints"""
        # Test non-existent ID
        non_existent_id = "non-existent-id"
        response = requests.get(f"{API_BASE_URL}/portfolio/{non_existent_id}")
        self.assertEqual(response.status_code, 404, "Should return 404 for non-existent ID")
        
        # Test update non-existent ID
        update_data = {"title": "This should fail"}
        response = requests.put(f"{API_BASE_URL}/portfolio/{non_existent_id}", json=update_data)
        self.assertEqual(response.status_code, 404, "Should return 404 when updating non-existent ID")
        
        # Test delete non-existent ID
        response = requests.delete(f"{API_BASE_URL}/portfolio/{non_existent_id}")
        self.assertEqual(response.status_code, 404, "Should return 404 when deleting non-existent ID")
        
        print("Portfolio error handling tests passed")

    def test_07_testimonials_list(self):
        """Test GET /api/testimonials endpoint"""
        response = requests.get(f"{API_BASE_URL}/testimonials")
        self.assertEqual(response.status_code, 200, f"Failed to get testimonials list: {response.text}")
        data = response.json()
        self.assertTrue(isinstance(data, list), "Response should be a list")
        print(f"Testimonials list retrieved successfully. Count: {len(data)}")
        
        # Print first item for debugging
        if data:
            print(f"Sample testimonial: {json.dumps(data[0], indent=2)}")

    def test_08_create_testimonial(self):
        """Test POST /api/testimonials endpoint"""
        test_data = {
            "cliente": f"Test Client {self.generate_random_string()}",
            "empresa": "Test Company",
            "cargo": "Developer",
            "conteudo": "Great work!",
            "rating": 5
        }
        
        response = requests.post(f"{API_BASE_URL}/testimonials", json=test_data)
        self.assertEqual(response.status_code, 200, f"Failed to create testimonial: {response.text}")
        data = response.json()
        self.assertEqual(data["cliente"], test_data["cliente"], "Cliente should match")
        self.assertEqual(data["empresa"], test_data["empresa"], "Empresa should match")
        self.assertEqual(data["cargo"], test_data["cargo"], "Cargo should match")
        self.assertEqual(data["conteudo"], test_data["conteudo"], "Conteudo should match")
        self.assertEqual(data["rating"], test_data["rating"], "Rating should match")
        self.assertIn("id", data, "Response should include an ID")
        
        # Store ID for later tests and cleanup
        self.__class__.testimonial_ids.append(data["id"])
        print(f"Testimonial created successfully with ID: {data['id']}")
        return data["id"]

    def test_09_get_testimonial(self):
        """Test GET /api/testimonials/{id} endpoint"""
        # First create a testimonial
        testimonial_id = self.test_08_create_testimonial()
        
        # Then retrieve it
        response = requests.get(f"{API_BASE_URL}/testimonials/{testimonial_id}")
        self.assertEqual(response.status_code, 200, f"Failed to get testimonial: {response.text}")
        data = response.json()
        self.assertEqual(data["id"], testimonial_id, "ID should match")
        print(f"Testimonial retrieved successfully: {data['cliente']}")

    def test_10_update_testimonial(self):
        """Test PUT /api/testimonials/{id} endpoint"""
        # First create a testimonial
        testimonial_id = self.test_08_create_testimonial()
        
        # Then update it
        update_data = {
            "cliente": f"Updated Client {self.generate_random_string()}",
            "empresa": "Updated Company",
            "conteudo": "Updated testimonial content",
            "rating": 4
        }
        
        response = requests.put(f"{API_BASE_URL}/testimonials/{testimonial_id}", json=update_data)
        self.assertEqual(response.status_code, 200, f"Failed to update testimonial: {response.text}")
        data = response.json()
        self.assertEqual(data["cliente"], update_data["cliente"], "Cliente should be updated")
        self.assertEqual(data["empresa"], update_data["empresa"], "Empresa should be updated")
        self.assertEqual(data["conteudo"], update_data["conteudo"], "Conteudo should be updated")
        self.assertEqual(data["rating"], update_data["rating"], "Rating should be updated")
        print(f"Testimonial updated successfully: {data['cliente']}")

    def test_11_delete_testimonial(self):
        """Test DELETE /api/testimonials/{id} endpoint"""
        # First create a testimonial
        testimonial_id = self.test_08_create_testimonial()
        
        # Then delete it
        response = requests.delete(f"{API_BASE_URL}/testimonials/{testimonial_id}")
        self.assertEqual(response.status_code, 200, f"Failed to delete testimonial: {response.text}")
        data = response.json()
        self.assertIn("message", data, "Response should include a message")
        print(f"Testimonial deleted successfully: {data['message']}")
        
        # Verify it's deleted
        response = requests.get(f"{API_BASE_URL}/testimonials/{testimonial_id}")
        self.assertEqual(response.status_code, 404, "Testimonial should not exist after deletion")
        
        # Remove from cleanup list since it's already deleted
        if testimonial_id in self.__class__.testimonial_ids:
            self.__class__.testimonial_ids.remove(testimonial_id)

    def test_12_testimonial_validation(self):
        """Test validation for testimonial rating field"""
        # Test rating below minimum (1)
        test_data = {
            "cliente": "Test Client",
            "empresa": "Test Company",
            "cargo": "Developer",
            "conteudo": "Great work!",
            "rating": 0  # Invalid rating
        }
        
        response = requests.post(f"{API_BASE_URL}/testimonials", json=test_data)
        self.assertEqual(response.status_code, 422, "Should reject rating below 1")
        
        # Test rating above maximum (5)
        test_data["rating"] = 6  # Invalid rating
        response = requests.post(f"{API_BASE_URL}/testimonials", json=test_data)
        self.assertEqual(response.status_code, 422, "Should reject rating above 5")
        
        print("Testimonial validation tests passed")

    def test_13_testimonial_error_handling(self):
        """Test error handling for testimonial endpoints"""
        # Test non-existent ID
        non_existent_id = "non-existent-id"
        response = requests.get(f"{API_BASE_URL}/testimonials/{non_existent_id}")
        self.assertEqual(response.status_code, 404, "Should return 404 for non-existent ID")
        
        # Test update non-existent ID
        update_data = {"cliente": "This should fail"}
        response = requests.put(f"{API_BASE_URL}/testimonials/{non_existent_id}", json=update_data)
        self.assertEqual(response.status_code, 404, "Should return 404 when updating non-existent ID")
        
        # Test delete non-existent ID
        response = requests.delete(f"{API_BASE_URL}/testimonials/{non_existent_id}")
        self.assertEqual(response.status_code, 404, "Should return 404 when deleting non-existent ID")
        
        print("Testimonial error handling tests passed")

if __name__ == "__main__":
    unittest.main(verbosity=2)