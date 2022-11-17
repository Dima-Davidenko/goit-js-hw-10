import { ukrCountryList } from "../utils/countryList.js";

function inputProcessing(inputValue) {
  return inputValue.trim().toLowerCase();
}

function prepareCountryInfo({ countryInfo, short = false }) {
  const newInfo = { ...countryInfo };

  // Add property with country name in Ukrainian
  newInfo.ukrName = ukrCountryList[newInfo.ccn3];

  if (newInfo?.languages) {
    const arrayLanguages = Object.values(newInfo.languages);
    newInfo.arrayLanguages = prepareArrayForRendering(arrayLanguages);
  }

  if (newInfo?.capital) {
    newInfo.arrayCapitals = prepareArrayForRendering(newInfo.capital);
    newInfo.firstCapital = newInfo.capital[0] ? newInfo.capital[0] : null;
  }

  if (countryInfo?.altSpellings) {
    newInfo.altSpellings = prepareArrayForRendering(newInfo.altSpellings);
    newInfo.altSpellings.shift();
  }

  if (newInfo?.population) {
    newInfo.population = splitNumber(newInfo.population);
  }

  if (!short) {
    newInfo.area = newInfo?.area > 0 ? splitNumber(newInfo.area) : null;
    newInfo.coatOfArms = newInfo?.coatOfArms.svg ? newInfo.coatOfArms : null;
    if (newInfo?.currencies) {
      newInfo.currenciesArray = [];
      const keys = Object.keys(newInfo.currencies);
      for (const key of keys) {
        newInfo.currenciesArray.push(newInfo.currencies[key].name);
      }
      newInfo.currenciesArray = prepareArrayForRendering(
        newInfo.currenciesArray
      );
    }
    if (newInfo?.car?.side) {
      newInfo.trafficDirection =
        newInfo.car.side === "left" ? "Лівосторонній" : "Правосторонній";
    }
    newInfo.continent = newInfo?.continents.length
      ? newInfo.continents[0]
      : null;
  }

  return newInfo;
}

// Add property with name in Ukrainian to resulting array of countries
function processListOfCountries(arrayOfCountries) {
  arrayOfCountries.forEach(
    (country) => (country.ukrName = ukrCountryList[country.ccn3])
  );
}

function prepareArrayForRendering(array) {
  return [...array].map((item, index, arr) => {
    if (index !== arr.length - 1) {
      return item + ", ";
    }
    return item;
  });
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
  const keys = Object.keys(ukrCountryList);
  keys.forEach((key) => {
    if (ukrCountryList[key].toLowerCase().includes(inputValue)) {
      listOfCodes.push(key);
    }
  });
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
  prepareCountryInfo,
  processListOfCountries,
  findCountriesCodesInUkrainian,
  filterResult,
};
