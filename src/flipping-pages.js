import React, {Component} from 'react'
import PropTypes from 'prop-types'

import './style.module.css'

class FlippingPages extends Component {
  constructor(props) {
    super(props)
    this.state = {
      turn: 0
    }
    this._handlePointerdown = this._handlePointerdown.bind(this)
    this._handlePointermove = this._handlePointermove.bind(this)
    this._handlePointerup = this._handlePointerup.bind(this)
  }
  componentDidMount() {
    this._rootEle.addEventListener('pointerdown', this._handlePointerdown)
    addEventListener('pointermove', this._handlePointermove)
    addEventListener('pointerup', this._handlePointerup)
    addEventListener('pointercancel', this._handlePointerup)
  }
  componentWillUnmount() {
    this._rootEle.removeEventListener('pointerdown', this._handlePointerdown)
    removeEventListener('pointermove', this._handlePointermove)
    removeEventListener('pointerup', this._handlePointerup)
    removeEventListener('pointercancel', this._handlePointerup)
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.selected !== this.props.selected) {
      if (this._pointerDown) {
        this._pointerDown = false
      } else {
        this._cancelAnimation()
      }
      if (nextProps.noAnimation) {
        this.setState({turn: 0})
      } else {
        this.setState({turn: this.props.selected + this.state.turn - nextProps.selected})
        requestAnimationFrame(() => {
          this._animateToSelected()
        })
      }
    } else {
      if (this._pointerDown) {
        if (nextProps.disabled) {
          this._pointerDown = false
          if (nextProps.noAnimation) {
            this.setState({turn: 0})
          } else {
            this._animateToSelected()
          }
        } else if (nextProps.swipeLength !== this.props.swipeLength) {
          this._startY = ((this._startY - this._currY) / this.props.swipeLength * nextProps.swipeLength) + this._currY
        }
      } else if (this._animationRunning) {
        if (nextProps.noAnimation) {
          this._cancelAnimation()
          this.setState({turn: 0})
        } else if (nextProps.animationDuration !== this.props.animationDuration) {
          this._animationStartTurn = this.state.turn
          this._animationStartTime = performance.now()
        }
      }
    }
  }
  render() {
    const {
      animationDuration,
      disabled,
      noAnimation,
      onChange,
      onOverScroll,
      selected,
      shadowBackground,
      swipeLength,
      thresholdSpeed,
      className,
      children,
      ...otherProps,
    } = this.props
    return (
      <div ref={ele => this._rootEle = ele} className={className} styleName="FlippingPages" {...otherProps}>
        {this._getChildrenArr(children).map((child, index, childrenArr) => {
          let pos = selected + this.state.turn
          if (pos < 0) {
            pos = -onOverScroll(-pos)
          } else if (pos > childrenArr.length - 1) {
            pos = onOverScroll(pos - childrenArr.length + 1) + childrenArr.length - 1
          }
          if (index !== Math.floor(pos) && index !== Math.ceil(pos)) {
            return null
          }
          const first = {
            opacity: 0,
            rotation: 0,
            z: 0,
            shadowOpacity: 0,
          }
          const second = {
            opacity: 0,
            rotation: 0,
            z: 0,
            shadowOpacity: 0,
          }
          if (index > pos - 0.5 && index < pos + 0.5) {
            first.opacity = 1
            second.opacity = 1
            first.z = 1
            second.z = 1
            if (index > pos) {
              first.rotation = pos - index
              first.shadowOpacity = (index - pos) * 2
            } else if (index < pos) {
              second.rotation = pos - index
              second.shadowOpacity = (pos - index) * 2
            }
          } else if (index < pos) {
            first.opacity = 1
          } else if (index > pos) {
            second.opacity = 1
          }
          return [
            <div key={child.key + '.0'} styleName="page first-page" style={this._getPageStyle(first)}>
              <div styleName="child-wrapper first-child-wrapper">{child}</div>
              <div styleName="shadow" style={{background: shadowBackground, opacity: first.shadowOpacity}}></div>
            </div>,
            <div key={child.key + '.1'} styleName="page second-page" style={this._getPageStyle(second)}>
              <div styleName="child-wrapper second-child-wrapper">{child}</div>
              <div styleName="shadow" style={{background: shadowBackground, opacity: second.shadowOpacity}}></div>
            </div>,
          ]
        })}
      </div>
    )
  }
  _getChildrenArr(children) {
    return Array.isArray(children) ? children : [children]
  }
  _getPageStyle(page) {
    return {
      opacity: page.opacity,
      transform: `rotateX(${page.rotation * 180}deg)`,
      zIndex: page.z,
    }
  }
  _handlePointerdown(eve) {
    if (!eve.isPrimary || eve.button || this.props.disabled || this._animationRunning) {
      return
    }
    this._pointerDown = true
    this._downPointerId = eve.pointerId
    this._startY = eve.clientY
    this._lastY = eve.clientY
    this._lastYTime = eve.timeStamp
    this._currY = eve.clientY
  }
  _handlePointermove(eve) {
    if (!this._pointerDown || eve.pointerId !== this._downPointerId) {
      return
    }
    let turn = (this._startY - eve.clientY) / this.props.swipeLength
    turn = Math.max(turn, -1)
    turn = Math.min(turn, 1)
    this.setState({turn})
    this._lastY = this._currY
    this._lastYTime = eve.timeStamp
    this._currY = eve.clientY
  }
  _handlePointerup(eve) {
    if (!this._pointerDown || eve.pointerId !== this._downPointerId) {
      return
    }
    this._pointerDown = false
    if (this.props.noAnimation) {
      this.setState({turn: 0})
    } else {
      this._animateToSelected()
    }
    if (typeof this.props.onChange === 'function') {
      const speed = (this._lastY - eve.clientY) / (eve.timeStamp - this._lastYTime)
      const turnDir = Math.sign(this.state.turn)
      let fullTurn = false
      if (Math.abs(this.state.turn) < 0.5) {
        if (Math.sign(speed) === turnDir && Math.abs(speed) >= this.props.thresholdSpeed) {
          fullTurn = true
        }
      } else {
        if (Math.sign(speed) === turnDir || Math.abs(speed) < this.props.thresholdSpeed) {
          fullTurn = true
        }
      }
      if (fullTurn) {
        if (
          (this.props.selected !== 0 || turnDir === 1) &&
          (this.props.selected !== this._getChildrenArr(this.props.children).length - 1 || turnDir === -1)
        ) {
          this.props.onChange(turnDir)
        }
      }
    }
  }
  _animateToSelected() {
    this._animationRunning = true
    this._animationDir = -Math.sign(this.state.turn)
    this._animationStartTurn = this.state.turn
    this._animationStartTime = performance.now()
    this._animationRAF()
  }
  _cancelAnimation() {
    cancelAnimationFrame(this._animationRef)
    this._animationRunning = false
  }
  _animationRAF() {
    this._animationRef = requestAnimationFrame(timeStamp => {
      const toTurn = (timeStamp - this._animationStartTime) / this.props.animationDuration * this._animationDir
      const turn = this._animationStartTurn + toTurn
      if (this._animationDir === 1) {
        if (turn >= 0) {
          this.setState({turn: 0})
          this._animationRunning = false
          return
        }
      } else {
        if (turn <= 0) {
          this.setState({turn: 0})
          this._animationRunning = false
          return
        }
      }
      this.setState({turn})
      this._animationRAF()
    })
  }
}

FlippingPages.propTypes = {
  animationDuration: PropTypes.number,
  disabled: PropTypes.bool,
  noAnimation: PropTypes.bool,
  onChange: PropTypes.func,
  onOverScroll: PropTypes.func,
  selected: PropTypes.number.isRequired,
  shadowBackground: PropTypes.string,
  swipeLength: PropTypes.number,
  thresholdSpeed: PropTypes.number,
}

FlippingPages.defaultProps = {
  animationDuration: 400,
  disabled: false,
  noAnimation: false,
  onChange: null,
  onOverScroll: overscroll => overscroll / 4,
  shadowBackground: 'rgba(0,0,0,0.1)',
  swipeLength: 400,
  thresholdSpeed: 0.1,
}

export default FlippingPages