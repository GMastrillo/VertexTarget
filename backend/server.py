# backend/server.py

# =============================================================================
# IMPORTS E CONFIGURAÇÕES INICIAIS
# =============================================================================
from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient  # Mantemos o seu motor assíncrono
import os
import logging
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


# =============================================================================
# CONEXÃO COM O BANCO DE DADOS (LÓGICA DE DEPURAÇÃO AVANÇADA)
# =============================================================================

print(">>> SISTEMA DE DEPURAÇÃO AVANÇADA ATIVO <<<")

# Método 1: Detectar ambiente e carregar .env apenas se necessário
is_render = os.getenv('RENDER') is not None
print(f">>> DETECTADO RENDER: {is_render}")

if not is_render:
    # Só carrega .env se não estiver no Render
    load_dotenv(ROOT_DIR / '.env')
    print(">>> ARQUIVO .ENV CARREGADO (DESENVOLVIMENTO LOCAL)")
else:
    print(">>> AMBIENTE RENDER DETECTADO - IGNORANDO .ENV")

# Método 2: Tentar múltiplas variáveis de ambiente
MONGO_URI = None
possible_env_vars = [
    "MONGO_DB_CONNECTION_STRING",
    "MONGODB_URI", 
    "DATABASE_URL",
    "MONGO_URL",
    "MONGODB_CONNECTION_STRING"
]

print(">>> TENTANDO MÚLTIPLAS VARIÁVEIS DE AMBIENTE:")
for var_name in possible_env_vars:
    value = os.getenv(var_name)
    print(f">>> {var_name}: {value}")
    if value and not MONGO_URI:
        MONGO_URI = value
        print(f">>> USANDO VARIÁVEL: {var_name}")

# Método 3: Verificar todas as variáveis de ambiente disponíveis
print(">>> LISTANDO TODAS AS VARIÁVEIS DE AMBIENTE QUE CONTÊM 'MONGO':")
for key, value in os.environ.items():
    if 'MONGO' in key.upper():
        print(f">>> ENV VAR ENCONTRADA: {key} = {value}")

# Método 4: Validação da string de conexão
if MONGO_URI:
    if 'mongodb+srv' in MONGO_URI:
        print(">>> ✅ CONEXÃO ATLAS DETECTADA (PRODUÇÃO)")
    elif 'localhost' in MONGO_URI:
        print(">>> ⚠️ CONEXÃO LOCAL DETECTADA")
    else:
        print(">>> ❓ TIPO DE CONEXÃO DESCONHECIDO")

print(f">>> CONEXÃO FINAL SELECIONADA: {MONGO_URI}")

client = None
db = None

if not MONGO_URI:
    print("--- ERRO CRÍTICO: NENHUMA VARIÁVEL DE AMBIENTE MONGO ENCONTRADA")
else:
    try:
        client = AsyncIOMotorClient(MONGO_URI)
        db_name = os.environ.get('DB_NAME', 'vertextarget_db')
        db = client[db_name]
        print(f">>> DEBUG: Usando banco de dados: {db_name}")
        print(">>> DEBUG: Cliente MongoDB criado com sucesso!")
    except Exception as e:
        print(f"--- ERRO CRÍTICO AO CRIAR O CLIENTE: {e}")


# =============================================================================
# CONFIGURAÇÕES DE SEGURANÇA E IA
# =============================================================================

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
JWT_SECRET = os.environ.get('JWT_SECRET', 'sua-chave-jwt-super-secreta-mude-em-producao')
JWT_ALGORITHM = os.environ.get('JWT_ALGORITHM', 'HS256')
JWT_EXPIRATION_MINUTES = int(os.environ.get('JWT_EXPIRATION_MINUTES', '1440'))

print(f">>> DEBUG: JWT_SECRET = {JWT_SECRET}")
print(f">>> DEBUG: JWT_ALGORITHM = {JWT_ALGORITHM}")
print(f">>> DEBUG: JWT_EXPIRATION_MINUTES = {JWT_EXPIRATION_MINUTES}")

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
            newest_entry=newest
        )
    
    def clear(self) -> int:
        """Limpa todo o cache e retorna o número de entradas removidas"""
        count = len(self.cache)
        self.cache.clear()
        logger.info(f"Cache CLEARED - {count} entradas removidas")
        return count

