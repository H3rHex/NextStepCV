// src/components/resume/templates/GenericTemplate.tsx
import type React from 'react';
import { useTranslation } from 'react-i18next';
import type { UseResumeFormReturn } from '../../../hooks/useResumeForm';
import { createEmptyEducation, createEmptyExperience, createEmptyLanguage } from '../../../hooks/useResumeForm';
import type { BaseResumeData, EducationItem, ExperienceItem, LanguageItem } from '../types';

import { InlineDatePicker } from '../ui/InlineDatePicker';
import { InlineImageUpload } from '../ui/InlineImageUpload';
import { InlineInput } from '../ui/InlineInput';
import { InlineInputCommit } from '../ui/InlineInputCommit';
import { InlineSelect } from '../ui/InlineSelect';
import { InlineTextArea } from '../ui/InlineTextArea';
import { ItemContainer } from '../ui/ItemContainer';
import { SectionContainer } from '../ui/SelectionContainer';

interface GenericTemplateProps {
    data: BaseResumeData;
    updateField: UseResumeFormReturn<BaseResumeData>['updateField'];
    updateNestedField: UseResumeFormReturn<BaseResumeData>['updateNestedField'];
    addItem: UseResumeFormReturn<BaseResumeData>['addItem'];
    removeItem: UseResumeFormReturn<BaseResumeData>['removeItem'];
    setImageFile: UseResumeFormReturn<BaseResumeData>['setImageFile'];
    imagePreviewUrl: string | null;
}

