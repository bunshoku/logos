import { LitElement, html, css } from 'lit';
import { store } from '../../state/store.js';
import {
  closeCapture,
  setCaptureText,
  saveCapture,
} from '../../state/actions.js';
import { nanoid } from 'nanoid';

/**
 * <capture-modal> - Quick capture overlay
 * Opens with "c" hotkey or capture button
 * Enter saves to Inbox, Esc closes
 */
class CaptureModal extends LitElement {
  static properties = {
    isOpen: { type: Boolean },
    text: { type: String },
  };

  static styles = css`
    :host {
      display: none;
    }

    :host([open]) {
      display: block;
    }

    .capture-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1000;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 20vh;
      background-color: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(2px);
    }

    .capture-modal__content {
      background-color: var(--logos-bg);
      border-radius: var(--radius-lg);
      padding: var(--space-xl);
      width: 90%;
      max-width: 600px;
      box-sizing: border-box;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .capture-modal__header {
      margin-bottom: var(--space-md);
    }

    .capture-modal__title {
      font-size: var(--font-size-xl);
      font-weight: 600;
      color: var(--logos-text);
      margin-bottom: var(--space-xs);
    }

    .capture-modal__hint {
      font-size: var(--font-size-sm);
      color: var(--logos-text-secondary);
    }

    .capture-modal__input {
      width: 100%;
      padding: var(--space-md);
      box-sizing: border-box;
      background-color: var(--logos-surface);
      color: var(--logos-text);
      line-height: 1.5;
      word-break: break-word;
      border: 2px solid var(--logos-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-base);
      outline: none;
      transition: border-color var(--transition-fast);
      resize: vertical;
      min-height: 100px;
      font-family: inherit;
    }

    .capture-modal__input:focus {
      border-color: var(--logos-primary);
    }

    .capture-modal__footer {
      margin-top: var(--space-md);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .capture-modal__shortcuts {
      font-size: var(--font-size-sm);
      color: var(--logos-text-secondary);
    }

    .capture-modal__shortcuts kbd {
      display: inline-block;
      padding: 2px 6px;
      background-color: var(--logos-surface);
      border: 1px solid var(--logos-border);
      border-radius: 4px;
      font-family: monospace;
      font-size: var(--font-size-xs);
    }
  `;

  constructor() {
    super();
    this.isOpen = false;
    this.text = '';
    this._unsubscribe = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._unsubscribe = store.subscribe((state) => {
      this.isOpen = state.ui.captureOpen;
      this.text = state.ui.captureText;

      // Autofocus when opened
      if (this.isOpen) {
        this.updateComplete.then(() => {
          const input = this.shadowRoot.querySelector('.capture-modal__input');
          if (input) {
            input.focus();
          }
        });
      }
    });

    // Listen for keydown events
    this._handleKeyDown = this._handleKeyDown.bind(this);
    document.addEventListener('keydown', this._handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
    document.removeEventListener('keydown', this._handleKeyDown);
  }

  _handleKeyDown(e) {
    if (!this.isOpen) {
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      this._handleClose();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      this._handleSave();
    }
  }

  _handleInput(e) {
    store.dispatch(setCaptureText(e.target.value));
  }

  _handleClose() {
    store.dispatch(closeCapture());
  }

  _handleSave() {
    const trimmedText = this.text.trim();
    if (!trimmedText) {
      this._handleClose();
      return;
    }

    // Save to inbox with nanoid and timestamp
    const id = nanoid();
    const createdAt = Date.now();
    store.dispatch(saveCapture(id, trimmedText, createdAt));

    // Navigate to inbox
    // Access the router through the app component
    const app = document.querySelector('logos-app');
    if (app && app._router) {
      app._router.goto('/inbox');
    }
  }

  _handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      this._handleClose();
    }
  }

  render() {
    if (!this.isOpen) {
      return html``;
    }

    return html`
      <div class="capture-modal" @click=${this._handleBackdropClick}>
        <div class="capture-modal__content">
          <div class="capture-modal__header">
            <h2 class="capture-modal__title">Quick Capture</h2>
            <p class="capture-modal__hint">
              What's on your mind? It will go to your Inbox.
            </p>
          </div>

          <textarea
            class="capture-modal__input"
            placeholder="Type anything..."
            .value=${this.text}
            @input=${this._handleInput}
          ></textarea>

          <div class="capture-modal__footer">
            <div class="capture-modal__shortcuts">
              <kbd>Cmd+Enter</kbd> to save • <kbd>Esc</kbd> to close
            </div>
          </div>
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

customElements.define('capture-modal', CaptureModal);
