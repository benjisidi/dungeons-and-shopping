import reactn from "reactn";

import type { User } from "../types";

declare interface GlobalState {
  loaded: boolean;
  loggedIn: boolean;
  user: Omit<User, "password"> | null;
  shopLookup: { [id: string]: string };
}
declare interface UseGlobal {
  (key: "loggedIn"): [boolean, (newVal: boolean) => void];
  (key: "loaded"): [boolean, (newVal: boolean) => void];
  (key: "user"): [User, (newVal: User) => void];
  (key: "shopLookup"): [
    { [id: string]: string },
    (newVal: { [id: string]: string }) => void
  ];
}
export const getGlobal = (): GlobalState => reactn.getGlobal<GlobalState>();
export const setGlobal = (state: Partial<GlobalState>) =>
  reactn.setGlobal<GlobalState>(state);
export const useGlobal: UseGlobal = (key: keyof GlobalState) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reactn.useGlobal<GlobalState>(key) as any;
