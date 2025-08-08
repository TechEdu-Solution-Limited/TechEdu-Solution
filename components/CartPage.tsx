"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useRole } from "@/contexts/RoleContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Clock,
  Award,
  ArrowLeft,
  CreditCard,
  Lock,
  User,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import { postApiRequest, registerUser, loginUser } from "@/lib/apiFetch";
import { Input } from "@/components/ui/input";
import {
  getTokenFromCookies,
  saveTokenToCookies,
  saveUserDataToCookies,
} from "@/lib/cookies";
import StripePaymentForm from "@/components/StripePaymentForm";
import { PaymentService } from "@/lib/api/paymentService";
import type { CreatePaymentIntentRequest } from "@/types/payment";
import { CartItem } from "@/types/cart";

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart, cartTotal, cartCount } =
    useCart();
  const {
    isAuthenticated,
    userData,
    refreshAuth,
    setUserData,
    setIsAuthenticated,
    setUserRole,
  } = useRole();
  const isStudent = userData?.role === "student";
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  // Inline auth state
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(false);

  // Inline Stripe payment state
  const [selectedCheckoutItemId, setSelectedCheckoutItemId] = useState<
    string | null
  >(null);
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(
    null
  );
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmountCents, setPaymentAmountCents] = useState<number | null>(
    null
  );
  const [paymentCurrency, setPaymentCurrency] = useState<string>("gbp");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  // Helper function to check if user can purchase a product type
  const canPurchaseProductType = (productType: string) => {
    if (!isAuthenticated) return false;

    if (productType === "Academic Support Services") {
      return userData?.role === "student";
    } else if (productType === "Training & Certification") {
      return (
        userData?.role === "individualTechProfessional" ||
        userData?.role === "teamTechProfessional"
      );
    }

    return true; // Allow other product types for now
  };

  // Helper function to get role restriction message
  const getRoleRestrictionMessage = (productType: string) => {
    if (productType === "Academic Support Services") {
      return "Only students can purchase Academic Support Services";
    } else if (productType === "Training & Certification") {
      return "Only tech professionals can purchase Training & Certification";
    }
    return "";
  };

  const handleRemoveItem = (itemId: string, itemTitle: string) => {
    removeFromCart(itemId);
    toast.success(`${itemTitle} removed from cart`);
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Cart cleared");
  };

  // Compute total for a single item: price + 20% VAT + £2.99 fee
  const computeItemTotal = (price: number) => price + price * 0.2 + 2.99;

  // Initialize Stripe payment inline on the cart page
  const handleProductCheckout = async (productId: string) => {
    try {
      if (!isAuthenticated) {
        const redirectUrl = encodeURIComponent(`/cart`);
        window.location.href = `/login?redirect=${redirectUrl}`;
        return;
      }

      const item = cartItems.find((ci) => ci.id === productId);
      if (!item) {
        toast.error("Item not found in cart");
        return;
      }

      setSelectedCheckoutItemId(productId);
      setIsInitializingPayment(true);
      setPaymentError(null);

      const token = getTokenFromCookies();
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      const amountCents = Math.round((item.price || 0) * 100);

      const paymentData: CreatePaymentIntentRequest = {
        amount: amountCents,
        currency: "gbp",
        productId: item.id,
        productType: (item.productType ||
          "Training & Certification") as CreatePaymentIntentRequest["productType"],
        bookingService: item.title,
        platformRole: (userData?.role ||
          "student") as CreatePaymentIntentRequest["platformRole"],
        isSession: item.hasSession || false,
        isClassroom: item.hasClassroom || false,
        profileId: (userData as any)?.id || (userData as any)?._id,
      };

      const response = await PaymentService.createPaymentIntent(
        paymentData,
        token
      );
      if (!response || !response.data?.success) {
        throw new Error(
          response?.data?.message || "Failed to create payment intent"
        );
      }

      const secret = response.data?.data?.clientSecret;
      if (!secret || !secret.includes("_secret_")) {
        throw new Error("Invalid payment intent response");
      }

      setPaymentClientSecret(secret);
      setPaymentAmountCents(amountCents);
      setPaymentCurrency(paymentData.currency || "gbp");
      setShowPaymentForm(true);
      toast.success("Secure payment initialized");
    } catch (err: any) {
      console.error("Init payment error:", err);
      setPaymentError(err?.message || "Failed to start payment");
      toast.error(err?.message || "Failed to start payment");
    } finally {
      setIsInitializingPayment(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Remove purchased item from cart and reset UI
    if (selectedCheckoutItemId) {
      removeFromCart(selectedCheckoutItemId);
    }
    setShowPaymentForm(false);
    setPaymentClientSecret(null);
    setSelectedCheckoutItemId(null);
    toast.success("Payment successful!");
    // Optional: redirect to dashboard or success page
    // window.location.href = "/payment-success";
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    toast.error(`Payment failed: ${error}`);
  };

  const handleClosePaymentForm = () => {
    setShowPaymentForm(false);
    setPaymentClientSecret(null);
    setSelectedCheckoutItemId(null);
    setPaymentError(null);
  };

  const handleQuickSignUp = async () => {
    if (!authEmail || !authPassword) {
      setAuthError("Please enter both email and password");
      return;
    }

    setIsAuthLoading(true);
    setAuthError("");

    try {
      const response = await registerUser({
        fullName: authEmail.split("@")[0], // Use email prefix as fullName
        email: authEmail,
        password: authPassword,
        role: "student",
      });

      if (response.status >= 400) {
        throw new Error(response.data.message || "Registration failed");
      }

      toast.success(
        "Account created successfully! Please check your email to verify your account."
      );
      // Clear form and show success message
      setAuthEmail("");
      setAuthPassword("");
      setAuthError("");
      // Switch to login mode so user can sign in
      setIsLoginMode(true);

      // If registration includes immediate login (some APIs do this), update RoleContext
      if (response.data?.user && response.data?.access_token) {
        const userData = response.data.user;
        const token = response.data.access_token;

        // Save to cookies
        saveTokenToCookies(token);
        saveUserDataToCookies(userData);

        // Update RoleContext immediately
        setUserData(userData);
        setUserRole(userData.role || "student");
        setIsAuthenticated(true);
      }
    } catch (error: any) {
      setAuthError(error.message || "Failed to create account");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    if (!authEmail || !authPassword) {
      setAuthError("Please enter both email and password");
      return;
    }

    setIsAuthLoading(true);
    setAuthError("");

    try {
      const response = await loginUser({
        email: authEmail,
        password: authPassword,
      });

      if (response.status >= 400) {
        throw new Error(response.data.message || "Login failed");
      }

      // Check if the response contains authentication data
      // Try multiple possible token locations in the response
      const possibleTokenPaths = [
        response.data?.token,
        response.data?.accessToken,
        response.data?.data?.token,
        response.data?.data?.accessToken,
        response.data?.access_token,
        response.data?.data?.access_token,
      ];

      const token = possibleTokenPaths.find((t) => t);

      // Try multiple possible user data locations
      const possibleUserPaths = [
        response.data?.user,
        response.data?.userData,
        response.data?.data?.user,
        response.data?.data?.userData,
      ];

      const userData = possibleUserPaths.find((u) => u);

      // Save token and user data to cookies
      if (token) {
        saveTokenToCookies(token);
      }
      if (userData) {
        saveUserDataToCookies(userData);
      }

      // Also save refresh token if available
      if (response.data?.data?.refresh_token) {
      }

      if (!token) {
        console.warn("No token found in login response");
      }

      toast.success("Login successful!");
      // Clear form immediately
      setAuthEmail("");
      setAuthPassword("");
      setAuthError("");

      // Update authentication state directly
      if (token && userData) {
        // Immediately update RoleContext
        setUserData(userData);
        setUserRole(userData.role || "student");
        setIsAuthenticated(true);
      } else {
        // Fallback: try refreshAuth
        try {
          const authUpdated = await refreshAuth();
          if (!authUpdated) {
            console.warn("Auth state refresh failed, reloading page");
            window.location.reload();
          }
        } catch (refreshError) {
          console.error("Error refreshing auth state:", refreshError);
          window.location.reload();
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setAuthError(error.message || "Failed to login");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsAuthLoading(true);
    setAuthError("");

    try {
      // Add redirect parameter to Google sign-in
      const currentUrl = encodeURIComponent("/cart");
      window.location.href = `/api/auth/google?redirect=${currentUrl}`;
    } catch (error: any) {
      setAuthError("Failed to initiate Google sign-in");
      setIsAuthLoading(false);
    }
  };

  // Auto-redirect to dashboard on successful payment
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        window.location.href = "/dashboard";
      }, 5000); // Redirect after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [success]);

  if (cartCount === 0) {
    return (
      <section>
        <div className="min-h-screen bg-gray-50 mt-[3rem] py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              {/* Success/Cancel Messages */}
              {success && (
                <div className="mb-8 bg-green-50 border border-green-200 rounded-[10px] p-4">
                  <div className="flex items-center gap-3 justify-center">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800">
                        Payment Successful!
                      </h3>
                      <p className="text-green-700">
                        Thank you for your purchase. You now have access to your
                        courses. Redirecting to dashboard...
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <Link
                      href="/dashboard"
                      className="text-green-700 hover:text-green-800 underline font-medium"
                    >
                      Go to Dashboard Now
                    </Link>
                  </div>
                </div>
              )}

              {canceled && (
                <div className="mb-8 bg-red-50 border border-red-200 rounded-[10px] p-4">
                  <div className="flex items-center gap-3 justify-center">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-red-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-red-800">
                        Payment Cancelled
                      </h3>
                      <p className="text-red-700">
                        Your payment was cancelled. You can try again or contact
                        support if you need help.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Role-based access warning */}
              {/* {isAuthenticated && (
                <div className="mb-8 bg-blue-50 border border-blue-200 rounded-[10px] p-4">
                  <div className="flex items-center gap-3 justify-center">
                    <AlertCircle className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-blue-800">
                        Role-Based Access Control
                      </h3>
                      <p className="text-blue-700">
                        • Students can purchase Academic Support Services
                        <br />
                        • Tech Professionals can purchase Training &
                        Certification programs
                        <br />
                        <Link
                          href="/dashboard"
                          className="underline text-blue-700"
                        >
                          Go to Dashboard
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              )} */}

              <div className="mb-8">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Your cart is empty
                </h1>
                <p className="text-gray-600 mb-8">
                  Looks like you haven't added any courses to your cart yet.
                </p>
              </div>
              <div className="space-y-4">
                <Link href="/training/catalog">
                  <Button className="bg-[#0D1140] hover:bg-blue-700 text-white px-8 py-3 rounded-[10px]">
                    Browse Courses
                  </Button>
                </Link>
                <div>
                  <Link
                    href="/training/catalog"
                    className="text-[#011F72] hover:underline flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={16} />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-[5rem] md:mt-[4rem] py-8 md:py-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Shopping Cart
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 text-sm md:text-base px-3 md:px-4 py-2"
            >
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Success/Cancel Messages */}
        {success && (
          <div className="mb-4 md:mb-6 bg-green-50 border border-green-200 rounded-[10px] p-3 md:p-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green-800 text-sm md:text-base">
                  Payment Successful!
                </h3>
                <p className="text-green-700 text-xs md:text-sm">
                  Thank you for your purchase. You now have access to your
                  courses.
                </p>
              </div>
            </div>
          </div>
        )}

        {canceled && (
          <div className="mb-4 md:mb-6 bg-red-50 border border-red-200 rounded-[10px] p-3 md:p-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-red-800 text-sm md:text-base">
                  Payment Cancelled
                </h3>
                <p className="text-red-700 text-xs md:text-sm">
                  Your payment was cancelled. You can try again or contact
                  support if you need help.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Role-based access warning in order summary */}
        {isAuthenticated && (
          <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-3 md:p-4 mb-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-blue-800 text-sm md:text-base">
                  Role-Based Access Control
                </h4>
                <p className="text-xs md:text-sm text-blue-700">
                  • Students: Academic Support Services
                  <br />
                  • Tech Professionals: Training & Certification
                  <br />
                  <Link href="/dashboard" className="underline text-blue-700">
                    Go to Dashboard
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                    />
                  </svg>
                  Course Items ({cartCount})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start gap-3 md:gap-4 p-3 md:p-4 border rounded-[10px] hover:bg-gray-50 transition-colors"
                  >
                    <div className="relative w-full sm:w-20 h-32 sm:h-20 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="rounded-[10px] object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-base md:text-lg">
                            {item.title}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2">
                            {item.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 mb-2">
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span>{item.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Award size={14} />
                              <span>
                                {item.certificate
                                  ? "Certificate"
                                  : "No Certificate"}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-1 md:gap-2">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {item.level}
                            </Badge>
                            <Badge
                              variant={
                                canPurchaseProductType(
                                  item.productType || "Training & Certification"
                                )
                                  ? "default"
                                  : "destructive"
                              }
                              className="text-xs"
                            >
                              {item.productType || "Training & Certification"}
                            </Badge>
                          </div>

                          {/* Role restriction warning */}
                          {isAuthenticated &&
                            !canPurchaseProductType(
                              item.productType || "Training & Certification"
                            ) && (
                              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                                <AlertCircle className="w-3 h-3 inline mr-1" />
                                {getRoleRestrictionMessage(
                                  item.productType || "Training & Certification"
                                )}
                              </div>
                            )}
                        </div>

                        <div className="text-right sm:ml-4 w-full sm:w-auto">
                          <p className="font-bold text-lg md:text-xl text-[#011F72] mb-2">
                            {formatCurrency(item.price || 0)}
                          </p>
                          <div className="flex flex-col gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveItem(item.id, item.title)
                              }
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 self-end"
                            >
                              <Trash2 size={16} />
                            </Button>
                            {/* Single-product checkout button */}
                            <Button
                              onClick={() => handleProductCheckout(item.id)}
                              className="w-full bg-[#0D1140] hover:bg-blue-700 text-white text-sm md:text-base py-2 md:py-3"
                              disabled={
                                isInitializingPayment ||
                                !canPurchaseProductType(
                                  item.productType || "Training & Certification"
                                )
                              }
                            >
                              {isInitializingPayment &&
                              selectedCheckoutItemId === item.id ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Checking Out...
                                </>
                              ) : (
                                <>
                                  <CreditCard size={16} className="mr-2" />
                                  {!isAuthenticated
                                    ? "Login to Checkout"
                                    : !canPurchaseProductType(
                                        item.productType ||
                                          "Training & Certification"
                                      )
                                    ? "Role Restricted"
                                    : "Checkout This Course"}
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary (hidden when inline payment is active) */}
          {!showPaymentForm && (
            <div className="lg:col-span-1 order-1 lg:order-2">
              <Card className="sticky top-8 mb-6 lg:mb-0">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  {/* Authentication Status */}
                  {!isAuthenticated && (
                    <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-3 md:p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="w-full">
                          <h4 className="font-medium text-blue-800 mb-2 text-sm md:text-base">
                            {isLoginMode
                              ? "Sign In to Complete Purchase"
                              : "Quick Sign Up to Complete Purchase"}
                          </h4>
                          <p className="text-xs md:text-sm text-blue-700 mb-4">
                            {isLoginMode
                              ? "Sign in to your account to access your courses and track your progress."
                              : "Create an account to access your courses and track your progress."}
                          </p>

                          {/* Inline Auth Form */}
                          <div className="space-y-2 md:space-y-3">
                            <div className="flex flex-col gap-2">
                              <Input
                                type="email"
                                placeholder="Email address"
                                className="flex-1 text-sm md:text-base"
                                value={authEmail}
                                onChange={(e) => setAuthEmail(e.target.value)}
                              />
                              <Input
                                type="password"
                                placeholder="Password"
                                className="flex-1 text-sm md:text-base"
                                value={authPassword}
                                onChange={(e) =>
                                  setAuthPassword(e.target.value)
                                }
                              />
                            </div>

                            <div className="flex flex-col gap-2">
                              <Button
                                className="flex-1 bg-[#0D1140] hover:bg-blue-700 text-white text-sm md:text-base py-2 md:py-3"
                                onClick={
                                  isLoginMode
                                    ? handleQuickLogin
                                    : handleQuickSignUp
                                }
                                disabled={isAuthLoading}
                              >
                                {isAuthLoading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {isLoginMode
                                      ? "Signing In..."
                                      : "Creating Account..."}
                                  </>
                                ) : isLoginMode ? (
                                  "Sign In"
                                ) : (
                                  "Create Account"
                                )}
                              </Button>

                              <Button
                                variant="outline"
                                className="flex-1 border-gray-300 hover:bg-gray-50 text-sm md:text-base py-2 md:py-3"
                                onClick={handleGoogleSignIn}
                                disabled={isAuthLoading}
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                  />
                                  <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                  />
                                  <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                  />
                                  <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                  />
                                </svg>
                                Google
                              </Button>
                            </div>

                            <div className="text-center">
                              <span className="text-xs md:text-sm text-blue-600">
                                {isLoginMode
                                  ? "Don't have an account? "
                                  : "Already have an account? "}
                              </span>
                              <button
                                onClick={() => {
                                  setIsLoginMode(!isLoginMode);
                                  setAuthError("");
                                  setAuthEmail("");
                                  setAuthPassword("");
                                }}
                                className="text-[#011F72] hover:underline text-xs md:text-sm font-medium"
                              >
                                {isLoginMode
                                  ? "Sign up instead"
                                  : "Sign in instead"}
                              </button>
                            </div>

                            {authError && (
                              <div className="text-red-600 text-xs md:text-sm text-center bg-red-50 p-2 rounded">
                                {authError}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {isAuthenticated && (
                    <div className="bg-green-50 border border-green-200 rounded-[10px] p-3 md:p-4 mb-4">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-green-600" />
                        <div>
                          <h4 className="font-medium text-green-800 text-sm md:text-base">
                            Welcome back, {userData.fullName || userData.email}!
                          </h4>
                          <p className="text-xs md:text-sm text-green-700">
                            You're all set to complete your purchase.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 md:space-y-3">
                    <div className="flex justify-between text-xs md:text-sm">
                      <span>Subtotal ({cartCount} items)</span>
                      <span>{formatCurrency(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm">
                      <span>Tax</span>
                      <span>{formatCurrency(cartTotal * 0.2)}</span>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm">
                      <span>Processing Fee</span>
                      <span>{formatCurrency(2.99)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold text-base md:text-lg">
                        <span>Total</span>
                        <span>
                          {formatCurrency(cartTotal + cartTotal * 0.2 + 2.99)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    {/* Remove or disable the main multi-item checkout button */}
                    {/* <Button
                    onClick={handleCheckout}
                    disabled={!isAuthenticated}
                    className={`w-full py-4 rounded-[10px] font-semibold ${
                      isAuthenticated
                        ? "bg-[#0D1140] hover:bg-blue-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <CreditCard size={18} className="mr-2" />
                    {isAuthenticated ? "Proceed to Checkout" : "Checkout"}
                  </Button> */}

                    <div className="flex items-center gap-2 text-xs text-gray-500 justify-center md:justify-start">
                      <Lock size={14} />
                      <span>Secure checkout powered by Stripe</span>
                    </div>
                  </div>

                  <div className="border-t pt-3 md:pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                      What's included:
                    </h4>
                    <ul className="text-xs md:text-sm text-gray-600 space-y-1">
                      <li>• Lifetime access to course content</li>
                      <li>• Certificate upon completion</li>
                      <li>• 30-day money-back guarantee</li>
                      <li>• 24/7 customer support</li>
                    </ul>
                  </div>

                  <div className="text-center pt-2">
                    <Link
                      href="/training/catalog"
                      className="text-[#011F72] hover:underline text-xs md:text-sm"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Inline Stripe Payment Form */}
        {showPaymentForm && paymentClientSecret && selectedCheckoutItemId && (
          <div className="max-w-3xl mx-auto mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Secure Payment</span>
                  <Button variant="outline" onClick={handleClosePaymentForm}>
                    Close
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {paymentError && (
                  <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                    {paymentError}
                  </div>
                )}
                <StripePaymentForm
                  clientSecret={paymentClientSecret}
                  amount={paymentAmountCents ?? 0}
                  currency={paymentCurrency}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  onClose={handleClosePaymentForm}
                  productName={
                    cartItems.find((ci) => ci.id === selectedCheckoutItemId)
                      ?.title || "Course"
                  }
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
