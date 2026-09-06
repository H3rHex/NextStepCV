import React, { useEffect, useState } from 'react';
import { InlineInput } from './InlineInput';

interface InlineInputCommitProps {
    value: string;
    onCommit: (value: string) => void;
    className?: string;
    placeholder?: string;
}

export const InlineInputCommit: React.FC<InlineInputCommitProps> = ({
    value,
    onCommit,
    className,
    placeholder,
}) => {
    const [draft, setDraft] = useState(value);

    useEffect(() => {
        setDraft(value);
    }, [value]);

    const commit = () => {
        if (draft !== value) {
            onCommit(draft);
        }
    };

    return (
        <InlineInput
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.currentTarget.blur();
                }
            }}
            className={className}
            placeholder={placeholder}
        />
    );
};