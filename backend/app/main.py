"""
Main entry point for the AI Producer Assistant backend.

This module initializes the FastAPI application, configures middleware,
creates database tables, and registers API route modules.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.analysis import router as analysis_router
from app.api.auth import router as auth_router
from app.api.marketing import router as marketing_router
from app.api.projects import router as projects_router
from app.database import Base, engine

# Import models so SQLAlchemy registers them before table creation.
from app.models.project import Project
from app.models.user import User

# Create FastAPI application instance.
app = FastAPI()

# Create database tables if they do not already exist.
Base.metadata.create_all(bind=engine)

# Configure CORS to allow requests from the frontend application.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://ai-producer-assistant.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API route modules.
app.include_router(analysis_router)
app.include_router(marketing_router)
app.include_router(projects_router)
app.include_router(auth_router)


@app.get("/")
def root():
    """
    Health check endpoint used to verify that the API is running.
    """
    return {"message": "AI Producer Assistant API is running"}