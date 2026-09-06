import { useEffect, useRef, useState } from 'react';

const MM_TO_PX = 96 / 25.4;
const A4_HEIGHT_MM = 297;

export const A4_HEIGHT_PX = Math.round(A4_HEIGHT_MM * MM_TO_PX);

export interface A4OverflowResult {
    ref: React.RefObject<HTMLElement | null>;
    overflowsA4: boolean;
}

export function useA4Overflow(): A4OverflowResult {
    const ref = useRef<HTMLElement | null>(null);
    const [overflowsA4, setOverflowsA4] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node || typeof ResizeObserver === 'undefined') {
            return;
        }

        const update = () => {
            setOverflowsA4(node.offsetHeight > A4_HEIGHT_PX);
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(node);

        return () => observer.disconnect();
    }, []);

    return { ref, overflowsA4 };
}