const inputEl = document.querySelector("#search-box");
const countryListEl = document.querySelector(".country-list");
const countryInfoEl = document.querySelector(".country-info");
const loadingInfoEl = document.querySelector(".js-loading-info");
const galleryEl = document.querySelector(".gallery__container");
const galleryBlockEl = document.querySelector(".gallery");
let lightboxInstance;

export default {
  inputEl,
  countryInfoEl,
  countryListEl,
  loadingInfoEl,
  galleryEl,
  galleryBlockEl,
  lightboxInstance,
};
