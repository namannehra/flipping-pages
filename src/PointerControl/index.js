import classNames from 'classnames'
import PropTypes from 'prop-types'
import {cloneElement, Component} from 'react'

import style from './style.css'

class PointerControl extends Component {

    state = {
        down: false,
        selected: this.props.selected
    }

    getTurn() {
        let swipe = this.props.horizontal ? this.startX - this.x : this.startY - this.y
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
        const childrenLen = this.props.children.length
        if (selected < 0) {
            selected = -this.props.onOverSwipe(-selected)
        } else if (selected + 1 > childrenLen) {
            selected = this.props.onOverSwipe(selected + 1 - childrenLen) + childrenLen - 1
        }
        this.setState({selected})
    }

    updateSelectedWhenUp() {
        this.setState({selected: this.props.selected})
        const turn = this.getTurn()
        let speed = (this.props.horizontal ? this.lastX - this.x : this.lastY - this.y) / (this.time - this.lastTime)
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
        selected = Math.min(selected, this.props.children.length - 1)
        const {onSelectedChange} = this.props
        if (onSelectedChange instanceof Function) {
            onSelectedChange(selected)
        }
    }

    handlePointerDown = event => {
        const {onPointerDown, onSwipeStart} = this.props
        if (onPointerDown instanceof Function) {
            onPointerDown(event)
        }
        if (this.down || this.state.selected !== this.props.selected || !onSwipeStart(event)) {
            return
        }
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
            ...otherProps} = this.props
        const FlippingPages = cloneElement(flippingPages, {
            animationDuration: this.state.down ? 0 : this.props.animationDuration,
            className: classNames(style.flippingPages, className),
            onPointerDown: this.handlePointerDown,
            selected: this.state.selected,
            ...otherProps
        })
        return FlippingPages
    }

}

PointerControl.propTypes = {
    animationDuration: PropTypes.number,
    flippingPages: PropTypes.element.isRequired,
    horizontal: PropTypes.bool,
    onOverSwipe: PropTypes.func,
    onSelectedChange: PropTypes.func,
    onSwipeStart: PropTypes.func,
    reverse: PropTypes.bool,
    selected: PropTypes.number,
    swipeLength: PropTypes.number,
    thresholdSpeed: PropTypes.number,
}

PointerControl.defaultProps = {
    animationDuration: 400,
    horizontal: false,
    onOverSwipe: swipe => swipe / 4,
    onSwipeStart: event => event.isPrimary,
    reverse: false,
    swipeLength: 400,
    thresholdSpeed: 0.1,
}

export default PointerControl