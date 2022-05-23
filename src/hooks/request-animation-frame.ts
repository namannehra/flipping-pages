import { useCallback, useEffect, useRef } from 'react';

export type UseRequestAnimationFrameCallback = (timeElapsed: number) => boolean;

export interface UseRequestAnimationFrameResult {
    start: () => void;
    stop: () => void;
}

export const useRequestAnimationFrame = (
    callback: UseRequestAnimationFrameCallback,
): UseRequestAnimationFrameResult => {
    const rafIdRef = useRef(0);
    const startTimeRef = useRef(0);

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
        cancelAnimationFrame(rafIdRef.current);
        startTimeRef.current = 0;
        rafIdRef.current = requestAnimationFrame(update);
    }, [update]);

    const stop = useCallback(() => {
        cancelAnimationFrame(rafIdRef.current);
    }, []);

    useEffect(() => {
        return () => {
            cancelAnimationFrame(rafIdRef.current);
        };
    }, []);

    return { start, stop };
};
