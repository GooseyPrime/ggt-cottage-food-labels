import type { StateWording } from "./types";

/** Tennessee Food Freedom Act wording — not legal advice. */
export const TN: StateWording = {
  code: "TN",
  name: "Tennessee",
  last_checked: "2026-09-19",
  program: "Tennessee Food Freedom Act",
  statute: "T.C.A. § 53-1-118",
  official:
    "https://www.tn.gov/agriculture/consumers/food-safety/tennessee-food-freedom-act.html",
  disclaimer_verbatim:
    "This product was produced at a private residence that is exempt from state licensing and inspection. This product may contain allergens.",
  required_fields: [
    "producer name",
    "home address",
    "telephone",
    "common product name",
    "ingredients descending by weight",
    "the disclaimer",
  ],
};
