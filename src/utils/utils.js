import { codesListUkr } from "./codesListUkr.js";

const loadingInfo = document.querySelector(".js-loading-info");

export function showLoadingInfo() {
  hideNotify();
  loadingInfo.classList.remove("invisible");
}

export function hideLoadingInfo() {
  loadingInfo.classList.add("invisible");
}

export function prepareCountryInfo(countryInfo) {
  const newInfo = { ...countryInfo };

  countryInfo.ukrName = codesListUkr[countryInfo.ccn3];

  if (newInfo?.languages) {
    const arrayLanguages = Object.values(newInfo.languages);
    newInfo.arrayLanguages = prepareArrayForRendering(arrayLanguages);
  }
  if (newInfo?.capital) {
    newInfo.arrayCapitals = prepareArrayForRendering(newInfo.capital);
    newInfo.firstCapital = newInfo.capital[0];
  }

  if (countryInfo.altSpellings) {
    newInfo.altSpellings = prepareArrayForRendering(countryInfo.altSpellings);
    newInfo.altSpellings.shift();
  }

  if (countryInfo.population) {
    newInfo.population = splitNumber(newInfo.population);
  }

  if (countryInfo.area) {
    newInfo.area = splitNumber(newInfo.area);
  }

  if (countryInfo.currencies) {
    newInfo.currenciesArray = [];
    const keys = Object.keys(countryInfo.currencies);
    for (const key of keys) {
      newInfo.currenciesArray.push(countryInfo.currencies[key].name);
    }
    newInfo.currenciesArray = prepareArrayForRendering(newInfo.currenciesArray);
  }

  newInfo.trafficDirection =
    countryInfo?.car?.side === "left" ? "Лівосторонній" : "Правосторонній";
  return newInfo;
}

function prepareArrayForRendering(array) {
  const newArray = [...array];
  for (let i = 0; i < newArray.length - 1; i += 1) {
    newArray[i] += ",";
  }
  return newArray;
}

function hideNotify() {
  const notifyMessage = document.getElementById("NotiflixNotifyWrap");
  if (notifyMessage) notifyMessage.style.opacity = 0;
}

function splitNumber(number) {
  const arrayStringNumber = ("" + number).split("");
  for (let i = arrayStringNumber.length - 1, j = 1; i >= 0; i -= 1, j += 1) {
    arrayStringNumber[i] =
      j % 3 === 0 ? " " + arrayStringNumber[i] : arrayStringNumber[i];
  }
  return arrayStringNumber.join("");
}
