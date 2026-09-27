import { getIconUrl } from '../services/weatherApi';

/**
 * CurrentWeather — displays the main weather information card.
 * Shows city, country, temperature, condition, and detail stats.
 */
function CurrentWeather({ data }) {
  if (!data) return null;

  return (
    <section className="current-weather" id="current-weather">
      <div className="current-weather-main">
        <div className="current-weather-info">
          <h2 className="city-name">
            {data.city}, <span className="country">{data.country}</span>
          </h2>
          <p className="temperature">{data.temperature}°C</p>
          <p className="condition">{data.description}</p>
        </div>
        <div className="current-weather-icon">
          <img
            src={getIconUrl(data.icon)}
            alt={data.description}
            width="100"
            height="100"
          />
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-label">Feels Like</span>
          <span className="detail-value">{data.feelsLike}°C</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{data.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Wind</span>
          <span className="detail-value">{data.windSpeed} m/s</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Pressure</span>
          <span className="detail-value">{data.pressure} hPa</span>
        </div>
        {data.visibility !== null && (
          <div className="detail-item">
            <span className="detail-label">Visibility</span>
            <span className="detail-value">{data.visibility} km</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default CurrentWeather;
