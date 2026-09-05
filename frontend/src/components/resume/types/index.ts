export * from './base';
export * from './common';
export * from './developer';

import type { BaseResumeData } from './base';
import type { DeveloperResumeData } from './developer';

export type AnyResumeData = BaseResumeData | DeveloperResumeData;
export type ResumeTemplateId = 'developer' | 'generic';