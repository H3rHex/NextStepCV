import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface InlineDatePickerProps {
    startDate: string;
    endDate: string;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
    className?: string;
}

export const InlineDatePicker: React.FC<InlineDatePickerProps> = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    className = '',
}) => {
    const { t } = useTranslation();
    const [isEndFocused, setIsEndFocused] = useState(false);

    const endInputType = isEndFocused || (endDate && endDate !== 'present') ? 'month' : 'text';

    const inputBaseClass = "bg-transparent hover:bg-neutral-50/80 border border-transparent hover:border-neutral-200 focus:border-blue-500 focus:bg-white px-1 py-0 rounded outline-none text-center h-6 transition-all w-[110px] cursor-pointer";

    return (
        <div className={`flex items-center gap-1 text-xs text-neutral-500 shrink-0 ${className}`}>
            <input
                type="month"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className={inputBaseClass}
            />
            <span>–</span>
            <input
                type={endInputType}
                value={endDate === 'present' ? '' : endDate}
                onFocus={() => setIsEndFocused(true)}
                onBlur={() => setIsEndFocused(false)}
                onChange={(e) => onEndDateChange(e.target.value || 'present')}
                placeholder={t('resume.dates.present')}
                className={inputBaseClass}
            />
        </div>
    );
};