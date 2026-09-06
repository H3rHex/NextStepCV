// src/hooks/useCatalog.ts
import { useEffect, useState } from 'react';

export interface CatalogItem {
    id: string;
    name: string;
    icon: string;
    urlTemplate?: string;
}

interface UseCatalogResult {
    items: CatalogItem[];
    loading: boolean;
    error: string | null;
}

export function useCatalog(path: string): UseCatalogResult {
    const [items, setItems] = useState<CatalogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        fetch(`${import.meta.env.BASE_URL}${path}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.json();
            })
            .then((data: CatalogItem[]) => {
                if (!cancelled) {
                    setItems(data);
                }
            })
            .catch((err: unknown) => {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : String(err));
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [path]);

    return { items, loading, error };
}