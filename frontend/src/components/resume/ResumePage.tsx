import React from 'react';

interface ResumePageProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    className?: string;
}

export const ResumePage: React.FC<ResumePageProps> = ({
    children,
    className = '',
    ...props
}) => {
    return (
        <div className="w-full flex justify-center px-2 sm:px-4">
            {/* Contenedor principal: Mobile-first flexible, simulación A4 en desktop */}
            <div
                className={`
                w-full 
                max-w-[210mm] 
                min-h-auto md:min-h-[297mm] 
                bg-white 
                shadow-sm md:shadow-md 
                border border-neutral-200/80 
                p-6 sm:p-10 md:p-14 
                rounded-sm 
                flex flex-col 
                transition-all duration-200
                    ${className}
                `}
                
                {...exampleProps(props)}
            >
                {children}
            </div>
        </div>
    );
};

function exampleProps(props: any) {
    return props;
}