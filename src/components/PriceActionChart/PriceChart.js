import * as d3 from "d3";
import {scaleLinear} from "d3";
import {select} from "d3-selection";
import moment from "moment";
import React from 'react';
import {generatePriceGraphDataForThisDay, getInitialData} from "../../services/faker/PriceGraphDataGenerator";

class PriceChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            lastDate: "",
            loaded: true
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
        const candleOCWidth = 10;
        const candleOCGap = 6;
        const candleHLWidth = 2;
        const yScale = scaleLinear()
            .domain([0, 40])
            .range([0, 500]);

        const updateOCBlockColorAndDimensions = function(d) {
            d3.select(this)
                .transition()
                .duration(500)
                .attr('y', d => yScale(Math.abs(data[d].close)))
                .attr('height', d => {
                    return Math.abs(data[d].open - data[d].close) ?
                        yScale(Math.abs(data[d].open - data[d].close)) : 1;
                })
                .style('fill', (data[d].open - data[d].close) <= 0 ? "#006667" : "#ff1138");
        };

        const updateHLBlockColorAndDimensions = function(d) {
            d3.select(this)
                .transition()
                .duration(500)
                .attr('y', d => 500 - yScale(Math.abs(data[d].high)))
                .attr('height', d => {
                    return Math.abs(data[d].high - data[d].low) ?
                        yScale(Math.abs(data[d].high - data[d].low)) : 1;
                })
                .style('fill', (data[d].open - data[d].close) <= 0 ? "#006667" : "#ff1138")
        };

        const newBlocks = select(node)
            .selectAll('g')
            .data(Object.keys(this.state.data))
            .enter()
            .append('g');

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

        select(node).selectAll('g').exit()
    }

    addNextData() {
        let date = moment(this.state.lastDate, 'DD-MMM-YYYY');
        date.add("days", 1);
        let newLastDate = date.format('DD-MMM-YYYY');
        let data = this.state.data;
        let lastData = data[this.state.lastDate];
        let updatedData = data;
        updatedData[newLastDate] = generatePriceGraphDataForThisDay(newLastDate, lastData.symbol, lastData.interval);
        this.setState({data: updatedData, lastDate: newLastDate, loaded: false});
        // this.drawPriceGraph();
    }

    render() {
        return (
            <div className="awesome-price-chart">
                <button onClick={() => this.addNextData()}>Change</button>
                <svg ref={node => this.node = node} width={500} height={500}/>
            </div>
        );
    }

}

export default PriceChart;