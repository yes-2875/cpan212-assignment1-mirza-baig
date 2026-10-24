import { Router } from 'express';
import { getCityWeather } from '../lib/weather.js';
import { parseCity } from '../validators/weather-query.js';

export const weatherRouter = Router();

// TODO (you): GET /api/weather?city=Toronto
// Validate with parseCity, get the summary with getCityWeather, and respond
// with { data, attribution }. Routes never call fetch themselves.
weatherRouter.get('/weather', (req, res) => {
  const {city} = req.query;
  const data = getCityWeather(city);
  
  res.status(200).json({data, attribution: 'Weather data by Open-Meteo.com (https://open-meteo.com/)'});
});

// TODO (you): GET /api/compare?cities=Toronto,Vancouver,Halifax
// Validate with parseCities, start every lookup at once with Promise.allSettled,
// then build the cities array and the summary described on the assignment page.
weatherRouter.get('/compare', (req, res) => {
  res.status(501).json({ error: { message: 'Not written yet: GET /api/compare' } });
});
