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
    form_data = {
        "title": "another test weapon",
        "description": "This is the weapons description",
        "price": 1200,
        "mainCategory": "weapon",
        "subCategory": "sub_weapon",
        "condition": "mint",
    }

    files = [
        ("images", ("test_image1.jpg", b"fake-image-bytes-1", "image/jpeg")),
        ("images", ("test_image2.jpg", b"fake-image-bytes-2", "image/jpeg")),
    ]

    ad_response = await client.post(
        app.url_path_for("create_new_ad"),
        headers=second_user_headers,
        data=form_data,
        files=files,
    )

    response = await client.get(app.url_path_for("get_all_ads"))
    assert len(response.json()) == 2

    expected_response_part1 = {
        "ad_id": create_ad.json()["ad_id"],
        "title": "test weapon",
        "description": "This is the weapons description",
        "price": 1000,
        "user_id": default_user.user_id,
        "category": "weapon",
        "condition": "mint",
    }

    expected_response_part2 = {
        "ad_id": ad_response.json()["ad_id"],
        "title": "another test weapon",
        "description": "This is the weapons description",
        "price": 1200,
        "user_id": second_user.user_id,
        "category": "weapon",
        "condition": "mint",
    }

    response_data = response.json()

    assert {
        key: response_data[0][key] for key in expected_response_part1
    } == expected_response_part1
    assert {
        key: response_data[1][key] for key in expected_response_part2
    } == expected_response_part2
