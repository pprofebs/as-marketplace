from fastapi import APIRouter

from app.api import api_messages
from app.api.endpoints import ads, analytics, auth, categories, users

auth_router = APIRouter()
auth_router.include_router(auth.router, prefix="/auth", tags=["auth"])

api_router = APIRouter(
    responses={
        401: {
            "description": "No `Authorization` access token header, token is invalid or user removed",
            "content": {
                "application/json": {
                    "examples": {
                        "not authenticated": {
                            "summary": "No authorization token header",
                            "value": {"detail": "Not authenticated"},
                        },
                        "invalid token": {
                            "summary": "Token validation failed, decode failed, it may be expired or malformed",
                            "value": {"detail": "Token invalid: {detailed error msg}"},
                        },
                        "removed user": {
                            "summary": api_messages.JWT_ERROR_USER_REMOVED,
                            "value": {"detail": api_messages.JWT_ERROR_USER_REMOVED},
                        },
                    }
                }
            },
        },
    }
)
api_router.include_router(users.router, prefix="/users", tags=["users"])

ad_router = APIRouter()
ad_router.include_router(ads.router, prefix="/ads", tags=["ads"])

categories_router = APIRouter()
categories_router.include_router(categories.router, tags=["categories"])

analytics_router = APIRouter()
analytics_router.include_router(
    analytics.router, prefix="/analytics", tags=["analytics"]
)
