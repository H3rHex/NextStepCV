import type React from 'react';
import { useTranslation } from 'react-i18next';
import type { UseResumeFormReturn } from '../../../hooks/useResumeForm';
import type { BaseResumeData } from '../types';
import { InlineImageUpload } from '../ui/InlineImageUpload';
import { InlineInput } from '../ui/InlineInput';

const DRIVING_LICENSE_TYPES = ['AM', 'A1', 'A2', 'A', 'B', 'B1', 'C1', 'C', 'D1', 'D'];

interface ResumeHeaderProps {
    data: BaseResumeData;
    updateField: UseResumeFormReturn<BaseResumeData>['updateField'];
    setImageFile: UseResumeFormReturn<BaseResumeData>['setImageFile'];
    imagePreviewUrl: string | null;
}

export const ResumeHeader: React.FC<ResumeHeaderProps> = ({
    data,
    updateField,
    setImageFile,
    imagePreviewUrl,
}) => {
    const { t } = useTranslation();

    const updatePersonalInfo = (field: keyof BaseResumeData['personalInfo'], value: string) => {
        updateField('personalInfo', { ...data.personalInfo, [field]: value });
    };

    const toggleDriving = (show: boolean) => {
        updateField('showDriving', show);
    };

    const toggleDrivingLicense = (license: string) => {
        const current = data.drivingLicenses ?? [];
        const next = current.includes(license)
            ? current.filter((l) => l !== license)
            : [...current, license];
        updateField('drivingLicenses', next);
    };

    return (
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
                        className="text-xl font-bold tracking-tight text-neutral-900"
                    />
                    <InlineInput
                        value={data.personalInfo.lastName}
                        onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                        placeholder={t('resume.placeholders.lastName', 'Apellidos')}
                        className="text-xl font-bold tracking-tight text-neutral-900"
                    />
                </div>

                <InlineInput
                    value={data.personalInfo.title}
                    onChange={(e) => updatePersonalInfo('title', e.target.value)}
                    placeholder={t('resume.placeholders.title', 'Título Profesional')}
                    className="text-base font-medium text-neutral-600"
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

                {data.showDriving ? (
                    <div className="flex flex-row flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs">
                        <label className="flex items-center gap-1.5 text-neutral-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={!!data.hasCar}
                                onChange={(e) => updateField('hasCar', e.target.checked)}
                                className="accent-blue-600"
                            />
                            {t('resume.ui.hasCar', 'Tengo coche')}
                        </label>
                        <span className="text-neutral-400">{t('resume.ui.licenses', 'Permisos')}:</span>
                        <div>
                            {DRIVING_LICENSE_TYPES.map((license) => {
                                const active = (data.drivingLicenses ?? []).includes(license);
                                return (
                                    <button
                                        key={license}
                                        type="button"
                                        onClick={() => toggleDrivingLicense(license)}
                                        className={`cursor-pointer px-1 py-0 rounded border transition-colors ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-blue-300'}`}
                                    >
                                        {license}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            type="button"
                            onClick={() => toggleDriving(false)}
                            className="text-neutral-400 hover:text-neutral-600 underline transition-colors cursor-pointer"
                        >
                            {t('resume.ui.removeDriving', 'Quitar')}
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => toggleDriving(true)}
                        className="pt-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors cursor-pointer"
                    >
                        {t('resume.ui.addDriving', '+ Añadir conducción')}
                    </button>
                )}
            </div>
        </header>
    );
};