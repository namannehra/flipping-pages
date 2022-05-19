import { ChangeEventHandler, memo, useCallback } from 'react';

import { FlippingPagesDirection } from '~/.';

import classes from './controls.module.css';

export interface ControlsProps {
    animationDuration: number;
    animationRunning: boolean;
    animationTurn: number | undefined;
    direction: FlippingPagesDirection;
    disableSwipe: boolean;
    onAnimationDurationChange: (animationDuration: number) => void;
    onDirectionChange: (direction: FlippingPagesDirection) => void;
    onDisableSwipeChange: (disableSwipe: boolean) => void;
    onPerspectiveMultiplierChange: (perspectiveMultiplier: number) => void;
    onSelectedChange: (selected: number) => void;
    onShadowBackgroundChange: (shadowBackground: string) => void;
    onSwipeLengthChange: (swipeLength: number) => void;
    onSwipeSpeedChange: (swipeSpeed: number) => void;
    perspectiveMultiplier: number;
    selected: number;
    shadowBackground: string;
    swipeLength: number;
    swipeSpeed: number;
    swipeTurn: number | undefined;
    swiping: boolean;
}

const _Controls = (props: ControlsProps) => {
    const {
        animationDuration,
        animationRunning,
        animationTurn,
        direction,
        disableSwipe,
        onAnimationDurationChange,
        onDirectionChange,
        onDisableSwipeChange,
        onPerspectiveMultiplierChange,
        onSelectedChange,
        onShadowBackgroundChange,
        onSwipeLengthChange,
        onSwipeSpeedChange,
        perspectiveMultiplier,
        selected,
        shadowBackground,
        swipeLength,
        swipeSpeed,
        swipeTurn,
        swiping,
    } = props;

    const handleAnimationDurationChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        event => {
            onAnimationDurationChange(Number(event.target.value));
        },
        [onAnimationDurationChange],
    );

    const handleDirectionChange: ChangeEventHandler<HTMLSelectElement> = useCallback(
        event => {
            onDirectionChange(event.target.value as FlippingPagesDirection);
        },
        [onDirectionChange],
    );

    const handleDisableSwipeChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        event => {
            onDisableSwipeChange(event.target.checked);
        },
        [onDisableSwipeChange],
    );

    const handlePerspectiveMultiplierChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        event => {
            onPerspectiveMultiplierChange(Number(event.target.value));
        },
        [onPerspectiveMultiplierChange],
    );

    const handleSelectedChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        event => {
            onSelectedChange(Number(event.target.value));
        },
        [onSelectedChange],
    );

    const handleShadowBackgroundChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        event => {
            onShadowBackgroundChange(event.target.value);
        },
        [onShadowBackgroundChange],
    );

    const handleSwipeLengthChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        event => {
            onSwipeLengthChange(Number(event.target.value));
        },
        [onSwipeLengthChange],
    );

    const handleSwipeSpeedChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        event => {
            onSwipeSpeedChange(Number(event.target.value));
        },
        [onSwipeSpeedChange],
    );

    return (
        <div className={classes.container}>
            <label>
                {'Animation duration '}
                <input value={animationDuration} onChange={handleAnimationDurationChange}></input>
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
                {'Disable swipe '}
                <input
                    type="checkbox"
                    checked={disableSwipe}
                    onChange={handleDisableSwipeChange}
                ></input>
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
            <label>
                {'Swipe length '}
                <input type="number" value={swipeLength} onChange={handleSwipeLengthChange}></input>
            </label>
            <label>
                {'Swipe speed '}
                <input type="number" value={swipeSpeed} onChange={handleSwipeSpeedChange}></input>
            </label>
            <label>
                {'Swipe turn '}
                <input value={swipeTurn ?? ''} readOnly></input>
            </label>
            <label>
                {'Swiping '}
                <input type="checkbox" checked={swiping} readOnly></input>
            </label>
        </div>
    );
};

export const Controls = memo(_Controls);
