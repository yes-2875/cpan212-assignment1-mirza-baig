import { HttpError } from '../lib/http-error.js';

export function parseCity(value) {
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
  
  return city;
}

// TODO (you): check ?cities= and return an array of trimmed city names. Throw a
// 400 HttpError with details.cities when it breaks a rule from the assignment page.
export function parseCities(value) {
  
  // Error if the cities parameter was never provided
  if (!value || value === null || value === undefined) {
    throw new HttpError(400, 'Invalid query', {cities: 'cities was not provided'});
  }
  
  let cities = value;
  
  // Error if the cities parameter was provided more than once
  if (typeof cities === 'object') {
    throw new HttpError(400, 'Invalid query', {cities: 'cities cannot be repeated'});
  }
  
  if (typeof cities === 'string') {
    // Error if the cities parameter is empty
    if (value.trim() === '') {
      throw new HttpError(400, 'Invalid query', {cities: 'cities cannot be empty'});
    }
    
    // Trim the initial query string and split its contents into an array
    // using the comma sign (,) as a separator between them
    cities = value.trim().split(',');
  }
  
  // For comparing redundant city names
  const prevCities = [];
  
  // Loop through cities array
  for (let i = 0; i < cities.length; i++) {
    
    // Compare each city name to all previous city names in the array
    // This runs before actually assigning the city to the list of previous city names
    for (const previous of prevCities) {
      if (cities[i].toLowerCase() === previous) {
        throw new HttpError(400, 'Invalid query', {cities: 'cities cannot contain duplicate city names'});
      }
    }
    
    // Trim whitespace at start and end of each city name
    cities[i] = cities[i].trim();
    prevCities[i] = cities[i].toLowerCase();
    
    
    // Error if any of the city names are empty (trailing commas)
    if (cities[i] === '') {
      throw new HttpError(400, 'Invalid query', {cities: 'cities cannot contain an empty name or trailing commas'});
    }
    
    // Error if any of the city names are not between 2 and 60 characters
    if (!(cities[i].length >= 2 && cities.length <= 60)) {
      throw new HttpError(400, 'Invalid query', {cities: 'all city names must be from 2 to 60 characters'});
    }
  }
  
  // Error if user queried less than 2 or more than 5 city names
  if (!(cities.length >= 2 && cities.length <= 5)) {
    throw new HttpError(400, 'Invalid query', {cities: 'cities must only include 2 to 5 city names'});
  }
  
  return cities;
}
