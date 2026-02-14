import { LitElement, html, css } from 'lit';
import { store } from './state/store.js';
import { setTheme, setRoute, openCapture } from './state/actions.js';
import { getActiveActionsCount, getInboxCount } from './state/selectors.js';
import { createRouter } from './router.js';
import './components/logos-sidebar.js';
import './components/logos-topbar.js';
import './components/overlays/capture-modal.js';
import './components/overlays/details-drawer.js';
import './pages/next-actions-page.js';
import './pages/inbox-page.js';
import './pages/placeholder-page.js';
import { setupGlobalHotkeys } from './utils/hotkeys.js';

class LogosApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 100vh;
      overflow: hidden;
    }

    .app {
      display: grid;
      grid-template-columns: 240px 1fr;
      grid-template-rows: auto 1fr;
      height: 100%;
      background: var(--logos-bg);
    }

    .app__sidebar {
      grid-column: 1;
      grid-row: 1 / -1;
    }

    .app__topbar {
      grid-column: 2;
      grid-row: 1;
    }

    .app__main {
      grid-column: 2;
      grid-row: 2;
      overflow-y: auto;
    }
  `;

  constructor() {
    super();
    this._state = store.getState();
    this._unsubscribe = null;
    this._router = null;
  }

  connectedCallback() {
    super.connectedCallback();

    // Subscribe to store updates
    this._unsubscribe = store.subscribe((state) => {
      this._state = state;
      this.requestUpdate();
    });

    // Initialize router
    this._router = createRouter(this);

    // Setup global hotkeys
    this._cleanupHotkeys = setupGlobalHotkeys(this._router);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
    if (this._cleanupHotkeys) {
      this._cleanupHotkeys();
    }
  }

  _handleNavigate(e) {
    if (e.detail?.route) {
      store.dispatch(setRoute(e.detail.route));
    }

    if (this._router) {
      this._router.goto(e.detail.path);
    }
  }

  _handleThemeToggle() {
    const newTheme = this._state.ui.theme === 'light' ? 'dark' : 'light';
    store.dispatch(setTheme(newTheme));
  }

  _handleCapture() {
    store.dispatch(openCapture());
  }

  renderPage(pageName) {
    switch (pageName) {
      case 'next-actions':
        return html`<next-actions-page></next-actions-page>`;
      case 'inbox':
        return html`<inbox-page></inbox-page>`;
      case 'notes':
        return html`<placeholder-page
          title="Notes"
          description="Organize your thoughts and references"
        ></placeholder-page>`;
      case 'review':
        return html`<placeholder-page
          title="Review"
          description="Weekly and monthly reviews"
        ></placeholder-page>`;
      case 'habits':
        return html`<placeholder-page
          title="Habits"
          description="Track daily habits and routines"
        ></placeholder-page>`;
      case 'settings':
        return html`<placeholder-page
          title="Settings"
          description="Customize your lo•gos experience"
        ></placeholder-page>`;
      default:
        return html`<placeholder-page
          title="Page Not Found"
          description="The requested page does not exist"
        ></placeholder-page>`;
    }
  }

  render() {
    const actionsCount = getActiveActionsCount(this._state);
    const inboxCount = getInboxCount(this._state);
    const { route, theme } = this._state.ui;

    return html`
      <div class="app">
        <div class="app__sidebar">
          <logos-sidebar
            .currentRoute=${route}
            .inboxCount=${inboxCount}
            .actionsCount=${actionsCount}
            @navigate=${this._handleNavigate}
          ></logos-sidebar>
        </div>

        <div class="app__topbar">
          <logos-topbar
            .theme=${theme}
            @theme-toggle=${this._handleThemeToggle}
            @capture=${this._handleCapture}
          ></logos-topbar>
        </div>

        <div class="app__main">
          ${this.renderPage(route || 'next-actions')}
        </div>

        <capture-modal></capture-modal>
        <details-drawer></details-drawer>
      </div>
    `;
  }
}

customElements.define('logos-app', LogosApp);
