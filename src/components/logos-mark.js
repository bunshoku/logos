import { LitElement, html, css } from 'lit';
import logosDesignUrl from '../public/logos_design.png';

/**
 * <logos-mark> - The lo•gos brand mark
 */
class LogosMark extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .mark {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: var(--space-md) 0 var(--space-md);
    }

    .mark__image {
      display: block;
      width: min(240px, 100%);
      max-width: 100%;
      height: auto;
      object-fit: contain;
    }
  `;

  render() {
    return html`
      <div class="mark">
        <img
          class="mark__image"
          src=${logosDesignUrl}
          alt="lo•gos"
          draggable="false"
        />
      </div>
    `;
  }
}

customElements.define('logos-mark', LogosMark);
