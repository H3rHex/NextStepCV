import { useCallback, useEffect, useRef, useState } from 'react';
import type { AnyResumeData, BaseResumeData, DeveloperResumeData } from '../components/resume/types';


export interface UseResumeFormReturn<T extends AnyResumeData> {
  data: T;
  
  isDirty: boolean;
  
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
  resumeType: _resumeType,
  onSubmit,
  storageKey,
}: {
  initialData: T;
  resumeType: 'general' | 'developer';
  onSubmit?: (data: T) => Promise<void>;
  storageKey?: string;
}): UseResumeFormReturn<T> {
  
  const [data, setData] = useState<T>(() => {
    
    if (storageKey && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Validación básica: si tiene la estructura esperada, úsalo
          if (parsed && typeof parsed === 'object' && 'personalInfo' in parsed) {
            return parsed as T;
          }
        }
      } catch {
      }
    }
    return initialData;
  });
  
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
    setIsDirty(false);
  }, [initialData]);
  
  
  const handleSubmit = useCallback(async () => {
    if (onSubmit) {
      await onSubmit(data);
    }
  }, [data, onSubmit]);
  
  const toJSON = useCallback((): T => {
    // Aquí puedes transformar los datos antes de enviarlos al backend:
    // - photo: se envía como base64 data URL (string)
    // - Si el backend espera archivo multipart, tendrías que separar la imagen
    // - Convertir fechas a ISO, limpiar IDs temporales, etc.
    return data;
  }, [data]);

  
  return {
    data,
    isDirty,
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
    id: crypto.randomUUID(), // ID único temporal
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    highlights: [''],
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
    languagesAndFrameworks: [],
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
      photo: '',
    },
    experience: [createEmptyExperience()],
    education: [createEmptyEducation()],
    languages: [createEmptyLanguage()],
  };
  
  if (type === 'developer') {
    return {
      ...base,
      technicalSkills: createEmptyDeveloperSkills(),
      githubProfile: '',
      repositories: [createEmptyRepository()],
    } as DeveloperResumeData;
  }
  
  return base;
}

export default useResumeForm;