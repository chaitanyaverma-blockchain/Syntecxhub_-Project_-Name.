import { getIconUrl } from '../services/weatherApi';

/**
 * WeatherCard — a single forecast day card.
 * Shows the day name, icon, temperature, and condition.
 */
function WeatherCard({ day }) {
  // Format date string to readable day name (e.g., "Mon, Sep 28")
  const dateObj = new Date(day.date + 'T12:00:00');
  const dayName = dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="weather-card">
      <p className="card-day">{dayName}</p>
      <img
        src={getIconUrl(day.icon)}
        alt={day.description}
        className="card-icon"
        width="60"
        height="60"
      />
      <p className="card-temp">{day.temperature}°C</p>
      <p className="card-condition">{day.condition}</p>
    </div>
  );
}

export default WeatherCard;
