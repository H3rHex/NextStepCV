import React from 'react';
import { useTranslation } from 'react-i18next';

interface ResumePageProps {
    children?: React.ReactNode;
    className?: string;
    onSave?: () => void;
    onReset?: () => void;
    canSave?: boolean;
}

export const ResumePage: React.FC<ResumePageProps> = ({
    children,
    className = '',
    onSave,
    onReset,
    canSave = false,
}) => {
    const { t } = useTranslation();

    return (
        <div className="w-full flex justify-center px-2 sm:px-4">
            <div
                className={`
                w-full 
                max-w-[210mm] 
                min-h-auto md:min-h-[297mm] 
                bg-white 
                shadow-sm md:shadow-md 
                border border-neutral-200/80 
                p-6 sm:p-10 md:p-14 
                rounded-sm 
                flex flex-col 
                transition-all duration-200
                    ${className}
                `}
                
                >
                {children}

                {(onSave || onReset) && (
                    <div className="mt-8 pt-6 border-t border-neutral-200 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onReset}
                            className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 cursor-pointer hover:bg-neutral-200 rounded transition-colors"
                        >
                            {t('resume.actions.reset', 'Restablecer')}
                        </button>
                        <button
                            type="button"
                            onClick={onSave}
                            disabled={!canSave}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 cursor-pointer hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed rounded transition-colors"
                        >
                            {t('resume.actions.save', 'Guardar')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};