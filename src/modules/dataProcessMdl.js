import { ukrCountryList } from "../utils/countryList.js";

function inputProcessing(inputValue) {
  return inputValue.trim();
}

function prepareCountryInfo(countryInfo) {
  const newInfo = { ...countryInfo };

  newInfo.ukrName = ukrCountryList[newInfo.ccn3];

  if (newInfo?.languages) {
    const arrayLanguages = Object.values(newInfo.languages);
    newInfo.arrayLanguages = prepareArrayForRendering(arrayLanguages);
  }

  if (newInfo?.capital) {
    newInfo.arrayCapitals = prepareArrayForRendering(newInfo.capital);
    newInfo.firstCapital = newInfo.capital[0];
  }

  if (countryInfo.altSpellings) {
    newInfo.altSpellings = prepareArrayForRendering(newInfo.altSpellings);
    newInfo.altSpellings.shift();
  }

  if (newInfo.population) {
    newInfo.population = splitNumber(newInfo.population);
  }

  if (newInfo.area) {
    newInfo.area = splitNumber(newInfo.area);
  }

  if (newInfo.currencies) {
    newInfo.currenciesArray = [];
    const keys = Object.keys(newInfo.currencies);
    for (const key of keys) {
      newInfo.currenciesArray.push(newInfo.currencies[key].name);
    }
    newInfo.currenciesArray = prepareArrayForRendering(newInfo.currenciesArray);
  }
  if (newInfo?.car?.side) {
    newInfo.trafficDirection =
      newInfo?.car?.side === "left" ? "Лівосторонній" : "Правосторонній";
  }

  return newInfo;
}

// Add property with name in Ukrainian to resulting array of countries
function addUkrNameToResult(arrayOfCountries) {
  const newArray = [...arrayOfCountries];
  for (const country of newArray) {
    country.ukrName = ukrCountryList[country.ccn3];
  }
  return newArray;
}

function prepareArrayForRendering(array) {
  const newArray = [...array];
  for (let i = 0; i < newArray.length - 1; i += 1) {
    newArray[i] += ",";
  }
  return newArray;
}

function splitNumber(number) {
  const arrayStringNumber = ("" + number).split("");
  for (let i = arrayStringNumber.length - 1, j = 1; i >= 0; i -= 1, j += 1) {
    arrayStringNumber[i] =
      j % 3 === 0 ? " " + arrayStringNumber[i] : arrayStringNumber[i];
  }
  return arrayStringNumber.join("");
}

function findCountriesCodesInUkrainian(inputValue) {
  const listOfCodes = [];
  const inputValueLowCase = inputValue.toLowerCase();
  const keys = Object.keys(ukrCountryList);
  keys.forEach((key) => {
    if (ukrCountryList[key].toLowerCase().includes(inputValueLowCase)) {
      listOfCodes.push(key);
    }
  });
  // for (const country of ukrCountryList) {
  //   if (country.ukrNameLowCase.includes(inputValueLowCase)) {
  //     listOfCodes.push(country.numericCode);
  //   }
  // }
  return listOfCodes;
}

// Additionally filters the result by checking matches only with name.official and name.common properties
function filterResult(arrayOfCountries, inputValue) {
  return [...arrayOfCountries].filter(
    ({ name }) =>
      name.official.toLowerCase().includes(inputValue.toLowerCase()) ||
      name.common.toLowerCase().includes(inputValue.toLowerCase())
  );
}

export default {
  inputProcessing,
  prepareArrayForRendering,
  prepareCountryInfo,
  addUkrNameToResult,
  findCountriesCodesInUkrainian,
  filterResult,
};
