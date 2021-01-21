// Luxon Date and Time
var dateTime = luxon.DateTime;
var today = dateTime.local();
var currentDate = today.toLocaleString(dateTime.DATE_SHORT)
var dayOneDate = luxon.DateTime.local().plus({days: 1}).toISODate();
var dayTwoDate = luxon.DateTime.local().plus({days: 2}).toISODate();
var dayThreeDate = luxon.DateTime.local().plus({days: 3}).toISODate();
var dayFourDate = luxon.DateTime.local().plus({days: 4}).toISODate();
var dayFiveDate = luxon.DateTime.local().plus({days: 5}).toISODate();

// Global Variables
var apiKey = "bd51b2fbd76019c25a3a15ee00180da9";
var searchedCity;
var lat;
var lon;

// .on("click") event for the 'Search for a City' Button that store the city name in a variable
$("#run-search").on("click", function (event) {
    event.preventDefault();

    searchedCity = $("#search-term").val();
    createSearchResultBtn();
    queryCity();
});

// Update HTML with data from local storage
function createSearchResultBtn() {

    var resultBtn = $("<button>").addClass("btn btn-outline-secondary result-btn").text(searchedCity);
    $("#search-results").append(resultBtn);
}

// API Call using city name to return latitude and longitude
function queryCity() {

    var queryLonLatURL = `http://api.openweathermap.org/geo/1.0/direct?q=${searchedCity}&appid=${apiKey}`;

    $.ajax({
        url: queryLonLatURL,
        method: "GET"
    }).then(runWeatherCall)
}

// store data in local storage
function storeData(response) {

    weatherData.push(response);
    localStorage.setItem("data", JSON.stringify(weatherData));
}

// Obtain current and daily weather forecast details using captured latitude and longitude
function runWeatherCall(response) {

    lat = response[0].lat;
    lon = response[0].lon;

    var queryOneCallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,alerts&appid=${apiKey}`;

    $.ajax({
        url: queryOneCallURL,
        method: "GET"
    }).then(currentForecast)
}

// Create HTML using current weather data
function currentForecast(forecast) {

    $("#currentDay").empty();
    console.log("forecast: ", forecast);
    // Variables of API data
    var currentIcon = forecast.current.weather[0].icon;
    var currentIconURL = "http://openweathermap.org/img/w/" + currentIcon + ".png";
    var currentTemp = forecast.current.temp;
    var currentHumid = forecast.current.humidity;
    var currentWindSpeed = forecast.current.wind_speed;
    var currentUVI = forecast.current.uvi;
    // variables for dynamic HTML content using variables containing API data 
    var sectionDiv = $("<div>").addClass("col border border-gray bg-white pt-3");
    var cityName = $("<h2>").text(searchedCity + " " + "(" + currentDate + ")");
    var currentLogo = $("<img>").attr("src", currentIconURL);
    var cityTemp = $("<p>").text("Temperature: " + currentTemp + " " + String.fromCharCode(176) + "C");
    var cityHumid = $("<p>").text("Humidity: " + currentHumid + "%");
    var cityWindSpeed = $("<p>").text("Wind Speed: " + currentWindSpeed + " MPH");
    var CityUVI = $("<p>").text("UV Index: " + currentUVI);
    // Order of HTML content created
    $("#currentDay").append(sectionDiv);
    sectionDiv.append(cityName, cityTemp, cityHumid, cityWindSpeed, CityUVI);
    cityName.append(currentLogo);

}





//  .on("click") function for the 'Clear Results' button
$("#clear-all").on("click", clear);

// Function to empty out the articles and clear localstorage
function clear() {

    $("#search-results").empty();
    localStorage.clear();
    window.location.reload();
}