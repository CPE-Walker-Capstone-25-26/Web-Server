// packages/app/src/views/share-progress-view.ts
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import "../components/share-form-card"; // <share-form-card> emits "share-submit"
import "../components/share-entry-card"; // <share-entry-card> emits "stop-share"
import { define, View, History } from "@calpoly/mustang";
import { html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
let ShareProgressView = class ShareProgressView extends View {
    constructor() {
        super("truewalk:model");
    }
    connectedCallback() {
        super.connectedCallback();
        this.dispatchMessage(["user/load", {}]);
    }
    updated(_changed) {
        super.updated(_changed);
        if (this.model.currentUser && this.model.currentUser !== this.currentUser) {
            this.currentUser = this.model.currentUser;
        }
    }
    // Fired when <share-form-card> does “@share-submit”
    handleNewShare(e) {
        const shareData = e.detail;
        if (!this.currentUser)
            return;
        // Build the object that matches Msg["share/save"]
        const shareObject = {
            withUserId: shareData.withUserId,
            mode: shareData.mode,
            sharedAt: new Date(),
            expiresAt: shareData.mode === "temporary" && shareData.expiresAt
                ? new Date(shareData.expiresAt)
                : undefined,
        };
        this.dispatchMessage([
            "share/save",
            {
                userid: this.currentUser.id,
                share: shareObject,
                onSuccess: () => {
                    History.dispatch(this, "history/navigate", { href: "/app/share" });
                },
                onFailure: (err) => {
                    console.error("Failed to save share:", err);
                    alert("Could not save share (see console).");
                },
            },
        ]);
    }
    // Fired when <share-entry-card> does “@stop-share”
    handleStopShare(e) {
        const targetId = e.detail.withUserId;
        if (!this.currentUser)
            return;
        // Dispatch the new "share/stop" message:
        this.dispatchMessage([
            "share/stop",
            {
                userid: this.currentUser.id,
                withUserId: targetId,
                onSuccess: () => {
                    // the MVU store is already updated by update()
                },
                onFailure: (err) => {
                    console.error("Failed to stop share:", err);
                    alert("Could not stop sharing (see console).");
                },
            },
        ]);
    }
    createRenderRoot() {
        return this; // render in light DOM
    }
    render() {
        if (!this.currentUser) {
            return html `<h2>Loading user…</h2>`;
        }
        // Show the "new share" form at top:
        const formSection = html `
      <share-form-card @share-submit="${this.handleNewShare}"></share-form-card>
    `;
        // If no shares exist, show placeholder text:
        if (!this.currentUser.shares || this.currentUser.shares.length === 0) {
            return html `
        <h1>Share Your Progress</h1>
        ${formSection}
        <h2>You are not sharing with anyone right now.</h2>
      `;
        }
        // Otherwise, list each share‐entry with a "Stop Sharing" button
        const listSection = html `
      <div class="entries">
        ${this.currentUser.shares.map((sh) => html `
            <share-entry-card
              .dataShareinfo="${{
            withUserId: sh.withUserId,
            mode: sh.mode,
            sharedAt: sh.sharedAt,
            expiresAt: sh.expiresAt,
        }}"
              @stop-share="${this.handleStopShare}"
            ></share-entry-card>
          `)}
      </div>
    `;
        return html `
      <h1>Share Your Progress</h1>
      ${formSection}
      ${listSection}
    `;
    }
};
ShareProgressView.uses = define({});
ShareProgressView.styles = css `
    :host {
      display: block;
      padding: 70px 1rem 1rem;
    }
    h1 {
      margin-bottom: 1rem;
      color: var(--color-primary, #182d3b);
    }
    .entries {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  `;
__decorate([
    state()
], ShareProgressView.prototype, "currentUser", void 0);
ShareProgressView = __decorate([
    customElement("share-progress-view")
], ShareProgressView);
export { ShareProgressView };
