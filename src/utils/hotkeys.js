import { isTypingTarget } from './dom.js';
import { store } from '../state/store.js';
import { openCapture, closeCapture, closeDrawer } from '../state/actions.js';

/**
 * Hotkey registration with typing guard
 * Prevents hotkeys from firing when user is typing in an input
 */

/**
 * Register a hotkey listener with automatic typing guard
 * @param {string} key - The key to listen for (e.g., 'c', 'Escape')
 * @param {Function} handler - Callback to run when key is pressed
 * @param {Object} options - Options object
 * @param {boolean} options.ignoreTyping - If false, allow firing even when typing (default: true)
 * @returns {Function} Cleanup function to remove the listener
 */
export function registerHotkey(key, handler, options = {}) {
  const { ignoreTyping = true } = options;

  const listener = (event) => {
    // Check if key matches
    if (event.key !== key) {
      return;
    }

    // Guard against typing in inputs (unless disabled)
    if (ignoreTyping && isTypingTarget(event.target)) {
      return;
    }

    handler(event);
  };

  window.addEventListener('keydown', listener);

  // Return cleanup function
  return () => window.removeEventListener('keydown', listener);
}

/**
 * Register multiple hotkeys at once
 * @param {Array<{key: string, handler: Function, options?: Object}>} hotkeys
 * @returns {Function} Cleanup function to remove all listeners
 */
export function registerHotkeys(hotkeys) {
  const cleanups = hotkeys.map(({ key, handler, options }) =>
    registerHotkey(key, handler, options)
  );

  return () => cleanups.forEach((cleanup) => cleanup());
}

/**
 * Setup global application hotkeys
 * @param {Object} _router - Router instance for navigation
 * @returns {Function} Cleanup function to remove all listeners
 */
export function setupGlobalHotkeys(_router) {
  const cleanups = [];

  // "c" - Open capture (only when not typing)
  const captureCleanup = registerHotkey(
    'c',
    (e) => {
      e.preventDefault();
      store.dispatch(openCapture());
    },
    { ignoreTyping: true }
  );
  cleanups.push(captureCleanup);

  // "Escape" - Close any open overlays
  const escapeCleanup = registerHotkey(
    'Escape',
    (e) => {
      const state = store.getState();

      // Close capture modal if open
      if (state.ui.captureOpen) {
        e.preventDefault();
        store.dispatch(closeCapture());
        return;
      }

      // Close drawer if open
      if (state.ui.drawerOpen) {
        e.preventDefault();
        store.dispatch(closeDrawer());
        return;
      }
    },
    { ignoreTyping: false } // Allow Escape even when typing
  );
  cleanups.push(escapeCleanup);

  // Return cleanup function
  return () => cleanups.forEach((cleanup) => cleanup());
}
