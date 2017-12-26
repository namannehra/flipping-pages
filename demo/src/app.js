import React, {Component} from 'react'

import FlippingPages from '../../src/flipping-pages'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = Object.assign({}, FlippingPages.defaultProps, {
      height: '400px',
      width: '200px',
      perspective: '800px',
      selected: 0,
      onChange: '' +
        'function(dir) {\n' +
        '  this.setState({selected: this.state.selected + dir})\n' +
        '}',
      onOverScroll: '' +
        'function(overscroll) {\n' +
        '  return overscroll / 4\n' +
        '}',
    })
    this.handleEval = this.handleEval.bind(this)
  }
  handleEval(str) {
    try {
      return eval(`(${str})`).bind(this)
    } catch(err) {
      undefined
    }
  }
  render() {
    const children = []
    for (let i = 0; i < 5; i++) {
      children.push(<div key={i} className={'page page' + i}></div>)
    }
    return (
      <div>
        Height <input value={this.state.height} onChange={eve => this.setState({height: eve.target.value})}/><br/><br/>
        Width <input value={this.state.width} onChange={eve => this.setState({width: eve.target.value})}/><br/><br/>
        Perspective <input value={this.state.perspective} onChange={eve => this.setState({perspective: eve.target.value})}/><br/><br/>
        Animation duration <input type="number" min="0" value={this.state.animationDuration} onChange={eve => this.setState({animationDuration: Number(eve.target.value)})}/><br/><br/>
        Disabled <input type="checkbox" checked={this.state.disabled} onChange={eve => this.setState({disabled: eve.target.checked})}/><br/><br/>
        No animation <input type="checkbox" checked={this.state.noAnimation} onChange={eve => this.setState({noAnimation: eve.target.checked})}/><br/><br/>
        On change <textarea rows="5" cols="60" value={this.state.onChange} onChange={eve => this.setState({onChange: eve.target.value})}></textarea><br/><br/>
        On overScroll <textarea rows="5" cols="60" value={this.state.onOverScroll} onChange={eve => this.setState({onOverScroll: eve.target.value})}></textarea><br/><br/>
        Selected <input type="number" min="0" max="4" value={this.state.selected} onChange={eve => this.setState({selected: Number(eve.target.value)})}/><br/><br/>
        Shadow background <input value={this.state.shadowBackground} onChange={eve => this.setState({shadowBackground: eve.target.value})}/><br/><br/>
        Swipe length <input type="number" value={this.state.swipeLength} onChange={eve => this.setState({swipeLength: Number(eve.target.value)})}/><br/><br/>
        Threshold speed <input type="number" value={this.state.thresholdSpeed} onChange={eve => this.setState({thresholdSpeed: Number(eve.target.value)})}/><br/><br/>
        Demo:<br/>
        <FlippingPages
          className="pages"
          style={{
            height: this.state.height,
            width: this.state.width,
            perspective: this.state.perspective,
          }}
          animationDuration={this.state.animationDuration}
          disabled={this.state.disabled}
          noAnimation={this.state.noAnimation}
          onChange={this.handleEval(this.state.onChange)}
          onOverScroll={this.handleEval(this.state.onOverScroll)}
          selected={this.state.selected}
          shadowBackground={this.state.shadowBackground}
          swipeLength={this.state.swipeLength}
          thresholdSpeed={this.state.thresholdSpeed}
        >{children}</FlippingPages>
      </div>
    )
  }
}

export default App