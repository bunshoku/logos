import { LitElement, html, css } from 'lit';
import { store } from '../../state/store.js';
import {
  closeDrawer,
  setDrawerDraft,
  clarifyInboxItem,
  updateAction,
} from '../../state/actions.js';
import { getInboxItemById, getActionById } from '../../state/selectors.js';
import { nanoid } from 'nanoid';

/**
 * <details-drawer> - Side drawer for clarifying inbox items or viewing action details
 * Supports drawerKind: "inbox" | "action"
 */
class DetailsDrawer extends LitElement {
  static properties = {
    isOpen: { type: Boolean },
    kind: { type: String },
    selectedId: { type: String },
    draft: { type: Object },
  };

  static styles = css`
    :host {
      display: none;
    }

    :host([open]) {
      display: block;
    }

    .drawer-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.3);
      z-index: 900;
    }

    .drawer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 480px;
      max-width: 90vw;
      background-color: var(--color-bg);
      box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
      z-index: 950;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .drawer__header {
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .drawer__title {
      font-size: var(--font-size-xl);
      font-weight: 600;
      color: var(--color-text);
    }

    .btn-close {
      padding: var(--space-xs);
      background: none;
      border: none;
      color: var(--color-text-secondary);
      cursor: pointer;
      font-size: var(--font-size-lg);
      line-height: 1;
    }

    .btn-close:hover {
      color: var(--color-text);
    }

    .drawer__content {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-lg);
    }

    .drawer__footer {
      padding: var(--space-lg);
      border-top: 1px solid var(--color-border);
      display: flex;
      gap: var(--space-sm);
      justify-content: flex-end;
    }

    .form-field {
      margin-bottom: var(--space-lg);
    }

    .form-field__label {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: 500;
      color: var(--color-text);
      margin-bottom: var(--space-xs);
    }

    .form-field__required {
      color: var(--color-danger);
    }

    .form-field__input {
      width: 100%;
      padding: var(--space-sm) var(--space-md);
      background-color: var(--color-surface);
      color: var(--color-text);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-base);
      outline: none;
      font-family: inherit;
    }

    .form-field__input:focus {
      border-color: var(--color-primary);
    }

    .form-field__textarea {
      width: 100%;
      min-height: 100px;
      padding: var(--space-sm) var(--space-md);
      background-color: var(--color-surface);
      color: var(--color-text);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-base);
      outline: none;
      resize: vertical;
      font-family: inherit;
    }

    .form-field__textarea:focus {
      border-color: var(--color-primary);
    }

    .form-field__select {
      width: 100%;
      padding: var(--space-sm) var(--space-md);
      background-color: var(--color-surface);
      color: var(--color-text);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-base);
      outline: none;
      cursor: pointer;
    }

    .form-field__select:focus {
      border-color: var(--color-primary);
    }

    .btn-primary {
      padding: var(--space-sm) var(--space-lg);
      background-color: var(--color-primary);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      font-weight: 500;
      cursor: pointer;
      transition: background-color var(--transition-fast);
    }

    .btn-primary:hover {
      background-color: var(--color-primary-hover);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary {
      padding: var(--space-sm) var(--space-lg);
      background-color: transparent;
      color: var(--color-text);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .btn-secondary:hover {
      background-color: var(--color-surface);
      border-color: var(--color-primary);
    }

    .source-text {
      padding: var(--space-md);
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
      margin-bottom: var(--space-lg);
      line-height: 1.5;
    }

    .source-text__label {
      font-weight: 500;
      color: var(--color-text);
      display: block;
      margin-bottom: var(--space-xs);
    }
  `;

