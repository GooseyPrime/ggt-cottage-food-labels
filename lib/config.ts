/**
 * Local mirror of shop pricing. Tools must not invent amounts.
 * Checkout stays gated until Groundwork allowlists this tool + shop /api/sale.
 */
export const TOOL_ID = "cottage-food-labels";
export const PRODUCT_ID = "cottage-food-labels";
export const TOOL_PATH = "/tools/cottage-food-labels";

/** Cottage Food Labels — one-time label pack ($12). Mirrors shop lib/config. */
export const COTTAGE_FOOD_LABELS_PRICE_CENTS = 1200;
export const COTTAGE_FOOD_LABELS_PRICE_LABEL = "$12";
export const COTTAGE_FOOD_LABELS_PRODUCT_NAME =
  "Golden Goose Cottage Food Labels";

export const BRAND = "Golden Goose Tools";
export const ACCENT = "#c4a27a";

/** Presentational unlock flag (device-local). Not a payment receipt. */
export const UNLOCK_STORAGE_KEY = "ggt-cottage-food-labels-unlocked";

export function shopUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SHOP_URL?.trim() ||
    process.env.NEXT_PUBLIC_SHOP_ORIGIN?.trim() ||
    "https://goldengoosetools.com";
  return raw.replace(/\/$/, "");
}

export function shopToolPath(): string {
  return `${shopUrl()}${TOOL_PATH}`;
}
