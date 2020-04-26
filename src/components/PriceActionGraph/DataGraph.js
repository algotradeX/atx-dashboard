import {scaleLinear, select} from "d3";
import {scaleTime} from "d3-scale";
import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import Styles from './DataGraph.module.scss';
import * as d3 from 'd3';


class DataGraph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            svgDimensions: {
                width: 0,
                height: 0
            },
            graphData: null,
            loaded: true
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    updateWindowDimensions() {
        this.setState({
            svgDimensions: {
                width: this.dataGraphComponent.clientWidth - 20 - 36,
                height: this.dataGraphComponent.clientHeight - 20 - 20
            }
        });
    }

    drawDataGraph() {
        const node = this.node;
        const svgDimensions = this.state.svgDimensions;
        const graph_data = this.state.graphData;
        const data = graph_data && graph_data.graph_plot_data;
        const graph_meta = graph_data && graph_data.meta;
        const graph_meta_min = graph_meta.min;
        const graph_meta_max = graph_meta.max;

        const verticalBufferRatio = 0.1;
        const horizontalBufferRatio = 86400 * 1000;
        const candleOCWidth = 3;
        const candleHLWidth = 1;
        const animationDuration = 1000;

        // find data range
        const xMin = new Date(graph_meta["start_date"]);
        const xMax = new Date(graph_meta["end_date"]);
        const yMin = Math.min(graph_meta_min.open, graph_meta_min.close, graph_meta_min.high, graph_meta_min.low);
        const yMax = Math.max(graph_meta_max.open, graph_meta_max.close, graph_meta_max.high, graph_meta_max.low);

        select(node).selectAll("g.x-axis").remove();
        const x_axis_scale = scaleTime()
            .domain([xMin - horizontalBufferRatio, xMax - horizontalBufferRatio])
            .range([0, svgDimensions.width]);
        const x_axis = d3.axisTop().scale(x_axis_scale);
        select(node).append("g")
            .attr('class', 'axis x-axis')
            .attr("transform", `translate(0, ${svgDimensions.height - 5})`)
            .call(x_axis);

        select(node).selectAll("g.y-axis").remove();
        const y_axis_scale = scaleLinear()
            .domain([yMax*(1 + verticalBufferRatio), yMin*(1 - verticalBufferRatio)])
            .range([0, svgDimensions.height]);
        const y_axis = d3.axisLeft().scale(y_axis_scale);
        select(node).append("g")
            .attr('class', 'axis y-axis')
            .attr("transform", `translate(${svgDimensions.width - 5}, 0)`)
            .call(y_axis);

        const updateOCBlockColorAndDimensions = function(d) {
            d3.select(this)
                .transition()
                .duration(animationDuration)
                .attr('y', d => y_axis_scale(Math.max(Math.abs(data[d].open), Math.abs(data[d].close))))
                .attr('height', d => {
                    return Math.abs(data[d].open - data[d].close) ?
                        Math.abs(y_axis_scale(Math.abs(data[d].open)) - y_axis_scale(Math.abs(data[d].close))) : 1;
                })
                .style('fill', (data[d].open - data[d].close) <= 0 ? "#006667" : "#ff1138");
        };

        const updateHLBlockColorAndDimensions = function(d) {
            d3.select(this)
                .transition()
                .duration(animationDuration)
                .attr('y', d => y_axis_scale(Math.max(Math.abs(data[d].high), Math.abs(data[d].low))))
                .attr('height', d => {
                    return Math.abs(data[d].high - data[d].low) ?
                        Math.abs(y_axis_scale(Math.abs(data[d].high)) - y_axis_scale(Math.abs(data[d].low))) : 1;
                })
                .style('fill', (data[d].open - data[d].close) <= 0 ? "#006667" : "#ff1138")
        };

        select(node).selectAll('g.data-graph').remove();
        select(node).append('g').attr('class', 'data-graph');

        const newBlocks = select(node)
            .select('g.data-graph')
            .selectAll('g.rect')
            .data(Object.keys(data))
            .enter();

        newBlocks.append('g')
            .attr('class', 'g.rect')
            .append('rect')
            .attr('class', 'oc-rect')
            .attr('x', (d, i) => x_axis_scale(d * 1000))
            .attr('y', svgDimensions.width/2)
            .attr('width', candleOCWidth)
            .attr('height', 10)
            .style('fill', "#caeaff")
            .each(updateOCBlockColorAndDimensions);

        newBlocks.append('rect')
            .attr('class', 'hl-rect')
            .attr('x', (d, i) => x_axis_scale(d * 1000))
            .attr('y', svgDimensions.width/2)
            .attr('width', candleHLWidth)
            .attr('height', 10)
            .style('fill', "#bacaff")
            .attr("transform", `translate(${(candleOCWidth - candleHLWidth)/2},0)`)
            .each(updateHLBlockColorAndDimensions);

        // newBlocks.append("text")
        //     .attr('x', (d, i) => x_axis_scale(d * 1000))
        //     .attr('y', (d, i) => y_axis_scale(Math.abs(data[d].open)))
        //     .text(function(d) {
        //         return (data[d].open);
        //     });
        //
        // newBlocks.append("text")
        //     .attr('x', (d, i) => i * (candleOCWidth + candleOCGap))
        //     .attr('y', (d, i) => y_axis_scale(Math.abs(data[d].close)))
        //     .text(function(d) {
        //         return (data[d].close);
        //     });
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.data !== this.props.data) {
            this.setState({graphData: this.props.data, loaded: false});
        }
        if(prevState.loaded !== this.state.loaded) {
            this.drawDataGraph();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    render() {
        return (
            <div className={Styles.dataGraphComponent} ref={(divElement) => {this.dataGraphComponent = divElement}}>
                {this.props.data ? (
                    <React.Fragment>
                        <div className={Styles.graphContainer}>
                            <svg
                                ref={node => this.node = node}
                                style={{"margin": "10px"}}
                                width={this.state.svgDimensions.width}
                                height={this.state.svgDimensions.height}
                            />
                        </div>
                    </React.Fragment>
                ) : (
                    <div className={Styles.dataNotFoundDiv}>
                        <div>No data found!</div><br/>
                        <div>Please upload data via <Link to="/data-upload">Upload Portal.</Link></div>
                    </div>
                )}
            </div>
        );
    }
}

DataGraph.propTypes = {
    selection: PropTypes.object,
    data: PropTypes.object
};

export default DataGraph;