  constructor() {
    super();
    this.isOpen = false;
    this.kind = 'inbox';
    this.selectedId = '';
    this.draft = {};
    this._unsubscribe = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._unsubscribe = store.subscribe((state) => {
      this.isOpen = state.ui.drawerOpen;
      this.kind = state.ui.drawerKind;
      this.selectedId = state.ui.drawerSelectedId;
      this.draft = state.ui.drawerDraft;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  _handleClose() {
    store.dispatch(closeDrawer());
  }

  _handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      this._handleClose();
    }
  }

  _handleInputChange(field, value) {
    store.dispatch(setDrawerDraft({ [field]: value }));
  }

  _handleSave() {
    if (this.kind === 'inbox') {
      this._handleClarifySave();
    } else if (this.kind === 'action') {
      this._handleActionSave();
    }
  }

  _handleClarifySave() {
    const state = store.getState();
    const inboxItem = getInboxItemById(state, this.selectedId);

    if (!inboxItem) {
      return;
    }

    const title = (this.draft.title || '').trim();
    if (!title) {
      alert('Title is required');
      return;
    }

    // Create new action from clarified inbox item
    const actionData = {
      id: nanoid(),
      text: title,
      done: false,
      createdAt: Date.now(),
      context: this.draft.context || '',
      energy: this.draft.energy || '',
      notes: this.draft.notes || '',
    };

    // Add due date if provided
    if (this.draft.dueDate) {
      actionData.dueDate = new Date(this.draft.dueDate).getTime();
    }

    // Dispatch clarify action (removes inbox item, adds action)
    store.dispatch(clarifyInboxItem(this.selectedId, actionData));

    // Navigate to Next Actions
    const app = document.querySelector('logos-app');
    if (app && app._router) {
      app._router.goto('/next');
    }
  }

  _handleActionSave() {
    const state = store.getState();
    const action = getActionById(state, this.selectedId);

    if (!action) {
      return;
    }

    const title = (this.draft.title || '').trim();
    if (!title) {
      alert('Title is required');
      return;
    }

    // Build updates object
    const updates = {
      text: title,
      context: this.draft.context || '',
      energy: this.draft.energy || '',
      notes: this.draft.notes || '',
    };

    // Handle due date
    if (this.draft.dueDate) {
      updates.dueDate = new Date(this.draft.dueDate).getTime();
    } else {
      updates.dueDate = undefined;
    }

    // Dispatch update action
    store.dispatch(updateAction(this.selectedId, updates));

    // Close drawer
    store.dispatch(closeDrawer());
  }

  _renderActionEditForm() {
    const state = store.getState();
    const action = getActionById(state, this.selectedId);

    if (!action) {
      return html`<p>Action not found</p>`;
    }

    const title = this.draft.title ?? action.text;
    const context = this.draft.context ?? (action.context || '');
    const energy = this.draft.energy ?? (action.energy || 'low');
    const dueDate =
      this.draft.dueDate ??
      (action.dueDate
        ? new Date(action.dueDate).toISOString().split('T')[0]
        : '');
    const notes = this.draft.notes ?? (action.notes || '');

    return html`
      <div class="form-field">
        <label class="form-field__label">
          Title <span class="form-field__required">*</span>
        </label>
        <input
          type="text"
          class="form-field__input"
          .value=${title}
          @input=${(e) => this._handleInputChange('title', e.target.value)}
          placeholder="What needs to be done?"
        />
      </div>

      <div class="form-field">
        <label class="form-field__label">Context</label>
        <select
          class="form-field__select"
          .value=${context}
          @change=${(e) => this._handleInputChange('context', e.target.value)}
        >
          <option value="">None</option>
          <option value="work">Work</option>
          <option value="home">Home</option>
          <option value="personal">Personal</option>
          <option value="errands">Errands</option>
          <option value="online">Online</option>
        </select>
      </div>

      <div class="form-field">
        <label class="form-field__label">Energy Level</label>
        <select
          class="form-field__select"
          .value=${energy}
          @change=${(e) => this._handleInputChange('energy', e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div class="form-field">
        <label class="form-field__label">Due Date</label>
        <input
          type="date"
          class="form-field__input"
          .value=${dueDate}
          @input=${(e) => this._handleInputChange('dueDate', e.target.value)}
        />
      </div>

      <div class="form-field">
        <label class="form-field__label">Notes</label>
        <textarea
          class="form-field__textarea"
          .value=${notes}
          @input=${(e) => this._handleInputChange('notes', e.target.value)}
          placeholder="Additional details..."
        ></textarea>
      </div>
    `;
  }

  _renderInboxClarifyForm() {
    const state = store.getState();
    const inboxItem = getInboxItemById(state, this.selectedId);

    if (!inboxItem) {
      return html`<p>Inbox item not found</p>`;
    }

    const title = this.draft.title ?? inboxItem.text;
    const context = this.draft.context ?? '';
    const energy = this.draft.energy ?? 'low';
    const dueDate = this.draft.dueDate ?? '';
    const notes = this.draft.notes ?? '';

    return html`
      <div class="source-text">
        <span class="source-text__label">Original capture:</span>
        ${inboxItem.text}
      </div>

      <div class="form-field">
        <label class="form-field__label">
          Title <span class="form-field__required">*</span>
        </label>
        <input
          type="text"
          class="form-field__input"
          .value=${title}
          @input=${(e) => this._handleInputChange('title', e.target.value)}
          placeholder="What needs to be done?"
        />
      </div>

      <div class="form-field">
        <label class="form-field__label">Context</label>
        <select
          class="form-field__select"
          .value=${context}
          @change=${(e) => this._handleInputChange('context', e.target.value)}
        >
          <option value="">None</option>
          <option value="work">Work</option>
          <option value="home">Home</option>
          <option value="personal">Personal</option>
          <option value="errands">Errands</option>
          <option value="online">Online</option>
        </select>
      </div>

      <div class="form-field">
        <label class="form-field__label">Energy Level</label>
        <select
          class="form-field__select"
          .value=${energy}
          @change=${(e) => this._handleInputChange('energy', e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div class="form-field">
        <label class="form-field__label">Due Date</label>
        <input
          type="date"
          class="form-field__input"
          .value=${dueDate}
          @input=${(e) => this._handleInputChange('dueDate', e.target.value)}
        />
      </div>

      <div class="form-field">
        <label class="form-field__label">Notes</label>
        <textarea
          class="form-field__textarea"
          .value=${notes}
          @input=${(e) => this._handleInputChange('notes', e.target.value)}
          placeholder="Additional details..."
        ></textarea>
      </div>
    `;
  }

  render() {
    if (!this.isOpen) {
      return html``;
    }

    const title =
      this.kind === 'inbox' ? 'Clarify to Next Action' : 'Action Details';
    const saveLabel = this.kind === 'inbox' ? 'Create Next Action' : 'Save';

    return html`
      <div class="drawer-backdrop" @click=${this._handleBackdropClick}></div>
      <div class="drawer">
        <div class="drawer__header">
          <h2 class="drawer__title">${title}</h2>
          <button class="btn-close" @click=${this._handleClose}>✕</button>
        </div>

        <div class="drawer__content">
          ${this.kind === 'inbox' ? this._renderInboxClarifyForm() : ''}
        </div>

        <div class="drawer__footer">
          <button class="btn-secondary" @click=${this._handleClose}>
            Cancel
          </button>
          <button class="btn-primary" @click=${this._handleSave}>
            ${saveLabel}
          </button>
        </div>
      </div>
    `;
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('isOpen')) {
      this.toggleAttribute('open', this.isOpen);
    }
  }
}

customElements.define('details-drawer', DetailsDrawer);
