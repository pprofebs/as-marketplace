import secrets

from fastapi import status
from httpx import AsyncClient
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import api_messages
from app.main import app
from app.models import User


async def test_register_new_user_status_code(
    client: AsyncClient,
) -> None:
    response = await client.post(
        app.url_path_for("register_new_user"),
        json={
            "email": "test@email.com",
            "password": "testtesttest",
            "full_name": "test edward",
            "phone_number": "+3612345678",
            "location": "Debrecen",
        },
    )

    assert response.status_code == status.HTTP_201_CREATED


async def test_register_new_user_creates_record_in_db(
    client: AsyncClient,
    session: AsyncSession,
) -> None:
    await client.post(
        app.url_path_for("register_new_user"),
        json={
            "email": "test@email.com",
            "password": "testtesttest",
            "full_name": "test edward",
            "phone_number": "+3612345678",
            "location": "Debrecen",
        },
    )

    user_count = await session.scalar(
        select(func.count()).where(User.email == "test@email.com")
    )
    assert user_count == 1


async def test_register_new_user_cannot_create_already_created_user(
    client: AsyncClient,
    session: AsyncSession,
) -> None:
    user = User(
        email="test@email.com",
        hashed_password="bla",
        full_name="test edward",
        phone_number="+36301234567",
        location="Debrecen",
    )
    session.add(user)
    await session.commit()

    response = await client.post(
        app.url_path_for("register_new_user"),
        json={
            "email": "test@email.com",
            "password": "testtesttest",
            "full_name": "test edward",
            "phone_number": "+3612345678",
            "location": "Debrecen",
        },
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {"detail": api_messages.EMAIL_ADDRESS_ALREADY_USED}


async def test_new_user_email_confirmation(
    client: AsyncClient,
    session: AsyncSession,
) -> None:
    token = secrets.token_urlsafe(32)
    user = User(
        email="test@email.com",
        hashed_password="bla",
        full_name="test edward",
        phone_number="+36123456789",
        location="Debrecen",
        is_customer=False,
        is_active=False,
        confirmation_token=token,
    )
    session.add(user)
    await session.commit()

    response = await client.get(
        app.url_path_for("confirm_email", token=token),
    )