# Instanciar o sistema de cache (TTL de 24 horas)
ai_cache = AIStrategyCache(ttl_hours=24)

# Create the main app
app = FastAPI(
    title="VERTEX TARGET API",
    description="API para o portfólio premium da VERTEX TARGET",
    version="1.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# =============================================================================
# MODELS - Modelos Pydantic para Validação Rigorosa
# =============================================================================

# Authentication Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = Field(default="user", pattern="^(admin|user)$")
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('A senha deve ter pelo menos 8 caracteres')
        if not re.search(r'[A-Z]', v):
            raise ValueError('A senha deve conter pelo menos uma letra maiúscula')
        if not re.search(r'[a-z]', v):
            raise ValueError('A senha deve conter pelo menos uma letra minúscula')
        if not re.search(r'\d', v):
            raise ValueError('A senha deve conter pelo menos um número')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    full_name: str
    role: str = Field(default="user", pattern="^(admin|user)$")
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

# Portfolio Models
class PortfolioItemCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    category: str = Field(..., min_length=1, max_length=100)
    image: str = Field(..., description="URL da imagem ou base64")
    metric: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=500)
    technologies: List[str] = Field(..., min_items=1)
    results: Dict[str, str] = Field(..., description="Métricas de resultado")
    challenge: str = Field(..., min_length=1)
    solution: str = Field(..., min_length=1)
    outcome: str = Field(..., min_length=1)

class PortfolioItemUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    image: Optional[str] = None
    metric: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, min_length=1, max_length=500)
    technologies: Optional[List[str]] = None
    results: Optional[Dict[str, str]] = None
    challenge: Optional[str] = None
    solution: Optional[str] = None
    outcome: Optional[str] = None

class PortfolioItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    category: str
    image: str
    metric: str
    description: str
    technologies: List[str]
    results: Dict[str, str]
    challenge: str
    solution: str
    outcome: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Testimonial Models
class TestimonialCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    position: str = Field(..., min_length=1, max_length=100)
    company: str = Field(..., min_length=1, max_length=100)
    avatar: str = Field(..., description="URL do avatar ou base64")
    quote: str = Field(..., min_length=10, max_length=1000)
    rating: int = Field(..., ge=1, le=5)
    project: str = Field(..., min_length=1, max_length=100)

class TestimonialUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    position: Optional[str] = Field(None, min_length=1, max_length=100)
    company: Optional[str] = Field(None, min_length=1, max_length=100)
    avatar: Optional[str] = None
    quote: Optional[str] = Field(None, min_length=10, max_length=1000)
    rating: Optional[int] = Field(None, ge=1, le=5)
    project: Optional[str] = Field(None, min_length=1, max_length=100)

class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    position: str
    company: str
    avatar: str
    quote: str
    rating: int
    project: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Contact Models
class ContactSubmission(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    company: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, pattern=r'^[\+]?[1-9][\d]{0,15}$')
    message: str = Field(..., min_length=10, max_length=2000)
    service_interest: List[str] = Field(default=[], description="Serviços de interesse")

class ContactSubmissionResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    company: Optional[str]
    phone: Optional[str]
    message: str
    service_interest: List[str]
    status: str = Field(default="new")
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Legacy Status Check Models (mantendo compatibilidade)
class StatusCheckCreate(BaseModel):
    client_name: str = Field(..., min_length=1, max_length=100)

class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# AI Strategy Models
class AIStrategyRequest(BaseModel):
    industry: str = Field(..., min_length=1, max_length=100, description="Setor da empresa")
    objective: str = Field(..., min_length=1, max_length=100, description="Objetivo principal")

class AIStrategyResponse(BaseModel):
    strategy: str = Field(..., description="Estratégia gerada pela IA")
    cached: bool = Field(default=False, description="Indica se a resposta veio do cache")
    cache_timestamp: Optional[datetime] = Field(default=None, description="Timestamp da resposta original")

