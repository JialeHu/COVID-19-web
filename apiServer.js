
const mongoose = require('mongoose');

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

    // GET all data by time
    app.get("/api/all", (req, res) => {
        let apikey = req.query.apikey;
        if (!apikey) {
            res.sendStatus(403);
            return;
        }
        try {
            let from = new Date(req.query.from);
            let to = new Date(req.query.to);

        } catch (err) {
            res.send(err);
        }
    });

    // GET latest country data
    app.get("/api/now/:country_region", (req, res) => {
        let apiKey = req.query.apikey;
        let country = req.params.country_region;

        validateApiKey(apiKey, (user) => {
            if (!user) {
                res.sendStatus(403);
                return;
            }

            
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
            User.findOne({apiKey: apiKey}, (err, data) => {
                if (err) {
                    console.error(err);
                } else {
                    callback(data);
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