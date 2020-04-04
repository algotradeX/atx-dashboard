import React from 'react';
import * as d3 from 'd3';

const Graph = props => {
    const data = {
        dataset: [
            {x: 0, y: 0},
            {x: 1, y: 1},
            {x: 2, y: 1},
            {x: 3, y: 2},
            {x: 4, y: 3},
            {x: 5, y: 5},
            {x: 6, y: 8},
            {x: 7, y: 13},
            {x: 8, y: 21},
            {x: 9, y: 34},
            {x: 10, y: 55},
        ],
        width: 500,
        height: 500,
        margin: 20,
    };

    const xScale = d3
        .scaleLinear()
        .domain(d3.extent(data.dataset, d => d.x))
        .range([data.margin, data.width]);
    const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data.dataset, d => d.y)])
        .range([data.height, data.margin]);
    const line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveCatmullRom.alpha(0.7));
    return (<div>
        <svg height={data.height} width={data.width}>
            <line className="axis" x1={data.margin} x2={data.width} y1={data.height} y2={data.height}/>
            <line className="axis" x1={data.margin} x2={data.margin} y1={data.margin} y2={data.height}/>
        </svg>
    </div>);
};

export default Graph;
