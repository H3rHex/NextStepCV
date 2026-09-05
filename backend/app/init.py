"""Entry point to start the NextStepCV API server.

Run from the backend directory:

    uv run python -m app.init
"""

import uvicorn

from app.core.config import settings


def main() -> None:
    uvicorn.run(
        "app.main:app",
        host=settings.backend_host,
        port=settings.backend_port,
        reload=True,
    )


if __name__ == "__main__":
    main()