"""
Authentication service utilities.

This module handles password hashing, password verification, JWT creation,
and authenticated user lookup for protected API routes.
"""

import os
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
)

# Configure password hashing using bcrypt.
password_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)

# Extract bearer tokens from requests to protected endpoints.
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login"
)


def hash_password(password: str) -> str:
    """
    Hash a plain-text password before storing it in the database.
    """
    return password_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """
    Compare a plain-text password against a stored password hash.
    """
    return password_context.verify(
        plain_password,
        hashed_password,
    )


def create_access_token(data: dict) -> str:
    """
    Create a signed JWT access token.

    The provided data is copied into the token payload, and an expiration
    time is added so tokens are only valid for a limited period.
    """
    token_data = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    token_data.update({"exp": expire})

    return jwt.encode(
        token_data,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    """
    Validate the request's JWT and return the authenticated user.

    This function is used as a FastAPI dependency for protected routes.
    It reads the user's email from the token subject, verifies that the
    user still exists in the database, and returns the matching User model.
    """
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        email = payload.get("sub")

        if email is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token",
            )

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
        )

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )

    return user