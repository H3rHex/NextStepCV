"""Schemas de entrada/salida de la API.

Espejo de frontend/src/components/resume/types/index.ts
"""

from app.schemas.base import BaseResumeData
from app.schemas.common import (
    EducationItem,
    ExperienceItem,
    LanguageProficiency,
    LanguageItem,
    PersonalInfo,
)
from app.schemas.developer import (
    DeveloperResumeData,
    Repository,
    SocialMediaItem,
    TechnicalSkills,
)

AnyResumeData = BaseResumeData | DeveloperResumeData


def parse_resume_data(raw: dict, *, strict: bool = False) -> AnyResumeData:
    """Infiere el tipo de currículo a partir del JSON recibido.

    El frontend no envía `resume_type`, así que se discrimina por la
    presencia de `technicalSkills` (campo exclusivo de DeveloperResumeData).
    """
    if "technicalSkills" in raw:
        return DeveloperResumeData.model_validate(raw)
    return BaseResumeData.model_validate(raw)


__all__ = [
    "PersonalInfo",
    "ExperienceItem",
    "EducationItem",
    "LanguageProficiency",
    "LanguageItem",
    "BaseResumeData",
    "TechnicalSkills",
    "Repository",
    "SocialMediaItem",
    "DeveloperResumeData",
    "AnyResumeData",
    "parse_resume_data",
]