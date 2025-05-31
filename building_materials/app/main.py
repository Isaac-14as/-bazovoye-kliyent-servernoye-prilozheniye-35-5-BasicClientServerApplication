from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


@app.on_event("startup")
async def startup():
    try:
        if not hasattr(DB, 'pool') or not DB.pool:
            await DB.start_connection_pool()
            print("✅ Database connected")
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
