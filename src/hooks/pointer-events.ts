import { EventHandler, PointerEvent as _PointerEvent, useCallback, useRef, useState } from 'react';

type PointerEvent = _PointerEvent<HTMLDivElement>;

export interface UsePointerEventsOnMoveOptions {
    diffX: number;
    diffY: number;
}

export interface UsePointerEventsOnUpOptions extends UsePointerEventsOnMoveOptions {
    speedX: number;
    speedY: number;
}

export interface UsePointerEventsOptions {
    onDown: (event: PointerEvent) => boolean;
    onMove: (options: UsePointerEventsOnMoveOptions) => void;
    onUp: (options: UsePointerEventsOnUpOptions) => void;
}

export interface UsePointerEventsResult {
    cancelPointer: () => void;
    onPointerCancel: EventHandler<PointerEvent>;
    onPointerDown: EventHandler<PointerEvent>;
    onPointerMove: EventHandler<PointerEvent>;
    onPointerUp: EventHandler<PointerEvent>;
    pointerDown: boolean;
}

export const usePointerEvents = (options: UsePointerEventsOptions): UsePointerEventsResult => {
    const { onDown, onMove, onUp } = options;

    const [pointerId, setPointerId] = useState<number>();
    const pointerDown = pointerId !== undefined;

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
            setPointerId(event.pointerId);
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
            if (event.pointerId !== pointerId) {
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
        [onMove, pointerId],
    );

    const onPointerUp = useCallback(
        (event: PointerEvent) => {
            if (event.pointerId !== pointerId) {
                return;
            }
            setPointerId(undefined);
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
        [onUp, pointerId],
    );

    const onPointerCancel = useCallback(
        (event: PointerEvent) => {
            if (event.pointerId !== pointerId) {
                return;
            }
            setPointerId(undefined);
            const diffX = event.clientX - startXRef.current;
            const diffY = event.clientY - startYRef.current;
            onUp({ diffX, diffY, speedX: 0, speedY: 0 });
        },
        [onUp, pointerId],
    );

    const cancelPointer = useCallback(() => {
        setPointerId(undefined);
    }, []);

    return {
        cancelPointer,
        onPointerCancel,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        pointerDown,
    };
};
