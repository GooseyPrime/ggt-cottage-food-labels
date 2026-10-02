import { OTHER } from "./other";
import { TN } from "./tn";
import type { StateWording } from "./types";

export type { StateWording } from "./types";
export { OTHER, TN };

/** States with researched, encoded wording. Grow this list only from verified sources. */
export const STATES: StateWording[] = [TN, OTHER];

export function getState(code: string): StateWording | undefined {
  return STATES.find((s) => s.code.toUpperCase() === code.toUpperCase());
}
