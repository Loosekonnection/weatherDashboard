// Luxon Date and Time
var dateTime = luxon.DateTime;
var today = dateTime.local();
var currentDate = today.toLocaleString(dateTime.DATE_SHORT)
var dayOneLuxDate = luxon.DateTime.local().plus({ days: 1 }).toLocaleString();
var dayTwoLuxDate = luxon.DateTime.local().plus({ days: 2 }).toLocaleString();
var dayThreeLuxDate = luxon.DateTime.local().plus({ days: 3 }).toLocaleString();
var dayFourLuxDate = luxon.DateTime.local().plus({ days: 4 }).toLocaleString();
var dayFiveLuxDate = luxon.DateTime.local().plus({ days: 5 }).toLocaleString();

// Global Variables
var apiKey = "3fd96e48e85d496a0159aa462f747730";
var searchedCity;
var city;
var lat;
var lon;
var weatherDataLS = JSON.parse(localStorage.getItem("weatherDataLS")) || [];

getLocalStorgeData();

// .on("click") event for the 'Search for a City' Button that stores the input city name in a variable
$("#run-search").on("click", function (event) {
    event.preventDefault();

    searchedCity = $("#search-term").val();
    $("#search-term").val('');
    setLocalStorageData();
});

// Store data in localstorage
function setLocalStorageData() {

    var weatherData = {
        "city": searchedCity
    };
    weatherDataLS.push(weatherData);
    localStorage.setItem("weatherDataLS", JSON.stringify(weatherDataLS));
    getLocalStorgeData();
}

// Check localStorage for historic searches
function getLocalStorgeData() {
    
    $("#search-results").empty();
    $.each(weatherDataLS, function (key, value) {

        if (value.city) {
            createSearchHistoryBtn(value.city);
        }
    }); 
    $(function(){
        $(".result-btn").last().click();
    })
}

// Create search history button with city name from local storage
function createSearchHistoryBtn(city) {

    var resultBtn = $("<button>").addClass("btn btn-outline-secondary result-btn").text(city);
    $("#search-results").append(resultBtn);
}

// API Call using city name to return latitude and longitude
function queryCity() {

    var queryLonLatURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchedCity}&appid=${apiKey}`;

    $.ajax({
        url: queryLonLatURL,
        method: "GET"
    }).then(runWeatherCall);
}

// Obtain current and daily weather forecast details using latitude and longitude from queryCity API call
function runWeatherCall(response) {

    lat = response[0].lat;
    lon = response[0].lon;
    city = response[0].name;

    var queryOneCallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,alerts&appid=${apiKey}`;

    $.ajax({
        url: queryOneCallURL,
        method: "GET"
    }).then(weatherForecast);
}

