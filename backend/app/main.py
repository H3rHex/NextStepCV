import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.resumes import router as resumes_router
from app.core.config import settings
from app.storage.store import store


async def _sweeper_loop() -> None:
    while True:
        await asyncio.sleep(settings.cleanup_interval_seconds)
        settings.pdf_output_dir.mkdir(parents=True, exist_ok=True)
        store.sweep()


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings.pdf_output_dir.mkdir(parents=True, exist_ok=True)
    store.cleanup_all()
    sweeper = asyncio.create_task(_sweeper_loop())
    yield
    sweeper.cancel()


app = FastAPI(title="NextStepCV API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resumes_router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}