
const APIs = [
    {
        title: "Get Global Cases",
        description: "Global cases (Confirmed, Recovered, Deaths) since 2020-01-22, or in date range specified by <from> and <to>",
        method: "GET",
        url: "https://covid19-d.herokuapp.com/api?apikey=<YOUR-API-KEY>&from=<YYYY-MM-DD>&to=<YYYY-MM-DD>"
    }, {
        title: "Get List of Countries and Regions",
        description: "A list of supported countries and regions",
        method: "GET",
        url: "https://covid19-d.herokuapp.com/api/country_region_list?apikey=<YOUR-API-KEY>"
    }, {
        title: "Get Current Cases by Country and Region",
        description: "Get latest cases in specified country or region (Confirmed, Recovered, Deaths)",
        method: "GET",
        url: "https://covid19-d.herokuapp.com/api/now/<COUNTRY-OR-REGION>?apikey=<YOUR-API-KEY>"
    }, {
        title: "Get Cases by Country and Region",
        description: "Cases in specified country or region (Confirmed, Recovered, Deaths) since 2020-01-22, or in date range specified by <from> and <to>",
        method: "GET",
        url: "https://covid19-d.herokuapp.com/api/<COUNTRY-OR-REGION>?apikey=<YOUR-API-KEY>&from=<YYYY-MM-DD>&to=<YYYY-MM-DD>"
    }
];

export default APIs;