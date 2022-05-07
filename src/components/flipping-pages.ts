import {
    FlippingPagesWithPointerControls,
    FlippingPagesWithPointerControlsProps,
} from '~/components/pointer-controls';

export type FlippingPagesProps = FlippingPagesWithPointerControlsProps;

const FlippingPages = FlippingPagesWithPointerControls;
FlippingPages.displayName = 'FlippingPages';
export { FlippingPages };
