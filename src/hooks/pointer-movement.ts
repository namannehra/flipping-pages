import { PointerEvent as _PointerEvent, useCallback, useRef } from 'react';

type PointerEvent = _PointerEvent<HTMLDivElement>;

interface BaseOptions {
    diffX: number;
    diffY: number;
}

export type OnMoveOptions = BaseOptions;

export interface OnUpOptions extends BaseOptions {
    speedX: number;
    speedY: number;
}

export type OnCancelOptions = BaseOptions;

export interface UsePointerMovementOptions {
    onCancel: (options: OnCancelOptions) => void;
    onDown: (event: PointerEvent) => boolean;
    onMove: (options: OnMoveOptions) => void;
    onUp: (options: OnUpOptions) => void;
}

export interface UsePointerMovementResult {
    cancelPointer: () => void;
    onPointerCancel: (event: PointerEvent) => void;
    onPointerDown: (event: PointerEvent) => void;
    onPointerMove: (event: PointerEvent) => void;
    onPointerUp: (event: PointerEvent) => void;
}

export const usePointerMovement = (
    options: UsePointerMovementOptions,
): UsePointerMovementResult => {
    const { onCancel, onDown, onMove, onUp } = options;

    const pointerIdRef = useRef<number>();

    const startXRef = useRef(0);
    const startYRef = useRef(0);

    const lastTimeStampRef = useRef(0);
    const lastXRef = useRef(0);
    const lastYRef = useRef(0);

    const currTimeStampRef = useRef(0);
    const currXRef = useRef(0);
    const currYRef = useRef(0);

    const onPointerDown = useCallback(
        (event: PointerEvent) => {
            if (!onDown(event)) {
                return;
            }
            event.currentTarget.setPointerCapture(event.pointerId);
            pointerIdRef.current = event.pointerId;
            startXRef.current = event.clientX;
            startYRef.current = event.clientY;
            lastTimeStampRef.current = 0;
            currTimeStampRef.current = event.timeStamp;
            currXRef.current = event.clientX;
            currYRef.current = event.clientY;
        },
        [onDown],
    );

    const onPointerMove = useCallback(
        (event: PointerEvent) => {
            if (event.pointerId !== pointerIdRef.current) {
                return;
            }
            lastTimeStampRef.current = currTimeStampRef.current;
            lastXRef.current = currXRef.current;
            lastYRef.current = currYRef.current;
            currTimeStampRef.current = event.timeStamp;
            currXRef.current = event.clientX;
            currYRef.current = event.clientY;
            const diffX = event.clientX - startXRef.current;
            const diffY = event.clientY - startYRef.current;
            onMove({ diffX, diffY });
        },
        [onMove],
    );

    const onPointerUp = useCallback(
        (event: PointerEvent) => {
            if (event.pointerId !== pointerIdRef.current) {
                return;
            }
            pointerIdRef.current = undefined;
            const diffX = event.clientX - startXRef.current;
            const diffY = event.clientY - startYRef.current;
            let speedX;
            let speedY;
            if (lastTimeStampRef.current) {
                const timeDiff = event.timeStamp - lastTimeStampRef.current;
                speedX = (event.clientX - lastXRef.current) / timeDiff;
                speedY = (event.clientY - lastYRef.current) / timeDiff;
            } else {
                speedX = 0;
                speedY = 0;
            }
            onUp({ diffX, diffY, speedX, speedY });
        },
        [onUp],
    );

    const onPointerCancel = useCallback(
        (event: PointerEvent) => {
            if (event.pointerId !== pointerIdRef.current) {
                return;
            }
            pointerIdRef.current = undefined;
            const diffX = event.clientX - startXRef.current;
            const diffY = event.clientY - startYRef.current;
            onCancel({ diffX, diffY });
        },
        [onCancel],
    );

    const cancelPointer = useCallback(() => {
        pointerIdRef.current = undefined;
    }, []);

    return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel, cancelPointer };
};
