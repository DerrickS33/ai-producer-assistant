from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate

router = APIRouter()


@router.post("/api/projects")
def create_project(project_data: ProjectCreate, db: Session = Depends(get_db)):
    project = Project(
        title=project_data.title,
        genre=project_data.genre,
        mood=project_data.mood,
        bpm=project_data.bpm,
        key=project_data.key,
        duration_seconds=project_data.duration_seconds,
        energy=project_data.energy,
        marketing_kit=project_data.marketing_kit,
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return {
        "message": "Project saved successfully",
        "project_id": project.id,
    }


@router.get("/api/projects")
def get_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).order_by(Project.created_at.desc()).all()
    return projects


@router.delete("/api/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)
    db.commit()

    return {"message": "Project deleted successfully"}

@router.put("/api/projects/{project_id}")
def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project.title = project_data.title
    project.genre = project_data.genre
    project.mood = project_data.mood
    project.bpm = project_data.bpm
    project.key = project_data.key
    project.duration_seconds = project_data.duration_seconds
    project.energy = project_data.energy
    project.marketing_kit = project_data.marketing_kit

    db.commit()
    db.refresh(project)

    return {
        "message": "Project updated successfully",
        "project_id": project.id,
    }