import React, { Component } from 'react';
import '../../App.css';
import { scaleLinear } from "d3-scale";
import { max } from 'd3-array';
import { select } from 'd3-selection';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';


class BarChart extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()]
        };
        this.createBarChart = this.createBarChart.bind(this);
    }

    componentDidMount() {
        this.createBarChart();
    }

    change() {
        this.createBarChart();
        this.setState({data: [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()]});
    }

    createBarChart() {

        let margin = { top: 40, right: 10, bottom: 20, left: 10 },
            width = this.props.size[1] - margin.left - margin.right,
            height = this.props.size[0] - margin.top - margin.bottom;

        // svg.attr("width", width + margin.left + margin.right)
        //     .attr("height", height + margin.top + margin.bottom)
        //     .append("g")
        //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        //     .attr("ref", node => this.node = node);

        const dataMax = max(this.state.data);

        const yScale = scaleLinear()
            .domain([0, dataMax])
            .range([0, this.props.size[1]]);


        const node = this.node;

        select(node)
            .selectAll('rect')
            .data(this.state.data)
            .enter()
            .append('rect');

        select(node)
            .selectAll('rect')
            .data(this.state.data)
            .attr('x', (d,i) => i * 25)
            .attr('width', 20)
            .each(function(d) {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .style('fill', '#'+(Math.random()*0xFFFFFF<<0).toString(16))
                    .attr('y', d => 500 - yScale(d))
                    .attr('height', d => yScale(d))
            });

        select(node)
            .selectAll('rect')
            .data(this.state.data)
            .exit()
            .remove();

    }

    render() {
        return (
            <React.Fragment>
                <button onClick={() => this.change()}>Change</button>
                <svg ref={node => this.node = node} width={500} height={500}></svg>
            </React.Fragment>
        );
    }
}
export default BarChart;