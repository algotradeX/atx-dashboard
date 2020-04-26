import React from 'react';
import {fetchGraphData} from "../services/AtxDataProcessor";
import Styles from "./PriceActionGraph.module.scss";
import DataSelector from "../components/PriceActionGraph/DataSelector";
import DataGraph from "../components/PriceActionGraph/DataGraph";

class PriceActionGraph extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            options: {
                symbols: {
                    HDFC: {
                        display: "HDFC",
                        series: ["EQ", "W2"]
                    },
                    ALCHEM: {
                        display: "ALCHEM",
                        series: ["BE"]
                    }
                },
                granularity: {
                    "1440": "1 day",
                    "5": "5 min",
                    "1": "1 min"
                }
            },
            selectedOptions: null,
            graphData: null
        };
    }

    saveSelectedOptions(s) {
        this.setState({selectedOptions: s});
    }

    async fetchDataGivenOptions() {
        console.log("fetchDataGivenOptions");
        const options = this.state.selectedOptions;
        const graphData = await fetchGraphData(options.symbol, options.series, options.granularity);
        this.setState({graphData: graphData});
    }

    render() {
        return (
            <div className={Styles.PriceActionGraphContainer}>
                <DataSelector
                    availableOptions={this.state.options}
                    saveSelectedOptions={s => this.saveSelectedOptions(s)}
                    fetchData={async () => await this.fetchDataGivenOptions()}
                />
                <DataGraph
                    selection={this.state.selectedOptions}
                    data={this.state.graphData}
                />
            </div>
        );
    }
}

export default PriceActionGraph;