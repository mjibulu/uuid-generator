import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { IntlProvider, type AbstractIntlMessages } from "use-intl";
import { Tool } from "../tool/Tool";
import messages from "../tool/messages.json";

type Theme = "light" | "dark";

function preferredTheme(): Theme {
  return typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function App() {
  const [theme, setTheme] = useState<Theme>(preferredTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="site-title" href="./" aria-label="UUID v4 & v7 Generator home">
          UUID v4 & v7 Generator
        </a>
        <button
          className="icon-button"
          type="button"
          aria-label={`Use ${theme === "light" ? "dark" : "light"} theme`}
          onClick={() =>
            setTheme((current) => (current === "light" ? "dark" : "light"))
          }
        >
          {theme === "light" ? <Moon aria-hidden /> : <Sun aria-hidden />}
        </button>
      </header>

      <main>
        <section className="tool-introduction" aria-labelledby="tool-title">
          <p className="eyebrow">Browser-local utility</p>
          <h1 id="tool-title">UUID v4 & v7 Generator</h1>
          <p>Generate, format, copy, download, and inspect bounded batches of UUIDv4 or time-ordered UUIDv7 identifiers in the browser.</p>
        </section>

        <section className="tool-workspace" aria-label="Tool workspace">
          <IntlProvider
            locale="en"
            messages={messages as unknown as AbstractIntlMessages}
          >
            <Tool />
          </IntlProvider>
        </section>

        <details className="information-section">
          <summary>How to use this tool</summary>
          <div className="information-content">
            <ol>
            <li>{"Select UUIDv4 for random identifiers or UUIDv7 for time-ordered identifiers."}</li>
            <li>{"Choose a count preset or enter the required bounded batch size."}</li>
            <li>{"Select the list layout and optional uppercase, compact, or brace formatting, then generate."}</li>
            <li>{"Change formatting without replacing the generated values, then copy, download, clear, or regenerate the batch."}</li>
            <li>{"Paste any UUID into the inspector, or send the first generated value there, to review validity, version, variant, canonical form, and timestamp details."}</li>
            </ol>
          </div>
        </details>
      </main>

      <footer className="site-footer">
        <span>Open-source software under the MIT Licence.</span>
        <span>
          Created by Mujeeb for{" "}
          <a href="https://eburp.com/">eBURP</a>.
        </span>
      </footer>
    </div>
  );
}
