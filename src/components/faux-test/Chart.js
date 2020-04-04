import React from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';


let createHook = function createHook(comp, elem, statename) {
    let elems = new Map(), interval = undefined;
    let updateState = function updateState() {
        comp.setState({[statename]: elem.toReact()});
    };
    setTimeout(updateState);
    comp.isAnimating = function () {
        return !!interval;
    };
    return function (transition) {
        transition.each(function (e) {
            elems.set(e, (elems.get(e) || new Set()).add(transition.id));
            interval = interval || setInterval(updateState, 16);
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

class Chart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chart: null, look: 'stacked'
        };
    }

    componentDidMount() {
        const faux = ReactFauxDOM.createElement("div");

        let hook = createHook(this, faux, "chart");

        let margin = { top: 40, right: 10, bottom: 20, left: 10 },
            width = 600 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        let svg = d3.select(faux).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // rect.transition().delay(function (d, i) {
        //     return i * 10;
        // }).attr("y", function (d) {
        //     return y(d.y0 + d.y);
        // }).attr("height", function (d) {
        //     return y(d.y0) - y(d.y0 + d.y);
        // }).duration(200).call(hook);

        // svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

        svg.attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    }

    render() {
        return (
            <div>
                <button>Toggle layout</button>
                {this.state.chart}
            </div>
        );
    }
}

// var Chart = _react2.default.createClass({
//     displayName: 'Chart',
//
//     getInitialState: function getInitialState() {
//         return { chart: _react2.default.createElement('span', null), look: 'stacked' };
//     },
//     componentDidMount: function componentDidMount() {
//
//         var faux = new _reactFauxDom2.default.Element('div');
//
//         var hook = createHook(this, faux, "chart");
//
//         function bumpLayer(n, o) {
//
//             function bump(a) {
//                 var x = 1 / (.1 + Math.random()),
//                     y = 2 * Math.random() - .5,
//                     z = 10 / (.1 + Math.random());
//                 for (var i = 0; i < n; i++) {
//                     var w = (i / n - y) * z;
//                     a[i] += x * Math.exp(-w * w);
//                 }
//             }
//
//             var a = [],
//                 i;
//             for (i = 0; i < n; ++i) {
//                 a[i] = o + o * Math.random();
//             }for (i = 0; i < 5; ++i) {
//                 bump(a);
//             }return a.map(function (d, i) {
//                 return { x: i, y: Math.max(0, d) };
//             });
//         }
//
//         var n = 4,
//             // number of layers
//             m = 36,
//             // number of samples per layer
//             stack = _d2.default.layout.stack(),
//             layers = stack(_d2.default.range(n).map(function () {
//                 return bumpLayer(m, .1);
//             })),
//             yGroupMax = _d2.default.max(layers, function (layer) {
//                 return _d2.default.max(layer, function (d) {
//                     return d.y;
//                 });
//             }),
//             yStackMax = _d2.default.max(layers, function (layer) {
//                 return _d2.default.max(layer, function (d) {
//                     return d.y0 + d.y;
//                 });
//             });
//
//         var margin = { top: 40, right: 10, bottom: 20, left: 10 },
//             width = 600 - margin.left - margin.right,
//             height = 400 - margin.top - margin.bottom;
//
//         var x = _d2.default.scale.ordinal().domain(_d2.default.range(m)).rangeRoundBands([0, width], .08);
//
//         var y = _d2.default.scale.linear().domain([0, yStackMax]).range([height, 0]);
//
//         var color = _d2.default.scale.linear().domain([0, n - 1]).range(["#aad", "#556"]);
//
//         var xAxis = _d2.default.svg.axis().scale(x).tickSize(0).tickPadding(6).orient("bottom");
//
//         var svg = _d2.default.select(faux).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//         var layer = svg.selectAll(".layer").data(layers).enter().append("g").attr("class", "layer").style("fill", function (d, i) {
//             return color(i);
//         });
//
//         var rect = layer.selectAll("rect").data(function (d) {
//             return d;
//         }).enter().append("rect").attr("x", function (d) {
//             return x(d.x);
//         }).attr("y", height).attr("width", x.rangeBand()).attr("height", 0);
//
//         rect.transition().delay(function (d, i) {
//             return i * 10;
//         }).attr("y", function (d) {
//             return y(d.y0 + d.y);
//         }).attr("height", function (d) {
//             return y(d.y0) - y(d.y0 + d.y);
//         }).duration(200).call(hook);
//
//         this.transitionGrouped = function () {
//             y.domain([0, yGroupMax]);
//
//             rect.transition().duration(500).delay(function (d, i) {
//                 return i * 10;
//             }).attr("x", function (d, i, j) {
//                 return x(d.x) + x.rangeBand() / n * j;
//             }).attr("width", x.rangeBand() / n).call(hook).transition().attr("y", function (d) {
//                 return y(d.y);
//             }).attr("height", function (d) {
//                 return height - y(d.y);
//             }).call(hook);
//         };
//
//         this.transitionStacked = function () {
//             y.domain([0, yStackMax]);
//
//             rect.transition().duration(500).delay(function (d, i) {
//                 return i * 10;
//             }).attr("y", function (d) {
//                 return y(d.y0 + d.y);
//             }).attr("height", function (d) {
//                 return y(d.y0) - y(d.y0 + d.y);
//             }).call(hook).transition().attr("x", function (d) {
//                 return x(d.x);
//             }).attr("width", x.rangeBand()).call(hook);
//         };
//
//         svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
//     },
//     toggle: function toggle() {
//         if (!this.isAnimating()) {
//             if (this.state.look === 'stacked') {
//                 this.setState({ look: 'grouped' });
//                 this.transitionGrouped();
//             } else {
//                 this.setState({ look: 'stacked' });
//                 this.transitionStacked();
//             }
//         }
//     },
//     render: function render() {
//         return _react2.default.createElement(
//             'div',
//             null,
//             _react2.default.createElement(
//                 'button',
//                 { onClick: this.toggle },
//                 'toggle layout'
//             ),
//             this.state.chart
//         );
//     }
// });
//
// _reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById("container"));
export default Chart;