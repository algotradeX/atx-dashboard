import React from 'react'
import * as d3 from 'd3'
import {withFauxDOM} from 'react-faux-dom'

class MyReactComponent extends React.Component {
    componentDidMount () {
        const faux = this.props.connectFauxDOM('div', 'chart');
        d3.select(faux)
            .append('div')
            .html('Hello World!');
        this.props.animateFauxDOM(800);
    }

    render () {
        return (
            <div>
                <h2>Here is some fancy data:</h2>
                <div className='renderedD3'>
                    {this.props.chart}
                </div>
            </div>
        )
    }
}

MyReactComponent.defaultProps = {
    chart: 'loading'
}

export default withFauxDOM(MyReactComponent);