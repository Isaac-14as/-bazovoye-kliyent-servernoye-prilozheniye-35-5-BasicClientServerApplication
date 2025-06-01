from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth import get_password_hash
from app.endpoints import products, suppliers
from app.models import Users
from app.schemas import UserCreate
from piccolo_conf import DB
from .endpoints import auth, users

app = FastAPI()

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров
app.include_router(auth.router)
app.include_router(users.router, tags=["users"])
app.include_router(products.router)
app.include_router(suppliers.router)


async def create_admin_user():
    admin_username = "admin"
    admin_data = UserCreate(
        username=admin_username,
        password="admin",  # Лучше использовать более сложный пароль в production
        full_name="admin",
        role="admin"
    )

    # Проверяем, существует ли уже пользователь admin
    existing_admin = await Users.objects().where(Users.username == admin_username).first()
    if existing_admin:
        print("✅ Admin user already exists")
        return

    # Создаем нового администратора
    hashed_password = get_password_hash(admin_data.password)
    await Users(
        username=admin_username,
        password_hash=hashed_password,
        full_name=admin_data.full_name,
        role=admin_data.role
    ).save()
    print("✅ Admin user created")


@app.on_event("startup")
async def startup():
    try:
        if not hasattr(DB, 'pool') or not DB.pool:
            await DB.start_connection_pool()
            print("✅ Database connected")
            await create_admin_user()

    except Exception as e:
        print(f"❌ Database connection error: {e}")
        raise


@app.on_event("shutdown")
async def shutdown():
    if DB.pool:
        await DB.close_connection_pool()


@app.get("/")
async def root():
    return {"message": "Building Materials API"}
