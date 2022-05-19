import { useCallback, useEffect, useRef } from 'react';

export type UseRafCallback = (timeElapsed: number) => boolean;

export interface UseRafResult {
    start: () => void;
    stop: () => void;
}

export const useRaf = (callback: UseRafCallback): UseRafResult => {
    const rafIdRef = useRef<number>();
    const startTimeRef = useRef<number>();

    const update = useCallback(
        (timestamp: number) => {
            if (!startTimeRef.current) {
                startTimeRef.current = timestamp;
                rafIdRef.current = requestAnimationFrame(update);
                return;
            }
            const timeElapsed = timestamp - startTimeRef.current;
            const end = callback(timeElapsed);
            if (!end) {
                rafIdRef.current = requestAnimationFrame(update);
            }
        },
        [callback],
    );

    const start = useCallback(() => {
        startTimeRef.current = undefined;
        rafIdRef.current = requestAnimationFrame(update);
    }, [update]);

    const stop = useCallback(() => {
        if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
        }
    }, []);

    useEffect(() => {
        return () => {
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, []);

    return { start, stop };
};
