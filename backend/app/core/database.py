# app/core/database.py

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings

# Creamos el motor de la base de datos asíncrono utilizando la URL de conexión
# definida en la configuración.
engine = create_async_engine(
    settings.database_url,
    echo=settings.environment == "development",
)
# Creamos una fábrica de sesiones asíncronas que se utilizará para generar sesiones
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# FastAPI dependency que proporciona una sesión de base de datos por solicitud.
async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency that provides a database session per request.
    Automatically closes the session when the request is done.
    """
    async with AsyncSessionLocal() as session:
        yield session