// packages/app/src/main.ts

import { define, Auth, History, Switch, Store } from "@calpoly/mustang";
import "./components/app-header";
import { routes } from "./router";

import { Msg } from "./messages";

import update from "./update";
import { init } from "./model";

console.log("main.ts loaded");

// Validate token before initializing the app
async function initializeApp() {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        console.log("Token is valid, setting in Auth context");
        const event = new CustomEvent("truewalk:auth/set", {
          detail: {
            authenticated: true,
            token,
          },
        });
        window.dispatchEvent(event);
      } else {
        console.log("Token in localStorage is invalid, removing");
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error validating token:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.location.reload();
    }
  } else {
    console.log("No token found in localStorage");
  }

  // Now define components after token validation completes
  define({
  // Auth context
  "mu-auth": Auth.Provider,

  // History context
  "mu-history": History.Provider,

  // MVU store: pass update, init, and the “truewalk:auth” name so the store can pull Auth.User
  "mu-store": class AppStore extends Store.Provider<typeof init, Msg> {
    constructor() {
      super(update, init, "truewalk:auth");
    }
  },

  // Switch: pass in our routes array, then history + auth context names
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes as any, "truewalk:history", "truewalk:auth");
      console.log("AppSwitch constructor called");
    }
    protected createRenderRoot() {
      return this; // use styles.css
    }
  },
  });

  console.log("Components defined (history + auth + store + switch)");
}

// Run initialization before app starts rendering
(async () => {
  await initializeApp();
})();
