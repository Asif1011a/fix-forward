import sys
import os

# Bridge: Add the backend directory to the system path so imports work correctly in serverless
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from main import app as _fastapi_app
from starlette.types import ASGIApp, Receive, Scope, Send


class _StripPrefixMiddleware:
    """Strip the /api URL prefix before forwarding to the FastAPI app.

    Vercel routes /api/(.*) to this file, so the serverless function
    receives paths like /api/chat instead of /chat.  This middleware
    rewrites the path so FastAPI's router can match its declared routes.
    """

    def __init__(self, inner: ASGIApp, prefix: str) -> None:
        self.inner = inner
        self._prefix = prefix.rstrip("/")
        self._prefix_bytes = self._prefix.encode()

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] in ("http", "websocket"):
            path: str = scope.get("path", "")
            if path == self._prefix or path.startswith(self._prefix + "/"):
                scope = dict(scope)
                scope["path"] = path[len(self._prefix):] or "/"
                raw: bytes = scope.get("raw_path", b"")
                if raw == self._prefix_bytes or raw.startswith(self._prefix_bytes + b"/"):
                    scope["raw_path"] = raw[len(self._prefix):] or b"/"
        await self.inner(scope, receive, send)


# Vercel needs an ASGI-compatible `app` object
app = _StripPrefixMiddleware(_fastapi_app, "/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(_fastapi_app, host="0.0.0.0", port=8000)
