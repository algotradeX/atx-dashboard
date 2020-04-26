const axios = require('axios');
const moment = require('moment');

export async function fetchGraphData(symbol, series, granularity) {
    let data;
    await axios({
        method: "POST",
        url: "http://localhost:8420/api/v1/atx-data-processor/dashboard/fetchGraphData",
        data: {
            "symbol": symbol,
            "series": series,
            "interval": granularity,
            "date": moment().format("DD-MMM-YYYY 00:00:00"),
            "page": 1,
            "ipp": 200,
            "indicators": []
        }
    })
    .then(function (response) {
        // handle success
        console.log(response && response.data);
        data = response && response.data && response.data.dashboard_graph_data;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .then(function () {
        // always executed
    });
    return data;
}
