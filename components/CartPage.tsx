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
  Loader2,
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

// Use calculator functions from calculators.ts
import {
  computeInstallmentsDetails,
  perUnitPriceCalculator,
} from "@/lib/pricing/calculators";
import {
  Currency,
  PriceModel,
  TierType,
  Pricing,
  PriceBasis,
} from "@/lib/constants/pricing";
import { teamFetcher } from "@/utils/teamFetcher";

export type PricingData = {
  currency: Currency;
  quantity: number;
  subtotal: number;
  vat: number;
  total: number; // correct final total
  unitPrice: number;
  model: PriceModel;
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
  const [isCheckingOutById, setIsCheckingOutById] = useState<
    Record<string, boolean>
  >({});

  /* ---------------- Auth box ---------------- */
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(false);

  /* ---------------- Team members for quantity calculation ---------------- */
  const [teamMembersCount, setTeamMembersCount] = useState<number>(0);
  const { members, fetchTeamData } = teamFetcher();

  // Trigger team fetch via shared teamFetcher
  useEffect(() => {
    if (isAuthenticated && userData?.role === "teamTechProfessional") {
      fetchTeamData().catch(() => undefined);
    }
  }, [isAuthenticated, userData?.role, fetchTeamData]);

  // Derive quantity from fetched members
  useEffect(() => {
    if (userData?.role === "teamTechProfessional") {
      const active = Array.isArray(members)
        ? members.filter((m: any) => m?.status === "active").length
        : 0;
      setTeamMembersCount(Math.max(1, active + 1));
    } else {
      setTeamMembersCount(0);
    }
  }, [members, userData?.role]);

  /* ---------------- Helpers ---------------- */
  /**
   * Calculate quantity based on role and product pricing:
   * - team role + per_unit pricing: members + admin
   * - others or flat pricing: 1 (or booking numberOfParticipants if available)
   */
  const calculateQuantity = (item: CartItem): number => {
    // If booking details specify numberOfParticipants, use that
    if (item?.bookingDetails?.numberOfParticipants) {
      return Math.max(1, item.bookingDetails.numberOfParticipants);
    }

    const pricing = item.pricing;
    if (!pricing) return 1;

    // For per_unit pricing with unitName === "team" and teamTechProfessional role
    if (
      (pricing.priceBasis === "per_unit" ||
        (pricing as any).model === "per_unit") &&
      pricing.unitName === "team" &&
      userData?.role === "teamTechProfessional" &&
      teamMembersCount > 0
    ) {
      return teamMembersCount; // members + admin
    }

    // Default: quantity = 1
    return 1;
  };

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
    
    // Universal access product types available to all authenticated users
    const universalProductTypes = [
      "Tools",
      "Marketing, Consultation & Free Services",
    ];
    if (universalProductTypes.includes(productType)) return true;
    
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
      productType === "Career Development & Mentorship"
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

  /* ---------------- Local preview (no server GET) ---------------- */
  const computeLocalUnitOrTotal = (item: CartItem, qty: number) => {
    const p: any = item.pricing || {};
    if (
      (p.priceBasis || (p.model === "per_unit" ? "per_unit" : "flat")) ===
      "per_unit"
    ) {
      const ti = (p.tierType as "volume" | "stairstep") || "volume";
      const tiers = Array.isArray(p.tiers)
        ? p.tiers.map((t: any) => ({
            upTo: Number(t?.upTo ?? t?.upto ?? t?.cap ?? 0),
            unitPrice: Number(t?.unitPrice || 0),
          }))
        : [];
      const total = perUnitPriceCalculator(tiers, ti, Math.max(1, qty));
      return {
        unitOrFlat: tiers.length
          ? tiers[0]?.unitPrice ?? 0
          : Number(p.basePrice || item.price || 0),
        total,
      };
    }
    const base = Number(p.basePrice ?? item.price ?? 0);
    return { unitOrFlat: base, total: base };
  };

  function localPricePreview(item: CartItem, qty: number): PricePreview {
    const p: any = item.pricing || {};
    const currency = (p.currency || item.currency || "usd").toUpperCase();
    const discountPercentage = Number(
      p.discountPercentage ?? p.discountPercent ?? item.discountPercentage ?? 0
    );
    const vatPercentage = Number(p.vatPercentage ?? 0);
    const taxInclusive = p.taxInclusive ?? true;

    // model/tier awareness
    const model: "one_time" | "subscription" =
      p.model === "subscription" || item.isRecurring
        ? "subscription"
        : "one_time";
    const qtySafe = Math.max(1, Number(qty || 1));

    if (model === "subscription") {
      // Check if subscription has per-unit pricing with tiers
      const priceBasis = p.priceBasis || (p.model === "per_unit" ? "per_unit" : "flat");
      
      if (priceBasis === "per_unit") {
        // Use tier-based calculation for per-unit subscription
        const ti = (p.tierType as "volume" | "stairstep") || "volume";
        const tiers = Array.isArray(p.tiers)
          ? p.tiers.map((t: any) => ({
              upTo: Number(t?.upTo ?? t?.upto ?? t?.cap ?? 0),
              unitPrice: Number(t?.unitPrice || 0),
            }))
          : [];
        
        const subtotal = tiers.length > 0
          ? perUnitPriceCalculator(tiers, ti, qtySafe)
          : Number(p.basePrice || p.subscriptionPrice || item.price || 0);
        
        const discount = Math.max(0, subtotal * (discountPercentage / 100));
        const afterDisc = Math.max(0, subtotal - discount);
        const vat = taxInclusive
          ? 0
          : Math.max(0, afterDisc * (vatPercentage / 100));
        const total = afterDisc + vat;
        
        return {
          ok: true,
          currency,
          quantity: qtySafe,
          subtotal,
          vat,
          total,
          unitPrice: tiers.length ? tiers[0]?.unitPrice ?? 0 : subtotal,
          model: "subscription",
          tierType: ti,
        };
      }
      
      // Flat subscription pricing
      const period = Number(p.subscriptionPrice ?? item.price ?? 0);
      const subtotal = period;
      const discount = Math.max(0, subtotal * (discountPercentage / 100));
      const afterDisc = Math.max(0, subtotal - discount);
      const vat = taxInclusive
        ? 0
        : Math.max(0, afterDisc * (vatPercentage / 100));
      const total = afterDisc + vat;
      return {
        ok: true,
        currency,
        quantity: 1,
        subtotal,
        vat,
        total,
        unitPrice: period,
        model: "subscription",
        tierType: "volume",
      };
    }

    const { unitOrFlat, total: basisTotal } = computeLocalUnitOrTotal(
      item,
      qtySafe
    );
    const subtotal = basisTotal;
    const discount = Math.max(0, subtotal * (discountPercentage / 100));
    const afterDisc = Math.max(0, subtotal - discount);
    let vat = 0;
    let total = afterDisc;
    if (!taxInclusive) {
      vat = Math.max(0, afterDisc * (vatPercentage / 100));
      total = afterDisc + vat;
    }
    return {
      ok: true,
      currency,
      quantity: qtySafe,
      subtotal,
      vat,
      total,
      unitPrice: unitOrFlat,
      model: "one_time",
      tierType: p.tierType as any,
    };
  }

  /* ---------------- Price previews ---------------- */
  const refreshPricePreview = async (item: CartItem, qty: number) => {
    const local = localPricePreview(item, qty);
    setPricePreviewById((prev) => ({ ...prev, [item.id]: local }));
    return true;
  };

  /* ---------------- Installments preview ---------------- */
  const fetchInstallmentsPreview = async (item: CartItem) => {
    const itemId = item.id;
    if (!item.pricing?.installments?.enabled) {
      setInstallmentsPreviewById((prev) => ({ ...prev, [itemId]: null }));
      return;
    }

    setIsFetchingInstallmentsById((prev) => ({ ...prev, [itemId]: true }));

    try {
      const qty = calculateQuantity(item);
      const preview = pricePreviewById[itemId];

      if (!preview || !preview.total) {
        setIsFetchingInstallmentsById((prev) => ({ ...prev, [itemId]: false }));
        return;
      }

      // Build product object for computeInstallmentsDetails
      const installmentsConfig = item.pricing?.installments;
      if (!installmentsConfig?.enabled) {
        setIsFetchingInstallmentsById((prev) => ({ ...prev, [itemId]: false }));
        return;
      }

      // Access properties that may exist in runtime data but not in type
      const itemPricingAny = item.pricing as any;

      const pricing: Pricing = {
        model: (item.pricing?.model ||
          (item.isRecurring ? "subscription" : "one_time")) as PriceModel,
        priceBasis: (item.pricing?.priceBasis || "flat") as PriceBasis,
        currency: item.currency || "usd",
        basePrice: item.pricing?.basePrice ?? item.price ?? 0,
        unitName: item.pricing?.unitName,
        tierType: item.pricing?.tierType,
        tiers: itemPricingAny?.tiers, // tiers may exist in runtime data
        minQty: item.pricing?.minQty,
        maxQty: item.pricing?.maxQty,
        taxInclusive: item.pricing?.taxInclusive ?? true,
        vatPercentage: item.pricing?.vatPercentage ?? 0,
        discountPercentage:
          itemPricingAny?.discountPercentage ?? item.discountPercentage ?? 0,
        allowInstallments: true,
        installments: {
          enabled: true,
          count: installmentsConfig.count ?? 6,
          interval: installmentsConfig.interval || "month",
          intervalCount: installmentsConfig.intervalCount ?? 1,
          downPaymentType: installmentsConfig.downPaymentType || "percent",
          downPaymentValue: installmentsConfig.downPaymentValue ?? 0,
        },
      };

      // Calculate effective unit price from preview
      const effectiveUnitPrice =
        preview.unitPrice ?? preview.total / Math.max(1, qty);

      // Use computeInstallmentsDetails from calculators.ts
      // installments is guaranteed to exist because we checked installmentsConfig.enabled
      const installments = pricing.installments!;
      const installmentsDetails = computeInstallmentsDetails(
        installments.count - 1, // count AFTER down payment
        qty,
        effectiveUnitPrice,
        { pricing }
      );

      const plan = {
        count: installments.count,
        interval: installments.interval,
        intervalCount: installments.intervalCount,
        downPaymentType: installments.downPaymentType,
        downPaymentValue: installments.downPaymentValue,
      };

      setInstallmentsPreviewById((prev) => ({
        ...prev,
        [itemId]: {
          plan,
          downPaymentAmount: installmentsDetails.downPayment,
          installmentAmount: installmentsDetails.schedule[0]?.amount ?? 0,
          schedule: installmentsDetails.schedule,
          totalFinanced: installmentsDetails.totalFinanced,
          vat: installmentsDetails.vat,
          discount: installmentsDetails.discount,
        },
      }));
    } catch (error) {
      safeConsole.error("Error computing installments:", error);
      setInstallmentsPreviewById((prev) => ({ ...prev, [itemId]: null }));
    } finally {
      setIsFetchingInstallmentsById((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  // Fetch server price preview when cart items change
  const fetchServerPricePreview = async (item: CartItem, qty: number) => {
    if (!isAuthenticated) {
      // Fall back to local preview if not authenticated
      const local = localPricePreview(item, qty);
      setPricePreviewById((prev) => ({ ...prev, [item.id]: local }));
      ensureDefaultMode(item.id);
      if (item.pricing?.installments?.enabled) {
        fetchInstallmentsPreview(item);
      }
      return;
    }

    const token = getTokenFromCookies() || "";
    const p: any = item.pricing || {};
    const payload: any = {
      productId: item.id,
      quantity: qty,
    };
    
    // Only include unitName if it's per-unit pricing
    if (p.unitName) {
      payload.unitName = p.unitName;
    }

    try {
      const resp = await PaymentService.postPricePreview(payload, token);
      const serverPreview = resp?.data;
      
      if (serverPreview?.data?.options?.pay_in_full) {
        const opt = serverPreview.data.options.pay_in_full;
        const serverPricePreview: PricePreview = {
          ok: true,
          currency: opt.currency || item.currency || "USD",
          quantity: Number(opt.quantity || 1),
          subtotal: Number(opt.breakdown?.subtotal || 0),
          vat: Number(opt.breakdown?.vatAmount || 0),
          total: Number(opt.breakdown?.total || 0),
          unitPrice: typeof opt.breakdown?.unitPrice === "number" ? opt.breakdown.unitPrice : undefined,
          model: opt.model as any,
          tierType: opt.tiers?.type as any,
        };
        setPricePreviewById((prev) => ({ ...prev, [item.id]: serverPricePreview }));
        ensureDefaultMode(item.id);

        // If installments are available, parse installments preview
        if (serverPreview.data.availableModes?.includes("installments") && serverPreview.data.options.installments) {
          const instOpt = serverPreview.data.options.installments;
          setInstallmentsPreviewById((prev) => ({
            ...prev,
            [item.id]: {
              plan: {
                count: Number(instOpt.installments?.count || 0),
                interval: "month" as const,
                intervalCount: 1,
                downPaymentType: (instOpt.installments?.downPayment?.type || "percent") as any,
                downPaymentValue: Number(instOpt.installments?.downPayment?.value || 0),
              },
              downPaymentAmount: Number(instOpt.installments?.downPayment?.amount || 0),
              installmentAmount: instOpt.installments?.schedule?.[0]?.amount || 0,
              schedule: Array.isArray(instOpt.installments?.schedule)
                ? instOpt.installments.schedule.map((x: any) => Number(x?.amount || 0))
                : [],
              totalFinanced: Number(instOpt.installments?.totalFinanced || 0),
            },
          }));
        }
      } else {
        // Fallback to local preview if server response is unexpected
        const local = localPricePreview(item, qty);
        setPricePreviewById((prev) => ({ ...prev, [item.id]: local }));
        ensureDefaultMode(item.id);
        if (item.pricing?.installments?.enabled) {
          fetchInstallmentsPreview(item);
        }
      }
    } catch (error) {
      safeConsole.error("Error fetching server price preview:", error);
      // Fallback to local preview on error
      const local = localPricePreview(item, qty);
      setPricePreviewById((prev) => ({ ...prev, [item.id]: local }));
      ensureDefaultMode(item.id);
      if (item.pricing?.installments?.enabled) {
        fetchInstallmentsPreview(item);
      }
    }
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      await Promise.all(
        cartItems.map(async (item) => {
          if (cancelled) return;
          const qty = calculateQuantity(item);
          await fetchServerPricePreview(item, qty);
        })
      );
    };
    if (cartItems.length > 0) run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems, teamMembersCount, isAuthenticated]);

  /* ---------------- Billing modes ---------------- */
  const getSupportedModesForItem = (
    item: CartItem,
    preview?: PricePreview
  ): BillingChoice[] => {
    const rawModel =
      (preview as any)?.model ??
      (item.pricing as any)?.model ??
      (item.isRecurring ? "subscription" : "one_time");

    if (rawModel === "subscription") return ["subscription"];
    if (rawModel === "free") return ["pay_in_full"];

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
      router.replace("/cart");
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
      router.replace("/cart");
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
    const qty = calculateQuantity(item); // Use calculateQuantity to get correct qty (includes admin for team)

    // Build minimal price-preview payload to send to server
    const p: any = item.pricing || {};
    const payload: any = {
      productId: item.id,
      quantity: qty,
    };
    
    // Only include unitName if it's per-unit pricing
    if (p.unitName) {
      payload.unitName = p.unitName;
    }
    try {
      setIsCheckingOutById((prev) => ({ ...prev, [productId]: true }));
      // Send preview request and persist response + chosen mode for Checkout page
      const token = getTokenFromCookies() || "";
      
      // Store checkout selection BEFORE making API call
      const selection: CheckoutSelection = [
        { itemId: productId, mode: choice, quantity: qty },
      ];
      if (typeof window !== "undefined") {
        sessionStorage.setItem("checkout.selection", JSON.stringify(selection));
      }

      try {
        const resp = await PaymentService.postPricePreview(payload, token);
        const preview = resp?.data;
        if (typeof window !== "undefined") {
          sessionStorage.setItem("checkout.preview", JSON.stringify(preview));
          sessionStorage.setItem("checkout.mode", choice);
        }
        
        // Navigate only after successful preview response
        router.push("/checkout");
      } catch (e: any) {
        safeConsole.error("Price preview error:", e);
        toast.error(e?.message || "Failed to get price preview");
        // Don't navigate if preview fails
        setIsCheckingOutById((prev) => ({ ...prev, [productId]: false }));
      }
    } catch (error: any) {
      safeConsole.error("Checkout error:", error);
      toast.error(error?.message || "Failed to initiate checkout");
      setIsCheckingOutById((prev) => ({ ...prev, [productId]: false }));
    }
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
              {/* {isAuthenticated && (
                <Button variant="outline" onClick={handleSignOut}>
                  Sign out
                </Button>
              )} */}
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
                                choice === "pay_in_full" ? "text-white hover:bg-blue-700" : "bg-white"
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
                                choice === "installments" ? "text-white hover:bg-blue-700" : "bg-white"
                              }`}
                              onClick={() =>
                                setPaymentModeById((prev) => ({
                                  ...prev,
                                  [item.id]: "installments",
                                }))
                              }
                            >
                              Pay in Installments
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
                        <div className="text-xs text-gray-600 space-y-1">
                          {isLoadingPlan && <span>Calculating plan…</span>}
                          {!isLoadingPlan &&
                            installmentsPreviewById[item.id] && (
                              <div className="space-y-1">
                                <div>
                                  <span className="font-medium">
                                    Down Payment:{" "}
                                  </span>
                                  {formatCurrency(
                                    installmentsPreviewById[item.id]
                                      ?.downPaymentAmount || 0,
                                    displayCurrency
                                  )}
                                </div>
                                <div>
                                  <span className="font-medium">
                                    Then{" "}
                                    {installmentsPreviewById[item.id]?.plan
                                      ?.count ?? 0}{" "}
                                    payments of:{" "}
                                  </span>
                                  {formatCurrency(
                                    installmentsPreviewById[item.id]
                                      ?.installmentAmount || 0,
                                    displayCurrency
                                  )}
                                </div>
                                <div className="text-gray-500">
                                  Total:{" "}
                                  {formatCurrency(
                                    installmentsPreviewById[item.id]
                                      ?.totalFinanced || 0,
                                    displayCurrency
                                  )}
                                </div>
                              </div>
                            )}
                          {!isLoadingPlan &&
                            !installmentsPreviewById[item.id] && (
                              <span className="text-amber-600">
                                Installment plan not available
                              </span>
                            )}
                        </div>
                      )}

                      {choice === "subscription" && (
                        <div className="text-md font-medium text-gray-600">
                          Recurring billing: you’ll add a payment method at
                          checkout.
                        </div>
                      )}
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
                  </div>

                  {/* Price + actions */}
                  <div className="w-full lg:w-auto lg:text-right space-y-4">
                    <div className="text-center lg:text-right">
                      <p className="text-3xl font-bold text-[#011F72] mb-1">
                        {choice === "installments" &&
                        installmentsPreviewById[item.id]?.downPaymentAmount
                          ? formatCurrency(
                              installmentsPreviewById[item.id].downPaymentAmount,
                              displayCurrency
                            )
                          : formatCurrency(displayAmount, displayCurrency)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {choice === "installments" &&
                        installmentsPreviewById[item.id]?.downPaymentAmount
                          ? "down payment"
                          : pp?.model === "subscription"
                          ? (() => {
                              const ic = Number(item.pricing?.intervalCount || 1);
                              const interval = item.pricing?.interval || "month";
                              const every = ic > 1 ? `${ic} ${interval}s` : interval;
                              return `/ ${every}`;
                            })()
                          : "per course"}
                      </p>
                      {pp?.model === "subscription" && (
                        <p className="text-xs text-gray-500">
                          {(item.pricing as any)?.autoRenew === false
                            ? "No renewal"
                            : (() => {
                                const ic = Number(item.pricing?.intervalCount || 1);
                                const interval = item.pricing?.interval || "month";
                                const every = ic > 1 ? `${ic} ${interval}s` : interval;
                                return `Auto-renews every ${every}`;
                              })()}
                        </p>
                      )}
                      {choice === "installments" &&
                        installmentsPreviewById[item.id]?.downPaymentAmount && (
                          <p className="text-xs text-gray-400 mt-1 line-through">
                            Total: {formatCurrency(displayAmount, displayCurrency)}
                          </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                      <Button
                        onClick={() => handleProductCheckout(item.id)}
                        className="w-full lg:w-48 bg-[#0D1140] hover:bg-blue-700 text-white text-base py-3 px-6 rounded-[10px] font-semibold shadow-lg hover:shadow-xl transition-all"
                        disabled={
                          !!isCheckingOutById[item.id] ||
                          !canPurchaseProductType(
                            item.productType,
                            userData?.role
                          )
                        }
                      >
                        {isCheckingOutById[item.id] ? (
                          <>
                            <Loader2 size={18} className="mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard size={20} className="mr-2" />
                            {!isAuthenticated
                              ? "Login to Continue"
                              : choice === "subscription"
                              ? "Subscribe"
                              : choice === "installments"
                              ? "Start Plan"
                              : "Checkout"}
                          </>
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          removeFromCart(item.id);
                          toast.success(`${item.title} removed from cart`);
                        }}
                        className="w-full lg:w-48 text-white bg-red-500 hover:bg-red-300 border border-red-200 rounded-[10px]"
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
