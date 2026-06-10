from datetime import date
from typing import Optional
from sqlalchemy import Integer, String, Text, ForeignKeyConstraint, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship, declared_attr
from app.database import Base

class CVSection(Base):
    __abstract__ = True

    user_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    cv_number: Mapped[int] = mapped_column(Integer, primary_key=True)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    @declared_attr
    def __table_args__(cls):
        return (
            ForeignKeyConstraint(
                ["user_id", "cv_number"],
                ["cvs.user_id", "cvs.cv_number"],
                ondelete="CASCADE",
            ),
        )

    @declared_attr
    def cv(cls):
        return relationship("CV", back_populates=f"{cls.__tablename__}")

class CVExperience(CVSection):
    __tablename__ = "cv_experiences"
    job_title: Mapped[str] = mapped_column(String(100), nullable=False)
    company_name: Mapped[str] = mapped_column(String(100), nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

class CVEducation(CVSection):
    __tablename__ = "cv_educations"
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    institution_name: Mapped[str] = mapped_column(String(100), nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)


class CVSkill(CVSection):
    __tablename__ = "cv_skills"
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    level: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    years_of_experience: Mapped[Optional[int]
                                ] = mapped_column(Integer, nullable=True)

class CVLanguage(CVSection):
    __tablename__ = "cv_languages"
    language: Mapped[str] = mapped_column(String(100), nullable=False)
    level: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

class CVSocialLink(CVSection):
    __tablename__ = "cv_social_links"
    platform: Mapped[str] = mapped_column(String(100), nullable=False)
    url: Mapped[str] = mapped_column(String(255), nullable=False)
