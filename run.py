"""Run Flask-SocketIO (live chat). From project root: python run.py"""
import os

# Threading + Werkzeug is stable for local WebSocket via Vite proxy; EB/gunicorn leaves this unset.
os.environ.setdefault("SOCKETIO_ASYNC_MODE", "threading")

from app import create_app, socketio

app = create_app()

if __name__ == "__main__":
    # use_reloader=False: the Werkzeug reloader spawns a child process and breaks Engine.IO
    # WebSocket handshakes through the Vite proxy; keep a single stable process for local chat.
    socketio.run(
        app,
        host="0.0.0.0",
        port=5000,
        debug=True,
        allow_unsafe_werkzeug=True,
        use_reloader=False,
    )
