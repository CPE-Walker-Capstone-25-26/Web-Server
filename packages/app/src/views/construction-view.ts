// packages/app/src/views/about-view.ts

import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("contact-view")
export class ContactView extends LitElement {
  // Use styles.css
  protected createRenderRoot() {
    return this;
  }
  render() {
    return html`
      <div class="construction-container" aria-labelledby="construction-heading">
        <header class="construction-header">
          <h1 id="construction-heading">Under Construction</h1>
          <p class="lead">This page is currently under construction. Please check back later!</p>
        </header>
        <img src="/images/construction.png" alt="Construction illustration" />
      </div>
    `;
  }
}
