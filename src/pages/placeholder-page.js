import { LitElement, html, css } from 'lit';

/**
 * <placeholder-page> - Generic placeholder for unimplemented pages
 */
class PlaceholderPage extends LitElement {
  static properties = {
    title: { type: String },
    description: { type: String },
  };

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
      color: var(--color-text);
      margin-bottom: var(--space-sm);
    }

    .page__subtitle {
      font-size: var(--font-size-base);
      color: var(--color-text-secondary);
    }

    .page__content {
      max-width: 800px;
    }

    .placeholder {
      padding: var(--space-xl);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      text-align: center;
      color: var(--color-text-secondary);
    }
  `;

  constructor() {
    super();
    this.title = 'Page';
    this.description = 'Coming soon';
  }

  render() {
    return html`
      <div class="page">
        <div class="page__header">
          <h1 class="page__title">${this.title}</h1>
          <p class="page__subtitle">${this.description}</p>
        </div>

        <div class="page__content">
          <div class="placeholder">
            <p>🚧 This feature is under construction</p>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('placeholder-page', PlaceholderPage);
