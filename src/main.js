import debounce from "lodash.debounce";

import DataProcessMdl from "./js/modules/dataProcessMdl.js";
import FetchMdl from "./js/modules/fetchMdl.js";
import RenderMdl from "./js/modules/renderMdl.js";
import RefsMdl from "./js/modules/refsMdl.js";
import NotifyMdl from "./js/modules/notifyMdl.js";
import PixabayMdl from "./js/modules/pixabayMdl.js";

import Params from "./js/utils/params.js";
import DataStorage from "./js/utils/dataStorage.js";

import "simplelightbox/dist/simple-lightbox.css";

function handleInputChange(event) {
  // "Clean" input value
  DataStorage.processedValue = DataProcessMdl.inputProcessing(
    event.target.value
  );
  // Clear all rendered information
  RenderMdl.cleanOutput();
  // If input is empty
  if (!DataStorage.processedValue) {
    NotifyMdl.hideLoadingInfo();
    return;
  }
  // If the search was in Ukrainian we don't need to filter it
  DataStorage.isFilterNeccessary = true;
  // If Ukrainian language
  if (DataStorage.processedValue.charCodeAt(0) >= 1072) {
    handleCyrillicInput();
  } else {
    DataStorage.fetchResult = FetchMdl.fetchCountriesByName({
      nameToFind: DataStorage.processedValue,
      filter: true,
    });
  }
  if (DataStorage.fetchResult) {
    handleFetchResult();
  }
}

function handleCyrillicInput() {
  DataStorage.isFilterNeccessary = false;
  // Get codes of matched countries
  const listOfCodes = DataProcessMdl.findCountriesCodesInUkrainian(
    DataStorage.processedValue
  );
  // If nothing matched
  if (listOfCodes.length === 0) {
    NotifyMdl.showNotification(Params.noMatchesMessage, "failure");
    DataStorage.fetchResult = null;
    return;
  } else if (listOfCodes.length > Params.LIMIT_LIST_RESULT) {
    NotifyMdl.showNotification(Params.exceedLimitMatchesMessage, "info");
    DataStorage.fetchResult = null;
    return;
  }
  DataStorage.fetchResult = FetchMdl.fetchCountriesByCodes({
    listOfCodes: listOfCodes.toString(),
    filter: true,
  });
}

function handleFetchResult() {
  DataStorage.fetchResult
    .then((arrayOfCountries) => {
      // console.log(arrayOfCountries);
      NotifyMdl.hideLoadingInfo();
      // Filter name matching only with name.official and name.common
      DataStorage.filteredArrayOfCountries = DataStorage.isFilterNeccessary
        ? DataProcessMdl.filterResult(
            arrayOfCountries,
            DataStorage.processedValue
          )
        : arrayOfCountries;
      // If there were no matches (including checking name.official and name.common)
      if (DataStorage.filteredArrayOfCountries.length === 0) {
        RenderMdl.cleanOutput();
        NotifyMdl.showNotification(Params.noMatchesMessage, "failure");
        return;
      }
      // If only one country matches
      if (DataStorage.filteredArrayOfCountries.length === 1) {
        DataStorage.oneCountryInfo = DataProcessMdl.prepareCountryInfo({
          countryInfo: DataStorage.filteredArrayOfCountries[0],
          short: true,
        });
        // console.log(DataStorage.oneCountryInfo);
        RenderMdl.renderCountryInfo();
        handleShowMoreInformation();
        return;
      }
      // If 2 - 10 countries match
      if (
        DataStorage.filteredArrayOfCountries.length <= Params.LIMIT_LIST_RESULT
      ) {
        DataProcessMdl.processListOfCountries(
          DataStorage.filteredArrayOfCountries
        );
        RenderMdl.renderCountryList();
        return;
      }
      // If more than 10 countries match
      if (
        DataStorage.filteredArrayOfCountries.length > Params.LIMIT_LIST_RESULT
      ) {
        RenderMdl.cleanOutput();
        NotifyMdl.showNotification(Params.exceedLimitMatchesMessage, "info");
      }
    })
    .catch(handleBadResponse);
}

function handleCountryListClick({ target }) {
  const button = target.closest(".country-list__btn");
  if (!button) return;
  // Get index of chosen country
  const index = +button.dataset.index;
  RenderMdl.cleanOutput();
  DataStorage.oneCountryInfo = DataProcessMdl.prepareCountryInfo({
    countryInfo: DataStorage.filteredArrayOfCountries[index],
    short: true,
  });
  // PixabayMdl.saveQueriesForPixabay(preparedCountryInfo);
  RenderMdl.renderCountryInfo();
  handleShowMoreInformation();
}

// Add action to button show more
function handleShowMoreInformation() {
  const showMoreBtn = document.querySelector(".card__button");
  showMoreBtn.addEventListener("click", function callback({ target }) {
    NotifyMdl.showLoadingInfo();
    target.parentNode.removeChild(target);

    PixabayMdl.renderGallery();

    // Fetch all info about country by ccn3 code
    FetchMdl.fetchCountriesByCodes({ listOfCodes: target.dataset.ccn3 })
      .then((extendedCountryInfo) => {
        DataStorage.extendedOneCountryInfo = extendedCountryInfo[0];
        NotifyMdl.hideLoadingInfo();
        DataStorage.extendedOneCountryInfo = DataProcessMdl.prepareCountryInfo({
          countryInfo: DataStorage.extendedOneCountryInfo,
        });

        RenderMdl.renderMoreInfo();
      })
      .catch(handleBadResponse);

    showMoreBtn.removeEventListener("click", callback);
  });
}

function handleBadResponse(error) {
  // If get bad response
  RenderMdl.cleanOutput();
  switch (error.message) {
    case "Failed to fetch":
      NotifyMdl.showNotification(Params.canntFetchMessage, "failure");
      break;
    case "404":
      NotifyMdl.showNotification(Params.noMatchesMessage, "failure");
      break;
    default:
      NotifyMdl.showNotification(Params.badResponse, "failure");
      console.log(error);
  }
}

RefsMdl.loadingInfoEl.insertAdjacentText("beforeend", Params.loadingMessage);

RefsMdl.inputEl.addEventListener("input", NotifyMdl.showLoadingInfo);
RefsMdl.countryListEl.addEventListener("click", handleCountryListClick);
RefsMdl.inputEl.addEventListener(
  "input",
  debounce(handleInputChange, Params.DEBOUNCE_DELAY)
);
