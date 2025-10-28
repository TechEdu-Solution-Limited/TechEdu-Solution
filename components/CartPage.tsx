// CartPage.tsx
"use client";

/**
 * CART
 * - Displays items and price previews
 * - Lets user pick billing mode (pay in full / installments / subscription)
 * - Saves a minimal selection to sessionStorage and navigates to /checkout
 *
 * Booking details are now collected on the /checkout page.
 */

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

import { useCart } from "@/contexts/CartContext";
import { useRole } from "@/contexts/RoleContext";
import { useProfileData } from "@/hooks/useProfileData";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import {
  Trash2,
  Clock,
  Award,
  ArrowLeft,
  AlertCircle,
  Calendar,
  CreditCard,
} from "lucide-react";

import {
  individualTechProfessionalServices,
  institutionServices,
  recruiterServices,
  studentServices,
  teamTechProfessionalServices,
} from "@/lib/constants/productTypes";

import { PaymentService } from "@/lib/api/paymentService";
import {
  getTokenFromCookies,
  saveTokenToCookies,
  saveUserDataToCookies,
  setCookie,
} from "@/lib/cookies";
import { loginUser, registerUser } from "@/lib/apiFetch";
import { safeConsole } from "@/lib/console";

import type { BillingChoice, CartItem, PricePreview } from "@/types/cart";

// Local calculators for robust fallback (no tiers required)
import {
  calcOneTimeAmount,
  calcPerUnitAmount,
  calcSubscriptionAmount,
  PerUnitResult,
} from "@/lib/pricing/calculators";
import { Currency, PricingModel, TierType } from "@/lib/constants/pricing";

export type PricingData = {
  currency: Currency;
  quantity: number;
  subtotal: number;
  vat: number;
  total: number; // correct final total
  unitPrice: number;
  model: PricingModel;
  tierType: TierType;
};
/* ---------------- Currency helpers (display only) ---------------- */
const formatCurrency = (amount: number, currency?: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: (currency ?? "USD").toUpperCase(),
  }).format(amount);

