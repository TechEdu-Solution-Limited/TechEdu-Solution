"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useRole } from "@/contexts/RoleContext";
import { useProfileData } from "@/hooks/useProfileData";
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
  const {
    getProfileId,
    getUserId,
    profile,
    loading: profileLoading,
    fetchProfile,
  } = useProfileData();
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
      currency: "usd",
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

      if (profileLoading) {
        toast.info("Loading profile data...");
        return;
      }

      if (!profile && fetchProfile) {
        try {
          await fetchProfile();
        } catch (profileError) {
          console.warn(
            "Failed to fetch profile, continuing with fallback:",
            profileError
          );
        }
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

      // Get user and profile IDs with multiple fallback strategies
      const userId =
        getUserId() ||
        (userData as any)?.id ||
        (userData as any)?._id ||
        (userData as any)?.userId;

      // Get profile ID from the profile context
      let profileId: string | null = null;

      if (profile?.profile?._id) {
        profileId = profile.profile._id;
      } else {
        // Fallback to getProfileId() if profile context doesn't have it
        profileId = getProfileId();
      }

      if (!userId) {
        throw new Error("User ID not found. Please refresh your profile.");
      }

      if (!profileId) {
        throw new Error("Profile ID not found. Please refresh your profile.");
      }

      // Ensure profileId is a string at this point
      if (!profileId) {
        throw new Error(
          "Unable to determine profile ID. Please complete your profile setup."
        );
      }

      const amountCents = Math.round((item.price || 0) * 100);

      const paymentData: CreatePaymentIntentRequest = {
        amount: amountCents,
        currency: "usd",
        productId: item.id,
        productType: (item.productType ||
          "Training & Certification") as CreatePaymentIntentRequest["productType"],
        bookingService: item.title,
        platformRole: (userData?.role ||
          "student") as CreatePaymentIntentRequest["platformRole"],
        isSession: item.hasSession || false,
        isClassroom: item.hasClassroom || false,
        userId,
        profileId: profileId as string,
        bookingId: item.bookingDetails?.bookingId || "",
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
      setPaymentCurrency(paymentData.currency || "usd");
      setShowPaymentForm(true);
      toast.success("Secure payment initialized");
    } catch (err: any) {
      console.error("Init payment error:", err);

      // Provide error message
      let errorMessage = err?.message || "Failed to start payment";

      setPaymentError(errorMessage);
      toast.error(errorMessage);
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
        {/* {isAuthenticated && (
          <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-3 md:p-4 mb-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-800 text-sm md:text-base">
                  Role-Based Access Control
                </h4>
                <p className="text-xs md:text-sm text-blue-700 mb-2">
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
        )} */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-3">
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
                  Your Cart ({cartCount})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col lg:flex-row items-start gap-4 p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 bg-white"
                  >
                    <div className="relative w-full lg:w-32 h-40 lg:h-32 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="rounded-lg object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant="secondary"
                          className="bg-white/90 text-gray-700"
                        >
                          {item.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 w-full space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-bold text-xl text-gray-900 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                          <Clock size={16} className="text-blue-500" />
                          <span>{item.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                          <Award size={16} className="text-green-500" />
                          <span>
                            {item.certificate
                              ? "Certificate Included"
                              : "No Certificate"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                          <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            {item.level}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            canPurchaseProductType(
                              item.productType || "Training & Certification"
                            )
                              ? "default"
                              : "destructive"
                          }
                          className="text-sm"
                        >
                          {item.productType || "Training & Certification"}
                        </Badge>
                      </div>

                      {/* Role restriction warning */}
                      {isAuthenticated &&
                        !canPurchaseProductType(
                          item.productType || "Training & Certification"
                        ) && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              <span>
                                {getRoleRestrictionMessage(
                                  item.productType || "Training & Certification"
                                )}
                              </span>
                            </div>
                          </div>
                        )}
                    </div>

                    <div className="w-full lg:w-auto lg:text-right space-y-4">
                      <div className="text-center lg:text-right">
                        <p className="text-3xl font-bold text-[#011F72] mb-1">
                          {formatCurrency(item.price || 0)}
                        </p>
                        <p className="text-sm text-gray-500">per course</p>
                      </div>

                      <div className="flex flex-col gap-3">
                        <Button
                          onClick={() => handleProductCheckout(item.id)}
                          className="w-full lg:w-48 bg-[#0D1140] hover:bg-blue-700 text-white text-base py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
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
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CreditCard size={20} className="mr-2" />
                              {!isAuthenticated
                                ? "Login to Purchase"
                                : !canPurchaseProductType(
                                    item.productType ||
                                      "Training & Certification"
                                  )
                                ? "Role Restricted"
                                : "Purchase Now"}
                            </>
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id, item.title)}
                          className="w-full lg:w-48 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Authentication Section - Full Width */}
        {!isAuthenticated && (
          <div className="mt-8">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-blue-900">
                  {isLoginMode
                    ? "Sign In to Complete Your Purchase"
                    : "Create Account to Get Started"}
                </CardTitle>
                <p className="text-blue-700">
                  {isLoginMode
                    ? "Access your courses and track your progress"
                    : "Join thousands of learners and start your journey"}
                </p>
              </CardHeader>
              <CardContent className="max-w-md mx-auto">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Input
                      type="email"
                      placeholder="Email address"
                      className="text-base py-3"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      className="text-base py-3"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full bg-[#0D1140] hover:bg-blue-700 text-white text-base py-3 font-semibold"
                      onClick={
                        isLoginMode ? handleQuickLogin : handleQuickSignUp
                      }
                      disabled={isAuthLoading}
                    >
                      {isAuthLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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
                      className="w-full border-gray-300 hover:bg-white text-base py-3 font-semibold"
                      onClick={handleGoogleSignIn}
                      disabled={isAuthLoading}
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
                      Continue with Google
                    </Button>
                  </div>

                  <div className="text-center">
                    <span className="text-sm text-blue-700">
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
                      className="text-[#011F72] hover:underline font-semibold"
                    >
                      {isLoginMode ? "Sign up instead" : "Sign in instead"}
                    </button>
                  </div>

                  {authError && (
                    <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                      {authError}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Welcome Message for Authenticated Users */}
        {isAuthenticated && (
          <div className="mt-8">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="text-center py-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <User className="w-8 h-8 text-green-600" />
                  <h3 className="text-xl font-semibold text-green-800">
                    Welcome back, {userData.fullName || userData.email}!
                  </h3>
                </div>
                <p className="text-green-700">
                  You're all set to complete your purchase. Click "Purchase Now"
                  on any course to proceed.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Continue Shopping Section */}
        <div className="mt-8 text-center">
          <Link
            href="/training/catalog"
            className="inline-flex items-center gap-2 text-[#011F72] hover:text-blue-700 font-semibold text-lg hover:underline transition-colors"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
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
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="mb-2">{paymentError}</p>
                      </div>
                    </div>
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
