import { memo } from 'react';

import { FlippingPagesShadowProps } from '~/types';
import { getTurn } from '~/utils/turn';

import classes from './shadow.module.css';

export const defaultShadowBackground = 'rgb(0, 0, 0, 0.25)';

export const getFlippingPagesShadow = (background: string = defaultShadowBackground) => {
    const _FlippingPagesShadow = (props: FlippingPagesShadowProps) => {
        const { selected, willChange } = props;

        const turn = getTurn(selected);

        return (
            <div
                className={classes.container}
                style={{
                    background,
                    opacity: Math.abs(turn) * 2,
                    willChange: willChange ? 'opacity' : undefined,
                }}
            ></div>
        );
    };

    return memo(_FlippingPagesShadow);
};
