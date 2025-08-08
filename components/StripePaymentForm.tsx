"use client";

import React, { useState, useEffect } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "react-toastify";

// Validate Stripe publishable key
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE;
const stripeAccountId = process.env.NEXT_PUBLIC_STRIPE_ACCOUNT_ID;

if (!stripePublishableKey) {
  console.error("NEXT_PUBLIC_STRIPE_PUBLISHABLE is not set");
}
if (stripePublishableKey && !stripePublishableKey.startsWith("pk_")) {
  console.error(
    "Invalid Stripe publishable key format:",
    stripePublishableKey.substring(0, 20) + "..."
  );
}

if (!stripeAccountId) {
  console.error("NEXT_PUBLIC_STRIPE_ACCOUNT_ID is not set");
}

const stripePromise = loadStripe(stripePublishableKey!, {
  stripeAccount: stripeAccountId,
});

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  currency: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  onClose?: () => void;
  productName?: string;
}

// Helper function to extract client secret from response
const extractClientSecret = (response: any): string => {
  // Try different possible paths for client secret
  if (response?.data?.data?.clientSecret) {
    return response.data.data.clientSecret;
  }
  if (response?.data?.clientSecret) {
    return response.data.clientSecret;
  }
  if (response?.clientSecret) {
    return response.clientSecret;
  }
  throw new Error("Client secret not found in response");
};

