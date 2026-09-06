// src/components/resume/templates/DeveloperTemplate.tsx
import type React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCatalog } from '../../../hooks/useCatalog';
import type { CatalogItem } from '../../../hooks/useCatalog';
import type { UseResumeFormReturn } from '../../../hooks/useResumeForm';
import { createEmptyEducation, createEmptyExperience, createEmptyLanguage } from '../../../hooks/useResumeForm';
import type {
    DeveloperResumeData,
    DeveloperTechnicalSkills,
    EducationItem,
    ExperienceItem,
    LanguageItem,
    SocialMediaItem,
} from '../types';

import { InlineDatePicker } from '../ui/InlineDatePicker';
import { InlineInput } from '../ui/InlineInput';
import { InlineInputCommit } from '../ui/InlineInputCommit';
import { InlineSelect } from '../ui/InlineSelect';
import { InlineTextArea } from '../ui/InlineTextArea';
import { ItemContainer } from '../ui/ItemContainer';
import { SectionContainer } from '../ui/SelectionContainer';
import { SkillPickerModal } from '../ui/SkillPickerModal';
import { SocialMediaEditor } from '../ui/SocialMediaEditor';
import { ResumeHeader } from './ResumeHeader';

type SkillCategory = 'languages' | 'frameworks';

interface DeveloperTemplateProps {
    data: DeveloperResumeData;
    updateField: UseResumeFormReturn<DeveloperResumeData>['updateField'];
    updateNestedField: UseResumeFormReturn<DeveloperResumeData>['updateNestedField'];
    addItem: UseResumeFormReturn<DeveloperResumeData>['addItem'];
    removeItem: UseResumeFormReturn<DeveloperResumeData>['removeItem'];
    setImageFile: UseResumeFormReturn<DeveloperResumeData>['setImageFile'];
    imagePreviewUrl: string | null;
}

const EMPTY_SKILLS: DeveloperTechnicalSkills = {
    programmingLanguages: [],
    frameworks: [],
    toolsAndDatabases: [],
};

const iconUrlFor = (name: string, catalog: CatalogItem[]): string | undefined => {
    const item = catalog.find((entry) => entry.name === name);
    return item ? `${import.meta.env.BASE_URL}${item.icon}` : undefined;
};

interface SkillChipProps {
    name: string;
    iconUrl?: string;
    onRemove: () => void;
}

const SkillChip: React.FC<SkillChipProps> = ({ name, iconUrl, onRemove }) => (
    <span className="inline-flex items-center gap-1.5 border border-neutral-200 bg-neutral-50 text-neutral-700 text-xs rounded px-2 py-0.5">
        {iconUrl && <img src={iconUrl} alt="" className="h-3.5 w-3.5 shrink-0" />}
        <span>{name}</span>
        <button
            type="button"
            onClick={onRemove}
            className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
        >
            ✕
        </button>
    </span>
);

