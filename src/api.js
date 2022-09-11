import { weatherContainer, errorElement, renderWeather } from "./view.js";
class Api {
  /** unique Api key */
  _APIKey = "2894452bbbde6a906a6f1b10b0625793";

  constructor() {
    // Getting current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude } = position.coords;
        const { longitude } = position.coords;
        this._getWeatherNextDays(latitude, longitude);
      },
      (error = function (err) {
        console.error(`Error: ${err.message}`);
        renderErrorMessage(err.message);
      })
    );
  }
  /** Getting weather data by city name from API*/
  getWeather = (cityName) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${this._APIKey}`
    )
      .then((response) => response.json())
      .then((data) => renderWeather(data))
      .catch((err) => {
        console.error(err);
        errorElement.classList.remove("hidden");
        errorElement.innerText = "Invalid city name";
        setTimeout(() => errorElement.classList.add("hidden"), 5000);
      });
  };
  /**
   * getting weather data for next 2 days
   * @param {*} lat coords latitude
   * @param {*} lon coords longitude
   */
  _getWeatherNextDays(lat, lon) {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this._APIKey}`
    )
      .then((response) => response.json())
      .then((data) => renderWeather(data))
      .catch((err) => {
        console.error(err);
        this._renderErrorMessage(err);
      });
  }
  /**
   * rendering error message
   * @param {*} error error message
   */
  _renderErrorMessage(error) {
    let html = `
    <div class="list-container__display">
    <p> ${error} </p>
    </div>`;
    weatherContainer.insertAdjacentHTML("beforeend", html);
  }
}

export const { getWeather } = new Api();
