from sqlalchemy.orm import Session


class AdRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    async def create_ad():
        pass

    async def get_ad():
        pass

    async def update_ad():
        pass