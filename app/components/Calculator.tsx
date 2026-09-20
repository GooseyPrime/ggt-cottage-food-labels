"use client";

import { useMemo, useState } from "react";
import { calculatePricing, formatMoney, type CostInputs } from "@/lib/calc";

const defaults: CostInputs = {
  ingredientsCost: 12,
  packagingCost: 3,
  laborHours: 1.5,
  laborRate: 18,
  overheadPercent: 10,
  yieldUnits: 24,
  marginPercent: 40,
};

const yieldErrorId = "calculator-yield-error";
const marginErrorId = "calculator-margin-error";

export function Calculator() {
  const [inputs, setInputs] = useState<CostInputs>(defaults);

  const result = useMemo(() => calculatePricing(inputs), [inputs]);
  const hasYieldError = Boolean(result.validationErrors.yieldUnits);
  const hasMarginError = Boolean(result.validationErrors.marginPercent);

  function setField<K extends keyof CostInputs>(key: K, value: string) {
    const n = Number(value);
    setInputs((prev) => ({ ...prev, [key]: Number.isFinite(n) ? n : 0 }));
  }

  return (
    <div>
      <div className="ggt-field-grid">
        <label className="ggt-field">
          <span className="ggt-label">Ingredients ($)</span>
          <input
            className="ggt-input"
            type="number"
            min={0}
            step="0.01"
            value={inputs.ingredientsCost}
            onChange={(e) => setField("ingredientsCost", e.target.value)}
          />
        </label>
        <label className="ggt-field">
          <span className="ggt-label">Packaging ($)</span>
          <input
            className="ggt-input"
            type="number"
            min={0}
            step="0.01"
            value={inputs.packagingCost}
            onChange={(e) => setField("packagingCost", e.target.value)}
          />
        </label>
        <label className="ggt-field">
          <span className="ggt-label">Labor hours</span>
          <input
            className="ggt-input"
            type="number"
            min={0}
            step="0.25"
            value={inputs.laborHours}
            onChange={(e) => setField("laborHours", e.target.value)}
          />
        </label>
        <label className="ggt-field">
          <span className="ggt-label">Labor rate ($/hr)</span>
          <input
            className="ggt-input"
            type="number"
            min={0}
            step="0.01"
            value={inputs.laborRate}
            onChange={(e) => setField("laborRate", e.target.value)}
          />
        </label>
        <label className="ggt-field">
          <span className="ggt-label">Overhead (%)</span>
          <input
            className="ggt-input"
            type="number"
            min={0}
            step="1"
            value={inputs.overheadPercent}
            onChange={(e) => setField("overheadPercent", e.target.value)}
          />
        </label>
        <label className="ggt-field">
          <span className="ggt-label">Yield (units)</span>
          <input
            className="ggt-input"
            type="number"
            min={1}
            step="1"
            value={inputs.yieldUnits}
            onChange={(e) => setField("yieldUnits", e.target.value)}
            aria-invalid={hasYieldError}
            aria-describedby={hasYieldError ? yieldErrorId : undefined}
          />
        </label>
        <label className="ggt-field">
          <span className="ggt-label">Target margin (%)</span>
          <input
            className="ggt-input"
            type="number"
            min={0}
            max={99}
            step="1"
            value={inputs.marginPercent}
            onChange={(e) => setField("marginPercent", e.target.value)}
            aria-invalid={hasMarginError}
            aria-describedby={hasMarginError ? marginErrorId : undefined}
          />
        </label>
      </div>

      <div className="ggt-result" style={{ marginTop: 18 }}>
        <p>
          Labor: <strong>{formatMoney(result.laborCost)}</strong>
        </p>
        <p>
          Direct cost: <strong>{formatMoney(result.directCost)}</strong>
        </p>
        <p>
          Overhead: <strong>{formatMoney(result.overheadAmount)}</strong>
        </p>
        <p>
          Total batch: <strong>{formatMoney(result.totalCost)}</strong>
        </p>
        <p>
          Unit cost: <strong>{hasYieldError ? "—" : formatMoney(result.unitCost)}</strong>
        </p>
        <p>
          Suggested price:{" "}
          <strong>
            {hasYieldError || hasMarginError
              ? "—"
              : formatMoney(result.suggestedPrice)}
          </strong>
        </p>
      </div>
      {result.validationErrors.yieldUnits ? (
        <p
          id={yieldErrorId}
          className="ggt-disclaimer"
          role="alert"
        >
          {result.validationErrors.yieldUnits}
        </p>
      ) : null}
      {result.validationErrors.marginPercent ? (
        <p
          id={marginErrorId}
          className="ggt-disclaimer"
          role="alert"
        >
          {result.validationErrors.marginPercent}
        </p>
      ) : null}
      <p className="ggt-disclaimer">
        Calculator only — not tax, licensing, or legal advice. Templates are not
        legal advice.
      </p>
    </div>
  );
}
