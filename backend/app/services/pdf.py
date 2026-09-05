import json
from functools import reduce
from pathlib import Path
from typing import Any, Callable

from jinja2 import Environment, FileSystemLoader, select_autoescape
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
        template_name = TEMPLATE_BY_TYPE[type(resume)]
        return self._env.get_template(template_name).render(
            resume=resume,
            lang=lang,
            t=self.translator(lang),
            profile_image=profile_image,
        )

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