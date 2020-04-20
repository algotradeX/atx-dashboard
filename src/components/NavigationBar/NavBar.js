import React, {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';

export function NavigationBar() {
    const [selected, setSelected] = useState(0);
    const location = useLocation();
    const pathname = location.pathname;

    /*
    "pathname" : {
        "title": "String",
        "default": true/false,
        "scrollable": true/false
    }
     */
    const navigationMap = {
        "/": {
            "title": "Home",
            "default": true,
            "scrollable": false
        },
        "/bar-chart": {
            "title": "Sample bar chart",
            "default": false,
            "scrollable": false
        },
        "/awesome-chart": {
            "title": "Price Action Chart",
            "default": false,
            "scrollable": false
        },
        "/price-action-graph": {
            "title": "Price Action Graph",
            "default": false,
            "scrollable": false
        }
    };

    return (
        <nav className="navigation-bar">
            {Object.keys(navigationMap).map((pathname, index) => (
                <div className={ selected === index ? "navigation-div selected-path" : "navigation-div"} key={pathname}>
                    <Link to={pathname} onClick={(index) => setSelected(index)}>{navigationMap[pathname].title}</Link>
                </div>
            ))}
        </nav>
    );
}