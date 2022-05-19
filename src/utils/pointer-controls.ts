import { FlippingPagesDirection } from '~/types';

export interface GetCurrSelectedOptions {
    childrenLength: number;
    diffX: number;
    diffY: number;
    direction: FlippingPagesDirection;
    onOverSwipe: (overSwipe: number) => number;
    startSelected: number;
    swipeLength: number;
}

export const getCurrSelected = (options: GetCurrSelectedOptions) => {
    const { childrenLength, diffX, diffY, direction, onOverSwipe, startSelected, swipeLength } =
        options;

    let diff;
    switch (direction) {
        case 'bottom-to-top':
            diff = -diffY;
            break;
        case 'top-to-bottom':
            diff = diffY;
            break;
        case 'left-to-right':
            diff = diffX;
            break;
        case 'right-to-left':
            diff = -diffX;
            break;
    }

    let selected = startSelected + diff / swipeLength;
    selected = Math.max(selected, Math.ceil(startSelected) - 1);
    selected = Math.min(selected, Math.floor(startSelected) + 1);

    if (selected < 0) {
        const overSwipe = Math.min(-selected, 1);
        selected = -onOverSwipe(overSwipe);
    } else if (selected > childrenLength - 1) {
        const overSwipe = Math.min(selected - childrenLength + 1, 1);
        selected = childrenLength - 1 + onOverSwipe(overSwipe);
    }
    return selected;
};

export interface GetNextSelectedOptions extends GetCurrSelectedOptions {
    speedX: number;
    speedY: number;
    swipeSpeed: number;
}

export const getNextSelected = (options: GetNextSelectedOptions) => {
    const { childrenLength, direction, speedX, speedY, startSelected, swipeSpeed } = options;

    const selected = getCurrSelected(options);

    let speed;
    switch (direction) {
        case 'bottom-to-top':
            speed = -speedY;
            break;
        case 'top-to-bottom':
            speed = speedY;
            break;
        case 'left-to-right':
            speed = speedX;
            break;
        case 'right-to-left':
            speed = -speedX;
            break;
    }

    let newSelected;
    if (Math.abs(speed) < swipeSpeed) {
        newSelected = Math.round(selected);
    } else if (speed > swipeSpeed) {
        newSelected = Math.floor(selected) + 1;
    } else {
        newSelected = Math.ceil(selected) - 1;
    }

    newSelected = Math.max(newSelected, Math.ceil(startSelected) - 1, 0);
    newSelected = Math.min(newSelected, Math.floor(startSelected) + 1, childrenLength - 1);
    return newSelected;
};
