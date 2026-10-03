import { useLayoutEffect, useRef, useState } from 'react';

export function useTwoRowGridHeight(items: readonly unknown[]) {
    const gridRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number>();

    useLayoutEffect(() => {
        const grid = gridRef.current;
        if (!grid) {
            setHeight(undefined);
            return;
        }

        const cards = Array.from(grid.children).slice(0, 8) as HTMLElement[];
        const measureRows = () => {
            const gridTop = grid.getBoundingClientRect().top;
            const rows = new Map<number, number>();
            cards.forEach((card) => {
                const bounds = card.getBoundingClientRect();
                const rowTop = Math.round(bounds.top - gridTop);
                rows.set(rowTop, Math.max(rows.get(rowTop) ?? 0, bounds.bottom - gridTop));
            });
            const rowBottoms = [...rows.values()];
            setHeight(rowBottoms.length >= 2 ? Math.ceil(rowBottoms[1]) : undefined);
        };

        measureRows();
        const observer = new ResizeObserver(measureRows);
        observer.observe(grid);
        cards.forEach((card) => observer.observe(card));
        return () => observer.disconnect();
    }, [items]);

    return { gridRef, height };
}
