from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import api_messages, deps
from app.models import Ad, User
from app.schemas.requests import AdCreateRequest
from app.schemas.responses import AdResponse

router = APIRouter()

AD_RESPONSES: dict[int | str, dict[str, Any]] = {
    403: {
        "description": "User is not the owner of the ad",
        "content": {
            "application/json": {
                "examples": {
                    "do not have priviliges to modify ad": {
                        "summary": api_messages.AD_UNATHORIZED,
                        "value": {"detail": api_messages.AD_UNATHORIZED},
                    },
                }
            }
        },
    },
    404: {
        "description": "Ad not found",
        "content": {
            "application/json": {
                "examples": {
                    "ad not found": {
                        "summary": api_messages.AD_NOT_FOUND,
                        "value": {"detail": api_messages.AD_NOT_FOUND},
                    }
                }
            }
        },
    },
}


@router.post(
    "/create",
    response_model=AdResponse,
    status_code=status.HTTP_201_CREATED,
    description="Creates a new ad. Only for logged in users.",
)
async def create_new_ad(
    data: AdCreateRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Ad:
    ad = await session.scalar(
        select(Ad)
        .where(Ad.title == data.title)
        .where(Ad.user_id == current_user.user_id)
    )

    if ad is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=api_messages.AD_TITLE_ALREADY_USED,
        )

    new_ad = Ad(
        title=data.title,
        description=data.description,
        price=data.price,
        user_id=current_user.user_id,
    )

    session.add(new_ad)

    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()

    return new_ad


@router.put(
    "/{ad_id}/update",
    response_model=AdResponse,
    responses=AD_RESPONSES,
    status_code=status.HTTP_201_CREATED,
    description="Update an existing ad by id. Only for the ads owner.",
)
async def update_ad(
    ad_id: str,
    data: AdCreateRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Ad:
    ad = await session.get(Ad, ad_id)
    if not ad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=api_messages.AD_NOT_FOUND,
        )
    if ad.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=api_messages.AD_UNATHORIZED,
        )
    ad.title = data.title
    ad.description = data.description
    ad.price = data.price

    await session.commit()
    return ad


@router.delete(
    "/{ad_id}/delete",
    status_code=status.HTTP_204_NO_CONTENT,
    description="Delete an existing ad by id. Only for the owner of the ad.",
)
async def delete_ad(
    ad_id: str,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> None:
    ad = await session.get(Ad, ad_id)
    if not ad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=api_messages.AD_NOT_FOUND
        )
    if ad.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail=api_messages.AD_UNATHORIZED
        )

    session.delete(ad)
    await session.commit()


@router.get(
    "/me",
    response_model=list[AdResponse],
    status_code=status.HTTP_200_OK,
    description="Get a list of ads for currently logged in user.",
)
async def get_all_my_ads(
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> list[Ad]:
    ads = await session.scalars(
        select(Ad).where(Ad.user_id == current_user.user_id).order_by(Ad.update_time)
    )
    return list(ads.all())


@router.get(
    "/all",
    response_model=list[AdResponse],
    status_code=status.HTTP_200_OK,
    description="Get all ads sorted by their last updated time.",
)
async def get_all_ads(session: AsyncSession = Depends(deps.get_session)) -> list[Ad]:
    ads = await session.execute(select(Ad).order_by(desc(Ad.update_time)))
    return [AdResponse.model_validate(ad) for ad in ads.scalars()]
