/**
 * Price and checkout live on the shop. This tool only shows a label (env) and
 * calls the shop sale desk from its own server routes.
 */
export const TOOL_ID = "cottage-food-labels";
export const TOOL_PATH = "/tools/cottage-food-labels";

export const BRAND = "Golden Goose Tools";
export const ACCENT = "#c4a27a";

export const SESSION_STORAGE_KEY = "ggt-cottage-food-labels-session";
export const FIELDS_STORAGE_KEY = "ggt-cottage-food-labels-fields";

/** Display label only (e.g. "$12"); the amount charged is decided by the shop. */
export function priceLabel(): string {
  const raw = process.env.NEXT_PUBLIC_PRICE_LABEL?.trim();
  return raw || "one-time";
}

export function shopUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SHOP_ORIGIN?.trim() ||
    process.env.NEXT_PUBLIC_SHOP_URL?.trim() ||
    "https://www.goldengoosetools.com";
  return raw.replace(/\/+$/, "");
}

/** Public URL of this tool on the shop (sent to the desk as the sale target). */
export function shopToolPath(): string {
  return `${shopUrl()}${TOOL_PATH}`;
}
