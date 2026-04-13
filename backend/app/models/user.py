# app/models/user.py

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import TimestampedBase


class User(TimestampedBase):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )
    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    full_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    # Relationships
    workspaces: Mapped[list["Workspace"]] = relationship(
        back_populates="creator",
        foreign_keys="Workspace.created_by",
    )
    workspace_memberships: Mapped[list["WorkspaceMember"]] = relationship(
        back_populates="user",
    )
    documents: Mapped[list["Document"]] = relationship(
        back_populates="uploader",
        foreign_keys="Document.uploaded_by",
    )
    notes: Mapped[list["Note"]] = relationship(
        back_populates="creator",
        foreign_keys="Note.created_by",
    )
    summaries: Mapped[list["Summary"]] = relationship(
        back_populates="creator",
        foreign_keys="Summary.created_by",
    )
    chat_sessions: Mapped[list["ChatSession"]] = relationship(
        back_populates="creator",
    )
    chat_messages: Mapped[list["ChatMessage"]] = relationship(
        back_populates="sender",
    )