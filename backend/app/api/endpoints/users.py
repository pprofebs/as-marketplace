from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.exc import NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.security.password import get_password_hash
from app.models import User
from app.schemas.requests import UserUpdatePasswordRequest, UserUpdateRequest
from app.schemas.responses import UserResponse

router = APIRouter()


@router.get("/me", response_model=UserResponse, description="Get current user")
async def read_current_user(
    current_user: User = Depends(deps.get_current_user),
) -> User:
    return current_user


@router.delete(
    "/me",
    status_code=status.HTTP_204_NO_CONTENT,
    description="Delete current user",
)
async def delete_current_user(
    current_user: User = Depends(deps.get_current_user),
    session: AsyncSession = Depends(deps.get_session),
) -> None:
    await session.execute(delete(User).where(User.user_id == current_user.user_id))
    await session.commit()


@router.put(
    "/me", status_code=status.HTTP_200_OK, description="Update current user information"
)
async def update_current_user(
    update_request: UserUpdateRequest,
    current_user: User = Depends(deps.get_current_user),
    session: AsyncSession = Depends(deps.get_session),
) -> None:
    try:
        stmt = select(User).where(User.user_id == current_user.user_id)
        result = await session.execute(stmt)
        user = result.scalar_one()

        # Update user information with values from the update_request
        user.full_name = user.full_name
        user.email = user.email
        user.phone_number = update_request.phone_number
        user.location = update_request.location

        await session.commit()
    except NoResultFound:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    except Exception:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error",
        )


@router.post(
    "/reset-password",
    status_code=status.HTTP_204_NO_CONTENT,
    description="Update current user password",
)
async def reset_current_user_password(
    user_update_password: UserUpdatePasswordRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> None:
    current_user.hashed_password = get_password_hash(user_update_password.password)
    session.add(current_user)
    await session.commit()


@router.get(
    "/user/{user_id}",
    response_model=UserResponse,
    description="Get user information based on user id.",
)
async def get_user(
    user_id: str,
    session: AsyncSession = Depends(deps.get_session),
) -> UserResponse:
    result = await session.execute(select(User).filter_by(user_id=user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse.model_validate(user)
