import debounce from "lodash.debounce";
import sessionStorageApi from "./utils/sessionStorage.js";
import countryInfoTpl from "./templates/countryInfo.hbs";
import extendedCountryInfoTpl from "./templates/extendedCountryInfo.hbs";
import countryListTpl from "./templates/countryList.hbs";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { ukrCountryList } from "./utils/countryList.js";
import { codesListUkr } from "./utils/codesListUkr.js";
import {
  notiflixOpts,
  noMatchesMessage,
  badResponse,
  canntFetchMessage,
  exceedLimitMatchesMessage,
  filterParams,
  DEBOUNCE_DELAY,
  requestNameUrl,
  requestCodesUrl,
  loadingMessage,
  LOCAL_STORAGE_KEY,
} from "./utils/options.js";
import "./css/styles.css";
import "./css/three-dots.css";
import {
  showLoadingInfo,
  hideLoadingInfo,
  prepareCountryInfo,
} from "./utils/utils.js";

const refs = {
  inputEl: document.querySelector("#search-box"),
  countryList: document.querySelector(".country-list"),
  countryInfo: document.querySelector(".country-info"),
  loadingInfo: document.querySelector(".js-loading-info"),
};

function handleInputChange(event) {
  const inputValue = event.target.value.trim();
  refs.countryInfo.innerHTML = "";
  refs.countryList.innerHTML = "";
  // If input is empty
  if (!inputValue) {
    hideLoadingInfo();
    return;
  }

  let fetchResult;
  // If the search was in Ukrainian we don't need to filter it
  let isFilterNeccessary = true;
  // If Ukrainian language
  if (inputValue.charCodeAt(0) >= 1072) {
    isFilterNeccessary = false;
    // Get codes of matched countries
    const listOfCodes = findCountriesCodesInUkrainian(inputValue).toString();
    // If nothing matched
    if (listOfCodes.length === 0) {
      refs.countryList.innerHTML = "";
      hideLoadingInfo();
      Notify.failure(noMatchesMessage, notiflixOpts);
      return;
    }
    // Fetch with list of countries' codes
    fetchResult = fetchCountriesInfo({
      requestUrl: requestCodesUrl,
      filter: filterParams,
      listOfCodes,
    });
  } else {
    //If English language - fetch directly with entered in input value
    fetchResult = fetchCountriesInfo({
      requestUrl: requestNameUrl,
      countryName: inputValue,
      filter: filterParams,
    });
  }

  fetchResult
    .then((arrayOfCountries) => {
      console.log(arrayOfCountries);

      let processedArrayOfCountries;

      if (isFilterNeccessary) {
        // Filter name matching only with name.official and name.common
        processedArrayOfCountries = filterResult(arrayOfCountries, inputValue);
      } else {
        processedArrayOfCountries = arrayOfCountries;
      }
      // Add property with country name in Ukrainian
      processedArrayOfCountries = addUkrNameToResult(processedArrayOfCountries);

      // console.log(processedArrayOfCountries);

      // If there were no matches (including checking name.official and name.common)
      if (processedArrayOfCountries.length === 0) {
        Notify.failure(noMatchesMessage, notiflixOpts);
        return;
      }
      // If only one country matches
      if (processedArrayOfCountries.length === 1) {
        renderCountryInfo(processedArrayOfCountries[0]);
        return;
      }
      // If 2 - 10 countries match
      if (processedArrayOfCountries.length <= 10) {
        sessionStorageApi.save(LOCAL_STORAGE_KEY, processedArrayOfCountries);
        renderCountryList(processedArrayOfCountries);
        return;
      }
      // If more than 10 countries match
      if (processedArrayOfCountries.length > 10) {
        Notify.info(exceedLimitMatchesMessage, notiflixOpts);
      }
    })
    .catch(handleBadResponse);
}

function fetchCountriesInfo({
  requestUrl,
  countryName = "",
  filter = "",
  listOfCodes = "",
}) {
  const codes = listOfCodes ? "codes=" + listOfCodes + "&" : "";
  return fetch(`${requestUrl}${countryName}?${codes}${filter}`).then(
    (response) => {
      hideLoadingInfo();
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.status);
      }
    }
  );
}

