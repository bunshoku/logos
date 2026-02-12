import { beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/dom';

// Setup global test environment
beforeEach(() => {
  // Clear localStorage before each test
  localStorage.clear();

  // Mock console methods to reduce noise
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  // Clean up DOM
  document.body.innerHTML = '';

  // Restore mocks
  vi.restoreAllMocks();
});

// Helper to wait for async updates
export async function waitFor(callback, options = {}) {
  const { timeout = 1000, interval = 50 } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const result = callback();
      if (result) return result;
    } catch (error) {
      // Continue waiting
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error('waitFor timeout exceeded');
}

// Helper to wait for element
export async function waitForElement(selector, options = {}) {
  return waitFor(() => {
    const element = document.querySelector(selector);
    if (element) return element;
    throw new Error(`Element not found: ${selector}`);
  }, options);
}

// Helper to trigger events
export function fireEvent(element, eventType, options = {}) {
  const event = new Event(eventType, { bubbles: true, ...options });
  Object.assign(event, options);
  element.dispatchEvent(event);
}

// Helper to trigger keyboard events
export function fireKeyboardEvent(element, key, options = {}) {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...options,
  });
  element.dispatchEvent(event);
}

// Helper to simulate user typing
export function typeIntoElement(element, text) {
  element.focus();
  element.value = text;
  fireEvent(element, 'input', { target: { value: text } });
}
