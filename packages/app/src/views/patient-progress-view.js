// packages/app/src/views/patient-progress-view.ts
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import "../components/patient-card"; // register <patient-card>
import { define, View } from "@calpoly/mustang";
import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
let PatientProgressView = class PatientProgressView extends View {
    constructor() {
        super("truewalk:model");
        this.sharers = [];
    }
    connectedCallback() {
        super.connectedCallback();
        this.dispatchMessage(["user/load", {}]);
    }
    updated(_changed) {
        super.updated(_changed);
        if (this.model.currentUser &&
            this.model.currentUser !== this.currentUser) {
            this.currentUser = this.model.currentUser;
            this.loadSharers();
        }
    }
    async loadSharers() {
        if (!this.currentUser?.receives || this.currentUser.receives.length === 0) {
            this.sharers = [];
            return;
        }
        const token = localStorage.getItem("token") || "";
        const promises = this.currentUser.receives.map(async (shareRecord) => {
            const resp = await fetch(`http://localhost:3000/api/users/${encodeURIComponent(shareRecord.withUserId)}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!resp.ok) {
                console.error(`Could not fetch user ${shareRecord.withUserId}: status ${resp.status}`);
                return {
                    id: shareRecord.withUserId,
                    name: "(unknown)",
                    tocAccepted: false,
                    usage: [],
                    shareInfo: { ...shareRecord },
                };
            }
            const thatUser = (await resp.json());
            return {
                ...thatUser,
                shareInfo: {
                    withUserId: shareRecord.withUserId,
                    mode: shareRecord.mode,
                    sharedAt: shareRecord.sharedAt.toString(),
                    expiresAt: shareRecord.expiresAt?.toString(),
                },
            };
        });
        this.sharers = await Promise.all(promises);
    }
    render() {
        if (!this.currentUser) {
            return html `<h2>Loading profile…</h2>`;
        }
        if (!this.sharers || this.sharers.length === 0) {
            return html `<h2>No patients are currently sharing data with you.</h2>`;
        }
        return html `
      <h1>Patient Data Feed</h1>
      <div>
        ${this.sharers.map((sh) => html `
            <patient-card
              .dataUsage="${sh.usage || []}"
              .dataShareinfo="${sh.shareInfo}"
            ></patient-card>
          `)}
      </div>
    `;
    }
};
PatientProgressView.uses = define({});
__decorate([
    state()
], PatientProgressView.prototype, "currentUser", void 0);
__decorate([
    state()
], PatientProgressView.prototype, "sharers", void 0);
PatientProgressView = __decorate([
    customElement("patient-progress-view")
], PatientProgressView);
export { PatientProgressView };
