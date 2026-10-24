import { config } from '../config.js';
import { HttpError } from './http-error.js';

// Helper function for fetching Open-Meteo API requests.
// Handles multiple different types of errors and sends them
// to the error handler middleware.
async function fetchHelper(url) {
  try {
    const res = await fetch(url, {signal: AbortSignal.timeout(config.upstreamTimeoutMs)});
    
    // Throw 502 Bad Gateway error for a status that is not ok,
    // report original status code in message
    if (!res.ok) {
      throw new HttpError(502, `Failed to fetch Open-Meteo API: ${res.status} (${res.statusText})`);
    }
    
    return res.json();
    
  } catch (error) {
    // Throw general errors
    if (error instanceof HttpError) {
      throw error;
    }
    
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

export async function geocodeCity(name) {
  const searchParams = new URLSearchParams({ name, count: 1, language: 'en', format: 'json' });
  const search = await fetchHelper(`${config.geocodingUrl}/search?${searchParams}`);
  
  if (!search.results) {
    throw new HttpError(404, `No geocoding data found for city ${name}`);
  }
  
  return search.results[0];
}

// TODO (you): get the current weather and a 3-day daily forecast from the
// forecast API and return the parsed response.
export async function getForecast(latitude, longitude) {
  const searchParams = new URLSearchParams({latitude, longitude});
  const url = `${config.forecastUrl}/forecast?${searchParams}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=3`;
  
  const search = await fetchHelper(url);
  
  if (!search.current) {
    throw new HttpError(404, `No forecast data found for latitude ${latitude}, longitude ${longitude}`);
  }
  
  console.log(search);
  return {current: search.current, daily: search.daily};
}
