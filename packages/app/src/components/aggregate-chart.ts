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
      type: "bar",
      data: {
        datasets: [
          { 
            label: "Left", 
            data: seriesA, 
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderWidth: 1,
            borderRadius: {
              topLeft: 4,
              topRight: 4
            },
            categoryPercentage: 0.8,
            barPercentage: 0.9,
            grouped: false,
            maxBarThickness: 40
          },
          { 
            label: "Right", 
            data: seriesB, 
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderWidth: 1,
            borderRadius: {
              topLeft: 4,
              topRight: 4
            },
            categoryPercentage: 0.8,
            barPercentage: 0.9,
            grouped: false,
            maxBarThickness: 40
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: { mode: "nearest", intersect: false },
        parsing: false,     // IMPORTANT for performance
        animation: false,
        plugins: {
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
  }

  updated() {
    // Check if data has changed and update the chart
    if (this._chart && this._lastUpdateData) {
      const dataChanged = 
        this.leftData !== this._lastUpdateData.left ||
        this.rightData !== this._lastUpdateData.right ||
        this.dates !== this._lastUpdateData.dates;

      if (dataChanged) {
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

        const size = labels.length;
        const barThickness = Math.max(4, Math.min(40, 180 / size)); // Adjust bar thickness based on number of bars
        this._chart.data.datasets.forEach(dataset => {
          (dataset as any).barThickness = barThickness;
        });

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
}