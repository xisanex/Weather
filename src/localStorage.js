export default class LocalStorage {
  /**
   * seting localStorage
   */
  static setLocalStorage = (arrStorage) => {
    localStorage.setItem("arrStorage", JSON.stringify(arrStorage));
  };

  /** geting item from localStorage and render Bookmarks for each element in this storage */
  static getLocalStorage = () => {
    return JSON.parse(localStorage.getItem("arrStorage"));
    // localStorage.clear();
  };
}
