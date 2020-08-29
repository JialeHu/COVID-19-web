
const mongoose = require('mongoose');
const CronJob = require('cron').CronJob;

const updateDatabase = require("./updateDatabase.js");

function apiServer(app, User) {
    const dataSchema = {
        Date: Date,
        Province_State: String,
        Country_Region: String,
        Last_Update: String,
        Lat: { type: Number, required: false },
        Long_: { type: Number, required: false },
        Confirmed: Number,
        Deaths: Number,
        Recovered: Number,
        Active: Number,
        Combined_Key: String,
        Incidence_Rate: Number,
        "Case-Fatality_Ratio": Number
    };
    const Data = mongoose.model("Data", dataSchema);

    // -----------------Update Database Multiple Times a Day--------------
    const job = new CronJob('0 0 0,1,3,5 * * 0-6', function() {
            // Runs every day at 01:00:00 AM and so on.
            console.log("Start Updating Database");
            updateDatabase(Data);
        }, function() {
            // This function is executed when job.stop()
            console.log("Done updating database");
        },
        true, /* Start the job right now */
        "America/New_York" /* Time zone of this job. */
    );
    // job.start();
    updateDatabase(Data); // Instant Update

    // -----------------------------Utility Function------------------------
    function getLatestDate(callback) {
        Data.findOne().sort({Date: -1}).exec(function(err, data) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, data.Date);
            }
        });
    }

    // -----------------------------API Requests----------------------------

    // Latest Snapshot (Query: apiKey, from(optional), to(optional))
    app.get("/api", (req, res) => {
        let apiKey = req.query.apikey;
        let from = req.query.from;
        let to = req.query.to;
        validateApiKey(apiKey, (user) => {
            if (!user) {
                res.sendStatus(403);
                return;
            }
            
            if (getDate(from) && getDate(to)) {
                let end = getDate(to);
                let start = getDate(from);
                Data.aggregate([
                    {
                        $match: {
                            Date: {$gt: start, $lte: end}
                        }
                    }, {
                        $group: {
                            _id: "$Date",
                            Global_Confirmed: {
                                $sum: "$Confirmed"
                            },
                            Global_Deaths: {
                                $sum: "$Deaths"
                            },
                            Global_Recoverd: {
                                $sum: "$Recovered"
                            }
                        }
                    }, {
                        $sort: { _id: -1 }
                    }
                ], (err, results) => {
                    if (err) {
                        console.error(err);
                        res.send(500);
                    } else {
                        res.send(results);
                    }
                });
            } else {
                Data.aggregate([
                    {
                        $group: {
                            _id: "$Date",
                            Global_Confirmed: {
                                $sum: "$Confirmed"
                            },
                            Global_Deaths: {
                                $sum: "$Deaths"
                            },
                            Global_Recoverd: {
                                $sum: "$Recovered"
                            }
                        }
                    }, {
                        $sort: { _id: -1 }
                    }
                ], (err, results) => {
                    if (err) {
                        console.error(err);
                        res.send(500);
                    } else {
                        res.send(results);
                    }
                });
            }
        });
    });
        
    // List of countries and regions
    app.get("/api/country_region_list", (req, res) => {
        let apiKey = req.query.apikey;
        validateApiKey(apiKey, (user) => {
            if (!user) {
                res.sendStatus(403);
                return;
            }
            
            Data.aggregate([
                { 
                    $match: {
                        "Country_Region": { 
                            "$exists": true, 
                            "$ne": null 
                        }
                    }    
                }, {
                    $group: {_id: "$Country_Region"}
                }, {
                    $sort: { _id: 1 }
                }
            ], (err, results) => {
                if (err) {
                    console.error(err);
                    res.send(500);
                } else {
                    res.send(results);
                }
            });
        });
    });

    // GET raw data by time
    app.get("/api/raw", (req, res) => {
        let apikey = req.query.apikey;
        let from = req.query.from;
        let to = req.query.to;

        if (!apikey) {
            res.sendStatus(403);
            return;
        }
        
    });

    // GET latest country data
    app.get("/api/now/:country_region", (req, res) => {
        let apiKey = req.query.apikey;
        let country = req.params.country_region;

        validateApiKey(apiKey, (user) => {
            if (!user) return res.sendStatus(403);

            getLatestDate((err, date) => {
                if (err) {
                    console.error(err);
                    res.send(500);
                } else {
                    Data.aggregate([
                        {
                            $match: {
                                Country_Region: country,
                                Date: date
                            }
                        }, {
                            $group: {
                                _id: "Country_Region",
                                Confirmed: {
                                    $sum: "$Confirmed"
                                },
                                Deaths: {
                                    $sum: "$Deaths"
                                },
                                Recovered: {
                                    $sum: "$Recovered"
                                }
                            }
                        }
                    ], (err, results) => {
                        if (err) {
                            console.error(err);
                            res.sendStatus(500);
                        } else {
                            res.send(results[0]);
                        }
                    });
                }
            });
        });
    });

    // GET country data by time
    app.get("/api/:country_region", (req, res) => {
        let apiKey = req.query.apikey;
        let from = req.query.from;
        let to = req.query.to;
        let country = req.params.country_region;
        
        validateApiKey(apiKey, (user) => {
            if (!user) {
                res.sendStatus(403);
                return;
            }

            // const aggregate = Data.aggregate([
            //     {
            //         $match: {
            //             Country_Region: country
            //         }
            //     }
            // ]);

            if (getDate(from) && getDate(to)) {
                let end = getDate(to);
                let start = getDate(from);

                Data.aggregate([
                    {
                        $match: {
                            Country_Region: country,
                            Date: {$gt: start, $lte: end}
                        }
                    }, {
                        $group: {
                            _id: "$Date",
                            Data_Country_Region: {
                                $push: {
                                    Province_State: "$Province_State",
                                    Last_Update: "$Last_Update",
                                    Confirmed: "$Confirmed",
                                    Deaths: "$Deaths",
                                    Recovered: "$Recovered"
                                }
                            }
                        }
                    }
                ], (err, results) => {
                    if (err) {
                        console.error(err);
                        res.send(500);
                    } else {
                        res.send(results);
                    }
                }).allowDiskUse(true);
            } else {
                Data.aggregate([
                    {
                        $match: {
                            Country_Region: country,
                        }
                    }, {
                        $group: {
                            _id: "$Date",
                            Data_Country_Region: {
                                $push: {
                                    Province_State: "$Province_State",
                                    Last_Update: "$Last_Update",
                                    Confirmed: "$Confirmed",
                                    Deaths: "$Deaths",
                                    Recovered: "$Recovered"
                                }
                            }
                        }
                    }
                ], (err, results) => {
                    if (err) {
                        console.error(err);
                        res.send(500);
                    } else {
                        res.send(results);
                    }
                }).allowDiskUse(true);
            }
        });
    });

    app.get("/api/test", (req, res) => {
        res.send(req.query);
    }); 

    function validateApiKey(apiKey, callback) {
        if (!apiKey) {
            callback(null);
        } else {
            User.findOneAndUpdate({apiKey: apiKey}, {$inc: {"count": 1}}, {new: true}, (err, user) => {
                if (err) {
                    console.error(err);
                    callback(null);
                } else {
                    callback(user);
                }
            });
        }
    }
}
module.exports = apiServer;


function getDateOrNow(dateStr) {
    try {
        let date = new Date(dateStr);
        return date;
    } catch (err) {
        return new Date();
    }
}

function getDate(dateStr) {
    if (!dateStr) {
        return null;
    }
    try {
        let date = new Date(dateStr);
        return date;
    } catch (err) {
        return null;
    }
}