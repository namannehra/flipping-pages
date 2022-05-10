import { useCallback, useEffect, useRef } from 'react';

import { useForceUpdate } from '~/hooks/force-update';

export type UseRafCallback = (timeElapsed: number) => boolean;

export interface UseRafResult {
    start: () => void;
    stop: () => void;
}

export const useRaf = (callback: UseRafCallback): UseRafResult => {
    const forceUpdate = useForceUpdate();

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
            forceUpdate();
            if (!end) {
                rafIdRef.current = requestAnimationFrame(update);
            }
        },
        [callback, forceUpdate],
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
