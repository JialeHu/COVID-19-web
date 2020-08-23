
const https = require("https");
const csv = require("jquery-csv");

function getDateString(dateObj) {
    let month = (dateObj.getMonth() + 1).toString();
    let date = dateObj.getDate().toString();
    let year = dateObj.getFullYear().toString();
    if (month.length < 2) {
        month = "0" + month;
    }
    if (date.length < 2) {
        date = "0" + date;
    }
    return [month, date, year].join("-");
}

function requestData(dateStr, callback) {
    var options = {
        host: "raw.githubusercontent.com",
        path: "/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/" + dateStr + ".csv",
        timeout: 10000
    }
    var request = https.request(options, function (res) {
        if (res.statusCode !== 200) {
            callback(res.statusCode, null);
        }
        var data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            callback(null, data);
        });
    });
    request.on('error', (e) => {
        console.log("error: " + e.message);
        callback(e.message, null);
    });
    request.on('timeout', () => {
        request.abort();
        callback("Timeout", null);
    });
    request.end();
}

function fetchAndInsert(startDate, Data) {
    for (var d = startDate; d <= new Date(); d.setDate(d.getDate() + 1)) {
        let dateStr = getDateString(d);
        requestData(dateStr, (err, data) => {
            if (err) {
                console.error(dateStr, err);
            } else {
                let dataObjs = csv.toObjects(data);
                dataObjs.forEach((dataObj) => {
                    dataObj.Date = new Date(dateStr).toISOString();
                });

                Data.insertMany(dataObjs, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(dateStr, "Saved");
                    }
                });
            }
        });
    }
}

function getLatestDate(Data, callback) {
    Data.findOne().sort({Date: -1}).exec(function(err, data) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, data.Date);
        }
    });
}

function updateDatabase(Data) {
    getLatestDate(Data, (err, date) => {
        if (err) {
            console.log(err);
        } else {
            date.setDate(date.getDate() + 1);
            fetchAndInsert(date, Data);
        }
    });
}

module.exports = updateDatabase;
