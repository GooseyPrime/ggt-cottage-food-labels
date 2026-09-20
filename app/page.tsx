import { Calculator } from "./components/Calculator";
import { LabelPreview } from "./components/LabelPreview";
import { Paywall } from "./components/Paywall";
import { TN } from "@/lib/states";
import {
  COTTAGE_FOOD_LABELS_PRICE_LABEL,
  BRAND,
} from "@/lib/config";

export default function HomePage() {
  return (
    <div className="ggt-root">
      <main className="ggt-wrap">
        <header className="ggt-hero">
          <p className="ggt-eyebrow">{BRAND}</p>
          <h1>Cottage Food Labels</h1>
          <p className="ggt-lede">
            Free cost and pricing calculator. Unlock a {" "}
            {COTTAGE_FOOD_LABELS_PRICE_LABEL} label pack with per-state wording
            templates for cottage food makers.
          </p>
          <p className="ggt-disclaimer">
            Templates are <strong>not legal advice</strong>. Always verify
            required wording with your state agriculture department before
            printing or selling.
          </p>
        </header>

        <section className="ggt-result" aria-labelledby="calc-heading">
          <h2 id="calc-heading">Cost &amp; pricing calculator</h2>
          <p className="ggt-help">
            Ingredients, packaging, labor, overhead, and yield → unit cost and a
            suggested price from your margin percent. Free forever.
          </p>
          <Calculator />
        </section>

        <section className="ggt-result" aria-labelledby="tn-heading">
          <h2 id="tn-heading">Tennessee wording preview</h2>
          <p className="ggt-help">
            Starting with {TN.program} ({TN.statute}). Last checked{" "}
            {TN.last_checked}. Not legal advice.
          </p>
          <p className="ggt-statute">
            Official:{" "}
            <a href={TN.official} target="_blank" rel="noreferrer">
              Tennessee Food Freedom Act
            </a>
          </p>
          <LabelPreview />
        </section>

        <section className="ggt-tally" aria-labelledby="pack-heading">
          <h2 id="pack-heading">Label pack</h2>
          <p className="ggt-help">
            Print-ready fields for producer name, home address, telephone,
            product name, ingredients by weight, and the state disclaimer.
            Templates are not legal advice.
          </p>
          <Paywall />
        </section>

        <footer className="ggt-trust">
          <p>
            Golden Goose Tools · Cottage Food Labels · Templates are not legal
            advice · Checkout opens via the shop when this tool is allowlisted.
          </p>
        </footer>
      </main>
    </div>
  );
}
