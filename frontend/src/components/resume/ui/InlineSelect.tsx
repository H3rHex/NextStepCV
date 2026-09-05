import type React from 'react';

type InlineSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const InlineSelect: React.FC<InlineSelectProps> = ({
    className = '',
    children,
    ...props
}) => {
    return (
        <select
            className={`bg-neutral-50/80 border border-neutral-200 focus:border-blue-500 focus:bg-white px-1.5 py-0.5 rounded outline-none transition-all cursor-pointer text-neutral-700 ${className}`}
            {...props}
        >
            {children}
        </select>
    );
};