from fastapi import status
from httpx import AsyncClient
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.main import app
from app.models import Ad


async def test_create_new_ad_status_code(
    client: AsyncClient,
    default_user_headers: dict[str, str],
) -> None:
    form_data = {
        "title": "test weapon",
        "description": "This is the weapons description",
        "price": 1000,
        "mainCategory": "weapon",
        "subCategory": "sub_weapon",
        "condition": "mint",
    }

    files = [
        ("images", ("test_image1.jpg", b"fake-image-bytes-1", "image/jpeg")),
        ("images", ("test_image2.jpg", b"fake-image-bytes-2", "image/jpeg")),
    ]

    response = await client.post(
        app.url_path_for("create_new_ad"),
        headers=default_user_headers,
        data=form_data,
        files=files,
    )
    assert response.status_code == status.HTTP_201_CREATED


async def test_create_new_ad_without_login(
    client: AsyncClient,
) -> None:
    response = await client.post(
        app.url_path_for("create_new_ad"),
        json={
            "title": "test weapon",
            "description": "This is the weapons description",
            "price": 1000,
            "category": "weapon",
            "condition": "mint",
            "images": [
                "http://www.test-image.co/1234.jpg",
                "http://www.test-image.co/1234.jpg",
            ],
        },
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


async def test_create_new_ad_creates_record_in_db(
    client: AsyncClient,
    session: AsyncSession,
    default_user_headers: dict[str, str],
) -> None:
    form_data = {
        "title": "test weapon",
        "description": "This is the weapons description",
        "price": 1000,
        "mainCategory": "weapon",
        "subCategory": "sub_weapon",
        "condition": "mint",
    }

    files = [
        ("images", ("test_image1.jpg", b"fake-image-bytes-1", "image/jpeg")),
        ("images", ("test_image2.jpg", b"fake-image-bytes-2", "image/jpeg")),
    ]

    response = await client.post(
        app.url_path_for("create_new_ad"),
        headers=default_user_headers,
        data=form_data,
        files=files,
    )
    ad_count = await session.scalar(
        select(func.count()).where(Ad.title == "test weapon")
    )
    assert response.status_code == status.HTTP_201_CREATED
    assert ad_count == 1


async def test_new_ad_cannot_create_already_created_title(
    client: AsyncClient,
    default_user_headers: dict[str, str],
) -> None:
    form_data = {
        "title": "test weapon",
        "description": "This is the weapons description",
        "price": 1000,
        "mainCategory": "weapon",
        "subCategory": "sub_weapon",
        "condition": "mint",
    }

    files = [
        ("images", ("test_image1.jpg", b"fake-image-bytes-1", "image/jpeg")),
        ("images", ("test_image2.jpg", b"fake-image-bytes-2", "image/jpeg")),
    ]

    response = await client.post(
        app.url_path_for("create_new_ad"),
        headers=default_user_headers,
        data=form_data,
        files=files,
    )

    assert response.status_code == status.HTTP_201_CREATED

    form_data = {
        "title": "test weapon",
        "description": "This is the weapons description",
        "price": 1000,
        "mainCategory": "weapon",
        "subCategory": "sub_weapon",
        "condition": "mint",
    }

    files = [
        ("images", ("test_image1.jpg", b"fake-image-bytes-1", "image/jpeg")),
        ("images", ("test_image2.jpg", b"fake-image-bytes-2", "image/jpeg")),
    ]

    response = await client.post(
        app.url_path_for("create_new_ad"),
        headers=default_user_headers,
        data=form_data,
        files=files,
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {"detail": "Ad title already used"}
