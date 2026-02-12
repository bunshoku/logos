import { InboxItemSchema, ActionSchema } from './schema.js';
import { rootReducer } from './reducers.js';
import { INBOX_SEED, ACTIONS_SEED } from './seed.js';

/**
 * Simple Redux-style store with pub/sub pattern
 * No middleware, just subscribe/getState/dispatch
 */

function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = new Set();

  return {
    getState() {
      return state;
    },

    dispatch(action) {
      state = reducer(state, action);
      listeners.forEach((listener) => listener(state));
      return action;
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

// Validate seed data at startup
function validateSeedData() {
  try {
    INBOX_SEED.forEach((item, _index) => {
      InboxItemSchema.parse(item);
    });
    ACTIONS_SEED.forEach((action, _index) => {
      ActionSchema.parse(action);
    });
  } catch (error) {
    throw new Error(
      `Seed data validation failed: ${error.message}\n${JSON.stringify(error.issues, null, 2)}`
    );
  }
}

// Validate on module load
validateSeedData();

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
    drawerKind: 'detail',
    drawerSelectedId: '',
    drawerDraft: {},
  },
  data: {
    inbox: [...INBOX_SEED],
    actions: [...ACTIONS_SEED],
  },
};

export const store = createStore(rootReducer, initialState);
