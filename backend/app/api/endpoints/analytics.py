from datetime import date, datetime

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api import deps
from app.models import Ad, AdClick
from app.schemas.responses import AdClicks

router = APIRouter()


@router.get("/uploaded-ads")
async def get_uploaded_ads(session: AsyncSession = Depends(deps.get_session)):
    try:
        today_start = datetime.combine(date.today(), datetime.min.time())
        today_end = datetime.combine(date.today(), datetime.max.time())

        stmt = select(func.count(Ad.ad_id)).filter(
            Ad.create_time >= today_start, Ad.create_time <= today_end
        )

        result = await session.execute(stmt)
        ads_uploaded_today = result.scalar()

        return {"uploaded_ads_today": ads_uploaded_today}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ads/{ad_id}/click")
async def track_click(
    ad_id: str,
    guest_uuid: str = None,
    user_id: str = None,
    session: AsyncSession = Depends(deps.get_session),
):
    # Check if the ad exists
    result = await session.execute(select(Ad).where(Ad.ad_id == ad_id))
    ad = result.scalars().first()
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")

    # Track the click
    click = AdClick(ad_id=ad_id, user_id=user_id, guest_uuid=guest_uuid)
    session.add(click)
    await session.commit()

    return {"message": "Click tracked successfully"}


@router.get("/ads/{ad_id}/clicks")
async def get_clicks(ad_id: str, session: AsyncSession = Depends(deps.get_session)):
    # Get distinct guest clicks
    result = await session.execute(
        select(AdClick.guest_uuid).where(AdClick.ad_id == ad_id).distinct()
    )
    guest_clicks = result.scalars().all()

    # Get distinct user clicks
    result = await session.execute(
        select(AdClick.user_id).where(AdClick.ad_id == ad_id).distinct()
    )
    user_clicks = result.scalars().all()

    # Calculate unique clicks
    unique_clicks = len(guest_clicks) + len(user_clicks)
    return {"unique_clicks": unique_clicks}


@router.get("/ads/clicks", response_model=list[AdClicks])
async def get_all_ads_clicks(session: AsyncSession = Depends(deps.get_session)):
    # Fetch unique guest_uuid clicks for all ads
    guest_clicks_query = select(
        AdClick.ad_id,
        func.count(func.distinct(AdClick.guest_uuid)).label("unique_guest_clicks"),
    ).group_by(AdClick.ad_id)
    guest_clicks_result = await session.execute(guest_clicks_query)
    guest_clicks = guest_clicks_result.all()

    # Fetch unique user_id clicks for all ads
    user_clicks_query = select(
        AdClick.ad_id,
        func.count(func.distinct(AdClick.user_id)).label("unique_user_clicks"),
    ).group_by(AdClick.ad_id)
    user_clicks_result = await session.execute(user_clicks_query)
    user_clicks = user_clicks_result.all()

    # Combine guest and user clicks for each ad
    ad_clicks = {}
    for ad_id, unique_guest_clicks in guest_clicks:
        if ad_id not in ad_clicks:
            ad_clicks[ad_id] = 0
        ad_clicks[ad_id] += unique_guest_clicks

    for ad_id, unique_user_clicks in user_clicks:
        if ad_id not in ad_clicks:
            ad_clicks[ad_id] = 0
        ad_clicks[ad_id] += unique_user_clicks

    # Prepare the response
    ad_clicks_list = [
        {"ad_id": ad_id, "unique_clicks": total_clicks}
        for ad_id, total_clicks in ad_clicks.items()
    ]

    return ad_clicks_list
