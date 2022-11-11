import RefsMdl from "./refsMdl.js";
import countryInfoTpl from "../templates/countryInfo.hbs";
import extendedCountryInfoTpl from "../templates/extendedCountryInfo.hbs";
import countryListTpl from "../templates/countryList.hbs";

function renderMoreInfo(countryInfo) {
  console.log(countryInfo);
  RefsMdl.countryInfoEl.insertAdjacentHTML(
    "beforeend",
    extendedCountryInfoTpl(countryInfo)
  );
}

function renderCountryList(arrayOfCountries) {
  RefsMdl.countryListEl.innerHTML = countryListTpl({
    countries: arrayOfCountries,
  });
}

// Show on page info about chosen country (When only one country matches or user clicked directly
// on country name in list)
function renderCountryInfo(country) {
  // Process resulting object with country info and prepare it for rendering with handlebars template func
  RefsMdl.countryInfoEl.innerHTML = countryInfoTpl(country);
}

function cleanOutput() {
  RefsMdl.countryInfoEl.innerHTML = "";
  RefsMdl.countryListEl.innerHTML = "";
}

export default {
  renderMoreInfo,
  renderCountryList,
  renderCountryInfo,
  cleanOutput,
};
