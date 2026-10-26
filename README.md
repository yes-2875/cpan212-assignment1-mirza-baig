# City Weather API

This Express.js service retrieves weather info to the user with the help of Open-Meteo, a free weather API with no key required, and a cache to prevent redundant API calls. Any city that the user searches weather information for gets turned into coordinates, which are then used to receive forecasting information and return a clean summary in a JSON response.

## Run it

1. If you haven't already retrieved the repository code do so like this:
```bash
git clone https://github.com/yes-2875/cpan212-assignment1-mirza-baig
```

2. Navigate into the repository directory:
```bash
cd cpan212-assignment1-mirza-baig
```

3. Install the required Node.js modules, copy the example environment variables over to `.env`, and run the project:
```bash
npm install
cp .env.example .env
npm start
```

## Environment variables

| Variable           | Default value                           | What it does
|--------------------|-----------------------------------------|-----------------------------------------
| PORT               | 4000                                    | Sets the port number of the server
| GEOCODING_URL      | https://geocoding-api.open-meteo.com/v1 | Sets the URL of the geocoding API
| FORECAST_URL       | https://api.open-meteo.com/v1           | Sets the URL of the weather forecast API
| UPSTEAM_TIMEOUT_MS | 5000                                    | Sets the amount of time before an API request is timed out and aborted
| CACHE_TTL_SECONDS  | 600                                     | Sets the amount of seconds a cached API request has before expiry

## Endpoints

| Endpoint               | Example request             | Response description
|------------------------|-----------------------------|----------------
| `GET /api/weather`     | `/api/weather?city=Toronto` | Location details (`location`), current weather forecast of today (`current`) and an array of the next 3 days of weather forecast (`daily`).
| `GET /api/compare`     | `/api/compare?cities=Toronto,Vancouver,Halifax` | An array (`cities`) of details of all requested cities, each including the city name (`city`), request status (`ok`), the actual forecast details (`weather`), an `error` object describing details of any failed request, and a summary of how many requests failed and succeeded including which city was the warmest and coldest.
| `GET /api/cache/stats` | `/api/cache/stats` | A summary of the API cache, including how many requests are in the cache unexpired (`entries`), how many API requests successfully hit the cache (`hits`), how many missed the cache (`misses`) as fresh requests, and the time to live of every cache entry in seconds (`ttlSeconds`). 
## Testing

Here is a list of all of the `cURL` requests to run on the server, along with their expected status codes:

```bash
# Weather for a city: 200 OK
curl -i "http://localhost:4000/api/weather?city=Toronto"

# Weather for the same city again (cached): 200 OK
curl -i "http://localhost:4000/api/weather?city=Toronto"

# Weather without a city: 400 Bad Request
curl -i "http://localhost:4000/api/weather"

# Weather for a city that doesn't exist: 404 Not Found
curl -i "http://localhost:400/api/weather?city=Qwertyville"

# Compare weather of three cities: 200 OK
curl -i "http://localhost:4000/api/compare?cities=Toronto,Etobicoke,Halifax"

# Compare with one city that doesn't exist: 200 OK
curl -i "http://localhost:4000/api/compare?cities=Toronto,Etobicoke,Qwertyville"

# Compare too many cities: 400 Bad Request
curl -i "http://localhost:4000/api/compare?cities=Toronto,Etobicoke,Vancouver,Halifax,Edmonton,Winnipeg"

# Compare with a repeated city: 400 Bad Request
curl -i "http://localhost:4000/api/compare?cities=Toronto,Etobicoke,Halifax,Etobicoke"

# Report cache statss: 200 OK
curl -i "http://localhost:4000/api/cache/stats"

# GET an unknown route: 404 Not Found
curl -i "http://localhost:4000/api/invalid"
```

## Data source

Credits to the Open-Meteo weather API (https://open-meteo.com) where all weather forecast data is extracted from for use in this Express service.

## AI use

Google Gemini:
- Explained why the `fetchHelper` function in `open-meteo.js` was not actually passing any HttpErrors thrown from itself into the error handler: the try-catch was trapping them in so I added a condition that if `err` was an HttpError, it should be actually thrown into the error handler.