// Create HTML using current weather data
function weatherForecast(forecast) {

    // Current Day Forecast
    // Empty Current Weather HTML section with id="currentDay"
    $("#currentDay").empty();

    // Variables of API & dynamic HTML content using variables containing API data 
    var sectionDiv = $("<div>").addClass("col border border-gray bg-white pt-3");
    var cityName = $("<h2>").text(city + " " + "(" + currentDate + ")");
    var currentLogo = $("<img>").attr("src", "https://openweathermap.org/img/w/" + forecast.current.weather[0].icon + ".png");
    var cityTemp = $("<p>").text("Temperature: " + forecast.current.temp + " " + String.fromCharCode(176) + "C");
    var cityHumid = $("<p>").text("Humidity: " + forecast.current.humidity + "%");
    var cityWindSpeed = $("<p>").text("Wind Speed: " + forecast.current.wind_speed + " MPH");
    var cityUVI = $("<p>").text("UV Index: ");
    var cityUVISpan;

    if (forecast.current.uvi >= 3 && forecast.current.uvi < 6) {
        cityUVISpan = $("<span>").text(forecast.current.uvi).addClass("uvi-moderate");
    } else if (forecast.current.uvi >= 6 && forecast.current.uvi < 8) {
        cityUVISpan = $("<span>").text(forecast.current.uvi).addClass("uvi-high");
    } else if (forecast.current.uvi >= 8 && forecast.current.uvi < 10) {
        cityUVISpan = $("<span>").text(forecast.current.uvi).addClass("uvi-veryhigh");
    } else if (forecast.current.uvi < 3) {
        cityUVISpan = $("<span>").text(forecast.current.uvi).addClass("uvi-low");
    }

    // Current day align HTML content
    $("#currentDay").append(sectionDiv);
    sectionDiv.append(cityName, cityTemp, cityHumid, cityWindSpeed, cityUVI);
    cityName.append(currentLogo);
    cityUVI.append(cityUVISpan);

    // 5-Day week ahead forecast
    $("#weekAhead").empty();
    // Create HTML title
    var sectionDiv = $("<div>").addClass("col mt-2");
    var forecastTitle = $("<h3>").text("5-Day Forecast:");

    $("#weekAhead").append(sectionDiv);
    sectionDiv.append(forecastTitle);
    var forecastDiv = $("<div>").addClass("row");
    sectionDiv.append(forecastDiv);

    // Day 1 Variables & dynamic HTML content using variables of API data
    var dayOneDiv = $("<div>").addClass("col m-4 weather-box");
    var dayOneDate = $("<p>").text(dayOneLuxDate).addClass("forecast-date mt-2");
    var dayOneImg = $("<img>").attr("src", "https://openweathermap.org/img/w/" + forecast.daily[0].weather[0].icon + ".png");
    var dayOneTemp = $("<p>").text("Temp: " + forecast.daily[0].temp.day + " " + String.fromCharCode(176) + "C").addClass("mt-2");
    var dayOneHumid = $("<p>").text("Humidity: " + forecast.daily[0].humidity + "%");
    // Align Day 1 HTML 
    forecastDiv.append(dayOneDiv);
    dayOneDiv.append(dayOneDate, dayOneImg, dayOneTemp, dayOneHumid);

    // Day 2 Variables &dynamic HTML content using variables of API data
    var dayTwoDiv = $("<div>").addClass("col m-4 weather-box");
    var dayTwoDate = $("<p>").text(dayTwoLuxDate).addClass("forecast-date mt-2");
    var dayTwoImg = $("<img>").attr("src", "https://openweathermap.org/img/w/" + forecast.daily[1].weather[0].icon + ".png");
    var dayTwoTemp = $("<p>").text("Temp: " + forecast.daily[1].temp.day + " " + String.fromCharCode(176) + "C").addClass("mt-2");
    var dayTwoHumid = $("<p>").text("Humidity: " + forecast.daily[1].humidity + "%");
    // Align Day 2 HTML 
    forecastDiv.append(dayTwoDiv);
    dayTwoDiv.append(dayTwoDate, dayTwoImg, dayTwoTemp, dayTwoHumid);

    // Day 3 Variables & dynamic HTML content using variables of API data
    var dayThreeDiv = $("<div>").addClass("col m-4 weather-box");
    var dayThreeDate = $("<p>").text(dayThreeLuxDate).addClass("forecast-date mt-2");
    var dayThreeImg = $("<img>").attr("src", "https://openweathermap.org/img/w/" + forecast.daily[2].weather[0].icon + ".png");
    var dayThreeTemp = $("<p>").text("Temp: " + forecast.daily[2].temp.day + " " + String.fromCharCode(176) + "C").addClass("mt-2");
    var dayThreeHumid = $("<p>").text("Humidity: " + forecast.daily[2].humidity + "%");
    // Align Day 3 HTML 
    forecastDiv.append(dayThreeDiv);
    dayThreeDiv.append(dayThreeDate, dayThreeImg, dayThreeTemp, dayThreeHumid);

    // Day 4 Variables & dynamic HTML content using variables of API data
    var dayFourDiv = $("<div>").addClass("col m-4 weather-box");
    var dayFourDate = $("<p>").text(dayFourLuxDate).addClass("forecast-date mt-2");
    var dayFourImg = $("<img>").attr("src", "https://openweathermap.org/img/w/" + forecast.daily[3].weather[0].icon + ".png");
    var dayFourTemp = $("<p>").text("Temp: " + forecast.daily[3].temp.day + " " + String.fromCharCode(176) + "C").addClass("mt-2");
    var dayFourHumid = $("<p>").text("Humidity: " + forecast.daily[3].humidity + "%");
    // Align Day 4 HTML 
    forecastDiv.append(dayFourDiv);
    dayFourDiv.append(dayFourDate, dayFourImg, dayFourTemp, dayFourHumid);

    // Day 5 Variables & dynamic HTML content using variables of API data
    var dayFiveDiv = $("<div>").addClass("col m-4 weather-box");
    var dayFiveDate = $("<p>").text(dayFiveLuxDate).addClass("forecast-date mt-2");
    var dayFiveImg = $("<img>").attr("src", "https://openweathermap.org/img/w/" + forecast.daily[4].weather[0].icon + ".png");
    var dayFiveTemp = $("<p>").text("Temp: " + forecast.daily[4].temp.day + " " + String.fromCharCode(176) + "C").addClass("mt-2");
    var dayFiveHumid = $("<p>").text("Humidity: " + forecast.daily[4].humidity + "%");
    // Align Day 5 HTML 
    forecastDiv.append(dayFiveDiv);
    dayFiveDiv.append(dayFiveDate, dayFiveImg, dayFiveTemp, dayFiveHumid);
}

// .on("click") City search history button
$("nav").on("click", ".result-btn", function (event) {
    event.preventDefault();

    searchedCity = $(this).text();
    queryCity();
});

//  .on("click") Function for the 'Clear Results' button
$("#clear-all").on("click", function (event) {
    event.preventDefault();

    $("#search-results").empty();
    localStorage.clear();
    window.location.reload();
});


