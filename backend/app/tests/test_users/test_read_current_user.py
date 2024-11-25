from fastapi import status
from httpx import AsyncClient

from app.main import app
from app.tests.conftest import (
    default_user_email,
    default_user_full_name,
    default_user_id,
    default_user_location,
    default_user_phone_number,
)


async def test_read_current_user_status_code(
    client: AsyncClient, default_user_headers: dict[str, str]
) -> None:
    response = await client.get(
        app.url_path_for("read_current_user"),
        headers=default_user_headers,
    )

    assert response.status_code == status.HTTP_200_OK


async def test_read_current_user_response(
    client: AsyncClient, default_user_headers: dict[str, str]
) -> None:
    response = await client.get(
        app.url_path_for("read_current_user"),
        headers=default_user_headers,
    )

    assert response.json() == {
        "user_id": default_user_id,
        "email": default_user_email,
        "full_name": default_user_full_name,
        "location": default_user_location,
        "phone_number": default_user_phone_number,
    }
