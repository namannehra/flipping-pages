import { memo, Ref, useMemo } from 'react';
import mergeRefs from 'react-merge-refs';
import useResizeObserver from 'use-resize-observer';

import { FlippingPagesCore, FlippingPagesCoreProps } from '~/components/core';

export interface FlippingPagesWithPerspectiveProps extends FlippingPagesCoreProps {
    perspectiveMultiplier?: number;
}

export const defaultPerspectiveMultiplier = 2;

const _FlippingPagesWithPerspective = (props: FlippingPagesWithPerspectiveProps) => {
    const { containerRef, direction, perspectiveMultiplier = defaultPerspectiveMultiplier } = props;

    const { ref, height, width } = useResizeObserver();

    const mergedRefs = useMemo(() => {
        const refs: Ref<HTMLDivElement>[] = [ref];
        if (containerRef) {
            refs.push(containerRef);
        }
        return mergeRefs(refs);
    }, [ref, containerRef]);

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
            containerRef={mergedRefs}
        ></FlippingPagesCore>
    );
};

export const FlippingPagesWithPerspective = memo(_FlippingPagesWithPerspective);
