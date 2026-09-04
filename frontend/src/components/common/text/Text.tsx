import React from 'react';

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
    className?: string;
}

export const Text: React.FC<TextProps> = ({ children, className = '', ...props }) => {
    return (
        <p className={`text-base sm:text-sm text-neutral-600 leading-relaxed ${className}`} {...props}>
            {children}
        </p>
    );
};