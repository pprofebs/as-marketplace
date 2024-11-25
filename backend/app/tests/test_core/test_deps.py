from unittest.mock import AsyncMock, patch

import pytest
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import (
    api_messages,
    get_current_user,
    get_session,
)


async def test_get_current_user_user_none():
    # Mock the token payload
    mock_token_payload = AsyncMock()
    mock_token_payload.sub = "user_id_not_in_db"

    # Mock verify_jwt_token to return the mock token payload
    with patch("app.api.deps.verify_jwt_token", return_value=mock_token_payload):
        # Mock the AsyncSession and its scalar method
        mock_session = AsyncMock(spec=AsyncSession)
        mock_session.scalar.return_value = None  # Simulate user not found

        # Mock the Depends function
        with patch(
            "fastapi.Depends",
            side_effect=lambda x: mock_session
            if x == get_session
            else mock_token_payload,
        ):
            # Mock the oauth2_scheme dependency
            with patch("app.api.deps.oauth2_scheme", return_value="mock_token"):
                with pytest.raises(HTTPException) as exc_info:
                    await get_current_user(token="mock_token", session=mock_session)

                assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
                assert exc_info.value.detail == api_messages.JWT_ERROR_USER_REMOVED
