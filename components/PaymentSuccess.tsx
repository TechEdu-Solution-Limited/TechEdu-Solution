"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Download, Home, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { useRole } from "@/contexts/RoleContext";

// --- currency helpers ---
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

const fromMinor = (minor: number, currency: string) =>
  ZERO_DECIMAL.has(currency.toUpperCase()) ? minor : minor / 100;

const formatCurrency = (amountMajor: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase() || "USD",
  }).format(amountMajor);

type PaymentDetails = {
  paymentIntentId: string;
  status: string;
  amountMajor: number | null; // always MAJOR here
  currency: string;
  productName?: string | null;
  paymentMethod?: string | null;
  timestamp: string;
};

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { userData } = useRole();

  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Grab params
    const paymentIntentId = searchParams.get("payment_intent");
    const amountParam = searchParams.get("amount"); // MAJOR units (preferred)
    const amountMinorParam = searchParams.get("amount_minor"); // MINOR units (optional/back-compat)
    const currencyParam = (searchParams.get("currency") || "USD").toUpperCase();
    const productName = searchParams.get("product_name");
    const redirectStatus = searchParams.get("redirect_status");
    const paymentMethod = searchParams.get("payment_method");

    if (!paymentIntentId) {
      toast.warn("No payment information found.");
      router.push("/");
      return;
    }

    // Normalize to MAJOR units for display
    let amountMajor: number | null = null;

    if (amountMinorParam != null) {
      const n = Number(amountMinorParam);
      amountMajor = Number.isFinite(n) ? fromMinor(n, currencyParam) : null;
    } else if (amountParam != null) {
      // amount is already MAJOR in your flow
      const n = Number(amountParam); // use Number/parseFloat, not parseInt
      amountMajor = Number.isFinite(n) ? n : null;
    }

    const details: PaymentDetails = {
      paymentIntentId,
      status: redirectStatus || "unknown",
      amountMajor,
      currency: currencyParam,
      productName: productName ? decodeURIComponent(productName) : null,
      paymentMethod: paymentMethod || undefined,
      timestamp: new Date().toISOString(),
    };

    setPaymentDetails(details);

    // Toasts
    if (redirectStatus === "succeeded") {
      toast.success("Payment completed successfully!");
    } else if (redirectStatus === "processing") {
      toast.info(
        "Payment is being processed. You'll be notified once it's complete."
      );
    } else if (redirectStatus === "return") {
      toast.info("Returned from payment process.");
    }

    setLoading(false);
  }, [searchParams, router]);

  // Auto-redirect after success
  useEffect(() => {
    if (paymentDetails?.status === "succeeded" && userData?.role) {
      const timer = setTimeout(() => {
        setRedirecting(false);
        router.push(`/dashboard/bookings`);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [paymentDetails, userData, router]);

  const handleContinueToDashboard = () => {
    const bookingId = searchParams.get("bookingId");
    if (bookingId) {
      router.push(`/dashboard/bookings`);
    } else {
      router.push("/dashboard");
    }
  };

  const handleViewBookings = () => {
    if (userData?.role) {
      let dashboardPath = "/dashboard";
      if (userData.role === "student") {
        dashboardPath = "/dashboard/student";
      } else if (userData.role === "individualTechProfessional") {
        dashboardPath = "/dashboard/individual-tech-professional";
      } else if (userData.role === "teamTechProfessional") {
        dashboardPath = "/dashboard/team-tech-professional";
      }
      router.push(`${dashboardPath}/booked-services`);
    } else {
      router.push("/dashboard/booked-services");
    }
  };

  const handleGoHome = () => router.push("/");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-32 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                paymentDetails?.status === "succeeded"
                  ? "bg-green-100"
                  : paymentDetails?.status === "processing"
                  ? "bg-yellow-100"
                  : "bg-blue-100"
              }`}
            >
              <CheckCircle
                className={`w-10 h-10 ${
                  paymentDetails?.status === "succeeded"
                    ? "text-green-600"
                    : paymentDetails?.status === "processing"
                    ? "text-yellow-600"
                    : "text-blue-600"
                }`}
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {paymentDetails?.status === "succeeded"
                ? "Payment Successful!"
                : paymentDetails?.status === "processing"
                ? "Payment Processing"
                : "Payment Status"}
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              {paymentDetails?.status === "succeeded"
                ? "Thank you for your purchase. Your booking has been confirmed."
                : paymentDetails?.status === "processing"
                ? "Your payment is being processed. Please wait for confirmation."
                : "Your payment process has been completed."}
            </p>
            {paymentDetails?.productName && (
              <p className="text-gray-500">
                Product:{" "}
                <span className="font-medium">
                  {paymentDetails.productName}
                </span>
              </p>
            )}
          </div>

          {/* Details */}
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Payment ID</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {paymentDetails?.paymentIntentId?.slice(-8)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge
                    className={
                      paymentDetails?.status === "succeeded"
                        ? "bg-green-100 text-green-800"
                        : paymentDetails?.status === "processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }
                  >
                    {paymentDetails?.status}
                  </Badge>
                </div>
              </div>

              {paymentDetails?.amountMajor != null && (
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(
                      paymentDetails.amountMajor,
                      paymentDetails.currency
                    )}
                  </p>
                </div>
              )}

              {paymentDetails?.paymentMethod && (
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {paymentDetails.paymentMethod.slice(-8)}
                  </p>
                </div>
              )}

              {paymentDetails?.timestamp && (
                <div>
                  <p className="text-sm text-gray-500">Transaction Time</p>
                  <p className="text-sm">
                    {new Date(paymentDetails.timestamp).toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notices */}
          {paymentDetails?.status === "succeeded" &&
            userData?.role &&
            !redirecting && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-[12px]">
                <div className="text-center">
                  <p className="text-sm text-blue-700 mb-2">
                    🎉 Payment successful! You'll be redirected to your
                    dashboard in a few seconds...
                  </p>
                  <div className="w-full bg-blue-2 00 rounded-full h-1">
                    <div
                      className="bg-blue-600 h-1 rounded-full animate-pulse"
                      style={{ animation: "progress 5s linear forwards" }}
                    />
                  </div>
                </div>
              </div>
            )}

          {paymentDetails?.status === "processing" && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-[12px]">
              <div className="text-center">
                <p className="text-sm text-yellow-700 mb-2">
                  ⏳ Your payment is being processed. This may take a few
                  minutes.
                </p>
                <p className="text-xs text-yellow-600">
                  You'll receive a confirmation email once the payment is
                  complete.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            {paymentDetails?.status === "succeeded" ? (
              <Button
                onClick={handleContinueToDashboard}
                disabled={redirecting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 disabled:opacity-50"
              >
                <User className="w-5 h-5 mr-2" />
                {redirecting ? "Redirecting..." : "Go to Dashboard Now"}
              </Button>
            ) : (
              <Button
                onClick={handleViewBookings}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                <User className="w-5 h-5 mr-2" />
                View My Bookings
              </Button>
            )}

            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="py-3"
              disabled={redirecting}
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Support */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-2">
              Need help? Contact our support team
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <a
                href="mailto:support@techedusolution.com"
                className="text-blue-600 hover:text-blue-700"
              >
                support@techeduk.com
              </a>
              <span className="text-gray-300">|</span>
              <a href="/contact" className="text-blue-600 hover:text-blue-700">
                Contact Form
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