/* ================================================================= */
export default function CartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { cartItems, removeFromCart, clearCart, cartCount } = useCart();
  const {
    isAuthenticated,
    userData,
    setUserData,
    setUserRole,
    setIsAuthenticated,
  } = useRole();
  const { profile, loading: profileLoading, fetchProfile } = useProfileData();

  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  /* ---------------- State for previews & choices ---------------- */
  const [pricePreviewById, setPricePreviewById] = useState<
    Record<string, PricePreview>
  >({});
  const [installmentsPreviewById, setInstallmentsPreviewById] = useState<
    Record<string, any | null>
  >({});
  const [isFetchingInstallmentsById, setIsFetchingInstallmentsById] = useState<
    Record<string, boolean>
  >({});
  const [paymentModeById, setPaymentModeById] = useState<
    Record<string, BillingChoice>
  >({});

  /* ---------------- Auth box ---------------- */
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(false);

  /* ---------------- Helpers ---------------- */
  const calculateCartTotal = () =>
    cartItems.reduce(
      (sum, item) =>
        sum + (pricePreviewById[item.id]?.total ?? item.price ?? 0),
      0
    );

  const getCartCurrency = () =>
    (
      pricePreviewById[cartItems[0]?.id]?.currency ||
      cartItems[0]?.currency ||
      "USD"
    ).toUpperCase();

  /* ---------------- Role gating ---------------- */
  const canPurchaseProductType = (productType: string, role?: string) => {
    if (!isAuthenticated) return false;
    switch (role) {
      case "student":
        return studentServices.includes(productType);
      case "individualTechProfessional":
        return individualTechProfessionalServices.includes(productType);
      case "teamTechProfessional":
        return teamTechProfessionalServices.includes(productType);
      case "recruiter":
        return recruiterServices.includes(productType);
      case "institution":
        return institutionServices.includes(productType);
      default:
        return true;
    }
  };
  const getRoleRestrictionMessage = (productType: string) => {
    if (
      productType === "Academic Support Services" ||
      productType === "Career Development & Mentorship" ||
      productType === "Training & Certification"
    ) {
      return "Only students can purchase";
    } else if (
      productType === "Training & Certification" ||
      productType === "Career Development & Mentorship"
    ) {
      return "Only tech professionals can purchase";
    }
    return "";
  };

  /* ---------------- Normalizers (server + local fallback) ---------------- */

  // Server response → normalized preview that respects pricingModel/tierType semantics.
  function normalizeServerPreview(
    data: any,
    item: CartItem,
    qty: number
  ): PricePreview {
    const model =
      (data?.model as "one_time" | "subscription" | "per_unit") ||
      (item.isRecurring ? "subscription" : "one_time");
    const tierType =
      (data?.tierType as "none" | "volume" | "graduated" | "stairstep") ||
      "none";

    const currency = (data?.currency || item.currency || "USD")
      .toString()
      .toUpperCase();
    const quantity = Math.max(1, Number(data?.quantity ?? qty ?? 1));

    // Pick correct total per model/tier
    // - subscription: prefer period/unit amount fields
    // - per_unit: server usually returns total; for stairstep it's the flat band total
    // - one_time: total or tax.totalMajor
    const periodLike =
      data?.periodAmountMajor ?? data?.unitAmountMajor ?? data?.tax?.totalMajor;
    const genericTotal =
      data?.total ?? data?.totalMajor ?? data?.tax?.totalMajor ?? 0;

    const total =
      model === "subscription"
        ? Number(periodLike ?? genericTotal ?? 0)
        : Number(genericTotal ?? 0);

    // unitPrice meaning:
    // - subscription: unitAmountMajor (per period)
    // - per_unit volume/graduated: per-unit price (if provided)
    // - per_unit stairstep: flat tier price == total
    const unitPrice =
      data?.unitPrice ??
      data?.unitAmountMajor ??
      data?.effectiveUnitPriceMajor ??
      (tierType === "stairstep" ? total : undefined) ??
      0;

    return {
      ok: true,
      currency,
      quantity,
      subtotal: Number(data?.subtotal ?? data?.tax?.subtotalMajor ?? 0),
      vat: Number(data?.vat ?? data?.tax?.vatMajor ?? 0),
      total, // already correct for each model/tier per rules above
      unitPrice,
      model,
      tierType,
    };
  }

  // Fallback preview (no tiers required). Stairstep without tiers can’t be computed locally,
  // so we treat unknown tiering as "none".
  function localPricePreview(item: CartItem, qty: number): PricePreview {
    const p: any = item.pricing || {};
    const currency = (p.currency || item.currency || "usd").toLowerCase();
    const discountPercentage = p.discountPercent ?? p.discountPercentage ?? 0;
    const vatPercentage = p.vatPercentage ?? 0;
    const taxInclusive = p.taxInclusive ?? true;

    if (p?.model === "subscription" || item.isRecurring) {
      const r = calcSubscriptionAmount({
        currency,
        subscriptionPrice: p.subscriptionPrice ?? item.price ?? 0,
        interval: p.interval ?? "month",
        intervalCount: p.intervalCount ?? 1,
        trialDays: p.trialDays ?? 0,
        setupFee: p.setupFee ?? 0,
        autoRenew: p.autoRenew ?? true,
        proration: p.proration ?? true,
        taxInclusive,
        vatPercentage,
        discountPercentage,
      });
      return {
        ok: true,
        currency: r.currency.toUpperCase(),
        quantity: 1,
        subtotal: r.tax.subtotalMajor,
        vat: r.tax.vatMajor,
        total: r.tax.totalMajor, // per period
        unitPrice: r.unitAmountMajor, // per period
        model: "subscription",
        tierType: "none",
      };
    }

    if (p?.model === "per_unit" || p?.tierType) {
      // No tiers on cart item → treat as simple per-unit "none"
      const baseUnit = item.price ?? 0;
      const r: PerUnitResult = calcPerUnitAmount({
        currency,
        quantity: Math.max(1, Number(qty || 1)),
        unitName: p.unitName || "team",
        discountPercentage,
        taxInclusive,
        vatPercentage,
        tierType: p.tierType ?? "volume",
        basePrice: baseUnit,
      });
      return {
        ok: true,
        currency: r.currency.toUpperCase(),
        quantity: r.orderSnapshot.quantityPaid ?? Math.max(1, qty),
        subtotal: r.subtotalMajor,
        vat: r.vatMajor,
        total: r.totalMajor, // correct final total
        unitPrice: r.effectiveUnitPriceMajor,
        model: "per_unit",
        tierType: r.ti,
      };
    }

    // one-time
    const r = calcOneTimeAmount({
      currency,
      basePrice: p.basePrice ?? item.price ?? 0,
      taxInclusive,
      vatPercentage,
      discountPercentage,
    });
    return {
      ok: true,
      currency: r.currency.toUpperCase(),
      quantity: 1,
      subtotal: r.subtotalMajor,
      vat: r.vatMajor,
      total: r.totalMajor,
      unitPrice:
        (r as any).orderSnapshot?.unitPriceMajor ??
        p.basePrice ??
        item.price ??
        0,
      model: "one_time",
      tierType: "none",
    };
  }

  /* ---------------- Price previews ---------------- */
  const refreshPricePreview = async (item: CartItem, qty: number) => {
    try {
      const token = getTokenFromCookies() || "";
      const resp = await PaymentService.getPricePreview(item.id, qty, token);
      const data = resp?.data;

      if (data?.ok) {
        const normalized = normalizeServerPreview(data, item, qty);
        // If server sent 0 (weird edge), fall back to local
        const finalPreview =
          typeof normalized.total === "number" && normalized.total > 0
            ? normalized
            : localPricePreview(item, qty);

        setPricePreviewById((prev) => ({
          ...prev,
          [item.id]: finalPreview,
        }));
        return true;
      }
    } catch (e) {
      safeConsole.warn("Price preview (refresh) failed:", e);
    }

    // Fallback if server didn’t return a valid preview
    const local = localPricePreview(item, qty);
    setPricePreviewById((prev) => ({ ...prev, [item.id]: local }));
    return true;
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const token = getTokenFromCookies();
      await Promise.all(
        cartItems.map(async (item) => {
          const qty =
            item?.bookingDetails?.numberOfParticipants &&
            item.bookingDetails.numberOfParticipants > 0
              ? item.bookingDetails.numberOfParticipants
              : 1;

          let didSet = false;
          try {
            const resp = await PaymentService.getPricePreview(
              item.id,
              qty,
              token || ""
            );
            const data = resp?.data;
            if (data?.ok && !cancelled) {
              const normalized = normalizeServerPreview(data, item, qty);
              const finalPreview =
                typeof normalized.total === "number" && normalized.total > 0
                  ? normalized
                  : localPricePreview(item, qty);

              setPricePreviewById((prev) => ({
                ...prev,
                [item.id]: finalPreview,
              }));
              ensureDefaultMode(item.id);
              didSet = true;
            }
          } catch (e) {
            safeConsole.warn("Price preview failed:", e);
          }

          if (!cancelled && !didSet) {
            const local = localPricePreview(item, qty);
            setPricePreviewById((prev) => ({
              ...prev,
              [item.id]: local,
            }));
            ensureDefaultMode(item.id);
          }
        })
      );
    };
    if (cartItems.length > 0) run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  /* ---------------- Billing modes ---------------- */
  const getSupportedModesForItem = (
    item: CartItem,
    preview?: PricePreview
  ): BillingChoice[] => {
    const model =
      (preview?.model as "one_time" | "subscription" | undefined) ||
      item.pricing?.model ||
      (item.isRecurring ? "subscription" : "one_time");

    if (model === "subscription") return ["subscription"];

    const installmentsEnabled = !!item.pricing?.installments?.enabled;
    return installmentsEnabled
      ? ["pay_in_full", "installments"]
      : ["pay_in_full"];
  };

  const getDefaultModeForItem = (itemId: string): BillingChoice => {
    const item = cartItems.find((ci) => ci.id === itemId);
    if (!item) return "pay_in_full";
    const supported = getSupportedModesForItem(item, pricePreviewById[itemId]);
    return supported[0];
  };

  const ensureDefaultMode = (itemId: string) => {
    setPaymentModeById((prev) => {
      if (prev[itemId]) return prev;
      return { ...prev, [itemId]: getDefaultModeForItem(itemId) };
    });
  };

  /* ---------------- Auth: signup / login / sign out ---------------- */
  const handleQuickSignUp = async () => {
    if (!authEmail || !authPassword) {
      setAuthError("Please enter both email and password");
      return;
    }
    setIsAuthLoading(true);
    setAuthError("");
    try {
      const response = await registerUser({
        fullName: authEmail.split("@")[0],
        email: authEmail,
        password: authPassword,
        role: "student",
      });
      if (response.status >= 400) {
        throw new Error(response?.data?.message || "Registration failed");
      }

      toast.success("Account created! You're signed in.");

      const possibleTokenPaths = [
        response.data?.token,
        response.data?.accessToken,
        response.data?.access_token,
        response.data?.data?.token,
        response.data?.data?.accessToken,
        response.data?.data?.access_token,
      ];
      const token = possibleTokenPaths.find(Boolean) as string | undefined;

      const possibleUserPaths = [
        response.data?.user,
        response.data?.userData,
        response.data?.data?.user,
        response.data?.data?.userData,
      ];
      const user = (possibleUserPaths.find(Boolean) as any) || {};

      if (token) saveTokenToCookies(token);
      if (user) saveUserDataToCookies(user);

      setUserData(user);
      setUserRole(user?.role || "student");
      setIsAuthenticated(true);

      setAuthEmail("");
      setAuthPassword("");
      setAuthError("");
    } catch (err: any) {
      safeConsole.error("Sign-up error:", err);
      setAuthError(err?.message || "Failed to create account");
      toast.error(err?.message || "Failed to create account");
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
      if (response.status >= 400)
        throw new Error(response?.data?.message || "Login failed");

      const possibleTokenPaths = [
        response.data?.token,
        response.data?.accessToken,
        response.data?.access_token,
        response.data?.data?.token,
        response.data?.data?.accessToken,
        response.data?.data?.access_token,
      ];
      const token = possibleTokenPaths.find(Boolean) as string | undefined;

      const possibleUserPaths = [
        response.data?.user,
        response.data?.userData,
        response.data?.data?.user,
        response.data?.data?.userData,
      ];
      const user = (possibleUserPaths.find(Boolean) as any) || {};

      if (!token || !user) throw new Error("Invalid login response");

      saveTokenToCookies(token);
      saveUserDataToCookies(user);

      setUserData(user);
      setUserRole(user?.role || "student");
      setIsAuthenticated(true);

      toast.success("Login successful!");
      setAuthEmail("");
      setAuthPassword("");
      setAuthError("");
    } catch (err: any) {
      safeConsole.error("Login error:", err);
      setAuthError(err?.message || "Failed to login");
      toast.error(err?.message || "Failed to login");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = () => {
    try {
      setCookie("token", "", { maxAge: -1, path: "/" });
      setCookie("userData", "", { maxAge: -1, path: "/" });
      setCookie("userId", "", { maxAge: -1, path: "/" });
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("checkout.selection");
      }
      setUserData(null as any);
      setUserRole(undefined as any);
      setIsAuthenticated(false);
      toast.success("Signed out");
    } catch {
      /* noop */
    }
  };

  /* ---------------- Checkout handoff ---------------- */
  type CheckoutSelection = Array<{
    itemId: string;
    mode: BillingChoice;
    quantity: number;
    booking?: {
      userNotes?: string;
      attachments?: string[];
    };
  }>;

  const handleProductCheckout = async (productId: string) => {
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
      } catch {
        /* non-blocking */
      }
    }

    const item = cartItems.find((ci) => ci.id === productId);
    if (!item) {
      toast.error("Item not found in cart");
      return;
    }

    const choice =
      paymentModeById[productId] || getDefaultModeForItem(productId);
    const qty = item?.bookingDetails?.numberOfParticipants || 1;

    // Booking is handled on /checkout now.
    const selection: CheckoutSelection = [
      { itemId: productId, mode: choice, quantity: qty },
    ];
    sessionStorage.setItem("checkout.selection", JSON.stringify(selection));
    router.push("/checkout");
  };

  /* ---------------- UI: Empty cart ---------------- */
  if (cartCount === 0) {
    return (
      <section>
        <div className="min-h-screen bg-gray-50 mt-[3rem] py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              {success && (
                <div className="mb-8 bg-green-50 border border-green-200 rounded-[10px] p-4">
                  <h3 className="font-semibold text-green-800">
                    Payment Successful!
                  </h3>
                  <p className="text-green-700">Thank you for your purchase.</p>
                  <div className="mt-4">
                    <Link
                      href="/dashboard"
                      className="text-green-700 underline font-medium"
                    >
                      Go to Dashboard Now
                    </Link>
                  </div>
                </div>
              )}

              {canceled && (
                <div className="mb-8 bg-red-50 border border-red-200 rounded-[10px] p-4">
                  <h3 className="font-semibold text-red-800">
                    Payment Cancelled
                  </h3>
                  <p className="text-red-700">You can try again later.</p>
                </div>
              )}

              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Your cart is empty
                </h1>
                <p className="text-gray-600 mb-8">
                  Looks like you haven't added any courses yet.
                </p>
              </div>

              <div className="space-y-4">
                <Link href="/pricing">
                  <Button className="bg-[#0D1140] hover:bg-blue-700 text-white px-8 py-3 rounded-[10px]">
                    Browse Courses
                  </Button>
                </Link>
                <div>
                  <Link
                    href="/pricing"
                    className="text-[#011F72] hover:underline inline-flex items-center gap-2"
                  >
                    <ArrowLeft size={16} />
                    Continue Shopping
                  </Link>
                </div>

                {isAuthenticated && (
                  <div className="pt-6">
                    <Button variant="outline" onClick={handleSignOut}>
                      Sign out
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- Main UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 mt-[5rem] md:mt-[4rem] py-8 md:py-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Shopping Cart
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <Button variant="outline" onClick={handleSignOut}>
                  Sign out
                </Button>
              )}
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Cart total banner */}
        <div className="mb-6 bg-blue-50 p-4 rounded-[10px] border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Cart Total
              </h3>
              <p className="text-sm text-gray-600">
                {cartItems.length} line item(s)
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(calculateCartTotal(), getCartCurrency())}
              </p>
              <p className="text-xs text-gray-500">
                Prices may include VAT depending on product
              </p>
            </div>
          </div>
        </div>

        {/* Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
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
            {cartItems.map((item) => {
              const pp = pricePreviewById[item.id];
              const supportedModes = getSupportedModesForItem(item, pp);
              const choice =
                paymentModeById[item.id] || getDefaultModeForItem(item.id);
              const canInstallments = supportedModes.includes("installments");
              const showModeToggle = supportedModes.length > 1;

              const isLoadingPlan = !!isFetchingInstallmentsById[item.id];
              const displayCurrency = (
                pp?.currency ||
                item.currency ||
                "USD"
              ).toUpperCase();
              const displayAmount = pp?.total ?? item.price ?? 0;

              return (
                <div
                  key={item.id}
                  className="flex flex-col lg:flex-row items-start gap-4 p-6 border border-gray-200 rounded-[12px] hover:shadow-md bg-white"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full lg:w-32 h-40 lg:h-32 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="rounded-[10px] object-cover"
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

                  {/* Body */}
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
                      {item.duration && (
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                          <Clock size={16} className="text-blue-500" />
                          <span>{item.duration}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                        <Award size={16} className="text-green-500" />
                        <span>
                          {item.certificate
                            ? "Certificate Included"
                            : "No Certificate"}
                        </span>
                      </div>
                      {item.level && (
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                          <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            {item.level}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          !canPurchaseProductType(
                            item.productType,
                            userData?.role
                          )
                            ? "default"
                            : "destructive"
                        }
                        className="text-sm"
                      >
                        {item.productType || "Training & Certification"}
                      </Badge>
                    </div>

                    {/* Bookable hint */}
                    {isAuthenticated && item.requiresBooking && (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-[10px]">
                        <div className="flex items-center gap-2 text-blue-700">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Bookable Service
                          </span>
                        </div>
                        <p className="text-xs text-blue-600 mt-1">
                          We’ll collect any extra details during checkout.
                        </p>
                      </div>
                    )}

                    {/* Role restriction message */}
                    {!canPurchaseProductType(
                      item.productType,
                      userData?.role
                    ) && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-[10px] text-sm text-red-700">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          <span>
                            {getRoleRestrictionMessage(item.productType)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Billing choice toggle */}
                    <div className="space-y-2">
                      {showModeToggle && (
                        <div className="inline-flex rounded-md shadow-sm border border-gray-200 overflow-hidden">
                          {supportedModes.includes("pay_in_full") && (
                            <Button
                              type="button"
                              variant={
                                choice === "pay_in_full" ? "default" : "ghost"
                              }
                              className={`px-3 py-1 rounded-none ${
                                choice === "pay_in_full" ? "" : "bg-white"
                              }`}
                              onClick={() =>
                                setPaymentModeById((prev) => ({
                                  ...prev,
                                  [item.id]: "pay_in_full",
                                }))
                              }
                            >
                              Pay in full
                            </Button>
                          )}
                          {canInstallments && (
                            <Button
                              type="button"
                              variant={
                                choice === "installments" ? "default" : "ghost"
                              }
                              className={`px-3 py-1 rounded-none ${
                                choice === "installments" ? "" : "bg-white"
                              }`}
                              onClick={() =>
                                setPaymentModeById((prev) => ({
                                  ...prev,
                                  [item.id]: "installments",
                                }))
                              }
                            >
                              Pay in 6 months
                            </Button>
                          )}
                          {supportedModes.includes("subscription") && (
                            <Button
                              type="button"
                              variant={
                                choice === "subscription" ? "default" : "ghost"
                              }
                              className={`px-3 py-1 rounded-none ${
                                choice === "subscription" ? "" : "bg-white"
                              }`}
                              onClick={() =>
                                setPaymentModeById((prev) => ({
                                  ...prev,
                                  [item.id]: "subscription",
                                }))
                              }
                            >
                              Subscribe monthly
                            </Button>
                          )}
                        </div>
                      )}

                      {choice === "installments" && (
                        <div className="text-xs text-gray-600">
                          {isLoadingPlan && <span>Fetching plan…</span>}
                          {!isLoadingPlan &&
                            installmentsPreviewById[item.id]?.plan && (
                              <span>
                                Pay today:{" "}
                                {formatCurrency(
                                  installmentsPreviewById[item.id]?.plan
                                    ?.downPaymentAmount || 0,
                                  displayCurrency
                                )}
                                {" · "}
                                Then{" "}
                                {installmentsPreviewById[item.id]?.plan
                                  ?.count ?? 5}
                                ×{" "}
                                {formatCurrency(
                                  installmentsPreviewById[item.id]?.plan
                                    ?.installmentAmount || 0,
                                  displayCurrency
                                )}
                              </span>
                            )}
                        </div>
                      )}

                      {choice === "subscription" && (
                        <div className="text-xs text-gray-600">
                          Recurring billing: you’ll add a payment method at
                          checkout.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price + actions */}
                  <div className="w-full lg:w-auto lg:text-right space-y-4">
                    <div className="text-center lg:text-right">
                      <p className="text-3xl font-bold text-[#011F72] mb-1">
                        {formatCurrency(displayAmount, displayCurrency)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {pp?.model === "subscription"
                          ? "per cycle"
                          : "per course"}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Button
                        onClick={() => handleProductCheckout(item.id)}
                        className="w-full lg:w-48 bg-[#0D1140] hover:bg-blue-700 text-white text-base py-3 px-6 rounded-[10px] font-semibold shadow-lg hover:shadow-xl transition-all"
                        disabled={
                          !canPurchaseProductType(
                            item.productType,
                            userData?.role
                          )
                        }
                      >
                        <CreditCard size={20} className="mr-2" />
                        {!isAuthenticated
                          ? "Login to Continue"
                          : choice === "subscription"
                          ? "Subscribe"
                          : choice === "installments"
                          ? "Start Plan"
                          : "Checkout"}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          removeFromCart(item.id);
                          toast.success(`${item.title} removed from cart`);
                        }}
                        className="w-full lg:w-48 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Continue shopping */}
        <div className="mt-8 text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-[#011F72] hover:text-blue-700 font-semibold text-lg hover:underline transition-colors"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
        </div>

        {/* Auth box (optional) */}
        {!isAuthenticated && (
          <div className="mt-8">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-blue-900">
                  {isLoginMode
                    ? "Sign In to Complete Your Purchase"
                    : "Create Account to Get Started"}
                </CardTitle>
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
                      {isAuthLoading
                        ? isLoginMode
                          ? "Signing In..."
                          : "Creating Account..."
                        : isLoginMode
                        ? "Sign In"
                        : "Create Account"}
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
                    <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-[10px] border border-red-200">
                      {authError}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
