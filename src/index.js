import debounce from "lodash.debounce";
import sessionStorageApi from "./utils/sessionStorage.js";
import countryInfoTpl from "./templates/countryInfo.hbs";
import extendedCountryInfoTpl from "./templates/extendedCountryInfo.hbs";
import countryListTpl from "./templates/countryList.hbs";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import {
  notiflixOpts,
  noMatchesMessage,
  canntFetchMessage,
  exceedLimitMatchesMessage,
  searchParams,
  DEBOUNCE_DELAY,
  requestNameUrl,
  requestCapitalUrl,
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

function requestCountries(event) {
  const inputValue = event.target.value.trim();
  refs.countryInfo.innerHTML = "";
  refs.countryList.innerHTML = "";
  if (!inputValue) {
    hideLoadingInfo();
    return;
  }
  fetch(`${requestNameUrl}${inputValue}?${searchParams}`)
    .then((response) => {
      hideLoadingInfo();
      if (response.ok) {
        return response.json();
      } else {
        console.log(response);
        throw new Error(response.status);
      }
    })
    .then((arrayOfCountries) => {
      // console.log(arrayOfCountries);
      const filteredArrayOfCountries = filterResult(
        arrayOfCountries,
        inputValue
      );
      console.log(filteredArrayOfCountries);
      if (filteredArrayOfCountries.length === 0) {
        Notify.failure(noMatchesMessage, notiflixOpts);
        return;
      }
      if (filteredArrayOfCountries.length === 1) {
        renderCountryInfo(filteredArrayOfCountries[0]);
        return;
      }

      if (filteredArrayOfCountries.length <= 10) {
        sessionStorageApi.save(LOCAL_STORAGE_KEY, filteredArrayOfCountries);
        renderCountryList(filteredArrayOfCountries);
        return;
      }

      if (filteredArrayOfCountries.length > 10) {
        Notify.info(exceedLimitMatchesMessage, notiflixOpts);
      }
    })
    .catch((error) => {
      switch (error.message) {
        case "Failed to fetch":
          Notify.failure(canntFetchMessage, notiflixOpts);
          break;
        case "404":
          Notify.failure(noMatchesMessage, notiflixOpts);
          break;
      }
    });
}

function filterResult(arrayOfCountries, inputValue) {
  return arrayOfCountries.filter(
    ({ name }) =>
      name.official.toLowerCase().includes(inputValue.toLowerCase()) ||
      name.common.toLowerCase().includes(inputValue.toLowerCase())
  );
}

function renderCountryInfo(country) {
  const preparedInfo = prepareCountryInfo(country);
  refs.countryInfo.innerHTML = countryInfoTpl(preparedInfo);
  handleShowMoreInformation();
}

function handleShowMoreInformation() {
  refs.showMoreBtn = document.querySelector(".show-more");
  refs.showMoreBtn.addEventListener("click", showLoadingInfo);
  refs.showMoreBtn.addEventListener("click", function callback({ target }) {
    fetchMoreInfoAboutCountry(target.dataset.capital);
    console.log("click");
    refs.showMoreBtn.removeEventListener("click", callback);
    refs.showMoreBtn.removeEventListener("click", showLoadingInfo);
  });
}

function fetchMoreInfoAboutCountry(capitalName) {
  refs.showMoreBtn.parentNode.removeChild(refs.showMoreBtn);
  fetch(`${requestCapitalUrl}${capitalName}`)
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
    .catch((error) => {
      console.log(error);
    });
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
  debounce(requestCountries, DEBOUNCE_DELAY)
);
