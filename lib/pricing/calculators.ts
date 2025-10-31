import { Tier, TierType, Pricing } from "../constants/pricing";

type InstallmentLine = { n: number; amount: number };
type InstallmentsDetails = {
  downPayment: number;
  schedule: InstallmentLine[];
  totalFinanced: number; // == downPayment + sum(schedule)
  vat: number;           // VAT amount (major units)
  discount: number;      // Discount amount (major units)
};

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * Compute installments breakdown with VAT & discount amounts.
 *
 * @param count      Number of installment payments AFTER down payment (>= 0)
 * @param quantity   Units being purchased (>= 1)
 * @param priceIn    Effective unit price in MAJOR units (already tier/basis-resolved)
 * @param product    Product doc (must include pricing with installments config)
 */
export function computeInstallmentsDetails(
  count: number,
  quantity: number,
  priceIn: number,
  product: { pricing: Pricing }
): InstallmentsDetails {
  if (!product?.pricing) {
    throw new Error("Product.pricing is required");
  }
  const p = product.pricing;

  // Clamp quantity to pricing constraints if present
  const qtyMin = Math.max(1, Number(p.minQty ?? 1));
  const qtyMax = Number.isFinite(p.maxQty) ? Math.max(qtyMin, Number(p.maxQty)) : undefined;
  const qty = Math.max(qtyMin, Math.floor(quantity || 1));
  const clampedQty = qtyMax ? Math.min(qty, qtyMax) : qty;

  // Base (pre-discount/pre-tax) = unit price × quantity
  const baseMajor = Math.max(0, Number(priceIn || 0)) * clampedQty;

  // Discount (always applied before VAT)
  const discountPct = Math.max(0, Number(p.discountPercentage || 0));
  const discountMajor = round2(baseMajor * (discountPct / 100));
  const discounted = round2(baseMajor - discountMajor);

  // VAT handling
  const vatPct = Math.max(0, Number(p.vatPercentage || 0));
  const taxInclusive = p.taxInclusive !== false; // default true

  let vatMajor: number;
  let totalMajor: number;
  if (taxInclusive) {
    // discounted is the final total; extract VAT portion
    const div = 1 + (vatPct / 100);
    const subtotalMajor = round2(discounted / div);
    vatMajor = round2(discounted - subtotalMajor);
    totalMajor = discounted;
  } else {
    vatMajor = round2(discounted * (vatPct / 100));
    totalMajor = round2(discounted + vatMajor);
  }

  // Installments config checks
  const cfg = p.installments;
  if (!p.allowInstallments || !cfg?.enabled) {
    throw new Error("Installments not allowed or not configured for this product");
  }

  const planCount = Math.max(0, Math.floor(count || 0));

  // Down payment
  let downPayment = 0;
  if (cfg.downPaymentType === "percent") {
    const dpPct = Math.max(0, Math.min(100, Number(cfg.downPaymentValue || 0)));
    downPayment = round2(totalMajor * (dpPct / 100));
  } else {
    downPayment = round2(Math.max(0, Number(cfg.downPaymentValue || 0)));
  }
  downPayment = Math.min(downPayment, totalMajor); // guard

  // Remainder split into installments
  const remainder = round2(totalMajor - downPayment);
  const schedule: InstallmentLine[] = [];
  if (planCount > 0 && remainder > 0) {
    const baseEach = round2(remainder / planCount);
    let allocated = 0;
    for (let i = 1; i <= planCount; i++) {
      const amount = i === planCount ? round2(remainder - allocated) : baseEach;
      schedule.push({ n: i, amount });
      allocated = round2(allocated + amount);
    }
  }

  const totalFinanced = round2(downPayment + schedule.reduce((s, x) => s + x.amount, 0));

  return {
    downPayment,
    schedule,
    totalFinanced,
    vat: vatMajor,
    discount: discountMajor,
  };
}

/**
 * perUnitPriceCalculator
 * - volume:    unitPriceMajor = per-unit;         totalMajor = unitPriceMajor * qty
 * - stairstep: unitPriceMajor = flat band total;  totalMajor = unitPriceMajor
 *
 * Notes:
 * - Strict camel upTo only (no upto).
 * - Ignores tax/discount; do that in your outer amounts calculator.
 * - If qty is above all bands, uses the price of the max upTo.
 * - Returns 0 if no usable tiers or qty invalid.
 */
export const perUnitPriceCalculator = (
  tiers: Tier[],
  tierType: TierType,
  qty: number
): number => {
  // Validate input
  if (!Array.isArray(tiers) || tiers.length === 0 || !Number.isFinite(qty) || qty < 0) {
    return 0;
  }

  // Find smallest upTo >= qty (hit tier) and track overall max tier as fallback.
  let bestUpTo: number | null = null;
  let bestPrice: number | null = null;

  let maxUpTo = -Infinity;
  let maxPrice: number | null = null;

  for (const t of tiers) {
    if (!t) continue;
    const cap = Number(t.upTo);
    const price = Number(t.unitPrice);

    if (!Number.isFinite(cap) || !Number.isFinite(price) || price < 0) continue;

    // candidate hit tier
    if (cap >= qty && (bestUpTo === null || cap < bestUpTo)) {
      bestUpTo = cap;
      bestPrice = price;
    }

    // track max tier (for qty above all caps)
    if (cap > maxUpTo) {
      maxUpTo = cap;
      maxPrice = price;
    }
  }

  // Decide the unit/flat price to use
  const unitOrFlatPrice = bestPrice ?? maxPrice ?? 0;

  if (tierType === "volume") {
    // per-unit × qty
    const majorPrice = unitOrFlatPrice * qty;
    return majorPrice;
  }

  if (tierType === "stairstep") {
    // flat band total (naming historical: unitPrice holds flat amount)
    const majorPrice = unitOrFlatPrice;
    return majorPrice;
  }

  // Fallback (should not happen if TierType is properly constrained)
  return 0;
};