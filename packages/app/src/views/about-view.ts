// packages/app/src/views/about-view.ts

import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("about-view")
export class AboutView extends LitElement {

  static styles = css`
    .about-container {
      max-width: 1100px;
      margin: 20px auto;
      color: var(--color-primary);
    }

    .about-header {
      margin-bottom: 1rem;
    }

    .about-header h1 {
      margin: 0 0 0.25rem 0;
      font-size: clamp(1.5rem, 2.6vw, 2rem);
      color: var(--color-primary);
    }

    .lead {
      margin: 0;
      color: var(--color-primary);
      line-height: 1.5;
      font-size: 1.02rem;
    }

    .about-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;
      align-items: start;
    }

    @media (min-width: 760px) {
      .about-grid {
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }
    }

    .impact h2,
    .details h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
    }

    .impact ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 0.6rem;
    }

    .impact li {
      background: var(--box-bg, #fff);
      border-radius: 8px;
      padding: 0.6rem 0.75rem;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
      display: flex;
      align-items: baseline;
      gap: 0.6rem;
      color: var(--color-primary);
    }

    .impact li strong {
      color: var(--color-secondary);
      font-weight: 700;
      min-width: 4.75rem;
      display: inline-block;
    }

    .details p {
      margin: 0 0 0.75rem 0;
      line-height: 1.6;
    }

    .about-container .impact,
    .about-container .details {
      padding: 0.5rem;
    }

    html.dark .impact li {
      background: var(--color-box);
      box-shadow: none;
    }

    img{
      max-height: 500px;
      margin: auto;
    }
  `;

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
      <section class="about-container" aria-labelledby="explaination">
        <header class="about-header">
          <h1 id="explaination">How It Works</h1>
          <p class="lead"> The system consists of three main components:</p>
        </header>

        <div class="about-grid">
          <section class="details" aria-labelledby="components">
            <h2 id="components">Components</h2>
            <p>
              1. Smart Walker Handles: Equipped with pressure sensors to measure
              user grip and weight distribution, providing real-time data on
              user stability and mobility.
            </p>
            <p>
              2. Mobile App: Displays real-time data from the handles via Bluetooth, tracks
              recovery progress, and allows users to set goals and receive
              personalized feedback.
            </p>
            <p>
              3. Web Dashboard: Enables users and healthcare providers to remotely
              monitor patient progress, analyze trends, and adjust therapy plans
              based on data insights.
            </p>
          </section>
          <img src="/images/truewalk-diagram.png" alt="Diagram showing the three components of the system: smart walker handles, mobile app, and web dashboard" />
        </div>
      </section>
    `;
  }
}
