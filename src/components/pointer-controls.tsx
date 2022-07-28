import {
    Children,
    memo,
    PointerEvent as _PointerEvent,
    Ref,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import mergeRefs from 'react-merge-refs';

import {
    FlippingPagesWithAnimation,
    FlippingPagesWithAnimationProps,
} from '~/components/animation';
import { useMergePointerEvents } from '~/hooks/merge-pointer-events';
import {
    usePointerEvents,
    UsePointerEventsOnMoveOptions,
    UsePointerEventsOnUpOptions,
} from '~/hooks/pointer-events';
import { getCurrSelected, getNextSelected } from '~/utils/pointer-controls';

type PointerEvent = _PointerEvent<HTMLDivElement>;

export interface FlippingPagesWithPointerControlsProps extends FlippingPagesWithAnimationProps {
    disableSwipe?: boolean | undefined;
    noSwipeClass?: string | undefined;
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
        noSwipeClass,
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

    const ref = useRef<HTMLDivElement>(null);

    const childrenLength = Children.count(children);

    const animationRunningRef = useRef(false);
    const startSelectedRef = useRef(props.selected);
    const [pointerSelected, setPointerSelected] = useState(props.selected);

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
            if (disableSwipe) {
                return false;
            }
            if (noSwipeClass) {
                if (event.target instanceof Element) {
                    let target: Element | null = event.target;
                    while (target && target !== ref.current) {
                        if (target.classList.contains(noSwipeClass)) {
                            return false;
                        }
                        target = target.parentElement;
                    }
                }
            }
            if (!onSwipeStart(event)) {
                return false;
            }
            if (!animationRunningRef.current) {
                startSelectedRef.current = props.selected;
            }
            setPointerSelected(startSelectedRef.current);
            return true;
        },
        [disableSwipe, noSwipeClass, onSwipeStart, props.selected],
    );

    const onMove = useCallback(
        (options: UsePointerEventsOnMoveOptions) => {
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
        (options: UsePointerEventsOnUpOptions) => {
            const { diffX, diffY, speedX, speedY } = options;
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
        [childrenLength, direction, onOverSwipe, onSwipeEnd, swipeLength, swipeSpeed],
    );

    const { cancelPointer, pointerDown, ..._pointerEventListeners } = usePointerEvents({
        onDown,
        onMove,
        onUp,
    });

    useEffect(() => {
        if (disableSwipe) {
            cancelPointer();
        }
    }, [cancelPointer, disableSwipe]);

    const animationDuration = pointerDown ? 0 : props.animationDuration;

    const selected = pointerDown ? pointerSelected : props.selected;

    const willChange = useMemo(() => {
        if (typeof props.willChange === 'boolean') {
            return props.willChange;
        }
        return pointerDown ? true : undefined;
    }, [pointerDown, props.willChange]);

    const pointerEventListeners = useMergePointerEvents(
        _pointerEventListeners,
        props.containerProps,
    );

    const containerProps = useMemo(
        () => ({ ...props.containerProps, ...pointerEventListeners }),
        [pointerEventListeners, props.containerProps],
    );

    const containerRef = useMemo(() => {
        const refs: Ref<HTMLDivElement>[] = [ref];
        if (props.containerRef) {
            refs.push(props.containerRef);
        }
        return mergeRefs(refs);
    }, [props.containerRef]);

    return (
        <FlippingPagesWithAnimation
            {...props}
            animationDuration={animationDuration}
            containerProps={containerProps}
            containerRef={containerRef}
            onAnimationEnd={onAnimationEnd}
            onAnimationStart={onAnimationStart}
            onAnimationTurn={onAnimationTurn}
            selected={selected}
            willChange={willChange}
        ></FlippingPagesWithAnimation>
    );
};

export const FlippingPagesWithPointerControls = memo(_FlippingPagesWithPointerControls);
