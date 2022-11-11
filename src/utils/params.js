const DEBOUNCE_DELAY = 600;

const LIMIT_LIST_RESULT = 10;

const LOCAL_STORAGE_KEY = "countries";

const loadingMessage = "Please wait while minions do their work :)";

const requestNameUrl = "https://restcountries.com/v3.1/name/";

const requestCodesUrl = "https://restcountries.com/v3.1/alpha/";

const filterParams = new URLSearchParams({
  fields: "name,capital,population,flags,languages,ccn3",
});

const notiflixOpts = {
  showOnlyTheLastOne: true,
  clickToClose: true,
  timeout: 6000,
  fontSize: "20px",
  width: "500px",
};

const noMatchesMessage = "Oops, there is no country with that name";

const badResponse = "Something went wrong...";

const canntFetchMessage = "Sorry, it looks like the server isn't available...";
const exceedLimitMatchesMessage =
  "Too many matches found. Please enter a more specific name.";

export default {
  DEBOUNCE_DELAY,
  LIMIT_LIST_RESULT,
  LOCAL_STORAGE_KEY,
  loadingMessage,
  requestCodesUrl,
  requestNameUrl,
  filterParams,
  notiflixOpts,
  noMatchesMessage,
  badResponse,
  canntFetchMessage,
  exceedLimitMatchesMessage,
};
