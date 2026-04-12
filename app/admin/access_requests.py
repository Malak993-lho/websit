"""Public POST /admin/access_requests — matches TamTam website Request Access form."""

from __future__ import annotations

from flask import Blueprint, jsonify, request

from app.extensions import db
from app.models import AccessRequest

admin_access_bp = Blueprint("admin_access", __name__, url_prefix="/admin")


@admin_access_bp.post("/access_requests")
def create_access_request():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    role = (data.get("role") or "").strip()
    reason = (data.get("reason") or "").strip()

    if not name or not email or not role:
        return jsonify({"error": "name, email, and role are required"}), 400

    row = AccessRequest(name=name, email=email, role=role, reason=reason)
    db.session.add(row)
    db.session.commit()
    return jsonify({"id": row.id, "status": "pending"}), 201
