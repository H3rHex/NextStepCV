import type React from 'react';
import { useTranslation } from 'react-i18next';

interface SectionContainerProps {
    title: string;
    onAdd?: () => void;
    addLabel?: string;
    children?: React.ReactNode;
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
    title,
    onAdd,
    addLabel = 'resume.ui.add',
    children,
}) => {
    const { t } = useTranslation();
    return (
        <section className="mb-6">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    {title}
                </h2>
                {onAdd && (
                    <button
                        onClick={onAdd}
                        type="button"
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                        {t(addLabel)}
                    </button>
                )}
            </div>
            {children}
        </section>
    );
};