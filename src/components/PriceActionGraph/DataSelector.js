import React from 'react';
import Styles from './DataSelector.module.scss';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

class DataSelector extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            symbol: 'HDFC',
            series: 'ES',
            granularity: '1080',
            saved: true
        };
    }

    handleChange = (event) => {
        const name = event.target.name;
        this.setState({
            ...this.state,
            [name]: event.target.value,
            saved: false
        });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(!this.state.saved) {
            this.props.saveSelectedData && this.props.saveSelectedData({
                symbol: this.state.symbol,
                series: this.state.series,
                granularity: this.state.granularity
            });
            this.setState({saved: true});
        }
    }

    render() {
        return (
            <div className={Styles.dataSelectorComponent}>
                <FormControl variant="outlined" className={Styles.formControl}>
                    <InputLabel htmlFor="outlined-age-native-simple">Symbol</InputLabel>
                    <Select
                        native
                        value={this.state.symbol}
                        onChange={(e) => this.handleChange(e)}
                        label="Symbol"
                        inputProps={{
                            name: 'symbol',
                            id: 'outlined-age-native-simple',
                        }}
                    >
                        <option value={"HDFC"}>HDFC</option>
                        <option value={"Bajaj"}>Bajaj</option>
                        <option value={"Alchem"}>Alchem</option>
                    </Select>
                </FormControl>

                <FormControl variant="outlined" className={Styles.formControl}>
                    <InputLabel htmlFor="outlined-age-native-simple">Series</InputLabel>
                    <Select
                        native
                        value={this.state.series}
                        onChange={(e) => this.handleChange(e)}
                        label="Series"
                        inputProps={{
                            name: 'series',
                            id: 'outlined-age-native-simple',
                        }}
                    >
                        <option value={"EL"}>EL</option>
                        <option value={"ES"}>ES</option>
                    </Select>
                </FormControl>

                <FormControl variant="outlined" className={Styles.formControl}>
                    <InputLabel htmlFor="outlined-age-native-simple">Granularity</InputLabel>
                    <Select
                        native
                        value={this.state.granularity}
                        onChange={(e) => this.handleChange(e)}
                        label="Granularity"
                        inputProps={{
                            name: 'granularity',
                            id: 'outlined-age-native-simple',
                        }}
                    >
                        <option value={"1080"}>1 Day</option>
                        <option value={"300"}>5 Min</option>
                        <option value={"60"}>1 Min</option>
                    </Select>
                </FormControl>
            </div>
        );
    }
}

export default DataSelector;