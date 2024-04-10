from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.api.api_router import ad_router, api_router, auth_router
from app.core.config import get_settings

app = FastAPI(
    title="minimal fastapi postgres template",
    version="6.0.0",
    description="https://github.com/rafsaf/minimal-fastapi-postgres-template",
    openapi_url="/openapi.json",
    docs_url="/",
)

app.include_router(auth_router)
app.include_router(api_router)
app.include_router(ad_router)

# Sets all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    # TODO: Figure out why getting this from the settings is not working
    # allow_origins=[
    #    str(origin) for origin in get_settings().security.backend_cors_origins
    # ],
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Guards against HTTP Host Header attacks
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=get_settings().security.allowed_hosts,
)