export const DeveloperTemplate: React.FC<DeveloperTemplateProps> = ({
    data,
    updateField,
    updateNestedField,
    addItem,
    removeItem,
    setImageFile,
    imagePreviewUrl,
}) => {
    const { t } = useTranslation();

    const [activePicker, setActivePicker] = useState<SkillCategory | null>(null);

    const languagesCatalog = useCatalog('languages/languages.json');
    const frameworksCatalog = useCatalog('frameworks/frameworks.json');
    const socialCatalog = useCatalog('social/social.json');

    const skills: DeveloperTechnicalSkills = data.technicalSkills ?? EMPTY_SKILLS;
    const socialMedia: SocialMediaItem[] = data.socialMedia ?? [];

    const updatePersonalInfo = (field: keyof DeveloperResumeData['personalInfo'], value: string) => {
        updateField('personalInfo', { ...data.personalInfo, [field]: value });
    };

    const updateExperience = (index: number, field: keyof ExperienceItem, value: string | boolean) => {
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

    const toggleExperienceDescription = (index: number, show: boolean) => {
        updateExperience(index, 'showDescription', show);
    };

    const toggleSkill = (category: SkillCategory, name: string) => {
        const field = category === 'languages' ? 'programmingLanguages' : 'frameworks';
        const current = skills[field];
        const next = current.includes(name)
            ? current.filter((skill) => skill !== name)
            : [...current, name];
        updateField('technicalSkills', { ...skills, [field]: next });
    };

    const updateSocial = (items: SocialMediaItem[]) => {
        updateField('socialMedia', items);
    };

    const skillsCatalog: Record<SkillCategory, CatalogItem[]> = {
        languages: languagesCatalog.items,
        frameworks: frameworksCatalog.items,
    };

    const pickerItems = activePicker ? skillsCatalog[activePicker] : [];
    const pickerSelected = activePicker
        ? skills[activePicker === 'languages' ? 'programmingLanguages' : 'frameworks']
        : [];

    const pickerTitle =
        activePicker === 'languages'
            ? t('resume.sections.programmingLanguages', 'Lenguajes de programación')
            : t('resume.sections.frameworks', 'Frameworks');

    return (
        <>
            <article className="bg-white text-neutral-900 p-10 max-w-[210mm] min-h-[297mm] mx-auto font-sans leading-[1.6] shadow-sm print:shadow-none">

                <ResumeHeader
                    data={data}
                    updateField={updateField}
                    setImageFile={setImageFile}
                    imagePreviewUrl={imagePreviewUrl}
                />

                <SectionContainer title={t('resume.sections.summary', 'Perfil')}>
                    <InlineTextArea
                        value={data.personalInfo.summary}
                        onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                        placeholder={t('resume.placeholders.summary', 'Resumen profesional...')}
                        rows={3}
                        className="text-[13px] leading-[1.6]"
                    />
                </SectionContainer>

                <SectionContainer title={t('resume.sections.technicalSkills', 'Habilidades técnicas')}>
                    <div className="space-y-4">
                        <div>
                            <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                                {t('resume.sections.programmingLanguages', 'Lenguajes de programación')}
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                                {skills.programmingLanguages.map((name) => (
                                    <SkillChip
                                        key={name}
                                        name={name}
                                        iconUrl={iconUrlFor(name, languagesCatalog.items)}
                                        onRemove={() => toggleSkill('languages', name)}
                                    />
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setActivePicker('languages')}
                                    className="border border-dashed border-neutral-300 text-neutral-400 hover:border-blue-300 hover:text-blue-600 text-xs rounded px-2 py-0.5 transition-colors cursor-pointer"
                                >
                                    + {t('resume.ui.addSkill', 'Añadir')}
                                </button>
                            </div>
                        </div>
                        <div>
                            <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                                {t('resume.sections.frameworks', 'Frameworks')}
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                                {skills.frameworks.map((name) => (
                                    <SkillChip
                                        key={name}
                                        name={name}
                                        iconUrl={iconUrlFor(name, frameworksCatalog.items)}
                                        onRemove={() => toggleSkill('frameworks', name)}
                                    />
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setActivePicker('frameworks')}
                                    className="border border-dashed border-neutral-300 text-neutral-400 hover:border-blue-300 hover:text-blue-600 text-xs rounded px-2 py-0.5 transition-colors cursor-pointer"
                                >
                                    + {t('resume.ui.addSkill', 'Añadir')}
                                </button>
                            </div>
                        </div>
                    </div>
                </SectionContainer>

                <SectionContainer title={t('resume.sections.socialMedia', 'Redes sociales y portafolio')}>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs">
                            <span className="w-28 shrink-0 text-neutral-500">
                                {t('resume.ui.website', 'Web / Portafolio')}
                            </span>
                            <InlineInput
                                value={data.personalInfo.website ?? ''}
                                onChange={(e) => updatePersonalInfo('website', e.target.value)}
                                placeholder="https://..."
                                className="w-auto"
                            />
                        </div>
                        <SocialMediaEditor
                            items={socialMedia}
                            catalog={socialCatalog.items}
                            onChange={updateSocial}
                        />
                    </div>
                </SectionContainer>

                <SectionContainer
                    title={t('resume.sections.experience')}
                    onAdd={addExperience}
                    addLabel="resume.ui.addExperience"
                >
                    <div className="space-y-4">
                        {data.experience.map((exp: ExperienceItem, index: number) => (
                            <ItemContainer key={exp.id} onRemove={() => removeItem('experience', index)}>
                                <div className="flex justify-between items-baseline gap-4 text-[12.5px] mb-3">
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
                                {exp.showDescription ? (
                                    <div>
                                        <InlineTextArea
                                            value={exp.description ?? ''}
                                            onChange={(e) => updateExperience(index, 'description', e.target.value)}
                                            placeholder={t('resume.placeholders.description', 'Describe tus responsabilidades y logros en el puesto...')}
                                            rows={2}
                                            className="text-[12.5px] leading-normal"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => toggleExperienceDescription(index, false)}
                                            className="cursor-pointer text-red-500 text-xs hover:text-red-700 transition-colors"
                                        >
                                            {t('resume.ui.removeDescription', '- Quitar descripción')}
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => toggleExperienceDescription(index, true)}
                                        className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                    >
                                        {t('resume.ui.addDescription', '+ Añadir descripción')}
                                    </button>
                                )}
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
                                <div className="flex justify-between items-baseline gap-4 text-[12.5px]">
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
                    <div className="flex flex-wrap gap-4 text-[12.5px]">
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

            <SkillPickerModal
                open={activePicker !== null}
                title={pickerTitle}
                items={pickerItems}
                selected={pickerSelected}
                onToggle={(name) => toggleSkill(activePicker as SkillCategory, name)}
                onClose={() => setActivePicker(null)}
            />
        </>
    );
};

export default DeveloperTemplate;