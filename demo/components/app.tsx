import classNames from 'classnames';
import { memo, PointerEvent, useCallback, useEffect, useState } from 'react';

import { FlippingPages, FlippingPagesDirection } from '~/.';
import { defaultAnimationDuration } from '~/components/animation';
import {
    defaultOnSwipeStart,
    defaultSwipeLength,
    defaultSwipeSpeed,
} from '~/components/pointer-controls';
import { defaultShadowBackground } from '~/components/shadow';
import { defaultPerspectiveMultiplier } from '~/components/perspective';

import { Controls } from '~demo/components/controls';

import classes from './app.module.css';

const _App = () => {
    const [animationDuration, setAnimationDuration] = useState(defaultAnimationDuration);
    const [animationRunning, setAnimationRunning] = useState(false);
    const [animationTurn, setAnimationTurn] = useState<number>();
    const [direction, setDirection] = useState<FlippingPagesDirection>('bottom-to-top');
    const [disableSwipe, setDisableSwipe] = useState(false);
    const [perspectiveMultiplier, setPerspectiveMultiplier] = useState(
        defaultPerspectiveMultiplier,
    );
    const [selected, setSelected] = useState(0);
    const [shadowBackground, setShadowBackground] = useState(defaultShadowBackground);
    const [swipeLength, setSwipeLength] = useState(defaultSwipeLength);
    const [swipeSpeed, setSwipeSpeed] = useState(defaultSwipeSpeed);
    const [swipeTurn, setSwipeTurn] = useState<number>();
    const [swiping, setSwiping] = useState(false);

    const handleAnimationStart = useCallback(() => {
        setAnimationRunning(true);
    }, [setAnimationRunning]);

    const handleAnimationTurn = useCallback(
        (selected: number) => {
            setAnimationTurn(selected);
        },
        [setAnimationTurn],
    );

    const handleAnimationEnd = useCallback(() => {
        setAnimationRunning(false);
    }, [setAnimationRunning]);

    useEffect(() => {
        if (!animationRunning) {
            setAnimationTurn(undefined);
        }
    }, [animationRunning, setAnimationTurn]);

    const handleSwipeStart = useCallback(
        (event: PointerEvent<HTMLDivElement>) => {
            if (!defaultOnSwipeStart(event)) {
                return false;
            }
            setSwiping(true);
            return true;
        },
        [setSwiping],
    );

    const handleSwipeTurn = useCallback(
        (selected: number) => {
            setSwipeTurn(selected);
        },
        [setSwipeTurn],
    );

    const handleSwipeEnd = useCallback(
        (selected: number) => {
            setSwiping(false);
            setSelected(selected);
        },
        [setSelected, setSwiping],
    );

    useEffect(() => {
        if (!swiping) {
            setSwipeTurn(undefined);
        }
    }, [swiping, setSwipeTurn]);

    const prev = useCallback(() => {
        setSelected(selected => (selected > 0 ? selected - 1 : selected));
    }, [setSelected]);

    const next = useCallback(() => {
        setSelected(selected => (selected < 3 ? selected + 1 : selected));
    }, [setSelected]);

    return (
        <div className={classes.container}>
            <div className={classes.demo}>
                <div className={classNames(classes.flippingPages, classes[direction])}>
                    <FlippingPages
                        animationDuration={animationDuration}
                        direction={direction}
                        disableSwipe={disableSwipe}
                        onAnimationEnd={handleAnimationEnd}
                        onAnimationStart={handleAnimationStart}
                        onAnimationTurn={handleAnimationTurn}
                        onSwipeEnd={handleSwipeEnd}
                        onSwipeStart={handleSwipeStart}
                        onSwipeTurn={handleSwipeTurn}
                        perspectiveMultiplier={perspectiveMultiplier}
                        selected={selected}
                        shadowBackground={shadowBackground}
                        swipeLength={swipeLength}
                        swipeSpeed={swipeSpeed}
                    >
                        <div className={classes.page1}>First page</div>
                        <div className={classes.page2}>Page 2</div>
                        <div className={classes.page3}>Page 3</div>
                        <div className={classes.page4}>Last page</div>
                    </FlippingPages>
                </div>
                <div className={classes.prevAndNext}>
                    <button onClick={prev} disabled={selected <= 0}>
                        Previous
                    </button>
                    <button onClick={next} disabled={selected >= 3}>
                        Next
                    </button>
                </div>
            </div>
            <div className={classes.controls}>
                <Controls
                    animationDuration={animationDuration}
                    animationRunning={animationRunning}
                    animationTurn={animationTurn}
                    direction={direction}
                    disableSwipe={disableSwipe}
                    onAnimationDurationChange={setAnimationDuration}
                    onDirectionChange={setDirection}
                    onDisableSwipeChange={setDisableSwipe}
                    onPerspectiveMultiplierChange={setPerspectiveMultiplier}
                    onSelectedChange={setSelected}
                    onShadowBackgroundChange={setShadowBackground}
                    onSwipeLengthChange={setSwipeLength}
                    onSwipeSpeedChange={setSwipeSpeed}
                    perspectiveMultiplier={perspectiveMultiplier}
                    selected={selected}
                    shadowBackground={shadowBackground}
                    swipeLength={swipeLength}
                    swipeSpeed={swipeSpeed}
                    swipeTurn={swipeTurn}
                    swiping={swiping}
                ></Controls>
            </div>
        </div>
    );
};

export const App = memo(_App);
