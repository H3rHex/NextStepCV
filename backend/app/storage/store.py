"""Almacén temporal de PDFs generados y sus tokens de descarga.

Estructura en disco por token:

    <output_dir>/<token>/
        resume.pdf
        assets/
            profile_image

El registro de tokens vive en memoria (dict token -> Resource). Cada recurso
tiene una expiración (TTL) y puede ser de descarga única.
"""

import secrets
import shutil
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path

from app.core.config import settings


class TokenNotFoundError(Exception):
    pass


class TokenExpiredError(Exception):
    pass


@dataclass
class Resource:
    workspace: Path
    expires_at: datetime


class ResourceStore:
    def __init__(
        self,
        output_dir: Path,
        ttl_seconds: int,
        download_once: bool,
    ) -> None:
        self.output_dir = output_dir
        self.ttl_seconds = ttl_seconds
        self.download_once = download_once
        self._resources: dict[str, Resource] = {}
        self._consumed: set[str] = set()

    # -- creación ------------------------------------------------------

    def new_token(self) -> str:
        return secrets.token_urlsafe(24)

    def workspace(self, token: str) -> Path:
        workspace = self.output_dir / token
        workspace.mkdir(parents=True, exist_ok=True)
        return workspace

    def register(self, token: str, workspace: Path) -> None:
        self._resources[token] = Resource(
            workspace=workspace,
            expires_at=datetime.now(timezone.utc) + timedelta(seconds=self.ttl_seconds),
        )

    # -- descarga ------------------------------------------------------

    def retrieve(self, token: str) -> Path:
        """Devuelve la ruta al PDF si el token es válido y no expirado.

        Lanza TokenNotFoundError (404) o TokenExpiredError (410).
        """
        if token not in self._resources or token in self._consumed:
            raise TokenNotFoundError(token)
        resource = self._resources[token]
        if resource.expires_at < datetime.now(timezone.utc):
            raise TokenExpiredError(token)
        pdf = resource.workspace / "resume.pdf"
        if not pdf.exists():
            raise TokenNotFoundError(token)
        return pdf

    def consume(self, token: str) -> None:
        """Marca el token como consumido (cierra la ventana de descarga)."""
        if self.download_once:
            self._consumed.add(token)

    # -- limpieza ------------------------------------------------------

    def cleanup(self, token: str) -> None:
        """Borra archivos del token y su registro."""
        resource = self._resources.pop(token, None)
        self._consumed.discard(token)
        if resource is not None and resource.workspace.exists():
            shutil.rmtree(resource.workspace, ignore_errors=True)

    def cleanup_all(self) -> None:
        """Vacía el directorio de salida (se llama al arrancar)."""
        shutil.rmtree(self.output_dir, ignore_errors=True)
        self._resources.clear()
        self._consumed.clear()

    def sweep(self) -> int:
        """Borra los recursos expirados. Devuelve cuántos se eliminaron."""
        now = datetime.now(timezone.utc)
        expired = [
            token
            for token, resource in self._resources.items()
            if resource.expires_at < now
        ]
        for token in expired:
            self.cleanup(token)
        return len(expired)


store = ResourceStore(
    output_dir=settings.pdf_output_dir,
    ttl_seconds=settings.pdf_ttl_seconds,
    download_once=settings.download_once,
)

__all__ = [
    "ResourceStore",
    "Resource",
    "TokenNotFoundError",
    "TokenExpiredError",
    "store",
]