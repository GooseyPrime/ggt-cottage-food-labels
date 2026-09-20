export type CostInputs = {
  ingredientsCost: number;
  packagingCost: number;
  laborHours: number;
  laborRate: number;
  overheadPercent: number;
  yieldUnits: number;
  marginPercent: number;
};

export type CostResult = {
  laborCost: number;
  directCost: number;
  overheadAmount: number;
  totalCost: number;
  unitCost: number;
  suggestedPrice: number;
  marginAmount: number;
  validationErrors: {
    yieldUnits?: string;
    marginPercent?: string;
  };
};

function safeNumber(n: number): number {
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

/** Pure cottage-food unit-cost + suggested retail from margin %. */
export function calculatePricing(raw: CostInputs): CostResult {
  const ingredientsCost = safeNumber(raw.ingredientsCost);
  const packagingCost = safeNumber(raw.packagingCost);
  const laborHours = safeNumber(raw.laborHours);
  const laborRate = safeNumber(raw.laborRate);
  const overheadPercent = safeNumber(raw.overheadPercent);
  const yieldUnits = safeNumber(raw.yieldUnits);
  const marginPercent = safeNumber(raw.marginPercent);

  const laborCost = laborHours * laborRate;
  const directCost = ingredientsCost + packagingCost + laborCost;
  const overheadAmount = directCost * (overheadPercent / 100);
  const totalCost = directCost + overheadAmount;
  const validationErrors: CostResult["validationErrors"] = {};

  if (yieldUnits <= 0) {
    validationErrors.yieldUnits =
      "Enter a yield greater than 0 to calculate unit cost and price.";
  }

  if (marginPercent >= 100) {
    validationErrors.marginPercent =
      "Enter a target margin below 100% to calculate a suggested price.";
  }

  const unitCost = yieldUnits > 0 ? totalCost / yieldUnits : 0;

  // suggested = unitCost / (1 - margin/100)
  const marginFraction = marginPercent / 100;
  const suggestedPrice =
    validationErrors.yieldUnits || validationErrors.marginPercent || unitCost === 0
      ? 0
      : unitCost / (1 - marginFraction);
  const marginAmount =
    validationErrors.yieldUnits || validationErrors.marginPercent
      ? 0
      : suggestedPrice - unitCost;

  return {
    laborCost,
    directCost,
    overheadAmount,
    totalCost,
    unitCost,
    suggestedPrice,
    marginAmount,
    validationErrors,
  };
}

export function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number.isFinite(n) ? n : 0);
}
