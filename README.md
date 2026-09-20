# ggt-cottage-food-labels

Golden Goose Tools — **Cottage Food Labels**.

- **Free:** cost / pricing calculator (ingredients, packaging, labor hours × rate, overhead %, yield → unit cost + suggested price from margin %)
- **Paid:** $12 one-time label pack (`$12` / `1200` cents) — presentational paywall until shop Groundwork allowlists this tool
- **Accent:** Wheat `#c4a27a` (`--ggt-accent`)
- **Design kit:** `ggt-design-kit` via `github:GooseyPrime/ggt-design-kit` — `@import "ggt-design-kit/src/index.css"`
- **No Tailwind** — use `ggt-*` classes from the kit

## Not legal advice

Every screen states that **templates are not legal advice**. State wording (starting with Tennessee Food Freedom Act / T.C.A. § 53-1-118) is a research aid only. Verify with your state before selling.

## Run locally

```bash
npm install
npm run dev
```

Optional env:

- `NEXT_PUBLIC_SHOP_URL` — shop origin (default `https://goldengoosetools.com`)

## Pricing mirror

Local `lib/config.ts` mirrors shop constants:

- `COTTAGE_FOOD_LABELS_PRICE_CENTS = 1200`
- `COTTAGE_FOOD_LABELS_PRICE_LABEL = "$12"`
- `COTTAGE_FOOD_LABELS_PRODUCT_NAME = "Golden Goose Cottage Food Labels"`

Do **not** invent checkout amounts. When payments go live: shop `POST /api/sale` + `/api/verify` only — no Stripe keys in this repo.

## Tool id

- `cottage-food-labels`
- Shop path: `/tools/cottage-food-labels`
- Registry stays `live: false` until Groundwork lists it

## Draft PRs

Open **draft** PRs only. Brandon merges.
