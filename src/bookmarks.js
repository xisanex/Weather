import LocalStorage from "./localStorage.js";
class Bookmarks {
  _idNum = 0;
  _curSlide = 0;
  arrStorage = [];
  _listWeatherContainer = document.querySelector(".bookmarked__slider");
  constructor() {
    this.arrStorage = LocalStorage.getLocalStorage();
    console.log(this.arrStorage.length);
    if (this.arrStorage.length) {
      console.log("hi");
      this.arrStorage.forEach((item) => {
        this.renderBookmarks(item);
      });
    }
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
    console.log("hi");
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

  _nextBookmarks() {
    const downBtn = document.querySelector(".bookmarked__next");
    const container = document.querySelector(".bookmarked__slider");
    const containers = document.querySelectorAll(".bookmared__container");

    container.style.transition = "transform 0.4s ease-in-out";
    let maxSlide = containers.length;
    console.log(maxSlide);
    downBtn.addEventListener("click", () => {
      if (this._curSlide === 0) {
        this._curSLide = maxSlide;
      } else {
        this._curSlide++;
      }
      container.style.transform = `translateX(${190 * this._curSlide}px)`;
    });
  }

  _prevBookmarks() {
    const prevBtn = document.querySelector(".bookmarked__prev");
    let container = document.querySelector(".bookmarked__slider");
    const containers = document.querySelectorAll(".bookmared__container");
    container.style.transition = "transform 0.4s ease-in-out";
    let maxSlide = containers.length;
    console.log(this._curSlide);
    prevBtn.addEventListener("click", () => {
      this._curSlide--;
      console.log(this._curSlide);
      container.style.transform = `translateX(${190 * this._curSlide}px)`;
    });
  }
}

export const { renderBookmarks, removeBookmarks, generateBookmarks } =
  new Bookmarks();
