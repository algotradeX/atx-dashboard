import React, { Component } from 'react';
import { scaleLinear } from "d3-scale";
import { max } from 'd3-array';
import { select } from 'd3-selection';
import ReactFauxDOM from 'react-faux-dom';


class ChartWithFauxDom extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
            chart: null
        };
        this.createBarChart = this.createBarChart.bind(this);
    }

    createHook(comp, elem, statename) {
        let elems = new Map(), interval = undefined;
        let updateFauxDom = function updateFauxDom() {
            comp.setState({[statename]: elem.toReact()});
        };
        setTimeout(updateFauxDom);
        comp.isAnimating = function () {
            return !!interval;
        };
        return function (transition) {
            transition.each(function (e) {
                elems.set(e, (elems.get(e) || new Set()).add(transition.id));
                interval = interval || setInterval(updateFauxDom, 16);
            });
            transition.each("end", function (e) {
                let anims = elems.get(e);
                anims.delete(transition.id);
                if (anims.size) {
                    elems.set(e, anims);
                } else {
                    elems.delete(e);
                }
                if (!elems.size) interval = clearInterval(interval);
            });
        };
    };

    componentDidMount() {
        this.createBarChart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    change() {
        this.createBarChart();
        this.setState({data: [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()]});
    }

    createBarChart() {

        const dataMax = max(this.state.data);

        const yScale = scaleLinear()
            .domain([0, dataMax])
            .range([0, this.props.size[1]]);

        let margin = { top: 40, right: 10, bottom: 20, left: 10 },
            width = this.props.size[1] - margin.left - margin.right,
            height = this.props.size[0] - margin.top - margin.bottom;

        let faux = ReactFauxDOM.createElement("BarChart");

        select(faux).append("svg")
            .attr("ref", node => this.node = node)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        select(faux).select('svg')
            .selectAll('rect')
            .data(this.state.data)
            .enter()
            .append('rect');

        select(faux).select('svg')
            .selectAll('rect')
            .data(this.state.data)
            .exit()
            .remove();

        let rect = select(faux).select('svg')
            .selectAll('rect')
            .data(this.state.data)
            .attr('x', (d,i) => i * 25)
            .attr('y', d => this.props.size[1] - yScale(d))
            .attr('height', d => yScale(d))
            .attr('width', 20)
            .each(function(d) {
                select(this).style('fill', '#'+(Math.random()*0xFFFFFF<<0).toString(16));
            });

        let hook = this.createHook(this, faux, "chart");

        let y = scaleLinear([0, dataMax]).range([0, height]);

        rect.transition().duration(500).delay(function (d, i) {
            return i * 10;
        }).attr('width', 24);

        this.setState({chart: faux.toReact()});

    }

    render() {
        return (
            <React.Fragment>
                <button onClick={() => this.change()}>Change</button>
                <div>{this.state.chart}</div>
            </React.Fragment>
        );
    }
}
export default ChartWithFauxDom;