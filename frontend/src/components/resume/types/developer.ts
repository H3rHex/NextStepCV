// src/components/resume/types/developer.ts
import type { BaseResumeData } from './base';

export interface DeveloperResumeData extends BaseResumeData {
    technicalSkills: {
        languagesAndFrameworks: string[];
        toolsAndDatabases: string[];
    };
    githubProfile?: string;
    repositories?: Array<{
        name: string;
        description: string;
        url: string;
    }>;
}