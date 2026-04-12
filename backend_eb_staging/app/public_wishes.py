"""
Public read-only API for the marketing site (approved wishes).

GET /api/community/public  — contract expected by TamTam frontend (latest_wishes + counts).
GET /api/wishes/approved   — flat array compatibility route.
"""

from __future__ import annotations

import logging

from flask import Blueprint, jsonify
from sqlalchemy import desc

from app.extensions import db
from app.models import Wish

log = logging.getLogger(__name__)

community_bp = Blueprint("community", __name__, url_prefix="/api/community")
wishes_bp = Blueprint("wishes_public", __name__, url_prefix="/api/wishes")


def _approved_wishes_query():
    return (
        Wish.query.filter(Wish.is_approved.is_(True))
        .order_by(desc(Wish.created_at))
        .limit(100)
    )


def create_wish_pending(wish_text: str) -> Wish:
    """New wish hidden from public GET endpoints until approved (is_approved=True).

    In this codebase, the only inserts are ``seed_wishes_if_empty`` (explicitly approved).
    Admin or other services that add rows should use this helper or
    ``Wish(..., is_approved=False)`` so the public site stays moderated.
    """
    return Wish(wish_text=wish_text, is_approved=False)


def _default_wish_texts() -> list[str]:
    return [
        "I wish I had a stuffed bunny to hug when I'm scared at the hospital.",
        "I wish I could have art supplies so I can draw during my treatments.",
        "I wish I could go to the zoo one day with my family.",
        "I wish I had a tablet so I can study and not fall behind in school.",
        "I wish I could have a birthday cake — I've never had one with candles.",
    ]


def seed_wishes_if_empty() -> None:
    """Insert starter *approved* demo wishes when the table is empty (first deploy only)."""
    if db.session.query(Wish.id).limit(1).first() is not None:
        return
    for text in _default_wish_texts():
        db.session.add(Wish(wish_text=text, is_approved=True))
    db.session.commit()


@community_bp.get("/public")
def community_public():
    rows = list(_approved_wishes_query())
    wish_count = db.session.query(Wish).filter(Wish.is_approved.is_(True)).count()
    log.info(
        "GET /api/community/public approved rows=%s total_approved_count=%s ids=%s",
        len(rows),
        wish_count,
        [w.id for w in rows[:15]],
    )
    latest_wishes = [
        {
            "id": w.id,
            "wishText": w.wish_text,
            "timestamp": w.created_at.isoformat() if w.created_at else "",
        }
        for w in rows
    ]
    return jsonify(
        {
            "counts": {
                "users": 0,
                "posts": 0,
                "wishes": wish_count,
                "stories": 0,
            },
            "latest_posts": [],
            "latest_wishes": latest_wishes,
        }
    )


@wishes_bp.get("/approved")
def wishes_approved():
    rows = list(_approved_wishes_query())
    log.info(
        "GET /api/wishes/approved count=%s ids=%s",
        len(rows),
        [w.id for w in rows[:15]],
    )
    return jsonify(
        [
            {
                "id": str(w.id),
                "wish_text": w.wish_text,
                "created_at": w.created_at.isoformat() if w.created_at else "",
            }
            for w in rows
        ]
    )
