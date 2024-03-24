from fastapi import APIRouter
from fastapi.exceptions import HTTPException

from models.user import User


router = APIRouter()

users = []


@router.post("/user/create")
async def create_user(user: User):
    users.append(user)
    return user


@router.get("/user/{user_id}")
async def get_user(user_id: int):
    for user in users:
        if user.id == user_id:
            return user
    raise HTTPException(status_code=404, detail="User not found.")


@router.put("user/{user_id}/update")
async def update_user(user_id: int, updated_user: User):
    for i, user in enumerate(users):
        if user.id == user_id:
            users[i] = updated_user
            return {"message": "User updated successfully."}
    raise HTTPException(status_code=404, detail="User not found.")


@router.delete("user/{user_id}/delete")
async def delete_user(user_id: int):
    for i, user in enumerate(users):
        if user.id == user_id:
            del users[i]
            return {"message": "User deleted successfully."}
    raise HTTPException(status_code=404, detail="User not found.")
