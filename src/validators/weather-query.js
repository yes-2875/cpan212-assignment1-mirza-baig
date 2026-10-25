import { HttpError } from '../lib/http-error.js';

// TODO (you): check ?city= and return the trimmed city name. Throw a 400
// HttpError with details.city when it breaks a rule from the assignment page.
export function parseCity(value) {
  
  //console.log("city:", value, "of type:", typeof value);
  
  if (!value || value === null || value === undefined) {
    throw new HttpError(400, 'Invalid query', {city: 'city was not provided'});
  }
  
  let city = value;
  if (typeof city === 'string') { city = value.trim(); }
  
  if (city === '') {
    throw new HttpError(400, 'Invalid query', {city: 'city cannot be empty'});
  }
  
  if (!(city.length >= 2 && city.length <= 60)) {
    throw new HttpError(400, 'Invalid query', {city: 'city must be from 2 to 60 characters'});
  }
  
  if (typeof city === 'object') {
    throw new HttpError(400, 'Invalid query', {city: 'city cannot be repeated'});
  }
}

// TODO (you): check ?cities= and return an array of trimmed city names. Throw a
// 400 HttpError with details.cities when it breaks a rule from the assignment page.
export function parseCities(value) {
  
  if (!value || value === null || value === undefined) {
    throw new HttpError(400, 'Invalid query', {cities: 'cities was not provided'});
  }
  
  let cities = value;
  
  if (typeof cities === 'string') {
    if (value.trim() === '') {
      throw new HttpError(400, 'Invalid query', {cities: 'cities was empty'})
    }
    cities = value.trim().split(',');
  }
  
  for (i = 0; i < cities.length; i++) {
    cities[i] = cities[i].trim();
  }
}
