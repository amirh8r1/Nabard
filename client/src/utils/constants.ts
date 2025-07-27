export enum Locales {
  Fa = "fa",
  En = "en",
}

export const LANGUAGES = {
  farsi: {
    locale: Locales.Fa,
    direction: "rtl",
  },
  english: {
    locale: Locales.En,
    direction: "ltr",
  },
};

export const THEMES = {
  light: "light",
  dark: "dark",
};

export const ROUTES = {
  login: "/login",
  home: "/",
  notFound: "/not-found",
  serverError: "/server-error",
  others: "*",
};
