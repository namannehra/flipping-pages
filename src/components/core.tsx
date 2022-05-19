import classNames from 'classnames';
import { Children, ComponentType, HTMLAttributes, memo, ReactNode, Ref, useMemo } from 'react';

import { getFlippingPagesShadow } from '~/components/shadow';
import { FlippingPagesDirection, FlippingPagesShadowProps } from '~/types';
import { getTurn } from '~/utils/turn';
import { getTransform } from '~/utils/transform';

import classes from './core.module.css';

export interface FlippingPagesCoreProps {
    children?: ReactNode | undefined;
    containerProps?: HTMLAttributes<HTMLDivElement> | undefined;
    containerRef?: Ref<HTMLDivElement> | undefined;
    direction: FlippingPagesDirection;
    selected: number;
    shadowBackground?: string | undefined;
    shadowComponent?: ComponentType<FlippingPagesShadowProps> | undefined;
    willChange?: boolean | undefined;
}

const _FlippingPagesCore = (props: FlippingPagesCoreProps) => {
    const { containerProps, containerRef, direction, selected, shadowBackground } = props;
    const children = Children.toArray(props.children);
    const ShadowComponent = useMemo(
        () =>
            props.shadowComponent
                ? props.shadowComponent
                : getFlippingPagesShadow(shadowBackground),
        [shadowBackground, props.shadowComponent],
    );
    const turn = getTurn(selected);
    const willChange = !!props.willChange;

    let pages: ReactNode;
    if (turn === 0) {
        // Child is inside same DOM structure regardless `turn` value
        // This prevents resetting child's state due to slight change in `selected`
        pages = (
            <div className={classNames(classes.fullPage, classes[direction])}>
                <div>{children[selected]}</div>
            </div>
        );
    } else {
        pages = (
            <>
                <div
                    className={classNames(
                        turn > 0 ? classes.prevPage : classes.nextPage,
                        classes[direction],
                    )}
                >
                    <div>{children[Math.round(selected)]}</div>
                </div>
                <div
                    className={classNames(
                        turn > 0 ? classes.nextPage : classes.prevPage,
                        classes[direction],
                    )}
                >
                    <div>{children[turn > 0 ? Math.ceil(selected) : Math.floor(selected)]}</div>
                </div>
                <div
                    className={classNames(
                        turn > 0 ? classes.nextPage : classes.prevPage,
                        classes[direction],
                    )}
                    style={{
                        transform: getTransform(direction, turn),
                        willChange: willChange ? 'transform' : undefined,
                    }}
                >
                    <div>{children[Math.round(selected)]}</div>
                    <div className={classes.shadow}>
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
