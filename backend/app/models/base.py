# Este archivo define la clase de que van a heredar todos los modelos.
# Su trabajo es centralizar los campos que se repiten en todas las tablas para no duplicarlos

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    """
    Base class for all SQLAlchemy ORM models.
    Provides common fields shared across all tables.
    """
    pass

class TimestampedBase(Base):
    """
    Abstract base model that includes id and created_at fields.
    All domain models should inherit from this class.
    """

    __abstract__ = True # Le dice a SQLAlchhemy que no es una tabla real, es solo una plantilla

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False, 
    )