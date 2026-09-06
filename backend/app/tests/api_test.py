"""Test funcional de la API con TestClient (sin pytest).

Ejecutar con:

    uv run python -m app.tests.api_test

Cubre: creación del currículo, descarga única, re-descarga (404),
expiración del token (410) y validaciones de entrada.
"""

import json
import shutil
from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient

from app.core.config import settings
from app.main import app
from app.storage.store import store
from app.tests.mock_data import DEVELOPER_JSON, GENERAL_JSON, write_mock_photo


def main() -> None:
    settings.pdf_output_dir.mkdir(parents=True, exist_ok=True)

    with TestClient(app) as client:
        base = "/api/v1"

        # 1) crear currículo genérico sin foto
        r = client.post(f"{base}/create_resume", data={"data": json.dumps(GENERAL_JSON)})
        assert r.status_code == 201, f"crear: {r.status_code} {r.text}"
        download_url = r.json()["download_url"]
        assert download_url.startswith(f"{base}/download/"), f"URL inesperada: {download_url}"
        print(f"1. crear OK -> {download_url}")

        # 2) descargar una vez -> PDF válido
        r = client.get(download_url)
        assert r.status_code == 200, f"descargar: {r.status_code} {r.text}"
        assert r.headers["content-type"].startswith("application/pdf"), "content-type no es PDF"
        assert r.content[:5] == b"%PDF-", "no es un PDF"
        print(f"2. descarga OK ({len(r.content)} bytes)")

        # 3) segunda descarga -> 404 (descarga única)
        r = client.get(download_url)
        assert r.status_code == 404, f"re-descarga: {r.status_code} {r.text}"
        print("3. re-descarga -> 404 OK")

        # 4) crear developer con foto e idioma en
        png = write_mock_photo(settings.pdf_output_dir, "apifoto.png")
        with open(png, "rb") as f:
            photo = f.read()
        r = client.post(
            f"{base}/create_resume",
            data={"data": json.dumps(DEVELOPER_JSON), "lang": "en"},
            files={"profile_image": ("foto.png", photo, "image/png")},
        )
        assert r.status_code == 201, f"crear developer: {r.status_code} {r.text}"
        r = client.get(r.json()["download_url"])
        assert r.status_code == 200 and r.content[:5] == b"%PDF-", "developer+photo: PDF no válido"
        assert r.content != 0, "PDF vacío"
        print(f"4. developer+photo/lang=en OK ({len(r.content)} bytes)")

        # 5) expiración -> 410
        r = client.post(f"{base}/create_resume", data={"data": json.dumps(GENERAL_JSON)})
        token = r.json()["download_url"].rsplit("/", 1)[-1]
        store._resources[token].expires_at = datetime.now(timezone.utc) - timedelta(seconds=1)
        r = client.get(f"{base}/download/{token}")
        assert r.status_code == 410, f"expirado: {r.status_code} {r.text}"
        print("5. token expirado -> 410 OK")

        # 6) token inexistente -> 404
        r = client.get(f"{base}/download/noexiste")
        assert r.status_code == 404, f"inexistente: {r.status_code} {r.text}"
        print("6. token inexistente -> 404 OK")

        # 7) JSON inválido -> 422
        r = client.post(f"{base}/create_resume", data={"data": "no-json"})
        assert r.status_code == 422, f"json inválido: {r.status_code}"
        print("7. JSON inválido -> 422 OK")

        # 8) imagen que no es una imagen -> 422
        r = client.post(
            f"{base}/create_resume",
            data={"data": json.dumps(GENERAL_JSON)},
            files={"profile_image": ("xd.txt", b"hola", "text/plain")},
        )
        assert r.status_code == 422, f"no-imagen: {r.status_code}"
        print("8. imagen no-imagen -> 422 OK")

    shutil.rmtree(settings.pdf_output_dir, ignore_errors=True)
    print("TODOS LOS TESTS DE API PASARON ✓")


if __name__ == "__main__":
    main()