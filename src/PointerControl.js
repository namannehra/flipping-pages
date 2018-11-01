import classNames from 'classnames'
import PropTypes from 'prop-types'
import {Children, cloneElement, PureComponent} from 'react'

import style from './PointerControl.sass'

class PointerControl extends PureComponent {

    state = {
        down: false,
        selected: this.props.selected
    }

    getTurn() {
        let swipe = this.props.direction === 'horizontal' ? this.startX - this.x : this.startY - this.y
        if (this.props.reverse) {
            swipe *= -1
        }
        const turn = swipe / this.props.swipeLength
        return turn
    }

    updateSelectedWhenDown() {
        const turn = this.getTurn()
        let selected = this.props.selected + turn
        selected = Math.max(selected, this.props.selected - 1)
        selected = Math.min(selected, this.props.selected + 1)
        const childrenCount = Children.count(this.props.children)
        if (selected < 0) {
            selected = -this.props.onOverSwipe(-selected)
        } else if (selected + 1 > childrenCount) {
            selected = this.props.onOverSwipe(selected + 1 - childrenCount) + childrenCount - 1
        }
        this.setState({selected})
    }

    updateSelectedWhenUp() {
        this.setState({selected: this.props.selected})
        const turn = this.getTurn()
        let speed = (
            (this.props.direction === 'horizontal' ? this.lastX - this.x : this.lastY - this.y) /
            (this.time - this.lastTime)
        )
        if (this.props.reverse) {
            speed *= -1
        }
        let selected = this.props.selected
        if (!turn) {
            if (Math.abs(speed) >= this.props.thresholdSpeed) {
                selected += Math.sign(speed)
            }
        } else if (Math.abs(turn) < 0.5) {
            if (Math.abs(speed) >= this.props.thresholdSpeed && Math.sign(speed) === Math.sign(turn)) {
                selected += Math.sign(speed)
            }
        } else {
            if (Math.abs(speed) < this.props.thresholdSpeed || Math.sign(speed) !== Math.sign(turn)) {
                selected += Math.sign(turn)
            }
        }
        selected = Math.max(selected, 0)
        selected = Math.min(selected, Children.count(this.props.children) - 1)
        const {onSelectedChange} = this.props
        if (onSelectedChange) {
            onSelectedChange(selected)
        }
    }

    handlePointerDown = event => {
        const {onPointerDown, onSwipeStart} = this.props
        if (!this.down && this.state.selected === this.props.selected && onSwipeStart(event)) {
            this.setState({down: true})
            this.startSelected = this.state.selected
            this.id = event.pointerId
            this.x = event.clientX
            this.startX = this.x
            this.lastX = this.x
            this.y = event.clientY
            this.startY = this.y
            this.lastY = this.y
            this.time = event.timeStamp
            this.lastTime = this.time
        }
        if (onPointerDown) {
            onPointerDown(event)
        }
    }

    handlePointerMove = event => {
        if (!this.state.down || event.pointerId !== this.id) {
            return
        }
        this.lastX = this.x
        this.lastY = this.y
        this.x = event.clientX
        this.y = event.clientY
        this.lastTime = this.time
        this.time = event.timeStamp
        this.updateSelectedWhenDown()
    }

    handlePointerUp = event => {
        if (!this.state.down || event.pointerId !== this.id) {
            return
        }
        this.setState({down: false})
        this.updateSelectedWhenUp()
    }

    componentDidUpdate(prevProps) {
        if (this.props.selected !== prevProps.selected) {
            if (this.state.down) {
                this.setState({down: false})
                this.updateSelectedWhenUp()
            } else {
                this.setState({selected: this.props.selected})
            }
        }
    }

    componentDidMount() {
        addEventListener('pointermove', this.handlePointerMove)
        addEventListener('pointerup', this.handlePointerUp)
        addEventListener('pointercancel', this.handlePointerUp)
    }

    componentWillUnmount() {
        removeEventListener('pointermove', this.handlePointerMove)
        removeEventListener('pointerup', this.handlePointerUp)
        removeEventListener('pointercancel', this.handlePointerUp)
    }

    render() {
        const {
            animationDuration,
            className,
            flippingPages,
            onOverSwipe,
            onPointerDown,
            onSelectedChange,
            onSwipeStart,
            selected,
            swipeLength,
            thresholdSpeed,
            ...otherProps
        } = this.props
        return cloneElement(flippingPages, {
            animationDuration: this.state.down ? 0 : this.props.animationDuration,
            className: classNames(style.flippingPages, className),
            onPointerDown: this.handlePointerDown,
            selected: this.state.selected,
            willChange: this.state.down,
            ...otherProps
        })
    }

    static propTypes = {
        animationDuration: PropTypes.number,
        direction: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
        flippingPages: PropTypes.element.isRequired,
        onOverSwipe: PropTypes.func,
        onSelectedChange: PropTypes.func,
        onSwipeStart: PropTypes.func,
        reverse: PropTypes.bool,
        selected: PropTypes.number.isRequired,
        swipeLength: PropTypes.number,
        thresholdSpeed: PropTypes.number,
    }

    static defaultProps = {
        animationDuration: 500,
        onOverSwipe: swipe => swipe / 4,
        onSwipeStart: event => event.isPrimary,
        reverse: false,
        swipeLength: 500,
        thresholdSpeed: 0.1,
    }

}

export default PointerControl