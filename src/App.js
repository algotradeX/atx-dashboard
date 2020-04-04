import React, { Component } from 'react';
import AwesomeChart from "./containers/AwesomeChart";
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Home from "./containers/Home";
import BarChart from "./components/PriceActionChart/BarChart";

class App extends Component {

    render() {
        return (
            <div className="App">
                <Router>
                    <div>
                        <nav>
                            <ul>
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                                <li>
                                    <Link to="/bar-chart">Sample bar chart</Link>
                                </li>
                                <li>
                                    <Link to="/awesome-chart">Price Action Chart</Link>
                                </li>
                            </ul>
                        </nav>

                        {/* A <Switch> looks through its children <Route>s and
                         renders the first one that matches the current URL. */}
                        <Switch>
                            <Route path="/bar-chart">
                                <BarChart data={[Math.random(), Math.random(), Math.random(), Math.random(), Math.random()]} size={[500,500]} />
                            </Route>
                            <Route path="/awesome-chart">
                                <AwesomeChart/>
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
