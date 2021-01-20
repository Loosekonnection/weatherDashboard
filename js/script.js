// Localstorage Array
var weatherData = JSON.parse(localStorage.getItem("data")) || [];

// store data in local storage
function storeData(response) {

    weatherData.push(response);
    localStorage.setItem("data", JSON.stringify(weatherData));

    // createHTML();
}

// Update HTML with data from local storage
function createHTML() {






}

// .on("click") event for the 'Search for a City' Button that obtains
// the latitude and longitude
$("#run-search").on("click", function (event) {
    event.preventDefault();

    var searchedCity = $("#search-term").val().toLowerCase();
    var apiKey = "bd51b2fbd76019c25a3a15ee00180da9";
    var queryLonLatURL = `http://api.openweathermap.org/geo/1.0/direct?q=${searchedCity},gb&appid=${apiKey}`;

    $.ajax({
        url: queryLonLatURL,
        method: "GET"
    }).then(runWeatherCall)   
});

// Obtain current and daily weather forecast details
function runWeatherCall(response) {

    var lon = response[0].lon;
    var lat = response[0].lat;
    var apiKey = "bd51b2fbd76019c25a3a15ee00180da9";
    var queryOneCallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}`;

    $.ajax({
        url: queryOneCallURL,
        method: "GET"
    }).then(storeData)
}

//  .on("click") function for the 'Clear Results' button
$("#clear-all").on("click", clear);

// Function to empty out the articles and clear localstorage
function clear() {
    
    $("#search-results").empty();
    localStorage.clear();
    window.location.reload();
}













// function weekAheadURL() {
//     // queryURL is the url we'll use to query the API
//     var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";

//     // Begin building an object to contain our API call's query parameters
//     // Set the API key
//     var queryParams = { "api-key": "R1a31F4tBjCUaM2ho8GtIFsrSdtXt30M" };

//     // Grab text the user typed into the search input, add to the queryParams object
//     queryParams.q = $("#search-term")
//         .val()
//         .trim();

//     // If the user provides a startYear, include it in the queryParams object
//     var startYear = $("#start-year")
//         .val()
//         .trim();

//     if (parseInt(startYear)) {
//         queryParams.begin_date = startYear + "0101";
//     }

//     // If the user provides an endYear, include it in the queryParams object
//     var endYear = $("#end-year")
//         .val()
//         .trim();

//     if (parseInt(endYear)) {
//         queryParams.end_date = endYear + "0101";
//     }

//     // Logging the URL so we have access to it for troubleshooting
//     console.log("---------------\nURL: " + queryURL + "\n---------------");
//     console.log(queryURL + $.param(queryParams));
//     return queryURL + $.param(queryParams);
// }