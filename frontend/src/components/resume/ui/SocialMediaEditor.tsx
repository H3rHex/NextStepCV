// src/components/resume/ui/SocialMediaEditor.tsx
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { createEmptySocialMediaItem } from '../../../hooks/useResumeForm';
import type { CatalogItem } from '../../../hooks/useCatalog';
import type { SocialMediaItem } from '../types';
import { InlineInput } from './InlineInput';
import { InlineSelect } from './InlineSelect';

interface SocialMediaEditorProps {
    items: SocialMediaItem[];
    catalog: CatalogItem[];
    onChange: (items: SocialMediaItem[]) => void;
}

export const SocialMediaEditor: React.FC<SocialMediaEditorProps> = ({
    items,
    catalog,
    onChange,
}) => {
    const { t } = useTranslation();

    const networkForName = (name: string) => catalog.find((entry) => entry.name === name);

    const updateItem = (index: number, patch: Partial<SocialMediaItem>) => {
        onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
    };

    const handleNetworkChange = (index: number, name: string) => {
        const current = items[index];
        const prevNetwork = networkForName(current.name);
        const nextNetwork = networkForName(name);
        const prevAutoUrl = prevNetwork?.urlTemplate?.replace('{username}', current.username);
        let url = current.url;
        if (nextNetwork?.urlTemplate && (!current.url || current.url === prevAutoUrl)) {
            url = nextNetwork.urlTemplate.replace('{username}', current.username);
        }
        updateItem(index, { name, url });
    };

    const handleUsernameChange = (index: number, username: string) => {
        const current = items[index];
        const network = networkForName(current.name);
        const prevAutoUrl = network?.urlTemplate?.replace('{username}', current.username);
        let url = current.url;
        if (network?.urlTemplate && (!current.url || current.url === prevAutoUrl)) {
            url = network.urlTemplate.replace('{username}', username);
        }
        updateItem(index, { username, url });
    };

    const removeItem = (index: number) => {
        onChange(items.filter((_, i) => i !== index));
    };

    const addItem = () => {
        onChange([...items, createEmptySocialMediaItem(catalog[0]?.name ?? '')]);
    };

    return (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
            {items.map((item, index) => {
                const network = networkForName(item.name);
                return (
                    <span
                        key={item.id}
                        className="inline-flex items-center gap-1 border border-neutral-200 bg-neutral-50 rounded px-1.5 py-0.5"
                    >
                        {network && (
                            <img
                                src={`${import.meta.env.BASE_URL}${network.icon}`}
                                alt=""
                                className="h-3.5 w-3.5 shrink-0"
                            />
                        )}
                        <InlineSelect
                            value={item.name}
                            onChange={(e) => handleNetworkChange(index, e.target.value)}
                            className="w-24 text-[11px]"
                        >
                            {catalog.map((networkOption) => (
                                <option key={networkOption.id} value={networkOption.name}>
                                    {networkOption.name}
                                </option>
                            ))}
                        </InlineSelect>
                        <InlineInput
                            value={item.username}
                            onChange={(e) => handleUsernameChange(index, e.target.value)}
                            placeholder={t('resume.ui.socialUsername', 'usuario')}
                            className="w-24 text-[11px]"
                        />
                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                            ✕
                        </button>
                    </span>
                );
            })}
            <button
                type="button"
                onClick={addItem}
                className="cursor-pointer text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors"
            >
                {t('resume.ui.addSocialMedia', '+ Agregar red social')}
            </button>
        </div>
    );
};

export default SocialMediaEditor;