import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
    FlippingPagesWithPerspective,
    FlippingPagesWithPerspectiveProps,
} from '~/components/perspective';
import { useForceUpdate } from '~/hooks/force-update';
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
    const rafIdRef = useRef<number>();
    const startTimeRef = useRef<number>();
    const startSelectedRef = useRef(props.selected);
    const selectedRef = useRef(props.selected);

    const setSelected = useCallback(
        (selected: number) => {
            selectedRef.current = selected;
            forceUpdate();
        },
        [forceUpdate],
    );

    const updateAnimation = useCallback(
        (timestamp: number) => {
            if (!startTimeRef.current) {
                startTimeRef.current = timestamp;
                rafIdRef.current = requestAnimationFrame(updateAnimation);
                return;
            }
            const maxSelectedChange = props.selected - startSelectedRef.current;
            const selectedChange =
                (Math.sign(maxSelectedChange) * (timestamp - startTimeRef.current)) /
                animationDuration;
            if (Math.abs(selectedChange) >= Math.abs(maxSelectedChange)) {
                rafIdRef.current = undefined;
                setSelected(props.selected);
                onAnimationEnd();
                return;
            }
            const newSelected = startSelectedRef.current + selectedChange;
            onAnimationTurn?.(newSelected);
            setSelected(newSelected);
            rafIdRef.current = requestAnimationFrame(updateAnimation);
        },
        [animationDuration, props.selected, setSelected, onAnimationEnd, onAnimationTurn],
    );

    useEffect(() => {
        if (selectedRef.current === props.selected) {
            if (rafIdRef.current) {
                rafIdRef.current = undefined;
                onAnimationEnd();
            }
            return;
        }
        if (!animationDuration) {
            if (rafIdRef.current) {
                rafIdRef.current = undefined;
                onAnimationEnd();
            }
            setSelected(props.selected);
            return;
        }
        if (!rafIdRef.current) {
            onAnimationStart();
        }
        startTimeRef.current = undefined;
        startSelectedRef.current = selectedRef.current;
        rafIdRef.current = requestAnimationFrame(updateAnimation);
        return () => {
            // Call cancelAnimationFrame in clean-up to stop animation after unmount
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, [
        animationDuration,
        onAnimationEnd,
        onAnimationStart,
        props.selected,
        setSelected,
        updateAnimation,
    ]);

    return (
        <FlippingPagesWithPerspective
            {...removeUndefinedValues({ ...props, selected: selectedRef.current, willChange })}
        ></FlippingPagesWithPerspective>
    );
};

export const FlippingPagesWithAnimation = memo(_FlippingPagesWithAnimation);
