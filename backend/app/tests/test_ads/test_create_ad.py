from fastapi import status
from httpx import AsyncClient
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import api_messages
from app.main import app
from app.models import Ad


async def test_create_new_ad_status_code(
    client: AsyncClient,
    default_user_headers: dict[str, str],
) -> None:
    response = await client.post(
        app.url_path_for("create_new_ad"),
        headers=default_user_headers,
        json={
            "title": "test weapon",
            "description": "This is the weapons description",
            "price": 1000,
        },
    )
    assert response.status_code == status.HTTP_201_CREATED


async def test_create_new_ad_without_login(
    client: AsyncClient,
) -> None:
    response = await client.post(
        app.url_path_for("create_new_ad"),
        json={
            "title": "test weapon",
            "description": "This is another test",
            "price": 1200,
        },
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


async def test_create_new_ad_creates_record_in_db(
    client: AsyncClient,
    session: AsyncSession,
    default_user_headers: dict[str, str],
) -> None:
    _ = await client.post(
        app.url_path_for("create_new_ad"),
        headers=default_user_headers,
        json={
            "title": "my test weapon",
            "description": "This is a test description",
            "price": 1200,
        },
    )

    ad_count = await session.scalar(
        select(func.count()).where(Ad.title == "my test weapon")
    )
    assert ad_count == 1


async def test_new_ad_cannot_create_already_created_title(
    client: AsyncClient,
    default_user_headers: dict[str, str],
) -> None:
    response = await client.post(
        app.url_path_for("create_new_ad"),
        headers=default_user_headers,
        json={
            "title": "my test weapon",
            "description": "This is a test description",
            "price": 1200,
        },
    )

    assert response.status_code == status.HTTP_201_CREATED

    response = await client.post(
        app.url_path_for("create_new_ad"),
        headers=default_user_headers,
        json={
            "title": "my test weapon",
            "description": "This is a test description",
            "price": 1200,
        },
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {"detail": api_messages.AD_TITLE_ALREADY_USED}
