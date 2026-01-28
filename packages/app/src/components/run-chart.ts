import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
//import { Observer, Events } from "@calpoly/mustang";
import Chart from "chart.js/auto";

@customElement("run-chart")
export class RunChart extends LitElement {
  @state() private leftData: number[] = [];
  @state() private rightData: number[] = [];
  @state() private _chart: Chart | null = null;

  @property({ type: Boolean })
  private debugMode: boolean = false;

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

    .chart-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    canvas {
      max-width: 100%;
      max-height: 70vh;
    }

    .chart-text-slider-container {
      display: grid;
      align-items: center;
      justify-content: center;
    }

    .text-size-slider {
      width: 20vw;
    }
  `;

  formatTime(seconds: any): string {
    if (typeof seconds !== "number" || isNaN(seconds) || seconds < 0) {
      return "00:00:00";
    }
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  render() {
    const chart = html`<canvas id="runChartCanvas"></canvas>`;

    const testButtons = html`
      <div class="chart-test-buttons" style="display: flex; gap: 8px; margin-top: 12px; align-items: center; justify-content: center;">
        <!-- Buttons to fill random data -->
        <button @click=${() => this.fillRandomData(0.25)}>15 Min</button>
        <button @click=${() => this.fillRandomData(1)}>1 Hour</button>
        <button @click=${() => this.fillRandomData(3)}>3 Hours</button>
        <button @click=${() => this.fillRandomData(24)}>24 Hours</button>
        <button @click=${() => {
          if (!this._chart) return;
          
          const dataset0 = this._chart.data.datasets[0] as any;
          const dataset1 = this._chart.data.datasets[1] as any;
          dataset0.tension = dataset0.tension === 0 ? 0.1 : 0;
          dataset1.tension = dataset1.tension === 0 ? 0.1 : 0;

          this._chart.update();
        }}>Toggle Tension</button>
      </div>
      `;

    return html`
      <div class="chart-container">
        <!-- Render run chart here -->
        ${chart}
        <div class="chart-text-slider-container" style="width: 80%; margin-top: 12px; display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 12px;">A</span>
          <input type="range" min="1" max="200" value="50" class="text-size-slider" id="myRange" @input=${(e: Event) => {
            const target = e.target as HTMLInputElement;
            const value = parseInt(target.value, 10);
            const textSize = Math.round((value) / 10); // Scale from 1-10
            this.setTextSize(textSize);
          }}>
          <span style="font-size: 24px; font-weight: bold;">A</span>
        </div>
        ${this.debugMode ? testButtons : ''}
      </div>
    `;
  }

  firstUpdated() {
    const canvas = this.renderRoot.querySelector(
      "#runChartCanvas"
    );
    if (!(canvas instanceof HTMLCanvasElement)) return;

    const labels = Array.from(
      { length: this.leftData.length },
      (_, i) => i
    );

    const seriesA = labels.map((label, i) => ({
      x: label,
      y: this.leftData[i]
    }));

    const seriesB = labels.map((label, i) => ({
      x: label,
      y: this.rightData[i]
    }));

    this._chart = new Chart(canvas, {
      type: "line",
      data: {
        datasets: [
          { 
            label: "Left", 
            data: seriesA, 
            borderWidth: 2, 
            tension: 0.1,
            pointRadius: 0,
            pointHoverRadius: 3,
            pointHitRadius: 6
          },
          { 
            label: "Right", 
            data: seriesB, 
            borderWidth: 2, 
            tension: 0.1,
            pointRadius: 0,
            pointHoverRadius: 3,
            pointHitRadius: 6
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: { mode: "index", intersect: false },
        parsing: false,     // IMPORTANT for performance
        animation: false,
        plugins: {
          decimation: {
            enabled: true,
            algorithm: 'lttb',
            samples: 300
          },
          tooltip: {
            titleFont: {
              size: 16,
              weight: "bold"
            },
            bodyFont: {
              size: 14
            },
            padding: 10,
            boxPadding: 6,
            callbacks: {
              title: (items) => this.formatTime(items[0].parsed.x),
              label: (item) => {
                if (item.parsed.y === null)
                  return `${item.dataset.label}: No data`;
                
                const rounded = Math.round(item.parsed.y * 100) / 100;
                return `${item.dataset.label}: ${rounded} lbs`;
              }
            }
          }
        },
        scales: { 
          y: { 
              beginAtZero: true,
              title: {
                display: true,
                text: "Weight (lbs)",
                font: {
                  size: 16,        // bigger
                  weight: "bold"   // bolder
                }
              } 
            }, 
          x: {
              type: "linear",
              ticks: {
                callback: this.formatTime
              },
              title: {
                display: true,
                text: "Elapsed Time (hh:mm:ss)",
                font: {
                  size: 16,
                  weight: "bold"
                }
              }
            },
        },
      },
    });

    this._chart.update();

    if (this.debugMode){
      this.fillRandomData(3);
    }
  }

  private setData(left: number[], right: number[]) {
    this.leftData = left;
    this.rightData = right;

    if (this._chart) {
      const labels = Array.from({ length: left.length }, (_, i) => i)
      this._chart.data.labels = labels;

      const seriesA = labels.map((label, i) => ({
        x: label,
        y: this.leftData[i]
      }));

      const seriesB = labels.map((label, i) => ({
        x: label,
        y: this.rightData[i]
      }));

      this._chart.data.datasets[0].data = seriesA;
      this._chart.data.datasets[1].data = seriesB;
      this._chart.update();
    }
  }

  private setTextSize(value: number) {
    const chart = this._chart;
    if (!chart) return;

    // Update tooltip fonts
    chart.options.plugins!.tooltip!.titleFont = {
      size: 16 + value,
      weight: "bold"
    };
    chart.options.plugins!.tooltip!.bodyFont = {
      size: 14 + value
    };

    // Update y-axis title and ticks
    const yScale = chart.options.scales!.y as any;
    yScale.title!.font!.size = 16 + value;
    if (yScale.ticks) {
      yScale.ticks.font = { size: 12 + value };
    }

    // Update x-axis title and ticks
    const xScale = chart.options.scales!.x as any;
    xScale.title!.font!.size = 16 + value;
    if (xScale.ticks) {
      xScale.ticks.font = { size: 12 + value };
    }
    
    chart.update();
  }

  private fillRandomData(hours: number) {
    const points = hours * 3600;

    this.leftData = Array.from({ length: points }, () => 0);
    this.rightData = Array.from({ length: points }, () => 0);

    console.log(`Filling random data for ${hours} hours (${points} points)`);

    for (let i = 1; i < points; i++) {
      const newLeft = this.leftData[i - 1] + (Math.random() - 0.499) * 0.05;
      const newRight = this.rightData[i - 1] + (Math.random() - 0.499) * 0.05;
      this.leftData[i] = Math.max(0, newLeft);
      this.rightData[i] = Math.max(0, newRight);
    }

    this.setData(this.leftData, this.rightData);
  }
}