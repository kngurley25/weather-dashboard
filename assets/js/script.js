// from HTML elements
var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city");

var currentWeatherEl = document.querySelector("#current-weather-container");
var citySearchTerm = document.querySelector("#city-search-term");


// convert city to latitude and longitude from position stack API
var convertCity = function() {
    var city = cityInputEl.value;

    var GeoApiUrl = "http://api.positionstack.com/v1/forward?access_key=ec6d3b2bdaeed7dd7de72fa6da1bd2ef&query=" + city +"&limit=1";
    
    fetch(GeoApiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(location) {
                console.log(location, city);
                
                var lat = location.data[0].latitude;
                console.log(lat);
    
                var lon = location.data[0].longitude;
                console.log(lon);

                getCityWeather(lat, lon);
    
            })
        } else {
            alert("Error: City not found.");
        }
    })
}

var getCityWeather = function (city) {

    // from open weather API
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=914d3b53de5d88e879e5979ff877074b&units=imperial";

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data, city);
                    displayWeather(data, city);
                });
            } else {
                alert("Error: City not found.");
            }
        })
}

// print weather data to page
var displayWeather = function(weather, searchTerm) {

    citySearchTerm.textContent = searchTerm

    var temp = document.createElement("p");
    temp.textContent = "Temp: " + weather.current.temp + " ºF";

    var wind = document.createElement("p");
    wind.textContent = "Wind: " + weather.current.wind_speed + " MPH";

    var humidity = document.createElement("p");
    humidity.textContent = "Humidity: " + weather.current.humidity + "%";

    var uvIndex = document.createElement("p");
    uvIndex.textContent = "UV Index: " + weather.current.uvi;

    currentWeatherEl.appendChild(temp);
    currentWeatherEl.appendChild(wind);
    currentWeatherEl.appendChild(humidity);
    currentWeatherEl.appendChild(uvIndex);

}

// get value from form input
var formSubmitHandler = function(event) {
    event.preventDefault();

    var cityName = cityInputEl.value.trim();

    if (cityName) {
        convertCity(cityName);
        cityInputEl.value = "";
    }
    else {
        alert("Please enter a city");
    }
}

// add event listener to form element
userFormEl.addEventListener("submit", formSubmitHandler);