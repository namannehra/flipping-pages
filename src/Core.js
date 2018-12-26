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
        if (turn >= 0.5) {
            turn--
        }
        turn *= 2
        return turn
    }

    getRotation(direction, turn) {
        return turn * (direction === 'horizontal' ? -90 : 90)
    }

    getTransform(direction, turn) {
        return `rotate${direction === 'horizontal' ? 'Y' : 'X'}(${this.getRotation(direction, turn)}deg)`
    }

    render() {
        const {
            children, className, direction, rootRef, selected, shadowBackground, willChange, ...otherProps
        } = this.props
        const childrenArray = Children.toArray(children)
        const curr = childrenArray[Math.round(selected)]
        const prev = childrenArray[Math.round(selected) - 1]
        const next = childrenArray[Math.round(selected) + 1]
        const turn = this.getTurn(selected)
        const currStyle = {}
        const prevStyle = {}
        const prevCurrStyle = {}
        const prevShadowStyle = {
            background: shadowBackground,
        }
        const nextStyle = {}
        const nextCurrStyle = {}
        const nextShadowStyle = {
            background: shadowBackground,
        }
        if (turn < 0) {
            currStyle.opacity = 0
            prevCurrStyle.transform = this.getTransform(direction, turn)
            prevShadowStyle.opacity = -turn
            nextShadowStyle.opacity = 0
        } else if (turn > 0) {
            currStyle.opacity = 0
            nextCurrStyle.transform = this.getTransform(direction, turn)
            nextShadowStyle.opacity = turn
            prevShadowStyle.opacity = 0
        } else {
            prevStyle.visibility = 'hidden'
            prevCurrStyle.visibility = 'hidden'
            nextStyle.visibility = 'hidden'
            nextCurrStyle.visibility = 'hidden'
        }
        if (willChange) {
            currStyle.willChange = 'opacity'
            prevStyle.willChange = 'visibility'
            prevCurrStyle.willChange = 'visibility, transform'
            prevShadowStyle.willChange = 'opacity'
            nextStyle.willChange = 'visibility'
            nextCurrStyle.willChange = 'visibility, transform'
            nextShadowStyle.willChange = 'opacity'
        }
        return (
            <div ref={rootRef} className={classNames(style.Core, className)} {...otherProps}>
                <div className={style.curr} style={currStyle}>
                    {curr}
                </div>
                <div
                    className={style[direction === 'horizontal' ? 'left' : 'top']}
                    style={prevStyle}
                    aria-hidden="true"
                >
                    <div className={style.clipper}>
                        {prev}
                    </div>
                </div>
                <div
                    className={style[direction === 'horizontal' ? 'left' : 'top']}
                    style={prevCurrStyle}
                    aria-hidden="true"
                >
                    <div className={style.clipper}>
                        {curr}
                    </div>
                    <div className={style.shadow} style={prevShadowStyle}></div>
                </div>
                <div
                    className={style[direction === 'horizontal' ? 'right' : 'bottom']}
                    style={nextStyle}
                    aria-hidden="true"
                >
                    <div className={style.clipper}>
                        {next}
                    </div>
                </div>
                <div
                    className={style[direction === 'horizontal' ? 'right' : 'bottom']}
                    style={nextCurrStyle}
                    aria-hidden="true"
                >
                    <div className={style.clipper}>
                        {curr}
                    </div>
                    <div className={style.shadow} style={nextShadowStyle}></div>
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