import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, {Component} from 'react'

import style from './style.css'

class Core extends Component {

    getDirection() {
        return this.props.horizontal ? 'horizontal' : 'vertical'
    }

    render() {
        const {children, className, horizontal, rootRef, selected, shadowBackground, willChange, ...otherProps} = this.props
        const direction = this.getDirection()
        const prev = children[Math.floor(selected)]
        const next = children[Math.floor(selected + 1)]
        const curr = children[Math.round(selected)]
        let turn = selected % 1
        if (turn < 0) {
            turn -= Math.floor(turn)
        }
        const rotation = (turn < 0.5 ? turn : turn - 1) * (horizontal ? -180 : 180)
        const currClassName = classNames(style.page, style[turn < 0.5 ? 'next' : 'prev'], style[direction])
        const currStyle = {
            transform: `rotate${horizontal ? 'Y' : 'X'}(${rotation}deg)`,
        }
        const shadowStyle = {
            background: shadowBackground,
            opacity: turn < 0.5 ? turn : 1 - turn,
        }
        if (willChange) {
            currStyle.willChange = 'transform'
            shadowStyle.willChange = 'opacity'
        }
        return (
            <div ref={rootRef} className={classNames(style.Core, className)} {...otherProps}>
                <div className={classNames(style.page, style.prev, style[direction])}>
                    <div>
                        {prev}
                    </div>
                </div>
                <div className={classNames(style.page, style.next, style[direction])}>
                    <div>
                        {next}
                    </div>
                </div>
                <div className={currClassName} style={currStyle}>
                    <div>
                        {curr}
                    </div>
                    <div className={style.shadow} style={shadowStyle}></div>
                </div>
            </div>
        )
    }

}

Core.propTypes = {
    horizontal: PropTypes.bool,
    rootRef: PropTypes.object,
    selected: PropTypes.number,
    shadowBackground: PropTypes.string,
    willChange: PropTypes.bool,
}

Core.defaultProps = {
    horizontal: false,
    shadowBackground: 'rgba(0,0,0,0.25)',
    willChange: false,
}

export default Core