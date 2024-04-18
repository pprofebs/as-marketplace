import smtplib
from collections.abc import AsyncGenerator
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import api_messages
from app.core import database_session
from app.core.security.jwt import verify_jwt_token
from app.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/access-token")


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with database_session.get_async_session() as session:
        yield session


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: AsyncSession = Depends(get_session),
) -> User:
    token_payload = verify_jwt_token(token)

    user = await session.scalar(select(User).where(User.user_id == token_payload.sub))

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=api_messages.JWT_ERROR_USER_REMOVED,
        )
    return user


def send_confirmation_email(
    email: str, site_url: str, confirmation_token: str
) -> dict[str, str]:
    smtp_server = "smtp.gmail.com"
    smpt_port = 587
    smtp_username = "peterpautomation@gmail.com"
    smpt_password = "npmo qlbg pxpt ozwp "

    sender_email = ""
    subject = ""

    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = email
    message["Subject"] = subject

    confirmation_link = f"{site_url}confirm-email?token={confirmation_token}"
    body = f"Please click the following link to confirm your email address: {confirmation_link}"
    message.attach(MIMEText(body, "plain"))

    with smtplib.SMTP(smtp_server, smpt_port) as server:
        server.starttls()
        server.login(smtp_username, smpt_password)
        server.sendmail(sender_email, email, message.as_string())
