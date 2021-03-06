// from HTML elements
var buttonEl = document.querySelector("#search-button");
var cityInputEl = document.querySelector("#city");

var currentWeatherEl = document.querySelector("#current-weather-container");
var citySearchTerm = document.querySelector("#city-search-term");

var forecastTitleEl = document.querySelector("#forecast-title");
var forecastWeatherEl = document.querySelector("#forecast-container");

var searchedCitiesEl = document.querySelector("#searches");

// convert city to latitude and longitude
var convertCity = function(cityName) {
    var city = cityName;

    var GeoApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=914d3b53de5d88e879e5979ff877074b";
    
    fetch(GeoApiUrl)
    .then(function(response) {
        console.log(response);
        if (response.ok) {
            response.json().then(function(location) {
                console.log(location, city);
                
                var lat = location[0].lat;
                var lon = location[0].lon;
                console.log(lat, lon);

                getCityWeather(lat, lon);
    
            })
        } else {
            alert("Error: City not found.");
        }
    })
}

// open weather API call
var getCityWeather = function (lat, lon) {

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
    icon.src = "https://openweathermap.org/img/wn/" + weather.current.weather[0].icon + "@2x.png";
    
    var temp = document.createElement("p");
    temp.textContent = "Temp: " + weather.current.temp + " ??F";

    var wind = document.createElement("p");
    wind.textContent = "Wind: " + weather.current.wind_speed + " MPH";

    var humidity = document.createElement("p");
    humidity.textContent = "Humidity: " + weather.current.humidity + "%";

    // uv index audit for background color
    var uvIndex = document.createElement("p");
    var uvIndexNum = document.createElement("p");
    uvIndexNum.textContent = weather.current.uvi;
    uvIndex.textContent = "UV Index: ";
    uvIndex.classList = "uv-index";
    uvIndex.appendChild(uvIndexNum);

    if (weather.current.uvi < 2) {
        uvIndexNum.classList = "uv-index-num green accent-3";
    } else if (2 < weather.current.uvi < 7) {
        uvIndexNum.classList = "uv-index-num yellow lighten-3"
    } else if (7 < weather.current.uvi < 10) {
        uvIndexNum.classList = "uv-index-num red accent-2"
    }

    currentWeatherEl.appendChild(currentDate);
    currentWeatherEl.appendChild(icon);
    currentWeatherEl.appendChild(temp);
    currentWeatherEl.appendChild(wind);
    currentWeatherEl.appendChild(humidity);
    currentWeatherEl.appendChild(uvIndex);

    // forecast weather
    forecastWeatherEl.textContent = "";
    
    for (var i = 1; i < 6; i++) {

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
        temp.textContent = "Temp: " + weather.daily[i].temp.max + " ??F";

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

// get value from form input
var formSubmitHandler = function(event) {
    event.preventDefault();

    var target = event.target;
    console.log(event.target);

    var cityName = target.getAttribute("type") !== "submit" ? target.textContent: cityInputEl.value.trim();
    console.log(cityName);

    if (cityName) {
        convertCity(cityName);

        citySearchTerm.textContent = "Showing weather data for: " + cityName;
        forecastTitleEl.textContent = "5-Day Forecast:";

        cityInputEl.value = "";

        // save searched city to array
        if (pastSearches.includes(cityName) === false) {
            pastSearches.push(cityName);

            var pastCityEl = document.createElement("button");
            pastCityEl.textContent = cityName;
            pastCityEl.classList = "btn waves-effect waves-light blue-grey lighten-4 black-text";
            searchedCitiesEl.appendChild(pastCityEl);

            pastCityEl.addEventListener("click", formSubmitHandler);
        }
        
        saveSearches();

    } else {
        alert("Please enter a city.");
    }
}


// save search items to local storage
var pastSearches = [];
var saveSearches = function () {
    localStorage.setItem("weather-searches", JSON.stringify(pastSearches));
}

var loadSearches = function () {
    var savedSearches = JSON.parse(localStorage.getItem("weather-searches"));
    console.log(savedSearches);
    if (!savedSearches) {
        return false;
    }

    for (var i = 0; i < savedSearches.length; i ++) {
        
        var pastCityEl = document.createElement("button");
            pastCityEl.textContent = savedSearches[i];
            pastCityEl.classList = "btn waves-effect waves-light blue-grey lighten-4 black-text";
            searchedCitiesEl.appendChild(pastCityEl);

            pastSearches.push(savedSearches[i]);

            pastCityEl.addEventListener("click", formSubmitHandler);
    }

    localStorage.setItem("weather-searches", JSON.stringify(savedSearches));
}

// add event listener to form element
buttonEl.addEventListener("click", formSubmitHandler);

loadSearches();