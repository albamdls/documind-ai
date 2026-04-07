# app/models/__init__.py

# Re-export all models here so Alembic can detect them.
# Add each new model as it is created.

from app.models.base import Base, TimestampedBase  # noqa: F401