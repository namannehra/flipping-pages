# flipping-pages
React component for flipping book pages animation

## Demos

[Demo 1](https://namannehra.github.io/flipping-pages/demo1.html)

[Demo 2](https://namannehra.github.io/flipping-pages/demo2.html)

## Props

| Name                | Type     | Default           | Required |
|---------------------|----------|-------------------|----------|
| `animationDuration` | `number` | `400`             | -        |
| `disabled`          | `bool`   | `false`           | -        |
| `noAnimation`       | `bool`   | `false`           | -        |
| `onChange`          | `func`   | `null`            | -        |
| `onOverScroll`      | `func`   | `e => e / 4`      | -        |
| `selected`          | `number` | `-`               | YES      |
| `shadowBackground`  | `string` | `rgba(0,0,0,0.1)` | -        |
| `swipeLength`       | `number` | `400`             | -        |
| `thresholdSpeed`    | `number` | `0.1`             | -        |

### `animationDuration`
Time in milliseconds for one complete turn.

### `disabled`
Disables swiping.

### `noAnimation`
Disables animation.

### `onChange`
Called when user swipes to turn page. First Argumnt in direction (`1` or `-1`).

### `onOverScroll`
Called when user swipes back on first page or forword on last page. First
argument is overscroll ammount between `0` (not included) and `1` (included).
Return a number between `0` and `1` (preferably less than overscroll ammount).

### `selected`
The index of the child currently displayed.

### `shadowBackground`
Each page are covered by a element called shadow. Shadow has `0` opacity when
page is resting and opacity increases to `1` when page is half folded. This prop
is the CSS shadowBackground for shadow.

### `swipeLength`
The distance user must swipe to completely turn a page.

### `thresholdSpeed`
Minimum speed in pixels per milliseconds as which use must swipe to turn page.

## Notes

* You need to set CSS `touch-action` property so it works on touchscreens.
  `pinch-zoom` value is recomended.
  [Read more](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action)

* You should set CSS `user-select` property to `none` so text and images don't
  get selected when user drags with mouse.
  [Read more](https://developer.mozilla.org/en-US/docs/Web/CSS/user-select)

* You should set CSS `perspective` property for 3D effect when pages turn. Value
  double of element's height is recomended.
  [Read more](https://developer.mozilla.org/en-US/docs/Web/CSS/perspective)

* Setting `animationDuration`, `swipeLength` or `thresholdSpeed` to a negative
  value or setting `selected` to an index that doesn't exist or returning a
  value not between `0` and `1` will result in undefined behavior.

## Limitations

### No states or uncontrolled components
Web platform doesn't provide a way to bend an element in half (at least I don't
know any). To achive this effect, this component renders each of its children
twice wrapped in different elements (called child-wrapper). The first
child-wrapper hides the bottom part of child and on second one hides the top
part. This is done using `overflow: hidden`. For turning the page these two
child-wrapper are rotated independently. So if a child has state and that state
is changed in one child-wrapper then there is no way to sync the changes to the
other rendered child in other child-wrapper. The same is true for uncontrolled
components. To work around this, use only props in children of flipping-pages
and wrap flipping-pages inside a component that manages state for all children.

#### Examples

Wrong
```
class App extends Component {
  render() {
    return (
      <FlippingPages selected={0}>
        <div>
          <input/>
        </div>
      </FlippingPages>
    )
  }
}
```

Correct
```
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: ''
    }
  }
  render() {
    return (
      <FlippingPages selected={0}>
        <div>
          <input
            value={this.state.value}
            onChange={eve => this.setState({value: eve.target.value})}
          />
        </div>
      </FlippingPages>
    )
  }
}
```