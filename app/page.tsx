import { Calculator } from "./components/Calculator";
import { LabelPack } from "./components/LabelPack";
import { BRAND, priceLabel } from "@/lib/config";

export default function HomePage() {
  return (
    <div className="ggt-root">
      <main className="ggt-wrap">
        <header className="ggt-hero">
          <p className="ggt-eyebrow">{BRAND}</p>
          <h1>Cottage Food Labels</h1>
          <p className="ggt-lede">
            Free cost and pricing calculator. Unlock a {priceLabel()} label pack with per-state
            wording templates for cottage food makers.
          </p>
          <p className="ggt-disclaimer">
            Templates are <strong>not legal advice</strong>. Always verify required wording with
            your state agriculture department before printing or selling.
          </p>
        </header>

        <section className="ggt-result" aria-labelledby="calc-heading">
          <h2 id="calc-heading">Cost &amp; pricing calculator</h2>
          <p className="ggt-help">
            Ingredients, packaging, labor, overhead, and yield → unit cost and a suggested price
            from your margin percent. Free forever.
          </p>
          <Calculator />
        </section>

        <section className="ggt-result" aria-labelledby="labels-heading">
          <h2 id="labels-heading">Label builder</h2>
          <p className="ggt-help">
            Pick your state, fill in your details and see your label. The print-ready sheet is part
            of the label pack.
          </p>
          <LabelPack />
        </section>

        <footer className="ggt-trust">
          <p>
            Golden Goose Tools · Cottage Food Labels · Templates are not legal advice · Nothing you
            type leaves this device.
          </p>
        </footer>
      </main>
    </div>
  );
}
