import debounce from "lodash.debounce";

import StorageMdl from "./modules/storageMdl.js";
import DataProcessMdl from "./modules/dataProcessMdl.js";
import FetchMdl from "./modules/fetchMdl.js";
import RenderMdl from "./modules/renderMdl.js";
import RefsMdl from "./modules/refsMdl.js";
import NotifyMdl from "./modules/notifyMdl.js";

import Params from "./utils/params.js";

import "./css/styles.css";
import "./css/three-dots.css";

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
      DataProcessMdl.findCountriesCodesInUkrainian(processedValue).toString();
    // If nothing matched
    if (listOfCodes.length === 0) {
      NotifyMdl.showNotification(Params.noMatchesMessage, "failure");
      return;
    } else if (listOfCodes.length > Params.LIMIT_LIST_RESULT) {
      NotifyMdl.showNotification(Params.exceedLimitMatchesMessage, "info");
      return;
    }
    // Fetch with list of countries' codes
    fetchResult = FetchMdl.fetchToServer({ listOfCodes, filter: true });
  } else {
    //If English language - fetch directly with entered in input value
    fetchResult = FetchMdl.fetchToServer({
      nameToFind: processedValue,
      filter: true,
    });
  }
  fetchResult
    .then((arrayOfCountries) => {
      // console.log(arrayOfCountries);
      NotifyMdl.hideLoadingInfo();
      // Filter name matching only with name.official and name.common
      const filteredArrayOfCountries = isFilterNeccessary
        ? DataProcessMdl.filterResult(arrayOfCountries, processedValue)
        : arrayOfCountries;
      // Add property with country name in Ukrainian
      const ukrNamesArrayOfCountries = DataProcessMdl.addUkrNameToResult(
        filteredArrayOfCountries
      );
      // If there were no matches (including checking name.official and name.common)
      if (ukrNamesArrayOfCountries.length === 0) {
        RenderMdl.cleanOutput();
        NotifyMdl.showNotification(Params.noMatchesMessage, "failure");
        return;
      }
      // If only one country matches
      if (ukrNamesArrayOfCountries.length === 1) {
        const preparedCountryInfo = DataProcessMdl.prepareCountryInfo(
          ukrNamesArrayOfCountries[0]
        );
        RenderMdl.renderCountryInfo(preparedCountryInfo);
        handleShowMoreInformation();
        return;
      }
      // If 2 - 10 countries match
      if (ukrNamesArrayOfCountries.length <= Params.LIMIT_LIST_RESULT) {
        // Save result to Session Storage
        StorageMdl.save(Params.LOCAL_STORAGE_KEY, ukrNamesArrayOfCountries);
        RenderMdl.renderCountryList(ukrNamesArrayOfCountries);
        return;
      }
      // If more than 10 countries match
      if (ukrNamesArrayOfCountries.length > 10) {
        RenderMdl.cleanOutput();
        NotifyMdl.showNotification(Params.exceedLimitMatchesMessage, "info");
      }
    })
    .catch(handleBadResponse);
}

function handleCountryListClick({ target }) {
  const button = target.closest(".link");
  if (!button) return;
  const index = +button.dataset.index;
  const savedCountryList = StorageMdl.load(Params.LOCAL_STORAGE_KEY);
  if (!savedCountryList) {
    return;
  }
  RenderMdl.cleanOutput();
  const preparedCountryInfo = DataProcessMdl.prepareCountryInfo(
    savedCountryList[index]
  );
  RenderMdl.renderCountryInfo(preparedCountryInfo);
  handleShowMoreInformation();
}

// Add action to button show more
function handleShowMoreInformation() {
  const showMoreBtn = document.querySelector(".show-more");
  showMoreBtn.addEventListener("click", function callback({ target }) {
    NotifyMdl.showLoadingInfo();
    target.parentNode.removeChild(target);
    // Fetch all info about country by ccn3 code
    FetchMdl.fetchToServer({ listOfCodes: target.dataset.ccn3 })
      .then((countryInfo) => {
        NotifyMdl.hideLoadingInfo();
        const preparedCountryInfo = DataProcessMdl.prepareCountryInfo(
          countryInfo[0]
        );
        RenderMdl.renderMoreInfo(preparedCountryInfo);
        // console.log(preparedCountryInfo);
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
