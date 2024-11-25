import uuid
from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import (
    BigInteger,
    Boolean,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    String,
    Uuid,
    func,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    create_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    update_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class User(Base):
    __tablename__ = "user_account"

    user_id: Mapped[str] = mapped_column(
        Uuid(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )
    email: Mapped[str] = mapped_column(
        String(256), nullable=False, unique=True, index=True
    )
    hashed_password: Mapped[str] = mapped_column(String(128), nullable=False)

    refresh_tokens: Mapped[list["RefreshToken"]] = relationship(back_populates="user")
    confirmation_token: Mapped[str] = mapped_column(String, nullable=True)
    full_name: Mapped[str] = mapped_column(String(100))
    phone_number: Mapped[str] = mapped_column(String(32))
    location: Mapped[str] = mapped_column(String(100))
    is_customer: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False)
    ads: Mapped[list["Ad"]] = relationship("Ad", back_populates="user")


class RefreshToken(Base):
    __tablename__ = "refresh_token"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    refresh_token: Mapped[str] = mapped_column(
        String(512), nullable=False, unique=True, index=True
    )
    used: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    exp: Mapped[int] = mapped_column(BigInteger, nullable=False)
    user_id: Mapped[str] = mapped_column(
        ForeignKey("user_account.user_id", ondelete="CASCADE"),
    )
    user: Mapped["User"] = relationship(back_populates="refresh_tokens")


class AdStatus(PyEnum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SOLD = "sold"


class Ad(Base):
    __tablename__ = "ads"

    ad_id: Mapped[str] = mapped_column(
        Uuid(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    description: Mapped[str] = mapped_column(String(1000), nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    user_id: Mapped[str] = mapped_column(
        Uuid(as_uuid=False), ForeignKey("user_account.user_id"), nullable=False
    )
    user: Mapped["User"] = relationship("User", back_populates="ads")
    images: Mapped[list["ImageUrl"]] = relationship(
        "ImageUrl", back_populates="ad", cascade="all, delete-orphan", lazy="selectin"
    )
    category: Mapped[str] = mapped_column(String(256), nullable=False)
    sub_category: Mapped[str] = mapped_column(String(256), nullable=False)
    condition: Mapped[str] = mapped_column(String(256), nullable=False)
    clicks: Mapped[list["AdClick"]] = relationship(
        "AdClick",
        back_populates="ad",
        cascade="all, delete-orphan",  # Added cascade behavior
    )
    status: Mapped[AdStatus] = mapped_column(
        Enum(AdStatus), nullable=False, default=AdStatus.ACTIVE
    )


class AdClick(Base):
    __tablename__ = "ad_clicks"

    click_id: Mapped[str] = mapped_column(
        Uuid(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )
    ad_id: Mapped[str] = mapped_column(
        Uuid(as_uuid=False),
        ForeignKey("ads.ad_id", ondelete="CASCADE"),
        nullable=False,  # Added CASCADE
    )
    ad: Mapped["Ad"] = relationship("Ad", back_populates="clicks")
    user_id: Mapped[str] = mapped_column(String(256), nullable=True)
    guest_uuid: Mapped[str] = mapped_column(String(256), nullable=True)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class ImageUrl(Base):
    __tablename__ = "images"

    id: Mapped[str] = mapped_column(
        Uuid(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )
    url: Mapped[str] = mapped_column(String(256), nullable=False)
    ad_id: Mapped[str] = mapped_column(
        Uuid(as_uuid=False), ForeignKey("ads.ad_id"), nullable=False
    )
    ad: Mapped["Ad"] = relationship("Ad", back_populates="images")
