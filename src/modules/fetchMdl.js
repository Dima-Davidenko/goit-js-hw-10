import Params from "../utils/params.js";
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
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.status);
      }
    }
  );
}

export default {
  fetchToServer,
};
