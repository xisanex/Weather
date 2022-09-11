const btn = document.querySelector(".search-bar__submit");
const APIKey = "2894452bbbde6a906a6f1b10b0625793";
const msg = document.querySelector(".message-error");
const weatherContainer = document.querySelector(".section");
const myForm = document.querySelector(".search-bar");
const errorElement = document.getElementById("error");
const absZer = 273.15;
const listWeatherContainer = document.querySelector(".bookmared");

// Timer
function displayTime() {
  let d = new Date();
  let hour = d.getHours();
  let min = d.getMinutes();
  let sec = d.getSeconds();
  if (sec < 10) sec = "0" + sec;
  if (min < 10) min = "0" + min;
  if (hour < 10) hour = "0" + hour;
  document.getElementById("header__date-hour").textContent =
    d.toISOString().slice(0, 10) + " " + hour + ":" + min + ":" + sec;
}

setInterval(displayTime, 1000);
//////////////////////////////////////////////
const renderErrorMessage = function (error) {
  let html = `
  <div class="list-container__display">
  <p> ${error} </p>
  </div>`;
  weatherContainer.insertAdjacentHTML("beforeend", html);
};

const renderWeather = function (data, className = "") {
  // Array with data for next days
  const arrTomorrow = [];
  const tempNextDaysAt12 = [];
  // console.log(data);
  data.list.forEach((object) => {
    if (object.dt_txt.slice(8, 10) !== data.list[0].dt_txt.slice(8, 10)) {
      // console.log(data);
      arrTomorrow.push(object);
    }
  });

  arrTomorrow.forEach((object) => {
    if (object.dt_txt.slice(11, 13).includes("12"))
      tempNextDaysAt12.push(object);
  });

  const icons = `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`;
  let html = `
     <button type="submit" class="section__btn-bookmark"><i class="far fa-bookmark"></i></button>
      <h2 class="section__city-name" data-name="">
        <span> ${data.city.name}</span>
      </h2>
     
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
  const bookmarkBtn = document.querySelector(".section__btn-bookmark");

  bookmarkBtn.addEventListener("click", function () {
    console.log("click");
    let html = `
    <div class="bookmared__container">
      <span class="container__city-name">${data.city.name}</span>
      <figure class="bookmarked__icon">
        <img src="${icons}" alt="Weather icon"/>
      </figure>
    </div>`;
    listWeatherContainer.insertAdjacentHTML("beforeend", html);
  });
};

// AJAX call

const getWeatherNextDays = function (lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`
  )
    .then((response) => response.json())
    .then((data) => renderWeather(data))
    .catch((err) => {
      console.error(err);
      renderErrorMessage(err);
    });
};
const getWeather = function (cityName) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${APIKey}`
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

const currentPosition = navigator.geolocation.getCurrentPosition(
  function (position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(latitude, longitude);

    getWeatherNextDays(latitude, longitude);
  },
  (error = function (err) {
    console.error(`Error: ${err.message}`);
    renderErrorMessage(err.message);
  })
);

myForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let messages = "";
  let input = document.querySelector(".search-bar__input").value;
  if (input === "" || input == null) messages = "City name is required";
  if (/\d/.test(input)) messages = "City name contains a number";

  if (messages.length > 0) {
    errorElement.classList.remove("hidden");
    errorElement.innerText = messages;
    myForm.reset();
    setTimeout(() => errorElement.classList.add("hidden"), 5000);
    return;
  }
  errorElement.classList.add("hidden");
  getWeather(input);
  myForm.reset();
});
