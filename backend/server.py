# backend/server.py

# =============================================================================
# IMPORTS E CONFIGURAÇÕES INICIAIS
# =============================================================================
from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient # Mantemos o seu motor assíncrono
import os
import logging # Importar logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, validator
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
import re
import google.generativeai as genai
import hashlib
import asyncio
from dataclasses import dataclass
import time

# Configuração do ambiente será controlada no bloco de conexão do banco de dados
ROOT_DIR = Path(__file__).parent

# Configure logging (definido aqui para ser acessível globalmente)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# =============================================================================
# CONEXÃO COM O BANCO DE DADOS (LÓGICA DE DEPURAÇÃO AVANÇADA)
# =============================================================================

logger.info(">>> SISTEMA DE DEPURAÇÃO AVANÇADA ATIVO <<<") # Alterado para logger.info

# Método 1: Detectar ambiente e carregar .env apenas se necessário
is_render = os.getenv('RENDER') is not None
logger.info(f">>> DETECTADO RENDER: {is_render}") # Alterado para logger.info

if not is_render:
    # Só carrega .env se não estiver no Render
    load_dotenv(ROOT_DIR / '.env')
    logger.info(">>> ARQUIVO .ENV CARREGADO (DESENVOLVIMENTO LOCAL)") # Alterado para logger.info
else:
    logger.info(">>> AMBIENTE RENDER DETECTADO - IGNORANDO .ENV") # Alterado para logger.info

# Método 2: Tentar múltiplas variáveis de ambiente
MONGO_URI = None
possible_env_vars = [
    "MONGO_DB_CONNECTION_STRING",
    "MONGODB_URI", 
    "DATABASE_URL",
    "MONGO_URL",
    "MONGODB_CONNECTION_STRING"
]

logger.info(">>> TENTANDO MÚLTIPLAS VARIÁVEIS DE AMBIENTE:") # Alterado para logger.info
for var_name in possible_env_vars:
    value = os.getenv(var_name)
    logger.info(f">>> {var_name}: {value}") # Alterado para logger.info
    if value and not MONGO_URI:
        MONGO_URI = value
        logger.info(f">>> USANDO VARIÁVEL: {var_name}") # Alterado para logger.info

# Método 3: Verificar todas as variáveis de ambiente disponíveis
logger.info(">>> LISTANDO TODAS AS VARIÁVEIS DE AMBIENTE QUE CONTÊM 'MONGO':") # Alterado para logger.info
for key, value in os.environ.items():
    if 'MONGO' in key.upper():
        logger.info(f">>> ENV VAR ENCONTRADA: {key} = {value}") # Alterado para logger.info

# Método 4: Validação da string de conexão
if MONGO_URI:
    if 'mongodb+srv' in MONGO_URI:
        logger.info(">>> ✅ CONEXÃO ATLAS DETECTADA (PRODUÇÃO)") # Alterado para logger.info
    elif 'localhost' in MONGO_URI:
        logger.warning(">>> ⚠️ CONEXÃO LOCAL DETECTADA") # Alterado para logger.warning
    else:
        logger.info(">>> ❓ TIPO DE CONEXÃO DESCONHECIDO") # Alterado para logger.info

logger.info(f">>> CONEXÃO FINAL SELECIONADA: {MONGO_URI}") # Alterado para logger.info

client = None
db = None

if not MONGO_URI:
    logger.error("--- ERRO CRÍTICO: NENHUMA VARIÁVEL DE AMBIENTE MONGO ENCONTRADA") # Alterado para logger.error
else:
    try:
        client = AsyncIOMotorClient(MONGO_URI)
        db_name = os.environ.get('DB_NAME', 'vertextarget_db')
        db = client[db_name]
        logger.debug(f">>> DEBUG: Usando banco de dados: {db_name}") # Alterado para logger.debug
        logger.debug(">>> DEBUG: Cliente MongoDB criado com sucesso!") # Alterado para logger.debug
    except Exception as e:
        logger.error(f"--- ERRO CRÍTICO AO CRIAR O CLIENTE: {e}") # Alterado para logger.error


