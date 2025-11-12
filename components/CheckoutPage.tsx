// CheckoutPage.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { useCart } from "@/contexts/CartContext";
import { useRole } from "@/contexts/RoleContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import StripePaymentForm from "@/components/StripePaymentForm";
import { PaymentService } from "@/lib/api/paymentService";
import { getTokenFromCookies } from "@/lib/cookies";
import { safeConsole } from "@/lib/console";

import type { BillingChoice, CartItem } from "@/types/cart";
// Local minimal checkout builder (keeps this page self-contained)
type ExternalCheckoutAction =
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

function buildCheckoutRequests(pricing: any, ctx: any): ExternalCheckoutAction {
  // Free booking is determined explicitly by model
  if (pricing?.model === "free") {
    return { flow: "free", amounts: { totalMajor: 0 }, requests: [] };
  }
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
          },
        },
        {
          body: {
            user: ctx?.user,
          },
        },
      ],
    };
  }
  if (ctx?.installments?.enabled) {
    const downPaymentMajor = Number(ctx?.installments?.downPaymentValue || 0) || 0;
    const count = Math.max(1, Number(ctx?.installments?.count || 6));
    const base = Number(pricing?.basePrice || 0) || 0;
    const remainder = Math.max(0, base - downPaymentMajor);
    const perInstallmentMajor = count > 0 ? remainder / count : 0;
    return {
      flow: "billing",
      purpose: "installments",
      amounts: { perInstallmentMajor, downPaymentMajor },
      requests: [
        {
          body: {
            user: ctx?.user,
          },
        },
        {
          body: {
            user: ctx?.user,
          },
        },
      ],
    };
  }
  const totalMajor = Number(pricing?.basePrice || 0) || 0;
  return {
    flow: "payment_intent",
    amounts: { totalMajor },
    requests: [
      {
        body: {
          productId: ctx?.productId,
          userNotes: ctx?.userNotes || "",
          attachments: ctx?.attachments,
          isTeam: !!ctx?.isTeam,
          participantType: ctx?.participantType || "individual",
          numberOfExpectedParticipants: ctx?.numberOfExpectedParticipants,
        },
      },
    ],
  };
}
import { CreditCard, Loader2, Upload, X, CheckCircle2 } from "lucide-react";

/* ---------------- Currency utils ---------------- */
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
const toMinor = (major: number, currency?: string) =>
  ZERO_DECIMAL.has((currency ?? "USD").toUpperCase())
    ? Math.round(major)
    : Math.round(major * 100);
const formatCurrency = (amount: number, currency?: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: (currency ?? "USD").toUpperCase(),
  }).format(amount);

/* ---------------- Selection payload from Cart ---------------- */
type CheckoutSelection = Array<{
  itemId: string;
  mode: BillingChoice;
  quantity: number;
  booking?: {
    userNotes?: string;
    attachments?: string[];
    participantType?: "individual" | "team";
    isTeam?: boolean;
  };
}>;

/* ---------------- Build pricing block (loosely typed) ---------------- */

function toPricingBlock(
  item: CartItem,
  mode: BillingChoice,
  _quantity: number
): any {
  const p: any = item.pricing || {};
  const currency = (p.currency || item.currency || "usd").toLowerCase();

  // Subscription rule
  if (
    mode === "subscription" ||
    p?.model === "subscription" ||
    item.isRecurring
  ) {
    return {
      model: "subscription",
      currency,
      subscriptionPrice: p.subscriptionPrice ?? item.price ?? 0,
      interval: p.interval ?? "month",
      intervalCount: p.intervalCount ?? 1,
      trialDays: p.trialDays ?? 0,
      setupFee: p.setupFee ?? 0,
      autoRenew: p.autoRenew ?? true,
      proration: p.proration ?? true,
      taxInclusive: p.taxInclusive ?? true,
      vatPercentage: p.vatPercentage ?? 0,
      discountPercentage: p.discountPercent ?? p.discountPercentage ?? 0,
    } as any;
  }

  // Per-unit rule (keep tiers & quantity)
  if (p?.model === "per_unit" || p?.tierType) {
    const tierType: "none" | "volume" | "graduated" | "stairstep" =
      p.tierType ?? "none";
    return {
      model: "per_unit",
      currency,
      quantity: Math.max(1, Number(_quantity || 1)),
      unitName: p.unitName || "team",
      taxInclusive: p.taxInclusive ?? true,
      vatPercentage: p.vatPercentage ?? 0,
      discountPercentage: p.discountPercent ?? p.discountPercentage ?? 0,
      tierType,
      basePrice: p.basePrice, // used if tierType === "none"
      tiers: Array.isArray(p.tiers)
        ? p.tiers.map((t: any) => ({
            upTo:
              typeof t?.upTo === "number"
                ? t.upTo
                : typeof t?.upto === "number"
                ? t.upto
                : t?.cap ?? t?.limit ?? 0,
            unitPrice: Number(t?.unitPrice || 0),
          }))
        : undefined,
    } as any;
  }

  // Fallback one-time
  return {
    model: "one_time",
    currency,
    basePrice: p.basePrice ?? item.price ?? 0,
    taxInclusive: p.taxInclusive ?? true,
    vatPercentage: p.vatPercentage ?? 0,
    discountPercentage: p.discountPercent ?? p.discountPercentage ?? 0,
  } as any;
}

