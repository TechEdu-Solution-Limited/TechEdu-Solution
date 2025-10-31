// Minimal checkout action builder to satisfy CheckoutPage dependencies
// NOTE: This is a simplified client-only builder and not a source of truth.

export type CheckoutAction =
  | {
      flow: "free";
      amounts: { totalMajor: 0 };
      requests: [];
    }
  | {
      flow: "payment_intent";
      amounts: { totalMajor: number };
      requests: Array<{ body: Record<string, any> }>;
    }
  | {
      flow: "billing";
      purpose: "installments";
      amounts: { perInstallmentMajor: number; downPaymentMajor: number };
      requests: Array<{ body: Record<string, any> }>;
    }
  | {
      flow: "billing";
      purpose: "subscription";
      amounts: { periodAmountMajor: number; setupFeeMajor?: number };
      requests: Array<{ body: Record<string, any> }>;
    };

/**
 * Build a minimal action used by CheckoutPage to drive UI and API calls.
 * This does not replace server-side validation or computation.
 */
export function buildCheckoutRequests(
  pricing: any,
  ctx: any
): CheckoutAction {
  // FREE
  if ((pricing?.basePrice ?? pricing?.subscriptionPrice ?? 0) <= 0) {
    return { flow: "free", amounts: { totalMajor: 0 }, requests: [] };
  }

  // SUBSCRIPTION
  if (pricing?.model === "subscription") {
    const periodAmountMajor = Number(pricing?.subscriptionPrice || 0) || 0;
    const setupFeeMajor = Number(pricing?.setupFee || 0) || 0;
    return {
      flow: "billing",
      purpose: "subscription",
      amounts: { periodAmountMajor, ...(setupFeeMajor ? { setupFeeMajor } : {}) },
      requests: [
        {
          body: {
            user: ctx?.user,
            productId: ctx?.productId,
            pricing: {
              model: "subscription",
              subscriptionPrice: periodAmountMajor,
              interval: pricing?.interval || "month",
              intervalCount: pricing?.intervalCount || 1,
              trialDays: pricing?.trialDays || 0,
              setupFee: setupFeeMajor || 0,
            },
            purpose: "subscription",
          },
        },
        { body: { purpose: "subscription", productId: ctx?.productId } },
      ],
    };
  }

  // INSTALLMENTS (one-time with installments enabled via ctx.installments)
  if (ctx?.installments?.enabled) {
    const downPaymentMajor = Number(ctx?.installments?.downPaymentValue || 0) || 0;
    // naive even split (client-only preview)
    const count = Math.max(1, Number(ctx?.installments?.count || 6));
    const base = Number(pricing?.basePrice || 0) || 0;
    const remainder = Math.max(0, base - downPaymentMajor);
    const perInstallmentMajor = count > 0 ? remainder / count : 0;

    return {
      flow: "billing",
      purpose: "installments",
      amounts: {
        perInstallmentMajor,
        downPaymentMajor,
      },
      requests: [
        {
          body: {
            user: ctx?.user,
            productId: ctx?.productId,
            plan: {
              count,
              interval: ctx?.installments?.interval || "month",
              intervalCount: ctx?.installments?.intervalCount || 1,
              downPaymentType: ctx?.installments?.downPaymentType || "percent",
              downPaymentValue: ctx?.installments?.downPaymentValue || 0,
            },
            purpose: "installments",
          },
        },
        { body: { purpose: "installments", productId: ctx?.productId } },
      ],
    };
  }

  // ONE-TIME PAYMENT
  const totalMajor = Number(pricing?.basePrice || 0) || 0;
  return {
    flow: "payment_intent",
    amounts: { totalMajor },
    requests: [
      {
        body: {
          productId: ctx?.productId,
          userNotes: ctx?.userNotes,
          attachments: ctx?.attachments,
          isTeam: !!ctx?.isTeam,
          numberOfExpectedParticipants: ctx?.numberOfExpectedParticipants,
        },
      },
    ],
  };
}





// (Removed duplicate, unused type block to avoid linter errors)
