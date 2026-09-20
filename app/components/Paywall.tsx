"use client";

import {
  COTTAGE_FOOD_LABELS_PRICE_LABEL,
  COTTAGE_FOOD_LABELS_PRODUCT_NAME,
  DEMO_UNLOCK_EVENT,
  shopToolPath,
  shopUrl,
  UNLOCK_STORAGE_KEY,
} from "@/lib/config";

/**
 * Presentational paywall. Price mirrors shop config ($12).
 * Live Stripe /api/sale is gated until Groundwork allowlists this tool.
 * Do not invent checkout amounts; no Stripe keys in this repo.
 */
export function Paywall() {
  function demoUnlock() {
    try {
      localStorage.setItem(UNLOCK_STORAGE_KEY, "1");
      window.dispatchEvent(new Event(DEMO_UNLOCK_EVENT));
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="ggt-paywall">
      <p>
        <strong>{COTTAGE_FOOD_LABELS_PRODUCT_NAME}</strong> — one-time{" "}
        {COTTAGE_FOOD_LABELS_PRICE_LABEL} label pack.
      </p>
      <p className="ggt-help">
        Checkout is pending shop allowlist + registry. When live, payment goes
        through Golden Goose Tools shop (<code>/api/sale</code> +{" "}
        <code>/api/verify</code>) — this tool never invents amounts or holds
        Stripe keys.
      </p>
      <div className="ggt-actions">
        <a className="ggt-btn" href={shopToolPath()}>
          Open shop ({COTTAGE_FOOD_LABELS_PRICE_LABEL})
        </a>
        <a className="ggt-btn" href={shopUrl()}>
          goldengoosetools.com
        </a>
        <button type="button" className="ggt-btn" onClick={demoUnlock}>
          Demo unlock (dev)
        </button>
      </div>
      <p className="ggt-disclaimer">
        Templates are not legal advice. Price shown ({COTTAGE_FOOD_LABELS_PRICE_LABEL})
        mirrors shop <code>COTTAGE_FOOD_LABELS_PRICE_*</code> — presentational
        until Groundwork lists the SKU.
      </p>
    </div>
  );
}
