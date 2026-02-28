// packages/app/src/update.ts

import { Update } from "@calpoly/mustang";
import { User } from "server/models";
import { Model } from "./model";
import { Msg } from "./messages";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  _user: any // read JWT manually, not using Mustang’s Auth.User
) {
  switch (message[0]) {

    //  USER/LOAD
    case "user/load": {
      const token = localStorage.getItem("token") || "";
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (!response.ok) {
            apply((model) => {
              const next = { ...model };
              delete next.currentUser;
              return next;
            });
            return undefined;
          }
          return response.json();
        })
        .then((json: any | undefined) => {
          if (!json) return;
          const loadedUser = json as Model["currentUser"];
          apply((model) => ({ ...model, currentUser: loadedUser }));
        })
        .catch((err) => {
          console.error("Error loading user:", err);
          apply((model) => {
            const copy = { ...model };
            delete copy.currentUser;
            return copy;
          });
        });
      break;
    }

    // USER/SET 
    case "user/set": {
      const { user: newUser } = message[1];
      apply((model) => ({ ...model, currentUser: newUser }));
      break;
    }

    // USER/CLEAR
    case "user/clear": {
      apply((model) => {
        const next = { ...model };
        delete next.currentUser;
        return next;
      });
      break;
    }

    // EXHAUSTIVE CHECK
    default: {
      const _exhaustiveCheck: never = message[0];
      throw new Error(`Unhandled message "${_exhaustiveCheck}"`);
    }
  }
}
