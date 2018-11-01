import PropTypes from 'prop-types'
import {Children, cloneElement, memo} from 'react'

const Reverse = memo(props => {
    const {children, flippingPages, reverse, selected, ...otherProps} = props
    const childrenArray = Children.toArray(children)
    return cloneElement(flippingPages, {
        selected: reverse ? childrenArray.length - selected - 1 : selected,
        ...otherProps
    }, reverse ? childrenArray.reverse() : childrenArray)
})

Reverse.propTypes = {
    flippingPages: PropTypes.element.isRequired,
    reverse: PropTypes.bool,
    selected: PropTypes.number.isRequired,
}

Reverse.defaultProps = {
    reverse: false,
}

export default Reverse