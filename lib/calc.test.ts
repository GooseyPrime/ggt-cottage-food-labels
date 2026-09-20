import { describe, expect, it } from "vitest";
import { calculatePricing } from "./calc";

describe("calculatePricing", () => {
  it("computes unit cost and suggested price from margin", () => {
    const result = calculatePricing({
      ingredientsCost: 10,
      packagingCost: 2,
      laborHours: 1,
      laborRate: 20,
      overheadPercent: 10,
      yieldUnits: 12,
      marginPercent: 40,
    });

    // direct = 10 + 2 + 20 = 32; overhead = 3.2; total = 35.2; unit = 35.2/12
    expect(result.directCost).toBeCloseTo(32);
    expect(result.overheadAmount).toBeCloseTo(3.2);
    expect(result.totalCost).toBeCloseTo(35.2);
    expect(result.unitCost).toBeCloseTo(35.2 / 12);
    expect(result.suggestedPrice).toBeCloseTo(result.unitCost / 0.6);
  });

  it("returns zero unit cost when yield is zero", () => {
    const result = calculatePricing({
      ingredientsCost: 5,
      packagingCost: 0,
      laborHours: 0,
      laborRate: 0,
      overheadPercent: 0,
      yieldUnits: 0,
      marginPercent: 50,
    });
    expect(result.unitCost).toBe(0);
    expect(result.suggestedPrice).toBe(0);
  });
});
