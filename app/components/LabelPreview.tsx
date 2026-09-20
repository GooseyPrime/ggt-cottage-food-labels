"use client";

import { useEffect, useState } from "react";
import { TN } from "@/lib/states";
import { DEMO_UNLOCK_EVENT, UNLOCK_STORAGE_KEY } from "@/lib/config";

type LabelFields = {
  producerName: string;
  homeAddress: string;
  telephone: string;
  productName: string;
  ingredients: string;
};

const empty: LabelFields = {
  producerName: "",
  homeAddress: "",
  telephone: "",
  productName: "",
  ingredients: "",
};

export function LabelPreview() {
  const [fields, setFields] = useState<LabelFields>(empty);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    function syncUnlockState() {
      try {
        setUnlocked(localStorage.getItem(UNLOCK_STORAGE_KEY) === "1");
      } catch {
        setUnlocked(false);
      }
    }

    syncUnlockState();
    window.addEventListener(DEMO_UNLOCK_EVENT, syncUnlockState);

    return () => {
      window.removeEventListener(DEMO_UNLOCK_EVENT, syncUnlockState);
    };
  }, []);

  function setField<K extends keyof LabelFields>(key: K, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div>
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
            placeholder="Street, city, TN ZIP"
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
      <p className="ggt-disclaimer" aria-live="polite">
        {unlocked
          ? "Preview unlocked for this browser."
          : "Preview locked until checkout goes live or you use Demo unlock."}
      </p>

      <div
        className={`ggt-label-sheet${unlocked ? "" : " ggt-label-sheet--locked"}`}
        style={{ marginTop: 18 }}
        aria-label="TN label preview"
      >
        <h3>{fields.productName || "Product name"}</h3>
        <p>
          <strong>{fields.producerName || "Producer name"}</strong>
        </p>
        <p>{fields.homeAddress || "Home address"}</p>
        <p>{fields.telephone || "Telephone"}</p>
        <p>
          <strong>Ingredients:</strong>{" "}
          {fields.ingredients || "List descending by weight"}
        </p>
        <p>
          <em>{TN.disclaimer_verbatim}</em>
        </p>
        <p className="ggt-statute">
          {TN.program} · {TN.statute} · Not legal advice
        </p>
      </div>

      <p className="ggt-disclaimer">
        Required TN fields: {TN.required_fields.join("; ")}. This preview is a
        template only — <strong>not legal advice</strong>.
      </p>
    </div>
  );
}
