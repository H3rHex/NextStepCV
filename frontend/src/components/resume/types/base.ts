// src/components/resume/types/base.ts
import type { EducationItem, ExperienceItem, LanguageItem, PersonalInfo } from './common';

export interface BaseResumeData {
    personalInfo: PersonalInfo;
    experience: ExperienceItem[];
    education: EducationItem[];
    languages: LanguageItem[];
}