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
                var lon = location.data[0].longitude;
                console.log(lat, lon);

                getCityWeather(lat, lon);
    
            })
        } else {
            alert("Error: City not found.");
        }
    })
}


var getCityWeather = function (lat, lon) {

    // from open weather API
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=914d3b53de5d88e879e5979ff877074b&units=imperial";

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data);
                    displayWeather(data);
                });
            } else {
                alert("Error: City not found.");
            }
        })
}

// print weather data to page dynamic HTML
var displayWeather = function(weather) {

    // current weather    
    var currentDate = document.createElement("h6");
    currentDate.textContent = new Date((weather.current.dt)*1000).toLocaleString("en-US");
    
    var temp = document.createElement("p");
    temp.textContent = "Temp: " + weather.current.temp + " ºF";

    var wind = document.createElement("p");
    wind.textContent = "Wind: " + weather.current.wind_speed + " MPH";

    var humidity = document.createElement("p");
    humidity.textContent = "Humidity: " + weather.current.humidity + "%";

    var uvIndex = document.createElement("p");
    uvIndex.textContent = "UV Index: " + weather.current.uvi;

    currentWeatherEl.appendChild(currentDate);
    currentWeatherEl.appendChild(temp);
    currentWeatherEl.appendChild(wind);
    currentWeatherEl.appendChild(humidity);
    currentWeatherEl.appendChild(uvIndex);

    // forecast


}

// get value from form input
var formSubmitHandler = function(event) {
    event.preventDefault();

    var cityName = cityInputEl.value.trim();

    if (cityName) {
        convertCity(cityName);
        citySearchTerm.textContent = cityName;
        cityInputEl.value = "";
    }
    else {
        alert("Please enter a city");
    }
}

// add event listener to form element
userFormEl.addEventListener("submit", formSubmitHandler);