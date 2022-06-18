"use strict";

const endpoint = "https://restcountries.com/v3.1/all";
const countries = [];

const input = document.querySelector(".search");
const suggestions = document.querySelector(".suggestions");

const nameSection = document.querySelector(".name");
const populationSection = document.querySelector(".population");
const languageSection = document.querySelector(".language");
const currencySection = document.querySelector(".currency");
const regionSection = document.querySelector(".region");
const flagSection = document.querySelector(".flag");
const capitalSection = document.querySelector(".capital");
const closeBtn = document.querySelector(".close");
const infoSection = document.querySelector(".country-info-modal");

fetch(endpoint)
  .then((response) => {
    if (!response) {
      throw new Error("Could'nt get the data");
    }
    return response.json();
  })
  .then((data) => {
    data.forEach((country) => countries.push(country));
  });

const findMatches = function (wordToMatch, countries) {
  return countries.filter((country) => {
    const regex = new RegExp(wordToMatch, "gi");
    return country.name.common.match(regex);
  });
};
const numberWithCommas = function (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
const displayMatches = function () {
  suggestions.innerHTML = "";
  const resultArr = findMatches(this.value, countries);
  const html = resultArr
    .map((country) => {
      const countryName = country.name.common;

      return `<li>
    <span class="name">${countryName}</span>
    
    </li>`;
    })
    .join("");
  suggestions.innerHTML = html;
};

const getCountryInfo = async function (e) {
  const countryName = e.target
    .closest("li")
    .textContent.split(",")[0]
    .replace(/\n/, "")
    .trim();
  if (countryName === "Click on to the country name") return;
  const res = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
  const data = await res.json();
  const name = data[0].name.common;
  const language = Object.entries(data[0].languages)[0][1];
  const currency = Object.entries(data[0].currencies)[0][1].name;
  const population = numberWithCommas(data[0].population);
  const flag = data[0].flags.png;
  const capital = data[0].capital[0];
  const region = data[0].region;
  nameSection.textContent = name;
  languageSection.textContent = `Language: ${language}`;
  populationSection.textContent = `Population: ${population}`;
  currencySection.textContent = `Currency: ${currency}`;
  regionSection.textContent = `Region: ${region}`;
  capitalSection.textContent = `Capital: ${capital}`;
  flagSection.src = `${flag}`;
  infoSection.style.display = "flex";
};

input.addEventListener("keyup", displayMatches);
suggestions.addEventListener("click", getCountryInfo);
closeBtn.addEventListener("click", function () {
  infoSection.style.display = "none";
  nameSection.textContent = "";
  populationSection.textContent = "";
  regionSection.textContent = "";
  currencySection.textContent = "";
  flagSection.textContent = "";
  capitalSection.textContent = "";
});
