// /lib/pricing/checkout.ts
// Builds request payloads for your flows (no network calls).
// Subscriptions and Installments both use Billing endpoints:
//   1) POST /api/billing/installments/start   (create/reuse Stripe customer)
//   2) POST /api/billing/installments/confirm (subscription OR installments)

import {
  Currency,
  OneTimeArgs,
  SubscriptionArgs,
  TierType,
  OneTimeResult,
  SubscriptionResult,
  PerUnitResult,
  splitInstallments,
  calcOneTimeAmount,
  calcSubscriptionAmount,
  calcPerUnitAmount,
  computeAmountsFromPricing,
  PricingBlock as BasePricingBlock,
} from "@/lib/pricing/calculators";

/* ─────────────────────────── Currency helpers (local copy) */

const ZERO_DECIMAL_LOCAL = new Set([
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

const factorLocal = (cur: Currency) =>
  ZERO_DECIMAL_LOCAL.has((cur || "").toUpperCase()) ? 1 : 100;

const roundMajorLocal = (n: number, cur: Currency) =>
  Math.round((n ?? 0) * factorLocal(cur)) / factorLocal(cur);

/* ─────────────────────────── API request shapes */

export type UserRef = {
  id: string;
  email: string;
  name: string;
  stripeCustomerId?: string; // include only if existing customer
};

export type InstallmentsStartReq = {
  user: UserRef; // with or without stripeCustomerId
};

export type InstallmentsConfirmReq = {
  user: UserRef;
  productName: string;
  currency: Currency;
  pricing:
    | {
        model: "one_time";
        currency: Currency;
        basePrice: number;
        taxInclusive?: boolean;
        vatPercentage?: number;
      }
    | ({
        model: "per_unit";
        currency: Currency;
        unitName?: string;
        allowQuantity?: boolean;
        minQty?: number;
        maxQty?: number;
        taxInclusive?: boolean;
        vatPercentage?: number;
      } & (
        | { tierType: "none"; basePrice: number }
        | {
            tierType: Exclude<TierType, "none">;
            tiers: Array<{ upTo: number | null; unitPrice: number }>;
          }
      ))
    | {
        model: "subscription";
        currency: Currency;
        subscriptionPrice: number; // per billing period (tax-inclusive/exclusive depending on taxInclusive)
        interval: "day" | "week" | "month" | "year";
        intervalCount?: number;
        trialDays?: number;
        setupFee?: number;
        autoRenew?: boolean;
        proration?: boolean;
        taxInclusive?: boolean;
        vatPercentage?: number;
      };
  quantity: number; // seats for per_unit; 1 otherwise
  plan: {
    // For subscription: count = 0 (open-ended recurring)
    count: number;
    interval: "week" | "month" | "year";
    intervalCount: number;
    downPaymentType: "none" | "amount" | "percent";
    downPaymentValue: number;
    // Optional extras commonly needed downstream:
    allowEarlyPayoff?: boolean;
    provider?: "in_house" | "stripe" | "other" | string;
  };
};

export type CreateIntentReq = {
  productId: string;
  isTeam: boolean;
  userNotes?: string;
  attachments?: string;
  numberOfExpectedParticipants: number;
  participants?: Array<{
    participantType: "individual" | "team" | "institution" | "recruiter";
    platformRole:
      | "student"
      | "individualTechProfessional"
      | "teamTechProfessional"
      | "recruiter"
      | "institution"
      | "admin"
      | "visitor";
    profileId?: string;
    email?: string;
    fullName?: string;
  }>;
  jobApplicationId?: string;
  couponCode?: string;
  customerId?: string; // pass if known
};

/* ─────────────────────────── Dispatcher output */

export type CheckoutAction =
  | {
      flow: "free";
      requests: [];
      amounts: { totalMajor: number; totalMinor: number; currency: Currency };
      note: "No payment required; grant entitlement immediately.";
    }
  | {
      flow: "payment_intent";
      requests: Array<{
        method: "POST";
        endpoint: "/api/payments/create-intent";
        body: CreateIntentReq;
      }>;
      amounts: { totalMajor: number; totalMinor: number; currency: Currency };
    }
  | {
      flow: "billing";
      purpose: "installments" | "subscription";
      requests: [
        {
          method: "POST";
          endpoint: "/api/billing/installments/start";
          body: InstallmentsStartReq;
        },
        {
          method: "POST";
          endpoint: "/api/billing/installments/confirm";
          body: InstallmentsConfirmReq;
        }
      ];
      amounts:
        | {
            // installments
            totalMajor: number;
            totalMinor: number;
            downPaymentMajor: number;
            downPaymentMinor: number;
            perInstallmentMajor: number;
            perInstallmentMinor: number;
            currency: Currency;
          }
        | {
            // subscription
            periodAmountMajor: number;
            periodAmountMinor: number;
            setupFeeMajor: number;
            setupFeeMinor: number;
            currency: Currency;
          };
    };

/* ─────────────────────────── Inputs */

export type PricingBlock = BasePricingBlock;

export type BuildContext = {
  user: UserRef; // include stripeCustomerId if existing
  productId?: string; // for payment intent
  productName: string; // for billing confirm
  isTeam?: boolean;
  numberOfExpectedParticipants?: number;
  userNotes?: string;
  attachments?: string;
  jobApplicationId?: string;
  couponCode?: string;
  customerId?: string;

  // Installments overlay (also used to flag subscriptions as billing)
  installments?:
    | { enabled: false }
    | {
        enabled: true;
        count?: number; // for subs we set 0
        interval: "week" | "month" | "year";
        intervalCount?: number;
        downPaymentType?: "none" | "amount" | "percent";
        downPaymentValue?: number;
        allowEarlyPayoff?: boolean;
        provider?: "in_house" | "stripe" | "other" | string;
      };
};

/* ─────────────────────────── Core builder (no API calls) */

export function buildCheckoutRequests(
  pricing: PricingBlock,
  ctx: BuildContext
): CheckoutAction {
  console.log(">>>>>>>>>>>>>>>>>>> ", pricing);
  const computed = computeAmountsFromPricing(pricing);
  const currency = (("currency" in pricing && (pricing as any).currency) ||
    "gbp") as Currency;

  // FREE (one-time / per-unit)
  if (
    (pricing.model === "one_time" || pricing.model === "per_unit") &&
    (computed as OneTimeResult | PerUnitResult).totalMinor === 0
  ) {
    return {
      flow: "free",
      requests: [],
      amounts: {
        totalMajor: (computed as OneTimeResult | PerUnitResult).totalMajor || 0,
        totalMinor: (computed as OneTimeResult | PerUnitResult).totalMinor || 0,
        currency,
      },
      note: "No payment required; grant entitlement immediately.",
    };
  }

  // SUBSCRIPTION via billing (count = 0)
  if (pricing.model === "subscription") {
    const r: SubscriptionResult = calcSubscriptionAmount(
      pricing as SubscriptionArgs
    );

    const startReq: InstallmentsStartReq = { user: ctx.user };

    const confirmReq: InstallmentsConfirmReq = {
      user: ctx.user,
      productName: ctx.productName,
      currency: r.currency,
      pricing: {
        model: "subscription",
        currency: r.currency,
        subscriptionPrice: r.tax.totalMajor, // per period (incl/excl based on taxInclusive)
        interval: r.interval,
        intervalCount: r.intervalCount,
        trialDays: r.trialDays,
        setupFee: r.setupFeeMajor,
        autoRenew: r.autoRenew,
        proration: r.proration,
        taxInclusive: r.tax.taxInclusive,
        vatPercentage: r.tax.vatPercentage,
      },
      quantity: 1,
      plan: {
        count: 0, // open-ended recurring
        // ensure week/month/year (normalize 'day' to 'month' for plan-level cadence)
        interval: r.interval === "day" ? "month" : r.interval,
        intervalCount: r.intervalCount,
        downPaymentType: "none",
        downPaymentValue: 0,
        allowEarlyPayoff: true,
        provider: "in_house",
      },
    };

    return {
      flow: "billing",
      purpose: "subscription",
      requests: [
        {
          method: "POST",
          endpoint: "/api/billing/installments/start",
          body: startReq,
        },
        {
          method: "POST",
          endpoint: "/api/billing/installments/confirm",
          body: confirmReq,
        },
      ],
      amounts: {
        periodAmountMajor: r.unitAmountMajor,
        periodAmountMinor: r.unitAmountMinor,
        setupFeeMajor: r.setupFeeMajor,
        setupFeeMinor: r.setupFeeMinor,
        currency: r.currency,
      },
    };
  }

  // INSTALLMENTS overlay (one-time or per-unit)
  if (ctx.installments && ctx.installments.enabled) {
    const totals = computed as OneTimeResult | PerUnitResult;
    const totalMajor = totals.totalMajor;
    const interval = ctx.installments.interval;
    const intervalCount = ctx.installments.intervalCount ?? 1;
    const count = Math.max(2, ctx.installments.count ?? 2);
    const downPaymentType = ctx.installments.downPaymentType ?? "none";
    const downPaymentValue = ctx.installments.downPaymentValue ?? 0;
    const allowEarlyPayoff = ctx.installments.allowEarlyPayoff ?? true;
    const provider = ctx.installments.provider ?? "in_house";

    const plan = splitInstallments({
      currency,
      totalMajor,
      count,
      interval,
      intervalCount,
      downPaymentType,
      downPaymentValue,
      allowEarlyPayoff,
    });

    const startReq: InstallmentsStartReq = { user: ctx.user };

    // Normalize tiers to { upTo, unitPrice } (support legacy 'upto' inbound)
    const normalizeTiers = (
      tiers:
        | Array<{ upTo: number; unitPrice: number }>
        | Array<{ upto: number; unitPrice: number }>
        | undefined
    ): Array<{ upTo: number | null; unitPrice: number }> =>
      (tiers || []).map((t: any) => ({
        upTo:
          typeof t?.upTo === "number"
            ? t.upTo
            : typeof t?.upto === "number"
            ? t.upto
            : null,
        unitPrice: Number(t.unitPrice) || 0,
      }));

    let confirmPricing: InstallmentsConfirmReq["pricing"];
    if (pricing.model === "one_time") {
      const p = pricing as OneTimeArgs & { currency?: Currency };
      confirmPricing = {
        model: "one_time",
        currency: p.currency || currency,
        basePrice: p.basePrice,
        taxInclusive: p.taxInclusive ?? true,
        vatPercentage: p.vatPercentage ?? 0,
      };
    } else {
      const p = pricing as Extract<PricingBlock, { model: "per_unit" }>;
      confirmPricing =
        p.tierType === "none"
          ? {
              model: "per_unit",
              currency: p.currency || currency,
              unitName: p.unitName,
              allowQuantity: true,
              minQty: 1,
              maxQty: 1000,
              tierType: "none",
              basePrice: p.basePrice ?? 0,
              taxInclusive: p.taxInclusive ?? true,
              vatPercentage: p.vatPercentage ?? 0,
            }
          : {
              model: "per_unit",
              currency: p.currency || currency,
              unitName: p.unitName,
              allowQuantity: true,
              minQty: 1,
              maxQty: 1000,
              tierType: p.tierType,
              tiers: normalizeTiers(p.tiers),
              taxInclusive: p.taxInclusive ?? true,
              vatPercentage: p.vatPercentage ?? 0,
            };
    }

    const confirmReq: InstallmentsConfirmReq = {
      user: ctx.user,
      productName: ctx.productName,
      currency,
      pricing: confirmPricing,
      quantity: (pricing as any).quantity ?? 1,
      plan: {
        count,
        interval,
        intervalCount,
        downPaymentType,
        downPaymentValue,
        allowEarlyPayoff,
        provider,
      },
    };

    return {
      flow: "billing",
      purpose: "installments",
      requests: [
        {
          method: "POST",
          endpoint: "/api/billing/installments/start",
          body: startReq,
        },
        {
          method: "POST",
          endpoint: "/api/billing/installments/confirm",
          body: confirmReq,
        },
      ],
      amounts: {
        totalMajor: plan.totalMajor,
        totalMinor: plan.totalMinor,
        downPaymentMajor: plan.downPaymentMajor,
        downPaymentMinor: plan.downPaymentMinor,
        perInstallmentMajor: plan.perInstallmentMajor,
        perInstallmentMinor: plan.perInstallmentMinor,
        currency: plan.currency,
      },
    };
  }

  // ONE-TIME without installments → Payment Intent (server computes final)
  const createIntentBody: CreateIntentReq = {
    productId: ctx.productId || "",
    isTeam: !!ctx.isTeam,
    userNotes: ctx.userNotes,
    attachments: ctx.attachments,
    numberOfExpectedParticipants: ctx.numberOfExpectedParticipants ?? 1,
    jobApplicationId: ctx.jobApplicationId,
    couponCode: ctx.couponCode,
    customerId: ctx.customerId ?? ctx.user.stripeCustomerId,
  };

  return {
    flow: "payment_intent",
    requests: [
      {
        method: "POST",
        endpoint: "/api/payments/create-intent",
        body: createIntentBody,
      },
    ],
    amounts: {
      totalMajor: (computed as OneTimeResult | PerUnitResult).totalMajor || 0,
      totalMinor: (computed as OneTimeResult | PerUnitResult).totalMinor || 0,
      currency,
    },
  };
}

/* ─────────────────────────── CART HELPERS */

export type ProductTaxInfo = { taxable: boolean; vatPercentage: number };
export type ResolveProductTax = (
  productId: string
) => Promise<ProductTaxInfo> | ProductTaxInfo;

/** 1) If product is taxable, return the VAT amount (major) for a given pre-tax amount; else 0. */
export async function computeTaxableAmount(
  productId: string,
  amountPayableMajor: number,
  resolveProductTax: ResolveProductTax,
  currency: Currency = "gbp"
): Promise<number> {
  const info = await resolveProductTax(productId);
  if (!info?.taxable || !info?.vatPercentage) return 0;
  const tax = amountPayableMajor * (info.vatPercentage / 100);
  return roundMajorLocal(tax, currency);
}

/** 2) Total calculator: amount + tax (major). */
export function computeCartTotal(
  amountPayableMajor: number,
  taxAmountMajor: number
): number {
  return +(
    Number(amountPayableMajor || 0) + Number(taxAmountMajor || 0)
  ).toFixed(2);
}

export type ResolveProductPricing = (
  productId: string
) => Promise<PricingBlock> | PricingBlock;

/** 3) Next payable amount for subscription/installments. */
export async function computeNextPayableAmount(
  productId: string,
  userSelectedQuantity: number | undefined,
  intervalCount: number | undefined, // installments count; ignored for subs
  downPayment:
    | { type: "none" | "amount" | "percent"; value: number }
    | undefined,
  resolveProductPricing: ResolveProductPricing
): Promise<{
  amountMajor: number;
  label: "trial" | "down_payment" | "first_period" | "first_installment";
}> {
  const pricing = await resolveProductPricing(productId);

  let effective: PricingBlock = pricing;
  if (
    pricing.model === "per_unit" &&
    typeof userSelectedQuantity === "number"
  ) {
    effective = { ...pricing, quantity: userSelectedQuantity };
  }

  if (pricing.model === "subscription") {
    const r = calcSubscriptionAmount(pricing as SubscriptionArgs);
    if (r.trialDays && r.trialDays > 0)
      return { amountMajor: 0, label: "trial" };
    // First charge: first period + any setup fee
    return {
      amountMajor: +(r.unitAmountMajor + r.setupFeeMajor).toFixed(2),
      label: "first_period",
    };
  }

  const totals =
    pricing.model === "one_time"
      ? calcOneTimeAmount(pricing as OneTimeArgs)
      : calcPerUnitAmount(effective as any);

  if (downPayment) {
    const plan = splitInstallments({
      currency: (pricing as any).currency || "gbp",
      totalMajor: totals.totalMajor,
      count: Math.max(2, intervalCount ?? 2),
      interval: "month",
      intervalCount: 1,
      downPaymentType: downPayment.type,
      downPaymentValue: downPayment.value,
      allowEarlyPayoff: true,
    });
    if (downPayment.type !== "none" && plan.downPaymentMajor > 0) {
      return { amountMajor: plan.downPaymentMajor, label: "down_payment" };
    }
    return {
      amountMajor: plan.perInstallmentMajor,
      label: "first_installment",
    };
  }

  // No installments → pay full now
  return { amountMajor: totals.totalMajor, label: "first_installment" };
}
