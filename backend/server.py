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
    category: str
    image_url: str
    technologies: List[str] = []
    project_url: Optional[str] = None
    github_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PortfolioCreate(BaseModel):
    title: str
    description: str
    category: str
    image_url: str
    technologies: List[str] = []
    project_url: Optional[str] = None
    github_url: Optional[str] = None

class PortfolioUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    technologies: Optional[List[str]] = None
    project_url: Optional[str] = None
    github_url: Optional[str] = None

# Testimonial Models
class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    client_company: str
    client_position: str
    content: str
    rating: int = Field(ge=1, le=5)
    avatar_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TestimonialCreate(BaseModel):
    client_name: str
    client_company: str
    client_position: str
    content: str
    rating: int = Field(ge=1, le=5)
    avatar_url: Optional[str] = None

class TestimonialUpdate(BaseModel):
    client_name: Optional[str] = None
    client_company: Optional[str] = None
    client_position: Optional[str] = None
    content: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    avatar_url: Optional[str] = None

@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/seed-data")
async def seed_portfolio_data():
    """Seed some example portfolio data for testing"""
    try:
        # Check if data already exists
        existing_count = await db.portfolio.count_documents({})
        if existing_count > 0:
            return {"message": f"Portfolio already has {existing_count} projects"}
        
        sample_projects = [
            {
                "id": str(uuid.uuid4()),
                "title": "E-commerce Platform",
                "description": "Plataforma completa de e-commerce com React e Node.js",
                "category": "Web Development",
                "image_url": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500",
                "technologies": ["React", "Node.js", "MongoDB", "Stripe"],
                "project_url": "https://demo-ecommerce.com",
                "github_url": "https://github.com/example/ecommerce",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Mobile App Dashboard",
                "description": "Dashboard administrativo para aplicativo móvel",
                "category": "Mobile Development",
                "image_url": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500",
                "technologies": ["React Native", "Firebase", "TypeScript"],
                "project_url": "https://mobile-dashboard.com",
                "github_url": "https://github.com/example/mobile-dashboard",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "AI Analytics Tool",
                "description": "Ferramenta de análise de dados com inteligência artificial",
                "category": "AI/ML",
                "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500",
                "technologies": ["Python", "TensorFlow", "FastAPI", "React"],
                "project_url": "https://ai-analytics.com",
                "github_url": "https://github.com/example/ai-analytics",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]
        
        await db.portfolio.insert_many(sample_projects)
        return {"message": f"Successfully seeded {len(sample_projects)} portfolio projects"}
    except Exception as e:
        logger.error(f"Error seeding portfolio data: {e}")
        raise HTTPException(status_code=500, detail="Error seeding data")

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

# Portfolio Endpoints
@api_router.get("/portfolio", response_model=List[Portfolio])
async def get_portfolio():
    """Get all portfolio projects"""
    try:
        projects = await db.portfolio.find().to_list(1000)
        return [Portfolio(**project) for project in projects]
    except Exception as e:
        logger.error(f"Error fetching portfolio: {e}")
        raise HTTPException(status_code=500, detail="Error fetching portfolio")

@api_router.post("/portfolio", response_model=Portfolio)
async def create_portfolio(project: PortfolioCreate):
    """Create a new portfolio project"""
    try:
        project_dict = project.dict()
        portfolio_obj = Portfolio(**project_dict)
        await db.portfolio.insert_one(portfolio_obj.dict())
        return portfolio_obj
    except Exception as e:
        logger.error(f"Error creating portfolio project: {e}")
        raise HTTPException(status_code=500, detail="Error creating project")

@api_router.get("/portfolio/{project_id}", response_model=Portfolio)
async def get_portfolio_project(project_id: str):
    """Get a specific portfolio project by ID"""
    try:
        project = await db.portfolio.find_one({"id": project_id})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return Portfolio(**project)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching project {project_id}: {e}")
        raise HTTPException(status_code=500, detail="Error fetching project")

@api_router.put("/portfolio/{project_id}", response_model=Portfolio)
async def update_portfolio_project(project_id: str, project_update: PortfolioUpdate):
    """Update a portfolio project"""
    try:
        # Get existing project
        existing_project = await db.portfolio.find_one({"id": project_id})
        if not existing_project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Update only provided fields
        update_data = {k: v for k, v in project_update.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        await db.portfolio.update_one({"id": project_id}, {"$set": update_data})
        
        # Return updated project
        updated_project = await db.portfolio.find_one({"id": project_id})
        return Portfolio(**updated_project)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating project {project_id}: {e}")
        raise HTTPException(status_code=500, detail="Error updating project")

@api_router.delete("/portfolio/{project_id}")
async def delete_portfolio_project(project_id: str):
    """Delete a portfolio project"""
    try:
        result = await db.portfolio.delete_one({"id": project_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"message": "Project deleted successfully", "deleted_id": project_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting project {project_id}: {e}")
        raise HTTPException(status_code=500, detail="Error deleting project")

# Testimonial Endpoints
@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    """Get all testimonials"""
    try:
        testimonials = await db.testimonials.find().to_list(1000)
        return [Testimonial(**testimonial) for testimonial in testimonials]
    except Exception as e:
        logger.error(f"Error fetching testimonials: {e}")
        raise HTTPException(status_code=500, detail="Error fetching testimonials")

@api_router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(testimonial: TestimonialCreate):
    """Create a new testimonial"""
    try:
        testimonial_dict = testimonial.dict()
        testimonial_obj = Testimonial(**testimonial_dict)
        await db.testimonials.insert_one(testimonial_obj.dict())
        return testimonial_obj
    except Exception as e:
        logger.error(f"Error creating testimonial: {e}")
        raise HTTPException(status_code=500, detail="Error creating testimonial")

@api_router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str):
    """Delete a testimonial"""
    try:
        result = await db.testimonials.delete_one({"id": testimonial_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Testimonial not found")
        return {"message": "Testimonial deleted successfully", "deleted_id": testimonial_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting testimonial {testimonial_id}: {e}")
        raise HTTPException(status_code=500, detail="Error deleting testimonial")

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
