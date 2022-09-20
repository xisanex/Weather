import { getWeather } from "./api.js";
import { removeBookmarks, generateBookmarks } from "./bookmarks.js";

class View {
  weatherContainer = document.querySelector(".section");
  errorElement = document.getElementById("error");
  _myForm = document.querySelector(".search-bar");

  constructor() {
    setInterval(this._displayTime, 1000);
    this._eventListeners();

    // this._nextBookmarks();
    // this._prevBookmarks();
    // this._removeBookmarks();
  }
  /**
   * Render weather from received data
   * @param {*} data data from current location or input field
   */
  renderWeather = (data) => {
    // Weather array at 12 for next days
    const tempNextDaysAt12 = [];

    // loop over data to get weather at 12 for next days
    data.list.forEach((object) => {
      if (object.dt_txt.slice(8, 10) !== data.list[0].dt_txt.slice(8, 10)) {
        if (object.dt_txt.slice(11, 13).includes("12")) {
          tempNextDaysAt12.push(object);
        }
      }
    });
    this._generateMarkup(data, tempNextDaysAt12);
  };
  /**
   * Get current time and date and display it
   */
  _displayTime() {
    const d = new Date();
    let hour = d.getHours();
    let min = d.getMinutes();
    let sec = d.getSeconds();
    if (sec < 10) sec = "0" + sec;
    if (min < 10) min = "0" + min;
    if (hour < 10) hour = "0" + hour;
    document.getElementById("header__date-hour").textContent =
      d.toISOString().slice(0, 10) + " " + hour + ":" + min + ":" + sec;
  }

  /**
   * Generating markup for weather for today and 2 next days from data
   * @param {*} data data received from method render Weather
   * @param {*} tempNextDaysAt12 array with temperatures for next days at 12 o'clock
   */
  _generateMarkup = (data, tempNextDaysAt12) => {
    const absZer = 273.15;
    const icons = `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`;
    // console.log(this);
    let html = `
       <button type="submit" class="section__btn-bookmark"><i class="far fa-bookmark"></i></button>
        <h2 class="section__city-name" data-name="">
          <span> ${data.city.name}</span>
        </h2>
        
        <div class="section__icon-temp">
          <span class="section__city-temp">
          ${(data.list[0].main.temp - absZer).toFixed(1)}<sup>°C</sup>
          </span>
          <span class="section__city-temp-feels"> ${(
            data.list[0].main.feels_like - absZer
          ).toFixed(1)}<sup>°C</sup> </span>
          <figure class ="section__figure">
          <img class="figure__city-icon" src="${icons}" alt="Weather icon" />
          <figcaption class="figure__describe-weather">${
            data.list[0].weather[0].description
          }</figcaption>
          </figure>
        </div>
       
  
        <div class="section__day section__day--left">
          <h3 class="day__date">${tempNextDaysAt12[0].dt_txt
            .slice(5, 10)
            .replace("-", "/")}</h3>
          <span class="day__temp">${(
            tempNextDaysAt12[0].main.temp - absZer
          ).toFixed(1)}<sup>°C</sup></span>
          <img class="day__icon" src="${`http://openweathermap.org/img/wn/${tempNextDaysAt12[0].weather[0].icon}@2x.png`}" alt="Weather icon" /> 
  
        </div>
        <div class="section__day section__day--right">
          <h3 class="day__date">${tempNextDaysAt12[1].dt_txt
            .slice(5, 10)
            .replace("-", "/")}</h3>
          <span class="day__temp">${(
            tempNextDaysAt12[1].main.temp - absZer
          ).toFixed(1)}<sup>°C</sup></span>
          <img class="day__icon" src="${`http://openweathermap.org/img/wn/${tempNextDaysAt12[1].weather[0].icon}@2x.png`}" alt="Weather icon" /> 
        </div>
    `;
    weatherContainer.insertAdjacentHTML("beforeend", html);
    weatherContainer.innerHTML = html;
    generateBookmarks(data, icons);
    removeBookmarks();
  };

  /**
   * all listeners called at start the application
   */
  _eventListeners() {
    this._myForm.addEventListener("submit", (e) => this._onInputClick(e));
  }

  /**
   * Receiving data from input field and generating if necessary error message
   * @param {*} e  event
   * @returns quiting function when error message appears
   */
  _onInputClick(e) {
    e.preventDefault();
    let messages = "";
    let input = document.querySelector(".search-bar__input").value;
    if (input === "" || input == null) messages = "City name is required";
    if (/\d/.test(input)) messages = "City name contains a number";

    if (messages.length > 0) {
      this.errorElement.classList.remove("hidden");
      this.errorElement.innerText = messages;
      this._myForm.reset();
      setTimeout(() => this.errorElement.classList.add("hidden"), 5000);
      return;
    }
    this.errorElement.classList.add("hidden");
    getWeather(input);
    this._myForm.reset();
  }
}

export const { weatherContainer, errorElement, renderWeather } = new View();
