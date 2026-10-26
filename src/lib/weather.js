import { config } from '../config.js';
import { geocodeCity, getForecast } from './open-meteo.js';
import { describeWeatherCode } from './weather-codes.js';
import { Cache } from './cache.js';

// Create a new Cache with config.cacheTtlSeconds amount of TTL seconds
const cache = new Cache(config.cacheTtlSeconds);

// Returns the weather summary for one city, in the appropriate JSON shape
// as required. Checks if the city is in the cache first, if it's there
// and the entry hasn't expired then that will be returned with cached: true.
// Otherwise geocode the city, get the forecast, build the summary,
// store it in the cache, and return it with cached: false.
export async function getCityWeather(city) {
  
  const cached = cache.retrieve(city.toLowerCase());
  
  if (cached) {
    return cached;
  }
  
  const rawGeocode = await geocodeCity(city);
  const {name, longitude, latitude, country, timezone} = rawGeocode;
  
  const rawForecast = await getForecast(latitude, longitude);
  const { time, temperature_2m, apparent_temperature,
  relative_humidity_2m, wind_speed_10m, weather_code } = rawForecast.current;
  
  const daily = rawForecast.daily;
  let days = [];
  
  for (let i = 0; i < daily.time.length; i++) {
    days[i] = {};
    
    days[i].date = daily.time[i];
    days[i].minC = daily.temperature_2m_min[i];
    days[i].maxC = daily.temperature_2m_max[i];
    days[i].percipitationChancePercent = daily.precipitation_probability_max[i] || null;
    days[i].weatherCode = daily.weather_code[i];
    days[i].conditions = describeWeatherCode(daily.weather_code[i]);
  }
  
  const data = {
    location: {
      name,
      region: rawGeocode.admin1 || null,
      country,
      latitude,
      longitude,
      timezone
    },
    
    current: {
      time,
      temperatureC: temperature_2m,
      feelsLike: apparent_temperature,
      humidityPercent: relative_humidity_2m,
      windKmh: wind_speed_10m,
      weatherCode: weather_code,
      conditions: describeWeatherCode(weather_code),
    },
    
    daily: days,
    fetchedAt: new Date().toISOString(),
    cached: false,
  };
  
  cache.store(city.toLowerCase(), data);
  return data;
  
}

// Returns the cache statistics for GET /api/cache/stats.
export function getCacheStats() {
  return cache.reportStats();
}
