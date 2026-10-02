export type StateWording = {
  /** Two-letter state code, e.g. TN, or OTHER for "enter your own state's wording" */
  code: string;
  name: string;
  last_checked: string;
  program: string;
  statute: string;
  /** Official page; empty when none is encoded */
  official: string;
  /** Exact statutory / program disclaimer text for labels. Empty when the maker must supply it. */
  disclaimer_verbatim: string;
  /** True when the maker types the statement their state requires. */
  maker_supplies_statement?: boolean;
  required_fields: string[];
};
