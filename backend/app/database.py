"""
Database configuration for the AI Producer Assistant backend.

This module:
- Loads database connection settings from environment variables
- Creates the SQLAlchemy engine
- Configures database sessions
- Provides a dependency for accessing the database in API routes
"""

import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Load environment variables from the .env file.
load_dotenv()

# Database connection string used by SQLAlchemy.
DATABASE_URL = os.getenv("DATABASE_URL")

# Create the SQLAlchemy database engine.
engine = create_engine(DATABASE_URL)

# Factory used to create database sessions.
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Base class that all SQLAlchemy models inherit from.
Base = declarative_base()


def get_db():
    """
    Provide a database session for a request.

    This dependency creates a new database session, yields it to the
    requesting route, and ensures the session is closed when the request
    completes.
    """
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()