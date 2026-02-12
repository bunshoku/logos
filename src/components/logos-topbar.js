import { LitElement, html, css } from 'lit';
import { store } from '../state/store.js';
import { openCapture } from '../state/actions.js';

/**
 * <logos-topbar> - Top bar with theme toggle, capture button, and hints
 */
class LogosTopbar extends LitElement {
  static properties = {
    theme: { type: String },
  };

  static styles = css`
    :host {
      display: block;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-md) var(--space-lg);
      background: var(--color-bg);
      border-bottom: 1px solid var(--color-border);
    }

    .topbar__left {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .topbar__right {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .topbar__hints {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      user-select: none;
    }

    .topbar__hint-sep {
      margin: 0 var(--space-xs);
    }

    .btn-capture {
      padding: var(--space-sm) var(--space-md);
      background-color: var(--color-primary);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      font-weight: 500;
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: background-color var(--transition-fast);
    }

    .btn-capture:hover {
      background-color: var(--color-primary-hover);
    }

    .btn-theme {
      padding: var(--space-sm);
      background: none;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      color: var(--color-text);
      cursor: pointer;
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
    }

    .btn-theme:hover {
      background-color: var(--color-surface);
      border-color: var(--color-primary);
    }
  `;

  constructor() {
    super();
    this.theme = 'light';
  }

  _handleCaptureClick() {
    store.dispatch(openCapture());
  }

  _handleThemeToggle() {
    this.dispatchEvent(
      new CustomEvent('theme-toggle', {
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const themeIcon = this.theme === 'light' ? '🌙' : '☀️';

    return html`
      <div class="topbar">
        <div class="topbar__left">
          <button class="btn-capture" @click=${this._handleCaptureClick}>
            + Capture
          </button>
        </div>

        <div class="topbar__right">
          <div class="topbar__hints">
            Capture: <strong>c</strong>
            <span class="topbar__hint-sep">•</span>
            Save: <strong>Enter</strong>
            <span class="topbar__hint-sep">•</span>
            Close: <strong>Esc</strong>
          </div>

          <button
            class="btn-theme"
            @click=${this._handleThemeToggle}
            title="Toggle theme"
          >
            ${themeIcon}
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('logos-topbar', LogosTopbar);
