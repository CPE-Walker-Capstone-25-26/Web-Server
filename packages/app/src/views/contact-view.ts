// packages/app/src/views/about-view.ts

import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("contact-view")
export class ContactView extends LitElement {
  
  static styles = css`
    :host {
      display: block;
      padding: 2rem 1rem;
      min-height: calc(100vh - var(--toolbar-height, 70px));
    }

    .contact-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .about-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .about-header h1 {
      font-size: clamp(2rem, 5vw, 3rem);
      color: #182d3b;
      margin: 0 0 1rem 0;
      font-weight: 600;
    }

    .lead {
      font-size: 1.125rem;
      line-height: 1.6;
      color: #555;
      max-width: 700px;
      margin: 0 auto;
    }

    .about-grid {
      display: grid;
      gap: 2rem;
    }

    .details {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .details h2 {
      font-size: 1.75rem;
      color: #182d3b;
      margin: 0 0 1.5rem 0;
      font-weight: 600;
      border-bottom: 3px solid #0353A4;
      padding-bottom: 0.5rem;
    }

    .details h3 {
      font-size: 1.25rem;
      color: #0353A4;
      margin: 1.5rem 0 0.75rem 0;
      font-weight: 600;
    }

    .details h3:first-of-type {
      margin-top: 0;
    }

    .details ul {
      list-style: none;
      padding: 0;
      margin: 0 0 1rem 0;
    }

    .details li {
      padding: 0.75rem 0;
      font-size: 1rem;
      color: #333;
      display: flex;
      align-items: center;
    }

    .details li::before {
      content: "•";
      color: #006DAA;
      font-weight: bold;
      font-size: 1.5rem;
      margin-right: 0.75rem;
    }

    .details a {
      color: #0353A4;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .details a:hover {
      color: #006DAA;
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      :host {
        padding: 1.5rem 0.75rem;
      }

      .details {
        padding: 1.5rem;
      }

      .about-header h1 {
        font-size: 2rem;
      }

      .lead {
        font-size: 1rem;
      }
    }
  `;

  render() {
    return html`
      <section class="about-container contact-container" aria-labelledby="contact-heading">
        <header class="about-header">
          <h1 id="contact-heading">Contact Us</h1>
          <p class="lead">If you would like to learn more about True Walk, please contact Carl Sloan or one of the team members.</p>
        </header>

        <div class="about-grid">
          <section class="details" aria-labelledby="contact-methods">
            <h2 id="contact-methods">Contact</h2>
            <h3>Carl Sloan</h3>
            <ul>
              <li>Email: <a href="mailto:carl.sloan27@gmail.com"> carl.sloan27@gmail.com</a></li>
            </ul>
            <h3>General Inquiries - Martin Alvarez</h3>
            <ul>
              <li>Phone: +1 (805) 512-5025</li>
            </ul>
            <h3>Website Inquiries - Calvin Matsushita</h3>
            <ul>
              <li>Email: <a href="mailto:cjmats04@gmail.com">cjmats04@gmail.com</a></li>
            </ul>
          </section>
        </div>
      </section>
    `;
  }
}
