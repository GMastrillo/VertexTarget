#!/usr/bin/env python3
import asyncio
import os
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path('/app/backend')
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
db_name = os.environ.get('DB_NAME', 'vertextarget_db')

async def check_database():
    print(f"Connecting to MongoDB at: {mongo_url}")
    print(f"Database name: {db_name}")
    
    try:
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        
        # Test connection
        await db.command("ping")
        print("✅ Connection to MongoDB successful!")
        
        # Check collections
        collections = await db.list_collection_names()
        print(f"\nCollections in database: {collections}")
        
        # Check users collection
        users_count = await db.users.count_documents({})
        print(f"\nUsers in database: {users_count}")
        
        if users_count > 0:
            users = await db.users.find().to_list(length=10)
            print("\nUser details:")
            for user in users:
                # Remove hashed_password for security
                if 'hashed_password' in user:
                    user['hashed_password'] = '[REDACTED]'
                print(f"  - {user}")
        else:
            print("No users found in the database!")
        
        # Check portfolio collection
        portfolio_count = await db.portfolio.count_documents({})
        print(f"\nPortfolio items in database: {portfolio_count}")
        
        if portfolio_count > 0:
            portfolio_items = await db.portfolio.find().to_list(length=5)
            print("\nSample portfolio items:")
            for item in portfolio_items:
                print(f"  - ID: {item.get('id')}, Title: {item.get('title')}")
        else:
            print("No portfolio items found in the database!")
        
        # Check testimonials collection
        testimonials_count = await db.testimonials.count_documents({})
        print(f"\nTestimonials in database: {testimonials_count}")
        
        if testimonials_count > 0:
            testimonials = await db.testimonials.find().to_list(length=5)
            print("\nSample testimonials:")
            for item in testimonials:
                print(f"  - ID: {item.get('id')}, Name: {item.get('name')}")
        else:
            print("No testimonials found in the database!")
        
    except Exception as e:
        print(f"❌ Error connecting to database: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    if not mongo_url:
        print("❌ Error: MONGO_URL environment variable not set!")
        sys.exit(1)
    
    asyncio.run(check_database())