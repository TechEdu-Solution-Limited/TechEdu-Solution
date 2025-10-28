// /lib/pricing/calculators.ts
// Core calculators: one-time, subscription, per-unit (tiers), installments splitter.
// All inputs use MAJOR units; minor amounts are computed for Stripe.

import { getTierUnitPrice } from "@/utils/helpers";
import safeConsole from "../console";

/********************************************** TYPES ***************************************/

export type Currency = string;

export type SubscriptionArgs = {
  currency?: Currency; // default 'gbp'
  subscriptionPrice: number; // per interval, major
  interval: "day" | "week" | "month" | "year";
  intervalCount: number; // default 1
  trialDays: number;
  setupFee: number; // major
  autoRenew: boolean; // default false
  proration: boolean; // default true
  taxInclusive: boolean; // default false
  vatPercentage: number; // default 0
  discountPercentage: number; // default 0
};

export type TaxBreakdown = {
  taxInclusive: boolean;
  vatPercentage: number;
  subtotalMajor: number;
  vatMajor: number;
  totalMajor: number;
  subtotalMinor: number;
  vatMinor: number;
  totalMinor: number;
};

export type DiscountInfo = {
  discountPercentage: number;
  discountMajor: number;
  discountMinor: number;
};

export type OrderSnapshot = {
  pricingModel: "one_time" | "subscription" | "per_unit";
  currency: Currency;
  unitName?: "team" | "person";
  quantityPaid?: number;
  unitPriceMajor?: number;
  subtotalMajor: number;
  vatMajor: number;
  totalMajor: number;
  tierSnapshot?: {
    tierType: "none" | "volume" | "graduated" | "stairstep";
    tiers?: Array<{ upTo: number | null; unitPrice: number }>;
    chosenTierIndex?: number | null;
    breakdown?: Array<{
      band: string;
      units: number;
      unitPrice: number;
      bandTotal: number;
    }>;
  };
};

export type OneTimeResult = TaxBreakdown & {
  currency: Currency;
  discount: DiscountInfo;
  orderSnapshot: OrderSnapshot;
};

export type SubscriptionResult = {
  currency: Currency;
  tax: TaxBreakdown;
  discount: DiscountInfo;
  interval: "day" | "week" | "month" | "year";
  intervalCount: number;
  trialDays?: number;
  setupFeeMajor: number;
  setupFeeMinor: number;
  proration: boolean;
  autoRenew: boolean;
  orderSnapshot: OrderSnapshot;
};

/** Result with full amounts (major + minor) */
export type PerUnitResult = {
  currency: Currency;
  quantity: number;
  unitName: "team" | "person";
  tierType: TierType;

  // Pricing primitives
  unitPriceMajor: number; // per-unit (volume) or flat (stairstep)
  netMajor: number; // before VAT & discount (rounded)
  vatMajor: number; // VAT amount added (0 if taxInclusive=false)
  grossMajor: number; // after VAT, before discount
  discountMajor: number; // discount amount (>= 0)
  totalMajor: number; // final payable (gross - discount)

  // Minor-unit mirrors
  unitPriceMinor: number;
  netMinor: number;
  vatMinor: number;
  grossMinor: number;
  discountMinor: number;
  totalMinor: number;
};

// ─────────────────────────── One-time

export type OneTimeArgs = {
  currency?: Currency; // default 'gbp'
  basePrice: number; // major
  taxInclusive: boolean; // default true
  vatPercentage: number; // default 0
  discountPercentage: number; // default 0
};

export type TierType = "volume" | "stairstep";

type Tier = { upTo: number; unitPrice: number };

export type PerUnitArgs = {
  currency?: Currency; // default 'gbp'
  quantity: number; // required
  unitName: "team" | "person"; // default 'team'
  discountPercentage: number; // optional
  taxInclusive: boolean; // default false
  vatPercentage: number; // default 0
  tierType: TierType;
  tiers: Array<{ upTo: number; unitPrice: number }>;
};

type PerUnitPriceResult = {
  /** The rate taken from the hit tier.
   *  - volume: per-unit rate
   *  - stairstep: flat band total (historically stored in `unitPrice`)
   */
  unitPriceMajor: number;

  /** What the customer pays for this line (before tax/discount handling elsewhere).
   *  - volume: unitPriceMajor * qty
   *  - stairstep: unitPriceMajor
   */
  totalMajor: number;
};

