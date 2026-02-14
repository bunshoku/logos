/**
 * DOM utility functions
 */

/**
 * Check if the given element is a typing target (input, textarea, contenteditable)
 * Used to prevent hotkeys from firing when user is typing
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} True if element is a typing target
 */
export function isTypingTarget(element) {
  if (!element) {
    return false;
  }

  if (!(element instanceof Element)) {
    return false;
  }

  const tagName = element.tagName.toLowerCase();

  // Check for input or textarea
  if (tagName === 'input' || tagName === 'textarea') {
    return true;
  }

  // Check for contenteditable
  if (
    element.isContentEditable ||
    element.getAttribute('contenteditable') === 'true'
  ) {
    return true;
  }

  return false;
}

/**
 * Check whether a keyboard event originated from a typing target.
 * Supports shadow DOM by scanning composed event path.
 * @param {KeyboardEvent} event - Keyboard event to inspect
 * @returns {boolean} True if event comes from an input-like element
 */
export function isTypingEvent(event) {
  if (!event) {
    return false;
  }

  const path = typeof event.composedPath === 'function' ? event.composedPath() : [];

  if (path.length > 0) {
    return path.some((node) => isTypingTarget(node));
  }

  return isTypingTarget(event.target);
}

/**
 * Focus an element and optionally select its content
 * @param {HTMLElement} element - The element to focus
 * @param {boolean} selectAll - Whether to select all content (default: false)
 */
export function focusElement(element, selectAll = false) {
  if (!element) {
    return;
  }

  element.focus();

  if (selectAll) {
    if (element.tagName.toLowerCase() === 'input') {
      element.select();
    } else if (element.tagName.toLowerCase() === 'textarea') {
      element.select();
    }
  }
}

/**
 * Trap focus within a container element
 * Useful for modals and drawers
 * @param {HTMLElement} container - The container element
 * @returns {Function} Cleanup function to remove listeners
 */
export function trapFocus(container) {
  const focusableSelector =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  const handleKeyDown = (event) => {
    if (event.key !== 'Tab') {
      return;
    }

    const focusableElements = Array.from(
      container.querySelectorAll(focusableSelector)
    );

    if (focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Shift + Tab on first element: go to last
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }
    // Tab on last element: go to first
    else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  return () => container.removeEventListener('keydown', handleKeyDown);
}
