import { isTypingEvent, focusElement } from './dom.js';
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

function getNextActionsSearchInput() {
  const state = store.getState();
  if (state.ui.route !== 'next-actions') {
    return null;
  }

  const app = document.querySelector('logos-app');
  if (!app?.shadowRoot) {
    return null;
  }

  const page = app.shadowRoot.querySelector('next-actions-page');
  if (!page?.shadowRoot) {
    return null;
  }

  const filtersBar = page.shadowRoot.querySelector('filters-bar');
  if (!filtersBar?.shadowRoot) {
    return null;
  }

  return filtersBar.shadowRoot.querySelector('.filters-bar__search-input');
}

function focusNextActionsSearch() {
  const state = store.getState();

  if (state.ui.captureOpen || state.ui.drawerOpen || state.ui.shortcutsOpen) {
    return false;
  }

  const searchInput = getNextActionsSearchInput();
  if (!searchInput) {
    return false;
  }

  focusElement(searchInput, true);
  return true;
}

function blurNextActionsSearchIfFocused() {
  const state = store.getState();

  if (state.ui.captureOpen || state.ui.drawerOpen || state.ui.shortcutsOpen) {
    return false;
  }

  const searchInput = getNextActionsSearchInput();
  if (!searchInput) {
    return false;
  }

  const activeElement = getDeepActiveElement(document);
  const filtersRoot = searchInput.getRootNode();

  if (!filtersRoot?.querySelectorAll) {
    return false;
  }

  const escBlurTargets = filtersRoot.querySelectorAll(
    [
      '.filters-bar__search-input',
      '.filters-bar__select',
      '.filters-bar__toggle',
      '.filters-bar__clear',
    ].join(', ')
  );

  const isEscBlurTarget = Array.from(escBlurTargets).includes(activeElement);
  if (!isEscBlurTarget) {
    return false;
  }

  activeElement.blur();
  return true;
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

function getSelectedInboxItem() {
  const state = store.getState();
  if (state.ui.route !== 'inbox') {
    return null;
  }

  const items = getNavigableItems();
  if (items.length === 0) {
    return null;
  }

  const activeElement = getDeepActiveElement(document);
  return (
    items.find((item) => item === activeElement || item.shadowRoot?.contains(activeElement)) || null
  );
}

function triggerInboxShortcutAction(action) {
  const state = store.getState();

  if (state.ui.captureOpen || state.ui.drawerOpen || state.ui.shortcutsOpen) {
    return false;
  }

  const selectedItem = getSelectedInboxItem();
  if (!selectedItem) {
    return false;
  }

  if (action === 'expand') {
    selectedItem.expandClarify?.();
    return true;
  }

  if (action === 'create') {
    selectedItem.createNextAction?.();
    return true;
  }

  if (action === 'hide') {
    selectedItem.hideClarify?.();
    return true;
  }

  if (action === 'delete') {
    selectedItem.deleteItem?.();
    return true;
  }

  return false;
}

function isInboxHideCombo(event) {
  const key = event.key?.toLowerCase();
  if (key !== 'h') {
    return false;
  }

  const hasCmdOrCtrl = event.metaKey || event.ctrlKey;
  return hasCmdOrCtrl && event.altKey && !event.shiftKey;
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
        return;
      }

      // Exit Next Actions search mode when search input is focused
      if (blurNextActionsSearchIfFocused()) {
        e.preventDefault();
      }
    },
    { ignoreTyping: false } // Allow Escape even when typing
  );
  cleanups.push(escapeCleanup);

  // "/" - Focus Next Actions search input
  const nextActionsSearchCleanup = registerHotkey(
    '/',
    (e) => {
      const didFocus = focusNextActionsSearch();
      if (didFocus) {
        e.preventDefault();
      }
    },
    { ignoreTyping: true }
  );
  cleanups.push(nextActionsSearchCleanup);

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

  // "e" - Expand clarify panel for selected Inbox item
  const inboxExpandCleanup = registerHotkey(
    'e',
    (e) => {
      const didHandle = triggerInboxShortcutAction('expand');
      if (didHandle) {
        e.preventDefault();
      }
    },
    { ignoreTyping: true }
  );
  cleanups.push(inboxExpandCleanup);

  // "n" - Create next action from selected clarified Inbox item
  const inboxCreateCleanup = registerHotkey(
    'n',
    (e) => {
      const didHandle = triggerInboxShortcutAction('create');
      if (didHandle) {
        e.preventDefault();
      }
    },
    { ignoreTyping: true }
  );
  cleanups.push(inboxCreateCleanup);

  // "Cmd/Ctrl+Alt+H" - Hide/cancel clarify panel for selected Inbox item
  const inboxHideCleanup = registerHotkey(
    'h',
    (e) => {
      if (!isInboxHideCombo(e)) {
        return;
      }

      const didHandle = triggerInboxShortcutAction('hide');
      if (didHandle) {
        e.preventDefault();
      }
    },
    { ignoreTyping: false }
  );
  cleanups.push(inboxHideCleanup);

  // "d" - Delete selected Inbox item
  const inboxDeleteCleanup = registerHotkey(
    'd',
    (e) => {
      const didHandle = triggerInboxShortcutAction('delete');
      if (didHandle) {
        e.preventDefault();
      }
    },
    { ignoreTyping: true }
  );
  cleanups.push(inboxDeleteCleanup);

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
