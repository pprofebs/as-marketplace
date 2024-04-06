import asyncio
import os
from collections.abc import AsyncGenerator, Generator

import pytest
import pytest_asyncio
import sqlalchemy
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
)

from app.core import database_session
from app.core.config import get_settings
from app.core.security.jwt import create_jwt_token
from app.core.security.password import get_password_hash
from app.main import app
from app.main import app as fastapi_app
from app.models import Ad, Base, User

default_user_id = "b75365d9-7bf9-4f54-add5-aeab333a087b"
default_user_email = "geralt@wiedzmin.pl"
default_user_password = "geralt"
default_user_full_name = "geralt of rivia"
default_user_is_customer = False
default_user_access_token = create_jwt_token(default_user_id).access_token

second_user_id = "b75365d9-7bf9-4f54-add5-aeab333a087c"
second_user_email = "jean@wiedzmin.pl"
second_user_password = "jean"
second_user_full_name = "jean of rivia"
second_user_is_customer = False
second_user_access_token = create_jwt_token(second_user_id).access_token


@pytest.fixture(scope="session")
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session", autouse=True)
async def fixture_setup_new_test_database() -> None:
    worker_name = os.getenv("PYTEST_XDIST_WORKER", "gw0")
    test_db_name = f"test_db_{worker_name}"

    # create new test db using connection to current database
    conn = await database_session._ASYNC_ENGINE.connect()
    await conn.execution_options(isolation_level="AUTOCOMMIT")
    await conn.execute(sqlalchemy.text(f"DROP DATABASE IF EXISTS {test_db_name}"))
    await conn.execute(sqlalchemy.text(f"CREATE DATABASE {test_db_name}"))
    await conn.close()

    session_mpatch = pytest.MonkeyPatch()
    session_mpatch.setenv("DATABASE__DB", test_db_name)
    session_mpatch.setenv("SECURITY__PASSWORD_BCRYPT_ROUNDS", "4")

    # force settings to use now monkeypatched environments
    get_settings.cache_clear()

    # monkeypatch test database engine
    engine = database_session.new_async_engine(get_settings().sqlalchemy_database_uri)

    session_mpatch.setattr(
        database_session,
        "_ASYNC_ENGINE",
        engine,
    )
    session_mpatch.setattr(
        database_session,
        "_ASYNC_SESSIONMAKER",
        async_sessionmaker(engine, expire_on_commit=False),
    )

    # create app tables in test database
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@pytest_asyncio.fixture(scope="function", autouse=True)
async def fixture_clean_get_settings_between_tests() -> AsyncGenerator[None, None]:
    yield

    get_settings.cache_clear()


@pytest_asyncio.fixture(name="default_hashed_password", scope="session")
async def fixture_default_hashed_password() -> str:
    return get_password_hash(default_user_password)


@pytest_asyncio.fixture(name="second_hashed_password", scope="session")
async def fixture_second_hashed_password() -> str:
    return get_password_hash(second_user_password)


@pytest_asyncio.fixture(name="session", scope="function")
async def fixture_session_with_rollback(
    monkeypatch: pytest.MonkeyPatch,
) -> AsyncGenerator[AsyncSession, None]:
    # we want to monkeypatch get_async_session with one bound to session
    # that we will always rollback on function scope

    connection = await database_session._ASYNC_ENGINE.connect()
    transaction = await connection.begin()

    session = AsyncSession(bind=connection, expire_on_commit=False)

    monkeypatch.setattr(
        database_session,
        "get_async_session",
        lambda: session,
    )

    yield session

    await session.close()
    await transaction.rollback()
    await connection.close()


@pytest_asyncio.fixture(name="client", scope="function")
async def fixture_client(session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    transport = ASGITransport(app=fastapi_app)  # type: ignore
    async with AsyncClient(transport=transport, base_url="http://test") as aclient:
        aclient.headers.update({"Host": "localhost"})
        yield aclient


@pytest_asyncio.fixture(name="default_user", scope="function")
async def fixture_default_user(
    session: AsyncSession, default_hashed_password: str
) -> User:
    default_user = User(
        user_id=default_user_id,
        email=default_user_email,
        hashed_password=default_hashed_password,
        full_name=default_user_full_name,
        is_customer=default_user_is_customer,
    )
    session.add(default_user)
    await session.commit()
    await session.refresh(default_user)
    return default_user


@pytest_asyncio.fixture(name="second_user", scope="function")
async def fixture_second_user(
    session: AsyncSession, second_hashed_password: str
) -> User:
    second_user = User(
        user_id=second_user_id,
        email=second_user_email,
        hashed_password=second_hashed_password,
        full_name=second_user_full_name,
        is_customer=second_user_is_customer,
    )
    session.add(second_user)
    await session.commit()
    await session.refresh(second_user)
    return second_user


@pytest.fixture(name="default_user_headers", scope="function")
def fixture_default_user_headers(default_user: User) -> dict[str, str]:
    return {"Authorization": f"Bearer {default_user_access_token}"}


@pytest.fixture(name="second_user_headers", scope="function")
def fixture_second_user_headers(second_user: User) -> dict[str, str]:
    return {"Authorization": f"Bearer {second_user_access_token}"}


@pytest_asyncio.fixture(name="create_ad", scope="function")
async def fixture_create_ad(
    client: AsyncClient,
    default_user_headers: dict[str, str],
) -> Ad:
    response = await client.post(
        app.url_path_for("create_new_ad"),
        headers=default_user_headers,
        json={
            "title": "test weapon",
            "description": "This is the weapons description",
            "price": 1000,
        },
    )
    return response
