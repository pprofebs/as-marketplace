from pydantic import BaseModel
from typing import List

from models.ad import Ad


class User(BaseModel):
    id: int
    name: str
    email: str
    password: str
    phone_number: str
    is_customer: bool
    ads: List[Ad] = []
