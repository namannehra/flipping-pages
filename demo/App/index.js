import FlippingPages from 'flipping-pages'
import React, {Component, createRef} from 'react'
import {hot} from 'react-hot-loader'

import style from './style.css'

class App extends Component {

    constructor(props) {
        super(props)
        this.flippingPages = createRef()
        const {onOverSwipe, onSwipeStart, ...otherDefaultProps} = FlippingPages.defaultProps
        this.state = Object.assign({
            selected: 0,
            perspective: 0,
        }, otherDefaultProps)
    }

    updatePerspective = () => {
        this.setState({perspective: this.flippingPages.current[`client${this.state.horizontal ? 'Width' : 'Height'}`] * 2})
    }

    handleFullScreen = () => {
        const flippingPagesEle = this.flippingPages.current
        if (flippingPagesEle.requestFullScreen) {
            flippingPagesEle.requestFullScreen()
        } else if (flippingPagesEle.webkitRequestFullScreen) {
            flippingPagesEle.webkitRequestFullScreen()
        } else if (flippingPagesEle.mozRequestFullScreen) {
            flippingPagesEle.mozRequestFullScreen()
        }
    }

    handleAnimationDurationChange = event => {
        this.setState({animationDuration: Number(event.target.value)})
    }

    handleHorizontalChange = event => {
        const horizontal = event.target.checked
        this.setState({
            horizontal,
            perspective: this.flippingPages.current[`client${horizontal ? 'Width' : 'Height'}`] * 2,
        })
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
        /* https://github.com/jquery/PEP#touch-action */
        this.flippingPages.current.setAttribute('touch-action', 'none')
        addEventListener('resize', this.updatePerspective)
        requestAnimationFrame(this.updatePerspective)
    }

    componentWillUnmount() {
        removeEventListener('resize', this.updatePerspective)
    }

    render() {
        const {perspective, ...flippingPagesProps} = this.state
        const pages = []
        for (let i = 0; i < 5; i++) {
            const backgroundImage = require(`../img/${i}.svg`)
            const page = (
                <div key={i} className={style.page} style={{backgroundImage: `url(${backgroundImage})`}}></div>
            )
            pages[i] = page
        }
        return <>
            <div className={style.flippingPagesContainer}>
                <FlippingPages
                    rootRef={this.flippingPages}
                    className={style.flippingPages}
                    style={{perspective}}
                    onSelectedChange={this.handleFlippingPagesSelectedChange}
                    willChange={true}
                    {...flippingPagesProps}
                >
                    {pages}
                </FlippingPages>
            </div>
            <div className={style.config}>
                <button onClick={this.handleFullScreen}>Full screen</button><br/><br/>
                <label>
                    {'animationDuration: '}
                    <input type="number" value={this.state.animationDuration} onChange={this.handleAnimationDurationChange}/>
                </label><br/><br/>
                <label>
                    <input
                        type="checkbox"
                        checked={this.state.horizontal}
                        onChange={this.handleHorizontalChange}
                    />
                    {' horizontal'}
                </label><br/><br/>
                <label>
                    <input
                        type="checkbox"
                        checked={this.state.reverse}
                        onChange={this.handleReverseChange}
                    />
                    {' reverse'}
                </label><br/><br/>
                <label>
                    {'selected: '}
                    <input
                        type="number"
                        min="0"
                        max={pages.length - 1}
                        value={this.state.selected}
                        onChange={this.handleSelectedChange}
                    />
                </label><br/><br/>
                <label>
                    {'shadowBackground: '}
                    <input value={this.state.shadowBackground} onChange={this.handleShadowBackgroundChange}/>
                </label><br/><br/>
                <label>
                    {'swipeLength: '}
                    <input type="number" min="0" value={this.state.swipeLength} onChange={this.handleSwipeLengthChange}/>
                </label><br/><br/>
                <label>
                    {'thresholdSpeed: '}
                    <input type="number" min="0" value={this.state.thresholdSpeed} onChange={this.handleThresholdSpeedChange}/>
                </label>
            </div>
        </>
    }

}

export default hot(module)(App)