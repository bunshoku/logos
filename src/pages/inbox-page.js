import { LitElement, html, css } from 'lit';
import { store } from '../state/store.js';
import { deleteInboxItem, clarifyInboxItem } from '../state/actions.js';
import { getInboxCount } from '../state/selectors.js';
import { nanoid } from 'nanoid';
import '../components/inbox/inbox-item.js';

/**
 * <inbox-page> - Inbox view page
 */
class InboxPage extends LitElement {
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
      color: var(--logos-text);
      margin-bottom: var(--space-sm);
    }

    .page__subtitle {
      font-size: var(--font-size-base);
      color: var(--logos-text-secondary);
    }

    .page__content {
      max-width: 800px;
    }

    .inbox-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .empty-state {
      padding: var(--space-xl);
      background: var(--logos-surface);
      border: 1px solid var(--logos-border);
      border-radius: var(--radius-lg);
      text-align: center;
      color: var(--logos-text-secondary);
    }

    .empty-state__icon {
      font-size: 3rem;
      margin-bottom: var(--space-md);
    }

    .empty-state__title {
      font-size: var(--font-size-lg);
      font-weight: 500;
      color: var(--logos-text);
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

  _handleClarifySave(e) {
    const { id, context, energy, dueDate, notes } = e.detail;
    const inboxItem = this._state.data.inbox.find((item) => item.id === id);

    if (!inboxItem) {
      return;
    }

    const actionData = {
      id: nanoid(),
      text: inboxItem.text,
      done: false,
      createdAt: Date.now(),
      context: context || '',
      energy: energy || 'low',
      notes: notes || '',
    };

    if (dueDate) {
      actionData.dueDate = new Date(dueDate).getTime();
    }

    store.dispatch(clarifyInboxItem(id, actionData));

    const app = document.querySelector('logos-app');
    if (app && app._router) {
      app._router.goto('/next');
    }
  }

  _handleDelete(e) {
    const { id } = e.detail;

    if (confirm('Delete this inbox item?')) {
      store.dispatch(deleteInboxItem(id));
    }
  }

  render() {
    const inboxCount = getInboxCount(this._state);
    const inboxItems = this._state.data.inbox;

    return html`
      <div class="page">
        <div class="page__header">
          <h1 class="page__title">Inbox</h1>
          <p class="page__subtitle">
            ${inboxCount} item${inboxCount !== 1 ? 's' : ''} to clarify
          </p>
        </div>

        <div class="page__content">
          ${inboxItems.length === 0
            ? html`
                <div class="empty-state">
                  <div class="empty-state__icon">📥</div>
                  <div class="empty-state__title">Your inbox is empty</div>
                  <div class="empty-state__text">
                    Press <strong>c</strong> to capture something new
                  </div>
                </div>
              `
            : html`
                <div class="inbox-list">
                  ${inboxItems.map(
                    (item) => html`
                      <inbox-item
                        .item=${item}
                        @clarify-save=${this._handleClarifySave}
                        @delete=${this._handleDelete}
                      ></inbox-item>
                    `
                  )}
                </div>
              `}
        </div>
      </div>
    `;
  }
}

customElements.define('inbox-page', InboxPage);