# Cache Models
class CacheStats(BaseModel):
    total_entries: int
    cache_hits: int
    cache_misses: int
    hit_ratio: float
    oldest_entry: Optional[datetime] = None
    newest_entry: Optional[datetime] = None


# =============================================================================
# AUTHENTICATION UTILITIES
# =============================================================================

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRATION_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_data = await db.users.find_one({"id": user_id})
    if user_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não encontrado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return User(**user_data)


# =============================================================================
# ROUTES - Endpoints da API
# =============================================================================

# Health Check
@api_router.get("/")
async def root():
    return {"message": "VERTEX TARGET API v1.0.0", "status": "active"}

@api_router.get("/health")
async def health_check():
    try:
        # Test database connection
        await db.command("ping")
        return {"status": "healthy", "database": "connected", "timestamp": datetime.utcnow()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database connection failed: {str(e)}"
        )

# Authentication Routes
@api_router.post("/auth/register", response_model=Token)
async def register_user(user_data: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado"
        )
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    user = User(
        email=user_data.email,
        full_name=user_data.full_name
    )
    
    user_dict = user.dict()
    user_dict["hashed_password"] = hashed_password
    
    await db.users.insert_one(user_dict)
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.post("/auth/login", response_model=Token)
async def login_user(user_credentials: UserLogin):
    user_data = await db.users.find_one({"email": user_credentials.email})
    if not user_data or not verify_password(user_credentials.password, user_data["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Criar objeto User com os dados do banco
    user = User(
        id=user_data["id"],
        email=user_data["email"],
        full_name=user_data["full_name"],
        role=user_data.get("role", "user"),  # Default para 'user' se não existir
        is_active=user_data.get("is_active", True),
        created_at=user_data.get("created_at", datetime.utcnow())
    )
    
    access_token = create_access_token(data={"sub": user_data["id"]})
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@api_router.post("/auth/register", response_model=Token)
async def register_user(user_data: UserCreate):
    # Verificar se o email já está em uso
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este email já está cadastrado"
        )
    
    # Criar hash da senha
    hashed_password = hash_password(user_data.password)
    
    # Criar novo usuário
    new_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        role=user_data.role,
        is_active=True
    )
    
    # Preparar dados para inserção no banco
    user_dict = new_user.dict()
    user_dict["hashed_password"] = hashed_password
    
    # Inserir no banco de dados
    await db.users.insert_one(user_dict)
    
    # Criar token de acesso
    access_token = create_access_token(data={"sub": new_user.id})
    
    # Retornar resposta com estrutura Token
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=new_user
    )

# Admin Users Management Routes
@api_router.get("/admin/users", response_model=List[User])
async def get_all_users(current_user: User = Depends(get_current_user)):
    # Verificar se o usuário é admin
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado. Apenas administradores podem ver usuários."
        )
    
    # Buscar todos os usuários (excluindo a senha)
    users_data = await db.users.find({}, {"hashed_password": 0}).to_list(1000)
    
    return [User(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        role=user.get("role", "user"),
        is_active=user.get("is_active", True),
        created_at=user.get("created_at", datetime.utcnow())
    ) for user in users_data]

# Portfolio Routes
@api_router.get("/portfolio", response_model=List[PortfolioItem])
async def get_portfolio_items():
    items = await db.portfolio.find().to_list(1000)
    return [PortfolioItem(**item) for item in items]

@api_router.post("/portfolio", response_model=PortfolioItem)
async def create_portfolio_item(
    item_data: PortfolioItemCreate,
    current_user: User = Depends(get_current_user)
):
    item = PortfolioItem(**item_data.dict())
    await db.portfolio.insert_one(item.dict())
    return item

@api_router.put("/portfolio/{item_id}", response_model=PortfolioItem)
async def update_portfolio_item(
    item_id: str,
    item_data: PortfolioItemUpdate,
    current_user: User = Depends(get_current_user)
):
    existing_item = await db.portfolio.find_one({"id": item_id})
    if not existing_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item do portfólio não encontrado"
        )
    
    update_data = {k: v for k, v in item_data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.portfolio.update_one({"id": item_id}, {"$set": update_data})
    
    updated_item = await db.portfolio.find_one({"id": item_id})
    return PortfolioItem(**updated_item)

@api_router.delete("/portfolio/{item_id}")
async def delete_portfolio_item(
    item_id: str,
    current_user: User = Depends(get_current_user)
):
    result = await db.portfolio.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item do portfólio não encontrado"
        )
    return {"message": "Item deletado com sucesso"}

