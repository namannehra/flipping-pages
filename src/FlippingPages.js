import PropTypes from "prop-types";
import React, {Component} from 'react'

import Animated from './Animated'
import Core from './Core'
import getChildrenArr from './getChildrenArr'
import PointerControl from './PointerControl'
import Reverse from './Reverse'

class FlippingPages extends Component {

    render() {
        const {children, flippingPages, ...otherProps} = this.props
        return (
            <PointerControl flippingPages={
                <Animated flippingPages={
                    <Reverse flippingPages={
                        <Core/>
                    }/>
                }/>
            } {...otherProps}>
                {getChildrenArr(children)}
            </PointerControl>
        )
    }

}

FlippingPages.propTypes = Object.assign({}, Core.propTypes, Reverse.propTypes, Animated.propTypes, PointerControl.propTypes)
FlippingPages.selected = PropTypes.number.isRequired
delete FlippingPages.propTypes.flippingPages

FlippingPages.defaultProps = Object.assign(
    {},
    Core.defaultProps,
    Reverse.defaultProps,
    Animated.defaultProps,
    PointerControl.defaultProps,
)
delete FlippingPages.defaultProps.flippingPages

export default FlippingPages