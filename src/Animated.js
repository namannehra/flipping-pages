import PropTypes from 'prop-types'
import {cloneElement, PureComponent} from 'react'

class Animated extends PureComponent {

    state = {
        selected: this.props.selected
    }

    turn(selected) {
        this.setState({selected}, () => {
            const {onTurn} = this.props
            if (onTurn instanceof Function) {
                onTurn(selected)
            }
        })
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.animationDuration !== prevProps.animationDuration ||
            this.props.selected !== prevProps.selected
        ) {
            cancelAnimationFrame(this.id)
            this.startSelected = this.state.selected
            this.startTime = 0
            this.direction = Math.sign(this.props.selected - this.state.selected)
            if (!this.direction) {
                return
            }
            if (!this.props.animationDuration) {
                this.turn(this.props.selected)
                return
            }
            this.id = requestAnimationFrame(this.rafCallback)
        }
    }

    rafCallback = currTime => {
        if (!this.startTime) {
            this.startTime = currTime
            this.id = requestAnimationFrame(this.rafCallback)
            return
        }
        const time = currTime - this.startTime
        const selected = this.startSelected + this.direction * time / this.props.animationDuration
        if (this.direction === 1 ? selected < this.props.selected : selected > this.props.selected) {
            this.turn(selected)
            this.id = requestAnimationFrame(this.rafCallback)
        } else {
            this.turn(this.props.selected)
        }
    }

    render() {
        const {animationDuration, flippingPages, onTurn, selected, willChange, ...otherProps} = this.props
        return cloneElement(flippingPages, {
            selected: this.state.selected,
            willChange: this.state.selected === selected ? willChange : true,
            ...otherProps
        })
    }

    static propTypes = {
        animationDuration: PropTypes.number,
        flippingPages: PropTypes.element.isRequired,
        onTurn: PropTypes.func,
        selected: PropTypes.number.isRequired,
        willChange: PropTypes.bool,
    }

    static defaultProps = {
        animationDuration: 500,
        willChange: false,
    }

}

export default Animated