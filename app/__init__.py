import os
from urllib.parse import urlparse

from flask import Flask, request
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

    # CORS: /admin/* uses explicit methods + headers for preflight (Access Requests + Flutter admin).
    # Other routes keep prior behavior via r"/*". Order matters: more specific pattern first.
    _cors_env = os.environ.get("CORS_ORIGINS", "*").strip()
    _admin_methods = ["GET", "POST", "OPTIONS"]
    _admin_headers = ["Content-Type", "Authorization", "X-User-Id", "Accept"]
    _admin_local = ["http://localhost:8080", "http://127.0.0.1:8080"]
    if _cors_env == "*":
        _cors_resources = {
            r"/admin(?:/.*)?$": {
                "origins": "*",
                "methods": _admin_methods,
                "allow_headers": _admin_headers,
            },
            r"/*": {"origins": "*"},
        }
    else:
        _allowed_rest = [o.strip() for o in _cors_env.split(",") if o.strip()]
        _admin_origins = list(dict.fromkeys(_admin_local + _allowed_rest))
        _cors_resources = {
            r"/admin(?:/.*)?$": {
                "origins": _admin_origins,
                "methods": _admin_methods,
                "allow_headers": _admin_headers,
            },
            r"/*": {"origins": _allowed_rest},
        }
    CORS(flask_app, resources=_cors_resources)

    @flask_app.before_request
    def _log_access_requests_options_preflight() -> None:
        if request.method != "OPTIONS":
            return
        if request.path.rstrip("/") != "/admin/access_requests":
            return
        print(">>> OPTIONS /admin/access_requests hit")
        print("Origin:", request.headers.get("Origin"))

    db.init_app(flask_app)
    # Socket.IO Engine.IO handshake must allow the same browser origins as REST.
    socketio.init_app(flask_app, cors_allowed_origins="*")

    from app.admin.access_requests import admin_access_bp
    from app.public_wishes import community_bp, seed_wishes_if_empty, wishes_bp

    flask_app.register_blueprint(community_bp)
    flask_app.register_blueprint(wishes_bp)
    flask_app.register_blueprint(admin_access_bp)

    with flask_app.app_context():
        import app.models  # noqa: F401 — register models before create_all

        db.create_all()
        seed_wishes_if_empty()

    from app.live_chat_socket import register_live_chat_handlers

    register_live_chat_handlers(socketio)

    return flask_app


__all__ = ["create_app", "socketio"]
