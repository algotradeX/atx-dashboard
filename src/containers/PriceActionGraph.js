import React from 'react';
import Styles from "./PriceActionGraph.module.scss";
import DataSelector from "../components/PriceActionGraph/DataSelector";
import DataGraph from "../components/PriceActionGraph/DataGraph";

class PriceActionGraph extends React.Component {
    render() {
        return (
            <div className={Styles.PriceActionGraphContainer}>
                <DataSelector />
                <DataGraph />
            </div>
        );
    }
}

export default PriceActionGraph;