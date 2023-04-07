import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

import { fetchCountries } from './fetchCountries.js';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener(
  'input',
  debounce(onCountryInput, DEBOUNCE_DELAY)
);

function onCountryInput(evt) {
  let country = evt.target.value.trim();
  if (country.length === 0) {
    return;
  }
  refs.countryListEl.innerHTML = '';
  refs.countryInfoEl.innerHTML = '';
  fetchCountries(country)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length >= 2) {
        const markup = data
          .map(el => {
            return `<li><img  width='48' src=${
              el.flags.svg
            } alt=${(el.flags.alt = 'none')}></img><h3>${
              el.name.official
            }</h3></li>`;
          })
          .join('');
        refs.countryListEl.innerHTML = markup;
      } else {
        refs.countryListEl.innerHTML = '';
        const markup = data
          .map(el => {
            return `<ul style='font-size: 28px; line-height: 2;'><li><img src=${
              el.flags.svg
            } width='96'><h3 style='font-size: 48px;}'>${
              el.name.official
            }</h3></li>
            <li><strong>Capital: </strong>${el.capital}</li>
            <li><strong>Populations: </strong>${el.population}</li>
            <li><strong>Languages: </strong>${Object.values(el.languages).join(
              ', '
            )}</li></ul>`;
          })
          .join('');
        refs.countryInfoEl.innerHTML = markup;
      }
    })
    .catch(err => {
      if (err.message == 404) {
        Notify.failure('Oops, there is no country with that name');
      }
    });
}
