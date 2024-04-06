import uuid

from fastapi import status
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import api_messages
from app.main import app
from app.models import Ad


async def test_update_ad_status_code(
    client: AsyncClient,
    create_ad: Ad,
    default_user_headers: dict[str, str],
) -> None:
    ad_id = create_ad.json()["ad_id"]
    response = await client.put(
        app.url_path_for("update_ad", ad_id=ad_id),
        headers=default_user_headers,
        json={
            "title": "Updated weapon name",
            "description": "This is the updated weapons description",
            "price": 890,
        },
    )
    assert response.status_code == status.HTTP_201_CREATED


async def test_update_ad_modify_database_entry(
    client: AsyncClient,
    session: AsyncSession,
    create_ad: Ad,
    default_user_headers: dict[str, str],
) -> None:
    ad_id = create_ad.json()["ad_id"]

    new_data = {
        "title": "Updated weapon name",
        "description": "Updated description",
        "price": 690,
    }

    _ = await client.put(
        app.url_path_for("update_ad", ad_id=ad_id),
        headers=default_user_headers,
        json=new_data,
    )

    ad = await session.scalar(select(Ad).where(Ad.ad_id == ad_id))

    assert ad.title == new_data["title"]
    assert ad.description == new_data["description"]
    assert ad.price == new_data["price"]


async def test_update_unathorized_for_another_user(
    client: AsyncClient,
    create_ad: Ad,
    second_user_headers: dict[str, str],
) -> None:
    ad_id = create_ad.json()["ad_id"]

    response = await client.put(
        app.url_path_for("update_ad", ad_id=ad_id),
        headers=second_user_headers,
        json={
            "title": "Unathorized update",
            "description": "Updated description",
            "price": 123,
        },
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.json() == {"detail": api_messages.AD_UNATHORIZED}


async def test_update_ad_not_found(
    client: AsyncClient,
    default_user_headers: dict[str, str],
) -> None:
    ad_id = uuid.uuid4()

    response = await client.put(
        app.url_path_for("update_ad", ad_id=ad_id),
        headers=default_user_headers,
        json={
            "title": "Unathorized update",
            "description": "Updated description",
            "price": 123,
        },
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {"detail": api_messages.AD_NOT_FOUND}
