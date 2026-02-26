// packages/app/src/router.ts

import { html, TemplateResult } from "lit";

// Import Custom Components
import "./components/run-chart";
import "./components/aggregate-chart";

// Import Custom Views
import "./views/home-view";
import "./views/about-view";
import "./views/contact-view";
import "./views/construction-view";
import "./views/run-view";
import "./views/track-view";
import "./views/track-aggregate-view";

import {Switch} from "@calpoly/mustang";

export interface AppRoute {
  path: string;
  view?: (params?: any, query?: any) => TemplateResult;
  redirect?: string;
}

function requiresAuth(viewTemplate: TemplateResult): TemplateResult {
  const token = localStorage.getItem("token");
  if (!token) {
    const currentPath = window.location.pathname;
    window.location.href = `/login.html?redirect=${encodeURIComponent(
      currentPath
    )}`;
    return html`<div><h1>Redirecting to login…</h1></div>`;
  }
  return viewTemplate;
}

export const routes: AppRoute[] = [
  { path: "/", redirect: "/app" },

  // Root page
  {
    path: "/app",
    view: () => {
      return html`<home-view></home-view>`;
    },
  },

  // Tracking Progress View
  {
    path: "/app/track",
    view: () => {
      const query = new URLSearchParams(window.location.search);
      const viewMode = query.get("view");
      if (viewMode === "aggregate") {
        console.log("Rendering aggregate view");
        return requiresAuth(
          html`<track-aggregate-view></track-aggregate-view>`
        );
      }
      console.log("Rendering view ", viewMode);
      return requiresAuth(
        html`<track-view></track-view>`
      );
    },
  },

  // Individual Run View
  {
    path: "/app/track/:id",
    view: (params: Switch.Params) => {
      return requiresAuth(
        html`<run-view src=${params.id}></run-view>`
      );
    },
  },

  // About View
  {
    path: "/app/about",
    view: () => {
      return html`<about-view></about-view>`;
    },
  },

  // Contact View
  {
    path: "/app/contact",
    view: () => {
      return html`<contact-view></contact-view>`;
    },
  },

  // Pricing View (Under Construction)
  {
    path: "/app/pricing",
    view: () => {
      return html`<construction-view></construction-view>`;
    },
  },

  // Catch‐all 404:
  { path: "/(.*)", view: () => html`<h1>404 Not Found</h1>` },
];
