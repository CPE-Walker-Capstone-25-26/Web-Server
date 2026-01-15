import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
//import { Observer, Events } from "@calpoly/mustang";
import Chart from "chart.js/auto";

@customElement("run-chart")
export class RunChart extends LitElement {
  @state() private leftData: number[] = [2, 4, 6, 3];
  @state() private rightData: number[] = [1, 5, 7, 9];
  @state() private _chart: Chart | null = null;


  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    canvas {
      max-width: 100%;
      max-height: 500px;
    }
  `;

  render() {
    const chart = html`<canvas id="runChartCanvas"></canvas>`;

    return html`
      <div class="chart-container">
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
        labels: Array.from({ length: this.leftData.length }, (_, i) => i),
        datasets: [
          { label: "Left", data: this.leftData, borderWidth: 2, tension: 0.3 },
          { label: "Right", data: this.rightData, borderWidth: 2, tension: 0.3 },
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