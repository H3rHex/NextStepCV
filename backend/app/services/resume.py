import json

from app.schemas import AnyResumeData, parse_resume_data

DEFAULT_LANG = "es"
SUPPORTED_LANGS = ("es", "en")


def normalize_lang(lang: str | None) -> str:
    if lang and lang in SUPPORTED_LANGS:
        return lang
    return DEFAULT_LANG


def parse_payload(data_raw: str) -> AnyResumeData:
    raw = json.loads(data_raw)
    return parse_resume_data(raw)


__all__ = ["DEFAULT_LANG", "SUPPORTED_LANGS", "normalize_lang", "parse_payload"]