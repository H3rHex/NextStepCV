import type React from 'react';

interface ItemContainerProps {
    onRemove?: () => void;
    children: React.ReactNode;
}

export const ItemContainer: React.FC<ItemContainerProps> = ({ onRemove, children }) => {
    return (
        <div className="group relative">
            {children}
            {onRemove && (
                <button
                    onClick={onRemove}
                    type="button"
                    title="resume.ui.remove"
                    className="absolute -right-6 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 text-xs transition-opacity p-1 cursor-pointer"
                >
                    ✕
                </button>
            )}
        </div>
    );
};