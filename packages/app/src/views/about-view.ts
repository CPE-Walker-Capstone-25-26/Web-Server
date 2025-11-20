// packages/app/src/views/about-view.ts

import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("about-view")
export class AboutView extends LitElement {
  // Use styles.css
  protected createRenderRoot() {
    return this;
  }
  
  

  render() {
    return html`
      <section class="about-container" aria-labelledby="about-heading">
        <header class="about-header">
          <h1 id="about-heading">About True Walk</h1>
          <p class="lead">
            True Walk is developing a smart rehabilitation walker handle system
            designed to measure user pressure, track recovery progress, and
            provide fall-prevention messages and haptic signals for people
            recovering from stroke, brain injury, orthopedic injury, and age-
            related mobility loss.
          </p>
        </header>

        <div class="about-grid">
          <section class="impact" aria-labelledby="impact-heading">
            <h2 id="impact-heading">Impact Population</h2>
            <ul>
              <li><strong>795,000</strong> stroke survivors / year</li>
              <li><strong>214,000</strong> traumatic brain injury patients</li>
              <li><strong>6.6M</strong> orthopedic knee injury cases</li>
              <li><strong>56M</strong> older adults with mobility limitations</li>
            </ul>
          </section>

          <section class="details" aria-labelledby="details-heading">
            <h2 id="details-heading">What the system does</h2>
            <p>
              Built in collaboration with Cal Poly alumnus and stroke survivor
              Carl Sloan, the system gathers real-time pressure data from both
              handles, sends it wirelessly to a mobile app and therapist
              dashboard, and delivers haptic alerts when unsafe conditions are
              detected.
            </p>
            <p>
              Data-driven tracking lets therapists monitor recovery progress
              remotely and personalize therapy while the walker provides
              immediate feedback to help prevent falls.
            </p>
          </section>
        </div>
      </section>
    `;
  }
}
