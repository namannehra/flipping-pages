import classNames from 'classnames'
import FlippingPages from 'flipping-pages'
import React, {PureComponent, createRef, StrictMode} from 'react'
import {hot} from 'react-hot-loader'

import style from './App.sass'

const requestFullscreen = [
    'requestFullscreen', 'webkitRequestFullScreen', 'mozRequestFullScreen', 'msRequestFullscreen'
].find(requestFullscreen => HTMLElement.prototype[requestFullscreen])

class App extends PureComponent {

    constructor(props) {
        super(props)
        this.totalPages = 4
        this.flippingPagesContainer = createRef()
        this.flippingPages = createRef()
        const {onOverSwipe, onSwipeStart, ...otherDefaultProps} = FlippingPages.defaultProps
        this.state = Object.assign({
            direction: 'horizontal',
            selected: 0,
            perspective: 0,
        }, otherDefaultProps)
    }

    setPerspective(direction) {
        this.setState({
            perspective: this.flippingPages.current[`client${direction === 'horizontal' ? 'Width' : 'Height'}`] * 2
        })
    }

    updatePerspective = () => {
        this.setPerspective(this.state.direction)
    }

    previous = () => {
        this.setState(state => ({
            selected: (state.selected - 1 + this.totalPages) % this.totalPages
        }))
    }

    next = () => {
        this.setState(state => ({
            selected: (state.selected + 1) % this.totalPages
        }))
    }

    handleFullScreen = () => {
        const request = this.flippingPagesContainer.current[requestFullscreen]()
        if (request) {
            request.then(this.updatePerspective)
        } else {
            this.updatePerspective()
        }
    }

    handleAnimationDurationChange = event => {
        this.setState({animationDuration: Number(event.target.value)})
    }

    handleDirectionChange = event => {
        const direction = event.target.value
        this.setState({direction})
        this.setPerspective(direction)
    }

    handleReverseChange = event => {
        this.setState({reverse: event.target.checked})
    }

    handleSelectedChange = event => {
        this.setState({selected: Number(event.target.value)})
    }

    handleShadowBackgroundChange = event => {
        this.setState({shadowBackground: event.target.value})
    }

    handleSwipeLengthChange = event => {
        this.setState({swipeLength: Number(event.target.value)})
    }

    handleThresholdSpeedChange = event => {
        this.setState({thresholdSpeed: Number(event.target.value)})
    }

    handleFlippingPagesSelectedChange = selected => {
        this.setState({selected})
    }

    componentDidMount() {
        addEventListener('resize', this.updatePerspective)
        this.updatePerspective()
    }

    componentWillUnmount() {
        removeEventListener('resize', this.updatePerspective)
    }

    render() {
        const {perspective, ...flippingPagesProps} = this.state
        return (
            <StrictMode>
                <div ref={this.flippingPagesContainer} className={style.flippingPagesContainer}>
                    <FlippingPages
                        rootRef={this.flippingPages}
                        className={style.flippingPages}
                        style={{perspective}}
                        onSelectedChange={this.handleFlippingPagesSelectedChange}
                        {...flippingPagesProps}
                    >
                        <div className={classNames(style.page, style.red)}>0</div>
                        <div className={classNames(style.page, style.green)}>1</div>
                        <div className={classNames(style.page, style.blue)}>2</div>
                        <div className={classNames(style.page, style.orange)}>3</div>
                    </FlippingPages>
                    <div className={style.navigation}>
                        <button onClick={this.previous}>Previous</button>
                        <button onClick={this.next}>Next</button>
                    </div>
                </div>
                <div className={style.config}>
                    <button onClick={this.handleFullScreen} disabled={!requestFullscreen}>Full screen</button><br/><br/>
                    <label>
                        {'animationDuration '}
                        <input
                            type="number"
                            value={this.state.animationDuration}
                            onChange={this.handleAnimationDurationChange}
                        />
                    </label><br/><br/>
                    <fieldset>
                        <legend>direction</legend>
                        <label>
                            <input
                                type="radio"
                                name="direction"
                                value="horizontal"
                                checked={this.state.direction === 'horizontal'}
                                onChange={this.handleDirectionChange}
                            />
                            horizontal
                        </label><br/>
                        <label>
                            <input
                                type="radio"
                                name="direction"
                                value="vertical"
                                checked={this.state.direction === 'vertical'}
                                onChange={this.handleDirectionChange}
                            />
                            vertical
                        </label><br/>
                    </fieldset><br/>
                    <label>
                        <input
                            type="checkbox"
                            checked={this.state.reverse}
                            onChange={this.handleReverseChange}
                        />
                        {' reverse'}
                    </label><br/><br/>
                    <label>
                        {'selected '}
                        <input
                            type="number"
                            min="0"
                            max={this.totalPages - 1}
                            value={this.state.selected}
                            onChange={this.handleSelectedChange}
                        />
                    </label><br/><br/>
                    <label>
                        {'shadowBackground '}
                        <input value={this.state.shadowBackground} onChange={this.handleShadowBackgroundChange}/>
                    </label><br/><br/>
                    <label>
                        {'swipeLength '}
                        <input
                            type="number"
                            min="0"
                            value={this.state.swipeLength}
                            onChange={this.handleSwipeLengthChange}
                        />
                    </label><br/><br/>
                    <label>
                        {'thresholdSpeed '}
                        <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={this.state.thresholdSpeed}
                            onChange={this.handleThresholdSpeedChange}
                            />
                    </label>
                </div>
            </StrictMode>
        )
    }

}

export default hot(module)(App)