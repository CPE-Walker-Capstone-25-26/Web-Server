import { Run } from "server/models";
import { customElement, property, state } from "lit/decorators.js";
import { html, css, LitElement } from "lit";
import { Auth, Observer } from "@calpoly/mustang";

@customElement("run-view")
export class RunView extends LitElement {
  @property({ type: String }) 
  src: string = "";

   _authObserver = new Observer<Auth.Model>(this, "truewalk:auth");
  @state()
  _user?: Auth.User;

  @state()
  run?: Run;

  @state()
  error?: string;

  static styles = css`
    .run-view-container {
      max-width: 90%;
      margin: 0 auto;
      padding: 16px;
    }
    .run-info {
      margin-top: 16px;
      font-size: 1.1em;
      background-color: rgb(228, 228, 228);
      padding: 20px;
      border-radius: 10px;
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
    const apiBaseUrl = "/api/runs";

    if (this.src) {
      console.log(`Fetching run data for src: ${this.src}`);
      fetch(`${apiBaseUrl}/${this.src}`, { headers: this.authorization })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json()
        })
        .then((data: Run) => {
          this.run = data;
        })
        .catch((error) => {
          console.error("Error fetching run data:", error);
          this.error = error.message;
        });
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth: Auth.Model) => {
      this._user= auth.user;
    });
    if (this.src) this.hydrateRunData();
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

    if (!this.run) {
      return html`<p>Loading run data...</p>`;
    }

    const dateStr = this.formatDate(new Date(this.run.began));

    return html`
      <div class="run-view-container">
        <h2>${dateStr}</h2>
        <run-chart
          .leftData=${this.run.dataLeft}
          .rightData=${this.run.dataRight}
        ></run-chart>
        <div class="run-info">
          <strong>Details:</strong>
          <p>Total Distance: ${this.run.distanceKm} km</p>
          <p>Average Left Hand Weight: ${this.run.avgLeft}lbs</p>
          <p>Average Right Hand Weight: ${this.run.avgRight}lbs</p>
        </div>
      </div>
    `;
  }
}