import { Run } from "server/models";
import { customElement, property, state } from "lit/decorators.js";
import { html, css, LitElement } from "lit";
import { Auth, Observer } from "@calpoly/mustang";

type runLimited = Partial<Run>;

@customElement("track-view")
export class RunView extends LitElement {
  @state()
  runs?: runLimited[];

   _authObserver = new Observer<Auth.Model>(this, "truewalk:auth");
  @state()
  _user?: Auth.User;

  @state()
  error?: string;

  static styles = css`
    :host {
      display: block;
      padding: 24px;
      color: #0f1b2a;
      box-sizing: border-box;
    }

    .track-header {
      margin: 0 auto;
      max-width: 1100px;
      padding: 20px 0;
    }

    .run-card-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      max-width: 1100px;
      margin: 0 auto;
    }

    .run-card {
      background: #ffffff;
      border: 1px solid #e1e5ee;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 6px 18px rgba(15, 27, 42, 0.08);
      transition: transform 140ms ease, box-shadow 140ms ease;
    }

    .run-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 22px rgba(15, 27, 42, 0.12);
    }

    .run-card a {
      color: #1f3b73;
      font-weight: 600;
      text-decoration: none;
      letter-spacing: 0.2px;
    }

    .run-card a:hover {
      text-decoration: underline;
    }

    p {
      max-width: 720px;
      margin: 24px auto 0;
      font-size: 0.98rem;
      color: #3a4b63;
    }
  `;

  get authorization(): Record<string, string> | undefined {
    if (this._user?.authenticated) {
      console.log("Providing auth header with token");
      return {
        Authorization: `Bearer ${(this._user as Auth.AuthenticatedUser).token}`
      };
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        console.log("Providing auth header with token from localStorage");
        return {
          Authorization: `Bearer ${token}`
        };
      }
    }
    console.log("No authenticated user; no auth header");
    return undefined;
  }

  async hydrateRunData() {
    const apiBaseUrl = "/api/runs/limited";

    fetch(`${apiBaseUrl}`, { headers: this.authorization })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json()
      })
      .then((data: runLimited[]) => {
        this.runs = data;
        this.runs.sort((a, b) => {
          const dateA = a.began ? new Date(a.began).getTime() : 0;
          const dateB = b.began ? new Date(b.began).getTime() : 0;
          return dateB - dateA; // Sort descending
        });
      })
      .catch((error) => {
        console.error("Error fetching run data:", error);
        this.error = error.message;
      });
  }

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth: Auth.Model) => {
      this._user= auth.user;
    });
    this.hydrateRunData();
  }

  renderError(){
    return html`<p>Error loading run data. Error code: ${this.error}</p>`;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  }

  override render() {
    if (this.error){
      return this.renderError();
    }

    if (!this.runs) {
      return html`<p>Loading run data...</p>`;
    }

    return html`
      <h1 class="track-header">Your Progress</h1>
      <div class="run-card-container">
        ${this.runs.map(run => html`
          <div class="run-card">
            <a href="/app/track/${run.id}">${run.began ? this.formatDate(new Date(run.began)) : 'No date'}</a> <br>
            ${run.distanceKm ? html`<span>${run.distanceKm.toFixed(2)} km</span>` : html`<span>No distance</span>`}
          </div>
        `)}
      </div>
    `;
  }
}