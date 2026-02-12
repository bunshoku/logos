import './app.js';
import { store } from './state/store.js';
import { setTheme } from './state/actions.js';

// Initialize theme from localStorage and sync to store
const savedTheme = localStorage.getItem('logos.theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
store.dispatch(setTheme(savedTheme));

// Subscribe to theme changes and persist to localStorage
store.subscribe((state) => {
  const { theme } = state.ui;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('logos.theme', theme);
});

// Make store available for debugging
if (import.meta.env.DEV) {
  window.__LOGOS_STORE__ = store;
}
