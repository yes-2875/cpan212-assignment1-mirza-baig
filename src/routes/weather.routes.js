import { Router } from 'express';
import { getCityWeather } from '../lib/weather.js';
import { parseCity, parseCities } from '../validators/weather-query.js';

export const weatherRouter = Router();

// GET /api/weather?city=Toronto
// Validate with parseCity, get the summary with getCityWeather,
// and respond with { data, attribution }
weatherRouter.get('/weather', async (req, res) => {
  const {city} = req.query;
  parseCity(city);
  const data = await getCityWeather(city);
  
  res.status(200).json({data, attribution: 'Weather data by Open-Meteo.com (https://open-meteo.com/)'});
});

// GET /api/compare?cities=Toronto,Vancouver,Halifax
// Validate with parseCities, start every lookup at once with Promise.allSettled,
// build the cities array and the summary described on the assignment instructions.
weatherRouter.get('/compare', async (req, res) => {
  const cities = parseCities(req.query.cities);
  
  // Promise.allSettled() with an array of weather lookup calls of each city
  // ensures that any failed requests are still included.
  const results = await Promise.allSettled(cities.map((city) => (getCityWeather(city))));
  
  let data = {cities: [], summary: {}};
  let succeeded = 0; // Count of succeeded requests
  let failed = 0; // Count of failed requests
  
  // Names of the warmest and coldest cities
  let warmest = null;
  let coldest = null;
  
  // Values of the warmest and coldest temperatures
  // (set to infinities for easier comparison)
  let warmestTemp = -Infinity;
  let coldestTemp = Infinity;
  
  for (let i = 0; i < results.length; i++) {
    
    const result = results[i];
    if (result.status === 'fulfilled') {
      
      // Add the correct JSON shape for a successful city.
      const weather = result.value;
      data.cities.push({city: weather.location.name, ok: true, weather});
      succeeded++;
      
      // Compare the warmestTemp and coldestTemp values with the current temperature.
      // Set warmestTemp to current temperature if it's warmer than the last and assign
      // the warmest city name to the current city. Vice-versa for coldestTemp and coldest.
      const tempC = weather.current.temperatureC;
      if (tempC > warmestTemp) { warmestTemp = tempC; warmest = weather.location.name; }
      if (tempC < coldestTemp) { coldestTemp = tempC; coldest = weather.location.name; }
      
      // If any cities tie in the comparison then
      // just set the warmest/coldest names to the current city name
      if (tempC === warmestTemp) { warmest = weather.location.name; }
      if (tempC === coldestTemp) { coldest = weather.location.name; }
      
    } else {
      // If any weather lookup request was failed just send the following JSON shape that displays why it failed.
      data.cities.push({city: cities[i], ok: false, error: {status: result.reason.status, message: result.reason.message}});
      failed++;
    }
  }
  
  data.summary = {succeeded, failed, warmest, coldest};
  res.status(200).json({data, attribution: 'Weather data by Open-Meteo.com (https://open-meteo.com/)'});
});
