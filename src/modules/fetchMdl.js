import Params from "../utils/params.js";
import NotifyMdl from "./notifyMdl.js";
function fetchToServer({ listOfCodes, nameToFind, filter }) {
  const filterParams = filter ? Params.filterParams : "";
  if (listOfCodes) {
    return fetchCountriesInfo({
      listOfCodes,
      requestUrl: Params.requestCodesUrl,
      filterParams,
    });
  } else if (nameToFind) {
    return fetchCountriesInfo({
      nameToFind,
      requestUrl: Params.requestNameUrl,
      filterParams,
    });
  }
}

function fetchCountriesInfo({
  requestUrl,
  nameToFind = "",
  filterParams = "",
  listOfCodes = "",
}) {
  const codes = listOfCodes ? "codes=" + listOfCodes + "&" : "";

  return fetch(`${requestUrl}${nameToFind}?${codes}${filterParams}`).then(
    (response) => {
      NotifyMdl.hideLoadingInfo();
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

export default {
  handleBadResponse,
  fetchToServer,
};
