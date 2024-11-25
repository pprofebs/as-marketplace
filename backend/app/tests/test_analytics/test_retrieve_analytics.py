import pytest
from httpx import AsyncClient

from app.main import app


@pytest.mark.asyncio
async def test_get_uploaded_ads_today(
    client: AsyncClient, create_ad, default_user_headers: dict[str, str]
) -> None:
    _ = create_ad
    response = await client.get(app.url_path_for("get_uploaded_ads"))

    assert response.status_code == 200
    assert response.json() == {"uploaded_ads_today": 1}

    ad_id = create_ad.json()["ad_id"]

    _ = await client.delete(
        app.url_path_for("delete_ad", ad_id=ad_id),
        headers=default_user_headers,
    )

    _ = create_ad
    response = await client.get(app.url_path_for("get_uploaded_ads"))

    assert response.status_code == 200
    assert response.json() == {"uploaded_ads_today": 0}
