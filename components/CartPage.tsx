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
  User,
  AlertCircle,
  Loader2,
  Calendar,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import {
  postApiRequest,
  registerUser,
  loginUser,
  apiRequest,
  getApiRequest, // ← needed for team fetch
} from "@/lib/apiFetch";
import { Input } from "@/components/ui/input";
import {
  getCookie,
  getTokenFromCookies,
  saveTokenToCookies,
  saveUserDataToCookies,
  setCookie,
} from "@/lib/cookies";
import StripePaymentForm from "@/components/StripePaymentForm";
import { PaymentService } from "@/lib/api/paymentService";
import type { SimplePaymentIntentRequest } from "@/types/payment";
import type { InstallmentsPreviewResponse } from "@/types/payment";
import { safeConsole } from "@/lib/console";
import {
  individualTechProfessionalServices,
  institutionServices,
  recruiterServices,
  studentServices,
  teamTechProfessionalServices,
} from "@/lib/constants/productTypes";
import { BillingChoice, CartItem, PricePreview } from "@/types/cart";

/* ----------------------- Currency helpers ----------------------- */
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
const toMinor = (amountMajor: number, currency: string) =>
  ZERO_DECIMAL.has((currency || "USD").toUpperCase())
    ? Math.round(amountMajor)
    : Math.round(amountMajor);

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart, cartCount } = useCart();

  const [pricePreviewById, setPricePreviewById] = useState<
    Record<string, PricePreview>
  >({});
  const [paymentModeById, setPaymentModeById] = useState<
    Record<string, BillingChoice>
  >({});

  // store the whole InstallmentsPreviewResponse (not only ["data"])
  const [installmentsPreviewById, setInstallmentsPreviewById] = useState<
    Record<string, InstallmentsPreviewResponse | null>
  >({});

  const [isFetchingInstallmentsById, setIsFetchingInstallmentsById] = useState<
    Record<string, boolean>
  >({});

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

  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  // auth UI
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(false);

  // payment modal state
  const [selectedCheckoutItemId, setSelectedCheckoutItemId] = useState<
    string | null
  >(null);
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(
    null
  );
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmountMinor, setPaymentAmountMinor] = useState<number | null>(
    null
  );
  const [paymentCurrency, setPaymentCurrency] = useState<string | null>(null);
  const [paymentBookingId, setPaymentBookingId] = useState<string | null>(null);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(false);

  // which flow is active inside Stripe modal
  const [activeFlow, setActiveFlow] = useState<
    null | "payment" | "setup-installments" | "setup-subscription"
  >(null);

  // booking step
  const [showBookingDetailsForm, setShowBookingDetailsForm] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    userNotes: "",
    attachments: [] as string[],
    participantType: "individual" as "individual" | "team",
    isTeam: false,
  });
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);

  // team context
  const [teamData, setTeamData] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [teamLoading, setTeamLoading] = useState(false);

  // redirect
  const redirectParam =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("redirect")
      : null;
  const redirectTo = redirectParam || "/dashboard";

  /* --------------------------- UI helpers --------------------------- */
  const refreshPricePreview = async (item: CartItem, qty: number) => {
    try {
      const token = getTokenFromCookies() || "";
      const resp = await PaymentService.getPricePreview(item.id, qty, token);
      const data = resp?.data;
      if (data?.ok) {
        setPricePreviewById((prev) => ({
          ...prev,
          [item.id]: {
            ok: true,
            currency: (data.currency || item.currency || "USD").toUpperCase(),
            quantity: data.quantity ?? qty,
            subtotal: data.subtotal ?? 0,
            vat: data.vat ?? 0,
            total: data.total ?? 0,
            unitPrice: data.unitPrice,
            model: data.model,
            tierType: data.tierType,
          },
        }));
        return true;
      }
    } catch (e) {
      safeConsole.warn("Price preview (refresh) failed:", e);
    }
    return false;
  };

  const formatCurrency = (amount: number, currency: string = "USD") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: (currency || "USD").toUpperCase(),
    }).format(amount);

  const calculateTotal = () =>
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

  /* --------------------------- Role checks -------------------------- */
  const canPurchaseProductType = (productType: string, role: string) => {
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

  const handleRemoveItem = (itemId: string, itemTitle: string) => {
    removeFromCart(itemId);
    toast.success(`${itemTitle} removed from cart`);
  };
  const handleClearCart = () => {
    clearCart();
    toast.success("Cart cleared");
  };

  /* ------------------------- Routing helpers ------------------------ */
  const getDashboardRoute = (role: string) => {
    const map: Record<string, string> = {
      student: "student",
      recruiter: "recruiter",
      institution: "institution",
      individualTechProfessional: "individual-tech-professional",
      teamTechProfessional: "team-tech-professional",
    };
    return `/dashboard/${map[role] || "student"}`;
  };

  const getOnboardingRoute = (role: string, id: string) => {
    switch (role) {
      case "student":
        return `/onboarding/student?userId=${id}${
          redirectTo && redirectTo !== "/dashboard"
            ? `&redirect=${encodeURIComponent(redirectTo)}`
            : ""
        }`;
      case "recruiter":
        return `/onboarding/recruiter?userId=${id}`;
      case "institution":
        return `/onboarding/institution?userId=${id}`;
      case "individualTechProfessional":
        return `/onboarding/tech-professional?userId=${id}`;
      case "teamTechProfessional":
        return `/onboarding/team-tech-professional?userId=${id}`;
      default:
        return `/login`;
    }
  };

  const getRedirectRoute = async (uData: any) => {
    const { role, id } = uData;

    if (id) {
      setCookie("userId", id, {
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    }

    if (
      redirectTo &&
      redirectTo !== "/dashboard" &&
      redirectTo.startsWith("/")
    ) {
      if (redirectTo === "/cart" && role !== "student") {
        toast.error(
          "Only students can purchase from the catalog. Please log in with a student account."
        );
        return "/dashboard";
      }
      return redirectTo;
    }

    try {
      const token = getCookie("token");
      if (!token) return getOnboardingRoute(role, id);

      setIsCheckingOnboarding(true);
      const startResponse = await apiRequest(
        "/api/onboarding/start",
        "POST",
        { userId: id, userType: role },
        token
      );

      if (startResponse.status === 200 && startResponse.data) {
        const onboardingStatus = startResponse.data?.status;
        if (onboardingStatus === "completed") return getDashboardRoute(role);
        if (onboardingStatus === "in_progress")
          return getOnboardingRoute(role, id);
        if (onboardingStatus === "not_started" || !onboardingStatus)
          return getOnboardingRoute(role, id);
      }
    } catch (e) {
      safeConsole.error("Error checking onboarding:", e);
    } finally {
      setIsCheckingOnboarding(false);
    }

    return getOnboardingRoute(role, id);
  };

  /* ------------------ Billing Modes & Quantity Rules ----------------- */

  // Treat per_person like one-time with optional installments (default: pay_in_full)
  const ONE_TIME_LIKE = new Set<string>(["one_time", "per_person", "per_unit"]);

  const getSupportedModesForItem = (
    item: CartItem,
    preview?: PricePreview
  ): BillingChoice[] => {
    const model = (preview?.model ||
      item.pricing?.model ||
      (item.isRecurring ? "subscription" : "one_time")) as string;

    const installmentsEnabled = !!item.pricing?.installments?.enabled;

    if (model === "subscription") return ["subscription"];
    if (ONE_TIME_LIKE.has(model)) {
      return installmentsEnabled
        ? ["pay_in_full", "installments"]
        : ["pay_in_full"];
    }
    return ["pay_in_full"];
  };

  const getDefaultModeForItem = (itemId: string): BillingChoice => {
    const item = cartItems.find((ci) => ci.id === itemId);
    if (!item) return "pay_in_full";
    const supported = getSupportedModesForItem(item, pricePreviewById[itemId]);
    return supported[0]; // defaults to pay_in_full for per_person/one_time/per_unit
  };

  const ensureDefaultMode = (itemId: string) => {
    setPaymentModeById((prev) => {
      if (prev[itemId]) return prev;
      return { ...prev, [itemId]: getDefaultModeForItem(itemId) };
    });
  };

  // Team helpers
  const isTeamSelected = () =>
    userData?.role === "teamTechProfessional" &&
    (bookingFormData?.participantType === "team" || bookingFormData?.isTeam);

  // Active team size = active/accepted members + admin(1)
  const getTeamSize = () => {
    const activeCount = Array.isArray(members)
      ? members.filter((m) => {
          const s = String(m?.status || "").toLowerCase();
          return ["active", "accepted"].includes(s) || !s;
        }).length
      : 0;
    return activeCount + 1;
  };

  // Min/Max from product.pricing
  const getMinQty = (item: CartItem) => Math.max(1, item?.pricing?.minQty ?? 1);
  const getMaxQty = (item: CartItem) => item?.pricing?.maxQty ?? Infinity;

  // Resolve quantity: team → team size; individual → 1; else explicit numberOfParticipants or 1
  const resolveQuantityForItem = (item: CartItem) => {
    if (isTeamSelected()) return getTeamSize();
    const n = item?.bookingDetails?.numberOfParticipants;
    return typeof n === "number" && n > 0 ? n : 1;
  };

  // Enforce min/max whenever team is selected
  const validateQuantityBounds = (item: CartItem, qty: number) => {
    if (!isTeamSelected()) return { ok: true as const };
    const min = getMinQty(item);
    const max = getMaxQty(item);
    if (qty < min)
      return {
        ok: false as const,
        reason: `Team members must not be lower than ${min}.`,
      };
    if (qty > max)
      return {
        ok: false as const,
        reason: `Maximum allowed is ${max} person${max > 1 ? "s" : ""}.`,
      };
    return { ok: true as const };
  };

  const handleModeChange = async (itemId: string, mode: BillingChoice) => {
    setPaymentModeById((prev) => ({ ...prev, [itemId]: mode }));

    // fetch installments preview lazily
    if (mode === "installments" && !installmentsPreviewById[itemId]) {
      try {
        setIsFetchingInstallmentsById((prev) => ({ ...prev, [itemId]: true }));
        const token = getTokenFromCookies() || "";
        const item = cartItems.find((ci) => ci.id === itemId);

        const qty = item ? resolveQuantityForItem(item) : 1;

        const resp = await PaymentService.getInstallmentsPreview(
          itemId,
          qty,
          token
        );
        const payload: any = resp?.data;
        const ok =
          typeof payload?.ok === "boolean"
            ? payload.ok
            : typeof payload?.success === "boolean"
            ? payload.success
            : false;

        if (ok) {
          setInstallmentsPreviewById((prev) => ({
            ...prev,
            [itemId]: payload,
          }));
        } else {
          toast.error(payload?.message || "Unable to fetch installments plan");
          setInstallmentsPreviewById((prev) => ({ ...prev, [itemId]: null }));
        }
      } catch (e: any) {
        safeConsole.error("Installments preview error:", e);
        toast.error("Failed to fetch installments preview");
      } finally {
        setIsFetchingInstallmentsById((prev) => ({ ...prev, [itemId]: false }));
      }
    }
  };

  /* --------------------------- Checkout flow --------------------------- */
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
      } catch (err) {
        safeConsole.warn("Failed to fetch profile; continuing.", err);
      }
    }

    const item = cartItems.find((ci) => ci.id === productId) as
      | CartItem
      | undefined;
    if (!item) {
      toast.error("Item not found in cart");
      return;
    }

    setSelectedCheckoutItemId(productId);
    ensureDefaultMode(productId);

    // collect booking details first if needed
    if (item.requiresBooking) {
      setShowBookingDetailsForm(true);
      return;
    }

    const mode = paymentModeById[productId] || getDefaultModeForItem(productId);

    if (mode === "pay_in_full") {
      await createPaymentIntent(productId);
      setActiveFlow("payment");
      return;
    }

    // installments or subscription
    await beginSetupFlow(productId, mode as "installments" | "subscription");
  };

  // create PaymentIntent (pay-in-full)
  const createPaymentIntent = async (
    productId: string,
    overrideQty?: number
  ) => {
    try {
      const item = cartItems.find((ci) => ci.id === productId) as
        | CartItem
        | undefined;
      if (!item) {
        toast.error("Item not found in cart");
        return;
      }

      setSelectedCheckoutItemId(productId);
      setIsInitializingPayment(true);
      setPaymentError(null);

      const token = getTokenFromCookies();
      if (!token)
        throw new Error("Authentication required. Please log in again.");

      // IDs
      const userId =
        getUserId() ||
        (userData as any)?.id ||
        (userData as any)?._id ||
        (userData as any)?.userId;

      let profileId: string | null = null;
      if (profile?.profile?._id) profileId = profile.profile._id;
      else profileId = getProfileId();

      if (!userId)
        throw new Error("User ID not found. Please refresh your profile.");
      if (!profileId)
        throw new Error("Profile ID not found. Please refresh your profile.");

      // 🔢 derive quantity (team-aware) + validate
      const quantity =
        typeof overrideQty === "number"
          ? overrideQty
          : resolveQuantityForItem(item);
      const vBounds = validateQuantityBounds(item, quantity);
      if (!vBounds.ok) throw new Error(vBounds.reason);

      // 🔄 ensure preview is for this exact quantity
      await refreshPricePreview(item, quantity);
      const ppNow = pricePreviewById[item.id];

      // 💰 compute amount and currency (preview → fallback multiply)
      const currencyLower = (
        ppNow?.currency ||
        item.currency ||
        "USD"
      ).toLowerCase();

      const basePriceMajor =
        typeof item.price === "number"
          ? item.price
          : Number(String(item.price ?? 0).replace(/,/g, ""));

      const priceMajor =
        typeof ppNow?.total === "number" && (ppNow?.quantity ?? 1) === quantity
          ? ppNow.total
          : basePriceMajor * quantity;

      const amountMinor = toMinor(priceMajor, currencyLower);

      // 📎 attachments / notes gating if required
      const needsAttachment = !!item.isAttachmentRequired;
      const firstAttachment = bookingFormData.attachments?.[0];
      if (needsAttachment && !firstAttachment)
        throw new Error("Attachment URL is required for this product");
      if (needsAttachment && !bookingFormData.userNotes?.trim())
        throw new Error("User notes are required for this product");

      // 📨 backend payload (tell server the headcount too)
      const paymentData: SimplePaymentIntentRequest & {
        attachmentUrl?: string;
      } = {
        productId: item.id,
        isTeam: bookingFormData.isTeam ?? false,
        participantType: bookingFormData.participantType ?? "individual",
        numberOfExpectedParticipants: quantity,
        ...(item.requiresBooking
          ? { userNotes: bookingFormData.userNotes }
          : {}),
        ...(needsAttachment
          ? { attachments: firstAttachment, attachmentUrl: firstAttachment }
          : {}),
        ...((userData as any)?.stripeCustomerId && {
          customerId: (userData as any).stripeCustomerId,
        }),
      };

      const response: any = await PaymentService.createSimplePaymentIntent(
        paymentData,
        amountMinor,
        currencyLower,
        token
      );

      const payload: any = response?.data;
      const ok =
        typeof payload?.ok === "boolean"
          ? payload.ok
          : typeof payload?.success === "boolean"
          ? payload.success
          : false;

      if (!ok) {
        throw new Error(
          process.env.NEXT_PUBLIC_NODE_ENV === "production"
            ? "Something went wrong"
            : payload?.message || "Failed to create payment intent"
        );
      }

      const data = payload?.data || payload;
      const secret: string | undefined =
        data?.clientSecret || payload?.clientSecret;
      if (!secret || !secret.includes("_secret_"))
        throw new Error("Invalid payment intent response");

      if (data?.bookingId) setPaymentBookingId(data.bookingId);

      setPaymentClientSecret(secret);
      setPaymentAmountMinor(amountMinor); // 👈 Stripe modal shows multiplied total
      setPaymentCurrency(
        (ppNow?.currency || item.currency || "USD").toUpperCase()
      );
      setShowPaymentForm(true);
      setActiveFlow("payment");
      toast.success("Secure payment initialized");
    } catch (err: any) {
      safeConsole.error("Init payment error:", err);
      const msg = err?.message || "Failed to start payment";
      setPaymentError(
        process.env.NEXT_PUBLIC_NODE_ENV === "production"
          ? "Something went wrong"
          : msg
      );
      toast.error(
        process.env.NEXT_PUBLIC_NODE_ENV === "production"
          ? "Something went wrong"
          : msg
      );
    } finally {
      setIsInitializingPayment(false);
    }
  };

  // start SetupIntent (installments or subscription)
  const beginSetupFlow = async (
    productId: string,
    mode: "installments" | "subscription",
    overrideQty?: number
  ) => {
    try {
      const item = cartItems.find((ci) => ci.id === productId) as
        | CartItem
        | undefined;
      if (!item) {
        toast.error("Item not found in cart");
        return;
      }

      setSelectedCheckoutItemId(productId);
      setIsInitializingPayment(true);
      setPaymentError(null);

      const token = getTokenFromCookies();
      if (!token)
        throw new Error("Authentication required. Please log in again.");

      // IDs
      const userId =
        getUserId() ||
        (userData as any)?.id ||
        (userData as any)?._id ||
        (userData as any)?.userId;

      let profileId: string | null = null;
      if (profile?.profile?._id) profileId = profile.profile._id;
      else profileId = getProfileId();

      if (!userId)
        throw new Error("User ID not found. Please refresh your profile.");
      if (!profileId)
        throw new Error("Profile ID not found. Please refresh your profile.");

      // derive quantity + validate
      const quantity =
        typeof overrideQty === "number"
          ? overrideQty
          : resolveQuantityForItem(item);
      // after: const quantity = ...
      await refreshPricePreview(item, quantity);

      const vBounds = validateQuantityBounds(item, quantity);
      if (!vBounds.ok) throw new Error(vBounds.reason);

      if (mode === "installments" && !installmentsPreviewById[productId]) {
        await handleModeChange(productId, "installments"); // fetch plan
        if (!installmentsPreviewById[productId])
          throw new Error("Installments plan unavailable for this product.");
      }

      const firstAttachment = bookingFormData.attachments?.[0];
      const payload: any = {
        productId,
        quantity, // ← IMPORTANT
        billingMode: mode,
        participantType: bookingFormData.participantType ?? "individual",
        isTeam: bookingFormData.isTeam ?? false,
        numberOfExpectedParticipants: quantity, // ← IMPORTANT
        ...(item.requiresBooking
          ? { userNotes: bookingFormData.userNotes }
          : {}),
        ...(item.isAttachmentRequired && firstAttachment
          ? { attachmentUrl: firstAttachment }
          : {}),
        plan: installmentsPreviewById[productId]?.plan || undefined,
        ...((userData as any)?.stripeCustomerId && {
          customerId: (userData as any).stripeCustomerId,
        }),
      };

      // Persist payload if you need it later (as you did before)
      localStorage.setItem("pendingSetupPayload", JSON.stringify(payload));

      const startResp = await PaymentService.startInstallmentsSetup(
        payload,
        token
      );
      const startPayload: any = startResp?.data;
      const okStart =
        typeof startPayload?.ok === "boolean"
          ? startPayload.ok
          : typeof startPayload?.success === "boolean"
          ? startPayload.success
          : false;

      if (!okStart) {
        throw new Error(startPayload?.message || "Failed to start setup");
      }

      const setupSecret =
        startPayload?.data?.clientSecret ?? startPayload?.clientSecret;

      if (!setupSecret || !setupSecret.includes("_secret_"))
        throw new Error("Invalid SetupIntent response");

      setPaymentClientSecret(setupSecret);
      setPaymentAmountMinor(null);
      setPaymentCurrency(
        (
          pricePreviewById[productId]?.currency ||
          item.currency ||
          "USD"
        ).toUpperCase()
      );
      setShowPaymentForm(true);
      setActiveFlow(
        mode === "installments" ? "setup-installments" : "setup-subscription"
      );
      toast.success("Secure setup started");
    } catch (err: any) {
      safeConsole.error("Begin setup error:", err);
      const msg = err?.message || "Failed to start billing setup";
      setPaymentError(
        process.env.NEXT_PUBLIC_NODE_ENV === "production"
          ? "Something went wrong"
          : msg
      );
      toast.error(
        process.env.NEXT_PUBLIC_NODE_ENV === "production"
          ? "Something went wrong"
          : msg
      );
    } finally {
      setIsInitializingPayment(false);
    }
  };

  // called after confirmCardSetup succeeds
  const handleSetupSuccess = async (setupIntentId: string) => {
    try {
      if (!selectedCheckoutItemId) return;
      const item = cartItems.find((ci) => ci.id === selectedCheckoutItemId) as
        | CartItem
        | undefined;
      if (!item) return;

      const token = getTokenFromCookies() || "";
      const mode = (paymentModeById[selectedCheckoutItemId] ||
        getDefaultModeForItem(selectedCheckoutItemId)) as
        | "installments"
        | "subscription";

      const quantity = resolveQuantityForItem(item);
      const payload: any = {
        productId: selectedCheckoutItemId,
        quantity,
        billingMode: mode,
        setupIntentId,
        plan:
          installmentsPreviewById[selectedCheckoutItemId]?.plan || undefined,
      };

      const confirmResp = await PaymentService.confirmInstallments(
        payload,
        token
      );

      const out: any = confirmResp?.data;
      const ok =
        typeof out?.ok === "boolean"
          ? out.ok
          : typeof out?.success === "boolean"
          ? out.success
          : false;

      if (!ok) {
        throw new Error(
          out?.message || out?.error || "Failed to finalize setup"
        );
      }

      toast.success(
        mode === "installments"
          ? "Installment plan activated"
          : "Subscription started"
      );
      if (selectedCheckoutItemId) removeFromCart(selectedCheckoutItemId);
      handleClosePaymentForm();
    } catch (err: any) {
      safeConsole.error("Confirm setup error:", err);
      toast.error(err?.message || "Failed to finalize billing setup");
    }
  };

  const handlePaymentSuccess = () => {
    safeConsole.log("✅ [CartPage] Payment Success Handler Called:", {
      selectedCheckoutItemId,
      paymentAmountMinor,
      paymentCurrency,
      paymentBookingId,
      activeFlow,
    });
    if (selectedCheckoutItemId) removeFromCart(selectedCheckoutItemId);
    setShowPaymentForm(false);
    setPaymentClientSecret(null);
    setSelectedCheckoutItemId(null);
    setPaymentAmountMinor(null);
    setPaymentCurrency(null);
    setPaymentBookingId(null);
    setActiveFlow(null);
  };
  const handlePaymentError = (error: string) => {
    safeConsole.error("❌ [CartPage] Payment Error Handler Called:", {
      error,
      selectedCheckoutItemId,
      paymentAmountMinor,
      paymentCurrency,
      activeFlow,
    });
    setPaymentError(error);
    toast.error(`Payment failed: ${error}`);
  };
  const handleClosePaymentForm = () => {
    setShowPaymentForm(false);
    setPaymentClientSecret(null);
    setSelectedCheckoutItemId(null);
    setPaymentError(null);
    setPaymentAmountMinor(null);
    setPaymentCurrency(null);
    setPaymentBookingId(null);
    setActiveFlow(null);
  };

  /* ---------------------- Booking form handlers ---------------------- */
  const handleBookingFormSubmit = async () => {
    if (!selectedCheckoutItemId) return;
    const item = cartItems.find((ci) => ci.id === selectedCheckoutItemId) as
      | CartItem
      | undefined;
    if (!item) return;

    if (item.isAttachmentRequired) {
      if (!bookingFormData.userNotes.trim()) {
        toast.error("User notes are required for this service");
        return;
      }
      if (bookingFormData.attachments.length === 0) {
        toast.error("At least one attachment is required for this service");
        return;
      }
    }

    // derive & validate quantity (team rules apply regardless of model)
    const qty = resolveQuantityForItem(item);
    const { ok, reason } = validateQuantityBounds(item, qty);
    if (!ok) {
      toast.error(reason!);
      return;
    }

    // Optional: refresh preview with resolved headcount so numbers match charge
    try {
      const token = getTokenFromCookies() || "";
      const resp = await PaymentService.getPricePreview(item.id, qty, token);
      const data = resp?.data;
      if (data?.ok) {
        setPricePreviewById((prev) => ({
          ...prev,
          [item.id]: {
            ok: true,
            currency: (data.currency || item.currency || "USD").toUpperCase(),
            quantity: qty,
            subtotal: data.subtotal ?? 0,
            vat: data.vat ?? 0,
            total: data.total ?? 0,
            unitPrice: data.unitPrice,
            model: data.model,
            tierType: data.tierType,
          },
        }));
      }
    } catch (e) {
      safeConsole.warn("Price preview refresh failed:", e);
    }

    setShowBookingDetailsForm(false);

    // Route based on billing choice
    const mode =
      paymentModeById[selectedCheckoutItemId] ||
      getDefaultModeForItem(selectedCheckoutItemId);

    if (mode === "pay_in_full") {
      await createPaymentIntent(selectedCheckoutItemId, qty);
    } else {
      await beginSetupFlow(
        selectedCheckoutItemId,
        mode as "installments" | "subscription",
        qty
      );
    }
  };

  const handleBookingFormCancel = () => {
    setShowBookingDetailsForm(false);
    setSelectedCheckoutItemId(null);
    setBookingFormData({
      userNotes: "",
      attachments: [],
      participantType: "individual",
      isTeam: false,
    });
  };

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

  /* --------------------------- Quick auth --------------------------- */
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
      if (response.status >= 400)
        throw new Error(response.data.message || "Registration failed");
      toast.success("Account created! Check your email to verify.");
      setAuthEmail("");
      setAuthPassword("");
      setAuthError("");
      setIsLoginMode(true);

      if (response.data?.user && response.data?.access_token) {
        const u = response.data.user;
        const t = response.data.access_token;
        saveTokenToCookies(t);
        saveUserDataToCookies(u);
        setUserData(u);
        setUserRole(u.role || "student");
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
      if (response.status >= 400)
        throw new Error(response.data?.message || "Login failed");

      const possibleTokenPaths = [
        response.data?.token,
        response.data?.accessToken,
        response.data?.data?.token,
        response.data?.data?.accessToken,
        response.data?.access_token,
        response.data?.data?.access_token,
      ];
      const token = possibleTokenPaths.find((t) => t);

      const possibleUserPaths = [
        response.data?.user,
        response.data?.userData,
        response.data?.data?.user,
        response.data?.data?.userData,
      ];
      const user = possibleUserPaths.find((u) => u);

      if (token) saveTokenToCookies(token as string);
      if (user) saveUserDataToCookies(user);

      toast.success("Login successful!");
      setAuthEmail("");
      setAuthPassword("");
      setAuthError("");

      if (token && user) {
        setUserData(user);
        setUserRole(user.role || "student");
        setIsAuthenticated(true);

        const role: string = user.role || "student";
        const userId: string =
          user?.id || user?._id || user?.userId || user?.user_id || "";

        try {
          const startResp = await postApiRequest(
            "/api/onboarding/start",
            { userId, userType: role },
            { Authorization: `Bearer ${token}` }
          );

          const onboardingStatus =
            startResp?.data?.status ??
            startResp?.data?.data?.status ??
            "unknown";
          if (onboardingStatus === "completed") {
            window.location.href = getDashboardRoute(role);
            return;
          }
          window.location.href = getOnboardingRoute(role, userId);
          return;
        } catch (e) {
          safeConsole.error("Onboarding check failed:", e);
          window.location.href = getOnboardingRoute(role, userId);
          return;
        }
      } else {
        try {
          const ok = await refreshAuth();
          if (!ok) window.location.reload();
        } catch {
          window.location.reload();
        }
      }
    } catch (error: any) {
      safeConsole.error("Login error:", error);
      setAuthError(error?.message || "Failed to login");
    } finally {
      setIsAuthLoading(false);
    }
  };

  /* --------------------- Fetch price previews --------------------- */
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const token = getTokenFromCookies();
      await Promise.all(
        cartItems.map(async (item) => {
          // default preview quantity (won't include team until they choose it in modal)
          const qty =
            item?.bookingDetails?.numberOfParticipants &&
            item.bookingDetails.numberOfParticipants > 0
              ? item.bookingDetails.numberOfParticipants
              : 1;
          try {
            const resp = await PaymentService.getPricePreview(
              item.id,
              qty,
              token || ""
            );
            const data = resp?.data;
            if (!cancelled && data?.ok) {
              setPricePreviewById((prev) => ({
                ...prev,
                [item.id]: {
                  ok: true,
                  currency: (
                    data.currency ||
                    item.currency ||
                    "USD"
                  ).toUpperCase(),
                  quantity: data.quantity ?? qty,
                  subtotal: data.subtotal ?? 0,
                  vat: data.vat ?? 0,
                  total: data.total ?? 0,
                  unitPrice: data.unitPrice,
                  model: data.model,
                  tierType: data.tierType,
                },
              }));
              ensureDefaultMode(item.id);
            }
          } catch (e) {
            safeConsole.warn("Price preview failed:", e);
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

  /* ---------------- Team fetch when teamTechProfessional ------------- */
  useEffect(() => {
    if (isAuthenticated && userData?.role === "teamTechProfessional") {
      fetchTeamData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, userData?.role]);

  const fetchTeamData = async () => {
    try {
      setTeamLoading(true);
      const token = getTokenFromCookies();
      const meResp = await getApiRequest("/api/users/me", token || undefined);
      if (meResp.status >= 400) throw new Error("Failed to fetch user data");

      const me = meResp?.data?.data?.data;

      // Try multiple shapes to find teamId
      const teamId = meResp.data?.data?.data?.profile?._id;

      if (!teamId) throw new Error("No team ID found in user profile");

      const [teamResp, membersResp] = await Promise.all([
        getApiRequest(`/api/teams/${teamId}`, token || undefined),
        getApiRequest(`/api/teams/${teamId}/members`, token || undefined),
      ]);

      if (teamResp.status >= 400) throw new Error("Failed to fetch team data");
      if (membersResp.status >= 400)
        throw new Error("Failed to fetch team members");

      setTeamData(teamResp.data?.data);
      const list = membersResp.data?.data?.members || [];
      setMembers(Array.isArray(list) ? list : []);
    } catch (error: any) {
      safeConsole.error("Error fetching team data:", error);
      toast.error(
        process.env.NEXT_PUBLIC_NODE_ENV === "production"
          ? "Something went wrong"
          : error.message || "Failed to load team data"
      );
    } finally {
      setTeamLoading(false);
    }
  };

  /* ---------------- Auto-redirect on success banner --------------- */
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => (window.location.href = "/dashboard"), 5000);
      return () => clearTimeout(t);
    }
  }, [success]);

  /* ------------------------- Empty Cart UI ------------------------- */
  if (cartCount === 0) {
    return (
      <section>
        <div className="min-h-screen bg-gray-50 mt-[3rem] py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
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
                <Link href="/pricing">
                  <Button className="bg-[#0D1140] hover:bg-blue-700 text-white px-8 py-3 rounded-[10px]">
                    Browse Courses
                  </Button>
                </Link>
                <div>
                  <Link
                    href="/pricing"
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

  /* --------------------------- Main Cart UI --------------------------- */
  const selectedItem = selectedCheckoutItemId
    ? (cartItems.find((ci) => ci.id === selectedCheckoutItemId) as
        | CartItem
        | undefined)
    : undefined;

  return (
    <div className="min-h-screen bg-gray-50 mt-[5rem] md:mt-[4rem] py-8 md:py-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
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

              {isAuthenticated && (
                <div className="p-6">
                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="text-center py-6">
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <User className="w-8 h-8 text-green-600" />
                        <h3 className="text-xl font-semibold text-green-800">
                          Welcome back, {userData.fullName || userData.email}!
                        </h3>
                      </div>
                      <p className="text-green-700">
                        You're all set to complete your purchase. Click
                        "Purchase Now" (or "Subscribe") on any course to
                        proceed.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-[10px] border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Cart Total
                      </h3>
                      <p className="text-sm text-gray-600">
                        {cartItems.length} item
                        {cartItems.length !== 1 ? "s" : ""} in your cart
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(calculateTotal(), getCartCurrency())}
                      </p>
                      <p className="text-xs text-gray-500">
                        Prices provided by service (incl. VAT if applicable)
                      </p>
                    </div>
                  </div>
                </div>

                {cartItems.map((item: CartItem) => {
                  const pp = pricePreviewById[item.id];
                  const supportedModes = getSupportedModesForItem(item, pp); // per_person defaults to pay_in_full, allows installments if enabled
                  const choice =
                    paymentModeById[item.id] || getDefaultModeForItem(item.id);
                  const canInstallments =
                    supportedModes.includes("installments");
                  const showModeToggle = supportedModes.length > 1;

                  const isLoadingPlan = !!isFetchingInstallmentsById[item.id];
                  const plan: any = installmentsPreviewById[item.id]?.plan;

                  const displayCurrency = (
                    pp?.currency ||
                    item.currency ||
                    "USD"
                  ).toUpperCase();
                  const displayAmount = pp?.total ?? item.price ?? 0;

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col lg:flex-row items-start gap-4 p-6 border border-gray-200 rounded-[12px] hover:shadow-md transition-all duration-200 bg-white"
                    >
                      {/* image */}
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

                      {/* details */}
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
                                userData.role || ""
                              )
                                ? "default"
                                : "destructive"
                            }
                            className="text-sm"
                          >
                            {item.productType || "Training & Certification"}
                          </Badge>
                        </div>

                        {isAuthenticated && item.requiresBooking && (
                          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-[10px]">
                            <div className="flex items-center gap-2 text-blue-700">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                Bookable Service
                              </span>
                            </div>
                            <p className="text-xs text-blue-600 mt-1">
                              Additional details will be collected during
                              checkout
                            </p>
                          </div>
                        )}

                        {!canPurchaseProductType(
                          item.productType,
                          userData.role || ""
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

                        {/* Billing choice UI — only show if there is actually a choice */}
                        <div className="space-y-2">
                          {showModeToggle && (
                            <div className="inline-flex rounded-md shadow-sm border border-gray-200 overflow-hidden">
                              {supportedModes.includes("pay_in_full") && (
                                <Button
                                  type="button"
                                  variant={
                                    choice === "pay_in_full"
                                      ? "default"
                                      : "ghost"
                                  }
                                  className={`px-3 py-1 rounded-none ${
                                    choice === "pay_in_full" ? "" : "bg-white"
                                  }`}
                                  onClick={() =>
                                    handleModeChange(item.id, "pay_in_full")
                                  }
                                >
                                  Pay in full
                                </Button>
                              )}

                              {canInstallments && (
                                <Button
                                  type="button"
                                  variant={
                                    choice === "installments"
                                      ? "default"
                                      : "ghost"
                                  }
                                  className={`px-3 py-1 rounded-none ${
                                    choice === "installments" ? "" : "bg-white"
                                  }`}
                                  onClick={() =>
                                    handleModeChange(item.id, "installments")
                                  }
                                >
                                  Pay in 6 months
                                </Button>
                              )}

                              {supportedModes.includes("subscription") && (
                                <Button
                                  type="button"
                                  variant={
                                    choice === "subscription"
                                      ? "default"
                                      : "ghost"
                                  }
                                  className={`px-3 py-1 rounded-none ${
                                    choice === "subscription" ? "" : "bg-white"
                                  }`}
                                  onClick={() =>
                                    handleModeChange(item.id, "subscription")
                                  }
                                >
                                  Subscribe monthly
                                </Button>
                              )}
                            </div>
                          )}

                          {/* Hints */}
                          {choice === "installments" && (
                            <div className="text-xs text-gray-600">
                              {isLoadingPlan && <span>Fetching plan…</span>}
                              {!isLoadingPlan && plan && (
                                <span>
                                  Pay today:{" "}
                                  {formatCurrency(
                                    plan.downPaymentAmount || 0,
                                    displayCurrency
                                  )}
                                  {" · "}Then {plan.count ?? 5}×{" "}
                                  {formatCurrency(
                                    plan.installmentAmount || 0,
                                    displayCurrency
                                  )}
                                  {" every "}
                                  {plan.intervalCount ?? 1}{" "}
                                  {plan.interval ?? "month"}
                                  {(plan.intervalCount ?? 1) > 1 ? "s" : ""}
                                </span>
                              )}
                              {!isLoadingPlan && !plan && (
                                <span className="text-red-600">
                                  Installments unavailable for this item.
                                </span>
                              )}
                            </div>
                          )}

                          {choice === "subscription" && (
                            <div className="text-xs text-gray-600">
                              This item bills on a recurring basis. You’ll add a
                              payment method now and be charged per cycle.
                            </div>
                          )}
                        </div>
                      </div>

                      {/* price + actions */}
                      <div className="w-full lg:w-auto lg:text-right space-y-4">
                        <div className="text-center lg:text-right">
                          <p className="text-3xl font-bold text-[#011F72] mb-1">
                            {formatCurrency(displayAmount, displayCurrency)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {choice === "subscription"
                              ? "per cycle"
                              : "per course"}
                          </p>
                        </div>

                        <div className="flex flex-col gap-3">
                          <Button
                            onClick={() => handleProductCheckout(item.id)}
                            className="w-full lg:w-48 bg-[#0D1140] hover:bg-blue-700 text-white text-base py-3 px-6 rounded-[10px] font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                            disabled={
                              isInitializingPayment ||
                              !canPurchaseProductType(
                                item.productType,
                                userData.role || ""
                              ) ||
                              (choice === "installments" &&
                                (!installmentsPreviewById[item.id] ||
                                  isLoadingPlan))
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
                                  ? "Login to Continue"
                                  : choice === "subscription"
                                  ? "Subscribe"
                                  : choice === "installments"
                                  ? "Start Plan"
                                  : "Purchase Now"}
                              </>
                            )}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRemoveItem(item.id, item.title)
                            }
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
          </div>
        </div>

        {/* Auth section */}
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

        {/* Stripe Payment / Setup Form */}
        {showPaymentForm && paymentClientSecret && selectedCheckoutItemId && (
          <div className="max-w-3xl mx-auto mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    {activeFlow?.startsWith("setup")
                      ? "Add Payment Method"
                      : "Secure Payment"}
                  </span>
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

                {(() => {
                  const sel = cartItems.find(
                    (ci) => ci.id === selectedCheckoutItemId
                  );
                  const pp = selectedCheckoutItemId
                    ? pricePreviewById[selectedCheckoutItemId]
                    : undefined;
                  const currency = (
                    paymentCurrency ??
                    pp?.currency ??
                    sel?.currency ??
                    "USD"
                  ).toUpperCase();

                  return (
                    <StripePaymentForm
                      mode={
                        activeFlow?.startsWith("setup") ? "setup" : "payment"
                      }
                      clientSecret={paymentClientSecret}
                      amount={
                        activeFlow === "payment"
                          ? paymentAmountMinor ??
                            (pp
                              ? toMinor(pp.total, pp.currency)
                              : toMinor(
                                  sel?.price || 0,
                                  sel?.currency || "USD"
                                ))
                          : undefined
                      }
                      currency={currency}
                      onSuccess={handlePaymentSuccess} // PaymentIntent (pay-in-full)
                      onSetupSuccess={handleSetupSuccess} // SetupIntent (installments/subscription)
                      onError={handlePaymentError}
                      onClose={handleClosePaymentForm}
                      productName={sel?.title || "Course"}
                      bookingId={paymentBookingId}
                    />
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Keep mount order stable for modal layers */}
        {showPaymentForm /* keep above */}

        {/* Booking Details Modal */}
        {showBookingDetailsForm && selectedCheckoutItemId && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[10px] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Additional Booking Details
                  </h2>
                  <button
                    onClick={handleBookingFormCancel}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {selectedItem.requiresBooking && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        User Notes
                        {selectedItem.isAttachmentRequired && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <textarea
                        value={bookingFormData.userNotes}
                        onChange={(e) =>
                          setBookingFormData((prev) => ({
                            ...prev,
                            userNotes: e.target.value,
                          }))
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          selectedItem.isAttachmentRequired &&
                          !bookingFormData.userNotes
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        rows={4}
                        placeholder={
                          selectedItem.isAttachmentRequired
                            ? "Please provide detailed notes about your requirements..."
                            : "Any special requirements, questions, or additional information..."
                        }
                        required={selectedItem.isAttachmentRequired}
                      />
                      {selectedItem.isAttachmentRequired &&
                        !bookingFormData.userNotes && (
                          <p className="text-xs text-red-500 mt-1">
                            User notes are required for this service
                          </p>
                        )}
                    </div>
                  )}

                  {/* Team vs Individual selection (for teamTechProfessional) */}
                  {userData?.role === "teamTechProfessional" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Booking Type
                      </label>
                      <select
                        value={bookingFormData.participantType}
                        onChange={(e) => {
                          const pt = e.target.value as "individual" | "team";
                          setBookingFormData((prev) => ({
                            ...prev,
                            participantType: pt,
                            isTeam: pt === "team",
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="individual">For Myself Only</option>
                        <option value="team">For My Team</option>
                      </select>

                      {/* Headcount + limits */}
                      {isTeamSelected() && (
                        <p className="text-xs text-gray-600 mt-2">
                          Headcount detected: <strong>{getTeamSize()}</strong>.
                          Limits: min {getMinQty(selectedItem)}, max{" "}
                          {getMaxQty(selectedItem)}.
                        </p>
                      )}

                      {/* Violation message */}
                      {(() => {
                        if (!isTeamSelected()) return null;
                        const qty = resolveQuantityForItem(selectedItem);
                        const v = validateQuantityBounds(selectedItem, qty);
                        return v.ok ? null : (
                          <p className="text-xs text-red-600 mt-1">
                            {v.reason}
                          </p>
                        );
                      })()}

                      {/* Team loading hint */}
                      {isTeamSelected() && teamLoading && (
                        <p className="text-xs text-blue-600 mt-1">
                          Loading your team…
                        </p>
                      )}
                    </div>
                  )}

                  {selectedItem.requiresBooking && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Attachments
                        {selectedItem.isAttachmentRequired ? (
                          <span className="text-red-500 ml-1">*</span>
                        ) : (
                          <span className="text-gray-500 ml-1">(Optional)</span>
                        )}
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-[10px] p-6 text-center">
                        <input
                          type="file"
                          id="attachment-upload"
                          multiple
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            files.forEach((file) =>
                              handleAttachmentUpload(file)
                            );
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
                            PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB each)
                          </span>
                        </label>
                      </div>

                      {bookingFormData.attachments.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {bookingFormData.attachments.map(
                            (attachment, index) => (
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
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      )}

                      {isUploadingAttachment && (
                        <div className="mt-2 flex items-center text-sm text-blue-600">
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Uploading...
                        </div>
                      )}
                      {selectedItem.isAttachmentRequired &&
                        bookingFormData.attachments.length === 0 && (
                          <p className="text-xs text-red-500 mt-2">
                            At least one attachment is required for this service
                          </p>
                        )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-8">
                  <Button
                    variant="outline"
                    onClick={handleBookingFormCancel}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBookingFormSubmit}
                    className="px-6 bg-blue-600 hover:bg-blue-700"
                    disabled={
                      isInitializingPayment ||
                      // block when team selected while loading team
                      (isTeamSelected() && teamLoading) ||
                      // block on min/max violation
                      (() => {
                        if (!selectedItem) return false;
                        if (!isTeamSelected()) return false;
                        const qty = resolveQuantityForItem(selectedItem);
                        return !validateQuantityBounds(selectedItem, qty).ok;
                      })() ||
                      // existing attachment gates
                      (selectedItem.isAttachmentRequired &&
                        (!bookingFormData.userNotes.trim() ||
                          bookingFormData.attachments.length === 0))
                    }
                  >
                    {isInitializingPayment ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      "Continue to Payment"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
