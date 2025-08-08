"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { XCircle, RefreshCw, ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState<any>(null);

  useEffect(() => {
    // Get error details from URL parameters
    const paymentIntentId = searchParams.get("payment_intent");
    const redirectStatus = searchParams.get("redirect_status");
    const errorMessage = searchParams.get("error_message");

    if (redirectStatus === "failed") {
      setErrorDetails({
        paymentIntentId,
        status: "failed",
        errorMessage: errorMessage || "Payment processing failed",
        amount: searchParams.get("amount"),
        currency: searchParams.get("currency"),
        productName: searchParams.get("product_name"),
      });
      toast.error("Payment failed. Please try again.");
    }

    setLoading(false);
  }, [searchParams]);

  const handleTryAgain = () => {
    // Go back to the booking page to try again
    router.back();
  };

  const handleGoToBookings = () => {
    router.push("/bookings");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleContactSupport = () => {
    router.push("/contact");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Error Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Failed
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            We couldn't process your payment. Don't worry, you haven't been
            charged.
          </p>
          {errorDetails?.productName && (
            <p className="text-gray-500">
              Product:{" "}
              <span className="font-medium">{errorDetails.productName}</span>
            </p>
          )}
        </div>

        {/* Error Details Card */}
        <Card className="mb-8 shadow-lg border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <CreditCard className="w-5 h-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Payment ID</p>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                  {errorDetails?.paymentIntentId?.slice(-8) || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge className="bg-red-100 text-red-800">
                  {errorDetails?.status}
                </Badge>
              </div>
            </div>
            {errorDetails?.amount && (
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-xl font-bold text-gray-900">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: errorDetails.currency?.toUpperCase() || "USD",
                  }).format(parseInt(errorDetails.amount) / 100)}
                </p>
              </div>
            )}
            {errorDetails?.errorMessage && (
              <div>
                <p className="text-sm text-gray-500">Error Message</p>
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded">
                  {errorDetails.errorMessage}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Common Solutions */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle>What You Can Do</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Check Your Card Details
                </h3>
                <p className="text-gray-600 text-sm">
                  Ensure your card number, expiry date, and CVC are correct.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Verify Your Bank
                </h3>
                <p className="text-gray-600 text-sm">
                  Contact your bank to ensure the transaction isn't being
                  blocked.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Try a Different Card
                </h3>
                <p className="text-gray-600 text-sm">
                  Use a different credit or debit card if available.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleTryAgain}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </Button>
          <Button
            onClick={handleGoToBookings}
            variant="outline"
            className="flex-1 py-3"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Bookings
          </Button>
          <Button onClick={handleGoHome} variant="ghost" className="py-3">
            Go Home
          </Button>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Still having trouble? Our support team is here to help
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <Button
              onClick={handleContactSupport}
              variant="link"
              className="text-blue-600 hover:text-blue-700 p-0 h-auto"
            >
              Contact Support
            </Button>
            <span className="text-gray-300">|</span>
            <a
              href="mailto:support@techeduk.com"
              className="text-blue-600 hover:text-blue-700"
            >
              support@techeduk.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
