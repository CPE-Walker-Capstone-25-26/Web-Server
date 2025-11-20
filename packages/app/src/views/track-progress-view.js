// packages/app/src/views/track-progress-view.ts
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import "../components/bar-chart";
import { View } from "@calpoly/mustang";
import { html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
let TrackProgressView = class TrackProgressView extends View {
    constructor() {
        super("truewalk:model");
    }
    // Once view is attached, fetch("/api/auth/me"):
    connectedCallback() {
        super.connectedCallback();
        this.dispatchMessage(["user/load", {}]);
    }
    // Whenever the model changes, check if currentUser has changed:
    updated(changedProps) {
        super.updated(changedProps);
        // Whenever the store’s model.currentUser becomes non‐undefined
        if (this.model.currentUser !== this.currentUser) {
            this.currentUser = this.model.currentUser;
        }
    }
    createRenderRoot() {
        return this;
    }
    render() {
        // Show a loading message:
        if (!this.currentUser || !this.currentUser.usage) {
            //return html`<div class="error-message">Error loading user data.</div>`;
            this.currentUser = {
                id: "demo-user",
                name: "Demo User",
                tocAccepted: true,
                usage: Array.from({ length: 137 }, () => Math.floor(Math.random() * 100))
            };
        }
        // Split number[] array into eight charts:
        const usage = this.currentUser.usage;
        if (!usage || usage.length < 137) {
            return html `<div class="error-message">Insufficient usage data.</div>`;
        }
        const SIZES = [24, 24, 7, 7, 31, 31, 12, 12];
        const VARIANTS = [
            "day",
            "day",
            "week",
            "week",
            "month",
            "month",
            "year",
            "year",
        ];
        let offset = 0;
        // Build each <bar-chart> slot in order:
        const charts = SIZES.map((count, i) => {
            const slice = usage.slice(offset, offset + count);
            offset += count;
            const variant = VARIANTS[i];
            return html `
        <div class="box graph chart-slot">
          <bar-chart .data="${slice}" unit="lbs" variant="${variant}"></bar-chart>
        </div>
      `;
        });
        return html `
      <main class="container">
        <div class="row">${charts.slice(0, 2)}</div>
        <div class="row">${charts.slice(2, 4)}</div>
        <div class="row">${charts.slice(4, 6)}</div>
        <div class="row">${charts.slice(6, 8)}</div>
      </main>
    `;
    }
};
TrackProgressView.styles = css `
    :host {
      display: block;
      padding-top: 70px; /* to clear the fixed header */
    }
  `;
__decorate([
    state()
], TrackProgressView.prototype, "currentUser", void 0);
TrackProgressView = __decorate([
    customElement("track-progress-view")
], TrackProgressView);
export { TrackProgressView };
