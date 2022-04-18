import { FlippingPagesDirection } from '~/types';

export const getTransform = (direction: FlippingPagesDirection, turn: number) => {
    switch (direction) {
        case 'bottom-to-top':
            return `rotateX(${turn * 180}deg)`;
        case 'top-to-bottom':
            return `rotateX(${turn * -180}deg)`;
        case 'left-to-right':
            return `rotateY(${turn * 180}deg)`;
        case 'right-to-left':
            return `rotateY(${turn * -180}deg)`;
    }
};
