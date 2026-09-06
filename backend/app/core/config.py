from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    backend_host: str = "127.0.0.1"
    backend_port: int = 8000

    pdf_ttl_seconds: int = 600
    download_once: bool = True
    cleanup_interval_seconds: int = 300
    pdf_output_dir: Path = Path("/tmp/cvs")
    max_image_size_bytes: int = 10 * 1024 * 1024

    allowed_origins: list[str] = ["*"]


settings = Settings()

__all__ = ["Settings", "settings"]