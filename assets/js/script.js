// from HTML elements
var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city");

var currentWeatherEl = document.querySelector("#current-weather-container");
var citySearchTerm = document.querySelector("#city-search-term");

var forecastTitleEl = document.querySelector("#forecast-title");
var forecastWeatherEl = document.querySelector("#forecast-container");

var searchedCitiesEl = document.querySelector("#searches");


// convert city to latitude and longitude from position stack API
var convertCity = function(cityName) {
    var city = cityName;

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

    // clear old content
    currentWeatherEl.textContent = ""

    // current weather    
    var currentDate = document.createElement("h6");
    currentDate.textContent = new Date((weather.current.dt)*1000).toLocaleString("en-US");
    
    var icon = document.createElement("img");
    icon.src = "http://openweathermap.org/img/wn/" + weather.current.weather[0].icon + "@2x.png";
    
    var temp = document.createElement("p");
    temp.textContent = "Temp: " + weather.current.temp + " ºF";

    var wind = document.createElement("p");
    wind.textContent = "Wind: " + weather.current.wind_speed + " MPH";

    var humidity = document.createElement("p");
    humidity.textContent = "Humidity: " + weather.current.humidity + "%";

    var uvIndex = document.createElement("p");
    uvIndex.textContent = "UV Index: " + weather.current.uvi;

    currentWeatherEl.appendChild(currentDate);
    currentWeatherEl.appendChild(icon);
    currentWeatherEl.appendChild(temp);
    currentWeatherEl.appendChild(wind);
    currentWeatherEl.appendChild(humidity);
    currentWeatherEl.appendChild(uvIndex);

    // forecast weather
    forecastWeatherEl.textContent = "";
    
    

    for (var i = 0; i < 5; i++) {

        var cardEl = document.createElement("div");
        cardEl.classList = "card-panel col m2 blue lighten-5";

        var forecastDate = document.createElement("h6");
        forecastDate.classList = "card-content";
        forecastDate.textContent = (new Date((weather.daily[i].dt)*1000).toLocaleString("en-US")).split(",")[0];

        var icon = document.createElement("img");
        icon.classList = "card-content";
        icon.src = "http://openweathermap.org/img/wn/" + weather.daily[i].weather[0].icon + "@2x.png";
        
        var temp = document.createElement("p");
        temp.classList = "card-content";
        temp.textContent = "Temp: " + weather.daily[i].temp.max + " ºF";

        var wind = document.createElement("p");
        wind.classList = "card-content";
        wind.textContent = "Wind: " + weather.daily[i].wind_speed + " MPH";

        var humidity = document.createElement("p");
        humidity.classList = "card-content";
        humidity.textContent = "Humidity: " + weather.daily[i].humidity + "%";

        cardEl.appendChild(forecastDate);
        cardEl.appendChild(icon);
        cardEl.appendChild(temp);
        cardEl.appendChild(wind);
        cardEl.appendChild(humidity);

        forecastWeatherEl.appendChild(cardEl);
    }

}

// Save to local storage
// var weatherInfo = [];
// var saveWeather = function() {
//     localStorage.setItem("weather",JSON.stringify(weatherInfo));
// }

var pastSearches = [];
// var saveSearches = function() {

//     for (var i = 0; i < pastSearches.length; i++) {
//         var pastCityEl = document.createElement("button");
//             pastCityEl.textContent = pastSearches[i];
//             pastCityEl.classList = "btn waves-effect waves-light blue-grey lighten-4 black-text";
//             searchedCitiesEl.appendChild(pastCityEl);
//     }
//     pastSearches.forEach(function(cityName) {
//         var pastCityEl = document.createElement("button");
//             pastCityEl.textContent = cityName;
//             pastCityEl.classList = "btn waves-effect waves-light blue-grey lighten-4 black-text";
//             searchedCitiesEl.appendChild(pastCityEl);
//     })
// }

// get value from form input
var formSubmitHandler = function(event) {
    event.preventDefault();

    var cityName = cityInputEl.value.trim();

    if (cityName) {
        convertCity(cityName);

        citySearchTerm.textContent = "Showing weather data for: " + cityName;
        forecastTitleEl.textContent = "5-Day Forecast:";

        cityInputEl.value = "";

        // print searched city button to page
        var pastCityEl = document.createElement("button");
            pastCityEl.textContent = cityName;
            pastCityEl.classList = "btn waves-effect waves-light blue-grey lighten-4 black-text";
            searchedCitiesEl.appendChild(pastCityEl);

        // save searched city to array
        if (pastSearches.includes(cityName) === false) {
            pastSearches.push(cityName);
            console.log(pastSearches);
        }

        // TODO fix this
        // previousCityEl.setAttribute("weather-id", weatherIdCounter)
        // weatherInfo.push(weatherIdCounter);

        // console.log(weatherIdCounter);

        // weatherIdCounter++;
    }
    else {
        alert("Please enter a city");
    }
    
    // saveWeather();
}

// TODO fix this - write code function to load weather data from click on previous city button
// var loadWeatherData = function() {
//     var storedWeather = localStorage.getItem("weather");

//     storedWeather = JSON.parse(storedWeather);

//     displayWeather(storedWeather["weather-id"]);
// }

// add event listener to form element
userFormEl.addEventListener("submit", formSubmitHandler);

// searchedCitiesEl.addEventListener("click", convertCity(pastSearches[i]));