export type InstallmentsArgs = {
  currency?: Currency; // default 'gbp'
  totalMajor: number; // inclusive of VAT and discount
  count: number; // >= 2
  interval: "week" | "month" | "year";
  intervalCount?: number; // default 1
  downPaymentType?: "none" | "amount" | "percent";
  downPaymentValue?: number;
  allowEarlyPayoff?: boolean; // informational only
};

export type InstallmentsResult = {
  currency: Currency;
  totalMajor: number;
  totalMinor: number;
  downPaymentMajor: number;
  downPaymentMinor: number;
  remainingMajor: number;
  remainingMinor: number;
  perInstallmentMajor: number;
  perInstallmentMinor: number;
  scheduleMajors: number[];
  count: number;
  interval: "week" | "month" | "year";
  intervalCount: number;
  allowEarlyPayoff: boolean;
};

/**************************************** HELPER FUNCTIONS ******************************/

/**
 * computeVatAndGross
 *
 * From a pre-tax amount (`netMajor`), compute the VAT amount and the gross total,
 * depending on whether VAT should be added (`taxInclusive = true`) or not.
 *
 * Rules:
 * - If `taxInclusive` is true → VAT = net × (vat%); gross = net + VAT.
 * - If `taxInclusive` is false → VAT = 0; gross = net.
 *
 * Notes:
 * - `vatPercentage` is clamped to [0, 100].
 * - Amounts are rounded with `roundMajor` to the currency’s proper precision.
 *
 * @param params.netMajor        Pre-tax amount in major units (e.g., 120.00)
 * @param params.vatPercentage   VAT rate as a percent (e.g., 20 for 20%)
 * @param params.currency        Currency code (e.g., "gbp", "usd")
 * @param params.taxInclusive    If true, adds VAT to net to produce gross
 *
 * @returns { vatMajor, grossMajor }
 *
 * @example
 * computeVatAndGross({ netMajor: 100, vatPercentage: 20, currency: "gbp", taxInclusive: true })
 * // -> { vatMajor: 20, grossMajor: 120 }
 *
 * computeVatAndGross({ netMajor: 100, vatPercentage: 20, currency: "gbp", taxInclusive: false })
 * // -> { vatMajor: 0, grossMajor: 100 }
 */
export function computeVatAndGross(params: {
  netMajor: number;
  vatPercentage: number;
  currency: Currency;
  taxInclusive: boolean;
}): { vatMajor: number; grossMajor: number } {
  const { netMajor, vatPercentage, currency, taxInclusive } = params;
  const rate = clamp(Number(vatPercentage) || 0, 0, 100);

  if (taxInclusive) {
    const vatMajor = roundMajor(netMajor * pct(rate), currency);
    const grossMajor = roundMajor(netMajor + vatMajor, currency);
    return { vatMajor, grossMajor };
  }

  // No VAT added
  return {
    vatMajor: 0,
    grossMajor: roundMajor(netMajor, currency),
  };
}

/**
 * Compute the discount amount (in major units) from a base amount and a percentage.
 *
 * - Clamps the percentage to [0, 100].
 * - Rounds with `roundMajor` to the currency’s precision.
 * - Returns 0 if base or percentage is non-positive.
 *
 * @param baseAmount         Amount before discount (major units).
 * @param discountPercentage Discount rate as a percent (e.g., 15 for 15%).
 * @param currency           ISO currency code (default: 'gbp'), used for rounding.
 * @returns                  Discount amount in major units.
 *
 * @example
 * computeDiscount({
 *   baseAmount: 200,
 *   discountPercentage: 10,
 *   currency: 'GBP'
 * }) // -> 20
 *
 * @example
 * // To get the discounted total:
 * const base = 200;
 * const disc = computeDiscount({ baseAmount: base, discountPercentage: 10, currency: 'GBP' });
 * const totalAfterDiscount = roundMajor(base - disc, 'GBP'); // -> 180
 */
export function computeDiscount(args: {
  baseAmount: number;
  discountPercentage?: number;
  currency?: Currency;
}): number {
  const currency = (args.currency || "gbp").toLowerCase() as Currency;
  const base = roundMajor(Number(args.baseAmount) || 0, currency);

  const pctRaw = Number(args.discountPercentage) || 0;
  const pctClamped = clamp(pctRaw, 0, 100); // ensure 0–100
  if (base <= 0 || pctClamped <= 0) return 0;

  const rate = pct(pctClamped); // e.g., 15 -> 0.15
  const discount = roundMajor(base * rate, currency);
  return discount;
}

