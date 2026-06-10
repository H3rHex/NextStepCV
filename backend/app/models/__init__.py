# app/models/__init__.py
from app.database import Base
from app.models.users import User
from app.models.profiles import Profile
from app.models.cvs import CV
from app.models.cv_templates import CVTemplate

# Importamos todas las secciones del archivo modular
from app.models.cv_sections import (
    CVExperience,
    CVSkill,
    CVLanguage,
    CVSocialLink,
    CVEducation
)