# Testimonials Routes
@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    testimonials = await db.testimonials.find().to_list(1000)
    return [Testimonial(**testimonial) for testimonial in testimonials]

@api_router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(
    testimonial_data: TestimonialCreate,
    current_user: User = Depends(get_current_user)
):
    testimonial = Testimonial(**testimonial_data.dict())
    await db.testimonials.insert_one(testimonial.dict())
    return testimonial

@api_router.put("/testimonials/{testimonial_id}", response_model=Testimonial)
async def update_testimonial(
    testimonial_id: str,
    testimonial_data: TestimonialUpdate,
    current_user: User = Depends(get_current_user)
):
    existing_testimonial = await db.testimonials.find_one({"id": testimonial_id})
    if not existing_testimonial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Depoimento não encontrado"
        )
    
    update_data = {k: v for k, v in testimonial_data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.testimonials.update_one({"id": testimonial_id}, {"$set": update_data})
    
    updated_testimonial = await db.testimonials.find_one({"id": testimonial_id})
    return Testimonial(**updated_testimonial)

@api_router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(
    testimonial_id: str,
    current_user: User = Depends(get_current_user)
):
    result = await db.testimonials.delete_one({"id": testimonial_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Depoimento não encontrado"
        )
    return {"message": "Depoimento deletado com sucesso"}

# Contact Routes
@api_router.post("/contact", response_model=ContactSubmissionResponse)
async def submit_contact_form(contact_data: ContactSubmission):
    submission = ContactSubmissionResponse(**contact_data.dict())
    await db.contact_submissions.insert_one(submission.dict())
    
    # TODO: Implementar envio de email de notificação
    # TODO: Implementar integração com CRM
    
    return submission

@api_router.get("/contact", response_model=List[ContactSubmissionResponse])
async def get_contact_submissions(current_user: User = Depends(get_current_user)):
    submissions = await db.contact_submissions.find().to_list(1000)
    return [ContactSubmissionResponse(**submission) for submission in submissions]

# Legacy Status Check Routes (mantendo compatibilidade)
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.dict())
    await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]


# =============================================================================
# AI STRATEGY ROUTES - Geração de Estratégias com Gemini AI
# =============================================================================

