import { useCallback, useEffect, useRef } from 'react';

export interface UseAnimationOptions {
    callback: (timeElapsed: number) => boolean;
    onEnd: () => void;
    onStart: () => void;
}

export interface UseAnimationResult {
    start: () => void;
    stop: () => void;
}

export const useAnimation = (options: UseAnimationOptions): UseAnimationResult => {
    const { callback, onEnd, onStart } = options;

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
            if (end) {
                rafIdRef.current = undefined;
                onEnd();
            } else {
                rafIdRef.current = requestAnimationFrame(update);
            }
        },
        [callback, onEnd],
    );

    const start = useCallback(() => {
        if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
        } else {
            onStart();
        }
        startTimeRef.current = undefined;
        rafIdRef.current = requestAnimationFrame(update);
    }, [onStart, update]);

    const stop = useCallback(() => {
        if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = undefined;
            onEnd();
        }
    }, [onEnd]);

    useEffect(() => {
        return () => {
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, []);

    return { start, stop };
};
