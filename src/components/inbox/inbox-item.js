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
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
    }

    .inbox-item:hover {
      border-color: var(--color-primary);
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
      color: var(--color-text);
      line-height: 1.5;
      word-break: break-word;
    }

    .inbox-item__meta {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }

    .inbox-item__actions {
      display: flex;
      gap: var(--space-sm);
      margin-top: var(--space-sm);
    }

    .btn-clarify {
      padding: var(--space-xs) var(--space-sm);
      background-color: var(--color-primary);
      color: white;
      border: none;
      border-radius: var(--radius-sm);
      font-size: var(--font-size-sm);
      font-weight: 500;
      cursor: pointer;
      transition: background-color var(--transition-fast);
    }

    .btn-clarify:hover {
      background-color: var(--color-primary-hover);
    }

    .btn-delete {
      padding: var(--space-xs) var(--space-sm);
      background-color: transparent;
      color: var(--color-danger);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .btn-delete:hover {
      background-color: var(--color-danger);
      color: white;
      border-color: var(--color-danger);
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
