import { Run } from "server/models";
import { customElement, property, state } from "lit/decorators.js";
import { html, css, LitElement } from "lit";
import { Auth, Observer } from "@calpoly/mustang";

type runLimited = Partial<Run>;

@customElement("track-all-view")
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
      padding: 8px 0;
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

    .date-search-container {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 16px auto;
      max-width: 1100px;
    }

    .date-search-header {
      font-weight: 600;
    }

    .date-search-label {
      display: flex;
      flex-direction: column;
      font-size: 0.9rem;
    }

    .date-search-button {
      padding: 6px 12px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .date-search-button:hover {
      background-color: #0056b3;
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

  private convertToLocalDateInputValue(dateString: Date): string {
    const year = dateString.getFullYear();
    const month = String(dateString.getMonth() + 1).padStart(2, '0');
    const day = String(dateString.getDate()).padStart(2, '0');

    const localDate = `${year}-${month}-${day}`;

    return localDate;
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

  renderDateSearch() {
    const today = this.convertToLocalDateInputValue(new Date());
    const firstRunDate = this.runs?.length ? this.convertToLocalDateInputValue(new Date(this.runs[this.runs.length - 1].began || new Date())) : today;

    return html`
      <div class="date-search-container">
        <div class="date-search-header">   
          Search by date:
        </div>
        <label class="date-search-label">
          Start date:
          <input type="date" name="start" id="start-date" value=${firstRunDate} max=${today} min=${firstRunDate}>
        </label>

        <label class="date-search-label">
          End date:
          <input type="date" name="end" id="end-date" value=${today} max=${today} min=${firstRunDate}>
        </label>
        <button class="date-search-button" @click=${this.handleDateSearch}>Search</button>
      </div>
    `;
  }

  handleDateSearch(event: any) {
    const startInput = this.renderRoot.querySelector("#start-date") as HTMLInputElement;
    const endInput = this.renderRoot.querySelector("#end-date") as HTMLInputElement;
    const startDate = startInput.value ? new Date(startInput.value) : null;
    const endDate = endInput.value ? new Date(endInput.value) : null;

    if (startDate && endDate && startDate > endDate) {
      alert("Start date cannot be after end date.");
      return;
    }

    const filteredRuns = this.runs?.filter(run => {
      const runDate = run.began ? new Date(run.began) : null;
      if (!runDate) return false;
      if (startDate && runDate < startDate) return false;
      if (endDate && runDate > endDate) return false;
      return true;
    });

    if (filteredRuns) {
      this.runs = filteredRuns;
    } else {
      alert("No runs found for the selected date range.");
    }
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
      <div class="view-links">
        <a href="/app/track?view=all" style="text-decoration: underline;">All Runs</a> |
        <a href="/app/track?view=aggregate">Aggregate</a>
      </div>
      ${this.renderDateSearch()}
      <div class="run-card-container">
        ${this.runs.map(run => html`
          <div class="run-card">
            <a href="/app/track/${run.id}">${run.began ? this.formatDate(new Date(run.began)) : 'No date'}</a> <br>
            ${run.distanceKm !== undefined && run.distanceKm !== null ? html`<span>${run.distanceKm.toFixed(2)} km</span>` : html`<span>No distance</span>`}
          </div>
        `)}

        ${this.runs.length === 0 ? html`<p>No runs found for the selected date range.</p>` : null}
      </div>
    `;
  }
}