export const GenericTemplate: React.FC<GenericTemplateProps> = ({
    data,
    updateField,
    updateNestedField,
    addItem,
    removeItem,
    setImageFile,
    imagePreviewUrl,
}) => {
    const { t } = useTranslation();

    const updatePersonalInfo = (field: keyof BaseResumeData['personalInfo'], value: string) => {
        updateField('personalInfo', { ...data.personalInfo, [field]: value });
    };

    const updateExperience = (index: number, field: keyof ExperienceItem, value: string) => {
        updateNestedField('experience', index, field, value);
    };

    const updateEducation = (index: number, field: keyof EducationItem, value: string) => {
        updateNestedField('education', index, field, value);
    };

    const updateLanguage = (index: number, field: keyof LanguageItem, value: string) => {
        updateNestedField('languages', index, field, value);
    };

    const updateExperienceDate = (index: number, field: 'startDate' | 'endDate', value: string) => {
        updateNestedField('experience', index, field, value);
    };

    const updateEducationDate = (index: number, field: 'startDate' | 'endDate', value: string) => {
        updateNestedField('education', index, field, value);
    };

    const addExperience = () => addItem('experience', createEmptyExperience());
    
    const addEducation = () => addItem('education', createEmptyEducation());
    
    const addLanguage = () => addItem('languages', createEmptyLanguage());

    return (
        <article className="bg-white text-neutral-900 p-10 max-w-[210mm] min-h-[297mm] mx-auto font-sans leading-relaxed shadow-sm print:shadow-none">

            
            <header className="flex items-center gap-6 border-b border-neutral-200 pb-6 mb-6">
                <InlineImageUpload
                    value={imagePreviewUrl ?? undefined}
                    onChange={setImageFile}
                />

                <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                        <InlineInput
                            value={data.personalInfo.firstName}
                            onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                            placeholder={t('resume.placeholders.firstName', 'Nombre')}
                            className="text-2xl font-bold tracking-tight text-neutral-900"
                        />
                        <InlineInput
                            value={data.personalInfo.lastName}
                            onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                            placeholder={t('resume.placeholders.lastName', 'Apellidos')}
                            className="text-2xl font-bold tracking-tight text-neutral-900"
                        />
                    </div>

                    <InlineInput
                        value={data.personalInfo.title}
                        onChange={(e) => updatePersonalInfo('title', e.target.value)}
                        placeholder={t('resume.placeholders.title', 'Título Profesional')}
                        className="text-lg font-medium text-neutral-600"
                    />

                    <div className="text-xs text-neutral-500 flex flex-wrap items-center gap-2">
                        <InlineInput
                            value={data.personalInfo.email}
                            onChange={(e) => updatePersonalInfo('email', e.target.value)}
                            placeholder="Email"
                            className="w-auto min-w-120px"
                        />
                        <InlineInput
                            value={data.personalInfo.phone}
                            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                            placeholder="Teléfono"
                            className="w-auto min-w-100px"
                        />
                        <InlineInput
                            value={data.personalInfo.location}
                            onChange={(e) => updatePersonalInfo('location', e.target.value)}
                            placeholder="Ubicación"
                            className="w-auto min-w-120px"
                        />
                    </div>
                </div>
            </header>

           
            <SectionContainer title={t('resume.sections.summary', 'Perfil')}>
                <InlineTextArea
                    value={data.personalInfo.summary}
                    onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                    placeholder={t('resume.placeholders.summary', 'Resumen profesional...')}
                    rows={3}
                />
            </SectionContainer>

            <SectionContainer
                title={t('resume.sections.experience')}
                onAdd={addExperience}
                addLabel="resume.ui.addExperience"
            >
                <div className="space-y-4">
                    {data.experience.map((exp: ExperienceItem, index: number) => (
                        <ItemContainer key={exp.id} onRemove={() => removeItem('experience', index)}>
                            <div className="flex justify-between items-baseline gap-4 text-sm">
                                <div className="flex gap-1 font-semibold text-neutral-900 flex-1 items-baseline">
                                    <InlineInput
                                        value={exp.role}
                                        onChange={(e) => updateExperience(index, 'role', e.target.value)}
                                        placeholder="Puesto"
                                    />
                                    <span className="text-neutral-400 font-normal">-</span>
                                    <InlineInput
                                        value={exp.company}
                                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                        placeholder="Empresa"
                                    />
                                </div>
                                <InlineDatePicker
                                    startDate={exp.startDate}
                                    endDate={exp.endDate}
                                    onStartDateChange={(value) => updateExperienceDate(index, 'startDate', value)}
                                    onEndDateChange={(value) => updateExperienceDate(index, 'endDate', value)}
                                />
                            </div>
                        </ItemContainer>
                    ))}
                </div>
            </SectionContainer>

            <SectionContainer
                title={t('resume.sections.education')}
                onAdd={addEducation}
                addLabel="resume.ui.addEducation"
            >
                <div className="space-y-3">
                    {data.education.map((edu: EducationItem, index: number) => (
                        <ItemContainer key={edu.id} onRemove={() => removeItem('education', index)}>
                            <div className="flex justify-between items-baseline gap-4 text-sm">
                                <div className="flex-1 space-y-1">
                                    <InlineInput
                                        value={edu.degree}
                                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                        placeholder="Título/Grado"
                                        className="font-semibold text-neutral-900"
                                    />
                                    <InlineInput
                                        value={edu.institution}
                                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                        placeholder="Institución"
                                        className="text-xs text-neutral-600"
                                    />
                                </div>
                                <InlineDatePicker
                                    startDate={edu.startDate}
                                    endDate={edu.endDate}
                                    onStartDateChange={(value) => updateEducationDate(index, 'startDate', value)}
                                    onEndDateChange={(value) => updateEducationDate(index, 'endDate', value)}
                                />
                            </div>
                        </ItemContainer>
                    ))}
                </div>
            </SectionContainer>

            <SectionContainer
                title={t('resume.sections.languages')}
                onAdd={addLanguage}
                addLabel="resume.ui.addLanguage"
            >
                <div className="flex flex-wrap gap-4 text-xs">
                    {data.languages.map((lang: LanguageItem, index: number) => (
                        <ItemContainer key={lang.language + index} onRemove={() => removeItem('languages', index)}>
                            <div className="flex items-center gap-1">
                                <InlineInputCommit
                                    value={lang.language}
                                    onCommit={(value) => updateLanguage(index, 'language', value)}
                                    placeholder="Idioma"
                                    className="font-semibold text-neutral-700 w-24"
                                />
                                <InlineSelect
                                    value={lang.proficiency}
                                    onChange={(e) => updateLanguage(index, 'proficiency', e.target.value)}
                                >
                                    <option value="a1">A1</option>
                                    <option value="a2">A2</option>
                                    <option value="b1">B1</option>
                                    <option value="b2">B2</option>
                                    <option value="c1">C1</option>
                                    <option value="c2">C2</option>
                                    <option value="native">{t('resume.proficiencies.native', 'Nativo')}</option>
                                    <option value="fluent">{t('resume.proficiencies.fluent', 'Fluido')}</option>
                                    <option value="intermediate">{t('resume.proficiencies.intermediate', 'Intermedio')}</option>
                                    <option value="basic">{t('resume.proficiencies.basic', 'Básico')}</option>
                                </InlineSelect>
                            </div>
                        </ItemContainer>
                    ))}
                </div>
            </SectionContainer>

        </article>
    );
};

export default GenericTemplate;