// src/components/resume/types/developer.ts
import type { BaseResumeData } from './base';

export interface SocialMediaItem {
    id: string;
    name: string;
    username: string;
    url: string;
}

export interface DeveloperTechnicalSkills {
    programmingLanguages: string[];
    frameworks: string[];
    toolsAndDatabases: string[];
}

export interface DeveloperResumeData extends BaseResumeData {
    technicalSkills: DeveloperTechnicalSkills;
    githubProfile?: string;
    repositories?: Array<{
        name: string;
        description: string;
        url: string;
    }>;
    socialMedia?: SocialMediaItem[];
}