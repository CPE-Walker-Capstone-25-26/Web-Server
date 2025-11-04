// packages/app/src/bar-chart.ts
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
let BarChartElement = class BarChartElement extends LitElement {
    constructor() {
        super(...arguments);
        // Values to plot
        this.data = [];
        // Units
        this.unit = '';
        // Chart type (day, week, month, year)
        this.variant = 'day';
        // Optional custom x‑axis labels
        this.labels = [];
    }
    connectedCallback() {
        super.connectedCallback();
        // variant attribute
        if (this.hasAttribute('variant')) {
            this.variant = this.getAttribute('variant');
        }
        // parse data attribute
        const rawData = this.getAttribute('data');
        if (rawData) {
            try {
                const arr = JSON.parse(rawData);
                if (Array.isArray(arr))
                    this.data = arr;
            }
            catch { }
        }
        // optional max override
        if (this.hasAttribute('max')) {
            const m = Number(this.getAttribute('max'));
            if (!isNaN(m))
                this.max = m;
        }
        // unit attribute
        if (this.hasAttribute('unit')) {
            this.unit = this.getAttribute('unit');
        }
        // custom labels
        const rawLabels = this.getAttribute('labels');
        if (rawLabels) {
            try {
                const lbls = JSON.parse(rawLabels);
                if (Array.isArray(lbls) && lbls.length === this.data.length) {
                    this.labels = lbls;
                }
            }
            catch { }
        }
        // default label sets if none provided
        if (!this.labels.length) {
            if (this.variant === 'week' && this.data.length === 7) {
                this.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            }
            else if (this.data.length === 24) {
                this.labels = Array.from({ length: 24 }, (_, i) => {
                    const hour = i % 12 === 0 ? 12 : i % 12;
                    const ap = i < 12 ? 'am' : 'pm';
                    return `${hour} ${ap}`;
                });
            }
            else if (this.variant === 'month' && this.data.length === 31) {
                this.labels = Array.from({ length: 31 }, (_, i) => String(i + 1));
            }
            else if (this.variant === 'year' && this.data.length === 12) {
                this.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            }
            else {
                this.labels = this.data.map((_, i) => String(i));
            }
        }
    }
    render() {
        // determine maximum and step
        const rawMax = Math.max(...this.data, 0);
        const base = this.max ?? rawMax;
        const step = Math.ceil((base / 4) / 5) * 5;
        const maxVal = step * 4;
        // horizontal grid stop lines
        const stops = [0, 1, 2, 3, 4].map(i => ({
            pct: 100 - (i * step) / maxVal * 100,
            val: i * step
        }));
        // grid-template for bars/x-axis
        const cols = this.data.length;
        const gridStyle = `grid-template-columns: repeat(${cols}, 1fr)`;
        // which x-labels to show
        let showTicks;
        if (this.data.length === 24) {
            showTicks = [0, 6, 12, 18];
        }
        else if (this.variant === 'month') {
            showTicks = [4, 9, 14, 19, 24, 29];
        }
        else if (this.variant === 'year') {
            showTicks = this.labels.map((_l, i) => i);
        }
        else {
            showTicks = this.data.map((_v, i) => i);
        }
        return html `
      <div class="chart">
        <svg class="grid">
          ${stops.map(s => html `<line x1="0%" y1="${s.pct}%" x2="100%" y2="${s.pct}%"></line>`)}
        </svg>

        <div class="bars" style="${gridStyle}">
          ${this.data.map(v => html `<div class="bar" style="height:${(v / maxVal) * 100}%"></div>`)}
        </div>

        <div class="x-axis" style="${gridStyle}">
          ${this.labels.map((lab, i) => html `<div>${showTicks.includes(i) ? lab : ''}</div>`)}
        </div>

        <div class="y-axis">
          ${[...stops].reverse().map(s => html `<span>${s.val}</span>`)}
        </div>
        <div class="y-unit">${this.unit}</div>
      </div>
    `;
    }
};
BarChartElement.styles = css `
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
    }
    .chart {
      position: absolute; inset: 0;
      padding: 16px 48px 32px 16px;
      box-sizing: border-box;
      background: var(--color-box, #fff);
      border-radius: var(--box-radius, 20px);
      overflow: hidden;
    }
    svg.grid {
      position: absolute;
      top: 16px; bottom: 32px;
      left: 16px; right: 48px;
      width: 100%;
      height: 100%;
    }
    line {
      stroke: var(--axis-color, #ddd);
      stroke-width: 1;
    }
    .bars {
      display: grid;
      position: absolute; top: 16px; bottom: 32px;
      left: 16px; right: 48px;
      align-items: end;
      gap: 2px;
    }
    :host([variant="week"]) .bars { gap: 10px; }
    .bar {
      background: var(--bar-color, #3481eb);
      border-radius: 3px 3px 0 0;
    }
    :host([variant="week"]) .bar {
      border-radius: 6px 6px 0 0;
    }
    .x-axis {
      position: absolute; bottom: 8px;
      left: 16px; right: 48px;
      display: grid;
      font-size: 12px;
      color: var(--label-color, #888);
      pointer-events: none;
    }
    .x-axis div {
      text-align: center;
      white-space: nowrap;
    }
    .y-axis {
      position: absolute;
      top: 16px; bottom: 32px;
      right: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 12px;
      color: var(--label-color, #888);
      pointer-events: none;
    }
    .y-unit {
      position: absolute; top: 4px; right: 16px;
      font-size: 14px;
      font-weight: bold;
      color: var(--label-color, #888);
    }
  `;
__decorate([
    property({ type: Array })
], BarChartElement.prototype, "data", void 0);
__decorate([
    property({ type: String })
], BarChartElement.prototype, "unit", void 0);
__decorate([
    property({ type: String })
], BarChartElement.prototype, "variant", void 0);
__decorate([
    property({ type: Number })
], BarChartElement.prototype, "max", void 0);
__decorate([
    property({ type: Array })
], BarChartElement.prototype, "labels", void 0);
BarChartElement = __decorate([
    customElement('bar-chart')
], BarChartElement);
export { BarChartElement };
