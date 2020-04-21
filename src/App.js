import React, { Component } from 'react';
import {NavigationBar} from "./components/NavigationBar/NavBar";
import AwesomeChart from "./containers/AwesomeChart";
import PriceActionGraph from "./containers/PriceActionGraph";
import './App.scss';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Home from "./containers/Home";
import BarChart from "./components/PriceActionChart/BarChart";

class App extends Component {

    render() {
        return (
            <div className="App">
                <Router>
                    <div className="AppRouter">
                        <NavigationBar/>
                        {/* A <Switch> looks through its children <Route>s and
                         renders the first one that matches the current URL. */}
                        <Switch>
                            <Route path="/bar-chart">
                                <BarChart data={[Math.random(), Math.random(), Math.random(), Math.random(), Math.random()]} size={[500,500]} />
                            </Route>
                            <Route path="/awesome-chart">
                                <AwesomeChart />
                            </Route>
                            <Route path="/price-action-graph">
                                <PriceActionGraph />
                            </Route>
                            <Route path="/">
                                <Home />
                            </Route>
                        </Switch>
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;
