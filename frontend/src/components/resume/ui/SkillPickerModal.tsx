// src/components/resume/ui/SkillPickerModal.tsx
import type React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CatalogItem } from '../../../hooks/useCatalog';

interface SkillPickerModalProps {
    open: boolean;
    title: string;
    items: CatalogItem[];
    selected: string[];
    onToggle: (name: string) => void;
    onClose: () => void;
}

export const SkillPickerModal: React.FC<SkillPickerModalProps> = ({
    open,
    title,
    items,
    selected,
    onToggle,
    onClose,
}) => {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');

    useEffect(() => {
        if (!open) {
            setQuery('');
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    const normalized = query.trim().toLowerCase();
    const filtered = normalized
        ? items.filter(
              (item) =>
                  item.name.toLowerCase().includes(normalized) ||
                  item.id.toLowerCase().includes(normalized)
          )
        : items;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xl flex flex-col max-h-[80vh]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
                    <h3 className="text-sm font-semibold text-neutral-800">{title}</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer text-neutral-400 hover:text-neutral-600 text-lg leading-none"
                    >
                        ✕
                    </button>
                </div>
                <div className="px-5 py-3 border-b border-neutral-100">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t('resume.ui.searchSkill', 'Buscar...')}
                        className="w-full border border-neutral-200 focus:border-blue-500 rounded px-3 py-1.5 text-sm outline-none transition-colors"
                        autoFocus
                    />
                </div>
                <div className="px-5 py-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {filtered.map((item) => {
                        const active = selected.includes(item.name);
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => onToggle(item.name)}
                                className={`cursor-pointer flex items-center gap-2 rounded border px-2.5 py-2 text-xs transition-colors ${
                                    active
                                        ? 'bg-blue-50 border-blue-400 text-blue-700'
                                        : 'bg-white border-neutral-200 text-neutral-700 hover:border-blue-300'
                                }`}
                            >
                                <span className="truncate">{item.name}</span>
                                {active && <span className="ml-auto text-blue-600">✓</span>}
                            </button>
                        );
                    })}
                </div>
                <div className="flex justify-end px-5 py-3 border-t border-neutral-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                    >
                        {t('resume.ui.done', 'Listo')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SkillPickerModal;