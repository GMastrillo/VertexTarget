import requests
import json
import time
import uuid

# Base URL from the frontend/.env file
BASE_URL = "https://73e6abea-588c-4842-8e09-bbc928e691fd.preview.emergentagent.com/api"

def test_get_all_portfolio():
    """Test GET /api/portfolio endpoint to retrieve all portfolio projects"""
    print("\n=== Testing GET /api/portfolio ===")
    response = requests.get(f"{BASE_URL}/portfolio")
    
    print(f"Status Code: {response.status_code}")
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    
    data = response.json()
    print(f"Retrieved {len(data)} portfolio projects")
    assert isinstance(data, list), "Expected a list of portfolio projects"
    
    if len(data) > 0:
        print("Sample project data:")
        print(json.dumps(data[0], indent=2))
        
        # Verify the structure of a portfolio item
        required_fields = ["id", "title", "description", "category", "image_url", 
                          "technologies", "created_at", "updated_at"]
        for field in required_fields:
            assert field in data[0], f"Required field '{field}' missing from portfolio item"
    
    return data

def test_create_portfolio():
    """Test POST /api/portfolio endpoint to create a new portfolio project"""
    print("\n=== Testing POST /api/portfolio ===")
    
    # Create test data
    test_project = {
        "title": f"Test Project {uuid.uuid4()}",
        "description": "This is a test project created by automated testing",
        "category": "Testing",
        "image_url": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500",
        "technologies": ["Python", "FastAPI", "Testing"],
        "project_url": "https://example.com/test",
        "github_url": "https://github.com/example/test-project"
    }
    
    print(f"Creating new project: {test_project['title']}")
    response = requests.post(f"{BASE_URL}/portfolio", json=test_project)
    
    print(f"Status Code: {response.status_code}")
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    
    created_project = response.json()
    print("Created project:")
    print(json.dumps(created_project, indent=2))
    
    # Verify the created project has all required fields
    for key, value in test_project.items():
        assert created_project[key] == value, f"Field '{key}' doesn't match. Expected: {value}, Got: {created_project[key]}"
    
    # Verify additional fields were generated
    assert "id" in created_project, "Created project missing 'id' field"
    assert "created_at" in created_project, "Created project missing 'created_at' field"
    assert "updated_at" in created_project, "Created project missing 'updated_at' field"
    
    return created_project

def test_get_portfolio_by_id(project_id):
    """Test GET /api/portfolio/{id} endpoint to retrieve a specific project"""
    print(f"\n=== Testing GET /api/portfolio/{project_id} ===")
    
    response = requests.get(f"{BASE_URL}/portfolio/{project_id}")
    
    print(f"Status Code: {response.status_code}")
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    
    project = response.json()
    print("Retrieved project:")
    print(json.dumps(project, indent=2))
    
    assert project["id"] == project_id, f"Expected project with id {project_id}, got {project['id']}"
    
    return project

def test_update_portfolio(project_id):
    """Test PUT /api/portfolio/{id} endpoint to update a project"""
    print(f"\n=== Testing PUT /api/portfolio/{project_id} ===")
    
    # Update data
    update_data = {
        "title": f"Updated Test Project {uuid.uuid4()}",
        "description": "This project was updated by automated testing",
        "technologies": ["Python", "FastAPI", "Testing", "Updated"]
    }
    
    print(f"Updating project {project_id} with: {update_data}")
    response = requests.put(f"{BASE_URL}/portfolio/{project_id}", json=update_data)
    
    print(f"Status Code: {response.status_code}")
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    
    updated_project = response.json()
    print("Updated project:")
    print(json.dumps(updated_project, indent=2))
    
    # Verify the updated fields
    for key, value in update_data.items():
        assert updated_project[key] == value, f"Field '{key}' wasn't updated correctly. Expected: {value}, Got: {updated_project[key]}"
    
    # Verify the updated_at timestamp is different from created_at
    assert updated_project["updated_at"] != updated_project["created_at"], "updated_at should be different from created_at after update"
    
    return updated_project

def test_delete_portfolio(project_id):
    """Test DELETE /api/portfolio/{id} endpoint to delete a project"""
    print(f"\n=== Testing DELETE /api/portfolio/{project_id} ===")
    
    response = requests.delete(f"{BASE_URL}/portfolio/{project_id}")
    
    print(f"Status Code: {response.status_code}")
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    
    result = response.json()
    print("Delete result:")
    print(json.dumps(result, indent=2))
    
    assert result["deleted_id"] == project_id, f"Expected deleted_id to be {project_id}, got {result['deleted_id']}"
    
    # Verify the project is actually deleted by trying to get it
    verify_response = requests.get(f"{BASE_URL}/portfolio/{project_id}")
    assert verify_response.status_code == 404, f"Expected 404 after deletion, got {verify_response.status_code}"
    
    return result

def test_error_cases():
    """Test error cases for portfolio endpoints"""
    print("\n=== Testing Error Cases ===")
    
    # Test GET with non-existent ID
    non_existent_id = str(uuid.uuid4())
    print(f"\nTesting GET with non-existent ID: {non_existent_id}")
    response = requests.get(f"{BASE_URL}/portfolio/{non_existent_id}")
    print(f"Status Code: {response.status_code}")
    assert response.status_code == 404, f"Expected status code 404, got {response.status_code}"
    
    # Test PUT with non-existent ID
    print(f"\nTesting PUT with non-existent ID: {non_existent_id}")
    response = requests.put(
        f"{BASE_URL}/portfolio/{non_existent_id}", 
        json={"title": "This should fail"}
    )
    print(f"Status Code: {response.status_code}")
    assert response.status_code == 404, f"Expected status code 404, got {response.status_code}"
    
    # Test DELETE with non-existent ID
    print(f"\nTesting DELETE with non-existent ID: {non_existent_id}")
    response = requests.delete(f"{BASE_URL}/portfolio/{non_existent_id}")
    print(f"Status Code: {response.status_code}")
    assert response.status_code == 404, f"Expected status code 404, got {response.status_code}"
    
    # Test POST with invalid data (missing required fields)
    print("\nTesting POST with invalid data (missing required fields)")
    response = requests.post(
        f"{BASE_URL}/portfolio", 
        json={"title": "Incomplete Project"}  # Missing required fields
    )
    print(f"Status Code: {response.status_code}")
    assert response.status_code in [400, 422], f"Expected status code 400 or 422, got {response.status_code}"

def run_all_tests():
    """Run all portfolio endpoint tests"""
    print("Starting Portfolio API Tests...")
    
    # First, get all existing projects
    existing_projects = test_get_all_portfolio()
    
    # Create a new project
    created_project = test_create_portfolio()
    project_id = created_project["id"]
    
    # Get the project by ID
    test_get_portfolio_by_id(project_id)
    
    # Update the project
    test_update_portfolio(project_id)
    
    # Delete the project
    test_delete_portfolio(project_id)
    
    # Test error cases
    test_error_cases()
    
    print("\n=== All Portfolio API Tests Completed Successfully! ===")

if __name__ == "__main__":
    run_all_tests()