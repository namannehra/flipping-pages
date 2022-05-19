import { memo, Ref, useMemo } from 'react';
import mergeRefs from 'react-merge-refs';
import useResizeObserver from 'use-resize-observer';

import { FlippingPagesCore, FlippingPagesCoreProps } from '~/components/core';

export interface FlippingPagesWithPerspectiveProps extends FlippingPagesCoreProps {
    perspectiveMultiplier?: number | undefined;
}

export const defaultPerspectiveMultiplier = 2;

const _FlippingPagesWithPerspective = (props: FlippingPagesWithPerspectiveProps) => {
    const { direction, perspectiveMultiplier = defaultPerspectiveMultiplier } = props;

    const { ref, height, width } = useResizeObserver();

    const containerRef = useMemo(() => {
        const refs: Ref<HTMLDivElement>[] = [ref];
        if (props.containerRef) {
            refs.push(props.containerRef);
        }
        return mergeRefs(refs);
    }, [ref, props.containerRef]);

    const perspective = useMemo(() => {
        switch (direction) {
            case 'bottom-to-top':
            case 'top-to-bottom':
                if (!height) {
                    return;
                }
                return height * perspectiveMultiplier;
            case 'left-to-right':
            case 'right-to-left':
                if (!width) {
                    return;
                }
                return width * perspectiveMultiplier;
        }
    }, [direction, perspectiveMultiplier, height, width]);

    const containerProps = useMemo(
        () => ({
            ...props.containerProps,
            style: {
                perspective,
                ...props.containerProps?.style,
            },
        }),
        [props.containerProps, perspective],
    );

    return (
        <FlippingPagesCore
            {...props}
            containerProps={containerProps}
            containerRef={containerRef}
        ></FlippingPagesCore>
    );
};

export const FlippingPagesWithPerspective = memo(_FlippingPagesWithPerspective);
