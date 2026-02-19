import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
//import { Observer, Events } from "@calpoly/mustang";
import Chart from "chart.js/auto";

@customElement("aggregate-chart")
export class AggregateChart extends LitElement {
  @property({ type: Array })
  leftData: number[] = [];
  @property({ type: Array })
  rightData: number[] = [];

  @property({ type: Array })
  dates: Date[] = [];

  @state() private _chart: Chart | null = null;

  private _lastUpdateData: { left: number[], right: number[], dates: Date[] } | null = null;

  @property({ type: Boolean })
  private debugMode: boolean = false;

  private _seenDates: Set<string> | null = null;

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

  formatDate(milliseconds: any): string {
    const date = new Date(milliseconds);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const dtString = `${month}/${day}/${year}`;


    return dtString;
  }

  render() {
    const chart = html`<canvas id="aggregateChartCanvas"></canvas>`;

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
      "#aggregateChartCanvas"
    );
    if (!(canvas instanceof HTMLCanvasElement)) return;

    const labels = this.dates.map((date) => 
      date.getTime()
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
            tension: 0,
            pointRadius: 0,
            pointHoverRadius: 3,
            pointHitRadius: 6
          },
          { 
            label: "Right", 
            data: seriesB, 
            borderWidth: 2, 
            tension: 0,
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
              title: (items) => this.formatDate(items[0].parsed.x),
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
                callback: this.formatDate
              },
              title: {
                display: true,
                text: "Date (mm/dd/yyyy)",
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

    // Store the initial data
    this._lastUpdateData = {
      left: [...this.leftData],
      right: [...this.rightData],
      dates: [...this.dates]
    };

    if (this.debugMode){
      this.fillRandomData(3);
    }
  }

  updated() {
    // Check if data has changed and update the chart
    if (this._chart && this._lastUpdateData) {
      const dataChanged = 
        this.leftData !== this._lastUpdateData.left ||
        this.rightData !== this._lastUpdateData.right ||
        this.dates !== this._lastUpdateData.dates;

      if (dataChanged && this.leftData.length > 0 && this.rightData.length > 0 && this.dates.length > 0) {
        console.log("Data changed, updating chart");
        const labels = this.dates.map((date) => date.getTime());

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

        // Update tracking
        this._lastUpdateData = {
          left: [...this.leftData],
          right: [...this.rightData],
          dates: [...this.dates]
        };
      }
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