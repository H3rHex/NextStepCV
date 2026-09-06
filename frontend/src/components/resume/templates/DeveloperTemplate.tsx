// src/components/resume/templates/DeveloperTemplate.tsx
import type React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CatalogItem } from '../../../hooks/useCatalog';
import { useCatalog } from '../../../hooks/useCatalog';
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

type SkillCategory = 'languages' | 'frameworks' | 'tools';

const SKILL_FIELDS: Record<SkillCategory, keyof DeveloperTechnicalSkills> = {
    languages: 'programmingLanguages',
    frameworks: 'frameworks',
    tools: 'toolsAndDatabases',
};

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

const MINI_TITLE = 'text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mb-2';

interface SkillChipProps {
    name: string;
    onRemove: () => void;
}

const SkillChip: React.FC<SkillChipProps> = ({ name, onRemove }) => (
    <span className="inline-flex items-center gap-1 border border-neutral-200 bg-neutral-50 text-neutral-700 text-xs rounded px-2 py-0.5">
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

interface SkillLineProps {
    label: string;
    names: string[];
    onToggle: (name: string) => void;
    onOpenPicker: () => void;
    addLabel: string;
}

const SkillLine: React.FC<SkillLineProps> = ({ label, names, onToggle, onOpenPicker, addLabel }) => (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs">
        <span className="font-medium text-neutral-500 shrink-0">{label}:</span>
        {names.map((name) => (
            <SkillChip key={name} name={name} onRemove={() => onToggle(name)} />
        ))}
        <button
            type="button"
            onClick={onOpenPicker}
            className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
            + {addLabel}
        </button>
    </div>
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
    const toolsCatalog = useCatalog('tools/tools.json');
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
        const field = SKILL_FIELDS[category];
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
        tools: toolsCatalog.items,
    };

    const pickerItems = activePicker ? skillsCatalog[activePicker] : [];
    const pickerSelected = activePicker ? skills[SKILL_FIELDS[activePicker]] : [];

    const pickerTitle =
        activePicker === 'languages'
            ? t('resume.sections.programmingLanguages', 'Lenguajes de programación')
            : activePicker === 'frameworks'
              ? t('resume.sections.frameworks', 'Frameworks')
              : t('resume.sections.toolsAndDatabases', 'Herramientas y bases de datos');

    const headerExtra = (
        <div className="pt-1 flex flex-col gap-1.5 text-xs">
            <div className="flex items-center gap-2">
                <span className="w-16 shrink-0 text-neutral-400">{t('resume.ui.website', 'Web')}</span>
                <InlineInput
                    value={data.personalInfo.website ?? ''}
                    onChange={(e) => updatePersonalInfo('website', e.target.value)}
                    placeholder="https://..."
                    className="w-auto"
                />
            </div>
            <SocialMediaEditor items={socialMedia} catalog={socialCatalog.items} onChange={updateSocial} />
        </div>
    );

    return (
        <>
            <article className="bg-white text-neutral-900 p-8 max-w-[210mm] min-h-[297mm] mx-auto font-sans leading-[1.6] shadow-sm print:shadow-none">

                <ResumeHeader
                    data={data}
                    updateField={updateField}
                    setImageFile={setImageFile}
                    imagePreviewUrl={imagePreviewUrl}
                    extra={headerExtra}
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
                    <div className="space-y-1.5">
                        <SkillLine
                            label={t('resume.sections.programmingLanguages', 'Lenguajes de programación')}
                            names={skills.programmingLanguages}
                            onToggle={(name) => toggleSkill('languages', name)}
                            onOpenPicker={() => setActivePicker('languages')}
                            addLabel={t('resume.ui.addSkill', 'Añadir')}
                        />
                        <SkillLine
                            label={t('resume.sections.frameworks', 'Frameworks')}
                            names={skills.frameworks}
                            onToggle={(name) => toggleSkill('frameworks', name)}
                            onOpenPicker={() => setActivePicker('frameworks')}
                            addLabel={t('resume.ui.addSkill', 'Añadir')}
                        />
                        <SkillLine
                            label={t('resume.sections.toolsAndDatabases', 'Herramientas y bases de datos')}
                            names={skills.toolsAndDatabases}
                            onToggle={(name) => toggleSkill('tools', name)}
                            onOpenPicker={() => setActivePicker('tools')}
                            addLabel={t('resume.ui.addSkill', 'Añadir')}
                        />
                    </div>
                </SectionContainer>

                <SectionContainer
                    title={t('resume.sections.experience')}
                    onAdd={addExperience}
                    addLabel="resume.ui.addExperience"
                >
                    <div className="space-y-3">
                        {data.experience.map((exp: ExperienceItem, index: number) => (
                            <ItemContainer key={exp.id} onRemove={() => removeItem('experience', index)}>
                                <div className="flex justify-between items-baseline gap-4 text-[12.5px] mb-2">
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
                                        className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                                    >
                                        {t('resume.ui.addDescription', '+ Añadir descripción')}
                                    </button>
                                )}
                            </ItemContainer>
                        ))}
                    </div>
                </SectionContainer>

                {data.repositories && data.repositories.length > 0 && (
                    <SectionContainer title={t('resume.sections.repositories', 'Repositorios')}>
                        <div className="grid grid-cols-2 gap-3">
                            {data.repositories.map((repo, index) => (
                                <ItemContainer key={index} onRemove={() => removeItem('repositories', index)}>
                                    <div className="text-[12.5px] font-semibold text-neutral-900">{repo.name}</div>
                                    <div className="text-[11.5px] text-blue-600 truncate">{repo.url}</div>
                                    <div className="text-[11.5px] text-neutral-600">
                                        <InlineTextArea
                                            value={repo.description}
                                            onChange={(e) => updateNestedField('repositories', index, 'description', e.target.value)}
                                            rows={1}
                                            className="text-[11.5px] leading-normal"
                                        />
                                    </div>
                                </ItemContainer>
                            ))}
                        </div>
                    </SectionContainer>
                )}

                <SectionContainer title={t('resume.sections.educationLanguages', 'Educación e idiomas')}>
                    <div className="grid grid-cols-[3fr_2fr] gap-5">
                        <div>
                            <div className={MINI_TITLE}>{t('resume.sections.education')}</div>
                            <div className="space-y-2">
                                {data.education.map((edu: EducationItem, index: number) => (
                                    <ItemContainer key={edu.id} onRemove={() => removeItem('education', index)}>
                                        <div className="text-[12.5px] space-y-0.5">
                                            <InlineInput
                                                value={edu.degree}
                                                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                                placeholder="Título/Grado"
                                                className="font-semibold text-neutral-900"
                                            />
                                            <InlineDatePicker
                                                startDate={edu.startDate}
                                                endDate={edu.endDate}
                                                onStartDateChange={(value) => updateEducationDate(index, 'startDate', value)}
                                                onEndDateChange={(value) => updateEducationDate(index, 'endDate', value)}
                                                className="text-[11px]"
                                            />
                                            <InlineInput
                                                value={edu.institution}
                                                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                                placeholder="Institución"
                                                className="text-[11.5px] text-neutral-600"
                                            />
                                        </div>
                                    </ItemContainer>
                                ))}
                                <button
                                    type="button"
                                    onClick={addEducation}
                                    className="cursor-pointer text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors"
                                >
                                    {t('resume.ui.addEducation', 'Agregar Educación')}
                                </button>
                            </div>
                        </div>
                        <div>
                            <div className={MINI_TITLE}>{t('resume.sections.languages')}</div>
                            <div className="flex flex-wrap gap-1.5">
                                {data.languages.map((lang: LanguageItem, index: number) => (
                                    <span
                                        key={lang.language + index}
                                        className="group relative inline-flex items-center gap-1 border border-neutral-200 bg-neutral-50 rounded px-1.5 py-0.5 text-[11px]"
                                    >
                                        <InlineInputCommit
                                            value={lang.language}
                                            onCommit={(value) => updateLanguage(index, 'language', value)}
                                            placeholder="Idioma"
                                            className="font-medium text-neutral-600 w-14 text-[11px]"
                                        />
                                        <InlineSelect
                                            value={lang.proficiency}
                                            onChange={(e) => updateLanguage(index, 'proficiency', e.target.value)}
                                            className="w-20 text-[10.5px]"
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
                                        <button
                                            type="button"
                                            onClick={() => removeItem('languages', index)}
                                            className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                ))}
                                <button
                                    type="button"
                                    onClick={addLanguage}
                                    className="cursor-pointer text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors"
                                >
                                    {t('resume.ui.addLanguage', 'Agregar Idioma')}
                                </button>
                            </div>
                        </div>
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