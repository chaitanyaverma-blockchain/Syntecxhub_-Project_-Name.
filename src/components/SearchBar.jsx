import { useState, useEffect, useRef } from 'react';
import { fetchCitySuggestions } from '../services/weatherApi';

/**
 * SearchBar — city search input with autocomplete suggestions.
 * Fetches suggestions as the user types (debounced to avoid excessive API calls).
 */
function SearchBar({ onSearch, isLoading }) {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const wrapperRef = useRef(null);
  const debounceTimer = useRef(null);

  // Fetch suggestions as the user types (debounced by 300ms)
  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const trimmed = city.trim();

    // Need at least 2 characters to search
    if (trimmed.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        const results = await fetchCitySuggestions(trimmed);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        setActiveSuggestion(-1);
      } catch {
        // Silently fail — suggestions are not critical
        setSuggestions([]);
      }
    }, 300);

    // Cleanup timer on unmount or re-run
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [city]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = city.trim();
    if (trimmed) {
      onSearch(trimmed);
      setShowSuggestions(false);
    }
  }

  function handleSuggestionClick(suggestion) {
    setCity(suggestion.name);
    setShowSuggestions(false);
    onSearch(suggestion.name);
  }

  function handleKeyDown(e) {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Enter' && activeSuggestion >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[activeSuggestion]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} ref={wrapperRef}>
      <div className="search-input-wrapper">
        <input
          id="city-input"
          type="text"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          autoComplete="off"
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-dropdown" role="listbox">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.id}
                className={`suggestion-item ${index === activeSuggestion ? 'active' : ''}`}
                onClick={() => handleSuggestionClick(suggestion)}
                role="option"
                aria-selected={index === activeSuggestion}
              >
                <span className="suggestion-city">{suggestion.name}</span>
                <span className="suggestion-meta">
                  {suggestion.region ? `${suggestion.region}, ` : ''}
                  {suggestion.country}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button id="search-button" type="submit" disabled={isLoading || !city.trim()}>
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}

export default SearchBar;
