// src/components/resume/types/common.ts

export interface PersonalInfo {
    firstName: string;
    lastName: string;
    title: string;          
    email: string;
    phone: string;
    location: string;
    website?: string;
    summary: string;       
}

export interface ExperienceItem {
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string | 'present'; 
    highlights: string[];
}

export interface EducationItem {
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
}

export type LanguageProficiency =
    | 'a1'
    | 'a2'
    | 'b1'
    | 'b2'
    | 'c1'
    | 'c2'
    | 'native'
    | 'fluent'
    | 'intermediate'
    | 'basic';

export interface LanguageItem {
    language: string;
    proficiency: LanguageProficiency;
}