const ZERO_DECIMAL = new Set([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]);

/**
 * Assumes a `ZERO_DECIMAL` Set<string> exists and contains ISO-4217 currency
 * codes that have no minor unit (e.g., "JPY", "KRW", "VND").
 */

/**
 * Choose the multiplier that converts between major and minor units.
 *
 * Major units: e.g., dollars, euros, yen.
 * Minor units: e.g., cents (USD/EUR). Zero-decimal currencies have no minor unit.
 *
 * @param currency - ISO-4217 code (case-insensitive), e.g., "USD", "JPY".
 * @returns 1 for zero-decimal currencies; otherwise 100.
 *
 * @example
 * factor("USD") // -> 100
 * factor("jpy") // -> 1
 */
const factor = (currency: Currency) =>
  ZERO_DECIMAL.has(currency.toUpperCase()) ? 1 : 100;

/**
 * Convert a major-unit amount (e.g., 12.34 USD) to minor units (e.g., 1234 cents).
 * Rounds to the nearest integer minor unit.
 *
 * @param major - Amount in major units. Nullish values are treated as 0.
 * @param currency - ISO-4217 code (case-insensitive).
 * @returns Integer amount in minor units.
 *
 * @example
 * toMinor(12.34, "USD") // -> 1234
 * toMinor(12, "JPY")    // -> 12  (JPY is zero-decimal)
 */
const toMinor = (major: number, currency: Currency) =>
  Math.round((major ?? 0) * factor(currency));

/**
 * Round a major-unit amount to the correct precision for the currency
 * (2 decimals for most currencies, 0 for zero-decimal currencies).
 *
 * Implementation: scale -> round -> unscale using the currency's factor.
 * This helps avoid floating-point drift (e.g., 0.1 + 0.2 ≠ 0.3).
 *
 * @param major - Amount in major units. Nullish values are treated as 0.
 * @param currency - ISO-4217 code (case-insensitive).
 * @returns Rounded amount in major units.
 *
 * @example
 * roundMajor(12.345, "USD") // -> 12.35
 * roundMajor(12.345, "JPY") // -> 12
 */
const roundMajor = (major: number, currency: Currency) => {
  const f = factor(currency);
  return Math.round((major ?? 0) * f) / f;
};

/**
 * Convert a percentage to a decimal fraction.
 *
 * @param n - Percentage value (e.g., 20 for 20%). Nullish values are treated as 0.
 * @returns Decimal fraction (e.g., 0.2).
 *
 * @example
 * pct(15) // -> 0.15
 * 200 * pct(7.5) // -> 15
 */
const pct = (n: number) => (n ?? 0) / 100;

/**
 * Constrain a number to the inclusive range [min, max].
 *
 * @param n - The value to clamp.
 * @param min - Lower bound (inclusive).
 * @param max - Upper bound (inclusive).
 * @returns `n` if within bounds; otherwise `min` or `max`.
 *
 * @example
 * clamp(120, 0, 100) // -> 100
 * clamp(-5, 0, 100)  // -> 0
 * clamp(50, 0, 100)  // -> 50
 */
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

export function calcOneTimeAmount(args: OneTimeArgs) {
  const currency = (args.currency || "gbp").toLowerCase();

  // 2) VAT (add when taxInclusive === true)
  const { vatMajor, grossMajor } = computeVatAndGross({
    netMajor: args.basePrice,
    vatPercentage: args.vatPercentage,
    currency: currency,
    taxInclusive: args.taxInclusive,
  });

  // 3) Discount (applied on gross)
  const discountMajor = computeDiscount({
    baseAmount: grossMajor,
    discountPercentage: args.discountPercentage || 0,
    currency,
  });

  return {
    currency,
    taxInclusive: args.taxInclusive,
    vatPercentage: args.vatPercentage,
    subtotalMajor: grossMajor,
    vatMajor,
    totalMajor: grossMajor,
    subtotalMinor: toMinor(args.basePrice, currency),
    discount: discountMajor,
    orderSnapshot: {
      pricingModel: "one_time",
      currency,
      unitPriceMajor: args.basePrice,
      subtotalMajor: args.basePrice,
      vatMajor: vatMajor,
      totalMajor: grossMajor,
    },
  };
}

// ─────────────────────────── Subscription

