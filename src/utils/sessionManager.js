/**
 * Session manager — auto-lock the app after a period of inactivity.
 *
 * HIPAA §164.312(a)(2)(iii) requires automatic logoff / session timeout
 * to protect electronic PHI from unauthorized access if a device is
 * left unattended.
 *
 * Usage:
 *   - Call `SessionManager.touch()` on any significant user interaction.
 *   - Subscribe via `SessionManager.onTimeout(callback)` to be notified
 *     when the session has expired (e.g., navigate to a lock screen).
 *   - Call `SessionManager.start(timeoutMinutes)` when the app becomes active.
 *   - Call `SessionManager.stop()` when the app goes to background (AppState).
 */

const DEFAULT_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

class _SessionManager {
  constructor() {
    this._timer = null;
    this._timeoutMs = DEFAULT_TIMEOUT_MS;
    this._listeners = [];
  }

  /** Set the timeout duration in minutes */
  setTimeoutMinutes(minutes) {
    this._timeoutMs = (minutes ?? 15) * 60 * 1000;
  }

  /** Subscribe to timeout events. Returns an unsubscribe function. */
  onTimeout(callback) {
    this._listeners.push(callback);
    return () => {
      this._listeners = this._listeners.filter((l) => l !== callback);
    };
  }

  /** Reset the inactivity timer (call on any user interaction) */
  touch() {
    this._clearTimer();
    this._timer = setTimeout(() => this._expire(), this._timeoutMs);
  }

  /** Start the session timer */
  start(timeoutMinutes) {
    if (timeoutMinutes !== undefined) this.setTimeoutMinutes(timeoutMinutes);
    this.touch();
  }

  /** Stop / pause the timer (e.g., when app goes to background) */
  stop() {
    this._clearTimer();
  }

  _clearTimer() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  _expire() {
    this._clearTimer();
    this._listeners.forEach((cb) => {
      try {
        cb();
      } catch {
        // Ignore listener errors
      }
    });
  }
}

export const SessionManager = new _SessionManager();
