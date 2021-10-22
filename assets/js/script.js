// from HTML elements
var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city");

var currentWeatherEl = document.querySelector("#current-weather-container");
var citySearchTerm = document.querySelector("#city-search-term");


// var lat = 33.44
// var lon = -94.04

// // open weather API call
// var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=914d3b53de5d88e879e5979ff877074b";

// var response = fetch(apiUrl);
// console.log(response);


var getCityWeather = function (city) {

    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=914d3b53de5d88e879e5979ff877074b";

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data, city);
                    displayWeather(data, city);
                });
            } else {
                alert("Error: City not found");
            }
        })
}

// print weather data to page
var displayWeather = function() {

    citySearchTerm.textContent = searchTerm

    var temp = document.createElement("p");

    var wind = document.createElement("p");

    var humidity = document.createElement("p");

    var uvIndex = document.createElement("p");

    
}

// get value from form input
var formSubmitHandler = function(event) {
    event.preventDefault();

    var cityName = cityInputEl.value.trim();

    if (cityName) {
        getCityWeather(cityName);
        cityInputEl.value = "";
    }
    else {
        alert("Please enter a city");
    }
}


// add event listener to form element
userFormEl.addEventListener("submit", formSubmitHandler);