export function calcSubscriptionAmount(
  args: SubscriptionArgs
): SubscriptionResult {
  const currency = (args.currency || "gbp").toLowerCase();
  const netMajor = args.subscriptionPrice;
  const intervalCount = args.intervalCount;
  const autoRenew = args.autoRenew;
  const proration = args.proration;
  const setupFee = roundMajor(args.setupFee, currency);

  // 2) VAT (add when taxInclusive === true)
  const { vatMajor, grossMajor } = computeVatAndGross({
    netMajor: netMajor,
    vatPercentage: args.vatPercentage,
    currency: currency,
    taxInclusive: args.taxInclusive,
  });

  // 3) Discount (applied on gross)
  const discountMajor = computeDiscount({
    baseAmount: grossMajor,
    discountPercentage: args.discountPercentage || 0,
    currency,
  });

  const totalMajor = roundMajor(grossMajor - discountMajor, currency);

  const tax = {
    taxInclusive: args.taxInclusive,
    vatPercentage: args.vatPercentage,
    subtotalMajor: netMajor,
    vatMajor,
    totalMajor: grossMajor,
    subtotalMinor: args.subscriptionPrice,
    vatMinor: vatMajor,
    totalMinor: grossMajor,
  };

  return {
    currency,
    tax,
    interval: args.interval,
    intervalCount,
    trialDays: args.trialDays,
    setupFeeMajor: setupFee,
    setupFeeMinor: toMinor(setupFee, currency),
    proration,
    autoRenew,
    orderSnapshot: {
      pricingModel: "subscription",
      currency,
      subtotalMajor: netMajor,
      vatMajor: vatMajor,
      totalMajor: totalMajor,
    },
  };
}

// ─────────────────────────── Per-unit / Per-seat

/**
 * perUnitPriceCalculator
 * - volume:    unitPriceMajor = per-unit;         totalMajor = unitPriceMajor * qty
 * - stairstep: unitPriceMajor = flat band total;  totalMajor = unitPriceMajor
 *
 * Notes:
 * - Strict camel `upTo` only (no `upto`).
 * - Ignores tax/discount; do that in your outer amounts calculator.
 * - If qty is above all bands, uses the price of the max `upTo`.
 * - Returns {0,0} if no usable tiers or qty invalid.
 */
