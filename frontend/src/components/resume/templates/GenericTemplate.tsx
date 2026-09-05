// src/components/resume/templates/GenericTemplate.tsx
import type React from 'react';
import { useTranslation } from 'react-i18next';
import type { BaseResumeData } from '../types/base';

// Importamos los componentes UI atómicos
import { InlineDatePicker } from '../ui/InlineDatePicker';
import { InlineImageUpload } from '../ui/InlineImageUpload';
import { InlineInput } from '../ui/InlineInput';
import { InlineSelect } from '../ui/InlineSelect';
import { InlineTextArea } from '../ui/InlineTextArea';
import { ItemContainer } from '../ui/ItemContainer';
import { SectionContainer } from '../ui/SelectionContainer';

interface GenericTemplateProps {
    data: BaseResumeData;
}

export const GenericTemplate: React.FC<GenericTemplateProps> = ({ data }) => {
    const { t } = useTranslation();
    const { personalInfo, experience, education, languages } = data;

    return (
        <article className="bg-white text-neutral-900 p-10 max-w-[210mm] min-h-[297mm] mx-auto font-sans leading-relaxed shadow-sm print:shadow-none">

            <header className="flex items-center gap-6 border-b border-neutral-200 pb-6 mb-6">
                <InlineImageUpload
                    value={undefined}
                    onChange={() => { }}
                />

                <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                        <InlineInput
                            value={personalInfo.firstName}
                            onChange={() => { }}
                            placeholder={t('resume.placeholders.firstName', 'Nombre')}
                            className="text-2xl font-bold tracking-tight text-neutral-900"
                        />
                        <InlineInput
                            value={personalInfo.lastName}
                            onChange={() => { }}
                            placeholder={t('resume.placeholders.lastName', 'Apellidos')}
                            className="text-2xl font-bold tracking-tight text-neutral-900"
                        />
                    </div>

                    <InlineInput
                        value={personalInfo.title}
                        onChange={() => { }}
                        placeholder={t('resume.placeholders.title', 'Título Profesional')}
                        className="text-lg font-medium text-neutral-600"
                    />

                    <div className="text-xs text-neutral-500 flex flex-wrap items-center gap-2">
                        <InlineInput
                            value={personalInfo.email}
                            onChange={() => { }}
                            placeholder="Email"
                            className="w-auto min-w-120px"
                        />
                        <span>•</span>
                        <InlineInput
                            value={personalInfo.phone}
                            onChange={() => { }}
                            placeholder="Teléfono"
                            className="w-auto min-w-100px"
                        />
                        <span>•</span>
                        <InlineInput
                            value={personalInfo.location}
                            onChange={() => { }}
                            placeholder="Ubicación"
                            className="w-auto min-w-120px"
                        />
                    </div>
                </div>
            </header>

            <SectionContainer title={t('resume.sections.summary', 'Perfil')}>
                <InlineTextArea
                    value={personalInfo.summary}
                    onChange={() => { }}
                    placeholder={t('resume.placeholders.summary', 'Resumen profesional...')}
                    rows={3}
                />
            </SectionContainer>

            <SectionContainer
                title={t('resume.sections.experience')}
                onAdd={() => { }}
            >
                <div className="space-y-4">
                    {experience.map((exp) => (
                        <ItemContainer key={exp.id} onRemove={() => { }}>
                            <div className="flex justify-between items-baseline gap-4 text-sm">
                                <div className="flex gap-1 font-semibold text-neutral-900 flex-1 items-baseline">
                                    <InlineInput
                                        value={exp.role}
                                        onChange={() => { }}
                                        placeholder="Puesto"
                                    />
                                    <span className="text-neutral-400 font-normal">at</span>
                                    <InlineInput
                                        value={exp.company}
                                        onChange={() => { }}
                                        placeholder="Empresa"
                                    />
                                </div>
                                <InlineDatePicker
                                    startDate={exp.startDate}
                                    endDate={exp.endDate}
                                    onStartDateChange={() => { }}
                                    onEndDateChange={() => { }}
                                />
                            </div>
                        </ItemContainer>
                    ))}
                </div>
            </SectionContainer>

            <SectionContainer
                title={t('resume.sections.education')}
                onAdd={() => { }}
            >
                <div className="space-y-3">
                    {education.map((edu) => (
                        <ItemContainer key={edu.id} onRemove={() => { }}>
                            <div className="flex justify-between items-baseline gap-4 text-sm">
                                <div className="flex-1 space-y-1">
                                    <InlineInput
                                        value={edu.degree}
                                        onChange={() => { }}
                                        placeholder="Título/Grado"
                                        className="font-semibold text-neutral-900"
                                    />
                                    <InlineInput
                                        value={edu.institution}
                                        onChange={() => { }}
                                        placeholder="Institución"
                                        className="text-xs text-neutral-600"
                                    />
                                </div>
                                <InlineDatePicker
                                    startDate={edu.startDate}
                                    endDate={edu.endDate}
                                    onStartDateChange={() => { }}
                                    onEndDateChange={() => { }}
                                />
                            </div>
                        </ItemContainer>
                    ))}
                </div>
            </SectionContainer>

            <SectionContainer
                title={t('resume.sections.languages')}
                onAdd={() => { }}
            >
                <div className="flex flex-wrap gap-4 text-xs">
                    {languages.map((lang, idx) => (
                        <ItemContainer key={idx} onRemove={() => { }}>
                            <div className="flex items-center gap-1">
                                <InlineInput
                                    value={lang.language}
                                    onChange={() => { }}
                                    placeholder="Idioma"
                                    className="font-semibold text-neutral-700 w-24"
                                />
                                <InlineSelect
                                    value={lang.proficiency}
                                    onChange={() => { }}
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