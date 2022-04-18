import { memo } from 'react';

import { FlippingPagesShadowProps } from '~/types';
import { getTurn } from '~/utils/turn';

import classes from './default-shadow.module.css';

export const getDefaultFlippingPagesShadow = (background: string) => {
    const _DefaultFlippingPagesShadow = (props: FlippingPagesShadowProps) => {
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

    return memo(_DefaultFlippingPagesShadow);
};
