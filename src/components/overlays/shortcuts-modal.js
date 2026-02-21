import { LitElement, html, css } from 'lit';
import { store } from '../../state/store.js';
import { closeShortcuts } from '../../state/actions.js';

const SHORTCUTS = [
  { key: 'c', action: 'Open quick capture' },
  { key: '/', action: 'Focus Next Actions search' },
  { key: 'Enter', action: 'Save capture and go to Inbox (in capture)' },
  { key: 'Cmd/Ctrl+Enter', action: 'Alternative save shortcut (in capture)' },
  { key: 'Esc', action: 'Close open overlay (capture, details, or shortcuts)' },
  { key: 'Esc (in search)', action: 'Unfocus Next Actions search' },
  { key: 'ArrowDown / j', action: 'Move focus to next item in Inbox/Next Actions' },
  { key: 'ArrowUp / k', action: 'Move focus to previous item in Inbox/Next Actions' },
  { key: 'e', action: 'Expand clarify panel for selected Inbox item' },
  { key: 'n', action: 'Create next action from selected Inbox item' },
  { key: 'Cmd/Ctrl+Alt+h', action: 'Cancel/hide clarify panel for selected Inbox item' },
  { key: 'd', action: 'Delete selected Inbox item' },
  { key: '1–6', action: 'Navigate to sidebar sections' },
  { key: '?', action: 'Toggle keyboard shortcuts help' },
];

class ShortcutsModal extends LitElement {
  static properties = {
    isOpen: { type: Boolean },
  };

  static styles = css`
    :host {
      display: none;
    }

    :host([open]) {
      display: block;
    }

    .shortcuts-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1100;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 14vh;
      background-color: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(2px);
    }

    .shortcuts-modal__content {
      width: 92%;
      max-width: 680px;
      background-color: var(--logos-bg);
      border: 1px solid var(--logos-border);
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      box-sizing: border-box;
    }

    .shortcuts-modal__title {
      margin: 0;
      font-size: var(--font-size-xl);
      color: var(--logos-text);
    }

    .shortcuts-modal__hint {
      margin: var(--space-xs) 0 var(--space-md);
      color: var(--logos-text-secondary);
      font-size: var(--font-size-sm);
    }

    .shortcuts-modal__table {
      width: 100%;
      border-collapse: collapse;
    }

    .shortcuts-modal__table th,
    .shortcuts-modal__table td {
      text-align: left;
      padding: var(--space-sm);
      border-bottom: 1px solid var(--logos-border);
      color: var(--logos-text);
      font-size: var(--font-size-sm);
      vertical-align: top;
    }

    .shortcuts-modal__table th {
      color: var(--logos-text-secondary);
      font-weight: 600;
    }

    kbd {
      display: inline-block;
      padding: 2px 6px;
      background-color: var(--logos-surface);
      border: 1px solid var(--logos-border);
      border-radius: 4px;
      font-family: monospace;
      font-size: var(--font-size-xs);
      color: var(--logos-text);
    }
  `;

  constructor() {
    super();
    this.isOpen = false;
    this._unsubscribe = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._unsubscribe = store.subscribe((state) => {
      this.isOpen = state.ui.shortcutsOpen;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  _handleClose() {
    store.dispatch(closeShortcuts());
  }

  _handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      this._handleClose();
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('isOpen')) {
      this.toggleAttribute('open', this.isOpen);
    }
  }

  render() {
    if (!this.isOpen) {
      return html``;
    }

    return html`
      <div class="shortcuts-modal" @click=${this._handleBackdropClick}>
        <div class="shortcuts-modal__content" role="dialog" aria-label="Keyboard shortcuts">
          <h2 class="shortcuts-modal__title">Keyboard Shortcuts</h2>
          <p class="shortcuts-modal__hint">Press <kbd>Esc</kbd> to close</p>

          <table class="shortcuts-modal__table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${SHORTCUTS.map(
                (shortcut) => html`
                  <tr>
                    <td><kbd>${shortcut.key}</kbd></td>
                    <td>${shortcut.action}</td>
                  </tr>
                `
              )}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}

customElements.define('shortcuts-modal', ShortcutsModal);
