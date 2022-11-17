import DataStorage from "../utils/dataStorage.js";
import FetchMdl from "./fetchMdl.js";
import SimpleLightbox from "simplelightbox";
import RenderMdl from "./renderMdl.js";
import RefsMdl from "./refsMdl.js";

import Params from "../utils/params.js";

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

function renderGallery() {
  fetchPixabayInfoForMarkup().then((arrResults) => {
    // Get random images for gallery
    const arrImagesForGallery = getArrayForGallery(arrResults);
    // console.log(arrImagesForGallery);
    if (arrImagesForGallery.length > 0) {
      RenderMdl.renderGallery(arrImagesForGallery);
      // Initialize lightbox
      RefsMdl.lightboxInstance = new SimpleLightbox(...lightboxParams);
    }
  });
}

function fetchPixabayInfoForMarkup() {
  makeQueriesForPixabay();
  const multiplyFetchesToPixabay = DataStorage.pixabayQueries.map((query) =>
    FetchMdl.fetchPictures({ query })
  );
  return Promise.allSettled(multiplyFetchesToPixabay);
}

function getArrayForGallery(arrResults) {
  // console.log(arrResults);
  const filteredResults = arrResults.filter(
    ({ status }) => status === "fulfilled"
  );
  const allImages = filteredResults.flatMap(({ value }) => value.hits);
  // console.log(allImages);
  const listOfIDs = [];
  const uniqueImages = allImages.filter(({ id }) => {
    if (!listOfIDs.includes(id)) {
      listOfIDs.push(id);
      return true;
    }
  });
  if (uniqueImages.length <= Params.GALLERY_SIZE) return uniqueImages;
  const randomImagesForGallery = [];
  const listOfRandomNums = [];
  for (let i = 0; i < Params.GALLERY_SIZE; i += 1) {
    const randomNum = Math.floor(Math.random() * uniqueImages.length);
    if (!listOfRandomNums.includes(randomNum)) {
      randomImagesForGallery.push(uniqueImages[randomNum]);
      listOfRandomNums.push(randomNum);
      continue;
    }
    i -= 1;
  }
  return randomImagesForGallery;
}

function makeQueriesForPixabay() {
  const queries = [
    `${DataStorage.oneCountryInfo.name.common}+people`,
    `${DataStorage.oneCountryInfo.name.common}+nature`,
    DataStorage.oneCountryInfo.name.common,
  ];
  if (DataStorage.oneCountryInfo.capital.length === 1) {
    queries.push(`City+${DataStorage.oneCountryInfo.capital[0]}`);
  }
  DataStorage.pixabayQueries = queries;
}

export default {
  renderGallery,
};
