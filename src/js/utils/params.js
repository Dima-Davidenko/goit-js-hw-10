const DEBOUNCE_DELAY = 600;

const LIMIT_LIST_RESULT = 12;

const GALLERY_SIZE = 9;

const LOCAL_STORAGE_KEY = "countries";

const PIXABAY_STORAGE_KEY = "countries";

const loadingMessage = "Please wait while minions do their work :)";

const noMatchesMessage = "Oops, there is no country with that name";

const requestNameUrl = "https://restcountries.com/v3.1/name/";

const requestCodesUrl = "https://restcountries.com/v3.1/alpha/";

const requestImagesUrl = "https://pixabay.com/api/";

const pixabayApiKey = "30822635-da19196ea06d6070ef0548dd1";

const lightboxParams = [
  ".gallery__container a",
  {
    captionsData: "alt",
    captionDelay: 250,
    animationSlide: false,
    animationSpeed: 500,
    maxZoom: 5,
  },
];

const pixabayParams = new URLSearchParams({
  key: pixabayApiKey,
  lang: "en",
  image_type: "photo",
  orientation: "horizontal",
  safesearch: true,
  page: 1,
  per_page: 10,
});

const filterParams = new URLSearchParams({
  fields: "name,capital,population,flags,languages,ccn3",
});

const notiflixOpts = {
  showOnlyTheLastOne: true,
  clickToClose: true,
  timeout: 1000006000,
  width: "500px",
  className: "notify-options",
  position: "center-top",
};

const badResponse = "Something went wrong...";

const canntFetchMessage = "Sorry, it looks like the server isn't available...";
const exceedLimitMatchesMessage =
  "Too many matches found. Please enter a more specific name.";

export default {
  DEBOUNCE_DELAY,
  LIMIT_LIST_RESULT,
  LOCAL_STORAGE_KEY,
  GALLERY_SIZE,
  loadingMessage,
  requestCodesUrl,
  requestNameUrl,
  filterParams,
  notiflixOpts,
  noMatchesMessage,
  badResponse,
  canntFetchMessage,
  exceedLimitMatchesMessage,
  requestImagesUrl,
  pixabayParams,
  PIXABAY_STORAGE_KEY,
  lightboxParams,
};
