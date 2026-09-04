import React from 'react';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    as?: HeadingLevel;
    children: React.ReactNode;
    className?: string;
}

export const Heading: React.FC<HeadingProps> = ({
    as: Component = 'h1',
    children,
    className = '',
    ...props
}) => {
    const styles: Record<HeadingLevel, string> = {
        h1: 'text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900',
        h2: 'text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900',
        h3: 'text-xl sm:text-2xl font-medium tracking-tight text-neutral-800',
        h4: 'text-lg sm:text-xl font-medium text-neutral-800',
        h5: 'text-base sm:text-lg font-medium text-neutral-700',
    };

    return (
        <Component className={`${styles[Component]} ${className}`} {...props}>
            {children}
        </Component>
    );
};