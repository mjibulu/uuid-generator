import { useMemo, useState } from "react";
import { CopyButton } from "../components/CopyButton";
import { DownloadButton } from "../components/DownloadButton";
import { ToolActions } from "../components/ToolActions";
import { ValidationMessage } from "../components/ValidationMessage";
import { formatUuids, generateUuids, parseUuid, type UuidOutputFormat, type UuidVersion, } from "../lib/public-tools/uuid";
const COUNT_PRESETS = [1, 5, 10, 25, 100] as const;
export function UuidGeneratorTool() {
    const [count, setCount] = useState(5);
    const [version, setVersion] = useState<UuidVersion>(4);
    const [uppercase, setUppercase] = useState(false);
    const [hyphens, setHyphens] = useState(true);
    const [braces, setBraces] = useState(false);
    const [outputFormat, setOutputFormat] = useState<UuidOutputFormat>("lines");
    const [values, setValues] = useState<string[]>([]);
    const [generatedAt, setGeneratedAt] = useState<Date | null>(null);
    const [inspectValue, setInspectValue] = useState("");
    const output = useMemo(() => formatUuids(values, {
        uppercase,
        hyphens,
        braces,
        format: outputFormat,
    }), [braces, hyphens, outputFormat, uppercase, values]);
    const inspected = useMemo(() => (inspectValue.trim() ? parseUuid(inspectValue) : null), [inspectValue]);
    const uniqueCount = useMemo(() => new Set(values).size, [values]);
    const generate = () => {
        const safeCount = Math.min(100, Math.max(1, Math.round(count || 1)));
        setCount(safeCount);
        const nextValues = generateUuids(safeCount, version);
        setValues(nextValues);
        setGeneratedAt(new Date());
    };
    return (<div className="uuid-workbench">
      <section className="uuid-builder" aria-labelledby="uuid-builder-heading">
        <div className="uuid-section-heading">
          <div>
            <p className="eyebrow">Batch generator</p>
            <h2 id="uuid-builder-heading">Create UUIDs</h2>
          </div>
          {generatedAt ? (<span>Generated {generatedAt.toLocaleTimeString()}</span>) : null}
        </div>

        <div className="uuid-version-switch" role="radiogroup" aria-label="UUID version">
          <label className={version === 4 ? "active" : ""}>
            <input type="radio" name="uuid-version" value="4" checked={version === 4} onChange={() => setVersion(4)}/>
            <span>
              <strong>Version 4</strong>
              Random identifiers
            </span>
          </label>
          <label className={version === 7 ? "active" : ""}>
            <input type="radio" name="uuid-version" value="7" checked={version === 7} onChange={() => setVersion(7)}/>
            <span>
              <strong>Version 7</strong>
              Time-ordered identifiers
            </span>
          </label>
        </div>

        <div className="uuid-count-row">
          <label htmlFor="uuid-count">
            Number of UUIDs
            <input id="uuid-count" type="number" min="1" max="100" value={count} onChange={(event) => setCount(Number(event.target.value))} onBlur={() => setCount((current) => Math.min(100, Math.max(1, Math.round(current || 1))))}/>
          </label>
          <div className="uuid-count-presets" aria-label="UUID count presets">
            {COUNT_PRESETS.map((preset) => (<button key={preset} type="button" className={count === preset ? "active" : ""} aria-pressed={count === preset} onClick={() => setCount(preset)}>
                {preset}
              </button>))}
          </div>
        </div>

        <div className="uuid-format-grid">
          <label>
            Output layout
            <select value={outputFormat} onChange={(event) => setOutputFormat(event.target.value as UuidOutputFormat)}>
              <option value="lines">One per line</option>
              <option value="comma">Comma separated</option>
              <option value="json">JSON array</option>
              <option value="sql">SQL quoted list</option>
            </select>
          </label>
          <label className="checkbox-field">
            <input type="checkbox" checked={uppercase} onChange={(event) => setUppercase(event.target.checked)}/>
            Uppercase
          </label>
          <label className="checkbox-field">
            <input type="checkbox" checked={hyphens} onChange={(event) => setHyphens(event.target.checked)}/>
            Include hyphens
          </label>
          <label className="checkbox-field">
            <input type="checkbox" checked={braces} onChange={(event) => setBraces(event.target.checked)}/>
            Wrap in braces
          </label>
        </div>

        <ToolActions>
          <button type="button" className="primary-button" onClick={generate}>
            Generate UUIDs
          </button>
          <button type="button" className="secondary-button" disabled={!values.length} onClick={() => {
            setValues([]);
            setGeneratedAt(null);
        }}>
            Clear batch
          </button>
        </ToolActions>
        <p className="uuid-stability-note">
          Formatting changes reuse the current batch. Only Generate UUIDs
          creates new identifiers.
        </p>
      </section>

      <section className="uuid-output-panel" aria-labelledby="uuid-output-heading">
        <div className="uuid-section-heading">
          <div>
            <p className="eyebrow">Current batch</p>
            <h2 id="uuid-output-heading">Generated UUIDs</h2>
          </div>
          <span>
            {values.length
            ? `${uniqueCount}/${values.length} unique`
            : "No batch yet"}
          </span>
        </div>
        <textarea id="uuid-output" aria-label={`Version ${version} UUIDs`} value={output} readOnly rows={14} placeholder="Choose your settings and generate a batch."/>
        <div className="uuid-output-meta">
          <span>{values.length} identifiers</span>
          <span>{output.length.toLocaleString()} characters</span>
        </div>
        <ToolActions>
          <CopyButton text={output} toolSlug="uuid-generator">
            Copy batch
          </CopyButton>
          <DownloadButton content={output} filename={outputFormat === "json"
            ? `uuid-v${version}-batch.json`
            : `uuid-v${version}-batch.txt`} mimeType={outputFormat === "json" ? "application/json" : "text/plain"} toolSlug="uuid-generator">
            Download batch
          </DownloadButton>
          <button type="button" className="secondary-button" disabled={!values.length} onClick={() => setInspectValue(values[0] ?? "")}>
            Inspect first UUID
          </button>
        </ToolActions>
      </section>

      <section className="uuid-inspector" aria-labelledby="uuid-inspector-heading">
        <div className="uuid-section-heading">
          <div>
            <p className="eyebrow">Validator</p>
            <h2 id="uuid-inspector-heading">Inspect a UUID</h2>
          </div>
        </div>
        <label htmlFor="uuid-inspect-input">
          UUID to inspect
          <input id="uuid-inspect-input" value={inspectValue} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" autoCapitalize="off" autoComplete="off" spellCheck={false} onChange={(event) => setInspectValue(event.target.value)}/>
        </label>

        {inspected ? (inspected.valid ? (<>
              <ValidationMessage type="success" message={`Valid UUID · version ${inspected.version} · ${inspected.variant} variant.`}/>
              <dl className="uuid-inspection-grid">
                <div>
                  <dt>Canonical form</dt>
                  <dd><code>{inspected.canonical}</code></dd>
                </div>
                <div>
                  <dt>Version</dt>
                  <dd>{inspected.version}</dd>
                </div>
                <div>
                  <dt>Variant</dt>
                  <dd>{inspected.variant}</dd>
                </div>
                <div>
                  <dt>Embedded time</dt>
                  <dd>
                    {inspected.timestamp
                ? inspected.timestamp.toISOString()
                : "Not present in this UUID version"}
                  </dd>
                </div>
              </dl>
              <CopyButton text={inspected.canonical} toolSlug="uuid-generator" ariaLabel="Copy canonical UUID">
                Copy canonical UUID
              </CopyButton>
            </>) : (<ValidationMessage type="error" message="Enter 32 hexadecimal UUID characters, with optional hyphens or matching braces."/>)) : (<p className="empty-state">
            Paste a UUID to check its structure, version, and variant.
          </p>)}
      </section>
    </div>);
}
