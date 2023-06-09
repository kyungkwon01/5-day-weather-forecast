// Assigning all selector to a variable
const enterCityEl = document.getElementById("enter-city");
const searchButtonEl = document.getElementById("search-button");
const clearHistoryEl = document.getElementById("clear-history");
const cityNameEl = document.getElementById("city-name");
const currentPicEl = document.getElementById("current-pic");
const temperatureEl = document.getElementById("temperature");
const humidityEl = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const historyEl = document.getElementById("history");


function initPage() {

  let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

  // Assigning API key to a variable
  const APIKey = "e8d973b8fba73a98a71fa8c57b8adc66";

  function getWeather(cityName) {
    // Running get on Open Weather API
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
    // get the current weather of the city entered in the searchbar
    axios.get(queryURL)
      .then(function (response) {

        // Parse response to display current weather
        const currentDate = new Date(response.data.dt * 1000);
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        cityNameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
        let weatherPic = response.data.weather[0].icon;
        currentPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
        currentPicEl.setAttribute("alt", response.data.weather[0].description);
        temperatureEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
        humidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
        windSpeed.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";

        // get the 5-day forecast of the city entered in the searchbar
        let cityID = response.data.id;
        let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
        axios.get(forecastQueryURL)
          .then(function (response) {

            //  Parse response to display forecast for next 5 days
            const forecastEls = document.querySelectorAll(".forecast");
            for (i = 0; i < forecastEls.length; i++) {
              forecastEls[i].innerHTML = "";
              const forecastIndex = i * 8 + 4;
              const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
              const forecastDay = forecastDate.getDate();
              const forecastMonth = forecastDate.getMonth() + 1;
              const forecastYear = forecastDate.getFullYear();
              const forecastDateEl = document.createElement("p");
              forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
              forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
              forecastEls[i].append(forecastDateEl);

              // Icon images for current weather
              const forecastWeatherEl = document.createElement("img");
              forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
              forecastWeatherEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
              forecastEls[i].append(forecastWeatherEl);
              const forecastTempEl = document.createElement("p");
              forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
              forecastEls[i].append(forecastTempEl);
              const forecastHumidityEl = document.createElement("p");
              forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
              forecastEls[i].append(forecastHumidityEl);
            }
          })
      });
  }

  // Get history from local storage if any
  searchButtonEl.addEventListener("click", function () {
    const searchTerm = enterCityEl.value;
    getWeather(searchTerm);
    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderSearchHistory();
  })

  // Clear History button
  clearHistoryEl.addEventListener("click", function () {
    localStorage.clear();
    searchHistory = [];
    renderSearchHistory();
  })

  function k2f(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
  }

  function renderSearchHistory() {
    historyEl.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
      const historyItem = document.createElement("input");
      historyItem.setAttribute("type", "text");
      historyItem.setAttribute("readonly", true);
      historyItem.setAttribute("class", "form-control d-block bg-white");
      historyItem.setAttribute("style", 'cursor: pointer;');
      historyItem.setAttribute("value", searchHistory[i]);
      historyItem.addEventListener("click", function () {
        getWeather(historyItem.value);
      })
      historyEl.append(historyItem);
    }
  }

  renderSearchHistory();
  if (searchHistory.length > 0) {
    getWeather(searchHistory[searchHistory.length - 1]);
  }

}

initPage();