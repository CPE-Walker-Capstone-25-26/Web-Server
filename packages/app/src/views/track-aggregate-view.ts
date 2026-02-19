import { Run } from "server/models";
import { customElement, property, state } from "lit/decorators.js";
import { html, css, LitElement } from "lit";
import { Auth, Observer } from "@calpoly/mustang";

type runLimited = Partial<Run>;

@customElement("track-aggregate-view")
export class RunView extends LitElement {

   _authObserver = new Observer<Auth.Model>(this, "truewalk:auth");
  @state()
  _user?: Auth.User;

  @state()
  runs?: runLimited[];

  timespan: number = 1 * 24 * 60 * 60 * 1000; // Default to last 7 days

  @state()
  timestamps?: Date[] = [];
  @state()
  leftData?: number[] = [];
  @state()
  rightData?: number[] = [];

  @state()
  error?: string;

  static styles = css`
    .aggregate-view-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 16px;
    }
    
    .track-header {
      padding: 8px 0;
      margin: 0px auto;
    }

    .view-links {
      margin: 0px auto;
      padding: 8px 0;
      max-width: 1100px;
    }
    
    .view-links a {
      text-decoration: none;
      color: #007bff;
      font-weight: bold;
    }
    
    .view-links a:hover {
      text-decoration: underline;
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

  extractRunData() {
    if (!this.runs) return;

    this.timestamps = this.runs.map(run => new Date(run.began || ""));
    this.leftData = this.runs.map(run => run.avgLeft || 0);
    this.rightData = this.runs.map(run => run.avgRight || 0);

    this.requestUpdate();
  }

  async hydrateRunData() {
    const apiBaseUrl = "/api/runs/limited-after";

    const url = new URL(apiBaseUrl, window.location.origin);
    if (this.timespan) {
      const fromDate = new Date(Date.now() - this.timespan);
      url.searchParams.set("from", fromDate.toISOString());
    }

    console.log(`Fetching aggregate run data with timespan: ${this.timespan}`);
    
    fetch(url, { headers: this.authorization })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json()
      })
      .then((data: runLimited[]) => {
        this.runs = data;
        this.extractRunData();
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
      return html`<p>Loading data...</p>`;
    }


    const timespanOptions = [
      { label: "Last 24 Hours", value: 24 * 60 * 60 * 1000 },
      { label: "Last 7 Days", value: 7 * 24 * 60 * 60 * 1000 },
      { label: "Last 30 Days", value: 30 * 24 * 60 * 60 * 1000 },
      { label: "Last Year", value: 365 * 24 * 60 * 60 * 1000 },
    ];

    const timespanSelect = html`
      <label for="timespan">Select Timespan: </label>
      <select id="timespan" @change=${(e: Event) => {
        const select = e.target as HTMLSelectElement;
        this.timespan = parseInt(select.value);
        this.hydrateRunData();
      }}>
        ${timespanOptions.map(option => html`
          <option value="${option.value}" ?selected=${this.timespan === option.value}>
            ${option.label}
          </option>
        `)}
      </select>
    `;

    return html`
      <div class="aggregate-view-container">
        <h1 class="track-header">Your Progress</h1>
        <div class="view-links">
          <a href="/app/track?view=all">All Runs</a> |
          <a href="/app/track?view=aggregate" style="text-decoration: underline;">Aggregate</a>
        </div>
        ${timespanSelect}
        <aggregate-chart
          .leftData=${this.leftData}
          .rightData=${this.rightData}
          .dates=${this.timestamps}
        ></aggregate-chart>
      </div>
    `;
  }
}