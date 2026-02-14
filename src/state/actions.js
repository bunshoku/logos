/**
 * Action type constants and action creator functions
 */

// UI Actions
export const SET_THEME = 'SET_THEME';
export const SET_ROUTE = 'SET_ROUTE';
export const SET_QUERY = 'SET_QUERY';
export const TOGGLE_SHOW_DONE = 'TOGGLE_SHOW_DONE';
export const SET_CONTEXT_FILTER = 'SET_CONTEXT_FILTER';
export const SET_ENERGY_FILTER = 'SET_ENERGY_FILTER';
export const OPEN_CAPTURE = 'OPEN_CAPTURE';
export const CLOSE_CAPTURE = 'CLOSE_CAPTURE';
export const SET_CAPTURE_TEXT = 'SET_CAPTURE_TEXT';
export const SAVE_CAPTURE = 'SAVE_CAPTURE';
export const OPEN_DRAWER = 'OPEN_DRAWER';
export const CLOSE_DRAWER = 'CLOSE_DRAWER';
export const SET_DRAWER_DRAFT = 'SET_DRAWER_DRAFT';
export const OPEN_SHORTCUTS = 'OPEN_SHORTCUTS';
export const CLOSE_SHORTCUTS = 'CLOSE_SHORTCUTS';
export const TOGGLE_SHORTCUTS = 'TOGGLE_SHORTCUTS';

// Data Actions
export const ADD_ACTION = 'ADD_ACTION';
export const UPDATE_ACTION = 'UPDATE_ACTION';
export const DELETE_ACTION = 'DELETE_ACTION';
export const TOGGLE_ACTION_DONE = 'TOGGLE_ACTION_DONE';
export const DELETE_INBOX_ITEM = 'DELETE_INBOX_ITEM';
export const CLARIFY_INBOX_ITEM = 'CLARIFY_INBOX_ITEM';

// Action Creators - UI
export const setTheme = (theme) => ({ type: SET_THEME, payload: theme });
export const setRoute = (route) => ({ type: SET_ROUTE, payload: route });
export const setQuery = (query) => ({ type: SET_QUERY, payload: query });
export const toggleShowDone = () => ({ type: TOGGLE_SHOW_DONE });
export const setContextFilter = (context) => ({
  type: SET_CONTEXT_FILTER,
  payload: context,
});
export const setEnergyFilter = (energy) => ({
  type: SET_ENERGY_FILTER,
  payload: energy,
});
export const openCapture = () => ({ type: OPEN_CAPTURE });
export const closeCapture = () => ({ type: CLOSE_CAPTURE });
export const setCaptureText = (text) => ({
  type: SET_CAPTURE_TEXT,
  payload: text,
});
export const saveCapture = (id, text, createdAt) => ({
  type: SAVE_CAPTURE,
  payload: { id, text, createdAt },
});
export const openDrawer = (kind, id, draft) => ({
  type: OPEN_DRAWER,
  payload: { kind, id, draft },
});
export const closeDrawer = () => ({ type: CLOSE_DRAWER });
export const setDrawerDraft = (updates) => ({
  type: SET_DRAWER_DRAFT,
  payload: updates,
});
export const openShortcuts = () => ({ type: OPEN_SHORTCUTS });
export const closeShortcuts = () => ({ type: CLOSE_SHORTCUTS });
export const toggleShortcuts = () => ({ type: TOGGLE_SHORTCUTS });

// Action Creators - Data
export const addAction = (actionData) => ({
  type: ADD_ACTION,
  payload: actionData,
});
export const updateAction = (id, updates) => ({
  type: UPDATE_ACTION,
  payload: { id, updates },
});
export const deleteAction = (id) => ({ type: DELETE_ACTION, payload: id });
export const toggleActionDone = (id) => ({
  type: TOGGLE_ACTION_DONE,
  payload: id,
});
export const deleteInboxItem = (id) => ({
  type: DELETE_INBOX_ITEM,
  payload: id,
});
export const clarifyInboxItem = (inboxId, actionData) => ({
  type: CLARIFY_INBOX_ITEM,
  payload: { inboxId, actionData },
});
