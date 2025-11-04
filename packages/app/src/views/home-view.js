// packages/app/src/views/home-view.ts
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
let HomeView = class HomeView extends LitElement {
    // Use styles.css
    createRenderRoot() {
        return this;
    }
    render() {
        return html `
      <div class="container">
        <div class="row">
          <a href="/app/purchasing" class="box middle picture-link">
            <img
              data-light="/public/images/handle.png"
              data-dark="/public/images/handle_inv3.jpg"
              src="/public/images/handle.png"
              alt="Purchasing"
            />
            <span class="overlay-text">Purchasing</span>
          </a>
          <a href="/app/track" class="box middle picture-link">
            <img
              data-light="/public/images/Track Progress.jpg"
              data-dark="/public/images/Track Progress_inv3.jpg"
              src="/public/images/Track Progress.jpg"
              alt="Track Progress"
            />
            <span class="overlay-text">Track Progress</span>
          </a>
        </div>

        <div class="box bottom">
          <img src="/icons/walkhard.svg" alt="True Walk logo" class="box-icon" />
          “Sometimes the smallest step in the right direction ends up being the
          biggest step of your life.”
        </div>

        <div class="box mission">
          <a href="/app/mission">Our Mission</a>
        </div>
      </div>
    `;
    }
};
HomeView = __decorate([
    customElement("home-view")
], HomeView);
export { HomeView };
