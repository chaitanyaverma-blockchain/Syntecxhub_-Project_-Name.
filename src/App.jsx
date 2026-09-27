import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import { fetchCurrentWeather, fetchForecast } from './services/weatherApi';

/**
 * App — main component.
 * Manages state for weather data, loading, and errors.
 * Orchestrates the search → fetch → display flow.
 */
function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  /**
   * Search handler — called when user submits a city name.
   * Fetches both current weather and forecast in parallel.
   */
  async function handleSearch(city) {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      // Fetch current weather and forecast at the same time
      const [weatherData, forecastData] = await Promise.all([
        fetchCurrentWeather(city),
        fetchForecast(city),
      ]);

      setCurrentWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      // Handle network errors (e.g., no internet)
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
      setCurrentWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  }

  function dismissError() {
    setError(null);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">
          <span className="title-icon">🌤️</span> Weather App
        </h1>
        <p className="app-subtitle">Search any city to get the current weather and forecast</p>
      </header>

      <main className="app-main">
        <SearchBar onSearch={handleSearch} isLoading={loading} />

        {error && <ErrorMessage message={error} onDismiss={dismissError} />}

        {loading && <Loader />}

        {!loading && !error && currentWeather && (
          <>
            <CurrentWeather data={currentWeather} />
            <Forecast data={forecast} />
          </>
        )}

        {/* Default state — before any search */}
        {!loading && !error && !hasSearched && (
          <div className="default-state" id="default-state">
            <div className="default-icon">🌤️</div>
            <h2>Welcome!</h2>
            <p>Enter a city name above to check the weather.</p>
          </div>
        )}

        {/* Empty state — searched but no results (cleared after error) */}
        {!loading && !error && hasSearched && !currentWeather && (
          <div className="default-state" id="empty-state">
            <div className="default-icon">🔍</div>
            <h2>No results</h2>
            <p>Try searching for another city.</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Weather data provided by <a href="https://www.weatherapi.com/" target="_blank" rel="noopener noreferrer">WeatherAPI.com</a></p>
      </footer>
    </div>
  );
}

export default App;
