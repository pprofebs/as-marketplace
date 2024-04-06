import uuid

from fastapi import status
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import api_messages
from app.main import app
from app.models import Ad


async def test_delete_ad_status_code(
    client: AsyncClient,
    create_ad: Ad,
    default_user_headers: dict[str, str],
) -> None:
    ad_id = create_ad.json()["ad_id"]
    response = await client.delete(
        app.url_path_for("delete_ad", ad_id=ad_id),
        headers=default_user_headers,
    )

    assert response.status_code == status.HTTP_204_NO_CONTENT


async def test_delete_ad_remove_entry_from_db(
    client: AsyncClient,
    session: AsyncSession,
    create_ad: Ad,
    default_user_headers: dict[str, str],
) -> None:
    ad_id = create_ad.json()["ad_id"]
    _ = await client.delete(
        app.url_path_for("delete_ad", ad_id=ad_id),
        headers=default_user_headers,
    )

    ad = await session.scalar(select(Ad).where(Ad.ad_id == ad_id))
    print(ad.__dict__)
    assert ad is None


async def test_delete_ad_unathorized_for_another_user(
    client: AsyncClient,
    create_ad: Ad,
    second_user_headers: dict[str, str],
) -> None:
    ad_id = create_ad.json()["ad_id"]

    response = await client.delete(
        app.url_path_for("delete_ad", ad_id=ad_id),
        headers=second_user_headers,
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.json() == {"detail": api_messages.AD_UNATHORIZED}


async def test_delete_ad_wrong_ad_id(
    client: AsyncClient,
    default_user_headers: dict[str, str],
) -> None:
    ad_id = uuid.uuid4()
    response = await client.delete(
        app.url_path_for("delete_ad", ad_id=ad_id),
        headers=default_user_headers,
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {"detail": api_messages.AD_NOT_FOUND}
