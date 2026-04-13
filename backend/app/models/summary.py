# app/models/summary.py

import uuid

from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import TimestampedBase


class Summary(TimestampedBase):
    __tablename__ = "summaries"

    workspace_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("workspaces.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    document_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("documents.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    created_by: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    # Relationships
    workspace: Mapped["Workspace"] = relationship(
        back_populates="summaries",
    )
    document: Mapped["Document"] = relationship(
        back_populates="summaries",
    )
    creator: Mapped["User"] = relationship(
        back_populates="summaries",
        foreign_keys=[created_by],
    )