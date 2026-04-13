# app/models/workspace.py

import uuid

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import TimestampedBase


class Workspace(TimestampedBase):
    __tablename__ = "workspaces"

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    created_by: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    # Relationships
    creator: Mapped["User"] = relationship(
        back_populates="workspaces",
        foreign_keys=[created_by],
    )
    members: Mapped[list["WorkspaceMember"]] = relationship(
        back_populates="workspace",
    )
    documents: Mapped[list["Document"]] = relationship(
        back_populates="workspace",
    )
    notes: Mapped[list["Note"]] = relationship(
        back_populates="workspace",
    )
    summaries: Mapped[list["Summary"]] = relationship(
        back_populates="workspace",
    )
    chat_sessions: Mapped[list["ChatSession"]] = relationship(
        back_populates="workspace",
    )