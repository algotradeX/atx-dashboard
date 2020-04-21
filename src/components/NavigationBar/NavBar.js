import React, {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import classnames from 'classnames';
import Styles from './NavBar.module.scss';

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
        <nav className={Styles.navigationBar}>
            {Object.keys(navigationMap).map((pathname, index) => (
                <div className={
                    classnames({
                        [Styles.navigationDiv]: true,
                        [Styles.selectedPath]: selected === index
                    })
                } key={pathname}>
                    <Link to={pathname} onClick={() => setSelected(index)}>{navigationMap[pathname].title}</Link>
                </div>
            ))}
        </nav>
    );
}