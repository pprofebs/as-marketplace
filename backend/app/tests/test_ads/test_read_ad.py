from fastapi import status
from httpx import AsyncClient
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.main import app
from app.models import Ad, User


async def test_get_all_ads_for_user_status_code(
    client: AsyncClient,
    default_user_headers: dict[str, str],
) -> None:
    response = await client.get(
        app.url_path_for("get_all_my_ads"),
        headers=default_user_headers,
    )
    assert response.status_code == status.HTTP_200_OK


async def test_get_all_ads_for_user_entry_count(
    session: AsyncSession,
    create_ad: Ad,
    default_user: User,
) -> None:
    ad_id = create_ad.json()["ad_id"]
    ad_count = await session.scalar(
        select(func.count())
        .where(Ad.ad_id == ad_id)
        .where(Ad.user_id == default_user.user_id)
    )
    assert ad_count == 1


async def test_get_all_ads_status_code(
    client: AsyncClient,
    second_user_headers: dict[str, str],
) -> None:
    _ = await client.post(
        app.url_path_for("create_new_ad"),
        headers=second_user_headers,
        json={
            "title": "test weapon",
            "description": "This is another test",
            "price": 1200,
        },
    )

    response = await client.get(
        app.url_path_for("get_all_ads"),
    )
    response.status_code == status.HTTP_200_OK


async def test_get_all_ads_return_all_ads(
    client: AsyncClient,
    create_ad: Ad,
    default_user: User,
    second_user: User,
    second_user_headers: dict[str, str],
) -> None:
    ad_response = await client.post(
        app.url_path_for("create_new_ad"),
        headers=second_user_headers,
        json={
            "title": "test weapon",
            "description": "This is another test",
            "price": 1200,
        },
    )

    response = await client.get(app.url_path_for("get_all_ads"))
    assert response.json() == [
        {
            "ad_id": create_ad.json()["ad_id"],
            "title": "test weapon",
            "description": "This is the weapons description",
            "user_id": default_user.user_id,
        },
        {
            "ad_id": ad_response.json()["ad_id"],
            "title": "test weapon",
            "description": "This is another test",
            "user_id": second_user.user_id,
        },
    ]
