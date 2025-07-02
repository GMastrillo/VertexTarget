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

print(f"🔍 Testing JWT token structure at: {API_URL}")

def print_test_header(title):
    print(f"\n📋 {title}")
    print("=" * 50)

def print_test_result(test_name, success, details=None):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} - {test_name}")
    if details:
        print(f"    {details}")

def decode_jwt_payload(token):
    """Decode the JWT payload without verification (for testing purposes only)"""
    import base64
    import json
    
    # Split the token into header, payload, and signature
    parts = token.split('.')
    if len(parts) != 3:
        return None
    
    # Decode the payload (middle part)
    payload_b64 = parts[1]
    # Add padding if needed
    payload_b64 += '=' * (4 - len(payload_b64) % 4) if len(payload_b64) % 4 != 0 else ''
    
    try:
        payload_bytes = base64.b64decode(payload_b64)
        payload = json.loads(payload_bytes)
        return payload
    except Exception as e:
        print(f"Error decoding JWT: {e}")
        return None

def test_jwt_token_structure():
    """Test the structure of the JWT token returned by login"""
    try:
        payload = {
            "email": "admin@vertextarget.com",
            "password": "VT@admin2025!"
        }
        print(f"Attempting login to get JWT token...")
        
        response = requests.post(f"{API_URL}/auth/login", json=payload)
        
        if response.status_code == 200:
            data = response.json()
            
            if 'access_token' in data and 'token_type' in data:
                token = data['access_token']
                print(f"Received token: {token[:20]}...")
                
                # Decode the token to examine its structure
                payload = decode_jwt_payload(token)
                if payload:
                    print(f"Decoded token payload: {json.dumps(payload, indent=2)}")
                    
                    # Check for required fields in the token
                    if 'sub' in payload and 'exp' in payload:
                        print_test_result("JWT token structure", True, 
                                         f"Token contains required fields: sub={payload['sub']}, exp={payload['exp']}")
                        
                        # Calculate token expiration time
                        from datetime import datetime
                        exp_time = datetime.fromtimestamp(payload['exp'])
                        now = datetime.now()
                        hours_valid = (exp_time - now).total_seconds() / 3600
                        
                        print_test_result("JWT token expiration", True, 
                                         f"Token expires at {exp_time} (valid for {hours_valid:.1f} hours)")
                        
                        return True
                    else:
                        print_test_result("JWT token structure", False, 
                                         f"Token missing required fields. Found: {list(payload.keys())}")
                        return False
                else:
                    print_test_result("JWT token structure", False, "Failed to decode token")
                    return False
            else:
                print_test_result("JWT token structure", False, "Response missing token data")
                return False
        else:
            print_test_result("JWT token structure", False, 
                             f"Login failed: {response.status_code}, {response.text}")
            return False
    except Exception as e:
        print_test_result("JWT token structure", False, f"Test failed with error: {e}")
        return False

def run_jwt_tests():
    """Run all JWT token tests"""
    print_test_header("JWT Token Structure Tests")
    
    jwt_structure_test = test_jwt_token_structure()
    
    # Summary
    print("\n" + "="*50)
    print("📊 JWT TOKEN TEST SUMMARY:")
    print(f"  JWT Token Structure: {'✅ PASS' if jwt_structure_test else '❌ FAIL'}")
    
    print(f"\n🏁 Overall JWT Token Status: {'✅ PASS' if jwt_structure_test else '❌ FAIL'}")
    print("\n" + "="*50)
    
    return jwt_structure_test

if __name__ == "__main__":
    run_jwt_tests()