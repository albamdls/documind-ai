# app/models/chat_message.py

import uuid

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import TimestampedBase


class ChatMessage(TimestampedBase):
    __tablename__ = "chat_messages"

    chat_session_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("chat_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    sender_user_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    role: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    # Relationships
    session: Mapped["ChatSession"] = relationship(
        back_populates="messages",
    )
    sender: Mapped["User"] = relationship(
        back_populates="chat_messages",
    )