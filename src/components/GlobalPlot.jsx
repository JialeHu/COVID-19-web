import React, { useState } from "react";
import ChartistGraph from "react-chartist";
import Chartist from "chartist";
import Spinner from "react-bootstrap/Spinner"


function GlobalPlot() {
    const [lineData, setLineData] = useState({});

    // const apiUrl = "https://35.188.65.80/covid19?apikey=DH2VFXQ-C564NRA-GV6C6XB-W6YPCYQ";
    const apiUrl = "/api?apikey=DH2VFXQ-C564NRA-GV6C6XB-W6YPCYQ";
    fetch(apiUrl).then(response => response.json()).then(data => {

        let dateLabel = [];
        let confirmed = [];
        let deaths = [];
        let recovered = [];
        for (var i = data.length-1; i >= 0; i--) {
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

    var lineOptions = {
        low: 0,
        showArea: true,
        showPoint: true,
        fullWidth: true
    };

    let listener = {
        "draw": function (data) {
            if (data.type === 'line' || data.type === 'area') {
                data.element.animate({
                    d: {
                        begin: 1000 * data.index,
                        dur: 1500,
                        from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                        to: data.path.clone().stringify(),
                        easing: Chartist.Svg.Easing.easeOutQuint
                    }
                });
            }
        }
    };

      
    return (
        Object.entries(lineData).length === 0 ? 
        <Spinner animation="border"/> :
        <ChartistGraph className="ct-perfect-fourth" data={lineData} options={lineOptions} type={'Line'} listener={listener}/>    
    );
}

export default GlobalPlot;