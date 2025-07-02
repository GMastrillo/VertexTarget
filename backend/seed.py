#!/usr/bin/env python3
"""
Seed Script para o Banco de Dados VERTEX TARGET
Este script popula o banco de dados com dados iniciais baseados no mockData.js
"""

import asyncio
import os
import sys
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from datetime import datetime
import uuid
import json

# Add the backend directory to the path to import models
sys.path.append(str(Path(__file__).parent))

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
db_name = os.environ.get('DB_NAME', 'vertextarget_db')


class SeedData:
    """Dados de seed baseados no mockData.js do frontend"""
    
    @staticmethod
    def get_portfolio_items():
        return [
            {
                "id": str(uuid.uuid4()),
                "title": "E-commerce Luxury",
                "category": "E-commerce",
                "image": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
                "metric": "Conversão +420%",
                "description": "Transformação digital completa de marca de luxo com IA personalizada",
                "technologies": ["React", "AI Recommendations", "Stripe", "Analytics"],
                "results": {
                    "conversion": "+420%",
                    "revenue": "+280%",
                    "engagement": "+156%"
                },
                "challenge": "Marca de luxo precisava de presença digital premium mantendo exclusividade",
                "solution": "Criamos experiência digital sofisticada com recomendações IA e checkout otimizado",
                "outcome": "Aumento significativo em vendas online mantendo padrão de qualidade",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "FinTech Revolution",
                "category": "FinTech",
                "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
                "metric": "Usuários +650%",
                "description": "Plataforma financeira com automação IA e segurança avançada",
                "technologies": ["Next.js", "AI Analytics", "Blockchain", "Security"],
                "results": {
                    "users": "+650%",
                    "transactions": "+890%",
                    "satisfaction": "98%"
                },
                "challenge": "Startup fintech precisava escalar rapidamente com segurança máxima",
                "solution": "Arquitetura microserviços com IA para detecção de fraudes e UX intuitiva",
                "outcome": "Crescimento exponencial de usuários com zero incidentes de segurança",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "HealthTech Platform",
                "category": "HealthTech",
                "image": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=center",
                "metric": "Eficiência +380%",
                "description": "Sistema hospitalar com IA preditiva para diagnósticos",
                "technologies": ["Vue.js", "AI Diagnostics", "IoT", "Cloud Computing"],
                "results": {
                    "efficiency": "+380%",
                    "accuracy": "+245%",
                    "satisfaction": "96%"
                },
                "challenge": "Hospital precisava otimizar diagnósticos e reduzir tempo de atendimento",
                "solution": "IA preditiva integrada com IoT para monitoramento em tempo real",
                "outcome": "Diagnósticos mais rápidos e precisos, melhorando cuidado ao paciente",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "EduTech Innovation",
                "category": "EduTech",
                "image": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
                "metric": "Engajamento +290%",
                "description": "Plataforma educacional com aprendizado adaptativo por IA",
                "technologies": ["React Native", "AI Learning", "Video Streaming", "Analytics"],
                "results": {
                    "engagement": "+290%",
                    "completion": "+185%",
                    "satisfaction": "94%"
                },
                "challenge": "Instituição educacional queria personalizar aprendizado para cada aluno",
                "solution": "IA adaptativa que ajusta conteúdo baseado no progresso individual",
                "outcome": "Estudantes mais engajados com melhor desempenho acadêmico",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]
    
    @staticmethod
    def get_testimonials():
        return [
            {
                "id": str(uuid.uuid4()),
                "name": "Carlos Mendoza",
                "position": "CEO, Luxury Brands Co.",
                "company": "Luxury Brands",
                "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                "quote": "A VERTEX TARGET transformou completamente nossa presença digital. O ROI foi imediato e o nível de sofisticação superou todas as expectativas.",
                "rating": 5,
                "project": "E-commerce Luxury",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Ana Silva",
                "position": "CTO, FinanceFlow",
                "company": "FinanceFlow",
                "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
                "quote": "A expertise em IA da equipe foi fundamental para nosso crescimento. Automatizaram processos que nunca imaginamos possível.",
                "rating": 5,
                "project": "FinTech Revolution",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Dr. Roberto Lima",
                "position": "Diretor Médico, MedCenter",
                "company": "MedCenter",
                "avatar": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face",
                "quote": "O sistema desenvolvido revolucionou nossos diagnósticos. A precisão aumentou drasticamente e os pacientes ficaram mais satisfeitos.",
                "rating": 5,
                "project": "HealthTech Platform",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]
    
    @staticmethod
    def get_admin_user():
        """Cria um usuário administrador padrão"""
        from passlib.context import CryptContext
        
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
        return {
            "id": str(uuid.uuid4()),
            "email": "admin@vertextarget.com",
            "full_name": "Administrador VERTEX TARGET",
            "hashed_password": pwd_context.hash("VT@admin2025!"),  # Senha: VT@admin2025!
            "is_active": True,
            "created_at": datetime.utcnow()
        }


class DatabaseSeeder:
    """Classe para gerenciar o seed do banco de dados"""
    
    def __init__(self):
        self.client = AsyncIOMotorClient(mongo_url)
        self.db = self.client[db_name]
        self.seed_data = SeedData()
    
    async def connect(self):
        """Testa a conexão com o banco de dados"""
        try:
            await self.db.command("ping")
            print("✅ Conexão com MongoDB estabelecida com sucesso!")
            return True
        except Exception as e:
            print(f"❌ Erro ao conectar com MongoDB: {e}")
            return False
    
    async def clear_collections(self):
        """Limpa as coleções que serão populadas"""
        collections_to_clear = ['portfolio', 'testimonials', 'users']
        
        for collection_name in collections_to_clear:
            result = await self.db[collection_name].delete_many({})
            print(f"🗑️  Limpeza da coleção '{collection_name}': {result.deleted_count} documentos removidos")
    
    async def seed_portfolio(self):
        """Popula a coleção de portfólio"""
        portfolio_items = self.seed_data.get_portfolio_items()
        
        if portfolio_items:
            result = await self.db.portfolio.insert_many(portfolio_items)
            print(f"📁 Portfólio populado: {len(result.inserted_ids)} projetos inseridos")
        else:
            print("⚠️  Nenhum item de portfólio para inserir")
    
    async def seed_testimonials(self):
        """Popula a coleção de depoimentos"""
        testimonials = self.seed_data.get_testimonials()
        
        if testimonials:
            result = await self.db.testimonials.insert_many(testimonials)
            print(f"💬 Depoimentos populados: {len(result.inserted_ids)} depoimentos inseridos")
        else:
            print("⚠️  Nenhum depoimento para inserir")
    
    async def seed_admin_user(self):
        """Cria usuário administrador padrão"""
        admin_user = self.seed_data.get_admin_user()
        
        # Verifica se já existe um usuário com este email
        existing_user = await self.db.users.find_one({"email": admin_user["email"]})
        
        if existing_user:
            print(f"👤 Usuário administrador já existe: {admin_user['email']}")
        else:
            await self.db.users.insert_one(admin_user)
            print(f"👤 Usuário administrador criado: {admin_user['email']}")
            print(f"🔑 Senha padrão: VT@admin2025!")
    
    async def create_indexes(self):
        """Cria índices para otimizar as consultas"""
        try:
            # Índices para a coleção de usuários
            await self.db.users.create_index("email", unique=True)
            
            # Índices para a coleção de portfólio
            await self.db.portfolio.create_index("category")
            await self.db.portfolio.create_index("created_at")
            
            # Índices para a coleção de depoimentos
            await self.db.testimonials.create_index("rating")
            await self.db.testimonials.create_index("created_at")
            
            # Índices para a coleção de contatos
            await self.db.contact_submissions.create_index("created_at")
            await self.db.contact_submissions.create_index("status")
            
            print("📊 Índices do banco de dados criados com sucesso!")
            
        except Exception as e:
            print(f"⚠️  Erro ao criar índices: {e}")
    
    async def run_seed(self, clear_before_seed=False):
        """Executa o processo completo de seed"""
        print("🌱 Iniciando processo de seed do banco de dados...")
        print("=" * 60)
        
        # Conecta ao banco
        if not await self.connect():
            return False
        
        try:
            # Limpa as coleções se solicitado
            if clear_before_seed:
                print("\n🧹 Limpando dados existentes...")
                await self.clear_collections()
            
            # Popula as coleções
            print("\n📥 Inserindo dados de seed...")
            await self.seed_portfolio()
            await self.seed_testimonials()
            await self.seed_admin_user()
            
            # Cria índices
            print("\n🔧 Criando índices...")
            await self.create_indexes()
            
            print("\n" + "=" * 60)
            print("✅ Processo de seed concluído com sucesso!")
            print("\n📋 Resumo:")
            print(f"   • {len(self.seed_data.get_portfolio_items())} projetos de portfólio")
            print(f"   • {len(self.seed_data.get_testimonials())} depoimentos")
            print(f"   • 1 usuário administrador")
            print(f"\n🔐 Credenciais do administrador:")
            print(f"   • Email: admin@vertextarget.com")
            print(f"   • Senha: VT@admin2025!")
            print("\n⚠️  IMPORTANTE: Altere a senha do administrador em produção!")
            
            return True
            
        except Exception as e:
            print(f"❌ Erro durante o processo de seed: {e}")
            return False
        
        finally:
            self.client.close()
    
    async def show_stats(self):
        """Mostra estatísticas do banco de dados"""
        try:
            if not await self.connect():
                return
            
            print("📊 Estatísticas do Banco de Dados")
            print("=" * 40)
            
            # Contagem de documentos por coleção
            collections = ['portfolio', 'testimonials', 'users', 'contact_submissions', 'status_checks']
            
            for collection_name in collections:
                count = await self.db[collection_name].count_documents({})
                print(f"📁 {collection_name:20} : {count:3d} documentos")
            
            print("=" * 40)
            
        except Exception as e:
            print(f"❌ Erro ao obter estatísticas: {e}")
        finally:
            self.client.close()


async def main():
    """Função principal"""
    seeder = DatabaseSeeder()
    
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == "stats":
            await seeder.show_stats()
        elif command == "clear":
            await seeder.run_seed(clear_before_seed=True)
        elif command == "seed":
            await seeder.run_seed(clear_before_seed=False)
        else:
            print("❌ Comando inválido. Use: seed, clear, ou stats")
    else:
        # Execução padrão - seed sem limpar dados existentes
        await seeder.run_seed(clear_before_seed=False)


if __name__ == "__main__":
    # Verifica se as variáveis de ambiente estão configuradas
    if not mongo_url or not db_name:
        print("❌ Erro: Variáveis de ambiente MONGO_URL e DB_NAME devem estar configuradas")
        print("💡 Verifique o arquivo .env no diretório backend/")
        sys.exit(1)
    
    print("🎯 VERTEX TARGET - Database Seeder")
    print(f"🔗 Conectando em: {mongo_url}")
    print(f"🗄️  Banco de dados: {db_name}")
    print()
    
    asyncio.run(main())