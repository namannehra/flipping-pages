import { ChangeEventHandler, memo, useCallback, useState } from 'react';

import { FlippingPages, FlippingPagesDirection } from '~/.';
import { defaultAnimationDuration } from '~/components/animation';
import { defaultShadowBackground } from '~/components/shadow';
import { defaultPerspectiveMultiplier } from '~/components/perspective';

import classes from './app.module.css';

const _App = () => {
    const [animationDuration, setAnimationDuration] = useState(defaultAnimationDuration);
    const [animationRunning, setAnimationRunning] = useState(false);
    const [animationTurn, setAnimationTurn] = useState<number>();
    const [direction, setDirection] = useState<FlippingPagesDirection>('bottom-to-top');
    const [perspectiveMultiplier, setPerspectiveMultiplier] = useState(
        defaultPerspectiveMultiplier,
    );
    const [selected, setSelected] = useState(0);
    const [shadowBackground, setShadowBackground] = useState(defaultShadowBackground);

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
        setAnimationTurn(undefined);
    }, [setAnimationRunning, setAnimationTurn]);

    const prev = useCallback(() => {
        setSelected(selected => (selected > 0 ? selected - 1 : selected));
    }, [setSelected]);

    const next = useCallback(() => {
        setSelected(selected => (selected < 3 ? selected + 1 : selected));
    }, [setSelected]);

    const handleAnimationDurationChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        event => {
            setAnimationDuration(Number(event.target.value));
        },
        [setAnimationDuration],
    );

    const handleDirectionChange: ChangeEventHandler<HTMLSelectElement> = useCallback(
        event => {
            setDirection(event.target.value as FlippingPagesDirection);
        },
        [setDirection],
    );

    const handlePerspectiveMultiplierChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        event => {
            setPerspectiveMultiplier(Number(event.target.value));
        },
        [setPerspectiveMultiplier],
    );

    const handleSelectedChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        event => {
            setSelected(Number(event.target.value));
        },
        [setSelected],
    );

    const handleShadowBackgroundChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        event => {
            setShadowBackground(event.target.value);
        },
        [setShadowBackground],
    );

    return (
        <div className={classes.container}>
            <div className={classes.demo}>
                <div className={classes.flippingPages}>
                    <FlippingPages
                        animationDuration={animationDuration}
                        direction={direction}
                        onAnimationEnd={handleAnimationEnd}
                        onAnimationStart={handleAnimationStart}
                        onAnimationTurn={handleAnimationTurn}
                        perspectiveMultiplier={perspectiveMultiplier}
                        selected={selected}
                        shadowBackground={shadowBackground}
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
                <label>
                    {'Animation duration '}
                    <input
                        value={animationDuration}
                        onChange={handleAnimationDurationChange}
                    ></input>
                </label>
                <label>
                    {'Animation running '}
                    <input type="checkbox" checked={animationRunning} readOnly></input>
                </label>
                <label>
                    {'Animation turn '}
                    <input value={animationTurn ?? ''} readOnly></input>
                </label>
                <label>
                    {'Direction '}
                    <select value={direction} onChange={handleDirectionChange}>
                        <option value="bottom-to-top">bottom-to-top</option>
                        <option value="top-to-bottom">top-to-bottom</option>
                        <option value="left-to-right">left-to-right</option>
                        <option value="right-to-left">right-to-left</option>
                    </select>
                </label>
                <label>
                    {'Perspective multiplier '}
                    <input
                        value={perspectiveMultiplier}
                        onChange={handlePerspectiveMultiplierChange}
                    ></input>
                </label>
                <label>
                    {'Selected '}
                    <input type="number" value={selected} onChange={handleSelectedChange}></input>
                </label>
                <label>
                    {'Shadow background '}
                    <input value={shadowBackground} onChange={handleShadowBackgroundChange}></input>
                </label>
            </div>
        </div>
    );
};

export const App = memo(_App);
