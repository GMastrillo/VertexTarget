#!/usr/bin/env python3
import requests
import json
import os
import sys

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

print(f"🔍 Testing CORS headers for health endpoint at: {API_URL}/health")

# Test with allowed origins
allowed_origins = [
    "https://vertex-target.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173"
]

for origin in allowed_origins:
    headers = {
        'Origin': origin,
    }
    response = requests.get(f"{API_URL}/health", headers=headers)
    
    print(f"\nTesting with Origin: {origin}")
    print(f"Status Code: {response.status_code}")
    
    if 'Access-Control-Allow-Origin' in response.headers:
        print(f"Access-Control-Allow-Origin: {response.headers['Access-Control-Allow-Origin']}")
        if response.headers['Access-Control-Allow-Origin'] == origin:
            print("✅ PASS: Origin is correctly allowed")
        else:
            print(f"❌ FAIL: Expected {origin}, got {response.headers['Access-Control-Allow-Origin']}")
    else:
        print("❌ FAIL: No Access-Control-Allow-Origin header found")
    
    if 'Access-Control-Allow-Credentials' in response.headers:
        print(f"Access-Control-Allow-Credentials: {response.headers['Access-Control-Allow-Credentials']}")
    
    if 'Access-Control-Allow-Methods' in response.headers:
        print(f"Access-Control-Allow-Methods: {response.headers['Access-Control-Allow-Methods']}")
    
    if 'Access-Control-Allow-Headers' in response.headers:
        print(f"Access-Control-Allow-Headers: {response.headers['Access-Control-Allow-Headers']}")

# Test with an invalid origin
invalid_origin = "https://malicious-site.com"
headers = {
    'Origin': invalid_origin,
}
response = requests.get(f"{API_URL}/health", headers=headers)

print(f"\nTesting with Invalid Origin: {invalid_origin}")
print(f"Status Code: {response.status_code}")

if 'Access-Control-Allow-Origin' in response.headers:
    print(f"Access-Control-Allow-Origin: {response.headers['Access-Control-Allow-Origin']}")
    if response.headers['Access-Control-Allow-Origin'] != invalid_origin:
        print("✅ PASS: Invalid origin is correctly rejected")
    else:
        print(f"❌ FAIL: Invalid origin {invalid_origin} was incorrectly allowed")
else:
    print("✅ PASS: No Access-Control-Allow-Origin header found (correctly rejected)")

# Test OPTIONS preflight request
print("\nTesting OPTIONS preflight request")
headers = {
    'Origin': allowed_origins[0],
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'Content-Type, Authorization'
}
response = requests.options(f"{API_URL}/health", headers=headers)

print(f"Status Code: {response.status_code}")

if 'Access-Control-Allow-Origin' in response.headers:
    print(f"Access-Control-Allow-Origin: {response.headers['Access-Control-Allow-Origin']}")
    if response.headers['Access-Control-Allow-Origin'] == allowed_origins[0]:
        print("✅ PASS: Origin is correctly allowed in preflight")
    else:
        print(f"❌ FAIL: Expected {allowed_origins[0]}, got {response.headers['Access-Control-Allow-Origin']}")
else:
    print("❌ FAIL: No Access-Control-Allow-Origin header found in preflight")

if 'Access-Control-Allow-Methods' in response.headers:
    print(f"Access-Control-Allow-Methods: {response.headers['Access-Control-Allow-Methods']}")
    if 'POST' in response.headers['Access-Control-Allow-Methods']:
        print("✅ PASS: POST method is allowed in preflight")
    else:
        print("❌ FAIL: POST method is not allowed in preflight")
else:
    print("❌ FAIL: No Access-Control-Allow-Methods header found in preflight")

if 'Access-Control-Allow-Headers' in response.headers:
    print(f"Access-Control-Allow-Headers: {response.headers['Access-Control-Allow-Headers']}")
    if 'Content-Type' in response.headers['Access-Control-Allow-Headers'] and 'Authorization' in response.headers['Access-Control-Allow-Headers']:
        print("✅ PASS: Content-Type and Authorization headers are allowed in preflight")
    else:
        print("❌ FAIL: Content-Type and Authorization headers are not allowed in preflight")
else:
    print("❌ FAIL: No Access-Control-Allow-Headers header found in preflight")

print("\n🏁 CORS Testing Complete")