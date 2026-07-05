"""
Pydantic schemas used for authentication requests and responses.

These schemas validate incoming user data and define the structure of
authentication related API responses.
"""

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    """
    Request body for user registration.
    """

    email: EmailStr
    password: str = Field(min_length=8, max_length=72)


class UserLogin(BaseModel):
    """
    Request body for user login.
    """

    email: EmailStr
    password: str = Field(min_length=8, max_length=72)


class Token(BaseModel):
    """
    Response returned after successful authentication.

    Contains the JWT access token and its type.
    """

    access_token: str
    token_type: str