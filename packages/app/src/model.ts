import { User } from "server/models";

// app-wide model
export interface Model {
  currentUser?: User;
}

// Initialize with no user loaded
export const init: Model = {};
