#!/usr/bin/env python3
import requests
import json
import os
import sys
import time
from datetime import datetime
import uuid

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

print(f"🔍 Testing backend at: {API_URL}")

def test_server_status():
    """Test if the server is running and responding to basic requests"""
    try:
        response = requests.get(f"{API_URL}/")
        if response.status_code == 200:
            print(f"✅ Server is running. Response: {response.json()}")
            return True
        else:
            print(f"❌ Server returned unexpected status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to connect to server: {e}")
        return False

def test_cors():
    """Test if CORS is properly configured"""
    try:
        headers = {
            'Origin': 'http://example.com',  # A different origin than the server
        }
        response = requests.get(f"{API_URL}/", headers=headers)
        
        # Check if the Access-Control-Allow-Origin header is present
        if 'Access-Control-Allow-Origin' in response.headers:
            print(f"✅ CORS is properly configured. Access-Control-Allow-Origin: {response.headers['Access-Control-Allow-Origin']}")
            return True
        else:
            print("❌ CORS headers are missing in the response")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to test CORS: {e}")
        return False

def test_status_endpoint_create():
    """Test if the status endpoint can create entries"""
    try:
        client_name = f"test-client-{uuid.uuid4()}"
        payload = {"client_name": client_name}
        
        response = requests.post(f"{API_URL}/status", json=payload)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('client_name') == client_name:
                print(f"✅ Successfully created status check. Response: {data}")
                return data
            else:
                print(f"❌ Created status check but data mismatch. Response: {data}")
                return None
        else:
            print(f"❌ Failed to create status check. Status code: {response.status_code}, Response: {response.text}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to test status endpoint: {e}")
        return None

def test_status_endpoint_get():
    """Test if the status endpoint can retrieve entries"""
    try:
        response = requests.get(f"{API_URL}/status")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print(f"✅ Successfully retrieved status checks. Count: {len(data)}")
                return True
            else:
                print(f"❌ Retrieved status checks but unexpected format. Response: {data}")
                return False
        else:
            print(f"❌ Failed to retrieve status checks. Status code: {response.status_code}, Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to test status endpoint: {e}")
        return False

def test_mongodb_connection():
    """Test if MongoDB connection is working by creating and retrieving data"""
    # Create a status check
    created_data = test_status_endpoint_create()
    if not created_data:
        return False
    
    # Retrieve status checks and verify the created one is there
    try:
        response = requests.get(f"{API_URL}/status")
        
        if response.status_code == 200:
            data = response.json()
            
            # Check if our created entry is in the list
            found = False
            for item in data:
                if item.get('id') == created_data.get('id'):
                    found = True
                    break
            
            if found:
                print("✅ MongoDB connection is working properly. Created data was retrieved successfully.")
                return True
            else:
                print("❌ MongoDB connection issue: Created data was not found in retrieved data.")
                return False
        else:
            print(f"❌ Failed to verify MongoDB connection. Status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to verify MongoDB connection: {e}")
        return False

def run_all_tests():
    """Run all tests and return overall status"""
    print("\n🔍 STARTING BACKEND TESTS\n" + "="*50)
    
    # Test server status
    print("\n📋 Testing Server Status:")
    server_status = test_server_status()
    
    # If server is not running, no point in continuing
    if not server_status:
        print("\n❌ CRITICAL ERROR: Server is not running or not accessible. Aborting further tests.")
        return False
    
    # Test CORS configuration
    print("\n📋 Testing CORS Configuration:")
    cors_status = test_cors()
    
    # Test MongoDB connection through API endpoints
    print("\n📋 Testing MongoDB Connection:")
    mongodb_status = test_mongodb_connection()
    
    # Summary
    print("\n" + "="*50)
    print("📊 TEST SUMMARY:")
    print(f"Server Status: {'✅ PASS' if server_status else '❌ FAIL'}")
    print(f"CORS Configuration: {'✅ PASS' if cors_status else '❌ FAIL'}")
    print(f"MongoDB Connection: {'✅ PASS' if mongodb_status else '❌ FAIL'}")
    
    # Overall status
    overall_status = server_status and cors_status and mongodb_status
    print(f"\nOverall Backend Status: {'✅ PASS' if overall_status else '❌ FAIL'}")
    
    return overall_status

if __name__ == "__main__":
    run_all_tests()