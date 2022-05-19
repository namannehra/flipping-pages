import { memo, PointerEvent } from 'react';

import {
    FlippingPagesWithAnimation,
    FlippingPagesWithAnimationProps,
} from '~/components/animation';

export interface FlippingPagesWithPointerControlsProps extends FlippingPagesWithAnimationProps {
    disableSwipe?: boolean | undefined;
    minSwipeLength?: number | undefined;
    onOverSwipe?: ((overSwpie: number) => number) | undefined;
    onSwipeEnd?: ((selected: number) => void) | undefined;
    onSwipeStart?: ((event: PointerEvent<HTMLDivElement>) => boolean) | undefined;
    onSwipeTurn?: ((selected: number) => void) | undefined;
    swipeLength?: number | undefined;
    swipeSpeed?: number | undefined;
}

const _FlippingPagesWithPointerControls = (props: FlippingPagesWithPointerControlsProps) => {
    return <FlippingPagesWithAnimation {...props}></FlippingPagesWithAnimation>;
};

export const FlippingPagesWithPointerControls = memo(_FlippingPagesWithPointerControls);
