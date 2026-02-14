import { LitElement, html, css } from 'lit';
import { formatStamp } from '../../utils/format.js';

/**
 * <inbox-item> - Single inbox item with clarify and delete actions
 */
class InboxItem extends LitElement {
  static properties = {
    item: { type: Object },
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
  }

  _handleClarify() {
    this.dispatchEvent(
      new CustomEvent('clarify', {
        detail: { id: this.item.id },
        bubbles: true,
        composed: true,
      })
    );
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
            Clarify → Next Action
          </button>
          <button class="btn-delete" @click=${this._handleDelete}>
            Delete
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('inbox-item', InboxItem);
