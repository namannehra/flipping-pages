export type FlippingPagesDirection =
    | 'bottom-to-top'
    | 'top-to-bottom'
    | 'left-to-right'
    | 'right-to-left';

export interface FlippingPagesShadowProps {
    selected: number;
    willChange: boolean;
}
