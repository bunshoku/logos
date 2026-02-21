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
      background: var(--logos-surface);
      border: 1px solid var(--logos-border);
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
      flex: 1 1 260px;
      min-width: 0;
    }

    .filters-bar__search-input {
      width: 100%;
      box-sizing: border-box;
      padding: var(--space-sm) var(--space-md);
      background-color: var(--logos-bg);
      color: var(--logos-text);
      border: 1px solid var(--logos-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      outline: none;
    }

    .filters-bar__search-input:focus {
      border-color: var(--logos-primary);
    }

    .filters-bar__filter-group {
      display: flex;
      gap: var(--space-sm);
      align-items: center;
      flex: 0 0 auto;
    }

    @media (max-width: 720px) {
      .filters-bar__row {
        align-items: stretch;
      }

      .filters-bar__search {
        flex-basis: 100%;
      }
    }

    .filters-bar__label {
      font-size: var(--font-size-sm);
      color: var(--logos-text-secondary);
      font-weight: 500;
    }

    .filters-bar__select {
      padding: var(--space-xs) var(--space-sm);
      background-color: var(--logos-bg);
      color: var(--logos-text);
      border: 1px solid var(--logos-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      outline: none;
      cursor: pointer;
    }

    .filters-bar__select:focus {
      border-color: var(--logos-primary);
    }

    .filters-bar__toggle {
      padding: var(--space-xs) var(--space-sm);
      background: none;
      color: var(--logos-text-secondary);
      border: 1px solid var(--logos-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .filters-bar__toggle:hover {
      background-color: var(--logos-bg);
      color: var(--logos-text);
      border-color: var(--logos-primary);
    }

    .filters-bar__toggle--active {
      background-color: var(--logos-surface);
      color: var(--logos-text);
      border-color: var(--logos-primary);
    }

    .filters-bar__clear {
      padding: var(--space-xs) var(--space-sm);
      background: none;
      color: var(--logos-text-secondary);
      border: 1px solid var(--logos-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .filters-bar__clear:hover {
      background-color: var(--logos-bg);
      color: var(--logos-text);
      border-color: var(--logos-primary);
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
    this._syncFromState(store.getState());
    this._unsubscribe = store.subscribe((state) => {
      this._syncFromState(state);
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  _syncFromState(state) {
    this.query = state.ui.query;
    this.contextFilter = state.ui.contextFilter;
    this.energyFilter = state.ui.energyFilter;
    this.showDone = state.ui.showDone;
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

          <button
            class="filters-bar__toggle ${this.showDone
              ? 'filters-bar__toggle--active'
              : ''}"
            @click=${this._handleShowDoneToggle}
          >
            Show completed
          </button>

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
      </div>
    `;
  }
}

customElements.define('filters-bar', FiltersBar);
