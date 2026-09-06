import json

from app.schemas import AnyResumeData, parse_resume_data

DEFAULT_LANG = "es"
SUPPORTED_LANGS = ("es", "en")


def normalize_lang(lang: str | None) -> str:
    if lang and lang in SUPPORTED_LANGS:
        return lang
    return DEFAULT_LANG


def parse_payload(data_raw: str, resume_type: str | None = None) -> AnyResumeData:
    raw = json.loads(data_raw)
    return parse_resume_data(raw, resume_type=resume_type)


__all__ = ["DEFAULT_LANG", "SUPPORTED_LANGS", "normalize_lang", "parse_payload"]