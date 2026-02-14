import { LitElement, html, css } from 'lit';

/**
 * <logos-mark> - The lo•gos brand mark
 */
class LogosMark extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }

    .mark {
      font-size: var(--font-size-xl);
      font-weight: 600;
      color: var(--logos-text);
      letter-spacing: 0.02em;
    }

    .mark__dot {
      color: var(--logos-primary);
      font-weight: 400;
    }
  `;

  render() {
    return html`
      <div class="mark">lo<span class="mark__dot">•</span>gos</div>
    `;
  }
}

customElements.define('logos-mark', LogosMark);
