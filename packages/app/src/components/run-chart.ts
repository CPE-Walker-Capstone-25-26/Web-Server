import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
//import { Observer, Events } from "@calpoly/mustang";
import Chart from "chart.js/auto";

@customElement("run-chart")
export class RunChart extends LitElement {
  //@state() private runData: number[] = [];
  @state() private _chart: Chart | null = null;

  // Check if signed‐in
  //@state() private authenticated = false;
  //@state() private username: string | null = null;
  //private authObserver!: Observer<any>;

  constructor() {
    super();
    //this.authObserver = new Observer(this, "truewalk:auth");
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  protected createRenderRoot() {
    return this;
  }

  static styles = css`
    /* Add your styles here */
  `;

  render() {
    const chart = html`<canvas id="runChartCanvas"></canvas>`;

    return html`
      <div>
        <h2>Run Chart</h2>
        <!-- Render run chart here -->
        ${chart}
      </div>
    `;
  }

  firstUpdated() {
    const canvas = this.renderRoot.querySelector(
      "#runChartCanvas"
    );
    if (!(canvas instanceof HTMLCanvasElement)) return;

    this._chart = new Chart(canvas, {
      type: "line",
      data: {
        labels: [1, 2, 3, 4],
        datasets: [
          { label: "A", data: [5, 6, 10, 11], borderWidth: 2, tension: 0.3 },
          { label: "B", data: [2, 7, 9, 8], borderWidth: 2, tension: 0.3 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        scales: { y: { beginAtZero: true } },
      },
    });

    this._chart.update();
  }
}