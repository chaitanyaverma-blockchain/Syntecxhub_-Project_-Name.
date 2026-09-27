import WeatherCard from './WeatherCard';

/**
 * Forecast — section that renders a row of WeatherCard components.
 */
function Forecast({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <section className="forecast" id="forecast">
      <h3 className="forecast-title">Upcoming Forecast</h3>
      <div className="forecast-cards">
        {data.map((day) => (
          <WeatherCard key={day.date} day={day} />
        ))}
      </div>
    </section>
  );
}

export default Forecast;
