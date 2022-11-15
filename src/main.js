import debounce from "lodash.debounce";

import StorageMdl from "./js/modules/storageMdl.js";
import DataProcessMdl from "./js/modules/dataProcessMdl.js";
import FetchMdl from "./js/modules/fetchMdl.js";
import RenderMdl from "./js/modules/renderMdl.js";
import RefsMdl from "./js/modules/refsMdl.js";
import NotifyMdl from "./js/modules/notifyMdl.js";
import PixabayMdl from "./js/modules/pixabayMdl.js";

import Params from "./js/utils/params.js";

import "simplelightbox/dist/simple-lightbox.css";

function handleInputChange(event) {
  // "Clean" input value
  const processedValue = DataProcessMdl.inputProcessing(event.target.value);
  // Clear all rendered information
  RenderMdl.cleanOutput();
  // If input is empty
  if (!processedValue) {
    NotifyMdl.hideLoadingInfo();
    return;
  }
  let fetchResult = null;
  // If the search was in Ukrainian we don't need to filter it
  let isFilterNeccessary = true;
  // If Ukrainian language
  if (processedValue.charCodeAt(0) >= 1072) {
    isFilterNeccessary = false;
    // Get codes of matched countries
    const listOfCodes =
      DataProcessMdl.findCountriesCodesInUkrainian(processedValue);
    // If nothing matched
    if (listOfCodes.length === 0) {
      NotifyMdl.showNotification(Params.noMatchesMessage, "failure");
      return;
    } else if (listOfCodes.length > Params.LIMIT_LIST_RESULT) {
      NotifyMdl.showNotification(Params.exceedLimitMatchesMessage, "info");
      return;
    }
    // Fetch with list of countries' codes
    fetchResult = FetchMdl.prepareToFetch({
      listOfCodes: listOfCodes.toString(),
      filter: true,
    });
  } else {
    //If English language - fetch directly with entered in input value
    fetchResult = FetchMdl.prepareToFetch({
      nameToFind: processedValue,
      filter: true,
    });
  }
  processFetchResult({ fetchResult, isFilterNeccessary, processedValue });
}

function processFetchResult({
  fetchResult,
  isFilterNeccessary,
  processedValue,
}) {
  fetchResult
    .then((arrayOfCountries) => {
      console.log(arrayOfCountries);
      NotifyMdl.hideLoadingInfo();
      // Filter name matching only with name.official and name.common
      const filteredArrayOfCountries = isFilterNeccessary
        ? DataProcessMdl.filterResult(arrayOfCountries, processedValue)
        : arrayOfCountries;
      // If there were no matches (including checking name.official and name.common)
      if (filteredArrayOfCountries.length === 0) {
        RenderMdl.cleanOutput();
        NotifyMdl.showNotification(Params.noMatchesMessage, "failure");
        return;
      }
      // If only one country matches
      if (filteredArrayOfCountries.length === 1) {
        const preparedCountryInfo = DataProcessMdl.prepareCountryInfo({
          countryInfo: filteredArrayOfCountries[0],
          short: true,
        });
        console.log(preparedCountryInfo);
        PixabayMdl.saveQueriesForPixabay(preparedCountryInfo);
        RenderMdl.renderCountryInfo(preparedCountryInfo);
        handleShowMoreInformation();
        return;
      }
      // If 2 - 10 countries match
      if (filteredArrayOfCountries.length <= Params.LIMIT_LIST_RESULT) {
        DataProcessMdl.processListOfCountries(filteredArrayOfCountries);
        // Save result to Session Storage
        StorageMdl.save(Params.LOCAL_STORAGE_KEY, filteredArrayOfCountries);
        RenderMdl.renderCountryList(filteredArrayOfCountries);
        return;
      }
      // If more than 10 countries match
      if (filteredArrayOfCountries.length > 10) {
        RenderMdl.cleanOutput();
        NotifyMdl.showNotification(Params.exceedLimitMatchesMessage, "info");
      }
    })
    .catch(handleBadResponse);
}

function handleCountryListClick({ target }) {
  const button = target.closest(".country-list__btn");
  if (!button) return;
  const index = +button.dataset.index;
  const savedCountryList = StorageMdl.load(Params.LOCAL_STORAGE_KEY);
  if (!savedCountryList) {
    return;
  }
  RenderMdl.cleanOutput();
  const preparedCountryInfo = DataProcessMdl.prepareCountryInfo({
    countryInfo: savedCountryList[index],
    short: true,
  });
  PixabayMdl.saveQueriesForPixabay(preparedCountryInfo);
  RenderMdl.renderCountryInfo(preparedCountryInfo);
  handleShowMoreInformation();
}

// Add action to button show more
function handleShowMoreInformation() {
  const showMoreBtn = document.querySelector(".card__button");
  showMoreBtn.addEventListener("click", function callback({ target }) {
    NotifyMdl.showLoadingInfo();
    target.parentNode.removeChild(target);

    // Fetch links for gallery
    PixabayMdl.getPixabayInfoForMarkup().then((arrResults) => {
      // Get random images for gallery
      const arrImagesForGallery = PixabayMdl.getArrayForGallery(arrResults);
      console.log(arrImagesForGallery);
      if (arrImagesForGallery.length > 0) {
        RenderMdl.renderGallery(arrImagesForGallery);
        // Initialize lightbox
        RefsMdl.lightboxInstance = PixabayMdl.initLightBox();
      }
    });

    // Fetch all info about country by ccn3 code
    FetchMdl.prepareToFetch({ listOfCodes: target.dataset.ccn3 })
      .then((countryInfo) => {
        NotifyMdl.hideLoadingInfo();
        const preparedCountryInfo = DataProcessMdl.prepareCountryInfo({
          countryInfo: countryInfo[0],
        });

        RenderMdl.renderMoreInfo(preparedCountryInfo);
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
RefsMdl.inputEl.addEventListener("focus", handleInputChange);
RefsMdl.countryListEl.addEventListener("click", handleCountryListClick);
RefsMdl.inputEl.addEventListener(
  "input",
  debounce(handleInputChange, Params.DEBOUNCE_DELAY)
);
