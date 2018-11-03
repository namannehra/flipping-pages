import React, {memo} from 'react'

import Animated from './Animated'
import Core from './Core'
import PointerControl from './PointerControl'
import Reverse from './Reverse'

const FlippingPages = memo(props => {
    const {children, ...otherProps} = props
    return (
        <PointerControl flippingPages={
            <Animated selected={0} flippingPages={
                <Reverse selected={0} flippingPages={
                    <Core direction="horizontal" selected={0}/>
                }/>
            }/>
        } {...otherProps}>
            {children}
        </PointerControl>
    )
})

FlippingPages.propTypes = Object.assign(
    {}, Core.propTypes, Reverse.propTypes, Animated.propTypes, PointerControl.propTypes
)
delete FlippingPages.propTypes.flippingPages
delete FlippingPages.propTypes.willChange

FlippingPages.defaultProps = Object.assign(
    {}, Core.defaultProps, Reverse.defaultProps, Animated.defaultProps, PointerControl.defaultProps,
)
delete FlippingPages.defaultProps.willChange

export default FlippingPages