import React, { useState, useEffect } from "react";
import ChartistGraph from "react-chartist";
import Chartist from "chartist";
import ChartistTooltip from "chartist-plugin-tooltips-updated";
import Spinner from 'react-bootstrap/Spinner';


function CountryPlot(props) {
    const [pieData, setPieData] = useState({});

    function fetchCountryData(country) {
        const apiUrl = "/api/now/" + country + "?apikey=DH2VFXQ-C564NRA-GV6C6XB-W6YPCYQ";
        fetch(apiUrl).then(response => response.json()).then(data => {
            let confirmed = data.Confirmed;
            let deaths = data.Deaths;
            let recovered = data.Recovered;
            
            let plotData = {
                labels: ["Confirmed", "Recovered", "Deaths"],
                series: [
                    {
                        value: confirmed,
                        meta: "Confirmed Cases: "
                    }, {
                        value: recovered,
                        meta: "Recovered Cases: "
                    }, {
                        value: deaths,
                        meta: "Deaths: "
                    }
                ]
            }
            setPieData(plotData);
        });
    }

    useEffect(() => {
        fetchCountryData(props.country);
    }, []);

    const pieOptions = {
        donut: true,
        showLabel: true,
        plugins: [ChartistTooltip({appendToBody: true})]
    };

    const listener = [
        {
            "draw": function (data) {
                if(data.type === 'slice') {
                    // Get the total path length in order to use for dash array animation
                    var pathLength = data.element._node.getTotalLength();
                
                    // Set a dasharray that matches the path length as prerequisite to animate dashoffset
                    data.element.attr({
                        'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
                    });
                
                    // Create animation definition while also assigning an ID to the animation for later sync usage
                    var animationDefinition = {
                        'stroke-dashoffset': {
                            id: 'anim' + data.index,
                            dur: 1000,
                            from: -pathLength + 'px',
                            to:  '0px',
                            easing: Chartist.Svg.Easing.easeOutQuint,
                            // We need to use `fill: 'freeze'` otherwise our animation will fall back to initial (not visible)
                            fill: 'freeze'
                        }
                    };
                
                    // If this was not the first slice, we need to time the animation so that it uses the end sync event of the previous animation
                    if(data.index !== 0) {
                        animationDefinition['stroke-dashoffset'].begin = 'anim' + (data.index - 1) + '.end';
                    }
                
                    // We need to set an initial value before the animation starts as we are not in guided mode which would do that for us
                    data.element.attr({
                        'stroke-dashoffset': -pathLength + 'px'
                    });
                
                    // We can't use guided mode as the animations need to rely on setting begin manually
                    // See http://gionkunz.github.io/chartist-js/api-documentation.html#chartistsvg-function-animate
                    data.element.animate(animationDefinition, false);
                }
            }
        }
        , {
            "created": function() {
                if(window.__anim21278907124) {
                    clearTimeout(window.__anim21278907124);
                    window.__anim21278907124 = null;
                }
                window.__anim21278907124 = setTimeout(this.Chartist.update.bind(this.Chartist), 10000);
            }
        }
    ];
      
    return (
        pieData.series ? 
        <ChartistGraph className="ct-square" data={pieData} options={pieOptions} type={"Pie"} /> 
        : <Spinner animation="border"/>   
    );
}

export default CountryPlot;