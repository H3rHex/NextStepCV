import React from 'react';
import { useTranslation } from 'react-i18next';

export const A4OverflowAdvertence: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="fixed bottom-2 left-0 right-0 bg-red-300 text-black px-4 py-2 text-center text-sm z-50 w-3/4 mx-auto rounded-lg shadow-md">
            {`${t('resume.warning.overflow', 'El contenido del currículum excede el tamaño de una hoja A4. Esto puede afectar la impresión o exportación a PDF.')}`}
        </div>
    );
};
