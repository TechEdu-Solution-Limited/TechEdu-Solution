"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Download, ArrowRight, Home, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { useRole } from "@/contexts/RoleContext";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { userData } = useRole();
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Get payment details from URL parameters
    const paymentIntentId = searchParams.get("payment_intent");
    const amount = searchParams.get("amount");
    const currency = searchParams.get("currency");
    const productName = searchParams.get("product_name");
    const redirectStatus = searchParams.get("redirect_status");
    const paymentMethod = searchParams.get("payment_method");

    if (paymentIntentId) {
      // Set payment details based on redirect status
      setPaymentDetails({
        paymentIntentId,
        status: redirectStatus || "unknown",
        amount: amount,
        currency: currency,
        productName: productName ? decodeURIComponent(productName) : null,
        paymentMethod: paymentMethod,
        timestamp: new Date().toISOString(),
      });

      // Show appropriate toast based on status
      if (redirectStatus === "succeeded") {
        toast.success("Payment completed successfully!");
      } else if (redirectStatus === "processing") {
        toast.info(
          "Payment is being processed. You'll be notified once it's complete."
        );
      } else if (redirectStatus === "return") {
        toast.info("Returned from payment process.");
      }
    } else {
      // No payment intent ID - might be a direct visit
      toast.warn("No payment information found.");
      router.push("/");
      return;
    }

    setLoading(false);
  }, [searchParams, router]);

  // Auto-redirect to dashboard after 5 seconds for successful payments
  useEffect(() => {
    // const bookingId = searchParams.get("bookingId");

    if (paymentDetails?.status === "succeeded" && userData?.role) {
      const timer = setTimeout(() => {
        setRedirecting(false);

        // Redirect to the specific booking details page
        router.push(`/dashboard/bookings`);
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [paymentDetails, userData, router, searchParams]);

  const handleContinueToDashboard = () => {
    const bookingId = searchParams.get("bookingId");

    if (bookingId) {
      // Redirect to the specific booking details page
      router.push(`/dashboard/bookings`);
    } else {
      // Fallback to general dashboard
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

  const handleGoHome = () => {
    router.push("/");
  };

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
          {/* Success Header */}
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

          {/* Payment Details Card */}
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

              {paymentDetails?.amount && (
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="text-xl font-bold text-green-600">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: paymentDetails.currency?.toUpperCase() || "USD",
                    }).format(parseInt(paymentDetails.amount) / 100)}
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

          {/* Auto-redirect notification */}
          {paymentDetails?.status === "succeeded" &&
            userData?.role &&
            !redirecting && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="text-center">
                  <p className="text-sm text-blue-700 mb-2">
                    🎉 Payment successful! You'll be redirected to your
                    dashboard in a few seconds...
                  </p>
                  <div className="w-full bg-blue-200 rounded-full h-1">
                    <div
                      className="bg-blue-600 h-1 rounded-full animate-pulse"
                      style={{
                        animation: "progress 5s linear forwards",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

          {/* Processing payment notification */}
          {paymentDetails?.status === "processing" && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
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

          {/* Return from payment notification */}
          {paymentDetails?.status === "return" && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="text-center">
                <p className="text-sm text-blue-700 mb-2">
                  🔄 You've returned from the payment process.
                </p>
                <p className="text-xs text-blue-600">
                  Please check your email for payment confirmation or contact
                  support if you have any questions.
                </p>
              </div>
            </div>
          )}

          {/* Redirecting state */}
          {redirecting && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="text-center">
                <p className="text-sm text-green-700">
                  Redirecting to your dashboard...
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
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
              onClick={handleGoHome}
              variant="ghost"
              className="py-3"
              disabled={redirecting}
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Support Info */}
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
