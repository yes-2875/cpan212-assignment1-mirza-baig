import { HttpError } from '../lib/http-error.js';

// TODO (you): check ?city= and return the trimmed city name. Throw a 400
// HttpError with details.city when it breaks a rule from the assignment page.
export function parseCity(value) {
  
  console.log("city:", value, "of type:", typeof value);
  
  if (!value || value === null || value === undefined) {
    throw new HttpError(400, 'Invalid query', {city: 'city was not provided'});
  }
  
  let city = value;
  if (typeof city === 'string') { city = value.trim(); }
  
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
  throw new Error('parseCities is not written yet');
}
