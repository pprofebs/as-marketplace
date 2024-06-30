from pydantic import BaseModel, ConfigDict, EmailStr


class BaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class AccessTokenResponse(BaseResponse):
    token_type: str = "Bearer"
    access_token: str
    expires_at: int
    refresh_token: str
    refresh_token_expires_at: int


class UserResponse(BaseResponse):
    full_name: str
    user_id: str
    email: EmailStr
    phone_number: str
    location: str


class ImageUrl(BaseModel):
    url: str


class AdResponse(BaseResponse):
    ad_id: str
    title: str
    description: str
    price: int
    user_id: str
    images: list[ImageUrl]
    category: str
    condition: str
    user_id: str
