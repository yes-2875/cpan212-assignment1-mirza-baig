import { config } from '../config.js';
import { HttpError } from './http-error.js';

// This is the only file that calls fetch or knows Open-Meteo's URLs.
// The exact requests are on the assignment page.

async function fetchHelper(url) {
  let res;
  try {
    res = await fetch(url, {signal: AbortSignal.timeout(config.upstreamTimeoutMs)});
    
    // Throw 502 Bad Gateway error for a status that is not ok,
    // report original status code in message
    if (!res.ok) {
      throw new HttpError(502, `Failed to fetch Open-Meteo API: ${res.status} (${res.statusText})`);
    }
    
    return res.json();
    
  } catch (error) {
    // Throw 504 Timed Out error if the AbortSignal timeout fired during the request
    if (error.name === 'TimeoutError') {
      throw new HttpError(504, 'The Open-Meteo API took too long to answer, try again later');
    }
    
    // Throw 502 Bad Gateway error for invalid JSON response
    if (error.name === 'SyntaxError') {
      throw new HttpError(502, `Failed to fetch Open-Meteo API: Not JSON (${error.message})`);
    }
    
    // Throw 502 Bad Gateway error for network failures
    // (no response, unknown host, refused connection, no network)
    if (error.name === 'TypeError' && error.message === 'fetch failed') {
      throw new HttpError(502, `Network failure on Open-Meteo API: ${error.cause}`);
    }
  }
}

// TODO (you): look up a city with the geocoding API and return
// { name, region, country, latitude, longitude, timezone } for the first result.
// Throw a 404 HttpError when there are no results.
export async function geocodeCity(name) {
  const searchParams = new URLSearchParams({ name, count: 1, language: 'en', format: 'json' });
  const search = await fetchHelper(`${config.geocodingUrl}/search?${searchParams}`);
  
  if (!search.results) {
    throw new HttpError(404, `No geocoding data found for city ${name}`);
  }
  
  const {cityName, latitude, longitude, country, timezone, admin1} = search.results;
  
  return {
    name: cityName,
    region: admin1,
    country,
    latitude,
    longitude,
    timezone    
  };
}

// TODO (you): get the current weather and a 3-day daily forecast from the
// forecast API and return the parsed response.
export async function getForecast(latitude, longitude) {
  throw new Error('getForecast is not written yet');
}
