import {
    HTMLAttributes,
    memo,
    PointerEvent,
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

export interface FlippingPagesWithPointerControlsProps extends FlippingPagesWithAnimationProps {
    disableSwipe?: boolean | undefined;
    onOverSwipe?: ((overSwpie: number) => number) | undefined;
    onSwipeEnd?: ((selected: number) => void) | undefined;
    onSwipeStart?: ((event: PointerEvent<HTMLDivElement>) => boolean) | undefined;
    onSwipeTurn?: ((selected: number) => void) | undefined;
    swipeLength?: number | undefined;
    swipeSpeed?: number | undefined;
}

export const defaultSwipeLength = 400;
const defaultOnOverSwipe = (overSwpie: number) => overSwpie / 4;
const defaultOnSwipeStart = (event: PointerEvent<HTMLDivElement>) => event.isPrimary;
export const defaultSwipeSpeed = 0.1;

const _FlippingPagesWithPointerControls = (props: FlippingPagesWithPointerControlsProps) => {
    const {
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
        (event: PointerEvent<HTMLDivElement>) => {
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

    const onMove = useCallback((options: OnMoveOptions) => {
        const { diffX, diffY } = options;
    }, []);

    const onUp = useCallback(
        (options: OnUpOptions) => {
            const { diffX, diffY, speedX, speedY } = options;
            setPointerDown(false);
            onSwipeEnd?.(0);
        },
        [onSwipeEnd, setPointerDown],
    );

    const onCancel = useCallback(
        (options: OnCancelOptions) => {
            const { diffX, diffY } = options;
            setPointerDown(false);
            onSwipeEnd?.(0);
        },
        [onSwipeEnd, setPointerDown],
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