export function perUnitPriceCalculator(args: PerUnitArgs): PerUnitPriceResult {
  const qty = Math.max(1, Math.floor(Number(args.quantity) || 1));

  if (!Array.isArray(args.tiers) || args.tiers.length === 0) {
    safeConsole?.log?.("No tiers configured", { qty, tiers: args?.tiers });
    return { unitPriceMajor: 0, totalMajor: 0 };
  }

  // Find smallest upTo >= qty (hit tier) and track overall max tier as fallback.
  let bestUpTo: number | null = null;
  let bestPrice: number | null = null;

  let maxUpTo = -Infinity;
  let maxPrice: number | null = null;

  for (const t of args.tiers) {
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

  if (args.tierType === "volume") {
    // per-unit × qty
    return {
      unitPriceMajor: unitOrFlatPrice,
      totalMajor: unitOrFlatPrice * qty,
    };
  }

  if (args.tierType === "stairstep") {
    // flat band total (naming historical: unitPrice holds flat amount)
    return {
      unitPriceMajor: unitOrFlatPrice,
      totalMajor: unitOrFlatPrice,
    };
  }

  // Shouldn't happen (union type), but keep a safe fallback
  return { unitPriceMajor: unitOrFlatPrice, totalMajor: unitOrFlatPrice * qty };
}
/**
 * calcPerUnitTotals
 *
 * Pipeline:
 *  1) Use perUnitPriceCalculator(args) to get the base (net) amount:
 *     - volume:   net = hitTierUnitPrice * qty
 *     - stairstep: net = flat band total
 *  2) If taxInclusive === true, add VAT on top of net (gross = net + VAT).
 *     Otherwise, gross = net and VAT = 0.
 *  3) Compute the discount on gross, then total = gross - discount.
 *
 * Notes:
 *  - Currency rounding is applied at each step to avoid drift.
 *  - Discount is applied AFTER VAT here (keeps your previous flow).
 *  - For tax-inclusive / net-of-tax scenarios where discount should
 *    reduce the taxable base, move discount before the VAT step.
 */
export function calcPerUnitTotals(args: PerUnitArgs): PerUnitResult {
  const currency = (args.currency || "gbp").toLowerCase() as Currency;
  const qty = Math.max(1, Math.floor(Number(args.quantity) || 0));
  const unitName = (args.unitName || "team") as "team" | "person";

  // 1) Base (net) from your per-unit/stairstep calculator
  const base: PerUnitPriceResult = perUnitPriceCalculator(args);
  const unitPriceMajor = roundMajor(base.unitPriceMajor, currency);
  const netMajor = roundMajor(base.totalMajor, currency);

  // 2) VAT (add when taxInclusive === true)
  const { vatMajor, grossMajor } = computeVatAndGross({
    netMajor: netMajor,
    vatPercentage: args.vatPercentage,
    currency: currency,
    taxInclusive: args.taxInclusive,
  });

  // 3) Discount (applied on gross)
  const discountMajor = computeDiscount({
    baseAmount: grossMajor,
    discountPercentage: args.discountPercentage || 0,
    currency,
  });

  const totalMajor = roundMajor(grossMajor - discountMajor, currency);

  // Minor mirrors
  const unitPriceMinor = toMinor(unitPriceMajor, currency);
  const netMinor = toMinor(netMajor, currency);
  const vatMinor = toMinor(vatMajor, currency);
  const grossMinor = toMinor(grossMajor, currency);
  const discountMinor = toMinor(discountMajor, currency);
  const totalMinor = toMinor(totalMajor, currency);

  return {
    currency,
    quantity: qty,
    unitName,
    tierType: args.tierType,

    unitPriceMajor,
    netMajor,
    vatMajor,
    grossMajor,
    discountMajor,
    totalMajor,

    unitPriceMinor,
    netMinor,
    vatMinor,
    grossMinor,
    discountMinor,
    totalMinor,
  };
}

// ─────────────────────────── Installments splitter

export function splitInstallments(args: InstallmentsArgs): InstallmentsResult {
  const currency = (args.currency || "gbp").toLowerCase();
  const total = roundMajor(args.totalMajor, currency);
  const count = Math.max(2, Math.floor(args.count || 2));
  const intervalCount = args.intervalCount ?? 1;
  const allowEarlyPayoff = args.allowEarlyPayoff ?? true;

  let downPayment = 0;
  const type = args.downPaymentType ?? "none";
  const val = args.downPaymentValue ?? 0;

  if (type === "amount")
    downPayment = clamp(roundMajor(val, currency), 0, total);
  else if (type === "percent")
    downPayment = clamp(roundMajor(total * pct(val), currency), 0, total);

  const remaining = roundMajor(total - downPayment, currency);
  const rawPer = remaining / count;
  const perInstallment = roundMajor(rawPer, currency);
  let scheduleMajors = Array.from({ length: count }, () => perInstallment);

  const scheduledSum = roundMajor(perInstallment * count, currency);
  const remainder = roundMajor(remaining - scheduledSum, currency);
  if (remainder !== 0 && scheduleMajors.length > 0) {
    scheduleMajors[0] = roundMajor(scheduleMajors[0] + remainder, currency);
  }

  return {
    currency,
    totalMajor: total,
    totalMinor: toMinor(total, currency),
    downPaymentMajor: downPayment,
    downPaymentMinor: toMinor(downPayment, currency),
    remainingMajor: remaining,
    remainingMinor: toMinor(remaining, currency),
    perInstallmentMajor: scheduleMajors[0],
    perInstallmentMinor: toMinor(scheduleMajors[0], currency),
    scheduleMajors,
    count,
    interval: args.interval,
    intervalCount,
    allowEarlyPayoff,
  };
}

// ─────────────────────────── Router

export type PricingBlock =
  | ({ model: "one_time" } & Omit<OneTimeArgs, "basePrice"> & {
        basePrice: number;
      })
  | (({ model: "subscription" } & Omit<
      SubscriptionArgs,
      "subscriptionPrice"
    > & {
        subscriptionPrice: number;
      }) & {
      model: "per_unit";
      tierType: TierType;
      quantity: number;
      unitName?: string;
      basePrice?: number;
      tiers?: Array<{ upTo: number; unitPrice: number }>;
      discountPercentage?: number;
      taxInclusive?: boolean;
      vatPercentage?: number;
      currency?: Currency;
    });

export function computeAmountsFromPricing(pricing: PricingBlock) {
  console.log(">>>>>>>>>>>>>>>>>>> ", pricing);
  if (pricing.model === "one_time") return calcOneTimeAmount(pricing);
  if (pricing.model === "subscription") return calcSubscriptionAmount(pricing);
  return calcPerUnitTotals(pricing);
}
