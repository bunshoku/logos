import { LitElement, html, css } from 'lit';
import { store } from '../../state/store.js';
import {
  setQuery,
  setContextFilter,
  setEnergyFilter,
  toggleShowDone,
} from '../../state/actions.js';

/**
 * <filters-bar> - Search and filter controls for Next Actions
 */
class FiltersBar extends LitElement {
  static properties = {
    query: { type: String },
    contextFilter: { type: String },
    energyFilter: { type: String },
    showDone: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
    }

    .filters-bar {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      padding: var(--space-md);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-lg);
    }

    .filters-bar__row {
      display: flex;
      gap: var(--space-md);
      flex-wrap: wrap;
      align-items: center;
    }

    .filters-bar__search {
      flex: 1;
      min-width: 200px;
    }

    .filters-bar__search-input {
      width: 100%;
      padding: var(--space-sm) var(--space-md);
      background-color: var(--color-bg);
      color: var(--color-text);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      outline: none;
    }

    .filters-bar__search-input:focus {
      border-color: var(--color-primary);
    }

    .filters-bar__filter-group {
      display: flex;
      gap: var(--space-sm);
      align-items: center;
    }

    .filters-bar__label {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      font-weight: 500;
    }

    .filters-bar__select {
      padding: var(--space-xs) var(--space-sm);
      background-color: var(--color-bg);
      color: var(--color-text);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      outline: none;
      cursor: pointer;
    }

    .filters-bar__select:focus {
      border-color: var(--color-primary);
    }

    .filters-bar__checkbox-wrapper {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      cursor: pointer;
      user-select: none;
    }

    .filters-bar__checkbox {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: var(--color-primary);
    }

    .filters-bar__checkbox-label {
      font-size: var(--font-size-sm);
      color: var(--color-text);
      cursor: pointer;
    }

    .filters-bar__clear {
      padding: var(--space-xs) var(--space-sm);
      background: none;
      color: var(--color-text-secondary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .filters-bar__clear:hover {
      background-color: var(--color-bg);
      color: var(--color-text);
      border-color: var(--color-primary);
    }
  `;

  constructor() {
    super();
    this.query = '';
    this.contextFilter = '';
    this.energyFilter = '';
    this.showDone = false;
    this._unsubscribe = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._unsubscribe = store.subscribe((state) => {
      this.query = state.ui.query;
      this.contextFilter = state.ui.contextFilter;
      this.energyFilter = state.ui.energyFilter;
      this.showDone = state.ui.showDone;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  _handleSearchInput(e) {
    store.dispatch(setQuery(e.target.value));
  }

  _handleContextChange(e) {
    store.dispatch(setContextFilter(e.target.value));
  }

  _handleEnergyChange(e) {
    store.dispatch(setEnergyFilter(e.target.value));
  }

  _handleShowDoneToggle() {
    store.dispatch(toggleShowDone());
  }

  _handleClearFilters() {
    store.dispatch(setQuery(''));
    store.dispatch(setContextFilter(''));
    store.dispatch(setEnergyFilter(''));
  }

  render() {
    const hasFilters = this.query || this.contextFilter || this.energyFilter;

    return html`
      <div class="filters-bar">
        <div class="filters-bar__row">
          <div class="filters-bar__search">
            <input
              type="text"
              class="filters-bar__search-input"
              placeholder="Search actions..."
              .value=${this.query}
              @input=${this._handleSearchInput}
            />
          </div>

          <div class="filters-bar__filter-group">
            <label class="filters-bar__label">Context:</label>
            <select
              class="filters-bar__select"
              .value=${this.contextFilter}
              @change=${this._handleContextChange}
            >
              <option value="">All</option>
              <option value="work">Work</option>
              <option value="home">Home</option>
              <option value="personal">Personal</option>
              <option value="errands">Errands</option>
              <option value="online">Online</option>
            </select>
          </div>

          <div class="filters-bar__filter-group">
            <label class="filters-bar__label">Energy:</label>
            <select
              class="filters-bar__select"
              .value=${this.energyFilter}
              @change=${this._handleEnergyChange}
            >
              <option value="">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          ${hasFilters
            ? html`
                <button
                  class="filters-bar__clear"
                  @click=${this._handleClearFilters}
                >
                  Clear filters
                </button>
              `
            : ''}
        </div>

        <div class="filters-bar__row">
          <label class="filters-bar__checkbox-wrapper">
            <input
              type="checkbox"
              class="filters-bar__checkbox"
              .checked=${this.showDone}
              @change=${this._handleShowDoneToggle}
            />
            <span class="filters-bar__checkbox-label">Show completed</span>
          </label>
        </div>
      </div>
    `;
  }
}

customElements.define('filters-bar', FiltersBar);
