import os
from urllib.parse import urlparse

from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO

from app.extensions import db

socketio = SocketIO()

_SQLITE_FALLBACK = "sqlite:///live_chat_local.db"


def _database_uri() -> str:
    uri = (os.environ.get("DATABASE_URL") or os.environ.get("SQLALCHEMY_DATABASE_URI") or "").strip()
    if not uri:
        return _SQLITE_FALLBACK
    if uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql://", 1)
    # Docs example / typo: postgresql://... — host literally "..." is invalid
    try:
        host = (urlparse(uri).hostname or "").lower()
    except Exception:
        return _SQLITE_FALLBACK
    if not host or host == "..." or host.startswith("your-"):
        return _SQLITE_FALLBACK
    return uri


def create_app() -> Flask:
    # Name must not be `app`: inner `import app.models` would shadow it with the package.
    flask_app = Flask(__name__)
    flask_app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "change-me-in-production")
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = _database_uri()
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # HTTP CORS: S3 static sites (and local dev) call this API from another origin.
    # Preflight OPTIONS is handled by flask-cors. Tighten with env, e.g.:
    # CORS_ORIGINS=https://your-bucket.s3-website-....amazonaws.com,http://localhost:5173
    _cors_origins = os.environ.get("CORS_ORIGINS", "*")
    if _cors_origins.strip() == "*":
        CORS(flask_app, resources={r"/*": {"origins": "*"}})
    else:
        _allowed = [o.strip() for o in _cors_origins.split(",") if o.strip()]
        CORS(flask_app, resources={r"/*": {"origins": _allowed}})

    db.init_app(flask_app)
    # Socket.IO Engine.IO handshake must allow the same browser origins as REST.
    socketio.init_app(flask_app, cors_allowed_origins="*")

    from app.public_wishes import community_bp, seed_wishes_if_empty, wishes_bp

    flask_app.register_blueprint(community_bp)
    flask_app.register_blueprint(wishes_bp)

    with flask_app.app_context():
        import app.models  # noqa: F401 — register models before create_all

        db.create_all()
        seed_wishes_if_empty()

    from app.live_chat_socket import register_live_chat_handlers

    register_live_chat_handlers(socketio)

    return flask_app


__all__ = ["create_app", "socketio"]
