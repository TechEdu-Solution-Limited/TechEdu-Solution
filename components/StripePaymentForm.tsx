// /components/StripePaymentForm.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CreditCard,
  Lock,
  AlertCircle,
  CheckCircle,
  Shield,
  Zap,
  X,
  ChevronRight,
} from "lucide-react";
import { safeConsole } from "@/lib/console";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE;
const stripeAccountId = process.env.NEXT_PUBLIC_STRIPE_ACCOUNT_ID;

if (!stripePublishableKey)
  safeConsole.error("NEXT_PUBLIC_STRIPE_PUBLISHABLE is not set");
if (stripePublishableKey && !stripePublishableKey.startsWith("pk_")) {
  safeConsole.error(
    "Invalid Stripe publishable key format:",
    stripePublishableKey.substring(0, 20) + "…"
  );
}

console.log("🔍 [StripePaymentForm] Stripe Configuration:", {
  publishableKey: stripePublishableKey
    ? `${stripePublishableKey.slice(0, 20)}...`
    : "undefined",
  stripeAccountId: stripeAccountId || "undefined",
  isTestMode: stripePublishableKey?.startsWith("pk_test_"),
  hasAccountId: !!stripeAccountId,
});

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
const toMajor = (minor: number, currency: string) =>
  ZERO_DECIMAL.has((currency || "USD").toUpperCase()) ? minor : minor / 100;

/* ================= Inner PaymentForm ================= */

interface PaymentFormProps {
  clientSecret: string;
  mode?: "payment" | "setup" | "auto";
  amount?: number; // required if mode="payment"
  currency?: string; // required if mode="payment"
  onSuccess: () => void;
  onSetupSuccess?: (setupIntentId: string) => void;
  onError: (error: string) => void;
  onClose?: () => void;
  productName?: string;
  bookingId?: string | null;
  /** NEW: should this component redirect after a successful PaymentIntent? */
  redirectOnSuccess?: boolean;
}

