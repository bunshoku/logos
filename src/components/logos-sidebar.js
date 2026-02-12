import { LitElement, html, css } from 'lit';
import './logos-mark.js';

/**
 * <logos-sidebar> - Navigation sidebar
 */
class LogosSidebar extends LitElement {
  static properties = {
    currentRoute: { type: String },
    inboxCount: { type: Number },
    actionsCount: { type: Number },
  };

  static styles = css`
    :host {
      display: block;
      height: 100%;
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: var(--space-lg);
      background: var(--color-surface);
      border-right: 1px solid var(--color-border);
    }

    .sidebar__header {
      margin-bottom: var(--space-xl);
    }

    .sidebar__nav {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .nav-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      color: var(--color-text);
      text-decoration: none;
      font-size: var(--font-size-base);
      transition: background-color var(--transition-fast);
      cursor: pointer;
    }

    .nav-item:hover {
      background-color: var(--color-bg);
    }

    .nav-item--active {
      background-color: var(--color-primary);
      color: white;
    }

    .nav-item--active:hover {
      background-color: var(--color-primary-hover);
    }

    .nav-item__badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      border-radius: 10px;
      background-color: var(--color-bg);
      color: var(--color-text);
      font-size: var(--font-size-xs);
      font-weight: 600;
    }

    .nav-item--active .nav-item__badge {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
    }
  `;

  constructor() {
    super();
    this.currentRoute = '';
    this.inboxCount = 0;
    this.actionsCount = 0;
  }

  _handleNavClick(path) {
    this.dispatchEvent(
      new CustomEvent('navigate', {
        detail: { path },
        bubbles: true,
        composed: true,
      })
    );
  }

  _isActive(route) {
    return this.currentRoute === route;
  }

  render() {
    return html`
      <nav class="sidebar">
        <div class="sidebar__header">
          <logos-mark></logos-mark>
        </div>

        <div class="sidebar__nav">
          <a
            class="nav-item ${this._isActive('next-actions')
              ? 'nav-item--active'
              : ''}"
            @click=${() => this._handleNavClick('/next')}
          >
            <span>Next Actions</span>
            ${this.actionsCount > 0
              ? html`<span class="nav-item__badge">${this.actionsCount}</span>`
              : ''}
          </a>

          <a
            class="nav-item ${this._isActive('inbox')
              ? 'nav-item--active'
              : ''}"
            @click=${() => this._handleNavClick('/inbox')}
          >
            <span>Inbox</span>
            ${this.inboxCount > 0
              ? html`<span class="nav-item__badge">${this.inboxCount}</span>`
              : ''}
          </a>

          <a
            class="nav-item ${this._isActive('notes')
              ? 'nav-item--active'
              : ''}"
            @click=${() => this._handleNavClick('/notes')}
          >
            <span>Notes</span>
          </a>

          <a
            class="nav-item ${this._isActive('review')
              ? 'nav-item--active'
              : ''}"
            @click=${() => this._handleNavClick('/review')}
          >
            <span>Review</span>
          </a>

          <a
            class="nav-item ${this._isActive('habits')
              ? 'nav-item--active'
              : ''}"
            @click=${() => this._handleNavClick('/habits')}
          >
            <span>Habits</span>
          </a>

          <a
            class="nav-item ${this._isActive('settings')
              ? 'nav-item--active'
              : ''}"
            @click=${() => this._handleNavClick('/settings')}
          >
            <span>Settings</span>
          </a>
        </div>
      </nav>
    `;
  }
}

customElements.define('logos-sidebar', LogosSidebar);
