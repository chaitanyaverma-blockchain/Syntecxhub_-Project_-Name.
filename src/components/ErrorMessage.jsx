/**
 * ErrorMessage — displays a user-friendly error message.
 * Includes a dismiss button.
 */
function ErrorMessage({ message, onDismiss }) {
  return (
    <div className="error-message" id="error-message" role="alert">
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <p className="error-text">{message}</p>
      </div>
      {onDismiss && (
        <button className="error-dismiss" onClick={onDismiss} aria-label="Dismiss error">
          ✕
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
