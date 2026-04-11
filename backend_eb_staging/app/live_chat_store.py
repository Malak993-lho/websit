"""
Live chat persistence: PostgreSQL (or any SQLAlchemy URI) via Flask-SQLAlchemy.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from sqlalchemy import desc

from app.extensions import db
from app.models import LiveChatConversation, LiveChatMessage


def _format_msg_time() -> str:
    s = datetime.now().strftime("%I:%M %p")
    if s.startswith("0"):
        return s[1:]
    return s


def _relative_list_time_from_dt(updated: Optional[datetime]) -> str:
    if not updated:
        return "just now"
    now = datetime.now(timezone.utc)
    u = updated if updated.tzinfo else updated.replace(tzinfo=timezone.utc)
    delta = (now - u).total_seconds()
    if delta < 60:
        return "just now"
    if delta < 3600:
        m = int(delta // 60)
        return f"{m}m ago" if m > 1 else "1m ago"
    if delta < 86400:
        h = int(delta // 3600)
        return f"{h}h ago" if h > 1 else "1h ago"
    d = int(delta // 86400)
    return f"{d}d ago" if d > 1 else "1d ago"


def _message_to_payload(m: LiveChatMessage) -> Dict[str, Any]:
    return {
        "id": m.id,
        "text": m.text,
        "time": m.time_display,
        "is_admin": m.is_admin,
    }


class LiveChatStore:
    """Read/write conversations and messages in the database."""

    def ensure_conversation(
        self, conversation_id: str, visitor_name: Optional[str]
    ) -> LiveChatConversation:
        cid = (conversation_id or "").strip()
        if not cid:
            raise ValueError("conversation_id required")

        row = db.session.get(LiveChatConversation, cid)
        if row is None:
            name = (visitor_name or "").strip() or "Visitor"
            row = LiveChatConversation(
                id=cid,
                name=name,
                last_message="",
                unread_count=0,
                is_online=True,
            )
            db.session.add(row)
        elif visitor_name and str(visitor_name).strip():
            row.name = str(visitor_name).strip()
        return row

    def add_user_message(
        self, conversation_id: str, text: str, name: Optional[str]
    ) -> Dict[str, Any]:
        conv = self.ensure_conversation(conversation_id, name)
        msg_id = f"msg_{uuid.uuid4().hex[:16]}"
        msg_row = LiveChatMessage(
            id=msg_id,
            conversation_id=conv.id,
            text=text,
            time_display=_format_msg_time(),
            is_admin=False,
        )
        db.session.add(msg_row)
        conv.last_message = text
        conv.unread_count = int(conv.unread_count or 0) + 1
        conv.updated_at = datetime.now(timezone.utc)
        try:
            db.session.commit()
        except Exception:
            db.session.rollback()
            raise
        return _message_to_payload(msg_row)

    def add_admin_message(self, conversation_id: str, text: str) -> Dict[str, Any]:
        cid = (conversation_id or "").strip()
        conv = db.session.get(LiveChatConversation, cid)
        if conv is None:
            raise ValueError("conversation not found")
        msg_id = f"msg_{uuid.uuid4().hex[:16]}"
        msg_row = LiveChatMessage(
            id=msg_id,
            conversation_id=cid,
            text=text,
            time_display=_format_msg_time(),
            is_admin=True,
        )
        db.session.add(msg_row)
        conv.last_message = text
        conv.unread_count = 0
        conv.updated_at = datetime.now(timezone.utc)
        try:
            db.session.commit()
        except Exception:
            db.session.rollback()
            raise
        return _message_to_payload(msg_row)

    def get_chat_history_payload(self, conversation_id: str) -> Dict[str, Any]:
        cid = (conversation_id or "").strip()
        rows = (
            db.session.query(LiveChatMessage)
            .filter(LiveChatMessage.conversation_id == cid)
            .order_by(LiveChatMessage.created_at.asc())
            .all()
        )
        return {
            "conversation_id": cid,
            "messages": [_message_to_payload(m) for m in rows],
        }

    def has_conversation(self, conversation_id: str) -> bool:
        cid = (conversation_id or "").strip()
        return db.session.get(LiveChatConversation, cid) is not None

    def create_conversation(self, conversation_id: str, display_name: str) -> None:
        """Create row only if missing (matches website flow before first message)."""
        cid = (conversation_id or "").strip()
        if not cid:
            raise ValueError("conversation_id required")
        if self.has_conversation(cid):
            return
        nm = (display_name or "").strip() or "Visitor"
        row = LiveChatConversation(
            id=cid,
            name=nm,
            last_message="",
            unread_count=0,
            is_online=True,
        )
        db.session.add(row)
        try:
            db.session.commit()
        except Exception:
            db.session.rollback()
            raise

    def add_message(
        self,
        conversation_id: str,
        text: str,
        is_admin: bool,
        visitor_name: Optional[str] = None,
    ) -> Dict[str, Any]:
        if is_admin:
            return self.add_admin_message(conversation_id, text)
        return self.add_user_message(conversation_id, text, visitor_name)

    def get_conversations(self) -> List[Dict[str, Any]]:
        return self.build_conversations_list()

    def build_conversations_list(self) -> List[Dict[str, Any]]:
        rows = (
            db.session.query(LiveChatConversation)
            .order_by(desc(LiveChatConversation.updated_at))
            .all()
        )
        items: List[Dict[str, Any]] = []
        for conv in rows:
            items.append(
                {
                    "id": conv.id,
                    "name": conv.name,
                    "last_message": conv.last_message or "",
                    "time": _relative_list_time_from_dt(conv.updated_at),
                    "unread_count": int(conv.unread_count or 0),
                    "is_online": bool(conv.is_online),
                }
            )
        return items


_store: Optional[LiveChatStore] = None


def get_live_chat_store() -> LiveChatStore:
    global _store
    if _store is None:
        _store = LiveChatStore()
    return _store