@api_router.post("/v1/ai/generate-strategy", response_model=AIStrategyResponse)
async def generate_ai_strategy(
    request: AIStrategyRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Gera uma estratégia personalizada usando IA Gemini baseada no setor e objetivo.
    Endpoint protegido que exige autenticação JWT.
    Implementa sistema de cache para otimizar performance e reduzir chamadas à API.
    """
    
    # Verificar cache primeiro
    cached_entry = await ai_cache.get(request.industry, request.objective)
    if cached_entry:
        return AIStrategyResponse(
            strategy=cached_entry.strategy,
            cached=True,
            cache_timestamp=cached_entry.timestamp
        )
    
    # Verificar se a chave da API Gemini está configurada
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Serviço de IA temporariamente indisponível - chave da API não configurada"
        )
    
    try:
        # Configurar o modelo Gemini
        model = genai.GenerativeModel('gemini-1.5-pro-latest')
        
        # Criar prompt detalhado para geração de estratégia
        prompt = f"""
        Você é uma especialista em marketing digital e estratégia empresarial com mais de 15 anos de experiência. 
        Preciso que gere uma estratégia concisa e acionável para:
        
        SETOR: {request.industry}
        OBJETIVO: {request.objective}
        
        INSTRUÇÕES:
        - Crie uma estratégia específica e prática para este setor e objetivo
        - Foque em soluções que podem ser implementadas nos próximos 90 dias
        - Inclua táticas específicas de marketing digital e tecnologia
        - Use uma linguagem profissional mas acessível
        - Limite a resposta a 300 palavras
        - Estruture a resposta em tópicos claros
        
        FORMATO DA RESPOSTA:
        Forneça uma estratégia estruturada que inclua:
        1. Análise do contexto do setor
        2. Táticas específicas para atingir o objetivo
        3. Métricas-chave para acompanhar o sucesso
        4. Próximos passos recomendados
        
        Seja específico e prático na sua recomendação.
        """
        
        # Fazer a chamada para a API Gemini
        response = model.generate_content(prompt)
        
        # Verificar se a resposta foi gerada com sucesso
        if not response.text:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Erro na geração de estratégia - resposta vazia da IA"
            )
        
        # Armazenar no cache para futuras consultas
        await ai_cache.set(request.industry, request.objective, response.text)
        
        # Log da geração bem-sucedida
        logger.info(f"Estratégia gerada com sucesso para usuário {current_user.email} - Setor: {request.industry}, Objetivo: {request.objective}")
        
        return AIStrategyResponse(
            strategy=response.text,
            cached=False,
            cache_timestamp=datetime.utcnow()
        )
        
    except Exception as e:
        logger.error(f"Erro ao gerar estratégia com IA: {str(e)}")
        
        # Tratar diferentes tipos de erros
        if "API_KEY" in str(e).upper():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Erro de autenticação com o serviço de IA"
            )
        elif "QUOTA" in str(e).upper() or "LIMIT" in str(e).upper():
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Limite de uso da IA atingido - tente novamente em alguns minutos"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Erro interno do serviço de IA - tente novamente"
            )

# =============================================================================
# CACHE MANAGEMENT ROUTES - Gerenciamento do Cache de IA
# =============================================================================

@api_router.get("/v1/ai/cache/stats", response_model=CacheStats)
async def get_cache_stats(current_user: User = Depends(get_current_user)):
    """
    Retorna estatísticas detalhadas do cache de estratégias de IA.
    Endpoint protegido que exige autenticação JWT.
    """
    stats = ai_cache.get_stats()
    logger.info(f"Estatísticas do cache solicitadas por {current_user.email}")
    return stats

@api_router.delete("/v1/ai/cache/clear")
async def clear_cache(current_user: User = Depends(get_current_user)):
    """
    Limpa todo o cache de estratégias de IA.
    Endpoint protegido que exige autenticação JWT.
    """
    cleared_count = ai_cache.clear()
    logger.info(f"Cache limpo por {current_user.email} - {cleared_count} entradas removidas")
    return {
        "message": "Cache limpo com sucesso",
        "cleared_entries": cleared_count,
        "cleared_by": current_user.email,
        "timestamp": datetime.utcnow()
    }

@api_router.get("/v1/ai/cache/health")
async def get_cache_health():
    """
    Endpoint público para verificar a saúde do sistema de cache.
    Retorna informações básicas sem expor dados sensíveis.
    """
    stats = ai_cache.get_stats()
    
    # Determinar status da saúde do cache
    health_status = "healthy"
    if stats.total_entries == 0:
        health_status = "empty"
    elif stats.hit_ratio < 0.3:  # Menos de 30% de hits
        health_status = "low_efficiency"
    elif stats.total_entries > 1000:  # Muitas entradas (pode indicar problema de limpeza)
        health_status = "high_usage"
    
    return {
        "status": health_status,
        "cache_enabled": True,
        "total_entries": stats.total_entries,
        "hit_ratio": stats.hit_ratio,
        "uptime_info": {
            "oldest_entry": stats.oldest_entry,
            "newest_entry": stats.newest_entry
        }
    }

# Include the router in the main app
app.include_router(api_router)

# Lista de origens permitidas
origins = [
    "https://vertex-target.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_db_client():
    logger.info("Iniciando conexão com MongoDB...")
    try:
        await db.command("ping")
        logger.info("Conexão com MongoDB estabelecida com sucesso!")
    except Exception as e:
        logger.error(f"Erro ao conectar com MongoDB: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    logger.info("Fechando conexão com MongoDB...")
    client.close()



# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
