"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import {
  FIELDS_STORAGE_KEY,
  SESSION_STORAGE_KEY,
  TOOL_PATH,
  priceLabel,
} from "@/lib/config";
import {
  EMPTY_FIELDS,
  clampCopies,
  missingItems,
  statementFor,
  type LabelFields,
} from "@/lib/label";
import { STATES, getState } from "@/lib/states";

const API = `${TOOL_PATH}/api`;
const PRICE = priceLabel();

function LabelSheet({
  fields,
  statement,
  stateCode,
  locked,
  programLine,
}: {
  fields: LabelFields;
  statement: string;
  stateCode: string;
  locked?: boolean;
  programLine: string;
}) {
  return (
    <div
      className={`ggt-label-sheet${locked ? " ggt-label-sheet--locked" : ""}`}
      aria-label={`${stateCode} label preview`}
    >
      <h3>{fields.productName || "Product name"}</h3>
      <p>
        <strong>{fields.producerName || "Producer name"}</strong>
      </p>
      <p>{fields.homeAddress || "Home address"}</p>
      {fields.telephone ? <p>{fields.telephone}</p> : null}
      <p>
        <strong>Ingredients:</strong> {fields.ingredients || "List descending by weight"}
      </p>
      <p>
        <em>{statement || "Your state's required statement"}</em>
      </p>
      <p className="ggt-statute">{programLine}</p>
    </div>
  );
}

