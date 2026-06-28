from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.analysis import router as analysis_router
from app.api.marketing import router as marketing_router
from app.api.projects import router as projects_router
from app.database import Base, engine
from app.models.project import Project
from app.models.user import User
from app.api.auth import router as auth_router
from app.models.user import User


app = FastAPI()

Base.metadata.create_all(bind=engine)

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

app.include_router(analysis_router)
app.include_router(marketing_router)
app.include_router(projects_router)
app.include_router(auth_router)


@app.get("/")
def root():
    return {"message": "AI Producer Assistant API is running"}