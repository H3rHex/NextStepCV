from typing import Literal

from pydantic import BaseModel


class PersonalInfo(BaseModel):
    firstName: str
    lastName: str
    title: str
    email: str
    phone: str
    location: str
    website: str = ""
    summary: str


class ExperienceItem(BaseModel):
    id: str
    company: str
    role: str
    startDate: str
    endDate: str
    highlights: list[str]


class EducationItem(BaseModel):
    id: str
    institution: str
    degree: str
    startDate: str
    endDate: str


LanguageProficiency = Literal[
    "a1",
    "a2",
    "b1",
    "b2",
    "c1",
    "c2",
    "native",
    "fluent",
    "intermediate",
    "basic",
]


class LanguageItem(BaseModel):
    language: str
    proficiency: LanguageProficiency


__all__ = [
    "PersonalInfo",
    "ExperienceItem",
    "EducationItem",
    "LanguageProficiency",
    "LanguageItem",
]