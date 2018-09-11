import PropTypes from 'prop-types'
import {cloneElement, Component} from 'react'

class Reverse extends Component {

    render() {
        const {children, flippingPages, reverse, selected, ...otherProps} = this.props
        const FlippingPages = cloneElement(flippingPages, {
            selected: reverse ? children.length - selected - 1 : selected,
            ...otherProps
        }, reverse ? children.concat().reverse() : children)
        return FlippingPages
    }

}

Reverse.propTypes = {
    flippingPages: PropTypes.element.isRequired,
    horizontal: PropTypes.bool,
    reverse: PropTypes.bool,
    selected: PropTypes.number,
}

Reverse.defaultProps = {
    horizontal: false,
    reverse: false,
}

export default Reverse