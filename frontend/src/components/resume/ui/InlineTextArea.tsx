import type React from 'react';

type InlineTextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const InlineTextArea: React.FC<InlineTextAreaProps> = ({ className = '', ...props }) => {
    return (
        <textarea
            className={`w-full bg-neutral-50/80 border border-neutral-200 focus:border-blue-500 focus:bg-white p-1.5 rounded outline-none resize-none transition-all ${className}`}
            {...props}
        />
    );
};