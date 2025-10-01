import { createStore } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { LANGUAGES, THEMES } from "../utils/constants";
import { Language } from "../utils/types";

export const store = createStore();

export const languageAtom = atomWithStorage<Language>(
  "language",
  localStorage.getItem("language")
    ? JSON.parse(localStorage.getItem("language")!)
    : LANGUAGES.farsi
);

export const themeAtom = atomWithStorage(
  "theme",
  localStorage.getItem("theme")
    ? JSON.parse(localStorage.getItem("theme")!)
    : THEMES.light
);

export const authAtom = atomWithStorage(
  "auth",
  localStorage.getItem("auth")
    ? JSON.parse(localStorage.getItem("auth")!)
    : null
);
