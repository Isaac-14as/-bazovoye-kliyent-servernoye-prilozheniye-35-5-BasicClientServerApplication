from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.models import Users
from app.schemas import User, UserCreate
from app.auth import (
    get_current_user,
    get_password_hash
)

router = APIRouter(prefix="/users", tags=["users"])

# Регистрация нового пользователя


@router.post("/register", response_model=User)
async def register_user(user: UserCreate):
    existing_user = await Users.objects().where(Users.username == user.username).first()
    if existing_user:
        raise HTTPException(
            status_code=400, detail="Username already registered")

    hashed_password = get_password_hash(user.password)

    db_user = await Users(
        username=user.username,
        password_hash=hashed_password,
        full_name=user.full_name,
        role=user.role
    ).save()

    return User(
        id=db_user[0]["id"],
        username=user.username,
        full_name=user.full_name,
        role=user.role
    )


# Получение списка всех пользователей (только для админа)
@router.get("/", response_model=List[User])
async def read_users(current_user: Users = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return await Users.select().order_by(Users.id).run()


# Получение конкретного пользователя по ID
@router.get("/{user_id}", response_model=User)
async def read_user(user_id: int, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    user = await Users.objects().where(Users.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# Обновление пользователя
@router.put("/{user_id}", response_model=User)
async def update_user(
    user_id: int,
    user_data: UserCreate,
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    user = await Users.objects().where(Users.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user_data.dict(exclude_unset=True)
    if 'password' in update_data:
        update_data['password_hash'] = get_password_hash(
            update_data.pop('password'))

    # Изменяем способ обновления:
    await Users.update().where(Users.id == user_id).values(**update_data)
    updated_user = await Users.objects().where(Users.id == user_id).first()
    return updated_user


@router.delete("/{user_id}")
async def delete_user(user_id: int, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not admin")

    user = await Users.objects().where(Users.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await user.remove()
    return {"ok": True}