function PaymentForm({
  clientSecret,
  mode = "auto",
  amount,
  currency,
  onSuccess,
  onSetupSuccess,
  onError,
  onClose,
  productName = "Course",
  bookingId,
  redirectOnSuccess = true,
}: PaymentFormProps) {
  const inferredIsPayment = clientSecret?.startsWith("pi_");
  const inferredIsSetup = clientSecret?.startsWith("seti_");
  const isPayment =
    mode === "payment" || (mode === "auto" && inferredIsPayment);
  const isSetup = mode === "setup" || (mode === "auto" && inferredIsSetup);

  const stripe = useStripe();
  const elements = useElements();

  safeConsole.debug(
    "[stripe] Using publishable key:",
    (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE || "").slice(0, 10),
    "… (test? ->",
    (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE || "").startsWith(
      "pk_test_"
    ),
    ")"
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successUI, setSuccessUI] = useState(false);
  const [cardComplete, setCardComplete] = useState({
    number: false,
    expiry: false,
    cvc: false,
  });

    // 🔁 Reset UI whenever we switch between PaymentIntent and SetupIntent
    useEffect(() => {
      setSuccessUI(false);
      setIsProcessing(false);
      setError(null);
  
      // Optional: log stage change
      safeConsole.log("🔄 [StripePaymentForm] Stage reset for new intent", {
        mode,
        hasClientSecret: !!clientSecret,
        clientSecretPrefix: clientSecret?.slice(0, 7),
      });
    }, [clientSecret, mode]);
  

  const handleCardChange =
    (field: "number" | "expiry" | "cvc") => (event: any) => {
      setCardComplete((prev) => ({ ...prev, [field]: event.complete }));
      if (error) setError(null);
    };

  const isFormComplete =
    cardComplete.number && cardComplete.expiry && cardComplete.cvc;

  const cardElementStyle = {
    style: {
      base: {
        fontSize: "16px",
        color: "#374151",
        fontFamily: "Inter, system-ui, sans-serif",
        "::placeholder": { color: "#9CA3AF" },
        ":-webkit-autofill": { color: "#374151" },
      },
      invalid: { color: "#DC2626" },
    },
  } as const;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const hasSecretPart = clientSecret && clientSecret.includes("_secret_");
    const looksLikePI = clientSecret?.startsWith("pi_");
    const looksLikeSI = clientSecret?.startsWith("seti_");

    if (!clientSecret || clientSecret.length < 50 || !hasSecretPart) {
      setError("Invalid client secret. Please try again.");
      return;
    }
    if (isPayment && !looksLikePI) {
      setError("Invalid payment intent. Please try again.");
      return;
    }
    if (isSetup && !looksLikeSI) {
      setError("Invalid setup intent. Please try again.");
      return;
    }
    if (isPayment && (amount == null || !currency)) {
      setError("Missing amount or currency for payment.");
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      setError("Card number input not ready");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { paymentMethod, error: pmError } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardNumberElement,
          billing_details: { name: "", email: "" },
        });
      if (pmError) {
        const message = pmError.message || "Card error";
        setError(message);
        setIsProcessing(false);
        return;
      }

      if (isPayment) {
        safeConsole.log(
          "🔍 [StripePaymentForm] Starting Payment Confirmation:",
          {
            clientSecret: clientSecret
              ? `${clientSecret.slice(0, 20)}...`
              : "undefined",
            paymentMethodId: paymentMethod?.id,
            amount,
            currency,
            productName,
            bookingId,
            stripeAccountId: stripeAccountId || "undefined",
          }
        );

        const { error: submitError, paymentIntent } =
          await stripe.confirmCardPayment(clientSecret, {
            payment_method: paymentMethod!.id,
            // return_url used by Stripe only for redirect-based flows (3DS etc.)
            return_url: `${
              window.location.origin
            }/payment-success?amount=${toMajor(
              amount!,
              currency!
            )}&currency=${currency}&product_name=${encodeURIComponent(
              productName
            )}&redirect_status=return${
              bookingId ? `&bookingId=${bookingId}` : ""
            }`,
          });

        safeConsole.log("🔍 [StripePaymentForm] Payment Confirmation Result:", {
          submitError,
          paymentIntent: paymentIntent
            ? {
                id: paymentIntent.id,
                status: paymentIntent.status,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
              }
            : null,
        });

        if (submitError) {
          safeConsole.error(
            "❌ [StripePaymentForm] Payment Confirmation Error:",
            {
              error: submitError,
              code: submitError.code,
              message: submitError.message,
              type: submitError.type,
              clientSecret: clientSecret
                ? `${clientSecret.slice(0, 20)}...`
                : "undefined",
              stripeAccountId: stripeAccountId || "undefined",
            }
          );
          const message =
            process.env.NODE_ENV === "production"
              ? "Something went wrong"
              : submitError.message || "Payment failed";
          setError(message);
          onError(message);
          setIsProcessing(false);
          return;
        }

        if (paymentIntent?.status === "succeeded") {
          safeConsole.log("✅ [StripePaymentForm] Payment Succeeded:", {
            paymentIntentId: paymentIntent.id,
            status: paymentIntent.status,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            productName,
            bookingId,
          });
          setSuccessUI(true);
          onSuccess();

          if (redirectOnSuccess) {
            const successUrl = `/payment-success?payment_intent=${
              paymentIntent.id
            }&amount=${toMajor(
              amount!,
              currency!
            )}&currency=${currency}&product_name=${encodeURIComponent(
              productName
            )}&redirect_status=succeeded&payment_method=${paymentMethod!.id}${
              bookingId ? `&bookingId=${bookingId}` : ""
            }`;
            safeConsole.log(
              "🔍 [StripePaymentForm] Redirecting to success URL:",
              successUrl
            );
            window.location.href = successUrl;
          }

          setIsProcessing(false);
          return;
        }

        if (paymentIntent?.status === "requires_action") {
          // 3DS or other next actions will be handled by Stripe (modal/redirect)
          setIsProcessing(false);
          return;
        }

        if (paymentIntent?.status === "processing") {
          setSuccessUI(true);
          onSuccess();

          if (redirectOnSuccess) {
            const processingUrl = `/payment-success?payment_intent=${
              paymentIntent.id
            }&amount=${toMajor(
              amount!,
              currency!
            )}&currency=${currency}&product_name=${encodeURIComponent(
              productName
            )}&redirect_status=processing&payment_method=${
              paymentMethod!.id
            }${bookingId ? `&bookingId=${bookingId}` : ""}`;
            window.location.href = processingUrl;
          }

          setIsProcessing(false);
          return;
        }

        const message =
          process.env.NODE_ENV === "production"
            ? "Something went wrong"
            : `Payment status: ${paymentIntent?.status || "unknown"}`;
        setError(message);
        onError(message);
        setIsProcessing(false);
        return;
      }

      // SetupIntent (card-on-file)
      const { error: setupErr, setupIntent } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: paymentMethod!.id,
          return_url: `${window.location.origin}/billing-complete`,
        }
      );

      if (setupErr) {
        const message =
          process.env.NODE_ENV === "production"
            ? "Something went wrong"
            : setupErr.message || "Setup failed";
        setError(message);
        onError(message);
        setIsProcessing(false);
        return;
      }

      if (
        setupIntent?.status === "succeeded" ||
        setupIntent?.status === "processing"
      ) {
        safeConsole.log("✅ [StripePaymentForm] SetupIntent succeeded", {
          setupIntentId: setupIntent.id,
          status: setupIntent.status,
        });
        setSuccessUI(true);
        onSetupSuccess?.(setupIntent.id);
        setIsProcessing(false);
        return;
      }

      if (setupIntent?.status === "requires_action") {
        setIsProcessing(false);
        return;
      }

      const message =
        process.env.NODE_ENV === "production"
          ? "Something went wrong"
          : `Setup status: ${setupIntent?.status || "unknown"}`;
      setError(message);
      onError(message);
      setIsProcessing(false);
    } catch (err: any) {
      const message =
        err?.message || "An unexpected error occurred. Please try again.";
      setError(message);
      onError(message);
      setIsProcessing(false);
    }
  };

  const payCta =
    isPayment && amount != null && currency
      ? `Pay ${new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency.toUpperCase(),
        }).format(toMajor(amount, currency))}`
      : "Set up payment method";

  return (
    <div className="relative">
      {onClose && (
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Back to checkout"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      )}

      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
          <Shield className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isPayment ? "Secure Payment" : "Secure Billing Setup"}
        </h2>
        <p className="text-gray-600">
          {isPayment
            ? `Complete your purchase for ${productName}`
            : `Add a payment method for ${productName}`}
        </p>
      </div>

      {isPayment && amount != null && currency && (
        <div className="bg-gray-50 rounded-[12px] p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">
              Order Summary
            </span>
            <Badge variant="secondary" className="text-xs">
              Secure
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: currency.toUpperCase(),
                }).format(toMajor(amount, currency))}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Processing Fee</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-green-600">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: currency.toUpperCase(),
                  }).format(toMajor(amount, currency))}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSetup && (
        <div className="bg-blue-50 rounded-[12px] p-4 mb-6 border border-blue-200">
          <p className="text-sm text-blue-800">
            You’re adding a payment method. You may be charged later according
            to your plan.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Payment Method
            </label>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <div className="relative">
                <div className="border-2 border-gray-200 rounded-[12px] p-4 bg-white hover:border-blue-300 focus-within:border-blue-500 transition-colors">
                  <CardNumberElement
                    options={{ style: cardElementStyle.style }}
                    onChange={handleCardChange("number")}
                  />
                </div>
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-2">
                    <img src="/icons/visa.png" alt="Visa" className="w-8 h-7" />
                    <img
                      src="/icons/mastercard.png"
                      alt="Mastercard"
                      className="w-8 h-7"
                    />
                    <img src="/icons/amex.png" alt="AMEX" className="w-8 h-7" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <div className="border-2 border-gray-200 rounded-[12px] p-4 bg-white hover:border-blue-300 focus-within:border-blue-500 transition-colors">
                  <CardExpiryElement
                    options={{ style: cardElementStyle.style }}
                    onChange={handleCardChange("expiry")}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVC
                </label>
                <div className="border-2 border-gray-200 rounded-[12px] p-4 bg-white hover:border-blue-300 focus-within:border-blue-500 transition-colors">
                  <CardCvcElement
                    options={{ style: cardElementStyle.style }}
                    onChange={handleCardChange("cvc")}
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-[12px]">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-6 py-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Lock className="w-4 h-4" />
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Shield className="w-4 h-4" />
              <span>PCI Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Zap className="w-4 h-4" />
              <span>Instant</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            type="submit"
            disabled={!stripe || isProcessing || !isFormComplete || successUI}
            className={`w-full py-4 rounded-[12px] font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              successUI
                ? "bg-green-600 hover:bg-green-600"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            } text-white`}
          >
            {successUI ? (
              <div className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 mr-3" />
                <span>
                  {isPayment ? "Payment Successful!" : "Setup Complete!"}
                </span>
              </div>
            ) : isProcessing ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                <span>
                  {isPayment ? "Processing Payment..." : "Saving Card..."}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <CreditCard className="w-5 h-5 mr-3" />
                <span>{payCta}</span>
                <ChevronRight className="w-5 h-5 ml-2" />
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

/* =============== Exported wrapper with dynamic stripeAccount =============== */

interface StripePaymentFormProps {
  clientSecret: string;
  mode?: "payment" | "setup" | "auto";
  amount?: number;
  currency?: string;
  onSuccess: () => void;
  onSetupSuccess?: (setupIntentId: string) => void;
  onError: (error: string) => void;
  onClose?: () => void;
  productName?: string;
  bookingId?: string | null;
  /** Only for Connect flows */
  stripeAccountId?: string;
  /** Whether to redirect to /payment-success after PI success */
  redirectOnSuccess?: boolean;
}

export default function StripePaymentForm({
  clientSecret,
  mode = "auto",
  amount,
  currency,
  onSuccess,
  onSetupSuccess,
  onError,
  onClose,
  productName,
  bookingId,
  stripeAccountId,
  redirectOnSuccess = true,
}: StripePaymentFormProps) {
  const elementsStripe = useMemo(() => {
    if (!stripePublishableKey) return null;
    return loadStripe(
      stripePublishableKey,
      stripeAccountId ? { stripeAccount: stripeAccountId } : undefined
    );
  }, [stripeAccountId]);

  if (!elementsStripe) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <Elements stripe={elementsStripe}>
            <PaymentForm
              clientSecret={clientSecret}
              mode={mode}
              amount={amount}
              currency={currency}
              onSuccess={onSuccess}
              onSetupSuccess={onSetupSuccess}
              onError={onError}
              onClose={onClose}
              productName={productName}
              bookingId={bookingId}
              redirectOnSuccess={redirectOnSuccess}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
}
