import { TN } from "./tn";
import type { StateWording } from "./types";

export type { StateWording } from "./types";
export { TN };

/** States with encoded wording. Grow this list as more states are researched. */
export const STATES: StateWording[] = [TN];

/** Placeholder codes for future research — not yet encoded. */
export const UPCOMING_STATE_CODES = [
  "AL",
  "GA",
  "KY",
  "NC",
  "VA",
] as const;

export function getState(code: string): StateWording | undefined {
  return STATES.find((s) => s.code.toUpperCase() === code.toUpperCase());
}
