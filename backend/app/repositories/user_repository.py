from sqlalchemy.orm import Session
from models.user import User as UserModel


class UserRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    async def create_user(self, user: UserModel):
        db_user = UserModel(**user.model_dump())
        self.db.add(db_user)
        await self.db.commit()
        await self.db.refresh(db_user)
        return db_user

    async def get_user(self, user_id: int):
        return await self.db.query(UserModel).filter(UserModel.id == user_id).first()

    async def update_user(self, user_id: int, updated_user: UserModel):
        db_user = await self.db.query(UserModel).filter(UserModel.id == user_id).first()
        for attr, value in updated_user.model_dump().items():
            setattr(db_user, attr, value)
        await self.db.commit()
        await self.db.refresh(db_user)
        return db_user

    async def delete_user(self, user_id: int):
        db_user = await self.db.query(UserModel).filter(UserModel.id == user_id).first()
        await self.db.delete(db_user)
        await self.db.commit()
