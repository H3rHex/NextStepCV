import { useTranslation } from 'react-i18next';

export type ResumeType = 'developer' | 'general';

interface ResumeOption {
    id: ResumeType;
    label: string;
}

interface ResumeTypeSelectorProps {
    currentType: ResumeType;
    onSelectType: (type: ResumeType) => void;
}

const RESUME_OPTIONS: ResumeOption[] = [
    { id: 'developer', label: 'resume.type-selector.developer' },
    { id: 'general', label: 'resume.type-selector.general' },
];

export const ResumeTypeSelector = ({ currentType, onSelectType }: ResumeTypeSelectorProps) => {
    const { t } = useTranslation();

    return (
        <div className="w-full flex justify-center mb-6">
            <div className="inline-flex bg-neutral-200/70 p-1 rounded-full text-xs sm:text-sm font-medium">
                {RESUME_OPTIONS.map((option) => {
                    const isActive = currentType === option.id;

                    return (
                        <button
                            key={option.id}
                            onClick={() => onSelectType(option.id)}
                            className={`px-4 py-1.5 cursor-pointer rounded-full transition-all duration-200 ${isActive
                                    ? 'bg-white text-neutral-900 shadow-sm'
                                    : 'text-neutral-600 hover:text-neutral-900'
                                }`}
                        >
                            {t(option.label)}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
