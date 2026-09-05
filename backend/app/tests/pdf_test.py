"""Test unitario del PdfService. Ejecutar con:

    uv run python -m app.tests.pdf_test

Genera PDFs de ejemplo (general y developer, con y sin foto) y comprueba
que el resultado es un PDF válido.
"""

import json
import shutil
import tempfile
from pathlib import Path

from app.schemas import AnyResumeData
from app.services.pdf import PdfService
from app.services.resume import parse_payload
from app.tests.mock_data import DEVELOPER_JSON, GENERAL_JSON, write_mock_photo

APP_DIR = Path(__file__).resolve().parents[1]


def is_pdf(path: Path) -> bool:
    with open(path, "rb") as f:
        return f.read(5) == b"%PDF-"


def test_instances() -> list[tuple[str, AnyResumeData]]:
    return [
        ("generic", parse_payload(json.dumps(GENERAL_JSON))),
        ("developer", parse_payload(json.dumps(DEVELOPER_JSON))),
    ]


def main() -> None:
    service = PdfService(APP_DIR / "templates", APP_DIR / "translations")
    tmp = Path(tempfile.mkdtemp(prefix="cv_test_"))

    try:
        for name, resume in test_instances():
            out = tmp / f"{name}.pdf"
            service.generate(resume, out, lang="es")
            assert out.exists() and out.stat().st_size > 0, f"{name}: no se generó archivo"
            assert is_pdf(out), f"{name}: no es un PDF"
            print(f"{name}: PDF válido ({out.stat().st_size} bytes)")

        with_photo = tmp / "photo.pdf"
        resume_dev = parse_payload(json.dumps(DEVELOPER_JSON))
        photo = write_mock_photo(tmp)
        service.generate(
            resume_dev,
            with_photo,
            lang="en",
            profile_image=str(photo),
        )
        assert is_pdf(with_photo), "developer con foto: no es un PDF"
        assert with_photo.stat().st_size > 0, "developer con foto: vacío"
        print(f"developer+photo/lang=en: PDF válido ({with_photo.stat().st_size} bytes)")

        html_en = service.render_html(resume_dev, lang="en")
        assert "Experience" in html_en and "Technical skills" in html_en, "en: traducciones ausentes"
        print("render_en: traducciones en inglés aplicadas")

        lang_fallback = service.translator("fr")("sections.experience")
        assert lang_fallback == "Experiencia", "fallback de lang roto"
        print("lang desconocido: fallback a es OK")

        unknown_key = service.translator("es")("no.existe")
        assert unknown_key == "no.existe", "clave desconocida debe devolver la clave"
        print("clave desconocida: devuelve la clave OK")

    finally:
        shutil.rmtree(tmp, ignore_errors=True)

    print("TODOS LOS TESTS PASARON ✓")


if __name__ == "__main__":
    main()