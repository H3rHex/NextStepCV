"""Schema base del currículo.

Espejo de frontend/src/components/resume/types/base.ts
"""

from pydantic import BaseModel

from app.schemas.common import EducationItem, ExperienceItem, LanguageItem, PersonalInfo


class BaseResumeData(BaseModel):
    personalInfo: PersonalInfo
    experience: list[ExperienceItem]
    education: list[EducationItem]
    languages: list[LanguageItem]
    drivingLicenses: list[str] = []
    hasCar: bool = False
    showDriving: bool = False


__all__ = ["BaseResumeData"]