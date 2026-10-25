import { Router } from 'express';
import { getCityWeather } from '../lib/weather.js';
import { parseCity, parseCities } from '../validators/weather-query.js';

export const weatherRouter = Router();

// TODO (you): GET /api/weather?city=Toronto
// Validate with parseCity, get the summary with getCityWeather, and respond
// with { data, attribution }. Routes never call fetch themselves.
weatherRouter.get('/weather', async (req, res) => {
  const {city} = req.query;
  parseCity(city);
  const data = await getCityWeather(city);
  
  res.status(200).json({data, attribution: 'Weather data by Open-Meteo.com (https://open-meteo.com/)'});
});

// TODO (you): GET /api/compare?cities=Toronto,Vancouver,Halifax
// Validate with parseCities, start every lookup at once with Promise.allSettled,
// then build the cities array and the summary described on the assignment page.
weatherRouter.get('/compare', async (req, res) => {
  const cities = parseCities(req.query.cities);
  const results = await Promise.allSettled(cities.map((city) => (getCityWeather(city))));
  
  let data = {cities: [], summary: {}};
  let succeeded, failed = 0;
  let warmest, coldest = null;
  let warmestTemp = -Infinity;
  let coldestTemp = Infinity;
  
  for (const result of results) {
    if (result.status === 'fulfilled') {
      
      const weather = result.value;
      data.cities.push({city: result.value.location.name, ok: true, weather});
      succeeded++;
      
      const tempC = weather.current.temperatureC;
      if (tempC > warmestTemp) { warmestTemp = tempC; warmest = weather.location.name; }
      if (tempC < coldestTemp) { coldestTemp = tempC; coldest = weather.location.name; }
      
    } else {
      data.cities.push({city: cities[i], ok: false, error: {status: result.reason.status, message: result.reason.message}});
      failed++;
    }
  }
  
  data.summary = {succeeded, failed, warmest, coldest};
  res.status(200).json({data, attribution: 'Weather data by Open-Meteo.com (https://open-meteo.com/)'});
});
