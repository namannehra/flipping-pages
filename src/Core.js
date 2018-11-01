import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, {Children, PureComponent} from 'react'

import style from './Core.sass'

class Core extends PureComponent {

    getTurn(selected) {
        let turn = selected % 1
        if (turn < 0) {
            turn++
        }
        return turn
    }

    getRotation(direction, turn) {
        return (turn < 0.5 ? turn : turn - 1) * (direction === 'horizontal' ? -180 : 180)
    }

    getCurrClassName(direction, turn) {
        if (direction === 'horizontal') {
            return turn < 0.5 ? 'right' : 'left'
        }
        return turn < 0.5 ? 'bottom' : 'top'
    }

    render() {
        const {
            children, className, direction, rootRef, selected, shadowBackground, willChange, ...otherProps
        } = this.props
        const childrenArray = Children.toArray(children)
        const prev = childrenArray[Math.floor(selected)]
        const next = childrenArray[Math.floor(selected + 1)]
        const curr = childrenArray[Math.round(selected)]
        const turn = this.getTurn(selected)
        const rotation = this.getRotation(direction, turn)
        const currStyle = {
            transform: `rotate${direction === 'horizontal' ? 'Y' : 'X'}(${rotation}deg)`,
        }
        const shadowStyle = {
            background: shadowBackground,
            opacity: (turn < 0.5 ? turn : (1 - turn)) * 2,
        }
        if (willChange) {
            currStyle.willChange = 'transform'
            shadowStyle.willChange = 'opacity'
        }
        return (
            <div ref={rootRef} className={classNames(style.Core, className)} {...otherProps}>
                <div className={style[direction === 'horizontal' ? 'left' : 'top']}>
                    <div>
                        {prev}
                    </div>
                </div>
                <div className={style[direction === 'horizontal' ? 'right' : 'bottom']}>
                    <div>
                        {next}
                    </div>
                </div>
                <div className={style[this.getCurrClassName(direction, turn)]} style={currStyle}>
                    <div>
                        {curr}
                        <div className={style.shadow} style={shadowStyle}></div>
                    </div>
                </div>
            </div>
        )
    }

    static propTypes = {
        direction: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
        rootRef: PropTypes.object,
        selected: PropTypes.number.isRequired,
        shadowBackground: PropTypes.string,
        willChange: PropTypes.bool,
    }

    static defaultProps = {
        shadowBackground: 'rgba(0,0,0,0.25)',
        willChange: false,
    }

}

export default Core