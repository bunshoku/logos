/**
 * Selectors for derived data from state
 */

/**
 * Get filtered and sorted actions based on UI filters
 */
export function getFilteredActions(state) {
  const { actions } = state.data;
  const { query, showDone, contextFilter, energyFilter } = state.ui;

  let filtered = actions;

  // Filter by done status
  if (!showDone) {
    filtered = filtered.filter((action) => !action.done);
  }

  // Filter by search query
  if (query.trim()) {
    const lowerQuery = query.toLowerCase();
    filtered = filtered.filter(
      (action) =>
        action.text.toLowerCase().includes(lowerQuery) ||
        (action.notes && action.notes.toLowerCase().includes(lowerQuery))
    );
  }

  // Filter by context
  if (contextFilter) {
    filtered = filtered.filter((action) => action.context === contextFilter);
  }

  // Filter by energy
  if (energyFilter) {
    filtered = filtered.filter((action) => action.energy === energyFilter);
  }

  // Sort by due date (due soon first), then by creation date (newest first)
  return filtered.sort((a, b) => {
    if (a.dueDate && b.dueDate) {
      return a.dueDate - b.dueDate;
    }
    if (a.dueDate) {
      return -1;
    }
    if (b.dueDate) {
      return 1;
    }
    return b.createdAt - a.createdAt;
  });
}

/**
 * Get count of active (not done) actions
 */
export function getActiveActionsCount(state) {
  return state.data.actions.filter((action) => !action.done).length;
}

/**
 * Get inbox count
 */
export function getInboxCount(state) {
  return state.data.inbox.length;
}

/**
 * Get action by ID
 */
export function getActionById(state, id) {
  return state.data.actions.find((action) => action.id === id);
}

/**
 * Get inbox item by ID
 */
export function getInboxItemById(state, id) {
  return state.data.inbox.find((item) => item.id === id);
}

/**
 * Get unique contexts from all actions
 */
export function getAvailableContexts(state) {
  const contexts = new Set();
  state.data.actions.forEach((action) => {
    if (action.context) {
      contexts.add(action.context);
    }
  });
  return Array.from(contexts).sort();
}

/**
 * Get unique energy levels from all actions
 */
export function getAvailableEnergies(state) {
  const energies = new Set();
  state.data.actions.forEach((action) => {
    if (action.energy) {
      energies.add(action.energy);
    }
  });
  return Array.from(energies).sort();
}
