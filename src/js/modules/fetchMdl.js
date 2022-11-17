const COUNTRIES_BASE_URL = "https://restcountries.com/v3.1/";

const PIXABAY_BASE_URL = "https://pixabay.com/api/";

const pixabayParams = {
  key: "30822635-da19196ea06d6070ef0548dd1",
  lang: "en",
  image_type: "photo",
  orientation: "horizontal",
  safesearch: true,
  per_page: 200,
};

const countriesFilterParams = new URLSearchParams({
  fields: "name,capital,population,flags,languages,ccn3",
});

function fetchCountriesByName({ nameToFind, filter }) {
  const filters = filter ? countriesFilterParams : "";
  return fetch(`${COUNTRIES_BASE_URL}name/${nameToFind}?${filters}`).then(
    processResponse
  );
}
function fetchCountriesByCodes({ listOfCodes, filter }) {
  const filters = filter ? countriesFilterParams : "";
  const codesToFind = new URLSearchParams({ codes: listOfCodes });
  return fetch(`${COUNTRIES_BASE_URL}alpha/?${codesToFind}&${filters}`).then(
    processResponse
  );
}

function fetchPictures({ query }) {
  const fullPixabayParams = new URLSearchParams({
    ...pixabayParams,
    q: query,
  });
  return fetch(`${PIXABAY_BASE_URL}?${fullPixabayParams}`).then(
    processResponse
  );
}

function processResponse(response) {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(response.status);
  }
}

export default {
  fetchCountriesByName,
  fetchCountriesByCodes,
  fetchPictures,
};