/* ---------------- Type guards + narrowed clones ---------------- */
type CA = ExternalCheckoutAction;

const asFree = (a: CA | null) =>
  a && a.flow === "free"
    ? (a as CA & { flow: "free"; amounts: { totalMajor: 0 } })
    : null;

const asPayment = (a: CA | null) =>
  a && a.flow === "payment_intent"
    ? (a as CA & { flow: "payment_intent"; amounts: { totalMajor: number } })
    : null;

const asInstallments = (a: CA | null) =>
  a && a.flow === "billing" && (a as any).purpose === "installments"
    ? (a as CA & {
        flow: "billing";
        purpose: "installments";
        amounts: { perInstallmentMajor: number; downPaymentMajor: number };
      })
    : null;

const asSubscription = (a: CA | null) =>
  a && a.flow === "billing" && (a as any).purpose === "subscription"
    ? (a as CA & {
        flow: "billing";
        purpose: "subscription";
        amounts: { periodAmountMajor: number; setupFeeMajor?: number };
      })
    : null;

/* ================================================================= */
export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, removeFromCart } = useCart();
  const { isAuthenticated, userData } = useRole();

  const [selected, setSelected] = useState<CheckoutSelection>([]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [mode, setMode] = useState<"payment" | "setup" | null>(null);
  const [currency, setCurrency] = useState<string>("USD");
  const [amountMinor, setAmountMinor] = useState<number | undefined>(undefined);
  
  // Store billing flow state for handling "both" intent type
  const [billingFlowState, setBillingFlowState] = useState<{
    isBillingFlow: boolean;
    setupIntentSecret?: string;
    paymentIntentSecret?: string;
    intentType?: "payment" | "setup" | "both";
  } | null>(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  /* ---------------- Server price previews ---------------- */
  const [serverPricePreview, setServerPricePreview] = useState<
    | {
        quoteId?: string;
        currency: string;
        quantity: number;
        subtotal: number;
        vat: number;
        total: number;
        unitPrice?: number;
        model?: string;
        tierType?: string;
      }
    | null
  >(null);
  const [preview, setPreview] = useState<any>(null);
  const [selectedModeFromCart, setSelectedModeFromCart] = useState<"pay_in_full" | "installments" | "subscription" | null>(null);
  const [serverInstallmentsPreview, setServerInstallmentsPreview] = useState<
    | {
        total: number;
        downPayment: number;
        installments: number[];
        plan?: {
          count: number;
          interval: "day" | "week" | "month" | "year";
          intervalCount: number;
          downPaymentType: "percent" | "amount";
          downPaymentValue: number;
        };
      }
    | null
  >(null);

  // No data fetching on this page; preview is supplied by Cart via sessionStorage

  /* Booking modal (moved here from Cart) */
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingFormData, setBookingFormData] = useState<{
    userNotes: string;
    attachments: string[];
  }>({ userNotes: "", attachments: [] });
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);

  /* Load selection + preview from sessionStorage */
  useEffect(() => {
    try {
      const selRaw = typeof window !== "undefined" ? sessionStorage.getItem("checkout.selection") : null;
      if (selRaw) {
        const parsed = JSON.parse(selRaw) as CheckoutSelection;
        setSelected(Array.isArray(parsed) ? parsed : []);
        const b = (Array.isArray(parsed) ? parsed[0]?.booking : undefined) || {};
        setBookingFormData({ userNotes: b.userNotes || "", attachments: b.attachments || [] });
      }

      const previewRaw = typeof window !== "undefined" ? sessionStorage.getItem("checkout.preview") : null;
      const modeRaw = typeof window !== "undefined" ? sessionStorage.getItem("checkout.mode") : null;
      if (previewRaw) setPreview(JSON.parse(previewRaw));
      if (modeRaw) setSelectedModeFromCart(modeRaw as any);
      if (!previewRaw) router.push("/cart");
    } catch {
      router.push("/cart");
    }
  }, [router]);

  const selectedItem: CartItem | undefined = useMemo(() => {
    if (selected.length === 0) return undefined;
    return cartItems.find((ci) => ci.id === selected[0].itemId);
  }, [selected, cartItems]);

  const selectedMode: BillingChoice | null = selected[0]?.mode ?? null;
  const quantity: number = selected[0]?.quantity ?? 1;
  const booking = selected[0]?.booking;

  /* Build the action using the external type */
  const action = useMemo<ExternalCheckoutAction | null>(() => {
    if (!selectedItem || !selectedMode) return null;

    const pricing = toPricingBlock(
      selectedItem,
      selectedMode,
      quantity
    );

    const user = {
      id:
        (userData as any)?.id ||
        (userData as any)?._id ||
        (userData as any)?.userId ||
        "",
      email: (userData as any)?.email || "",
      name: (userData as any)?.fullName || (userData as any)?.name || "",
      ...((userData as any)?.stripeCustomerId
        ? { stripeCustomerId: (userData as any).stripeCustomerId }
        : {}),
    };

    const ctx = {
      user,
      productId: selectedItem.id,
      productName: selectedItem.title || "Product",
      // Derive team purchase from booking or pricing (per_unit with unitName="team")
      isTeam: (() => {
        const bTeam = !!booking?.isTeam;
        const p: any = selectedItem.pricing || {};
        const isPerUnit = p?.priceBasis === "per_unit" || p?.model === "per_unit";
        const unitName = p?.unitName;
        const pricingTeam = isPerUnit && unitName === "team";
        return bTeam || pricingTeam;
      })(),
      participantType: (() => {
        if (booking?.participantType) return booking.participantType;
        const p: any = selectedItem.pricing || {};
        const isPerUnit = p?.priceBasis === "per_unit" || p?.model === "per_unit";
        const unitName = p?.unitName;
        const pricingTeam = isPerUnit && unitName === "team";
        return (booking?.isTeam || pricingTeam) ? "team" : "individual";
      })(),
      numberOfExpectedParticipants: quantity,
      userNotes: booking?.userNotes,
      attachments: booking?.attachments,
      installments:
        selectedMode === "installments" &&
        selectedItem.pricing?.installments?.enabled
          ? {
              enabled: true,
              count: selectedItem.pricing?.installments?.count ?? 6,
              interval: selectedItem.pricing?.installments?.interval ?? "month",
              intervalCount:
                selectedItem.pricing?.installments?.intervalCount ?? 1,
              downPaymentType:
                selectedItem.pricing?.installments?.downPaymentType ??
                "percent",
              downPaymentValue:
                selectedItem.pricing?.installments?.downPaymentValue ?? 20,
            }
          : { enabled: false },
    } as const;

    try {
      return buildCheckoutRequests(
        pricing as any,
        ctx as any
      ) as ExternalCheckoutAction;
    } catch (e) {
      safeConsole.error("Failed to build checkout requests", e);
      return null;
    }
  }, [selectedItem, selectedMode, quantity, booking, userData]);

  /* Narrowed clones to avoid 'never' in JSX */
  const A_FREE = asFree(action);
  const A_PAYMENT = asPayment(action);
  const A_INST = asInstallments(action);
  const A_SUB = asSubscription(action);

  // Map preview response into presentational state
  useEffect(() => {
    try {
      if (!preview) {
        setServerPricePreview(null);
        setServerInstallmentsPreview(null);
        return;
      }
      const mode = (selectedModeFromCart || "pay_in_full") as any;
      const opt = preview?.data?.options?.[mode];
      if (!opt) {
        setServerPricePreview(null);
        setServerInstallmentsPreview(null);
        return;
      }
      // Extract quoteId from option level or top level of response
      const quoteId = opt.quoteId || preview?.data?.quoteId || preview?.quoteId;
      
      setServerPricePreview({
        quoteId: quoteId,
        currency: (opt.currency || "USD").toString().toUpperCase(),
        quantity: Number(opt.quantity || 1),
        subtotal: Number(opt.breakdown?.subtotal || 0),
        vat: Number(opt.breakdown?.vatAmount || 0),
        total: Number(opt.breakdown?.total || 0),
        unitPrice: typeof opt.breakdown?.unitPrice === "number" ? opt.breakdown.unitPrice : undefined,
        model: opt.model,
        tierType: opt.tiers?.type,
      });
      
      // Debug: Log quoteId extraction
      if (!quoteId) {
        safeConsole.warn("⚠️ [CheckoutPage] quoteId not found in preview response", {
          hasOpt: !!opt,
          optKeys: opt ? Object.keys(opt) : [],
          hasPreviewData: !!preview?.data,
          previewDataKeys: preview?.data ? Object.keys(preview.data) : [],
          mode,
        });
      } else {
        safeConsole.log("✅ [CheckoutPage] quoteId extracted:", quoteId);
      }
      if (mode === "installments" && opt.installments?.enabled) {
        setServerInstallmentsPreview({
          total: Number(opt.installments?.totalFinanced || opt.breakdown?.total || 0),
          downPayment: Number(opt.installments?.downPayment?.amount || 0),
          installments: Array.isArray(opt.installments?.schedule)
            ? opt.installments.schedule.map((x: any) => Number(x?.amount || 0))
            : [],
          plan: {
            count: Number(opt.installments?.count || 0),
            interval: (opt.installments?.interval ||
              selectedItem?.pricing?.installments?.interval ||
              "month") as "day" | "week" | "month" | "year",
            intervalCount: Number(
              opt.installments?.intervalCount ||
                selectedItem?.pricing?.installments?.intervalCount ||
                1
            ),
            downPaymentType: (opt.installments?.downPayment?.type || "percent") as any,
            downPaymentValue: Number(opt.installments?.downPayment?.value || 0),
          },
        });
      } else {
        setServerInstallmentsPreview(null);
      }
    } catch (e) {
      setServerPricePreview(null);
      setServerInstallmentsPreview(null);
    }
  }, [preview, selectedModeFromCart]);

  /* Due today */
  const dueTodayMajor = useMemo(() => {
    const mode = (selectedModeFromCart || "pay_in_full") as any;
    const opt = preview?.data?.options?.[mode];
    if (opt?.mode === "pay_in_full") return Number(opt?.breakdown?.total || 0);
    if (opt?.mode === "installments") return Number(opt?.installments?.downPayment?.amount || 0);
    if (opt?.mode === "subscription") {
      // For subscriptions, if there's a breakdown, use the first period's total
      // Otherwise fall back to A_SUB calculation
      if (opt?.breakdown?.total !== undefined) {
        return Number(opt.breakdown.total || 0);
      }
    }
    // fallback
    if (A_FREE) return 0;
    if (A_PAYMENT) return A_PAYMENT.amounts.totalMajor;
    if (A_INST) {
      const a = A_INST.amounts;
      return a.downPaymentMajor > 0 ? a.downPaymentMajor : a.perInstallmentMajor;
    }
    if (A_SUB) {
      const trial = (A_SUB.requests?.[1] as any)?.body?.pricing?.trialDays ?? 0;
      const firstPeriod = trial > 0 ? 0 : A_SUB.amounts.periodAmountMajor;
      return (A_SUB.amounts.setupFeeMajor || 0) + firstPeriod;
    }
    return 0;
  }, [preview, selectedModeFromCart, A_FREE, A_PAYMENT, A_INST, A_SUB]);

  /* ---- Booking requirements & validation ---- */
  const needsBooking = !!(
    selectedItem?.requiresBooking || selectedItem?.isAttachmentRequired
  );

  const requiresNotes = !!selectedItem?.requiresBooking;
  const requiresAttachment = !!selectedItem?.isAttachmentRequired;

  const canContinue = !(
    (requiresNotes && bookingFormData.userNotes.trim().length === 0) ||
    (requiresAttachment && bookingFormData.attachments.length === 0)
  );

  const bookingSatisfied =
    !needsBooking ||
    !!(
      selected[0]?.booking &&
      (!requiresAttachment ||
        (selected[0]?.booking?.attachments?.length || 0) > 0) &&
      (!requiresNotes ||
        (selected[0]?.booking?.userNotes || "").trim().length > 0)
    );

  const openBookingModal = () => setBookingModalOpen(true);
  const closeBookingModal = () => setBookingModalOpen(false);

  /* -------- Example upload function -------- */
  const handleAttachmentUpload = async (file: File) => {
    setIsUploadingAttachment(true);
    try {
      // TODO: replace with your uploader
      const downloadURL = URL.createObjectURL(file);
      setBookingFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, downloadURL],
      }));
      toast.success("File uploaded successfully");
    } catch (error) {
      safeConsole.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploadingAttachment(false);
    }
  };
  const removeAttachment = (index: number) => {
    setBookingFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const applyBookingAndProceed = () => {
    if (!selectedItem) return;

    if (requiresAttachment && bookingFormData.attachments.length === 0) {
      toast.error("At least one attachment is required for this service");
      return;
    }
    if (requiresNotes && bookingFormData.userNotes.trim().length === 0) {
      toast.error("Please add notes for this booking");
      return;
    }

    const next = [...selected];
    if (next[0]) {
      next[0] = {
        ...next[0],
        booking: {
          ...(next[0].booking || {}),
          userNotes: bookingFormData.userNotes,
          attachments: bookingFormData.attachments,
        },
      };
    }
    setSelected(next);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("checkout.selection", JSON.stringify(next));
    }

    closeBookingModal();
    setTimeout(() => beginCheckout(), 0);
  };

  /* ---- Core checkout starter ---- */
  const beginCheckout = async () => {
    if (!action || !selectedItem) return;
    setBusy(true);
    setError(null);
    setBillingFlowState(null); // Clear billing flow state at start
    const token = getTokenFromCookies();

    try {
      // FREE
      if (A_FREE) {
        toast.success("No payment required — access granted.");
        removeFromCart(selectedItem.id);
        router.push("/dashboard");
        return;
      }

      // ONE-TIME → Payment Intent
      if (A_PAYMENT) {
        const req = A_PAYMENT.requests[0];
        const curr = (selectedItem.currency || "usd").toLowerCase();
        // Use server preview total if available, otherwise fallback to calculated
        const amountMajor = serverPricePreview?.total ?? A_PAYMENT.amounts.totalMajor;

        // Build request body with quoteId from preview if available
        const requestBody: any = {
          ...(req as any).body,
          ...(serverPricePreview?.quoteId ? { quoteId: serverPricePreview.quoteId } : {}),
        };

        const resp = await PaymentService.createSimplePaymentIntent(
          requestBody,
          amountMajor,
          curr,
          token || ""
        );
        const payload: any = resp?.data;

        const redirectUrl = payload?.data?.redirectUrl;
        const secret = payload?.data?.clientSecret || payload?.clientSecret;

        if (redirectUrl) {
          window.location.href = redirectUrl;
          return;
        }
        if (!secret || !String(secret).includes("_secret_")) {
          throw new Error("Invalid PaymentIntent response");
        }

        setClientSecret(secret);
        setMode("payment");
        setCurrency(serverPricePreview?.currency || (selectedItem.currency || "USD").toUpperCase());
        setAmountMinor(toMinor(amountMajor, curr));
        toast.success("Secure payment initialized");
        return;
      }

      // BILLING (installments/subscription) → PaymentIntent or SetupIntent
      if (A_INST || A_SUB) {
        const START = (A_INST ?? A_SUB)!.requests[0];
        const quoteId = serverPricePreview?.quoteId;
        
        if (!quoteId) {
          throw new Error("Missing quoteId from price preview. Please refresh and try again.");
        }

        // Build request body with quoteId from price preview
        const requestBody = {
          ...(START as any).body,
          quoteId,
        };

        const startResp = await PaymentService.startInstallmentsSetup(
          requestBody,
          token || ""
        );
        const startPayload: any = startResp?.data;
        
        // Handle new response structure with multiple client secrets
        const paymentIntentSecret = startPayload?.paymentIntentClientSecret;
        const setupIntentSecret = startPayload?.setupIntentClientSecret;
        const primaryClientSecret = startPayload?.clientSecret;
        const intentType = startPayload?.intentType; // "payment" | "setup" | "both"

        // Determine which client secret to use and what mode
        let clientSecretToUse: string | undefined;
        let modeToUse: "payment" | "setup" = "setup";
        let amountToUse: number | undefined;

        if (intentType === "payment" || (intentType === "both" && paymentIntentSecret)) {
          // Use PaymentIntent for immediate charge (down payment or first charge)
          clientSecretToUse = paymentIntentSecret || primaryClientSecret;
          modeToUse = "payment";
          // Use server preview total for amount (in minor units)
          const curr = (serverPricePreview?.currency || selectedItem.currency || "USD").toLowerCase();
          const amountMajor = serverPricePreview?.total ?? (A_INST?.amounts.downPaymentMajor ?? A_SUB?.amounts.periodAmountMajor ?? 0);
          amountToUse = toMinor(amountMajor, curr);
        } else if (intentType === "setup" || setupIntentSecret) {
          // Use SetupIntent for card-on-file (no immediate charge)
          clientSecretToUse = setupIntentSecret || primaryClientSecret;
          modeToUse = "setup";
          amountToUse = undefined;
        } else {
          // Fallback to primary client secret
          clientSecretToUse = primaryClientSecret;
        }

        if (!clientSecretToUse || !String(clientSecretToUse).includes("_secret_")) {
          throw new Error("Invalid payment intent response from server");
        }

        setClientSecret(clientSecretToUse);
        setMode(modeToUse);
        setCurrency((serverPricePreview?.currency || selectedItem.currency || "USD").toUpperCase());
        setAmountMinor(amountToUse);
        
        // Store billing flow state for handling "both" intent type
        setBillingFlowState({
          isBillingFlow: true,
          setupIntentSecret: setupIntentSecret,
          paymentIntentSecret: paymentIntentSecret,
          intentType: intentType,
        });
        
        if (modeToUse === "payment") {
          toast.success("Complete your payment to continue");
        } else {
          toast.success("Add a payment method to continue");
        }
        return;
      }
    } catch (e: any) {
      safeConsole.error(e);
      setError(e?.message || "Unable to start checkout");
      toast.error(e?.message || "Unable to start checkout");
    } finally {
      setBusy(false);
    }
  };

  // Public handler used by the primary button
  const startCheckout = () => {
    if (needsBooking && !bookingSatisfied) {
      openBookingModal();
      return;
    }
    beginCheckout();
  };

  /* After SetupIntent succeeds (billing only) */
  const handleSetupSuccess = async (_setupIntentId: string) => {
    if (!A_INST && !A_SUB) return;
    const token = getTokenFromCookies();

    try {
      const CONFIRM = (A_INST ?? A_SUB)!.requests[1];
      const user = CONFIRM.body.user;
      const quoteId = serverPricePreview?.quoteId;

      if (!quoteId) {
        throw new Error("Missing quote from price preview");
      }

      let resp: any;
      if (A_SUB) {
        // Subscription confirm
        resp = await PaymentService.confirmSubscription(
          { user, quoteId, setupIntentId: _setupIntentId },
          token || ""
        );
      } else {
        // Installments confirm
        resp = await PaymentService.confirmInstallments(
          { user, quoteId, setupIntentId: _setupIntentId },
          token || ""
        );
      }

      const out: any = resp?.data;
      const ok =
        typeof out?.ok === "boolean"
          ? out.ok
          : typeof out?.success === "boolean"
          ? out.success
          : false;

      // Check if there's a clientSecret in the response (for down payment)
      if (out?.clientSecret && out?.clientSecret.includes("_secret_")) {
        // Handle payment required
        setClientSecret(out.clientSecret);
        setMode("payment");
        setCurrency((selectedItem?.currency || "USD").toUpperCase());
        // Amount would need to be calculated from the response
        toast.success("Payment required to activate plan");
        return;
      }

      if (!ok)
        throw new Error(
          out?.message || out?.error || "Failed to finalize billing"
        );

      toast.success(
        A_INST ? "Installment plan activated" : "Subscription started"
      );
      if (selectedItem) removeFromCart(selectedItem.id);
      router.push("/dashboard");
    } catch (e: any) {
      safeConsole.error(e);
      setError(e?.message || "Failed to finalize");
      toast.error(e?.message || "Failed to finalize");
    }
  };

  /* After PaymentIntent succeeds (one-time or billing down payment) */
  const handlePaymentSuccess = async () => {
    // If this is a billing flow with "both" intent type, proceed with setup after payment
    if (billingFlowState?.isBillingFlow && billingFlowState?.intentType === "both" && billingFlowState?.setupIntentSecret) {
      // Switch to setup mode for recurring installments
      setClientSecret(billingFlowState.setupIntentSecret);
      setMode("setup");
      setAmountMinor(undefined);
      setBillingFlowState(null); // Clear state to avoid loops
      toast.success("Down payment completed. Please confirm payment method for installments.");
      return;
    }
    
    // For one-time payments or billing flows that don't need setup, complete checkout
    if (selectedItem) removeFromCart(selectedItem.id);
    setShowSuccessModal(true);
    // Auto-redirect after 3 seconds
    setTimeout(() => {
      router.push("/dashboard/bookings");
    }, 3000);
  };

  const handleClose = () => {
    setClientSecret(null);
    setMode(null);
    setAmountMinor(undefined);
    setBillingFlowState(null);
  };

  /* Guards */
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle>Sign in required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Please log in to complete your purchase.
            </p>
            <div className="mt-4">
              <Button onClick={() => router.push("/login?redirect=/checkout")}>
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (!selectedItem || !action) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle>Nothing to checkout</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Go back to your cart and choose an item to purchase.
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => router.push("/cart")}>
                Back to Cart
              </Button>
              <Button onClick={() => router.push("/pricing")}>
                Browse Catalog
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      ` }} />
      <div className="mt-[5rem] px-4 py-10 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Details & Stripe */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Checkout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {selectedItem.title || "Product"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {selectedItem.description}
                  </p>

                  {/* Server price preview (informational) */}
                  {serverPricePreview && (
                    <div className="mt-3 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-[10px] p-3">
                      <div className="flex items-center justify-between">
                        <span>Subtotal</span>
                        <span className="font-medium">
                          {formatCurrency(
                            serverPricePreview.subtotal,
                            serverPricePreview.currency
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>VAT</span>
                        <span className="font-medium">
                          {formatCurrency(
                            serverPricePreview.vat,
                            serverPricePreview.currency
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Total</span>
                        <span className="font-semibold">
                          {formatCurrency(
                            serverPricePreview.total,
                            serverPricePreview.currency
                          )}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Server installments preview summary */}
                  {serverInstallmentsPreview && (
                    <div className="mt-3 text-xs text-gray-600 bg-blue-50 border border-blue-100 rounded-[10px] p-3">
                      <div className="flex items-center justify-between">
                        <span>Down payment</span>
                        <span className="font-medium">
                          {formatCurrency(
                            serverInstallmentsPreview.downPayment,
                            selectedItem.currency
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>
                          {serverInstallmentsPreview.plan?.count || 0} payments of
                        </span>
                        <span className="font-medium">
                          {formatCurrency(
                            serverInstallmentsPreview.installments?.[0] || 0,
                            selectedItem.currency
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Total financed</span>
                        <span className="font-semibold">
                          {formatCurrency(
                            serverInstallmentsPreview.total,
                            selectedItem.currency
                          )}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 text-xs text-gray-600">
                    {A_INST && (
                      <p>
                        Due today:{" "}
                        <strong>
                          {formatCurrency(dueTodayMajor, selectedItem.currency)}
                        </strong>
                        . Future payments will be charged automatically
                        according to your plan.
                      </p>
                    )}
                    {A_SUB && (
                      <p>
                        {(A_SUB.requests?.[1] as any)?.body?.pricing
                          ?.trialDays ? (
                          <>
                            Trial active, nothing due today. Your subscription
                            renews{" "}
                            {(A_SUB.requests?.[1] as any)?.body?.pricing
                              ?.intervalCount || 1}{" "}
                            {
                              (A_SUB.requests?.[1] as any)?.body?.pricing
                                ?.interval
                            }
                            (s) at{" "}
                            {formatCurrency(
                              serverPricePreview?.total || A_SUB.amounts.periodAmountMajor,
                              selectedItem.currency
                            )}
                            .
                          </>
                        ) : (
                          <>
                            Due today:{" "}
                            <strong>
                              {formatCurrency(
                                dueTodayMajor,
                                selectedItem.currency
                              )}
                            </strong>
                            {A_SUB.amounts.setupFeeMajor
                              ? ` (includes setup fee ${formatCurrency(
                                  A_SUB.amounts.setupFeeMajor,
                                  selectedItem.currency
                                )})`
                              : ""}
                            .
                          </>
                        )}
                      </p>
                    )}
                    {A_PAYMENT && (
                      <p>
                        Due today:{" "}
                        <strong>
                          {formatCurrency(dueTodayMajor, selectedItem.currency)}
                        </strong>
                        .
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {!clientSecret && (
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/cart")}
                  >
                    Back to Cart
                  </Button>
                  <Button
                    onClick={startCheckout}
                    disabled={busy}
                    className="w-48 bg-[#0D1140] hover:bg-blue-700 text-white text-base py-3 px-6 rounded-[10px] font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <CreditCard size={20} className="mr-2" />
                    {busy
                      ? "Preparing…"
                      : A_INST || A_SUB
                      ? "Continue"
                      : "Pay Now"}
                  </Button>
                </div>
              )}

              {clientSecret && (
                <div className="mt-4">
                  {error && (
                    <div className="mb-3 text-sm text-red-600 bg-red-50 rounded p-2">
                      {error}
                    </div>
                  )}
                  <StripePaymentForm
                    mode={mode === "setup" ? "setup" : "payment"}
                    clientSecret={clientSecret}
                    amount={mode === "payment" ? amountMinor : undefined}
                    currency={(currency || "USD").toUpperCase()}
                    onSuccess={handlePaymentSuccess}
                    onSetupSuccess={handleSetupSuccess}
                    onError={(e) => setError(e)}
                    onClose={handleClose}
                    productName={selectedItem.title || "Product"}
                    bookingId={undefined}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Item</span>
                <span className="font-medium text-right max-w-[60%] line-clamp-2">
                  {selectedItem.title || "Product"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Billing</span>
                <span className="font-medium capitalize">
                  {selectedMode?.replace("_", " ")}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Due today</span>
                <span className="text-base font-semibold">
                  {formatCurrency(dueTodayMajor, selectedItem.currency)}
                </span>
              </div>

              {A_INST && serverInstallmentsPreview && (
                <div className="text-xs text-gray-600">
                  Future installments:{" "}
                  {serverInstallmentsPreview.plan?.count || 0} ×{" "}
                  {formatCurrency(
                    serverInstallmentsPreview.installments?.[0] || 0,
                    selectedItem.currency
                  )}{" "}
                  every{" "}
                  {serverInstallmentsPreview.plan?.intervalCount || 1}{" "}
                  {serverInstallmentsPreview.plan?.interval || "month"}
                  {(serverInstallmentsPreview.plan?.intervalCount || 1) !== 1
                    ? "s"
                    : ""}
                </div>
              )}
              {A_SUB && (
                <div className="text-xs text-gray-600">
                  Then{" "}
                  {formatCurrency(
                    serverPricePreview?.total || A_SUB.amounts.periodAmountMajor,
                    selectedItem.currency
                  )}{" "}
                  every{" "}
                  {(A_SUB.requests?.[1] as any)?.body?.pricing?.intervalCount ||
                    1}{" "}
                  {(A_SUB.requests?.[1] as any)?.body?.pricing?.interval}(s)
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[12px] shadow-xl max-w-md w-full p-8 text-center transform transition-all animate-in zoom-in-95 duration-300">
            {/* Animated Checkmark */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center transform transition-all duration-500" style={{ animation: "scaleIn 0.5s ease-out forwards" }}>
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                {/* Animated circle pulse */}
                <div className="absolute inset-0 rounded-full border-4 border-green-600 opacity-0 animate-ping"></div>
                <div className="absolute inset-0 rounded-full border-4 border-green-300 opacity-0 animate-ping" style={{ animationDelay: "0.5s", animationDuration: "1.5s" }}></div>
              </div>
            </div>

            {/* Success Message */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-2">
              Thank you for your purchase.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Redirecting you to your dashboard...
            </p>

            {/* Loading indicator */}
            <div className="flex justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[10px] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Additional Booking Details
                </h2>
                <button
                  onClick={closeBookingModal}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close booking details"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Notes{" "}
                    <span className="ml-1 text-gray-500">
                      ({selectedItem?.requiresBooking ? "Required" : "Optional"}
                      )
                    </span>
                  </label>
                  <textarea
                    value={bookingFormData.userNotes}
                    onChange={(e) =>
                      setBookingFormData((p) => ({
                        ...p,
                        userNotes: e.target.value,
                      }))
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent ${
                      selectedItem?.requiresBooking &&
                      bookingFormData.userNotes.trim().length === 0
                        ? "border-red-400 focus:ring-red-300"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    rows={4}
                    placeholder="Any special requirements, questions, or additional information..."
                  />
                  {selectedItem?.requiresBooking &&
                    bookingFormData.userNotes.trim().length === 0 && (
                      <p className="mt-1 text-xs text-red-600">
                        Please provide notes for this booking.
                      </p>
                    )}
                </div>

                {/* Attachments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachments{" "}
                    <span className="ml-1 text-gray-500">
                      (
                      {selectedItem?.isAttachmentRequired
                        ? "Required"
                        : "Optional"}
                      )
                    </span>
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-[10px] p-6 text-center ${
                      selectedItem?.isAttachmentRequired &&
                      bookingFormData.attachments.length === 0
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                  >
                    <input
                      type="file"
                      id="attachment-upload"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        files.forEach((file) => handleAttachmentUpload(file));
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="attachment-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Click to upload files or drag and drop
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        PDF, DOC, DOCX, TXT, JPG, PNG
                      </span>
                    </label>
                  </div>

                  {selectedItem?.isAttachmentRequired &&
                    bookingFormData.attachments.length === 0 && (
                      <p className="mt-1 text-xs text-red-600">
                        At least one attachment is required.
                      </p>
                    )}

                  {bookingFormData.attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {bookingFormData.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
                        >
                          <span className="text-sm text-gray-700 truncate">
                            {attachment.split("/").pop()}
                          </span>
                          <button
                            onClick={() => removeAttachment(index)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Remove attachment"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {isUploadingAttachment && (
                    <div className="mt-2 flex items-center text-sm text-blue-600">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Uploading...
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <Button
                  variant="outline"
                  onClick={closeBookingModal}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={applyBookingAndProceed}
                  disabled={!canContinue || isUploadingAttachment}
                  className={`px-6 ${
                    !canContinue || isUploadingAttachment
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isUploadingAttachment ? "Uploading…" : "Continue to Payment"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
