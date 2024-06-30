from pydantic import BaseModel, EmailStr


class BaseRequest(BaseModel):
    # may define additional fields or config shared across requests
    pass


class RefreshTokenRequest(BaseRequest):
    refresh_token: str


class UserUpdatePasswordRequest(BaseRequest):
    password: str


class UserCreateRequest(BaseRequest):
    email: EmailStr
    password: str
    full_name: str
    phone_number: str
    location: str


class UserUpdateRequest(BaseModel):
    phone_number: str
    location: str


class AdCreateRequest(BaseRequest):
    title: str
    description: str
    price: int
    images: list[str]
    category: str
    sub_category: str
    condition: str
