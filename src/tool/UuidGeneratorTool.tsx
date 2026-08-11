import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "use-intl";
import { CopyButton } from "../components/CopyButton";
import { DownloadButton } from "../components/DownloadButton";
import { ToolActions } from "../components/ToolActions";
import { ValidationMessage } from "../components/ValidationMessage";
import { formatUuids, generateUuids, parseUuid, type UuidOutputFormat, type UuidVersion, } from "../lib/public-tools/uuid";
const COUNT_PRESETS = [1, 5, 10, 25, 100] as const;
export function UuidGeneratorTool() {
    const locale = useLocale();
    const t = useTranslations("tools.developer.uuid-generator.tool");
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
            <p className="eyebrow">{t("headings.generator")}</p>
            <h2 id="uuid-builder-heading">{t("headings.create")}</h2>
          </div>
          {generatedAt ? (<span>
              {t("labels.generated", {
                time: generatedAt.toLocaleTimeString(locale),
            })}
            </span>) : null}
        </div>

        <div className="uuid-version-switch" role="radiogroup" aria-label={t("labels.version")}>
          <label className={version === 4 ? "active" : ""}>
            <input type="radio" name="uuid-version" value="4" checked={version === 4} onChange={() => setVersion(4)}/>
            <span>
              <strong>{t("versions.four")}</strong>
              {t("versions.random")}
            </span>
          </label>
          <label className={version === 7 ? "active" : ""}>
            <input type="radio" name="uuid-version" value="7" checked={version === 7} onChange={() => setVersion(7)}/>
            <span>
              <strong>{t("versions.seven")}</strong>
              {t("versions.ordered")}
            </span>
          </label>
        </div>

        <div className="uuid-count-row">
          <label htmlFor="uuid-count">
            {t("labels.count")}
            <input id="uuid-count" type="number" min="1" max="100" value={count} onChange={(event) => setCount(Number(event.target.value))} onBlur={() => setCount((current) => Math.min(100, Math.max(1, Math.round(current || 1))))}/>
          </label>
          <div className="uuid-count-presets" aria-label={t("labels.countPresets")}>
            {COUNT_PRESETS.map((preset) => (<button key={preset} type="button" className={count === preset ? "active" : ""} aria-pressed={count === preset} onClick={() => setCount(preset)}>
                {preset}
              </button>))}
          </div>
        </div>

        <div className="uuid-format-grid">
          <label>
            {t("labels.layout")}
            <select value={outputFormat} onChange={(event) => setOutputFormat(event.target.value as UuidOutputFormat)}>
              <option value="lines">{t("layouts.lines")}</option>
              <option value="comma">{t("layouts.comma")}</option>
              <option value="json">{t("layouts.json")}</option>
              <option value="sql">{t("layouts.sql")}</option>
            </select>
          </label>
          <label className="checkbox-field">
            <input type="checkbox" checked={uppercase} onChange={(event) => setUppercase(event.target.checked)}/>
            {t("labels.uppercase")}
          </label>
          <label className="checkbox-field">
            <input type="checkbox" checked={hyphens} onChange={(event) => setHyphens(event.target.checked)}/>
            {t("labels.hyphens")}
          </label>
          <label className="checkbox-field">
            <input type="checkbox" checked={braces} onChange={(event) => setBraces(event.target.checked)}/>
            {t("labels.braces")}
          </label>
        </div>

        <ToolActions>
          <button type="button" className="primary-button" onClick={generate}>
            {t("actions.generate")}
          </button>
          <button type="button" className="secondary-button" disabled={!values.length} onClick={() => {
            setValues([]);
            setGeneratedAt(null);
        }}>
            {t("actions.clear")}
          </button>
        </ToolActions>
        <p className="uuid-stability-note">{t("descriptions.stability")}</p>
      </section>

      <section className="uuid-output-panel" aria-labelledby="uuid-output-heading">
        <div className="uuid-section-heading">
          <div>
            <p className="eyebrow">{t("headings.current")}</p>
            <h2 id="uuid-output-heading">{t("headings.generated")}</h2>
          </div>
          <span>
            {values.length
            ? t("counts.unique", {
                unique: uniqueCount,
                total: values.length,
            })
            : t("empty.batch")}
          </span>
        </div>
        <textarea id="uuid-output" aria-label={t("labels.outputAria", { version })} value={output} readOnly rows={14} placeholder={t("placeholders.output")}/>
        <div className="uuid-output-meta">
          <span>{t("counts.identifiers", { count: values.length })}</span>
          <span>
            {t("counts.characters", {
            count: output.length.toLocaleString(locale),
        })}
          </span>
        </div>
        <ToolActions sticky>
          <CopyButton text={output} toolSlug="uuid-generator">
            {t("actions.copy")}
          </CopyButton>
          <DownloadButton content={output} filename={outputFormat === "json"
            ? `uuid-v${version}-batch.json`
            : `uuid-v${version}-batch.txt`} mimeType={outputFormat === "json" ? "application/json" : "text/plain"} toolSlug="uuid-generator">
            {t("actions.download")}
          </DownloadButton>
          <button type="button" className="secondary-button" disabled={!values.length} onClick={() => setInspectValue(values[0] ?? "")}>
            {t("actions.inspectFirst")}
          </button>
        </ToolActions>
      </section>

      <section className="uuid-inspector" aria-labelledby="uuid-inspector-heading">
        <div className="uuid-section-heading">
          <div>
            <p className="eyebrow">{t("headings.validator")}</p>
            <h2 id="uuid-inspector-heading">{t("headings.inspect")}</h2>
          </div>
        </div>
        <label htmlFor="uuid-inspect-input">
          {t("labels.inspectInput")}
          <input id="uuid-inspect-input" value={inspectValue} placeholder={t("placeholders.uuid")} autoCapitalize="off" autoComplete="off" spellCheck={false} onChange={(event) => setInspectValue(event.target.value)}/>
        </label>

        {inspected ? (inspected.valid ? (<>
              <ValidationMessage type="success" message={t("messages.valid", {
                version: inspected.version ?? t("labels.unknown"),
                variant: inspected.variant
                    ? t(`variants.${inspected.variant}`)
                    : t("labels.unknown"),
            })}/>
              <dl className="uuid-inspection-grid">
                <div>
                  <dt>{t("labels.canonical")}</dt>
                  <dd>
                    <code>{inspected.canonical}</code>
                  </dd>
                </div>
                <div>
                  <dt>{t("labels.version")}</dt>
                  <dd>{inspected.version}</dd>
                </div>
                <div>
                  <dt>{t("labels.variant")}</dt>
                  <dd>
                    {inspected.variant
                ? t(`variants.${inspected.variant}`)
                : t("labels.unknown")}
                  </dd>
                </div>
                <div>
                  <dt>{t("labels.embeddedTime")}</dt>
                  <dd>
                    {inspected.timestamp
                ? new Intl.DateTimeFormat(locale, {
                    dateStyle: "medium",
                    timeStyle: "long",
                }).format(inspected.timestamp)
                : t("labels.noTimestamp")}
                  </dd>
                </div>
              </dl>
              <CopyButton text={inspected.canonical} toolSlug="uuid-generator" ariaLabel={t("actions.copyCanonical")}>
                {t("actions.copyCanonical")}
              </CopyButton>
            </>) : (<ValidationMessage type="error" message={t("errors.invalid")}/>)) : (<p className="empty-state">{t("empty.inspector")}</p>)}
      </section>
    </div>);
}
