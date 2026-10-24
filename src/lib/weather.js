import { config } from '../config.js';
import { geocodeCity, getForecast } from './open-meteo.js';
import { describeWeatherCode } from './weather-codes.js';

// TODO (you): create one cache for the whole app, with a time to live of
// config.cacheTtlSeconds.

// TODO (you): return the weather summary for one city, in the shape shown on
// the assignment page. Check the cache first. On a miss, geocode the city, get
// the forecast, build the summary, store it, and return it with cached: false.
// On a hit, return the stored summary with cached: true.
export async function getCityWeather(city) {
  
  const rawGeocode = await geocodeCity(city);
  
  const {name, longitude, latitude, country, timezone} = rawGeocode;
  
  const rawForecast = await getForecast(longitude, latitude);
  
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
    fetchedAt: Date.now(),
    cached: false,
  };
  
  return data;
  
}

// TODO (you): return the cache statistics for GET /api/cache/stats.
export function getCacheStats() {
  throw new Error('getCacheStats is not written yet');
}
