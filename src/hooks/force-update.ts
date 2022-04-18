import { useReducer } from 'react';

export const useForceUpdate = () => {
    const [, forceUpdate] = useReducer(
        () => Symbol(),
        undefined,
        () => Symbol(),
    );
    return forceUpdate;
};