export function LabelPack() {
  const [stateCode, setStateCode] = useState("TN");
  const [fields, setFields] = useState<LabelFields>(EMPTY_FIELDS);
  const [copies, setCopies] = useState(6);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const checked = useRef(false);

  const state = getState(stateCode) ?? STATES[0];
  const unlocked = Boolean(sessionId);
  const statement = statementFor(state, fields);
  const missing = missingItems(state, fields);
  const programLine = state.statute
    ? `${state.program} · ${state.statute} · Not legal advice`
    : `${state.program} · Not legal advice`;

  function setField<K extends keyof LabelFields>(key: K, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  // Restore what the maker typed (kept in this browser across checkout), and confirm payment with the shop.
  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    try {
      const saved = localStorage.getItem(FIELDS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { stateCode?: string; fields?: Partial<LabelFields> };
        if (parsed.stateCode && getState(parsed.stateCode)) setStateCode(parsed.stateCode);
        if (parsed.fields) setFields({ ...EMPTY_FIELDS, ...parsed.fields });
      }
    } catch {
      /* ignore bad saved data */
    }
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("session_id");
    let candidate = fromUrl;
    try {
      candidate = fromUrl || localStorage.getItem(SESSION_STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
    if (!candidate) return;
    (async () => {
      try {
        const res = await fetch(`${API}/verify?session_id=${encodeURIComponent(candidate)}`);
        const data = await res.json();
        if (fromUrl) window.history.replaceState(null, "", TOOL_PATH);
        if (!res.ok || !data.paid) {
          localStorage.removeItem(SESSION_STORAGE_KEY);
          if (fromUrl) setError(data.message || "We could not confirm that purchase.");
          return;
        }
        localStorage.setItem(SESSION_STORAGE_KEY, candidate);
        setSessionId(candidate);
        if (fromUrl) setNote("Payment confirmed. Your label pack is unlocked on this device.");
      } catch {
        if (fromUrl) setError("We could not confirm that purchase. Please try again.");
      }
    })();
  }, []);

  // Keep what was typed so it survives the trip to checkout.
  useEffect(() => {
    if (!checked.current) return;
    try {
      localStorage.setItem(FIELDS_STORAGE_KEY, JSON.stringify({ stateCode, fields }));
    } catch {
      /* ignore */
    }
  }, [stateCode, fields]);

  async function onUnlock(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${API}/sale`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.message || "We could not start checkout.");
      window.location.assign(data.url as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not start checkout.");
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="ggt-field-grid">
        <label className="ggt-field">
          <span className="ggt-label">State</span>
          <select
            className="ggt-input"
            value={stateCode}
            onChange={(e) => setStateCode(e.target.value)}
          >
            {STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="ggt-help">
        {state.maker_supplies_statement ? (
          <>
            We have not encoded this state&apos;s wording. Look up the statement your state requires
            on its agriculture or health department site and enter it below. We do not guess legal
            wording.
          </>
        ) : (
          <>
            {state.program} ({state.statute}). Last checked {state.last_checked}.{" "}
            {state.official ? (
              <a href={state.official} target="_blank" rel="noreferrer">
                Official page
              </a>
            ) : null}
          </>
        )}
      </p>

      <div className="ggt-field-grid">
        <label className="ggt-field">
          <span className="ggt-label">Producer name</span>
          <input
            className="ggt-input"
            value={fields.producerName}
            onChange={(e) => setField("producerName", e.target.value)}
            placeholder="Your name / bakery"
          />
        </label>
        <label className="ggt-field">
          <span className="ggt-label">Home address</span>
          <input
            className="ggt-input"
            value={fields.homeAddress}
            onChange={(e) => setField("homeAddress", e.target.value)}
            placeholder="Street, city, state, ZIP"
          />
        </label>
        <label className="ggt-field">
          <span className="ggt-label">Telephone</span>
          <input
            className="ggt-input"
            value={fields.telephone}
            onChange={(e) => setField("telephone", e.target.value)}
            placeholder="(555) 555-5555"
          />
        </label>
        <label className="ggt-field">
          <span className="ggt-label">Common product name</span>
          <input
            className="ggt-input"
            value={fields.productName}
            onChange={(e) => setField("productName", e.target.value)}
            placeholder="Chocolate chip cookies"
          />
        </label>
      </div>
      <label className="ggt-field">
        <span className="ggt-label">Ingredients (descending by weight)</span>
        <textarea
          className="ggt-input"
          rows={3}
          value={fields.ingredients}
          onChange={(e) => setField("ingredients", e.target.value)}
          placeholder="Flour, sugar, butter, eggs, chocolate chips, salt…"
        />
      </label>
      {state.maker_supplies_statement ? (
        <label className="ggt-field">
          <span className="ggt-label">Statement your state requires</span>
          <textarea
            className="ggt-input"
            rows={3}
            value={fields.customStatement}
            onChange={(e) => setField("customStatement", e.target.value)}
            placeholder="Paste the exact wording from your state's cottage food rules"
          />
        </label>
      ) : null}

      <p className="ggt-disclaimer">
        Required for {state.name}: {state.required_fields.join("; ")}.{" "}
        {missing.length ? `Still missing: ${missing.join(", ")}.` : "All required items are filled in."}{" "}
        Templates are a research aid, <strong>not legal advice</strong>; confirm with your state
        before selling.
      </p>

      <div style={{ marginTop: 18 }}>
        <LabelSheet
          fields={fields}
          statement={statement}
          stateCode={state.code}
          locked={!unlocked}
          programLine={programLine}
        />
      </div>

      <section className="ggt-paywall" aria-labelledby="pack-heading" style={{ marginTop: 18 }}>
        <h2 id="pack-heading">{unlocked ? "Your label pack" : `Label pack — ${PRICE}`}</h2>
        {error ? (
          <p className="ggt-warn" role="alert">
            {error}
          </p>
        ) : null}
        {note ? <p role="status">{note}</p> : null}
        {unlocked ? (
          <div>
            <p className="ggt-help">
              Print a sheet of labels with the details above. Use sticker paper or plain paper and
              cut to size.
            </p>
            <div className="ggt-actions">
              <label className="ggt-field" style={{ marginTop: 0 }}>
                <span className="ggt-label">Labels on the sheet (1–24)</span>
                <input
                  className="ggt-input"
                  type="number"
                  min={1}
                  max={24}
                  value={copies}
                  onChange={(e) => setCopies(clampCopies(Number(e.target.value)))}
                />
              </label>
              <button type="button" className="ggt-btn" onClick={() => window.print()}>
                Print {copies} label{copies === 1 ? "" : "s"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onUnlock}>
            <p className="ggt-help">
              Unlock a print-ready sheet of your label with the {state.name} wording. Pay once; it
              stays unlocked on this device. No account.
            </p>
            <div className="ggt-actions">
              <button type="submit" className="ggt-btn" disabled={busy}>
                {busy ? "Opening checkout…" : `Unlock label pack — ${PRICE}`}
              </button>
            </div>
          </form>
        )}
      </section>

      {unlocked
        ? createPortal(
            <div className="ggt-print-area" aria-hidden="true">
              {Array.from({ length: copies }, (_, i) => (
                <LabelSheet
                  key={i}
                  fields={fields}
                  statement={statement}
                  stateCode={state.code}
                  programLine={programLine}
                />
              ))}
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
