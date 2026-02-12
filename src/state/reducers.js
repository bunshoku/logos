import {
  SET_THEME,
  SET_ROUTE,
  SET_QUERY,
  TOGGLE_SHOW_DONE,
  SET_CONTEXT_FILTER,
  SET_ENERGY_FILTER,
  OPEN_CAPTURE,
  CLOSE_CAPTURE,
  SET_CAPTURE_TEXT,
  SAVE_CAPTURE,
  OPEN_DRAWER,
  CLOSE_DRAWER,
  SET_DRAWER_DRAFT,
  ADD_ACTION,
  UPDATE_ACTION,
  DELETE_ACTION,
  TOGGLE_ACTION_DONE,
  DELETE_INBOX_ITEM,
  CLARIFY_INBOX_ITEM,
} from './actions.js';

/**
 * Pure reducers for immutable state updates
 */

function uiReducer(state, action) {
  switch (action.type) {
    case SET_THEME:
      return { ...state, theme: action.payload };

    case SET_ROUTE:
      return { ...state, route: action.payload };

    case SET_QUERY:
      return { ...state, query: action.payload };

    case TOGGLE_SHOW_DONE:
      return { ...state, showDone: !state.showDone };

    case SET_CONTEXT_FILTER:
      return { ...state, contextFilter: action.payload };

    case SET_ENERGY_FILTER:
      return { ...state, energyFilter: action.payload };

    case OPEN_CAPTURE:
      return { ...state, captureOpen: true, captureText: '' };

    case CLOSE_CAPTURE:
      return { ...state, captureOpen: false, captureText: '' };

    case SET_CAPTURE_TEXT:
      return { ...state, captureText: action.payload };

    case SAVE_CAPTURE:
      return { ...state, captureOpen: false, captureText: '' };

    case OPEN_DRAWER:
      return {
        ...state,
        drawerOpen: true,
        drawerKind: action.payload.kind,
        drawerSelectedId: action.payload.id,
        drawerDraft: action.payload.draft || {},
      };

    case CLOSE_DRAWER:
      return {
        ...state,
        drawerOpen: false,
        drawerSelectedId: '',
        drawerDraft: {},
      };

    case SET_DRAWER_DRAFT:
      return {
        ...state,
        drawerDraft: { ...state.drawerDraft, ...action.payload },
      };

    case DELETE_INBOX_ITEM:
      // Close drawer if it was open for the deleted item
      if (state.drawerOpen && state.drawerSelectedId === action.payload) {
        return {
          ...state,
          drawerOpen: false,
          drawerSelectedId: '',
          drawerDraft: {},
        };
      }
      return state;

    case CLARIFY_INBOX_ITEM:
      // Close drawer after clarifying
      return {
        ...state,
        drawerOpen: false,
        drawerSelectedId: '',
        drawerDraft: {},
      };

    default:
      return state;
  }
}

function dataReducer(state, action) {
  switch (action.type) {
    case SAVE_CAPTURE: {
      const newInboxItem = {
        id: action.payload.id,
        text: action.payload.text,
        createdAt: action.payload.createdAt,
      };
      return {
        ...state,
        inbox: [newInboxItem, ...state.inbox],
      };
    }

    case DELETE_INBOX_ITEM:
      return {
        ...state,
        inbox: state.inbox.filter((item) => item.id !== action.payload),
      };

    case CLARIFY_INBOX_ITEM: {
      const { inboxId, actionData } = action.payload;
      return {
        ...state,
        inbox: state.inbox.filter((item) => item.id !== inboxId),
        actions: [actionData, ...state.actions],
      };
    }

    case ADD_ACTION:
      return {
        ...state,
        actions: [action.payload, ...state.actions],
      };

    case UPDATE_ACTION:
      return {
        ...state,
        actions: state.actions.map((a) =>
          a.id === action.payload.id ? { ...a, ...action.payload.updates } : a
        ),
      };

    case DELETE_ACTION:
      return {
        ...state,
        actions: state.actions.filter((a) => a.id !== action.payload),
      };

    case TOGGLE_ACTION_DONE:
      return {
        ...state,
        actions: state.actions.map((a) =>
          a.id === action.payload ? { ...a, done: !a.done } : a
        ),
      };

    default:
      return state;
  }
}

export function rootReducer(state, action) {
  // Support for test reset
  if (action.type === '__RESET__') {
    return action.payload;
  }

  return {
    ui: uiReducer(state.ui, action),
    data: dataReducer(state.data, action),
  };
}
