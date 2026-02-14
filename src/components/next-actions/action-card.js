import { LitElement, html, css } from 'lit';
import { formatDue } from '../../utils/format.js';

/**
 * <action-card> - Individual action card with checkbox, text, metadata, and click to view details
 */
class ActionCard extends LitElement {
  static properties = {
    action: { type: Object },
  };

  static styles = css`
    :host {
      display: block;
    }

    .action-card {
      padding: var(--space-md);
      background: var(--logos-surface);
      border: 1px solid var(--logos-border);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
      cursor: pointer;
    }

    .action-card:hover {
      border-color: var(--logos-primary);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .action-card--done {
      opacity: 0.6;
    }

    .action-card__header {
      display: flex;
      align-items: flex-start;
      gap: var(--space-md);
      margin-bottom: var(--space-sm);
    }

    .action-card__checkbox-wrapper {
      flex-shrink: 0;
      padding-top: 2px;
    }

    .action-card__checkbox {
      width: 20px;
      height: 20px;
      cursor: pointer;
      accent-color: var(--logos-primary);
    }

    .action-card__content {
      flex: 1;
      min-width: 0;
    }

    .action-card__text {
      font-size: var(--font-size-base);
      color: var(--logos-text);
      line-height: 1.5;
      word-break: break-word;
      margin-bottom: var(--space-xs);
    }

    .action-card__text--done {
      text-decoration: line-through;
      color: var(--logos-text-secondary);
    }

    .action-card__meta {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-sm);
      align-items: center;
    }

    .action-card__tag {
      padding: 2px 8px;
      background-color: var(--logos-bg);
      border: 1px solid var(--logos-border);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-xs);
      color: var(--logos-text-secondary);
    }

    .action-card__due {
      font-size: var(--font-size-sm);
      color: var(--logos-primary);
      font-weight: 500;
    }

    .action-card__due--overdue {
      color: var(--logos-danger);
    }

    .action-card__notes-indicator {
      font-size: var(--font-size-xs);
      color: var(--logos-text-secondary);
    }
  `;

  constructor() {
    super();
    this.action = null;
  }

  _handleCheckboxClick(e) {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('toggle-done', {
        detail: { id: this.action.id },
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleCardClick() {
    this.dispatchEvent(
      new CustomEvent('open-details', {
        detail: { id: this.action.id },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (!this.action) {
      return html``;
    }

    const isDone = this.action.done;
    const hasNotes = this.action.notes && this.action.notes.trim().length > 0;
    const dueDate = this.action.dueDate;
    const isOverdue = dueDate && dueDate < Date.now() && !isDone;

    return html`
      <div
        class="action-card ${isDone ? 'action-card--done' : ''}"
        @click=${this._handleCardClick}
      >
        <div class="action-card__header">
          <div class="action-card__checkbox-wrapper">
            <input
              type="checkbox"
              class="action-card__checkbox"
              .checked=${isDone}
              @click=${this._handleCheckboxClick}
            />
          </div>

          <div class="action-card__content">
            <div
              class="action-card__text ${isDone
                ? 'action-card__text--done'
                : ''}"
            >
              ${this.action.text}
            </div>

            <div class="action-card__meta">
              ${this.action.context
                ? html`<span class="action-card__tag"
                    >📍 ${this.action.context}</span
                  >`
                : ''}
              ${this.action.energy
                ? html`<span class="action-card__tag"
                    >⚡ ${this.action.energy}</span
                  >`
                : ''}
              ${dueDate
                ? html`<span
                    class="action-card__due ${isOverdue
                      ? 'action-card__due--overdue'
                      : ''}"
                    >📅 ${formatDue(dueDate)}</span
                  >`
                : ''}
              ${hasNotes
                ? html`<span class="action-card__notes-indicator">📝</span>`
                : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('action-card', ActionCard);
