import type React from 'react';
import { useTranslation } from 'react-i18next';

interface InlineImageUploadProps {
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
}

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const InlineImageUpload: React.FC<InlineImageUploadProps> = ({ 
    value, 
    onChange, 
    className = '' 
}) => {
    const { t } = useTranslation();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert(t('resume.errors.invalidImageType'));
            return;
        }

        const maxSizeEnv = import.meta.env.VITE_MAX_IMAGE_SIZE_BYTES;
        const maxSize = maxSizeEnv ? parseInt(maxSizeEnv, 10) : null;
        
        if (maxSize && file.size > maxSize) {
            alert(t('resume.errors.imageTooLarge', {
                maxSize: formatBytes(maxSize),
                currentSize: formatBytes(file.size),
            }));
            return;
        }

        try {
            const base64 = await fileToBase64(file);
            onChange?.(base64);
        } catch {
            alert(t('resume.errors.imageProcessingError'));
        }
    };

    return (
        <div className={`relative group w-24 h-24 bg-neutral-100 rounded-full overflow-hidden shrink-0 border border-neutral-300 flex items-center justify-center text-xs text-neutral-400 ${className}`}>
            {value ? (
                <img 
                    src={value} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                />
            ) : (
                <span>{t('resume.image.placeholder')}</span>
            )}
            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] cursor-pointer transition-opacity">
                <span>{t('resume.image.change')}</span>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                />
            </label>
        </div>
    );
};