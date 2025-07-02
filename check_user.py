#!/usr/bin/env python3
import asyncio
import motor.motor_asyncio
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path('/app/backend')
load_dotenv(ROOT_DIR / '.env')

async def check_user():
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME', 'vertex_target_db')
    print(f"Connecting to MongoDB at: {mongo_url}")
    print(f"Using database: {db_name}")
    
    client = motor.motor_asyncio.AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # List all collections
    collections = await db.list_collection_names()
    print(f"Collections in database: {collections}")
    
    # Check if users collection exists
    if 'users' in collections:
        # Count users
        user_count = await db.users.count_documents({})
        print(f"Total users in database: {user_count}")
        
        # Find admin user
        user = await db.users.find_one({'email': 'admin@vertextarget.com'})
        print(f'Admin user found: {user is not None}')
        
        if user:
            print(f'User ID: {user.get("id")}')
            print(f'User email: {user.get("email")}')
            print(f'Hashed password: {user.get("hashed_password")}')
            print(f'Is active: {user.get("is_active")}')
            print(f'Created at: {user.get("created_at")}')
    else:
        print("Users collection does not exist in the database")

if __name__ == "__main__":
    asyncio.run(check_user())