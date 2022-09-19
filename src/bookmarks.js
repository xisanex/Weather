import LocalStorage from "./localStorage.js";
class Bookmarks {
  _idNum = 0;
  _curSlide = 0;
  _listWeatherContainer = document.querySelector(".bookmarked__slider");
  _btnContainers = {};
  arrStorage = [];
  constructor() {
    this.arrStorage = LocalStorage.getLocalStorage();

    if (this.arrStorage.length) {
      this.arrStorage.forEach((item) => {
        this.renderBookmarks(item);
      });
    }
    this._prevBookmarks();
    this._nextBookmarks();
  }

  /**
   * render bookmarks
   * @param {*} data
   * @param {*} icons
   */
  renderBookmarks = (data) => {
    this._idNum++;
    let html = `
      <div class="bookmared__container">
      <button type="button" class="bookmarked__cancel bookmarked__cancel--${
        this._idNum
      }"><i class="fas fa-window-close"></i></button>
      <span class="container__city-name">${data.city.name}</span>
      <figure class="bookmarked__icon">
      <img src="${`http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`}" alt="Weather icon"/>
      </figure>
      </div>`;
    this._listWeatherContainer.insertAdjacentHTML("beforeend", html);
    this.removeBookmarks(data);
    this._btnContainer();
  };
  /**
   * generating bookmarks and adding it to localStorage
   * @param {*} data received from generateMarkup
   * @param {*} icons
   */
  generateBookmarks = (data) => {
    const bookmarkBtn = document.querySelector(".section__btn-bookmark");
    bookmarkBtn.addEventListener("click", () => {
      if (
        !this.arrStorage.find((el) => {
          return el?.city?.name === data?.city?.name;
        })
      ) {
        this.arrStorage.push(data);
        LocalStorage.setLocalStorage(this.arrStorage);
        this.renderBookmarks(data);
      }

      // const warunek = this._arrStorage.find((el) => {
      //   if(el?.city?.name === data?.city?.name) {
      //     return true;
      //   } else {
      //     return false;
      //   }
      // })

      // if (!warunek) {
      //   this._arrStorage.push(data);
      //   this._setLocalStorage();
      //   this.renderBookmarks(data);
      // }
    });
  };
  /**
   * remove bookmarks also from localStorage
   * @param {*} data received from render Bookmarks
   * @returns
   */
  removeBookmarks = (data) => {
    const cancelBookmarkBtn = document.querySelector(
      `.bookmarked__cancel--${this._idNum}`
    );
    if (!cancelBookmarkBtn) return;
    const parentElement = cancelBookmarkBtn.parentNode;

    cancelBookmarkBtn.addEventListener("click", () => {
      const filtred = this.arrStorage.filter((el) => {
        return JSON.stringify(el) !== JSON.stringify(data);
      });
      this.arrStorage = filtred;
      LocalStorage.setLocalStorage(this.arrStorage);
      parentElement.remove();
    });
  };

  _btnContainer() {
    const container = document.querySelector(".bookmarked__slider");
    const containers = document.querySelectorAll(".bookmared__container");
    let bookmarkContainer = document.querySelector(".bookmared__container");
    container.style.transition = "transform 0.4s ease-in-out";

    const style = window.getComputedStyle(bookmarkContainer);
    const containerSize =
      bookmarkContainer.clientWidth +
      Number.parseInt(
        (bookmarkContainer = style.getPropertyValue("-moz-margin-start")),
        10
      );
    let maxSlide = containers.length;

    return (this._btnContainers = {
      container,
      containers,
      containerSize,
      maxSlide,
    });
  }

  _nextBookmarks() {
    this._btnContainer();
    const nextBtn = document.querySelector(".bookmarked__btn--next");
    nextBtn.addEventListener("click", () => {
      console.log(this._curSlide);
      if (this._curSlide !== 0) {
        this._curSlide++;
      }
      this._btnContainers.container.style.transform = `translateX(${
        this._btnContainers.containerSize * this._curSlide
      }px)`;
    });
  }

  _prevBookmarks() {
    this._btnContainer();
    const prevBtn = document.querySelector(".bookmarked__btn--prev");
    prevBtn.addEventListener("click", () => {
      if (this._curSlide !== -this._btnContainers.maxSlide + 1) {
        console.log(this._curSlide);
        this._curSlide--;
      }
      this._btnContainers.container.style.transform = `translateX(${
        this._btnContainers.containerSize * this._curSlide
      }px)`;
    });
  }
}

export const { renderBookmarks, removeBookmarks, generateBookmarks } =
  new Bookmarks();