function handleBadResponse(error) {
  // If get bad response
  switch (error.message) {
    case "Failed to fetch":
      Notify.failure(canntFetchMessage, notiflixOpts);
      break;
    case "404":
      Notify.failure(noMatchesMessage, notiflixOpts);
      break;
    default:
      Notify.failure(badResponse, notiflixOpts);
      console.log(error);
  }
}

// Additionally filters the result by checking matches only with name.official and name.common properties
function filterResult(arrayOfCountries, inputValue) {
  return arrayOfCountries.filter(
    ({ name }) =>
      name.official.toLowerCase().includes(inputValue.toLowerCase()) ||
      name.common.toLowerCase().includes(inputValue.toLowerCase())
  );
}

function findCountriesCodesInUkrainian(inputValue) {
  const listOfCodes = [];
  const inputValueLowCase = inputValue.toLowerCase();
  for (const country of ukrCountryList) {
    if (country.ukrNameLowCase.includes(inputValueLowCase)) {
      listOfCodes.push(country.numericCode);
    }
  }
  return listOfCodes;
}

// Add property with name in Ukrainian to resulting array of countries
function addUkrNameToResult(arrayOfCountries) {
  const newArray = [...arrayOfCountries];
  for (const country of newArray) {
    country.ukrName = codesListUkr[country.ccn3];
  }
  return newArray;
}

// Show on page info about chosen country (When only one country matches or user clicked directly
// on country name in list)
function renderCountryInfo(country) {
  // Process resulting object with country info and prepare it for rendering with handlebars template func
  const preparedInfo = prepareCountryInfo(country);
  refs.countryInfo.innerHTML = countryInfoTpl(preparedInfo);
  handleShowMoreInformation();
}

// Add action to button show more
function handleShowMoreInformation() {
  refs.showMoreBtn = document.querySelector(".show-more");
  refs.showMoreBtn.addEventListener("click", function callback({ target }) {
    showLoadingInfo();
    // Fetch all info about country by ccn3 code
    fetchMoreInfoAboutCountry(target.dataset.ccn3);
    refs.showMoreBtn.removeEventListener("click", callback);
  });
}

// Fetch all info about selected country by ccn3 code when user clicked showmore button
function fetchMoreInfoAboutCountry(ccn3) {
  // Remove show more button
  refs.showMoreBtn.parentNode.removeChild(refs.showMoreBtn);
  fetch(`${requestCodesUrl}${ccn3}`)
    .then((response) => {
      hideLoadingInfo();
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.status);
      }
    })
    .then((countryInfo) => {
      if (countryInfo.length !== 1) {
        console.log("Fetch Error " + countryInfo.length);
        return;
      }
      renderMoreInfo(countryInfo[0]);
      console.log(countryInfo);
    })
    .catch(handleBadResponse);
}

function renderMoreInfo(countryInfo) {
  console.log(countryInfo);
  const preparedCountryInfo = prepareCountryInfo(countryInfo);
  refs.countryInfo.insertAdjacentHTML(
    "beforeend",
    extendedCountryInfoTpl(preparedCountryInfo)
  );
}

function renderCountryList(arrayOfCountries) {
  refs.countryList.innerHTML = countryListTpl({ countries: arrayOfCountries });
}

function handleCountryListClick({ target }) {
  const button = target.closest(".link");
  if (!button) return;
  const index = +button.dataset.index;
  const savedCountryList = sessionStorageApi.load(LOCAL_STORAGE_KEY);
  if (!savedCountryList) {
    return;
  }
  refs.countryList.innerHTML = "";
  renderCountryInfo(savedCountryList[index]);
}

refs.loadingInfo.insertAdjacentText("beforeend", loadingMessage);
refs.inputEl.addEventListener("input", showLoadingInfo);
refs.countryList.addEventListener("click", handleCountryListClick);
refs.inputEl.addEventListener(
  "input",
  debounce(handleInputChange, DEBOUNCE_DELAY)
);
