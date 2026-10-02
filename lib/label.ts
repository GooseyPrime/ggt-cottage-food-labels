import type { StateWording } from "./states/types";

export type LabelFields = {
  producerName: string;
  homeAddress: string;
  telephone: string;
  productName: string;
  ingredients: string;
  /** Statement the maker supplies when the state is not encoded. */
  customStatement: string;
};

export const EMPTY_FIELDS: LabelFields = {
  producerName: "",
  homeAddress: "",
  telephone: "",
  productName: "",
  ingredients: "",
  customStatement: "",
};

export function statementFor(state: StateWording, fields: LabelFields): string {
  return state.maker_supplies_statement
    ? fields.customStatement.trim()
    : state.disclaimer_verbatim;
}

/** Names of required label items that are still empty for this state. */
export function missingItems(state: StateWording, fields: LabelFields): string[] {
  const missing: string[] = [];
  const need = (label: string, ok: boolean) => {
    if (!ok) missing.push(label);
  };
  const required = state.required_fields.join(" | ");
  need("producer name", !required.includes("producer name") || Boolean(fields.producerName.trim()));
  need("home address", !required.includes("home address") || Boolean(fields.homeAddress.trim()));
  need("telephone", !required.includes("telephone") || Boolean(fields.telephone.trim()));
  need("product name", Boolean(fields.productName.trim()));
  need("ingredients", Boolean(fields.ingredients.trim()));
  need("state statement", Boolean(statementFor(state, fields)));
  return missing;
}

export function clampCopies(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(24, Math.max(1, Math.round(value)));
}
