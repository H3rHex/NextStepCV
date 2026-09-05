import type React from 'react';

interface InlineImageUploadProps {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InlineImageUpload: React.FC<InlineImageUploadProps> = ({ value, onChange }) => {
    return (
        <div className="relative group w-24 h-24 bg-neutral-100 rounded-full overflow-hidden shrink-0 border border-neutral-300 flex items-center justify-center text-xs text-neutral-400">
            {value ? (
                <img src={value} alt="Profile" className="w-full h-full object-cover" />
            ) : (
                <span>FOTO</span>
            )}
            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] cursor-pointer transition-opacity">
                <span>Cambiar</span>
                <input type="file" accept="image/*" onChange={onChange} className="hidden" />
            </label>
        </div>
    );
};