#!/usr/bin/env python3
"""
Script para atualizar o role do usuário admin existente
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

# Configuração do MongoDB
mongo_url = os.getenv('MONGO_DB_CONNECTION_STRING', 'mongodb://localhost:27017')
db_name = os.getenv('DB_NAME', 'vertex_target_db')

async def update_admin_role():
    """Atualiza o role do usuário admin para 'admin'"""
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    try:
        print("🔄 Atualizando role do usuário admin...")
        
        # Atualiza o usuário admin
        result = await db.users.update_one(
            {"email": "admin@vertextarget.com"},
            {"$set": {"role": "admin"}}
        )
        
        if result.modified_count > 0:
            print("✅ Role do usuário admin atualizado com sucesso!")
        else:
            print("⚠️  Nenhum usuário admin encontrado ou já possui role 'admin'")
            
        # Verifica se a atualização funcionou
        admin_user = await db.users.find_one({"email": "admin@vertextarget.com"})
        if admin_user:
            print(f"👤 Usuário: {admin_user['email']}")
            print(f"🔑 Role: {admin_user.get('role', 'não definido')}")
        
    except Exception as e:
        print(f"❌ Erro ao atualizar role: {e}")
    
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(update_admin_role())