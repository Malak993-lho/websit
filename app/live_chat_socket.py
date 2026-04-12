"""
Flask-SocketIO handlers: admin + website user (user_send_message).

Wire from your app factory, e.g.:
    from app.live_chat_socket import register_live_chat_handlers
    register_live_chat_handlers(socketio)
"""

from __future__ import annotations

from typing import Any, Dict, Optional

from flask_socketio import SocketIO, emit, join_room, leave_room

from app.live_chat_store import get_live_chat_store


def _conv_room(conversation_id: str) -> str:
    return f"conv:{conversation_id.strip()}"


def _emit_conversations_list_to_admin(socketio: SocketIO) -> None:
    """Push full list to admin room after messages change (Flutter may listen to either event)."""
    store = get_live_chat_store()
    payload = store.build_conversations_list()
    socketio.emit("conversations_list", payload, room="admin")
    socketio.emit("updated_conversations_list", payload, room="admin")


def register_live_chat_handlers(socketio: SocketIO) -> None:
    store = get_live_chat_store()

    @socketio.on("join_admin")
    def on_join_admin(_data: Optional[Dict[str, Any]] = None) -> None:
        join_room("admin")
        emit("conversations_list", store.build_conversations_list())

    @socketio.on("request_conversations")
    def on_request_conversations(_data: Optional[Dict[str, Any]] = None) -> None:
        emit("conversations_list", store.build_conversations_list())

    @socketio.on("join_conversation")
    def on_join_conversation(data: Dict[str, Any]) -> None:
        cid = (data or {}).get("conversation_id") or ""
        cid = str(cid).strip()
        if not cid:
            return
        join_room(_conv_room(cid))
        hist = store.get_chat_history_payload(cid)
        print(
            "[live-chat] join_conversation",
            f"cid={cid}",
            f"history_count={len((hist or {}).get('messages') or [])}",
        )
        emit("chat_history", hist)

    @socketio.on("leave_conversation")
    def on_leave_conversation(data: Dict[str, Any]) -> None:
        cid = (data or {}).get("conversation_id") or ""
        cid = str(cid).strip()
        if not cid:
            return
        leave_room(_conv_room(cid))

    @socketio.on("admin_send_message")
    def on_admin_send_message(data: Dict[str, Any]) -> None:
        if not data:
            return
        cid = str(data.get("conversation_id") or "").strip()
        text = str(data.get("text") or "").strip()
        if not cid or not text:
            return
        if not store.has_conversation(cid):
            return
        msg = store.add_admin_message(cid, text)
        print("[live-chat] admin_send_message", f"cid={cid}", f"msg_id={msg.get('id')}")
        payload = {"conversation_id": cid, "message": msg}
        socketio.emit("new_message", payload, room=_conv_room(cid))
        _emit_conversations_list_to_admin(socketio)

    @socketio.on("user_send_message")
    def on_user_send_message(data: Dict[str, Any]) -> None:
        if not data or not isinstance(data, dict):
            return

        chat = store
        conversation_id_raw = data.get("conversation_id")
        conversation_id = (
            str(conversation_id_raw).strip() if conversation_id_raw is not None else ""
        )
        text = (data.get("text") or "").strip()
        name = data.get("name") or "Visitor"

        if not conversation_id or not text:
            return

        try:
            if not chat.has_conversation(conversation_id):
                chat.create_conversation(conversation_id, str(name).strip())
            msg = chat.add_message(
                conversation_id=conversation_id,
                text=text,
                is_admin=False,
                visitor_name=str(name).strip() if name else None,
            )
        except ValueError:
            return

        print(
            "[live-chat] user_send_message",
            f"cid={conversation_id}",
            f"msg_id={msg.get('id')}",
            f"len={len(text)}",
        )
        socketio.emit(
            "new_message",
            {"conversation_id": conversation_id, "message": msg},
            room=_conv_room(conversation_id),
        )
        _emit_conversations_list_to_admin(socketio)
