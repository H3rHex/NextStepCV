"""Schema del currículo tipo developer.

Espejo de frontend/src/components/resume/types/developer.ts
"""

from pydantic import BaseModel, Field

from app.schemas.base import BaseResumeData


class SocialMediaItem(BaseModel):
    id: str
    name: str
    username: str
    url: str


class TechnicalSkills(BaseModel):
    # Defaults por si llegan datos incompletos de versiones anteriores
    # del frontend (el nuevo frontend siempre manda los tres campos).
    programmingLanguages: list[str] = Field(default_factory=list)
    frameworks: list[str] = Field(default_factory=list)
    toolsAndDatabases: list[str] = Field(default_factory=list)


class Repository(BaseModel):
    name: str
    description: str
    url: str


class DeveloperResumeData(BaseResumeData):
    technicalSkills: TechnicalSkills
    # Opcionales en el frontend (`?`): default para coincidir con los valores
    # que manda el cliente ('' y []).
    socialMedia: list[SocialMediaItem] = Field(default_factory=list)
    githubProfile: str = ""
    repositories: list[Repository] = Field(default_factory=list)


__all__ = ["SocialMediaItem", "TechnicalSkills", "Repository", "DeveloperResumeData"]