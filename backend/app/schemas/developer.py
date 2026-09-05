"""Schema del currículo tipo developer.

Espejo de frontend/src/components/resume/types/developer.ts
"""

from pydantic import BaseModel, Field

from app.schemas.base import BaseResumeData


class TechnicalSkills(BaseModel):
    languagesAndFrameworks: list[str]
    toolsAndDatabases: list[str]


class Repository(BaseModel):
    name: str
    description: str
    url: str


class DeveloperResumeData(BaseResumeData):
    technicalSkills: TechnicalSkills
    # Opcionales en el frontend (`?`): default para coincidir con los valores
    # que manda el cliente ('' y []).
    githubProfile: str = ""
    repositories: list[Repository] = Field(default_factory=list)


__all__ = ["TechnicalSkills", "Repository", "DeveloperResumeData"]