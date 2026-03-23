from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "DocuMind AI Backend"
    environment: str = "development"

    database_url: str = "postgresql+asyncpg://postgres:postgres@db:5432/documind"
    redis_url: str = "redis://redis:6379/0"

    class Config:
        env_file = ".env"


settings = Settings()