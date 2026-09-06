from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse

from app.core.config import settings
from app.services.pdf import PdfService
from app.services.resume import normalize_lang, parse_payload
from app.storage.store import (
    TokenExpiredError,
    TokenNotFoundError,
    store,
)

API_PREFIX = "/api/v1"
APP_DIR = Path(__file__).resolve().parents[2]

pdf_service = PdfService(APP_DIR / "templates", APP_DIR / "translations")

router = APIRouter(prefix=API_PREFIX, tags=["resumes"])


@router.post("/create_resume", status_code=201)
async def create_resume(
    data: str = Form(...),
    lang: str | None = Form(default=None),
    resume_type: str | None = Form(default=None),
    profile_image: UploadFile | None = File(default=None),
) -> dict[str, str]:
    try:
        resume = parse_payload(data, resume_type=resume_type)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail="The field data is not valid JSON") from exc

    lang = normalize_lang(lang)

    image_bytes: bytes | None = None
    if profile_image is not None:
        if not (profile_image.content_type or "").startswith("image/"):
            raise HTTPException(status_code=422, detail="profile_image must be an image")
        image_bytes = await profile_image.read()
        if len(image_bytes) > settings.max_image_size_bytes:
            raise HTTPException(
                status_code=413,
                detail="profile_image exceeds the maximum allowed size",
            )

    token = store.new_token()
    workspace = store.workspace(token)

    image_path: Path | None = None
    if image_bytes is not None:
        assets = workspace / "assets"
        assets.mkdir(parents=True, exist_ok=True)
        image_path = assets / "profile_image"
        image_path.write_bytes(image_bytes)

    pdf = workspace / "resume.pdf"
    pdf_service.generate(
        resume,
        pdf,
        lang=lang,
        profile_image=str(image_path) if image_path else None,
    )

    store.register(token, workspace)

    return {"download_url": f"{API_PREFIX}/download/{token}"}


@router.get("/download/{token}")
def download(token: str, background_tasks: BackgroundTasks):
    try:
        pdf = store.retrieve(token)
    except TokenExpiredError:
        store.cleanup(token)
        raise HTTPException(status_code=410, detail="The download link has expired")
    except TokenNotFoundError:
        raise HTTPException(status_code=404, detail="Invalid download link")

    store.consume(token)
    background_tasks.add_task(store.cleanup, token)

    return FileResponse(
        pdf,
        media_type="application/pdf",
        filename="resume.pdf",
        content_disposition_type="attachment",
    )