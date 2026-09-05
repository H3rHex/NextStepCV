"""Genera PDFs de muestra con mock data para inspección visual.

Ejecutar con:

    uv run python -m app.tests.sample_pdf

Escribe los PDFs en backend/samples/ (no versionado; añadido a .gitignore).
"""

import json
import shutil
from pathlib import Path

from app.services.pdf import PdfService
from app.services.resume import parse_payload
from app.tests.mock_data import DEVELOPER_JSON, GENERAL_JSON, write_mock_photo

APP_DIR = Path(__file__).resolve().parents[1]
SAMPLES_DIR = APP_DIR.parent / "samples"
LOGO = Path.home() / "Pictures" / "h3rhex_logo.png"


def main() -> None:
    service = PdfService(APP_DIR / "templates", APP_DIR / "translations")

    shutil.rmtree(SAMPLES_DIR, ignore_errors=True)
    SAMPLES_DIR.mkdir(parents=True, exist_ok=True)

    photo_generic = LOGO if LOGO.exists() else write_mock_photo(SAMPLES_DIR, "photo_ana.png")
    photo_developer = LOGO if LOGO.exists() else write_mock_photo(SAMPLES_DIR, "photo_carlos.png")

    cases = [
        ("generic_es", GENERAL_JSON, "es", None),
        ("generic_es_con_foto", GENERAL_JSON, "es", photo_generic),
        ("developer_es", DEVELOPER_JSON, "es", None),
        ("developer_en", DEVELOPER_JSON, "en", None),
        ("developer_es_con_foto", DEVELOPER_JSON, "es", photo_developer),
    ]

    for name, raw, lang, photo in cases:
        resume = parse_payload(json.dumps(raw))
        out = SAMPLES_DIR / f"{name}.pdf"
        service.generate(
            resume,
            out,
            lang=lang,
            profile_image=str(photo) if photo else None,
        )
        print(f"{name} (lang={lang}, foto={bool(photo)}) -> {out}")

    print(f"\nMuestras generadas en: {SAMPLES_DIR}")


if __name__ == "__main__":
    main()