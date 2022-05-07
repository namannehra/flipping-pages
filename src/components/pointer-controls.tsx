import { memo, PointerEvent } from 'react';

import {
    FlippingPagesWithAnimation,
    FlippingPagesWithAnimationProps,
} from '~/components/animation';

export interface FlippingPagesWithPointerControlsProps extends FlippingPagesWithAnimationProps {
    disableSwipe?: boolean;
    minSwipeLength?: number;
    onOverSwipe?: (overSwpie: number) => number;
    onSwipeEnd?: (selected: number) => void;
    onSwipeStart?: (event: PointerEvent<HTMLDivElement>) => boolean;
    onSwipeTurn?: (selected: number) => void;
    swipeLength?: number;
    swipeSpeed?: number;
}

const _FlippingPagesWithPointerControls = (props: FlippingPagesWithPointerControlsProps) => {
    return <FlippingPagesWithAnimation {...props}></FlippingPagesWithAnimation>;
};

export const FlippingPagesWithPointerControls = memo(_FlippingPagesWithPointerControls);
