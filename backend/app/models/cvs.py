from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class CV(Base):
    __tablename__ = "cvs"

    user_id: Mapped[int] = mapped_column(Integer,ForeignKey("users.id", ondelete="CASCADE"),primary_key=True)
    cv_number: Mapped[int] = mapped_column(Integer, primary_key=True)

    title: Mapped[str] = mapped_column(String(50), nullable=False)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True),default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True),default=lambda: datetime.now(timezone.utc),onupdate=lambda: datetime.now(timezone.utc))

    template_id: Mapped[Optional[int]] = mapped_column(Integer,ForeignKey("cv_templates.id", ondelete="SET NULL"),nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="cvs")
    template: Mapped["CVTemplate"] = relationship("CVTemplate", back_populates="cvs")

    # CV Sections
    experiences: Mapped[List["CVExperience"]] = relationship(
        "CVExperience", back_populates="cv_experiences", cascade="all, delete-orphan"
    )

    skills: Mapped[List["CVSkill"]] = relationship(
        "CVSkill", back_populates="cv_skills", cascade="all, delete-orphan"
    )

    languages: Mapped[List["CVLanguage"]] = relationship(
        "CVLanguage", back_populates="cv_languages", cascade="all, delete-orphan"
    )

    social_links: Mapped[List["CVSocialLink"]] = relationship(
        "CVSocialLink", back_populates="cv_social_links", cascade="all, delete-orphan"
    )

    educations: Mapped[List["CVEducation"]] = relationship(
        "CVEducation", back_populates="cv_educations", cascade="all, delete-orphan"
    )
