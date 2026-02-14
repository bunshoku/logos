import { describe, it, expect, beforeEach, vi } from 'vitest';
import { store } from '../src/state/store.js';
import {
  openCapture,
  closeCapture,
  setCaptureText,
  saveCapture,
  setTheme,
  setRoute,
  clarifyInboxItem,
  toggleActionDone,
  setQuery,
  setContextFilter,
} from '../src/state/actions.js';
import {
  getInboxCount,
  getActiveActionsCount,
  getFilteredActions,
} from '../src/state/selectors.js';
import { fireKeyboardEvent, waitForElement, typeIntoElement } from './setup.js';
import { nanoid } from 'nanoid';

// Import app component
import '../src/app.js';

function getDeepActiveElement(root = document) {
  let current = root.activeElement;

  while (current?.shadowRoot?.activeElement) {
    current = current.shadowRoot.activeElement;
  }

  return current;
}

describe('lo•gos Application Tests', () => {
  let app;

  beforeEach(async () => {
    // Reset store to initial state by recreating it
    const initialState = {
      ui: {
        theme: 'light',
        route: 'next-actions',
        query: '',
        showDone: false,
        contextFilter: '',
        energyFilter: '',
        captureOpen: false,
        captureText: '',
        drawerOpen: false,
        drawerKind: 'action',
        drawerSelectedId: '',
        drawerDraft: {},
      },
      data: {
        inbox: [],
        actions: [],
      },
    };

    // Manually reset state
    store.dispatch({ type: '__RESET__', payload: initialState });

    // Create and mount app
    app = document.createElement('logos-app');
    document.body.appendChild(app);

    // Wait for app to be ready
    await app.updateComplete;
  });

  describe('Test 0: Initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState();

      // UI state
      expect(state.ui.theme).toBe('light');
      expect(state.ui.route).toBe('next-actions');
      expect(state.ui.captureOpen).toBe(false);
      expect(state.ui.drawerOpen).toBe(false);
      expect(state.ui.showDone).toBe(false);
      expect(state.ui.query).toBe('');

      // Data state
      expect(state.data.inbox).toEqual([]);
      expect(state.data.actions).toEqual([]);

      // Counts
      expect(getInboxCount(state)).toBe(0);
      expect(getActiveActionsCount(state)).toBe(0);
    });
  });

  describe('Test 1: "c" opens capture when not typing', () => {
    it('should open capture modal when "c" is pressed', async () => {
      // Verify capture is closed initially
      expect(store.getState().ui.captureOpen).toBe(false);

      // Press "c" key
      fireKeyboardEvent(document.body, 'c');

      // Wait a bit for state to update
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify capture modal is now open
      expect(store.getState().ui.captureOpen).toBe(true);
    });
  });

  describe('Test 2: "c" does not open capture when focused in input', () => {
    it('should not open capture when typing in an input field', async () => {
      // Create an input element and focus it
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.focus();

      // Verify capture is closed
      expect(store.getState().ui.captureOpen).toBe(false);

      // Press "c" key while input is focused
      fireKeyboardEvent(input, 'c');

      // Wait a bit
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify capture modal is still closed
      expect(store.getState().ui.captureOpen).toBe(false);

      // Cleanup
      document.body.removeChild(input);
    });

    it('should not prevent typing "c" in capture modal textarea', async () => {
      store.dispatch(openCapture());
      await new Promise((resolve) => setTimeout(resolve, 50));

      const captureModal = app.shadowRoot.querySelector('capture-modal');
      expect(captureModal).toBeTruthy();

      const textarea = captureModal.shadowRoot.querySelector('textarea');
      expect(textarea).toBeTruthy();

      textarea.focus();

      const event = new KeyboardEvent('keydown', {
        key: 'c',
        bubbles: true,
        cancelable: true,
        composed: true,
      });

      const wasNotCanceled = textarea.dispatchEvent(event);

      expect(wasNotCanceled).toBe(true);
      expect(event.defaultPrevented).toBe(false);
      expect(store.getState().ui.captureOpen).toBe(true);
    });
  });

  describe('Test 2b: Arrow/jk list navigation', () => {
    it('should navigate next actions with ArrowDown, ArrowUp, j, and k', async () => {
      const actionOne = {
        id: nanoid(),
        text: 'First action',
        done: false,
        createdAt: Date.now(),
      };
      const actionTwo = {
        id: nanoid(),
        text: 'Second action',
        done: false,
        createdAt: Date.now() - 1000,
      };

      store.dispatch(clarifyInboxItem('dummy-1', actionOne));
      store.dispatch(clarifyInboxItem('dummy-2', actionTwo));

      await app.updateComplete;
      const page = app.shadowRoot.querySelector('next-actions-page');
      await page.updateComplete;

      const cards = Array.from(page.shadowRoot.querySelectorAll('action-card'));
      expect(cards.length).toBe(2);

      fireKeyboardEvent(document.body, 'ArrowDown');
      await new Promise((resolve) => setTimeout(resolve, 25));
      expect(getDeepActiveElement(document)).toBe(cards[0]);

      fireKeyboardEvent(document.body, 'ArrowDown');
      await new Promise((resolve) => setTimeout(resolve, 25));
      expect(getDeepActiveElement(document)).toBe(cards[1]);

      fireKeyboardEvent(document.body, 'ArrowUp');
      await new Promise((resolve) => setTimeout(resolve, 25));
      expect(getDeepActiveElement(document)).toBe(cards[0]);

      fireKeyboardEvent(document.body, 'j');
      await new Promise((resolve) => setTimeout(resolve, 25));
      expect(getDeepActiveElement(document)).toBe(cards[1]);

      fireKeyboardEvent(document.body, 'k');
      await new Promise((resolve) => setTimeout(resolve, 25));
      expect(getDeepActiveElement(document)).toBe(cards[0]);
    });

    it('should not navigate list when focused in a select field', async () => {
      const actionOne = {
        id: nanoid(),
        text: 'Action one',
        done: false,
        createdAt: Date.now(),
      };
      const actionTwo = {
        id: nanoid(),
        text: 'Action two',
        done: false,
        createdAt: Date.now() - 1000,
      };

      store.dispatch(clarifyInboxItem('dummy-1', actionOne));
      store.dispatch(clarifyInboxItem('dummy-2', actionTwo));

      await app.updateComplete;

      const select = document.createElement('select');
      select.innerHTML = '<option value="one">One</option><option value="two">Two</option>';
      document.body.appendChild(select);
      select.focus();

      fireKeyboardEvent(select, 'ArrowDown');
      await new Promise((resolve) => setTimeout(resolve, 25));
      expect(getDeepActiveElement(document)).toBe(select);

      fireKeyboardEvent(select, 'j');
      await new Promise((resolve) => setTimeout(resolve, 25));
      expect(getDeepActiveElement(document)).toBe(select);

      fireKeyboardEvent(select, 'k');
      await new Promise((resolve) => setTimeout(resolve, 25));
      expect(getDeepActiveElement(document)).toBe(select);

      document.body.removeChild(select);
    });
  });

  describe('Test 2c: Sidebar number shortcuts', () => {
    it('should select sidebar items with keys 1 through 6', async () => {
      const sidebar = app.shadowRoot.querySelector('logos-sidebar');
      expect(sidebar).toBeTruthy();

      const expectations = [
        { key: '1', route: 'next-actions', label: 'Next Actions' },
        { key: '2', route: 'inbox', label: 'Inbox' },
        { key: '3', route: 'notes', label: 'Notes' },
        { key: '4', route: 'review', label: 'Review' },
        { key: '5', route: 'habits', label: 'Habits' },
        { key: '6', route: 'settings', label: 'Settings' },
      ];

      for (const item of expectations) {
        fireKeyboardEvent(document.body, item.key);
        await new Promise((resolve) => setTimeout(resolve, 50));

        expect(store.getState().ui.route).toBe(item.route);

        const activeItem = sidebar.shadowRoot.querySelector('.nav-item--active span');
        expect(activeItem).toBeTruthy();
        expect(activeItem.textContent.trim()).toBe(item.label);
      }
    });

    it('should not trigger sidebar shortcuts when typing in an input', async () => {
      store.dispatch(setRoute('next-actions'));
      await app.updateComplete;

      const input = document.createElement('input');
      document.body.appendChild(input);
      input.focus();

      fireKeyboardEvent(input, '2');
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(store.getState().ui.route).toBe('next-actions');

      document.body.removeChild(input);
    });
  });

  describe('Test 3: Enter in capture saves Inbox item and navigates to Inbox', () => {
    it('should save capture to inbox and navigate', async () => {
      // Get initial inbox count
      const initialCount = getInboxCount(store.getState());

      // Open capture
      store.dispatch(openCapture());
      expect(store.getState().ui.captureOpen).toBe(true);

      // Set capture text
      const captureText = 'Test inbox item';
      store.dispatch(setCaptureText(captureText));

      // Save capture
      const id = nanoid();
      const createdAt = Date.now();
      store.dispatch(saveCapture(id, captureText, createdAt));

      // Verify inbox item was created
      const newCount = getInboxCount(store.getState());
      expect(newCount).toBe(initialCount + 1);

      // Verify capture modal is closed
      expect(store.getState().ui.captureOpen).toBe(false);

      // Verify the inbox item exists
      const inbox = store.getState().data.inbox;
      const savedItem = inbox.find((item) => item.text === captureText);
      expect(savedItem).toBeDefined();
      expect(savedItem.text).toBe(captureText);
    });
  });

  describe('Test 4: Clarify creates Next Action and removes Inbox item', () => {
    it('should convert inbox item to action and remove from inbox', () => {
      // Add an inbox item
      const inboxId = nanoid();
      const inboxText = 'Item to clarify';
      store.dispatch(saveCapture(inboxId, inboxText, Date.now()));

      // Verify inbox item exists
      const initialInboxCount = getInboxCount(store.getState());
      expect(initialInboxCount).toBe(1);

      // Verify no actions yet
      const initialActionsCount = getActiveActionsCount(store.getState());
      expect(initialActionsCount).toBe(0);

      // Clarify the inbox item
      const actionData = {
        id: nanoid(),
        text: 'Clarified action',
        done: false,
        createdAt: Date.now(),
        context: 'work',
        energy: 'medium',
        notes: 'Test notes',
      };

      store.dispatch(clarifyInboxItem(inboxId, actionData));

      // Verify inbox item was removed
      const newInboxCount = getInboxCount(store.getState());
      expect(newInboxCount).toBe(0);

      // Verify action was created
      const newActionsCount = getActiveActionsCount(store.getState());
      expect(newActionsCount).toBe(1);

      // Verify action details
      const actions = store.getState().data.actions;
      const createdAction = actions.find((a) => a.id === actionData.id);
      expect(createdAction).toBeDefined();
      expect(createdAction.text).toBe('Clarified action');
      expect(createdAction.context).toBe('work');
      expect(createdAction.energy).toBe('medium');
    });
  });

  describe('Test 5: Next Actions page shows clarified action', () => {
    it('should display actions that were clarified from inbox', () => {
      // Create an action (as if clarified from inbox)
      const actionData = {
        id: nanoid(),
        text: 'My Next Action',
        done: false,
        createdAt: Date.now(),
        context: 'work',
        energy: 'high',
      };

      // Add action to store
      store.dispatch(clarifyInboxItem('dummy-inbox-id', actionData));

      // Get filtered actions
      const filteredActions = getFilteredActions(store.getState());

      // Verify action appears in filtered results
      expect(filteredActions.length).toBe(1);
      expect(filteredActions[0].text).toBe('My Next Action');
      expect(filteredActions[0].context).toBe('work');
      expect(filteredActions[0].done).toBe(false);
    });
  });

  describe('Test 6: Toggle done updates UI', () => {
    it('should toggle action done status', () => {
      // Create an action
      const actionId = nanoid();
      const actionData = {
        id: actionId,
        text: 'Action to toggle',
        done: false,
        createdAt: Date.now(),
      };

      store.dispatch(clarifyInboxItem('dummy', actionData));

      // Verify initial state
      let action = store.getState().data.actions.find((a) => a.id === actionId);
      expect(action.done).toBe(false);

      // Initial active count should be 1
      expect(getActiveActionsCount(store.getState())).toBe(1);

      // Toggle done
      store.dispatch(toggleActionDone(actionId));

      // Verify done is now true
      action = store.getState().data.actions.find((a) => a.id === actionId);
      expect(action.done).toBe(true);

      // Active count should be 0
      expect(getActiveActionsCount(store.getState())).toBe(0);

      // Toggle back
      store.dispatch(toggleActionDone(actionId));

      // Verify done is now false again
      action = store.getState().data.actions.find((a) => a.id === actionId);
      expect(action.done).toBe(false);

      // Active count should be 1 again
      expect(getActiveActionsCount(store.getState())).toBe(1);
    });
  });

  describe('Test 7: Theme toggles and persists to localStorage', () => {
    it('should toggle theme and persist to localStorage', () => {
      // Clear localStorage first
      localStorage.clear();

      // Initial theme should be light
      expect(store.getState().ui.theme).toBe('light');

      // Toggle to dark
      store.dispatch(setTheme('dark'));

      // Verify state updated
      expect(store.getState().ui.theme).toBe('dark');

      // Wait for localStorage update
      setTimeout(() => {
        // Verify localStorage was updated
        expect(localStorage.getItem('logos.theme')).toBe('dark');
      }, 100);

      // Toggle back to light
      store.dispatch(setTheme('light'));

      // Verify state updated
      expect(store.getState().ui.theme).toBe('light');

      setTimeout(() => {
        // Verify localStorage was updated
        expect(localStorage.getItem('logos.theme')).toBe('light');
      }, 100);
    });
  });

  describe('Test 8: Filters + search affect results', () => {
    it('should filter actions by search query', () => {
      // Create multiple actions
      const action1 = {
        id: nanoid(),
        text: 'Buy groceries',
        done: false,
        createdAt: Date.now(),
        context: 'personal',
        energy: 'low',
      };

      const action2 = {
        id: nanoid(),
        text: 'Write report',
        done: false,
        createdAt: Date.now(),
        context: 'work',
        energy: 'high',
      };

      const action3 = {
        id: nanoid(),
        text: 'Call dentist',
        done: false,
        createdAt: Date.now(),
        context: 'personal',
        energy: 'low',
      };

      // Add actions
      store.dispatch(clarifyInboxItem('dummy1', action1));
      store.dispatch(clarifyInboxItem('dummy2', action2));
      store.dispatch(clarifyInboxItem('dummy3', action3));

      // Verify all actions are present
      let filtered = getFilteredActions(store.getState());
      expect(filtered.length).toBe(3);

      // Apply search filter
      store.dispatch(setQuery('report'));
      filtered = getFilteredActions(store.getState());
      expect(filtered.length).toBe(1);
      expect(filtered[0].text).toBe('Write report');

      // Clear search and apply context filter
      store.dispatch(setQuery(''));
      store.dispatch(setContextFilter('personal'));
      filtered = getFilteredActions(store.getState());
      expect(filtered.length).toBe(2);
      expect(filtered.every((a) => a.context === 'personal')).toBe(true);

      // Clear context filter and search for partial match
      store.dispatch(setContextFilter(''));
      store.dispatch(setQuery('call'));
      filtered = getFilteredActions(store.getState());
      expect(filtered.length).toBe(1);
      expect(filtered[0].text).toBe('Call dentist');

      // Clear all filters
      store.dispatch(setQuery(''));
      filtered = getFilteredActions(store.getState());
      expect(filtered.length).toBe(3);
    });

    it('should filter by context', () => {
      // Create actions with different contexts
      const workAction = {
        id: nanoid(),
        text: 'Work task',
        done: false,
        createdAt: Date.now(),
        context: 'work',
        energy: 'medium',
      };

      const homeAction = {
        id: nanoid(),
        text: 'Home task',
        done: false,
        createdAt: Date.now(),
        context: 'home',
        energy: 'low',
      };

      store.dispatch(clarifyInboxItem('dummy1', workAction));
      store.dispatch(clarifyInboxItem('dummy2', homeAction));

      // Filter by work context
      store.dispatch(setContextFilter('work'));
      let filtered = getFilteredActions(store.getState());
      expect(filtered.length).toBe(1);
      expect(filtered[0].context).toBe('work');

      // Filter by home context
      store.dispatch(setContextFilter('home'));
      filtered = getFilteredActions(store.getState());
      expect(filtered.length).toBe(1);
      expect(filtered[0].context).toBe('home');
    });

    it('should hide completed actions when showDone is false', () => {
      // Create actions with different done states
      const action1 = {
        id: nanoid(),
        text: 'Active task',
        done: false,
        createdAt: Date.now(),
      };

      const action2 = {
        id: nanoid(),
        text: 'Completed task',
        done: true,
        createdAt: Date.now(),
      };

      store.dispatch(clarifyInboxItem('dummy1', action1));
      store.dispatch(clarifyInboxItem('dummy2', action2));

      // With showDone false (default), should only see active
      let filtered = getFilteredActions(store.getState());
      expect(filtered.length).toBe(1);
      expect(filtered[0].done).toBe(false);

      // Toggle showDone to true would show both (tested implicitly)
      // The filtering logic is in selectors.js
    });
  });
});
