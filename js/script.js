// Luxon Date and Time
var dateTime = luxon.DateTime;
var today = dateTime.local();
var currentDate = today.toLocaleString(dateTime.DATE_SHORT)
var dayOneLuxDate = luxon.DateTime.local().plus({days: 1}).toLocaleString();
var dayTwoLuxDate = luxon.DateTime.local().plus({days: 2}).toLocaleString();
var dayThreeLuxDate = luxon.DateTime.local().plus({days: 3}).toLocaleString();
var dayFourLuxDate = luxon.DateTime.local().plus({days: 4}).toLocaleString();
var dayFiveLuxDate = luxon.DateTime.local().plus({days: 5}).toLocaleString();

// Global Variables
var apiKey = "bd51b2fbd76019c25a3a15ee00180da9";
var searchedCity;
var lat;
var lon;

// .on("click") event for the 'Search for a City' Button that store the city name in a variable
$("#run-search").on("click", function (event) {
    event.preventDefault();

    searchedCity = $("#search-term").val();
    createSearchHistoryBtn();
    queryCity();
});

// Update HTML with data from local storage
function createSearchHistoryBtn() {

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

    
    // Current Day Forecast
    // Empty Current Weather HTML section with id="currentDay"
    $("#currentDay").empty();
    
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
    var cityUVI = $("<p>").text("UV Index: ");
    var cityUVISpan;

        if (currentUVI >= 3 && currentUVI < 6) {
            cityUVISpan = $("<span>").text(currentUVI).addClass("uvi-moderate");
        } else if (currentUVI >= 6 && currentUVI < 8) {
            cityUVISpan = $("<span>").text(currentUVI).addClass("uvi-high");
        } else if (currentUVI >= 8 && currentUVI < 10) {
            cityUVISpan = $("<span>").text(currentUVI).addClass("uvi-veryhigh");
        } else if (currentUVI < 3) {
            cityUVISpan = $("<span>").text(currentUVI).addClass("uvi-low");
        }

    // Order of HTML content created
    $("#currentDay").append(sectionDiv);
    sectionDiv.append(cityName, cityTemp, cityHumid, cityWindSpeed, cityUVI);
    cityName.append(currentLogo);
    cityUVI.append(cityUVISpan);

    // Week ahead forecast
    // Empty 5-Day Weather Forecast HTML section with id="weekAhead"
    $("#weekAhead").empty();
    // Create HTML title
    var sectionDiv = $("<div>").addClass("col mt-2");
    var forecastTitle = $("<h3>").text("5-Day Forecast:");

    $("#weekAhead").append(sectionDiv);
    sectionDiv.append(forecastTitle);
    var forecastDiv = $("<div>").addClass("row");
    sectionDiv.append(forecastDiv);
    
    // Day 1 Variables of API data
    var dayOneDataIcon = forecast.daily[0].weather[0].icon;
    var dayOneDataIconURL = "http://openweathermap.org/img/w/" + dayOneDataIcon + ".png";
    var dayOneDataTemp = forecast.daily[0].temp.day;
    var dayOneDataHumid = forecast.daily[0].humidity;
    // variables of dynamic HTML content using variables of API data
    var dayOneDiv = $("<div>").addClass("col m-4 weather-box");
    var dayOneDate = $("<p>").text(dayOneLuxDate).addClass("forecast-date mt-2");
    var dayOneImg = $("<img>").attr("src", dayOneDataIconURL);
    var dayOneTemp = $("<p>").text("Temp: " + dayOneDataTemp + " " + String.fromCharCode(176) + "C").addClass("mt-2");
    var dayOneHumid = $("<p>").text("Humidity: " + dayOneDataHumid + "%");
    // Create Day 1 HTML 
    forecastDiv.append(dayOneDiv);
    dayOneDiv.append(dayOneDate, dayOneImg, dayOneTemp, dayOneHumid);

    // Day 2 Variables of API data
    var dayTwoDataIcon = forecast.daily[1].weather[0].icon;
    var dayTwoDataIconURL = "http://openweathermap.org/img/w/" + dayTwoDataIcon + ".png";
    var dayTwoDataTemp = forecast.daily[1].temp.day;
    var dayTwoDataHumid = forecast.daily[1].humidity;
    // variables of dynamic HTML content using variables of API data
    var dayTwoDiv = $("<div>").addClass("col m-4 weather-box");
    var dayTwoDate = $("<p>").text(dayTwoLuxDate).addClass("forecast-date mt-2");
    var dayTwoImg = $("<img>").attr("src", dayTwoDataIconURL);
    var dayTwoTemp = $("<p>").text("Temp: " + dayTwoDataTemp + " " + String.fromCharCode(176) + "C").addClass("mt-2");
    var dayTwoHumid = $("<p>").text("Humidity: " + dayTwoDataHumid + "%");
    // Create Day 2 HTML 
    forecastDiv.append(dayTwoDiv);
    dayTwoDiv.append(dayTwoDate, dayTwoImg, dayTwoTemp, dayTwoHumid);

    // Day 3 Variables of API data
    var dayThreeDataIcon = forecast.daily[2].weather[0].icon;
    var dayThreeDataIconURL = "http://openweathermap.org/img/w/" + dayThreeDataIcon + ".png";
    var dayThreeDataTemp = forecast.daily[2].temp.day;
    var dayThreeDataHumid = forecast.daily[2].humidity;
    // variables of dynamic HTML content using variables of API data
    var dayThreeDiv = $("<div>").addClass("col m-4 weather-box");
    var dayThreeDate = $("<p>").text(dayThreeLuxDate).addClass("forecast-date mt-2");
    var dayThreeImg = $("<img>").attr("src", dayThreeDataIconURL);
    var dayThreeTemp = $("<p>").text("Temp: " + dayThreeDataTemp + " " + String.fromCharCode(176) + "C").addClass("mt-2");
    var dayThreeHumid = $("<p>").text("Humidity: " + dayThreeDataHumid + "%");
    // Create Day 3 HTML 
    forecastDiv.append(dayThreeDiv);
    dayThreeDiv.append(dayThreeDate, dayThreeImg, dayThreeTemp, dayThreeHumid);

    // Day 4 Variables of API data
    var dayFourDataIcon = forecast.daily[3].weather[0].icon;
    var dayFourDataIconURL = "http://openweathermap.org/img/w/" + dayFourDataIcon + ".png";
    var dayFourDataTemp = forecast.daily[3].temp.day;
    var dayFourDataHumid = forecast.daily[3].humidity;
    // variables of dynamic HTML content using variables of API data
    var dayFourDiv = $("<div>").addClass("col m-4 weather-box");
    var dayFourDate = $("<p>").text(dayFourLuxDate).addClass("forecast-date mt-2");
    var dayFourImg = $("<img>").attr("src", dayFourDataIconURL);
    var dayFourTemp = $("<p>").text("Temp: " + dayFourDataTemp + " " + String.fromCharCode(176) + "C").addClass("mt-2");
    var dayFourHumid = $("<p>").text("Humidity: " + dayFourDataHumid + "%");
    // Create Day 4 HTML 
    forecastDiv.append(dayFourDiv);
    dayFourDiv.append(dayFourDate, dayFourImg, dayFourTemp, dayFourHumid);
    
    // Day 5 Variables of API data
    var dayFiveDataIcon = forecast.daily[4].weather[0].icon;
    var dayFiveDataIconURL = "http://openweathermap.org/img/w/" + dayFiveDataIcon + ".png";
    var dayFiveDataTemp = forecast.daily[4].temp.day;
    var dayFiveDataHumid = forecast.daily[4].humidity;
    // variables of dynamic HTML content using variables of API data
    var dayFiveDiv = $("<div>").addClass("col m-4 weather-box");
    var dayFiveDate = $("<p>").text(dayFiveLuxDate).addClass("forecast-date mt-2");
    var dayFiveImg = $("<img>").attr("src", dayFiveDataIconURL);
    var dayFiveTemp = $("<p>").text("Temp: " + dayFiveDataTemp + " " + String.fromCharCode(176) + "C").addClass("mt-2");
    var dayFiveHumid = $("<p>").text("Humidity: " + dayFiveDataHumid + "%");
    // Create Day 5 HTML 
    forecastDiv.append(dayFiveDiv);
    dayFiveDiv.append(dayFiveDate, dayFiveImg, dayFiveTemp, dayFiveHumid);
}

//  .on("click") function for the 'Clear Results' button
$("#clear-all").on("click", clear);

// Function to empty out the articles and clear localstorage
function clear() {

    $("#search-results").empty();
    localStorage.clear();
    window.location.reload();
}