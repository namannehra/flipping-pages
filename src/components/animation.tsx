import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
    FlippingPagesWithPerspective,
    FlippingPagesWithPerspectiveProps,
} from '~/components/perspective';
import { useRaf, UseRafCallback } from '~/hooks/raf';

export interface FlippingPagesWithAnimationProps
    extends Omit<FlippingPagesWithPerspectiveProps, 'willChange'> {
    animationDuration?: number | undefined;
    onAnimationEnd?: (() => void) | undefined;
    onAnimationStart?: (() => void) | undefined;
    onAnimationTurn?: ((selected: number) => void) | undefined;
    willChange?: boolean | 'auto' | undefined;
}

export const defaultAnimationDuration = 400;

const _FlippingPagesWithAnimation = (props: FlippingPagesWithAnimationProps) => {
    const {
        animationDuration = defaultAnimationDuration,
        onAnimationEnd,
        onAnimationStart,
        onAnimationTurn,
    } = props;

    const [animationRunning, setAnimationRunning] = useState(false);

    const willChange = useMemo(() => {
        if (typeof props.willChange === 'boolean') {
            return props.willChange;
        }
        return animationRunning ? true : undefined;
    }, [props.willChange, animationRunning]);

    const animationRunningChangedRef = useRef(false);
    useEffect(() => {
        if (!animationRunningChangedRef.current) {
            animationRunningChangedRef.current = true;
            return;
        }
        if (animationRunning) {
            onAnimationStart?.();
        } else {
            onAnimationEnd?.();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [animationRunning]);

    const startSelectedRef = useRef(0);
    const [selected, setSelected] = useState(props.selected);

    const updateAnimation: UseRafCallback = useCallback(
        (timeElapsed: number) => {
            const maxSelectedChange = props.selected - startSelectedRef.current;
            const selectedChange = (Math.sign(maxSelectedChange) * timeElapsed) / animationDuration;
            if (Math.abs(selectedChange) >= Math.abs(maxSelectedChange)) {
                setSelected(props.selected);
                setAnimationRunning(false);
                return true;
            }
            const newSelected = startSelectedRef.current + selectedChange;
            setSelected(newSelected);
            onAnimationTurn?.(newSelected);
            return false;
        },
        [animationDuration, onAnimationTurn, props.selected, setAnimationRunning],
    );

    const { start, stop } = useRaf(updateAnimation);

    useEffect(() => {
        if (selected === props.selected) {
            stop();
            setAnimationRunning(false);
            return;
        }
        if (!animationDuration) {
            stop();
            setAnimationRunning(false);
            setSelected(props.selected);
            return;
        }
        startSelectedRef.current = selected;
        start();
        setAnimationRunning(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [animationDuration, props.selected, setAnimationRunning]);

    return (
        <FlippingPagesWithPerspective
            {...props}
            selected={selected}
            willChange={willChange}
        ></FlippingPagesWithPerspective>
    );
};

export const FlippingPagesWithAnimation = memo(_FlippingPagesWithAnimation);
