export interface Configuration {
  NODE_ENV: "development" | "production";
  BASE_URL: string;
  VERSION: string;
}

export const CONFIGURATIONS: Configuration = {
  NODE_ENV: import.meta.env.VITE_USER_NODE_ENV,
  BASE_URL: import.meta.env.VITE_BASE_URL,
  VERSION: import.meta.env.VITE_VERSION ?? "development",
};
