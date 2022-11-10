export const DEBOUNCE_DELAY = 600;

export const LOCAL_STORAGE_KEY = "countries";

export const loadingMessage = "Please wait while minions do their work :)";

export const requestNameUrl = "https://restcountries.com/v3.1/name/";

export const requestCodesUrl = "https://restcountries.com/v3.1/alpha/";

export const filterParams = new URLSearchParams({
  fields: "name,capital,population,flags,languages,ccn3",
});

export const notiflixOpts = {
  showOnlyTheLastOne: true,
  clickToClose: true,
  timeout: 6000,
  fontSize: "20px",
  width: "500px",
};

export const noMatchesMessage = "Oops, there is no country with that name";

export const badResponse = "Something went wrong...";

export const canntFetchMessage =
  "Sorry, it looks like the server isn't available...";
export const exceedLimitMatchesMessage =
  "Too many matches found. Please enter a more specific name.";
