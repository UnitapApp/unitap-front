import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createRoot } from "react-dom/client";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://ebbf4d36ea304eeeb94604f18648407c@o262681.ingest.sentry.io/6422961",
    integrations: [new BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0
  });
}

const container = document.getElementById("root") as HTMLElement;

createRoot(container).render(App());

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
