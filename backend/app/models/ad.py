from pydantic import BaseModel
from typing import List


class Ad(BaseModel):
    id: int
    name: str
    description: str
    images: List[str]
    price: int
    owner_id: int
