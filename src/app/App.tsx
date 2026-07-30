import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Tool } from "../tool/Tool";

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
          <Tool />
        </section>

        <details className="information-section">
          <summary>How to use this tool</summary>
          <div className="information-content">
            <ol>
            <li>{"Select UUIDv4 or UUIDv7 and choose the required batch size."}</li>
            <li>{"Generate a batch, then change formatting without regenerating its values."}</li>
            <li>{"Copy or download the batch, or paste one UUID into the validator for inspection."}</li>
            </ol>
          </div>
        </details>
      </main>

      <footer className="site-footer">
        <span>MIT licensed.</span>
        <a href="https://eburp.com/">Originally developed for eBURP</a>
      </footer>
    </div>
  );
}
