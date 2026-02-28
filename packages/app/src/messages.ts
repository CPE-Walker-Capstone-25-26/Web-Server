// packages/app/src/messages.ts

import { User } from "server/models";

export type Msg =
  | ["user/load", {}]
  | ["user/set", { user: User }]
  | ["user/clear", {}]
  ;
