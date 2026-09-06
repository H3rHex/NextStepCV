import { useCallback, useEffect, useRef, useState } from 'react';
import type { AnyResumeData, BaseResumeData, DeveloperResumeData } from '../components/resume/types';

export const MIN_IMAGE_FIELD = 'profile_image';
export const MIN_IMAGE_FIELD_DATA = 'data';

export interface ResumeSubmitPayload<T> {
  formData: FormData;
  data: T;
  imageFile: File | null;
}

export interface UseResumeFormReturn<T extends AnyResumeData> {
  data: T;
  
  isDirty: boolean;
  
  imageFile: File | null;
  
  setImageFile: (file: File | null) => void;
  
  imagePreviewUrl: string | null;
  
  updateField: <K extends keyof T>(field: K, value: T[K]) => void;
  
  updateNestedField: (
    field: 'experience' | 'education' | 'languages' | 'repositories', 
    index: number, 
    nestedField: string, 
    value: any
  ) => void;
  
  updateArrayField: <K extends keyof T>(field: K, value: T[K]) => void;
  
  addItem: (
    field: 'experience' | 'education' | 'languages' | 'repositories', 
    item: any
  ) => void;
  
  removeItem: (
    field: 'experience' | 'education' | 'languages' | 'repositories', 
    index: number
  ) => void;
  
  setData: React.Dispatch<React.SetStateAction<T>>;
  
  reset: () => void;
  
  handleSubmit: () => Promise<void>;
  
  toJSON: () => T;
}

export function useResumeForm<T extends AnyResumeData>({
  initialData,
  onSubmit,
  storageKey,
  imageFieldName = MIN_IMAGE_FIELD,
  dataFieldName = MIN_IMAGE_FIELD_DATA,
}: {
  initialData: T;
  onSubmit?: (payload: ResumeSubmitPayload<T>) => Promise<void>;
  resumeType?: 'general' | 'developer';
  storageKey?: string;
  imageFieldName?: string;
  dataFieldName?: string;
}): UseResumeFormReturn<T> {
  
  const [data, setData] = useState<T>(() => {
    
    if (storageKey && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object' && 'personalInfo' in parsed) {
            return parsed as T;
          }
        }
      } catch {
      }
    }
    return initialData;
  });
  
  const [imageFile, setImageFileState] = useState<File | null>(null);
  
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  
  const [isDirty, setIsDirty] = useState(false);
 
  useEffect(() => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch (error) {
        console.warn('Failed to save resume to localStorage:', error);
      }
    }
  }, [data, storageKey]);
  
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setIsDirty(true);
  }, [data]);
  
  const setImageFile = useCallback((file: File | null) => {
    setImageFileState(prevFile => {
      if (prevFile) {
        const url = URL.createObjectURL(prevFile);
        URL.revokeObjectURL(url);
      }
      return file;
    });
    
    setImagePreviewUrl(prevUrl => {
      if (prevUrl) {
        URL.revokeObjectURL(prevUrl);
      }
      return file ? URL.createObjectURL(file) : null;
    });
    
    setIsDirty(true);
  }, []);
  
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);
  
  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);
  
const updateNestedField = useCallback((
    field: 'experience' | 'education' | 'languages' | 'repositories', 
    index: number, 
    nestedField: string, 
    value: any
  ) => {
    setData(prev => ({
      ...prev,
      [field]: (prev as any)[field].map((item: any, i: number) =>
        i === index ? { ...item, [nestedField]: value } : item
      ),
    }));
  }, []);
  
  const updateArrayField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);
  
  const addItem = useCallback((
    field: 'experience' | 'education' | 'languages' | 'repositories', 
    item: any
  ) => {
    setData(prev => ({
      ...prev,
      [field]: [...(prev as any)[field], item],
    }));
  }, []);

  const removeItem = useCallback((
    field: 'experience' | 'education' | 'languages' | 'repositories', 
    index: number
  ) => {
    setData(prev => ({
      ...prev,
      [field]: (prev as any)[field].filter((_: any, i: number) => i !== index),
    }));
  }, []);
  
  const reset = useCallback(() => {
    setData(initialData);
    setImageFile(null);
    setIsDirty(false);
  }, [initialData, setImageFile]);
  
  const buildFormData = useCallback((resumeData: T, file: File | null): FormData => {
    const formData = new FormData();
    formData.append(dataFieldName, JSON.stringify(resumeData));
    if (file) {
      formData.append(imageFieldName, file);
    }
    return formData;
  }, [dataFieldName, imageFieldName]);
  
  const handleSubmit = useCallback(async () => {
    if (onSubmit) {
      const formData = buildFormData(data, imageFile);
      await onSubmit({ formData, data, imageFile });
    }
  }, [onSubmit, buildFormData, data, imageFile]);
  
  const toJSON = useCallback((): T => {
    return data;
  }, [data]);
  
  return {
    data,
    isDirty,
    imageFile,
    setImageFile,
    imagePreviewUrl,
    updateField,
    updateNestedField,
    updateArrayField,
    addItem,
    removeItem,
    setData,
    reset,
    handleSubmit,
    toJSON,
  };
}


export function createEmptyExperience(): BaseResumeData['experience'][0] {
  return {
    id: crypto.randomUUID(),
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    highlights: [''],
    description: '',
    showDescription: false,
  };
}

export function createEmptyEducation(): BaseResumeData['education'][0] {
  return {
    id: crypto.randomUUID(),
    institution: '',
    degree: '',
    startDate: '',
    endDate: '',
  };
}

export function createEmptyLanguage(): BaseResumeData['languages'][0] {
  return {
    language: '',
    proficiency: 'a1',
  };
}

export function createEmptyDeveloperSkills(): DeveloperResumeData['technicalSkills'] {
  return {
    programmingLanguages: [],
    frameworks: [],
    toolsAndDatabases: [],
  };
}

export function createEmptyRepository(): NonNullable<DeveloperResumeData['repositories']>[0] {
  return {
    name: '',
    description: '',
    url: '',
  };
}

export function createEmptySocialMediaItem(name = ''): NonNullable<DeveloperResumeData['socialMedia']>[0] {
  return {
    id: crypto.randomUUID(),
    name,
    username: '',
    url: '',
  };
}

export function getInitialResumeData(type: 'general' | 'developer'): AnyResumeData {
  const base: BaseResumeData = {
    personalInfo: {
      firstName: '',
      lastName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      summary: '',
    },
    experience: [createEmptyExperience()],
    education: [createEmptyEducation()],
    languages: [createEmptyLanguage()],
    drivingLicenses: [],
    hasCar: false,
    showDriving: false,
  };
  
  if (type === 'developer') {
    return {
      ...base,
      technicalSkills: createEmptyDeveloperSkills(),
      githubProfile: '',
      repositories: [],
      socialMedia: [],
    } as DeveloperResumeData;
  }
  
  return base;
}

export default useResumeForm;