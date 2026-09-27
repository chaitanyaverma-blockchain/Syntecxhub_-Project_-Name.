/**
 * Loader — smooth animated loading indicator.
 * Shown while weather data is being fetched.
 */
function Loader() {
  return (
    <div className="loader-container" id="loader">
      <div className="loader-spinner"></div>
      <p className="loader-text">Fetching weather data...</p>
    </div>
  );
}

export default Loader;
