import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
    FlippingPagesWithPerspective,
    FlippingPagesWithPerspectiveProps,
} from '~/components/perspective';
import { useForceUpdate } from '~/hooks/force-update';
import { useRaf, UseRafCallback } from '~/hooks/raf';
import { removeUndefinedValues } from '~/utils/remove-undefined-values';

export interface FlippingPagesWithAnimationProps
    extends Omit<FlippingPagesWithPerspectiveProps, 'willChange'> {
    animationDuration?: number;
    onAnimationEnd?: () => void;
    onAnimationStart?: () => void;
    onAnimationTurn?: (selected: number) => void;
    willChange?: boolean | 'auto';
}

export const defaultAnimationDuration = 400;

const _FlippingPagesWithAnimation = (props: FlippingPagesWithAnimationProps) => {
    const {
        animationDuration = defaultAnimationDuration,
        onAnimationTurn,
        onAnimationStart: _onAnimationStart,
        onAnimationEnd: _onAnimationEnd,
    } = props;

    const [autoWillChange, setAutoWillChange] = useState(false);
    const willChange = useMemo(() => {
        if (typeof props.willChange === 'boolean') {
            return props.willChange;
        }
        return autoWillChange ? true : undefined;
    }, [props.willChange, autoWillChange]);

    const onAnimationStart = useCallback(() => {
        setAutoWillChange(true);
        _onAnimationStart?.();
    }, [_onAnimationStart, setAutoWillChange]);

    const onAnimationEnd = useCallback(() => {
        setAutoWillChange(false);
        _onAnimationEnd?.();
    }, [_onAnimationEnd, setAutoWillChange]);

    const forceUpdate = useForceUpdate();
    const animationRunningRef = useRef(false);
    const startSelectedRef = useRef(props.selected);
    const selectedRef = useRef(props.selected);

    const updateAnimation: UseRafCallback = useCallback(
        (timeElapsed: number) => {
            const maxSelectedChange = props.selected - startSelectedRef.current;
            const selectedChange = (Math.sign(maxSelectedChange) * timeElapsed) / animationDuration;
            if (Math.abs(selectedChange) >= Math.abs(maxSelectedChange)) {
                selectedRef.current = props.selected;
                animationRunningRef.current = false;
                onAnimationEnd();
                return true;
            }
            const newSelected = startSelectedRef.current + selectedChange;
            onAnimationTurn?.(newSelected);
            selectedRef.current = newSelected;
            return false;
        },
        [animationDuration, onAnimationEnd, onAnimationTurn, props.selected],
    );

    const { start, stop } = useRaf(updateAnimation);

    useEffect(() => {
        if (selectedRef.current === props.selected) {
            if (animationRunningRef.current) {
                animationRunningRef.current = false;
                stop();
                onAnimationEnd();
            }
            return;
        }
        if (!animationDuration) {
            if (animationRunningRef.current) {
                animationRunningRef.current = false;
                stop();
                onAnimationEnd();
            }
            selectedRef.current = props.selected;
            forceUpdate();
            return;
        }
        if (!animationRunningRef.current) {
            animationRunningRef.current = true;
            onAnimationStart();
        }
        startSelectedRef.current = selectedRef.current;
        start();
    }, [
        animationDuration,
        forceUpdate,
        onAnimationEnd,
        onAnimationStart,
        props.selected,
        start,
        stop,
        updateAnimation,
    ]);

    return (
        <FlippingPagesWithPerspective
            {...removeUndefinedValues({ ...props, selected: selectedRef.current, willChange })}
        ></FlippingPagesWithPerspective>
    );
};

export const FlippingPagesWithAnimation = memo(_FlippingPagesWithAnimation);
