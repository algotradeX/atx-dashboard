import * as d3 from "d3";
import {scaleLinear, scaleBand} from "d3";
import {select, selectAll} from "d3-selection";
import moment from "moment";
import React from 'react';
import {generatePriceGraphDataForThisDay, getInitialData} from "../../services/faker/PriceGraphDataGenerator";

class PriceChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            lastDate: "",
            loaded: true,
            svgDimensions: {
                width: 500,
                height: 500
            }
        };
        this.drawPriceGraph = this.drawPriceGraph.bind(this);
    }

    componentDidMount() {
        let initialData = getInitialData("01-Mar-2020", 10);
        this.setState({data: initialData.data, lastDate: initialData.lastDate, loaded: false});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.loaded === false) {
            this.drawPriceGraph();
            this.setState({loaded: true});
        }
    }

    drawPriceGraph() {
        const node = this.node;
        const data = this.state.data;
        const svgDimensions = this.state.svgDimensions;
        const priceMin = 0;
        const priceMax = 40;
        const candleOCWidth = 10;
        const candleOCGap = 6;
        const candleHLWidth = 2;
        const animationDuration = 500;
        const yScale = scaleLinear().domain([priceMin, priceMax]).range([0, svgDimensions.height]);

        select("svg").selectAll("g.x-axis").remove();
        const domain = Object.keys(data).map((v, i) => (i%5 === 0 ? v : ""));
        const x_axis_scale = scaleBand()
            .range([0, (candleOCWidth + candleOCGap) * (Object.keys(data).length - 1)])
            .domain(domain);
        const x_axis = d3.axisTop().scale(x_axis_scale);
        select("svg").append("g")
            .attr('class', 'axis x-axis')
            .attr("transform", `translate(0, ${svgDimensions.width - 5})`)
            .call(x_axis);

        select("svg").selectAll("g.y-axis").remove();
        const y_axis_scale = scaleLinear()
            .domain([priceMax, priceMin])
            .range([0, svgDimensions.height]);
        const y_axis = d3.axisLeft().scale(y_axis_scale);
        select("svg").append("g")
            .attr('class', 'axis y-axis')
            .attr("transform", `translate(${svgDimensions.height - 5}, 0)`)
            .call(y_axis);

        const updateOCBlockColorAndDimensions = function(d) {
            d3.select(this)
                .transition()
                .duration(animationDuration)
                .attr('y', d => svgDimensions.width - yScale(Math.max(Math.abs(data[d].open), Math.abs(data[d].close))))
                .attr('height', d => {
                    return Math.abs(data[d].open - data[d].close) ?
                        yScale(Math.abs(data[d].open - data[d].close)) : 1;
                })
                .style('fill', (data[d].open - data[d].close) <= 0 ? "#006667" : "#ff1138");
        };

        const updateHLBlockColorAndDimensions = function(d) {
            d3.select(this)
                .transition()
                .duration(animationDuration)
                .attr('y', d => svgDimensions.width - yScale(Math.max(Math.abs(data[d].high), Math.abs(data[d].low))))
                .attr('height', d => {
                    return Math.abs(data[d].high - data[d].low) ?
                        yScale(Math.abs(data[d].high - data[d].low)) : 1;
                })
                .style('fill', (data[d].open - data[d].close) <= 0 ? "#006667" : "#ff1138")
        };

        const newBlocks = select(node)
            .selectAll('g.block')
            .data(Object.keys(this.state.data))
            .enter()
            .append('g')
            .attr('class', 'block');

        newBlocks.append('rect')
            .data(Object.keys(this.state.data))
            .attr('x', (d, i) => i * (candleOCWidth + candleOCGap))
            .attr('width', candleOCWidth)
            .each(updateOCBlockColorAndDimensions);

        newBlocks.append('rect')
            .attr('x', (d, i) => i * (candleOCWidth + candleOCGap))
            .attr('width', candleHLWidth)
            .attr("transform", `translate(${(candleOCWidth - candleHLWidth)/2},0)`)
            .each(updateHLBlockColorAndDimensions);

        newBlocks.append("text")
            .attr('x', (d, i) => i * (candleOCWidth + candleOCGap))
            .attr('y', (d, i) => svgDimensions.width - yScale(Math.max(Math.abs(data[d].high), Math.abs(data[d].low))))
            .text(function(d) {
                return (data[d].close - data[d].open);
            });

        select(node).selectAll('g').exit();

        let lineGenerator = d3.line().curve(d3.curveCatmullRom);
        let avg_data = Object.keys(data).map((d, i) => {
            return [(candleOCWidth + candleOCGap)*i + candleOCWidth/2, (svgDimensions.width - yScale(data[d].avg))]
        });
        let pathString = lineGenerator(avg_data);
        select("svg").selectAll("path.avg-price-line").remove();
        select("svg").append("path")
            .style("stroke", "steelblue")
            .style("fill", "none")
            .attr("class", "line avg-price-line")
            .attr("d", pathString);
    }

    addNextData() {
        let date = moment(this.state.lastDate, 'DD-MMM-YYYY');
        date.add("days", 1);
        let newLastDate = date.format('DD-MMM-YYYY');
        let data = this.state.data;
        let lastData = data[this.state.lastDate];
        let updatedData = data;
        updatedData[newLastDate] = generatePriceGraphDataForThisDay(newLastDate, lastData.symbol, lastData.interval);
        let svgDimensions = this.state.svgDimensions;
        this.setState({data: updatedData, lastDate: newLastDate, loaded: false, svgDimensions: svgDimensions});
    }

    render() {
        return (
            <div className="awesome-price-chart">
                <button onClick={() => this.addNextData()}>Add one data</button>
                <svg ref={node => this.node = node} style={{"margin": "10px"}} width={this.state.svgDimensions.width} height={this.state.svgDimensions.height}/>
            </div>
        );
    }

}

export default PriceChart;