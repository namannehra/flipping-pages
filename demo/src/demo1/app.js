import React, {Component} from 'react'

import FlippingPages from 'flipping-pages'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: 0,
    }
  }
  render() {
    const children = []
    for (let i = 0; i < 5; i++) {
      children.push(<div key={i} className={'page page' + i}></div>)
    }
    return (
      <FlippingPages
        className="pages"
        onChange={dir => this.setState({selected: this.state.selected + dir})}
        selected={this.state.selected}
      >{children}</FlippingPages>
    )
  }
}

export default App