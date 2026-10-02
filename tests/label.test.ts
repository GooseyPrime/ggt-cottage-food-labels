import { describe, expect, it } from "vitest";
import { EMPTY_FIELDS, clampCopies, missingItems, statementFor } from "@/lib/label";
import { OTHER, TN, STATES, getState } from "@/lib/states";

describe("states", () => {
  it("offers Tennessee plus a maker-supplied option, never guessed wording", () => {
    expect(STATES.map((s) => s.code)).toEqual(["TN", "OTHER"]);
    expect(getState("tn")?.name).toBe("Tennessee");
    expect(OTHER.disclaimer_verbatim).toBe("");
    expect(OTHER.maker_supplies_statement).toBe(true);
  });
});

describe("label items", () => {
  it("uses the encoded statement for Tennessee", () => {
    expect(statementFor(TN, EMPTY_FIELDS)).toBe(TN.disclaimer_verbatim);
  });

  it("uses the maker's own statement for another state", () => {
    const fields = { ...EMPTY_FIELDS, customStatement: "  Made in a home kitchen.  " };
    expect(statementFor(OTHER, fields)).toBe("Made in a home kitchen.");
  });

  it("lists what is missing", () => {
    expect(missingItems(TN, EMPTY_FIELDS)).toEqual([
      "producer name",
      "home address",
      "telephone",
      "product name",
      "ingredients",
    ]);
    expect(missingItems(OTHER, EMPTY_FIELDS)).toContain("state statement");
    expect(missingItems(OTHER, EMPTY_FIELDS)).not.toContain("telephone");
  });

  it("reports nothing missing when complete", () => {
    const fields = {
      producerName: "A",
      homeAddress: "1 Main St",
      telephone: "555",
      productName: "Cookies",
      ingredients: "Flour",
      customStatement: "",
    };
    expect(missingItems(TN, fields)).toEqual([]);
  });

  it("clamps copies to 1-24", () => {
    expect(clampCopies(0)).toBe(1);
    expect(clampCopies(100)).toBe(24);
    expect(clampCopies(Number.NaN)).toBe(1);
    expect(clampCopies(6.4)).toBe(6);
  });
});
