import { atom } from "jotai";

export const currentChatEnum = {
  NONE: undefined,
  NEW: -1,
} as const;

export type CurrentChatAtomType =
  | (typeof currentChatEnum)[keyof typeof currentChatEnum]
  | number;

export const currentChatAtom = atom<CurrentChatAtomType>(currentChatEnum.NONE);
