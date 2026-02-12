import { LitElement, html, css } from 'lit';
import { store } from '../state/store.js';
import { toggleActionDone, openDrawer } from '../state/actions.js';
import {
  getActiveActionsCount,
  getFilteredActions,
} from '../state/selectors.js';
import '../components/next-actions/action-card.js';
import '../components/next-actions/filters-bar.js';

/**
 * <next-actions-page> - Next Actions view page
 */
class NextActionsPage extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .page {
      padding: var(--space-xl);
    }

    .page__header {
      margin-bottom: var(--space-xl);
    }

    .page__title {
      font-size: var(--font-size-2xl);
      font-weight: 600;
      color: var(--color-text);
      margin-bottom: var(--space-sm);
    }

    .page__subtitle {
      font-size: var(--font-size-base);
      color: var(--color-text-secondary);
    }

    .page__content {
      max-width: 800px;
    }

    .actions-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .empty-state {
      padding: var(--space-xl);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      text-align: center;
      color: var(--color-text-secondary);
    }

    .empty-state__icon {
      font-size: 3rem;
      margin-bottom: var(--space-md);
    }

    .empty-state__title {
      font-size: var(--font-size-lg);
      font-weight: 500;
      color: var(--color-text);
      margin-bottom: var(--space-sm);
    }

    .empty-state__text {
      font-size: var(--font-size-sm);
    }
  `;

  constructor() {
    super();
    this._state = store.getState();
    this._unsubscribe = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._unsubscribe = store.subscribe((state) => {
      this._state = state;
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  _handleToggleDone(e) {
    const { id } = e.detail;
    store.dispatch(toggleActionDone(id));
  }

  _handleOpenDetails(e) {
    const { id } = e.detail;
    const action = this._state.data.actions.find((a) => a.id === id);

    if (action) {
      // Open drawer with action data as draft
      store.dispatch(
        openDrawer('action', id, {
          title: action.text,
          context: action.context || '',
          energy: action.energy || 'low',
          dueDate: action.dueDate
            ? new Date(action.dueDate).toISOString().split('T')[0]
            : '',
          notes: action.notes || '',
        })
      );
    }
  }

  render() {
    const activeCount = getActiveActionsCount(this._state);
    const filteredActions = getFilteredActions(this._state);
    const hasFilters =
      this._state.ui.query ||
      this._state.ui.contextFilter ||
      this._state.ui.energyFilter;

    return html`
      <div class="page">
        <div class="page__header">
          <h1 class="page__title">Next Actions</h1>
          <p class="page__subtitle">
            ${activeCount} active action${activeCount !== 1 ? 's' : ''}
            ${hasFilters || !this._state.ui.showDone
              ? html`<span style="color: var(--color-text-secondary);">
                  • Showing ${filteredActions.length}
                </span>`
              : ''}
          </p>
        </div>

        <div class="page__content">
          <filters-bar></filters-bar>

          ${filteredActions.length === 0
            ? html`
                <div class="empty-state">
                  <div class="empty-state__icon">
                    ${hasFilters ? '🔍' : '✅'}
                  </div>
                  <div class="empty-state__title">
                    ${hasFilters
                      ? 'No actions match your filters'
                      : 'No actions yet'}
                  </div>
                  <div class="empty-state__text">
                    ${hasFilters
                      ? 'Try adjusting your search or filters'
                      : 'Clarify inbox items to create next actions'}
                  </div>
                </div>
              `
            : html`
                <div class="actions-list">
                  ${filteredActions.map(
                    (action) => html`
                      <action-card
                        .action=${action}
                        @toggle-done=${this._handleToggleDone}
                        @open-details=${this._handleOpenDetails}
                      ></action-card>
                    `
                  )}
                </div>
              `}
        </div>
      </div>
    `;
  }
}

customElements.define('next-actions-page', NextActionsPage);
