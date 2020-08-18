

let apiUrl = "http://http://35.188.65.80:80/covid19?apikey=B9ZPQ9E-Q8ZMGPQ-M0PWFW8-K6ZV8M7";

// fetch(apiUrl).then(res => res.json()).then(data => console.log(data));

let data = [
    {
        "_id": "2020-08-14T04:00:00.000Z",
        "Global_Confirmed": 19825405,
        "Global_Deaths": 699346,
        "Global_Recoverd": 13097440
    },
    {
        "_id": "2020-08-13T04:00:00.000Z",
        "Global_Confirmed": 19738251,
        "Global_Deaths": 693186,
        "Global_Recoverd": 12814832
    },
    {
        "_id": "2020-08-12T04:00:00.000Z",
        "Global_Confirmed": 20630768,
        "Global_Deaths": 749588,
        "Global_Recoverd": 12827682
    },
    {
        "_id": "2020-08-11T04:00:00.000Z",
        "Global_Confirmed": 19762298,
        "Global_Deaths": 731718,
        "Global_Recoverd": 12523980
    },
    {
        "_id": "2020-08-10T04:00:00.000Z",
        "Global_Confirmed": 6398085,
        "Global_Deaths": 196257,
        "Global_Recoverd": 946971
    }
];


const date = new Date("2020-08-10T04:00:00.000Z");
 
// const [{ value: month },,{ value: day },,{ value: year }] = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' }).format(date);
const a = new Intl.DateTimeFormat('en', {month: 'short', day: '2-digit'}).format(date);
console.log(a);
// console.log(`${month}-${day}`);
