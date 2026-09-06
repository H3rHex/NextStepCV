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

    const networkForName = (name: string) => catalog.find((item) => item.name === name);

    const updateItem = (index: number, patch: Partial<SocialMediaItem>) => {
        onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
    };

    const removeItem = (index: number) => {
        onChange(items.filter((_, i) => i !== index));
    };

    const addItem = () => {
        onChange([...items, createEmptySocialMediaItem(catalog[0]?.name ?? '')]);
    };

    const handleNetworkChange = (index: number, name: string) => {
        const current = items[index];
        const prevNetwork = networkForName(current.name);
        const nextNetwork = networkForName(name);
        const prevAutoUrl = prevNetwork?.urlTemplate?.replace('{username}', current.username);
        let url = current.url;
        if (nextNetwork?.urlTemplate && current.username && (!current.url || current.url === prevAutoUrl)) {
            url = nextNetwork.urlTemplate.replace('{username}', current.username);
        }
        updateItem(index, { name, url });
    };

    return (
        <div className="space-y-2">
            {items.map((item, index) => {
                const network = networkForName(item.name);
                return (
                    <div key={item.id} className="group relative flex items-center gap-2 text-xs">
                        <img
                            src={network ? `${import.meta.env.BASE_URL}${network.icon}` : undefined}
                            alt={item.name || t('resume.ui.socialNetwork', 'Red')}
                            className="h-4 w-4 shrink-0"
                        />
                        <InlineSelect
                            value={item.name}
                            onChange={(e) => handleNetworkChange(index, e.target.value)}
                            className="w-32 shrink-0"
                        >
                            {catalog.map((networkOption) => (
                                <option key={networkOption.id} value={networkOption.name}>
                                    {networkOption.name}
                                </option>
                            ))}
                        </InlineSelect>
                        <InlineInput
                            value={item.username}
                            onChange={(e) => updateItem(index, { username: e.target.value })}
                            placeholder={t('resume.ui.socialUsername', 'Usuario')}
                            className="w-28 shrink-0"
                        />
                        <InlineInput
                            value={item.url}
                            onChange={(e) => updateItem(index, { url: e.target.value })}
                            placeholder="https://..."
                            className="flex-1"
                        />
                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="shrink-0 text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>
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