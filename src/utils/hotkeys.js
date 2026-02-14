import { isTypingEvent } from './dom.js';
import { store } from '../state/store.js';
import {
  openCapture,
  closeCapture,
  closeDrawer,
  closeShortcuts,
  setRoute,
  toggleShortcuts,
} from '../state/actions.js';

const SIDEBAR_SHORTCUTS = [
  { key: '1', route: 'next-actions', path: '/next' },
  { key: '2', route: 'inbox', path: '/inbox' },
  { key: '3', route: 'notes', path: '/notes' },
  { key: '4', route: 'review', path: '/review' },
  { key: '5', route: 'habits', path: '/habits' },
  { key: '6', route: 'settings', path: '/settings' },
];

function getDeepActiveElement(root = document) {
  let current = root.activeElement;

  while (current?.shadowRoot?.activeElement) {
    current = current.shadowRoot.activeElement;
  }

  return current;
}

function getNavigableItems() {
  const app = document.querySelector('logos-app');
  if (!app?.shadowRoot) {
    return [];
  }

  const state = store.getState();
  const route = state.ui.route;

  if (route === 'next-actions') {
    const page = app.shadowRoot.querySelector('next-actions-page');
    if (!page?.shadowRoot) {
      return [];
    }
    return Array.from(page.shadowRoot.querySelectorAll('action-card'));
  }

  if (route === 'inbox') {
    const page = app.shadowRoot.querySelector('inbox-page');
    if (!page?.shadowRoot) {
      return [];
    }
    return Array.from(page.shadowRoot.querySelectorAll('inbox-item'));
  }

  return [];
}

function moveItemFocus(direction) {
  const state = store.getState();

  if (state.ui.captureOpen || state.ui.drawerOpen) {
    return false;
  }

  const items = getNavigableItems();
  if (items.length === 0) {
    return false;
  }

  const activeElement = getDeepActiveElement(document);
  const currentIndex = items.findIndex(
    (item) => item === activeElement || item.shadowRoot?.contains(activeElement)
  );

  let nextIndex;
  if (direction === 'down') {
    nextIndex = currentIndex === -1 ? 0 : Math.min(currentIndex + 1, items.length - 1);
  } else {
    nextIndex = currentIndex === -1 ? items.length - 1 : Math.max(currentIndex - 1, 0);
  }

  const nextItem = items[nextIndex];
  if (!nextItem) {
    return false;
  }

  nextItem.focus();
  if (typeof nextItem.scrollIntoView === 'function') {
    nextItem.scrollIntoView({ block: 'nearest' });
  }
  return true;
}

function selectSidebarItem(route, path, router) {
  const state = store.getState();

  if (state.ui.captureOpen || state.ui.drawerOpen) {
    return false;
  }

  store.dispatch(setRoute(route));

  if (router?.goto) {
    router.goto(path);
  }

  return true;
}

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
    if (ignoreTyping && isTypingEvent(event)) {
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
export function setupGlobalHotkeys(router) {
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

      // Close shortcuts modal if open
      if (state.ui.shortcutsOpen) {
        e.preventDefault();
        store.dispatch(closeShortcuts());
      }
    },
    { ignoreTyping: false } // Allow Escape even when typing
  );
  cleanups.push(escapeCleanup);

  // "?" - Toggle keyboard shortcuts modal
  const shortcutsCleanup = registerHotkey(
    '?',
    (e) => {
      e.preventDefault();
      store.dispatch(toggleShortcuts());
    },
    { ignoreTyping: true }
  );
  cleanups.push(shortcutsCleanup);

  // ArrowDown - Move focus to next visible item in Inbox/Next Actions
  const arrowDownCleanup = registerHotkey(
    'ArrowDown',
    (e) => {
      const didMove = moveItemFocus('down');
      if (didMove) {
        e.preventDefault();
      }
    },
    { ignoreTyping: true }
  );
  cleanups.push(arrowDownCleanup);

  // "j" - Move focus to next visible item in Inbox/Next Actions
  const jCleanup = registerHotkey(
    'j',
    (e) => {
      const didMove = moveItemFocus('down');
      if (didMove) {
        e.preventDefault();
      }
    },
    { ignoreTyping: true }
  );
  cleanups.push(jCleanup);

  // ArrowUp - Move focus to previous visible item in Inbox/Next Actions
  const arrowUpCleanup = registerHotkey(
    'ArrowUp',
    (e) => {
      const didMove = moveItemFocus('up');
      if (didMove) {
        e.preventDefault();
      }
    },
    { ignoreTyping: true }
  );
  cleanups.push(arrowUpCleanup);

  // "k" - Move focus to previous visible item in Inbox/Next Actions
  const kCleanup = registerHotkey(
    'k',
    (e) => {
      const didMove = moveItemFocus('up');
      if (didMove) {
        e.preventDefault();
      }
    },
    { ignoreTyping: true }
  );
  cleanups.push(kCleanup);

  SIDEBAR_SHORTCUTS.forEach(({ key, route, path }) => {
    const sidebarCleanup = registerHotkey(
      key,
      (e) => {
        const didNavigate = selectSidebarItem(route, path, router);
        if (didNavigate) {
          e.preventDefault();
        }
      },
      { ignoreTyping: true }
    );

    cleanups.push(sidebarCleanup);
  });

  // Return cleanup function
  return () => cleanups.forEach((cleanup) => cleanup());
}
