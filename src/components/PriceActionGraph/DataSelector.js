import React from 'react';
import PropTypes from 'prop-types';
import Styles from './DataSelector.module.scss';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import ArchiveIcon from '@material-ui/icons/Archive';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import Select from '@material-ui/core/Select';

class DataSelector extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            symbol: '',
            series: '',
            granularity: '',
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

    fetchData = () => {
        if(this.state.symbol !== "" && this.state.series !== "" && this.state.granularity !== "") {
            this.props.fetchData && this.props.fetchData();
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(!this.state.saved) {
            this.props.saveSelectedOptions && this.props.saveSelectedOptions({
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
                        <option aria-label="None" value="" />
                        {Object.keys(this.props.availableOptions && this.props.availableOptions.symbols).map((sym) =>
                            (<option value={sym} key={sym}>
                                {this.props.availableOptions.symbols[sym].display}
                            </option>)
                        )}
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
                        <option aria-label="None" value="" />
                        {this.props.availableOptions &&  this.props.availableOptions.symbols &&
                            this.props.availableOptions.symbols[this.state.symbol] &&
                            this.props.availableOptions.symbols[this.state.symbol].series.map(
                            (series) => <option value={series} key={series}>{series}</option>
                        )}
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
                        <option aria-label="None" value="" />
                        {Object.keys(this.props.availableOptions && this.props.availableOptions.granularity).map((g) =>
                            (<option value={g} key={g}>
                                {this.props.availableOptions.granularity[g]}
                            </option>)
                        )}
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    color={"primary"}
                    className={Styles.dsButton}
                    startIcon={<ArchiveIcon/>}
                    onClick={this.fetchData}
                    disabled={(!(this.state.symbol !== "" && this.state.series !== "" && this.state.granularity !== ""))
                    }
                >
                    Fetch
                </Button>

                <Button
                    variant="outlined"
                    color="secondary"
                    className={Styles.dsButton}
                    startIcon={<BookmarkIcon/>}
                >
                    Bookmarked
                </Button>

                <Button
                    variant="outlined"
                    color="secondary"
                    className={Styles.dsButton}
                    startIcon={<BookmarkBorderIcon/>}
                >
                    Bookmark
                </Button>
            </div>
        );
    }
}

DataSelector.propTypes = {
    availableOptions: PropTypes.object,
    saveSelectedOptions: PropTypes.func,
    fetchData: PropTypes.func
};

export default DataSelector;