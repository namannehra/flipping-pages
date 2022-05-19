React component for flipping book pages animation

# Demo

https://namannehra.github.io/flipping-pages/

# Installation

Supported React versions: `^16.14.0 || ^17.0.0 || ^18.0.0`

## NPM

```
npm install flipping-pages
```

## Yarn

```
yarn add flipping-pages
```

# Example

## `App.js`

```javascript
import { FlippingPages } from 'flipping-pages';
import 'flipping-pages/dist/style.css';
import { useState } from 'react';

import './App.css';

const App = () => {
    const [selected, setSelected] = useState(0);

    const back = () => {
        setSelected(selected => Math.max(selected - 1, 0));
    };

    const next = () => {
        setSelected(selected => Math.min(selected + 1, 2));
    };

    return (
        <div>
            <div className="pages">
                <FlippingPages
                    direction="bottom-to-top"
                    onSwipeEnd={setSelected}
                    selected={selected}
                >
                    <div className="page page1">Page 1</div>
                    <div className="page page2">Page 2</div>
                    <div className="page page3">Page 3</div>
                </FlippingPages>
            </div>
            <button onClick={back}>Back</button>
            <button onClick={next}>Next</button>
        </div>
    );
};

export default App;
```

## `App.css`

```css
.pages {
    height: 256px;
    width: 256px;
}

.page {
    height: 100%;
    width: 100%;
}

.page1 {
    background-color: pink;
}

.page2 {
    background-color: yellow;
}

.page3 {
    background-color: aqua;
}
```

# Props

| Name (\* = Required)    | Type                                                                       | Default                      |
| ----------------------- | -------------------------------------------------------------------------- | ---------------------------- |
| `animationDuration`     | `number`                                                                   | `400`                        |
| `children`              | `ReactNode`                                                                |                              |
| `containerProps`        | `HTMLAttributes<HTMLDivElement>`                                           |                              |
| `containerRef`          | `Ref<HTMLDivElement>`                                                      |                              |
| `direction`\*           | `'bottom-to-top' \| 'top-to-bottom' \| 'left-to-right' \| 'right-to-left'` |                              |
| `disableSwipe`          | `boolean`                                                                  | `false`                      |
| `onAnimationEnd`        | `() => void`                                                               |                              |
| `onAnimationStart`      | `() => void`                                                               |                              |
| `onAnimationTurn`       | `(selected: number) => void`                                               |                              |
| `onOverSwipe`           | `(overSwipe: number) => number`                                            | `overSwipe => overSwipe / 4` |
| `onSwipeEnd`            | `(selected: number) => void`                                               |                              |
| `onSwipeStart`          | `(event: PointerEvent<HTMLDivElement>) => boolean`                         | `event => event.isPrimary`   |
| `onSwipeTurn`           | `(selected: number) => void`                                               |                              |
| `perspectiveMultiplier` | `number`                                                                   | `2`                          |
| `selected`\*            | `number`                                                                   |                              |
| `shadowBackground`      | `string`                                                                   | `rgb(0, 0, 0, 0.25)`         |
| `shadowComponent`       | `Component<ShadowProps>`                                                   |                              |
| `swipeLength`           | `number`                                                                   | `400`                        |
| `swipeSpeed`            | `number`                                                                   | `0.1`                        |
| `willChange`            | `boolean \| 'auto'`                                                        | `'auto'`                     |

## `animationDuration`

`number`

Time in milliseconds for one page turn. Set to `0` to disable animation.

## `children`

`ReactNode`

Each child is rendered on a separate page.

## `containerProps`

`HTMLAttributes<HTMLDivElement>`

Props passed to the root element.

## `containerRef`

Ref for the root element.

## `direction`\*

`'bottom-to-top' | 'top-to-bottom' | 'left-to-right' | 'right-to-left'`

Direction of page turn.

## `disableSwipe`

`boolean`

Disables page turning by swiping.

## `onAnimationEnd`

`() => void`

Called after page turning animation ends.

## `onAnimationStart`

`() => void`

Called after page turning animation starts.

## `onAnimationTurn`

`(selected: number) => void`

Called on each tick of page turning animation. `selected` is the page index in decimal. Uses
[`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).

## `onOverSwipe`

`(overSwipe: number) => number`

Called when swiping back on the first page or next on the last page. `overSwipe` is between `0` and
`1`. Return value determines how page turning is throttled.

## `onSwipeEnd`

`(selected: number) => void`

Called after swiping ends. `selected` is the page index to which user swiped.

## `onSwipeStart`

`(event: PointerEvent<HTMLDivElement>) => boolean`

Called before swipe starts. `event` is a
[`pointerdown`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/pointerdown_event)
event. Swipe starts only if `true` is returned. This can be used to disable swiping for certain
pointer types like mouse.

## `onSwipeTurn`

`(selected: number) => void`

Called on each tick of swipe turn. `selected` is the page index in decimal.

## `perspectiveMultiplier`

`number`

Value of CSS [`perspective`](https://developer.mozilla.org/en-US/docs/Web/CSS/perspective) is
calculated by multiplying `perspectiveMultiplier` with the size of the root element. Size is height
or width depending on `direction`. `perspective` can be set manually using
`containerProps.style.perspective`.

## `selected`\*

`number`

Index of the current page. Decimal values are supported.

## `shadowBackground`

`string`

Pages have a shadow when they are turning. Shadow has `0` opacity when page is resting and `1`
opacity when page is half turned. `shadowBackground` is used for CSS `background` of the shadow
element.

## `shadowComponent`

`Component<ShadowProps>`

### `ShadowProps`

| Name (\* = Required) | Type      |
| -------------------- | --------- |
| `selected`\*         | `number`  |
| `willChange`\*       | `boolean` |

Component to use as page shadow.

## `swipeLength`

`number`

The distance in pixels user must swipe to completely one page turn.

## `swipeSpeed`

`number`

Minimum speed in pixels per milliseconds to turn the page after a swipe.

## `willChange`

`boolean | 'auto'`

Sets CSS [`will-change`](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change) on turning
page and shadow. If `'auto'` then `will-change` is applied during turning animation and swiping.

# Notes

## `user-select`

You can set CSS [`user-select`](https://developer.mozilla.org/en-US/docs/Web/CSS/user-select) to
prevent text selection when swiping using a mouse.

## `touch-action`

You can set CSS [`touch-action`](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action) to
prevent page scrolling when swiping using a touch screen.

## State is not synced

The web platform doesn't have a way to bend an element in half. To achieve this effect, this
component renders the each page twice. For the first render, only the first half of the page is
visible. For the second render, only the last half of the page is visible. Then these halves are
rotated independently to achieve the page turning effect.

If a child component has internal state then that **state will not be synced** between both the page
renders. The same also applies to uncontrolled components.
