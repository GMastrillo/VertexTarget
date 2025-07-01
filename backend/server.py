from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
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


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
JWT_SECRET = os.environ.get('JWT_SECRET', 'sua-chave-jwt-super-secreta-mude-em-producao')
JWT_ALGORITHM = os.environ.get('JWT_ALGORITHM', 'HS256')
JWT_EXPIRATION_MINUTES = int(os.environ.get('JWT_EXPIRATION_MINUTES', '1440'))

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
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Token(BaseModel):
    access_token: str
    token_type: str

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
    phone: Optional[str] = Field(None, regex=r'^[\+]?[1-9][\d]{0,15}$')
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
    
    access_token = create_access_token(data={"sub": user_data["id"]})
    return {"access_token": access_token, "token_type": "bearer"}

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

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
