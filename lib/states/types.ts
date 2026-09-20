export type StateWording = {
  /** Two-letter state code, e.g. TN */
  code: string;
  name: string;
  last_checked: string;
  program: string;
  statute: string;
  official: string;
  /** Exact statutory / program disclaimer text for labels */
  disclaimer_verbatim: string;
  required_fields: string[];
};
