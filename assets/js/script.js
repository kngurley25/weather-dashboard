

var lat = 33.44
var lon = -94.04

// open weather API call
var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=914d3b53de5d88e879e5979ff877074b";

var response = fetch(apiUrl);
console.log(response);