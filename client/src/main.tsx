import { Provider } from "jotai";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { IntlProvider } from "./components/IntlProvider.tsx";
import { ThemeProvider } from "./components/ThemeProvider.tsx";
import { store } from "./store/states.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <IntlProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </IntlProvider>
    </Provider>
  </StrictMode>
);
