import classNames from 'classnames';
import { Children, ComponentType, HTMLAttributes, memo, ReactNode, Ref, useMemo } from 'react';

import { getDefaultFlippingPagesShadow } from '~/components/default-shadow';
import { FlippingPagesDirection, FlippingPagesShadowProps } from '~/types';
import { getTurn } from '~/utils/turn';
import { getTransform } from '~/utils/transform';

import classes from './core.module.css';

export interface FlippingPagesCoreProps {
    children?: ReactNode;
    containerProps?: HTMLAttributes<HTMLDivElement>;
    containerRef?: Ref<HTMLDivElement>;
    direction: FlippingPagesDirection;
    selected: number;
    shadowBackground?: string;
    shadowComponent?: ComponentType<FlippingPagesShadowProps>;
    willChange?: boolean;
}

export const defaultShadowBackground = 'rgb(0, 0, 0, 0.25)';

const _FlippingPagesCore = (props: FlippingPagesCoreProps) => {
    const {
        containerProps,
        containerRef,
        direction,
        selected,
        shadowBackground = defaultShadowBackground,
    } = props;
    const children = Children.toArray(props.children);
    const ShadowComponent = useMemo(
        () =>
            props.shadowComponent
                ? props.shadowComponent
                : getDefaultFlippingPagesShadow(shadowBackground),
        [shadowBackground, props.shadowComponent],
    );
    const turn = getTurn(selected);
    const willChange = !!props.willChange;

    let pages: ReactNode;
    if (turn === 0) {
        pages = children[selected];
    } else {
        pages = (
            <>
                <div className={classNames(classes.prevPage, classes[direction])}>
                    <div>{children[Math.floor(selected)]}</div>
                </div>
                <div className={classNames(classes.nextPage, classes[direction])}>
                    <div>{children[Math.ceil(selected)]}</div>
                </div>
                <div
                    className={classNames(
                        turn < 0 ? classes.prevPage : classes.nextPage,
                        classes[direction],
                    )}
                    style={{
                        transform: getTransform(direction, turn),
                        willChange: willChange ? 'transform' : undefined,
                    }}
                >
                    <div>{children[Math.round(selected)]}</div>
                    <div>
                        <ShadowComponent
                            selected={selected}
                            willChange={willChange}
                        ></ShadowComponent>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div
            {...containerProps}
            ref={containerRef}
            className={classNames(classes.container, containerProps?.className)}
        >
            {pages}
        </div>
    );
};

export const FlippingPagesCore = memo(_FlippingPagesCore);
