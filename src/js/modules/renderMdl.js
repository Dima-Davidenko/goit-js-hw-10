import RefsMdl from "./refsMdl.js";
import DataStorage from "../utils/dataStorage.js";

import countryInfoTpl from "../../templates/countryInfo.hbs";
import extendedCountryInfoTpl from "../../templates/extendedCountryInfo.hbs";
import countryListTpl from "../../templates/countryList.hbs";
import galleryTpl from "../../templates/gallery.hbs";

function renderMoreInfo() {
  // console.log(DataStorage.extendedOneCountryInfo);
  RefsMdl.countryInfoEl.insertAdjacentHTML(
    "beforeend",
    extendedCountryInfoTpl(DataStorage.extendedOneCountryInfo)
  );
}

function renderCountryList() {
  RefsMdl.countryListEl.innerHTML = countryListTpl({
    countries: DataStorage.filteredArrayOfCountries,
  });
}

// Show on page info about chosen country (When only one country matches or user clicked directly
// on country name in list)
function renderCountryInfo() {
  // Process resulting object with country info and prepare it for rendering with handlebars template func
  RefsMdl.countryInfoEl.innerHTML = countryInfoTpl(DataStorage.oneCountryInfo);
}

function cleanOutput() {
  RefsMdl.countryInfoEl.innerHTML = "";
  RefsMdl.countryListEl.innerHTML = "";
  RefsMdl.galleryBlockEl.innerHTML = "";
}

function renderGallery(arrImagesObjects) {
  const img = new URL("../../img/pixabayLogo.svg", import.meta.url);
  RefsMdl.galleryBlockEl.innerHTML = galleryTpl({
    images: arrImagesObjects,
    logo: img.pathname,
  });
}

export default {
  renderMoreInfo,
  renderCountryList,
  renderCountryInfo,
  cleanOutput,
  renderGallery,
};
