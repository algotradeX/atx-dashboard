const axios = require('axios');

export function fetchGraphData(symbol, series, granularity) {
    return axios.get("http://localhost:8420/api/v1/dashboard/fetchGraphData")
        .then(function (response) {
            // handle success
            console.log(response);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
}
