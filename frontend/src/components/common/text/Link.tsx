import React from 'react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export const Link: React.FC<LinkProps> = ({ href, children, className = '', ...props }) => {
    return (
        <a
            href={href}
            className={`text-neutral-900 underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-900 transition-colors duration-200 cursor-pointer ${className}`}
            {...props}
        >
            {children}
        </a>
    );
};