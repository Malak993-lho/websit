from __future__ import annotations

from sqlalchemy import false as sa_false

from app.extensions import db


class LiveChatConversation(db.Model):
    __tablename__ = "live_chat_conversations"

    id = db.Column(db.String(64), primary_key=True)
    name = db.Column(db.String(255), nullable=False, default="Visitor")
    last_message = db.Column(db.Text, nullable=False, default="")
    unread_count = db.Column(db.Integer, nullable=False, default=0)
    is_online = db.Column(db.Boolean, nullable=False, default=True)
    updated_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), onupdate=db.func.now())


class Wish(db.Model):
    """Public website wishes; only rows with is_approved=True are exposed via API."""

    __tablename__ = "wishes"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    wish_text = db.Column(db.Text, nullable=False)
    # ORM + DB default: new rows stay hidden from public endpoints until approved.
    is_approved = db.Column(
        db.Boolean,
        nullable=False,
        default=False,
        insert_default=False,
        server_default=sa_false(),
    )
    created_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now())


class LiveChatMessage(db.Model):
    __tablename__ = "live_chat_messages"

    id = db.Column(db.String(80), primary_key=True)
    conversation_id = db.Column(
        db.String(64),
        db.ForeignKey("live_chat_conversations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    text = db.Column(db.Text, nullable=False)
    time_display = db.Column(db.String(32), nullable=False)
    is_admin = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now())