# =============================================================================
# CONFIGURAÇÕES DE SEGURANÇA E IA
# =============================================================================

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
JWT_SECRET = os.environ.get('JWT_SECRET', 'sua-chave-jwt-super-secreta-mude-em-producao')
JWT_ALGORITHM = os.environ.get('JWT_ALGORITHM', 'HS256')
JWT_EXPIRATION_MINUTES = int(os.environ.get('JWT_EXPIRATION_MINUTES', '1440'))

logger.debug(f">>> DEBUG: JWT_SECRET = {JWT_SECRET}") # Alterado para logger.debug
logger.debug(f">>> DEBUG: JWT_ALGORITHM = {JWT_ALGORITHM}") # Alterado para logger.debug
logger.debug(f">>> DEBUG: JWT_EXPIRATION_MINUTES = {JWT_EXPIRATION_MINUTES}") # Alterado para logger.debug

# Gemini AI Configuration
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# =============================================================================
# AI STRATEGY CACHE SYSTEM
# =============================================================================

@dataclass
class CacheEntry:
    strategy: str
    timestamp: datetime
    hit_count: int = 0

@dataclass
class CacheStats:
    total_entries: int
    cache_hits: int
    cache_misses: int
    hit_ratio: float
    oldest_entry: Optional[datetime] = None
    newest_entry: Optional[datetime] = None

class AIStrategyCache:
    """
    Sistema de cache em memória para estratégias de IA
    Implementa TTL (Time To Live) e estatísticas de uso
    """
    
    def __init__(self, ttl_hours: int = 24):
        self.cache: Dict[str, CacheEntry] = {}
        self.ttl_hours = ttl_hours
        self.cache_hits = 0
        self.cache_misses = 0
        
    def _generate_cache_key(self, industry: str, objective: str) -> str:
        """Gera uma chave única para a combinação industry + objective"""
        combined = f"{industry.lower().strip()}:{objective.lower().strip()}"
        return hashlib.md5(combined.encode()).hexdigest()
    
    def _is_expired(self, entry: CacheEntry) -> bool:
        """Verifica se uma entrada do cache expirou"""
        expiry_time = entry.timestamp + timedelta(hours=self.ttl_hours)
        return datetime.utcnow() > expiry_time
    
    def _cleanup_expired(self):
        """Remove entradas expiradas do cache"""
        expired_keys = [
            key for key, entry in self.cache.items() 
            if self._is_expired(entry)
        ]
        for key in expired_keys:
            del self.cache[key]
            
    async def get(self, industry: str, objective: str) -> Optional[CacheEntry]:
        """
        Busca uma estratégia no cache
        Retorna None se não encontrada ou expirada
        """
        self._cleanup_expired()
        
        cache_key = self._generate_cache_key(industry, objective)
        
        if cache_key in self.cache:
            entry = self.cache[cache_key]
            if not self._is_expired(entry):
                entry.hit_count += 1
                self.cache_hits += 1
                logger.info(f"Cache HIT para {industry}:{objective} (hit #{entry.hit_count})")
                return entry
            else:
                # Remove entrada expirada
                del self.cache[cache_key]
        
        self.cache_misses += 1
        logger.info(f"Cache MISS para {industry}:{objective}")
        return None
    
    async def set(self, industry: str, objective: str, strategy: str) -> None:
        """Armazena uma estratégia no cache"""
        cache_key = self._generate_cache_key(industry, objective)
        
        self.cache[cache_key] = CacheEntry(
            strategy=strategy,
            timestamp=datetime.utcnow(),
            hit_count=0
        )
        
        logger.info(f"Cache SET para {industry}:{objective}")
        
        # Limpeza automática de entradas expiradas a cada nova inserção
        self._cleanup_expired()
    
    def get_stats(self) -> CacheStats:
        """Retorna estatísticas do cache"""
        self._cleanup_expired()
        
        total_requests = self.cache_hits + self.cache_misses
        hit_ratio = (self.cache_hits / total_requests) if total_requests > 0 else 0.0
        
        timestamps = [entry.timestamp for entry in self.cache.values()]
        oldest = min(timestamps) if timestamps else None
        newest = max(timestamps) if timestamps else None
        
        return CacheStats(
            total_entries=len(self.cache),
            cache_hits=self.cache_hits,
            cache_misses=self.cache_misses,
            hit_ratio=round(hit_ratio, 3),
            oldest_entry=oldest,
            newest_entry=newest # <--- Adicionei as duas linhas abaixo
        )
