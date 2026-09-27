/**
 * Weather API Service
 *
 * All API calls live here, separated from UI components.
 * Uses WeatherAPI.com:
 *   - Current weather: /v1/current.json
 *   - Forecast: /v1/forecast.json
 *   - City autocomplete: /v1/search.json
 *
 * The API key is read from the VITE_WEATHER_API_KEY environment variable.
 * Create a `.env` file in the project root:
 *   VITE_WEATHER_API_KEY=your_api_key_here
 */

const BASE_URL = 'https://api.weatherapi.com/v1';

/**
 * Read the API key from Vite environment variables.
 * Vite exposes env vars prefixed with VITE_ on import.meta.env.
 */
function getApiKey() {
  const key = import.meta.env.VITE_WEATHER_API_KEY;
  if (!key) {
    throw new Error(
      'Missing API key. Add VITE_WEATHER_API_KEY to your .env file.'
    );
  }
  return key;
}

/**
 * Fetch city suggestions for autocomplete.
 * Called as the user types in the search bar.
 * @param {string} query — partial city name (e.g. "Lon")
 * @returns {Array} array of suggestion objects { name, country, region }
 */
export async function fetchCitySuggestions(query) {
  const apiKey = getApiKey();
  const url = `${BASE_URL}/search.json?key=${apiKey}&q=${encodeURIComponent(query)}`;

  const response = await fetch(url);

  if (!response.ok) return [];

  const data = await response.json();

  // Return clean suggestion objects
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    region: item.region,
    country: item.country,
    // Full display label for the dropdown
    label: item.region
      ? `${item.name}, ${item.region}, ${item.country}`
      : `${item.name}, ${item.country}`,
  }));
}

/**
 * Fetch current weather for a city.
 * @param {string} city — city name (e.g. "London")
 * @returns {object} parsed weather data
 */
export async function fetchCurrentWeather(city) {
  const apiKey = getApiKey();
  const url = `${BASE_URL}/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`;

  const response = await fetch(url);
  const data = await response.json();

  // WeatherAPI.com returns error object on failure
  if (data.error) {
    if (data.error.code === 1006) {
      throw new Error(`City "${city}" not found. Please check the spelling.`);
    }
    if (data.error.code === 2006 || data.error.code === 2008) {
      throw new Error('Invalid API key. Please check your configuration.');
    }
    throw new Error(data.error.message || 'Weather API error. Please try again.');
  }

  // Return a clean, UI-friendly object
  return {
    city: data.location.name,
    country: data.location.country,
    temperature: Math.round(data.current.temp_c),
    feelsLike: Math.round(data.current.feelslike_c),
    humidity: data.current.humidity,
    pressure: data.current.pressure_mb,
    windSpeed: data.current.wind_kph,
    visibility: data.current.vis_km,
    condition: data.current.condition.text,
    description: data.current.condition.text,
    icon: data.current.condition.icon,
  };
}

/**
 * Fetch forecast for a city.
 * WeatherAPI.com free tier provides up to 3 days of forecast.
 * @param {string} city — city name
 * @returns {Array} array of daily forecast objects
 */
export async function fetchForecast(city) {
  const apiKey = getApiKey();
  // Free tier supports up to 3 days; use 3
  const url = `${BASE_URL}/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=3`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.error) {
    if (data.error.code === 1006) {
      throw new Error(`City "${city}" not found.`);
    }
    throw new Error(data.error.message || 'Forecast API error. Please try again.');
  }

  // Skip today, return remaining forecast days
  const today = new Date().toISOString().split('T')[0];

  return data.forecast.forecastday
    .filter((day) => day.date !== today)
    .map((day) => ({
      date: day.date,
      temperature: Math.round(day.day.avgtemp_c),
      tempMin: Math.round(day.day.mintemp_c),
      tempMax: Math.round(day.day.maxtemp_c),
      condition: day.day.condition.text,
      description: day.day.condition.text,
      icon: day.day.condition.icon,
    }));
}

/**
 * Helper: build the full icon URL.
 * WeatherAPI.com returns protocol-relative URLs like "//cdn.weatherapi.com/..."
 * @param {string} iconPath — e.g. "//cdn.weatherapi.com/weather/64x64/day/116.png"
 * @returns {string} full URL to the weather icon
 */
export function getIconUrl(iconPath) {
  if (!iconPath) return '';
  // Add https: if the URL starts with //
  if (iconPath.startsWith('//')) {
    return `https:${iconPath}`;
  }
  return iconPath;
}
