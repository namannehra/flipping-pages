import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
    FlippingPagesWithPerspective,
    FlippingPagesWithPerspectiveProps,
} from '~/components/perspective';
import { useAnimation } from '~/hooks/animation';

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

    const startSelectedRef = useRef(0);
    const [selected, setSelected] = useState(props.selected);

    const onStart = useCallback(() => {
        setAnimationRunning(true);
        onAnimationStart?.();
    }, [onAnimationStart]);

    const onEnd = useCallback(() => {
        setAnimationRunning(false);
        onAnimationEnd?.();
    }, [onAnimationEnd]);

    const updateAnimation = useCallback(
        (timeElapsed: number) => {
            const maxSelectedChange = props.selected - startSelectedRef.current;
            const selectedChange = (Math.sign(maxSelectedChange) * timeElapsed) / animationDuration;
            if (Math.abs(selectedChange) >= Math.abs(maxSelectedChange)) {
                setSelected(props.selected);
                return true;
            }
            const newSelected = startSelectedRef.current + selectedChange;
            setSelected(newSelected);
            onAnimationTurn?.(newSelected);
            return false;
        },
        [animationDuration, onAnimationTurn, props.selected],
    );

    const { start, stop } = useAnimation({ callback: updateAnimation, onEnd, onStart });

    useEffect(
        () => {
            if (selected === props.selected) {
                stop();
                return;
            }
            if (!animationDuration) {
                stop();
                setSelected(props.selected);
                return;
            }
            startSelectedRef.current = selected;
            start();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [animationDuration, props.selected],
    );

    return (
        <FlippingPagesWithPerspective
            {...props}
            selected={selected}
            willChange={willChange}
        ></FlippingPagesWithPerspective>
    );
};

export const FlippingPagesWithAnimation = memo(_FlippingPagesWithAnimation);