function PaymentForm({
  clientSecret,
  amount,
  currency,
  onSuccess,
  onError,
  onClose,
  productName = "Course",
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [cardComplete, setCardComplete] = useState({
    number: false,
    expiry: false,
    cvc: false,
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    // Validate client secret format
    if (!clientSecret || !clientSecret.startsWith("pi_")) {
      setError("Invalid payment intent. Please try again.");
      return;
    }
    setIsProcessing(true);
    setError(null);

    try {
      // The client secret should be much longer than just the ID
      if (clientSecret.length < 50) {
        console.error("Client secret seems too short - might be just the ID");
        setError("Invalid payment intent format. Please try again.");
        setIsProcessing(false);
        return;
      }
      if (!clientSecret.includes("_secret_")) {
        throw new Error("MISSING secret portion of clientSecret. Aborting.");
      } else {
      }

      const cardNumberElement = elements.getElement(CardNumberElement);

      if (!cardNumberElement) {
        setError("Card number input not ready");
        setIsProcessing(false);
        return;
      }

      // Step 1: Create the payment method
      const { paymentMethod, error: pmError } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardNumberElement,
          billing_details: {
            name: "",
            email: "",
          },
        });

      if (pmError) {
        console.error("createPaymentMethod error:", pmError);
        setError(pmError.message || "Card error");
        setIsProcessing(false);
        return;
      }

      // Step 2: Confirm the payment using the payment method ID
      const { error: submitError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
          return_url: `${
            window.location.origin
          }/payment-success?amount=${amount}&currency=${currency}&product_name=${encodeURIComponent(
            productName
          )}`,
        });

      if (submitError) {
        console.error("Stripe confirmation error:", submitError);
        setError(submitError.message || "Payment failed");
        onError(submitError.message || "Payment failed");
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Set payment successful state and show for 3 seconds
        setPaymentSuccessful(true);
        // Call onSuccess immediately to remove item from cart
        onSuccess();

        // After 3 seconds, redirect to success page with payment details
        setTimeout(() => {
          window.location.href = `/payment-success?payment_intent=${
            paymentIntent.id
          }&amount=${amount}&currency=${currency}&product_name=${encodeURIComponent(
            productName
          )}&redirect_status=succeeded`;
        }, 3000); // 3 seconds to show success state
      } else if (paymentIntent && paymentIntent.status === "requires_action") {
        // Don't set error here as the redirect should handle it
      } else if (paymentIntent && paymentIntent.status === "processing") {
        // Payment is being processed
        // toast.info(
        //   "Payment is being processed. You'll be notified once it's complete."
        // );
        onSuccess();
      } else {
        setError("Payment did not succeed.");
        onError("Payment did not succeed.");
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error("Unexpected error during payment:", error);
      setError(
        error.message || "An unexpected error occurred. Please try again."
      );
      onError(
        error.message || "An unexpected error occurred. Please try again."
      );
      setIsProcessing(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const handleCardChange =
    (field: "number" | "expiry" | "cvc") => (event: any) => {
      setCardComplete((prev) => ({
        ...prev,
        [field]: event.complete,
      }));
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
        "::placeholder": {
          color: "#9CA3AF",
        },
        ":-webkit-autofill": {
          color: "#374151",
        },
      },
      invalid: {
        color: "#DC2626",
      },
    },
  };

  return (
    <div className="relative">
      {/* Header with back button */}
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
          Secure Payment
        </h2>
        <p className="text-gray-600">
          Complete your purchase for {productName}
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
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
              {formatAmount(amount, currency)}
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
                {formatAmount(amount, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Payment Method
            </label>

            {/* Card Number */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <div className="relative">
                <div className="border-2 border-gray-200 rounded-xl p-4 bg-white hover:border-blue-300 focus-within:border-blue-500 transition-colors">
                  <CardNumberElement
                    options={cardElementStyle}
                    onChange={handleCardChange("number")}
                  />
                </div>
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-2">
                    <img src="/icons/visa.png" alt="Visa" className="w-8 h-5" />
                    <img
                      src="/icons/mastercard.png"
                      alt="Mastercard"
                      className="w-8 h-5"
                    />
                    <img src="/icons/amex.png" alt="AMEX" className="w-8 h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Expiry Date and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <div className="border-2 border-gray-200 rounded-xl p-4 bg-white hover:border-blue-300 focus-within:border-blue-500 transition-colors">
                  <CardExpiryElement
                    options={cardElementStyle}
                    onChange={handleCardChange("expiry")}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVC
                </label>
                <div className="border-2 border-gray-200 rounded-xl p-4 bg-white hover:border-blue-300 focus-within:border-blue-500 transition-colors">
                  <CardCvcElement
                    options={cardElementStyle}
                    onChange={handleCardChange("cvc")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Payment Error
                </p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Security Badges */}
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

        {/* Payment Button */}
        <div className="space-y-4">
          <Button
            type="submit"
            disabled={
              !stripe || isProcessing || !isFormComplete || paymentSuccessful
            }
            className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              paymentSuccessful
                ? "bg-green-600 hover:bg-green-600"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            } text-white`}
          >
            {paymentSuccessful ? (
              <div className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 mr-3" />
                <span>Payment Successful!</span>
              </div>
            ) : isProcessing ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                <span>Processing Payment...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <CreditCard className="w-5 h-5 mr-3" />
                <span>Pay {formatAmount(amount, currency)}</span>
                <ChevronRight className="w-5 h-5 ml-2" />
              </div>
            )}
          </Button>

          {/* Trust Indicators */}
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-3">
              🔒 Your payment information is encrypted and secure
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <span>• No recurring charges</span>
              <span>• 30-day guarantee</span>
              <span>• Instant access</span>
            </div>
          </div>
        </div>
      </form>

      {/* Test Mode Indicator */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-sm font-medium text-yellow-800 mb-2">
                Test Mode - Use these test cards:
              </p>
              <div className="grid grid-cols-1 gap-2 text-xs text-yellow-700">
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-yellow-100 px-2 py-1 rounded">
                    4242 4242 4242 4242
                  </span>
                  <span>Visa</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-yellow-100 px-2 py-1 rounded">
                    5555 5555 5555 4444
                  </span>
                  <span>Mastercard</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-yellow-100 px-2 py-1 rounded">
                    3782 822463 10005
                  </span>
                  <span>AMEX</span>
                </div>
                <p className="text-yellow-600 mt-2">
                  Any future date, any 3-digit CVC
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface StripePaymentFormProps {
  clientSecret: string;
  amount: number;
  currency: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  onClose?: () => void;
  productName?: string;
}

export default function StripePaymentForm({
  clientSecret,
  amount,
  currency,
  onSuccess,
  onError,
  onClose,
  productName,
}: StripePaymentFormProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <Elements stripe={stripePromise}>
            <PaymentForm
              clientSecret={clientSecret}
              amount={amount}
              currency={currency}
              onSuccess={onSuccess}
              onError={onError}
              onClose={onClose}
              productName={productName}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
}
