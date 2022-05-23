import {
    Children,
    HTMLAttributes,
    memo,
    PointerEvent as _PointerEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import {
    FlippingPagesWithAnimation,
    FlippingPagesWithAnimationProps,
} from '~/components/animation';
import {
    OnCancelOptions,
    OnMoveOptions,
    OnUpOptions,
    usePointerMovement,
} from '~/hooks/pointer-movement';
import { getCurrSelected, getNextSelected } from '~/utils/pointer-controls';

type PointerEvent = _PointerEvent<HTMLDivElement>;

export interface FlippingPagesWithPointerControlsProps extends FlippingPagesWithAnimationProps {
    disableSwipe?: boolean | undefined;
    onOverSwipe?: ((overSwipe: number) => number) | undefined;
    onSwipeEnd?: ((selected: number) => void) | undefined;
    onSwipeStart?: ((event: PointerEvent) => boolean) | undefined;
    onSwipeTurn?: ((selected: number) => void) | undefined;
    swipeLength?: number | undefined;
    swipeSpeed?: number | undefined;
}

export const defaultSwipeLength = 400;
const defaultOnOverSwipe = (overSwipe: number) => overSwipe / 4;
export const defaultOnSwipeStart = (event: PointerEvent) => event.isPrimary;
export const defaultSwipeSpeed = 0.1;

const _FlippingPagesWithPointerControls = (props: FlippingPagesWithPointerControlsProps) => {
    const {
        children,
        direction,
        disableSwipe,
        onAnimationEnd: _onAnimationEnd,
        onAnimationStart: _onAnimationStart,
        onAnimationTurn: _onAnimationTurn,
        onOverSwipe = defaultOnOverSwipe,
        onSwipeEnd,
        onSwipeStart = defaultOnSwipeStart,
        onSwipeTurn,
        swipeLength = defaultSwipeLength,
        swipeSpeed = defaultSwipeSpeed,
    } = props;

    const childrenLength = Children.count(children);

    const animationRunningRef = useRef(false);
    const [pointerDown, setPointerDown] = useState(false);
    const startSelectedRef = useRef(props.selected);
    const [pointerSelected, setPointerSelected] = useState(props.selected);

    const animationDuration = pointerDown ? 0 : props.animationDuration;

    const selected = pointerDown ? pointerSelected : props.selected;

    const willChange = useMemo(() => {
        if (typeof props.willChange === 'boolean') {
            return props.willChange;
        }
        return pointerDown ? true : undefined;
    }, [pointerDown, props.willChange]);

    const onAnimationStart = useCallback(() => {
        animationRunningRef.current = true;
        _onAnimationStart?.();
    }, [_onAnimationStart]);

    const onAnimationTurn = useCallback(
        (selected: number) => {
            startSelectedRef.current = selected;
            _onAnimationTurn?.(selected);
        },
        [_onAnimationTurn],
    );

    const onAnimationEnd = useCallback(() => {
        animationRunningRef.current = false;
        _onAnimationEnd?.();
    }, [_onAnimationEnd]);

    const onDown = useCallback(
        (event: PointerEvent) => {
            if (disableSwipe || !onSwipeStart(event)) {
                return false;
            }
            setPointerDown(true);
            if (!animationRunningRef.current) {
                startSelectedRef.current = props.selected;
            }
            setPointerSelected(startSelectedRef.current);
            return true;
        },
        [disableSwipe, onSwipeStart, props.selected, setPointerDown],
    );

    const onMove = useCallback(
        (options: OnMoveOptions) => {
            const { diffX, diffY } = options;
            const selected = getCurrSelected({
                childrenLength,
                diffX,
                diffY,
                direction,
                onOverSwipe,
                startSelected: startSelectedRef.current,
                swipeLength,
            });
            setPointerSelected(selected);
            onSwipeTurn?.(selected);
        },
        [childrenLength, direction, onOverSwipe, onSwipeTurn, swipeLength],
    );

    const onUp = useCallback(
        (options: OnUpOptions) => {
            const { diffX, diffY, speedX, speedY } = options;
            setPointerDown(false);
            const nextSelected = getNextSelected({
                childrenLength,
                diffX,
                diffY,
                direction,
                onOverSwipe,
                speedX,
                speedY,
                startSelected: startSelectedRef.current,
                swipeLength,
                swipeSpeed,
            });
            onSwipeEnd?.(nextSelected);
        },
        [
            childrenLength,
            direction,
            onOverSwipe,
            onSwipeEnd,
            setPointerDown,
            swipeLength,
            swipeSpeed,
        ],
    );

    const onCancel = useCallback(
        (options: OnCancelOptions) => {
            const { diffX, diffY } = options;
            setPointerDown(false);
            const nextSelected = getNextSelected({
                childrenLength,
                diffX,
                diffY,
                direction,
                onOverSwipe,
                speedX: 0,
                speedY: 0,
                startSelected: startSelectedRef.current,
                swipeLength,
                swipeSpeed,
            });
            onSwipeEnd?.(nextSelected);
        },
        [
            childrenLength,
            direction,
            onOverSwipe,
            onSwipeEnd,
            setPointerDown,
            swipeLength,
            swipeSpeed,
        ],
    );

    const { cancelPointer, onPointerCancel, onPointerDown, onPointerMove, onPointerUp } =
        usePointerMovement({ onDown, onMove, onUp, onCancel });

    useEffect(() => {
        if (disableSwipe) {
            cancelPointer();
            setPointerDown(false);
        }
    }, [cancelPointer, disableSwipe, setPointerDown]);

    const containerProps = useMemo((): HTMLAttributes<HTMLDivElement> => {
        const _containerProps = props.containerProps ?? {};
        return {
            ..._containerProps,
            onPointerCancel: event => {
                onPointerCancel(event);
                _containerProps.onPointerCancel?.(event);
            },
            onPointerDown: event => {
                onPointerDown(event);
                _containerProps.onPointerDown?.(event);
            },
            onPointerMove: event => {
                onPointerMove(event);
                _containerProps.onPointerMove?.(event);
            },
            onPointerUp: event => {
                onPointerUp(event);
                _containerProps.onPointerUp?.(event);
            },
        };
    }, [onPointerCancel, onPointerDown, onPointerMove, onPointerUp, props.containerProps]);

    return (
        <FlippingPagesWithAnimation
            {...props}
            animationDuration={animationDuration}
            containerProps={containerProps}
            onAnimationEnd={onAnimationEnd}
            onAnimationStart={onAnimationStart}
            onAnimationTurn={onAnimationTurn}
            selected={selected}
            willChange={willChange}
        ></FlippingPagesWithAnimation>
    );
};

export const FlippingPagesWithPointerControls = memo(_FlippingPagesWithPointerControls);
