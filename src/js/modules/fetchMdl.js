import Params from "../utils/params.js";
function prepareToFetch({ listOfCodes, nameToFind, filter, images }) {
  const filterParams = filter ? Params.filterParams : "";
  if (listOfCodes) {
    return fetchCountriesInfo(
      `${Params.requestCodesUrl}?${"codes=" + listOfCodes + "&"}${filterParams}`
    );
  } else if (nameToFind) {
    return fetchCountriesInfo(
      `${Params.requestNameUrl}${nameToFind}?${filterParams}`
    );
  } else if (images) {
    return fetchCountriesInfo(
      `${Params.requestImagesUrl}?${Params.pixabayParams}&q=${images}`
    );
  }
}

function fetchCountriesInfo(queryUrl) {
  return fetch(queryUrl).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(response.status);
    }
  });
}

export default {
  prepareToFetch,
};
