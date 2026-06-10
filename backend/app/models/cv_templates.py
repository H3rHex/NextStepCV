from datetime import datetime
from typing import List
from sqlalchemy import Integer, String, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from backend.app.models.cvs import CV


class CVTemplate(Base):
    __tablename__ = "cv_templates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tite: Mapped[str] = mapped_column(String(50), nullable=False)
    theme_color: Mapped[str] = mapped_column(String(20), nullable=False)

    cvs: Mapped[List["CV"]] = relationship("CV", back_populates="template")
    