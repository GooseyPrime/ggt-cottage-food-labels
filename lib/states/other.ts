import type { StateWording } from "./types";

/**
 * Any state not encoded yet. We do not guess legal wording: the maker enters the
 * statement their own state requires, from their state agriculture / health department.
 */
export const OTHER: StateWording = {
  code: "OTHER",
  name: "Another state",
  last_checked: "",
  program: "Your state's cottage food rules",
  statute: "",
  official: "",
  disclaimer_verbatim: "",
  maker_supplies_statement: true,
  required_fields: [
    "producer name",
    "home address",
    "common product name",
    "ingredients descending by weight",
    "the statement your state requires",
  ],
};
