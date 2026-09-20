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
  const yieldUnits = Math.max(safeNumber(raw.yieldUnits), 0);
  const marginPercent = safeNumber(raw.marginPercent);

  const laborCost = laborHours * laborRate;
  const directCost = ingredientsCost + packagingCost + laborCost;
  const overheadAmount = directCost * (overheadPercent / 100);
  const totalCost = directCost + overheadAmount;
  const unitCost = yieldUnits > 0 ? totalCost / yieldUnits : 0;

  // suggested = unitCost / (1 - margin/100); when margin >= 100, fall back to unitCost
  const marginFraction = marginPercent / 100;
  const suggestedPrice =
    marginFraction >= 1 || unitCost === 0
      ? unitCost
      : unitCost / (1 - marginFraction);
  const marginAmount = suggestedPrice - unitCost;

  return {
    laborCost,
    directCost,
    overheadAmount,
    totalCost,
    unitCost,
    suggestedPrice,
    marginAmount,
  };
}

export function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number.isFinite(n) ? n : 0);
}
