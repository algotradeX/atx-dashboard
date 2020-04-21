import React from 'react';
import Styles from "./PriceActionGraph.module.scss";
import DataSelector from "../components/PriceActionGraph/DataSelector";
import DataGraph from "../components/PriceActionGraph/DataGraph";

class PriceActionGraph extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selectedData: null
        };
    }

    saveSelectedData(s) {
        this.setState({selectedData: s});
    }

    render() {
        return (
            <div className={Styles.PriceActionGraphContainer}>
                <DataSelector saveSelectedData={s => this.saveSelectedData(s)}/>
                <DataGraph selection={this.state.selectedData}/>
            </div>
        );
    }
}

export default PriceActionGraph;