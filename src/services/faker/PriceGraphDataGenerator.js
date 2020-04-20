import moment from "moment";

function randomIntFromInterval(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

export function generatePriceGraphDataForThisDay(date, symbol, interval) {
    let base = randomIntFromInterval(10, 200);
    let newData = {
        "high": base + randomIntFromInterval(25, 32),
        "open": base + randomIntFromInterval(15, 25),
        "close": base + randomIntFromInterval(15, 25),
        "low": base + randomIntFromInterval(6, 15),
        "volume": randomIntFromInterval(50, 200),
        "date": date,
        "symbol": symbol,
        "interval": interval,
    };
    newData["avg"] = (newData["open"] + newData["close"])/2;
    console.log("generatePriceGraphDataForThisDay : ", newData);
    return newData;
}

export function getInitialData(startDate="01-Mar-2020", days=10, symbol="HDFC", interval=1440) {
    let data = {};
    let date = moment(startDate, 'DD-MMM-YYYY');
    let lastDate = date.format('DD-MMM-YYYY');
    for(let i = 0; i < days; i++) {
        lastDate = date.format('DD-MMM-YYYY');
        data[date.format('DD-MMM-YYYY')] = generatePriceGraphDataForThisDay(date.format('DD-MMM-YYYY'), symbol, interval);
        date.add( 1, "days");
    }
    return {data: data, lastDate: lastDate};
}