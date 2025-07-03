from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Portfolio Models
class Portfolio(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    image: Optional[str] = None
    technologies: List[str] = []
    status: str = "active"  # active, draft, archived
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PortfolioCreate(BaseModel):
    title: str
    description: str
    image: Optional[str] = None
    technologies: List[str] = []
    status: str = "active"

class PortfolioUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    technologies: Optional[List[str]] = None
    status: Optional[str] = None

# Testimonials Models
class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    cliente: str  # client name
    empresa: str  # company
    cargo: str    # role/position
    conteudo: str # content/testimonial text
    rating: int   # 1-5 stars
    avatar: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TestimonialCreate(BaseModel):
    cliente: str
    empresa: str
    cargo: str
    conteudo: str
    rating: int = Field(ge=1, le=5)  # rating between 1-5
    avatar: Optional[str] = None

class TestimonialUpdate(BaseModel):
    cliente: Optional[str] = None
    empresa: Optional[str] = None
    cargo: Optional[str] = None
    conteudo: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    avatar: Optional[str] = None

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Portfolio Routes
@api_router.get("/portfolio", response_model=List[Portfolio])
async def get_portfolio():
    """Get all portfolio items"""
    portfolio_items = await db.portfolio.find().to_list(1000)
    return [Portfolio(**item) for item in portfolio_items]

@api_router.post("/portfolio", response_model=Portfolio)
async def create_portfolio(item: PortfolioCreate):
    """Create a new portfolio item"""
    portfolio_dict = item.dict()
    portfolio_obj = Portfolio(**portfolio_dict)
    result = await db.portfolio.insert_one(portfolio_obj.dict())
    if result.inserted_id:
        return portfolio_obj
    raise HTTPException(status_code=400, detail="Failed to create portfolio item")

@api_router.get("/portfolio/{portfolio_id}", response_model=Portfolio)
async def get_portfolio_item(portfolio_id: str):
    """Get a specific portfolio item"""
    item = await db.portfolio.find_one({"id": portfolio_id})
    if item:
        return Portfolio(**item)
    raise HTTPException(status_code=404, detail="Portfolio item not found")

@api_router.put("/portfolio/{portfolio_id}", response_model=Portfolio)
async def update_portfolio(portfolio_id: str, update_data: PortfolioUpdate):
    """Update a portfolio item"""
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    if update_dict:
        update_dict["updated_at"] = datetime.utcnow()
        result = await db.portfolio.update_one(
            {"id": portfolio_id}, 
            {"$set": update_dict}
        )
        if result.modified_count == 1:
            updated_item = await db.portfolio.find_one({"id": portfolio_id})
            return Portfolio(**updated_item)
    raise HTTPException(status_code=404, detail="Portfolio item not found")

@api_router.delete("/portfolio/{portfolio_id}")
async def delete_portfolio(portfolio_id: str):
    """Delete a portfolio item"""
    result = await db.portfolio.delete_one({"id": portfolio_id})
    if result.deleted_count == 1:
        return {"message": "Portfolio item deleted successfully"}
    raise HTTPException(status_code=404, detail="Portfolio item not found")

# Testimonials Routes
@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    """Get all testimonials"""
    testimonials = await db.testimonials.find().to_list(1000)
    return [Testimonial(**testimonial) for testimonial in testimonials]

@api_router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(testimonial: TestimonialCreate):
    """Create a new testimonial"""
    testimonial_dict = testimonial.dict()
    testimonial_obj = Testimonial(**testimonial_dict)
    result = await db.testimonials.insert_one(testimonial_obj.dict())
    if result.inserted_id:
        return testimonial_obj
    raise HTTPException(status_code=400, detail="Failed to create testimonial")

@api_router.get("/testimonials/{testimonial_id}", response_model=Testimonial)
async def get_testimonial(testimonial_id: str):
    """Get a specific testimonial"""
    testimonial = await db.testimonials.find_one({"id": testimonial_id})
    if testimonial:
        return Testimonial(**testimonial)
    raise HTTPException(status_code=404, detail="Testimonial not found")

@api_router.put("/testimonials/{testimonial_id}", response_model=Testimonial)
async def update_testimonial(testimonial_id: str, update_data: TestimonialUpdate):
    """Update a testimonial"""
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    if update_dict:
        update_dict["updated_at"] = datetime.utcnow()
        result = await db.testimonials.update_one(
            {"id": testimonial_id}, 
            {"$set": update_dict}
        )
        if result.modified_count == 1:
            updated_testimonial = await db.testimonials.find_one({"id": testimonial_id})
            return Testimonial(**updated_testimonial)
    raise HTTPException(status_code=404, detail="Testimonial not found")

@api_router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str):
    """Delete a testimonial"""
    result = await db.testimonials.delete_one({"id": testimonial_id})
    if result.deleted_count == 1:
        return {"message": "Testimonial deleted successfully"}
    raise HTTPException(status_code=404, detail="Testimonial not found")

# Seed Data Route
@api_router.post("/seed-data")
async def seed_data():
    """Seed database with sample data"""
    # Sample portfolio data
    portfolio_samples = [
        {
            "title": "E-commerce Platform",
            "description": "Modern e-commerce solution with React and Node.js",
            "image": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop",
            "technologies": ["React", "Node.js", "MongoDB", "Stripe"],
            "status": "active"
        },
        {
            "title": "Task Management App",
            "description": "Collaborative task management with real-time updates",
            "image": "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop",
            "technologies": ["Vue.js", "Firebase", "Tailwind CSS"],
            "status": "active"
        },
        {
            "title": "Analytics Dashboard",
            "description": "Business intelligence dashboard with interactive charts",
            "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
            "technologies": ["React", "D3.js", "Python", "PostgreSQL"],
            "status": "active"
        }
    ]
    
    # Sample testimonials data
    testimonials_samples = [
        {
            "cliente": "João Silva",
            "empresa": "TechCorp Ltda",
            "cargo": "CTO",
            "conteudo": "VertexTarget entregou um projeto excepcional. A qualidade do código e atenção aos detalhes foram impressionantes.",
            "rating": 5,
            "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        },
        {
            "cliente": "Maria Santos",
            "empresa": "InnovaSoft",
            "cargo": "Product Manager",
            "conteudo": "Excelente experiência trabalhando com a VertexTarget. Entregaram no prazo e superaram expectativas.",
            "rating": 5,
            "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
        },
        {
            "cliente": "Carlos Oliveira",
            "empresa": "StartupXYZ",
            "cargo": "CEO",
            "conteudo": "Profissionais competentes e dedicados. Recomendo seus serviços sem hesitação.",
            "rating": 4,
            "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
        }
    ]
    
    # Insert portfolio samples
    for sample in portfolio_samples:
        portfolio_obj = Portfolio(**sample)
        await db.portfolio.insert_one(portfolio_obj.dict())
    
    # Insert testimonials samples
    for sample in testimonials_samples:
        testimonial_obj = Testimonial(**sample)
        await db.testimonials.insert_one(testimonial_obj.dict())
    
    return {
        "message": "Database seeded successfully",
        "portfolio_count": len(portfolio_samples),
        "testimonials_count": len(testimonials_samples)
    }

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
