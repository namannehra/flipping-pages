import { EventHandler, SyntheticEvent, useCallback } from 'react';

export const useMergeEvents = <T extends SyntheticEvent>(
    ...eventHandlers: readonly (EventHandler<T> | undefined)[]
): EventHandler<T> =>
    useCallback(
        (event: T) => {
            for (const eventHandler of eventHandlers) {
                eventHandler?.(event);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        eventHandlers,
    );
