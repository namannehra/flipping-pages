import { EventHandler, PointerEvent as _PointerEvent } from 'react';

import { useMergeEvents } from '~/hooks/merge-events';

type PointerEvent = _PointerEvent<HTMLDivElement>;

export const pointerEventProps = [
    'onPointerCancel',
    'onPointerDown',
    'onPointerMove',
    'onPointerUp',
] as const;

export type PointerEventsEmitter = {
    [K in (typeof pointerEventProps)[number]]?: EventHandler<PointerEvent> | undefined;
};

export const useMergePointerEvents = (
    ...eventsEmitters: readonly (PointerEventsEmitter | undefined)[]
): PointerEventsEmitter => {
    const onPointerCancel = useMergeEvents(
        ...eventsEmitters.map(eventsEmitter => eventsEmitter?.onPointerCancel),
    );
    const onPointerDown = useMergeEvents(
        ...eventsEmitters.map(eventsEmitter => eventsEmitter?.onPointerDown),
    );
    const onPointerMove = useMergeEvents(
        ...eventsEmitters.map(eventsEmitter => eventsEmitter?.onPointerMove),
    );
    const onPointerUp = useMergeEvents(
        ...eventsEmitters.map(eventsEmitter => eventsEmitter?.onPointerUp),
    );
    return { onPointerCancel, onPointerDown, onPointerMove, onPointerUp };
};
