import React, { useState } from "react";
import ChartistGraph from "react-chartist";
import Chartist from "chartist";
import Legend from "chartist-plugin-legend";
import Spinner from "react-bootstrap/Spinner"


function CountryPlot() {
    const [lineData, setLineData] = useState({});

    function fetchCountryData(country) {
        
        const apiUrl = "/api/" + country + "?apikey=DH2VFXQ-C564NRA-GV6C6XB-W6YPCYQ";
        fetch(apiUrl).then(response => response.json()).then(data => {
            let dateLabel = [];
            let confirmed = [];
            let deaths = [];
            let recovered = [];
            for (var i = data.length-1; i >= 0; i--) {
                if (i % 10 !== 0) continue;

                let date = new Date(data[i]._id);
                let dateStr = new Intl.DateTimeFormat('en', {month: 'short', day: '2-digit'}).format(date);
                dateLabel.push(dateStr);
                confirmed.push(data[i].Global_Confirmed);
                deaths.push(data[i].Global_Deaths);
                recovered.push(data[i].Global_Recoverd);
            }
            let plotData = {
                labels: dateLabel,
                series: [confirmed, recovered, deaths]
            }
            setLineData(plotData);
        });
    }

    if (!lineData.labels) {
        fetchGlobalData();
    }

    const lineOptions = {
        low: 0,
        showArea: true,
        showPoint: true,
        fullWidth: true,
        axisX: {offset: 100},
        axisY: {offset: 100},
        chartPadding: {top: 40, right: 10, bottom: 40, left: 10},

        plugins: [new Legend({legendNames: ["Confirmed", "Recoverd", "Deaths"]})]
    };

    const listener = {
        "draw": function (data) {
            if (data.type === 'line' || data.type === 'area') {
                data.element.animate({
                    d: {
                        begin: 700 * data.index,
                        dur: 1000,
                        from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()+15).stringify(),
                        to: data.path.clone().stringify(),
                        easing: Chartist.Svg.Easing.easeOutQuint
                    }
                });
            }
        }
    };
      
    return (
        lineData.labels ? 
        <ChartistGraph className="ct-perfect-fourth" data={lineData} options={lineOptions} type={'Line'} listener={listener}/> 
        : <Spinner animation="border"/>   
    );
}

export default CountryPlot;