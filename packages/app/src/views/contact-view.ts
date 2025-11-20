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
      <section class="about-container contact-container" aria-labelledby="contact-heading">
        <header class="about-header">
          <h1 id="contact-heading">Contact Us</h1>
          <p class="lead">If you would like to learn more about True Walk, please contact Carl Sloan.</p>
        </header>

        <div class="about-grid">
          <section class="details" aria-labelledby="contact-methods">
            <h2 id="contact-methods">Contact</h2>
            <ul>
              <li>Email: <a href="mailto:carl.sloan27@gmail.com">carl.sloan27@gmail.com</a></li>
            </ul>
          </section>
        </div>
      </section>
    `;
  }
}
