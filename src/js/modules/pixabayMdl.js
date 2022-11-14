import StorageMdl from "./storageMdl.js";
import FetchMdl from "./fetchMdl.js";
import SimpleLightbox from "simplelightbox";

import Params from "../utils/params.js";

function initLightBox() {
  return new SimpleLightbox(...Params.lightboxParams);
}

function getPixabayInfoForMarkup() {
  const pixabayQueries = getQueries().map((query) =>
    FetchMdl.prepareToFetch({ images: query })
  );
  return Promise.allSettled(pixabayQueries);
}

function getArrayForGallery(arrResults) {
  // console.log(arrResults);
  const filteredResults = arrResults.filter(
    ({ status }) => status === "fulfilled"
  );
  const allImages = filteredResults.flatMap(({ value }) => value.hits);
  console.log(allImages);
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

function getQueries() {
  return StorageMdl.load(Params.PIXABAY_STORAGE_KEY);
}

function createPixabayQueries(countryInfo) {
  const queries = [
    `${countryInfo.name.common} people`,
    `${countryInfo.name.common} nature`,
    countryInfo.name.common,
  ];
  if (countryInfo.capital.length === 1) {
    queries.push(`City ${countryInfo.capital[0]}`);
  }
  return queries;
}

function saveQueriesForPixabay(countryInfo) {
  StorageMdl.save(
    Params.PIXABAY_STORAGE_KEY,
    createPixabayQueries(countryInfo)
  );
}

export default {
  getPixabayInfoForMarkup,
  createPixabayQueries,
  saveQueriesForPixabay,
  getArrayForGallery,
  initLightBox,
};
