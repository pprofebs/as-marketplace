import logging
import os
from typing import Any
from uuid import uuid4

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Query,
    Request,
    UploadFile,
    status,
)
from fastapi.responses import FileResponse
from sqlalchemy import desc, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api import api_messages, deps
from app.models import Ad, AdStatus, ImageUrl, User
from app.schemas.responses import AdResponse

router = APIRouter()

logging.basicConfig(level=logging.DEBUG)

UPLOAD_DIRECTORY = "uploads"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

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
    title: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    mainCategory: str = Form(...),
    subCategory: str = Form(...),
    condition: str = Form(...),
    images: list[UploadFile] = File(...),
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Ad:
    ad = await session.scalar(
        select(Ad).where(Ad.title == title).where(Ad.user_id == current_user.user_id)
    )

    if ad is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ad title already used",
        )

    new_ad = Ad(
        title=title,
        description=description,
        price=price,
        category=mainCategory,
        sub_category=subCategory,
        condition=condition,
        user_id=current_user.user_id,
        status=AdStatus.ACTIVE,
    )

    session.add(new_ad)
    await session.commit()
    await session.refresh(new_ad)

    image_urls = []
    for image in images:
        file_extension = image.filename.split(".")[-1]
        unique_filename = f"{uuid4()}.{file_extension}"
        file_path = os.path.join(UPLOAD_DIRECTORY, unique_filename)

        # Save the uploaded file
        with open(file_path, "wb") as buffer:
            buffer.write(image.file.read())

        image_url = unique_filename
        image_urls.append(ImageUrl(url=image_url, ad_id=new_ad.ad_id))

    session.add_all(image_urls)

    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error saving ad and images",
        )

    return new_ad


@router.get("/ad/{ad_id}", response_model=AdResponse, status_code=status.HTTP_200_OK)
async def get_ad(
    ad_id: str,
    request: Request,
    session: AsyncSession = Depends(deps.get_session),
) -> AdResponse:
    result = await session.execute(select(Ad).filter_by(ad_id=ad_id))
    ad = result.scalar_one_or_none()

    if ad is None:
        raise HTTPException(status_code=404, detail="Ad not found")

    # base_url = str(request.url_for("uploads", path="")).rstrip("/uploads")
    base_url = str(request.base_url).rstrip("/")
    image_urls = [{"url": f"{base_url}/images/{img.url}"} for img in ad.images]

    ad_response = AdResponse(
        ad_id=ad.ad_id,
        title=ad.title,
        price=ad.price,
        description=ad.description,
        user_id=ad.user_id,
        images=image_urls,
        category=ad.category,
        condition=ad.condition,
    )

    return ad_response


@router.put(
    "/{ad_id}/update",
    response_model=AdResponse,
    responses=AD_RESPONSES,
    status_code=status.HTTP_201_CREATED,
    description="Update an existing ad by id. Only for the ads owner.",
)
async def update_ad(
    ad_id: str,
    title: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    category: str = Form(...),
    condition: str = Form(...),
    images: list[UploadFile] | None = File(None),
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Ad:
    ad = await session.get(Ad, ad_id)
    if not ad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ad not found",
        )
    if ad.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this ad",
        )

    ad.title = title
    ad.description = description
    ad.price = price
    ad.category = category
    ad.condition = condition

    if images:
        image_urls = []
        for image in images:
            file_extension = image.filename.split(".")[-1]
            unique_filename = f"{uuid4()}.{file_extension}"
            file_path = os.path.join(UPLOAD_DIRECTORY, unique_filename)

            with open(file_path, "wb") as buffer:
                buffer.write(image.file.read())

            image_url = unique_filename
            image_urls.append(ImageUrl(url=image_url, ad_id=ad.ad_id))

        session.add_all(image_urls)

    try:
        await session.commit()
        await session.refresh(ad)
    except IntegrityError:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating ad and images",
        )

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
        logging.error(f"Ad with id {ad_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Ad not found"
        )
    if ad.user_id != current_user.user_id:
        logging.error(
            f"User {current_user.user_id} is not authorized to delete ad {ad_id}"
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized to delete ad"
        )

    await session.delete(ad)
    try:
        await session.commit()
        logging.info(f"Ad with id {ad_id} successfully deleted")
    except Exception as e:
        logging.error(f"Error committing delete transaction for ad {ad_id}: {e}")
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete ad",
        )


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


@router.get("/images/{image_filename}")
async def get_image(image_filename: str):
    file_path = os.path.join(UPLOAD_DIRECTORY, image_filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="Image not found")


@router.get(
    "/all",
    response_model=list[AdResponse],
    status_code=status.HTTP_200_OK,
    description="Get all ads sorted by their last updated time.",
)
async def get_all_ads(
    request: Request,
    session: AsyncSession = Depends(deps.get_session),
    limit: int | None = Query(None, description="Limit the number of ads returned"),
    search: str | None = Query(
        None, description="Search query for title, description, and category"
    ),
    condition: str | None = Query(None, description="Filter by condition"),
    category: str | None = Query(None, description="Filter by category"),
) -> list[AdResponse]:
    query = select(Ad).options(selectinload(Ad.images)).order_by(desc(Ad.update_time))

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Ad.title.ilike(search_term))
            | (Ad.description.ilike(search_term))
            | (Ad.category.ilike(search_term))
        )

    if condition:
        query = query.filter(Ad.condition == condition)

    if category:
        query = query.filter(Ad.category == category)

    if limit:
        query = query.limit(limit)

    ads = await session.execute(query)
    ad_responses = []

    base_url = str(request.base_url).rstrip("/")

    for ad in ads.scalars():
        image_urls = [{"url": f"{base_url}/images/{img.url}"} for img in ad.images]

        ad_response = AdResponse(
            ad_id=ad.ad_id,
            title=ad.title,
            price=ad.price,
            description=ad.description,
            user_id=ad.user_id,
            images=image_urls,
            category=ad.category,
            sub_category=ad.sub_category,
            condition=ad.condition,
        )
        ad_responses.append(ad_response)

    return ad_responses
