import type React from 'react';

type InlineInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const InlineInput: React.FC<InlineInputProps> = ({ className = '', ...props }) => {
    return (
        <input
            className={`bg-neutral-50/80 border border-neutral-200 focus:border-blue-500 focus:bg-white px-1.5 py-0.5 rounded outline-none transition-all w-full ${className}`}
            {...props}
        />
    );
};