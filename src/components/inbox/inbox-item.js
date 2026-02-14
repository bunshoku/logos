import { LitElement, html, css } from 'lit';
import { formatStamp } from '../../utils/format.js';

/**
 * <inbox-item> - Single inbox item with clarify and delete actions
 */
class InboxItem extends LitElement {
  static properties = {
    item: { type: Object },
    isClarifying: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
    }

    .inbox-item {
      padding: var(--space-md);
      background: var(--logos-surface);
      border: 1px solid var(--logos-border);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
    }

    .inbox-item:hover {
      border-color: var(--logos-primary);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .inbox-item__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--space-md);
      margin-bottom: var(--space-sm);
    }

    .inbox-item__text {
      flex: 1;
      font-size: var(--font-size-base);
      color: var(--logos-text);
      line-height: 1.5;
      word-break: break-word;
    }

    .inbox-item__meta {
      font-size: var(--font-size-sm);
      color: var(--logos-text-secondary);
    }

    .inbox-item__actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: var(--space-sm);
      margin-top: var(--space-sm);
    }

    .clarify-panel {
      margin-top: var(--space-md);
      padding-top: var(--space-md);
      border-top: 1px solid var(--logos-border);
    }

    .clarify-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--space-sm);
      margin-bottom: var(--space-sm);
    }

    .clarify-field {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .clarify-field--full {
      grid-column: 1 / -1;
    }

    .clarify-label {
      font-size: var(--font-size-sm);
      color: var(--logos-text-secondary);
    }

    .clarify-input,
    .clarify-select,
    .clarify-textarea {
      width: 100%;
      padding: var(--space-sm) var(--space-md);
      border: 1px solid var(--logos-border);
      border-radius: var(--radius-sm);
      background: var(--logos-surface);
      color: var(--logos-text);
      font-size: var(--font-size-sm);
      font-family: inherit;
      box-sizing: border-box;
    }

    .clarify-textarea {
      min-height: 88px;
      resize: vertical;
    }

    .clarify-input:focus,
    .clarify-select:focus,
    .clarify-textarea:focus {
      outline: none;
      border-color: var(--logos-primary);
    }

    .clarify-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-sm);
    }

    .btn-cancel {
      padding: var(--space-xs) var(--space-sm);
      background-color: transparent;
      color: var(--logos-text);
      border: 1px solid var(--logos-border);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-sm);
      cursor: pointer;
    }

    .btn-save {
      padding: var(--space-xs) var(--space-sm);
      background-color: var(--logos-primary);
      color: white;
      border: none;
      border-radius: var(--radius-sm);
      font-size: var(--font-size-sm);
      font-weight: 500;
      cursor: pointer;
    }

    .btn-save:hover {
      background-color: var(--logos-primary-hover);
    }

    .btn-clarify {
      padding: var(--space-sm) var(--space-sm);
      background-color: var(--logos-text);
      color: var(--logos-bg);
      border: none;
      border-radius: var(--radius-sm);
      font-size: var(--font-size-sm);
      font-weight: 500;
      cursor: pointer;
      // transition: background 120ms ease, border-color 120ms ease;
      
    }

    .btn-clarify:hover {
      filter: brightness(0.98);
    }

    .btn-delete {
      padding: var(--space-xs) var(--space-sm);
      background-color: transparent;
      color: var(--logos-danger);
      border: 1px solid var(--logos-border);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .btn-delete:hover {
      background-color: var(--logos-danger);
      color: white;
      border-color: var(--logos-danger);
    }
  `;

  constructor() {
    super();
    this.item = null;
    this.isClarifying = false;
    this.tabIndex = 0;
    this._draft = {
      context: '',
      energy: 'low',
      dueDate: '',
      notes: '',
    };
  }

  _handleClarify() {
    this.isClarifying = !this.isClarifying;

    if (!this.isClarifying) {
      this._draft = {
        context: '',
        energy: 'low',
        dueDate: '',
        notes: '',
      };
    }
  }

  _handleDelete() {
    this.dispatchEvent(
      new CustomEvent('delete', {
        detail: { id: this.item.id },
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleFieldChange(field, value) {
    this._draft = {
      ...this._draft,
      [field]: value,
    };
    this.requestUpdate();
  }

  _handleClarifyCancel() {
    this.isClarifying = false;
    this._draft = {
      context: '',
      energy: 'low',
      dueDate: '',
      notes: '',
    };
  }

  _handleClarifySave() {
    this.dispatchEvent(
      new CustomEvent('clarify-save', {
        detail: {
          id: this.item.id,
          ...this._draft,
        },
        bubbles: true,
        composed: true,
      })
    );

    this._handleClarifyCancel();
  }

  render() {
    if (!this.item) {
      return html``;
    }

    return html`
      <div class="inbox-item">
        <div class="inbox-item__header">
          <div class="inbox-item__text">${this.item.text}</div>
        </div>
        <div class="inbox-item__meta">${formatStamp(this.item.createdAt)}</div>
        <div class="inbox-item__actions">
          <button class="btn-clarify" @click=${this._handleClarify}>
            ${this.isClarifying ? 'Hide Clarify' : 'Clarify → Next Action'}
          </button>
          <button class="btn-delete" @click=${this._handleDelete}>
            Delete
          </button>
        </div>

        ${this.isClarifying
          ? html`
              <div class="clarify-panel">
                <div class="clarify-grid">
                  <label class="clarify-field">
                    <span class="clarify-label">Context</span>
                    <select
                      class="clarify-select"
                      .value=${this._draft.context}
                      @change=${(e) =>
                        this._handleFieldChange('context', e.target.value)}
                    >
                      <option value="">None</option>
                      <option value="work">Work</option>
                      <option value="home">Home</option>
                      <option value="personal">Personal</option>
                      <option value="errands">Errands</option>
                      <option value="online">Online</option>
                    </select>
                  </label>

                  <label class="clarify-field">
                    <span class="clarify-label">Energy Level</span>
                    <select
                      class="clarify-select"
                      .value=${this._draft.energy}
                      @change=${(e) =>
                        this._handleFieldChange('energy', e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </label>

                  <label class="clarify-field clarify-field--full">
                    <span class="clarify-label">Due Date</span>
                    <input
                      type="date"
                      class="clarify-input"
                      .value=${this._draft.dueDate}
                      @input=${(e) =>
                        this._handleFieldChange('dueDate', e.target.value)}
                    />
                  </label>

                  <label class="clarify-field clarify-field--full">
                    <span class="clarify-label">Notes</span>
                    <textarea
                      class="clarify-textarea"
                      .value=${this._draft.notes}
                      @input=${(e) =>
                        this._handleFieldChange('notes', e.target.value)}
                      placeholder="Additional details..."
                    ></textarea>
                  </label>
                </div>

                <div class="clarify-actions">
                  <button class="btn-cancel" @click=${this._handleClarifyCancel}>
                    Cancel
                  </button>
                  <button class="btn-save" @click=${this._handleClarifySave}>
                    Create Next Action
                  </button>
                </div>
              </div>
            `
          : ''}
      </div>
    `;
  }
}

customElements.define('inbox-item', InboxItem);
