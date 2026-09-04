import React from 'react';

interface StrongProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    className?: string;
}

export const Strong: React.FC<StrongProps> = ({ children, className = '', ...props }) => {
    return (
        <strong className={`font-semibold text-neutral-900 ${className}`} {...props}>
            {children}
        </strong>
    );
};