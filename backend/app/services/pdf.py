import base64
import json
from functools import reduce
from io import BytesIO
from pathlib import Path
from typing import Any, Callable

from jinja2 import Environment, FileSystemLoader, select_autoescape
from PIL import Image
from weasyprint import HTML

from app.schemas import AnyResumeData, BaseResumeData, DeveloperResumeData
from app.services.resume import DEFAULT_LANG, SUPPORTED_LANGS

TEMPLATE_BY_TYPE: dict[type[AnyResumeData], str] = {
    BaseResumeData: "generic.html",
    DeveloperResumeData: "developer.html",
}

Translator = Callable[[str], str]


class PdfService:
    def __init__(self, templates_dir: Path, translations_dir: Path) -> None:
        self.templates_dir = templates_dir
        self.translations_dir = translations_dir
        self._env = Environment(
            loader=FileSystemLoader(templates_dir),
            autoescape=select_autoescape(["html"]),
        )
        self._translations: dict[str, dict] = {}

    def translations(self, lang: str) -> dict:
        if lang not in SUPPORTED_LANGS:
            lang = DEFAULT_LANG
        if lang not in self._translations:
            self._translations[lang] = json.loads(
                (self.translations_dir / f"{lang}.json").read_text()
            )
        return self._translations[lang]

    def translator(self, lang: str) -> Translator:
        data = self.translations(lang)

        def t(key: str) -> str:
            node: Any = data
            for part in key.split("."):
                if isinstance(node, dict):
                    node = node.get(part)
                else:
                    return key
            return node if isinstance(node, str) else key

        return t

    def render_html(
        self,
        resume: AnyResumeData,
        *,
        lang: str = DEFAULT_LANG,
        profile_image: str | None = None,
    ) -> str:
        """Renderiza la plantilla del currículo a HTML.

        `profile_image` es la ruta absoluta al archivo de imagen; se incrusta
        como data URI para que el PDF resultante sea autocontenido y no
        dependa de la resolución de rutas al convertirse.
        """
        template_name = TEMPLATE_BY_TYPE[type(resume)]
        return self._env.get_template(template_name).render(
            resume=resume,
            lang=lang,
            t=self.translator(lang),
            profile_image=self._to_data_uri(profile_image) if profile_image else None,
        )

    @staticmethod
    def _to_data_uri(path: str) -> str:
        with Image.open(path) as img:
            img.thumbnail((512, 512), Image.Resampling.LANCZOS)
            has_alpha = img.mode in ("RGBA", "LA") or (
                img.mode == "P" and "transparency" in img.info
            )
            buf = BytesIO()
            if has_alpha:
                img = img.convert("RGBA")
                mime, fmt = "image/png", "PNG"
            else:
                img = img.convert("RGB")
                mime, fmt = "image/jpeg", "JPEG"
            img.save(buf, fmt, quality=85)
        data = base64.b64encode(buf.getvalue()).decode("ascii")
        return f"data:{mime};base64,{data}"

    def generate(
        self,
        resume: AnyResumeData,
        output_path: Path,
        *,
        lang: str = DEFAULT_LANG,
        profile_image: str | None = None,
    ) -> Path:
        html = self.render_html(resume, lang=lang, profile_image=profile_image)
        HTML(
            string=html,
            base_url=str(self.templates_dir.resolve()),
        ).write_pdf(str(output_path))
        return output_path


__all__ = ["PdfService", "TEMPLATE_BY_TYPE"]