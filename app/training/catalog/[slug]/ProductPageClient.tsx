"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import type { Currency, Pricing } from "@/lib/constants/pricing";
import { normalizeCartModel } from "@/utils/helpers";
import { getCurrencySymbol } from "@/lib/constants/currencies";
import { teamFetcher } from "@/utils/teamFetcher";
import { getPrimaryPrice } from "@/utils/pricingDisplay";

/* ----------------------------- Pricing helpers ----------------------------- */

const getUpTo = (t: any): number | undefined =>
  typeof t?.upTo === "number"
    ? t.upTo
    : typeof t?.upto === "number"
      ? t.upto
      : undefined;

const pickTier = (tiers: any[] = [], qty: number) => {
  if (!tiers.length) return { tier: undefined, index: -1 };

  // Find smallest upTo >= qty (hit tier) and track max tier as fallback
  let bestUpTo: number | null = null;
  let bestIndex = -1;

  let maxUpTo = -Infinity;
  let maxIndex = -1;

  for (let i = 0; i < tiers.length; i++) {
    const t = tiers[i];
    if (!t) continue;
    const cap = getUpTo(t);

    if (typeof cap !== "number" || !Number.isFinite(Number(t.unitPrice))) {
      continue;
    }

    // candidate hit tier
    if (cap >= qty && (bestUpTo === null || cap < bestUpTo)) {
      bestUpTo = cap;
      bestIndex = i;
    }

    // track max tier (for qty above all caps)
    if (cap > maxUpTo) {
      maxUpTo = cap;
      maxIndex = i;
    }
  }

  // Return best match or fallback to max tier
  if (bestIndex >= 0) {
    return { tier: tiers[bestIndex], index: bestIndex };
  }
  if (maxIndex >= 0) {
    return { tier: tiers[maxIndex], index: maxIndex };
  }

  return { tier: undefined, index: -1 };
};

const isPerUnit = (pricing?: Partial<Pricing> | null): boolean => {
  if (!pricing) return false;
  // Support both legacy (model: "per_unit") and new structure (priceBasis: "per_unit")
  return (
    pricing.priceBasis === "per_unit" || (pricing.model as any) === "per_unit"
  );
};

const isStairstep = (pricing: Partial<Pricing> | null): boolean =>
  pricing
    ? isPerUnit(pricing) && (pricing.tierType ?? "volume") === "stairstep"
    : false;

const isVolume = (pricing?: Partial<Pricing> | null): boolean =>
  pricing
    ? isPerUnit(pricing) && (pricing.tierType ?? "volume") !== "stairstep"
    : false;

/**
 * Display amount rules:
 * - one_time → basePrice
 * - subscription → subscriptionPrice
 * - per_unit / volume → (per-unit price at tier picked by membersCount) × (membersCount + 1 admin)
 * - per_unit / stairstep → flat band price (tier picked by membersCount), no multiplication
 */
const teamAwareDisplayAmount = (
  pricing: Partial<Pricing> | null,
  membersCount: number, // ← number of team members (EXCLUDING admin)
  discountPercentage: number = 0
): number => {
  if (!pricing) return 0;
  const toNum = (v: any): number => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  let amount = 0;

  // Handle per_unit pricing (legacy: model="per_unit", new: priceBasis="per_unit")
  if (isPerUnit(pricing)) {
    // Tier selection based on total count (members + admin)
    const tierQty = Math.max(1, membersCount + 1);
    const { tier } = pickTier(pricing.tiers ?? [], tierQty);
    const unitOrFlat = toNum(tier?.unitPrice ?? pricing.basePrice ?? 0);

    if (isStairstep(pricing)) {
      // flat band total
      amount = unitOrFlat;
    } else {
      // volume → multiply by (members + admin)
      const qtyMultiplier = Math.max(1, membersCount + 1);
      amount = toNum(unitOrFlat * qtyMultiplier);
    }
  } else {
    switch (pricing.model) {
      case "one_time":
        amount = toNum(pricing.basePrice ?? (pricing as any)?.price ?? 0);
        break;

      case "subscription":
        // Fallback to basePrice if subscriptionPrice missing in API
        amount = toNum(
          (pricing as any)?.subscriptionPrice ?? pricing.basePrice ?? 0
        );
        break;

      default:
        amount = 0;
    }
  }

  if (discountPercentage > 0) {
    amount = amount * (1 - discountPercentage / 100);
  }

  return Math.round(amount * 100) / 100;
};

const pricingBadgeLabel = (pricing: Pricing | undefined): string => {
  if (!pricing) return "unit";
  if (isPerUnit(pricing)) {
    return isStairstep(pricing) ? "flat" : pricing.unitName || "unit";
  }
  if (pricing.model === "one_time") return "person";
  if (pricing.model === "subscription") return "team";
  return "unit";
};

/** For our totals view, we never append "/". Keep slash only for one_time. */
const showSlash = (pricing: Pricing | undefined): boolean =>
  pricing?.model === "one_time";

interface ProductPageClientProps {
  product: Product;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const { addToCart, isInCart } = useCart();
  const { members, fetchTeamData } = teamFetcher();

  const membersCount = Math.max(0, members?.length || 0); // excludes admin
  const qtyMultiplier = Math.max(1, membersCount + 1); // includes admin

  useEffect(() => {
    fetchTeamData();
  }, [fetchTeamData]);

  const priceFromPricing = product.pricing
    ? getPrimaryPrice({ pricing: product.pricing })
    : undefined;

  const cartCurrency = (product.pricing?.currency ||
    product.currency ||
    "USD") as Currency;

  const cartPrice =
    typeof priceFromPricing === "number"
      ? priceFromPricing
      : Number(product.price ?? 0); // ensure numeric

  const effectiveDiscount =
    product.pricing?.discountPercentage || product.discountPercentage || 0;

  const displayAmount = teamAwareDisplayAmount(
    (product.pricing as Partial<Pricing>) || null,
    membersCount,
    effectiveDiscount
  );

  const originalAmount = teamAwareDisplayAmount(
    (product.pricing as Partial<Pricing>) || null,
    membersCount,
    0
  );

  const handleEnroll = () => {
    // Check if product requires booking
    const requiresBooking =
      product.requiresBooking || product.isBookableService || false;

    // NEW FLOW: Add all products to cart (both bookable and non-bookable)
    const cartItem: CartItem = {
      id: product._id,
      title: product.service,
      description: product.description || "",
      price: cartPrice, // ✅ safe numeric
      currency: cartCurrency, // ✅ from pricing or fallback
      discountPercentage: effectiveDiscount,
      category:
        product.productCategoryTitle || product.category || "Uncategorized",
      productType: product.productType,
      image:
        product.thumbnailUrl ||
        product.iconUrl ||
        "/assets/techedusolution.jpg",
      duration: `${product.programLength} ${product.mode}`,
      certificate: product.hasCertificate,
      status: product.enabled ? "active" : "inactive",
      level: product.productSubcategoryName || "",
      requiresBooking: requiresBooking,
      pricing: product.pricing
        ? {
          model: normalizeCartModel(product.pricing?.model),
          priceBasis: (product.pricing as any)?.priceBasis,
          unitName: (product.pricing as any)?.unitName || "team",
          currency: (product.currency || "usd").toLowerCase(),
          allowQuantity: !!product.pricing?.allowQuantity,
          minQty:
            typeof product.pricing?.minQty === "number"
              ? product.pricing.minQty
              : 1,
          maxQty:
            typeof product.pricing?.maxQty === "number"
              ? product.pricing.maxQty
              : 0,
          tierType: product.pricing?.tierType,
          taxInclusive: !!product.pricing?.taxInclusive,
          // per-unit tiers (if present)
          tiers: Array.isArray((product.pricing as any)?.tiers)
            ? (product.pricing as any).tiers
            : undefined,
          // base one-time price (treat free as 0)
          basePrice:
            product.pricing?.model === "free"
              ? 0
              : product.pricing?.basePrice ?? Number(product.price ?? 0),
          vatPercentage: product.pricing?.vatPercentage,
          discountPercentage: effectiveDiscount,
          // installments (support hour/day/week/month/year)
          installments: product.pricing?.installments?.enabled
            ? {
              enabled: true,
              count: product.pricing?.installments?.count || 2,
              downPaymentType:
                product.pricing?.installments?.downPaymentType,
              downPaymentValue:
                product.pricing?.installments?.downPaymentValue || 0,
              interval:
                (product.pricing?.installments as any)?.interval || "month",
              intervalCount:
                product.pricing?.installments?.intervalCount || 1,
              allowEarlyPayoff:
                product.pricing?.installments?.allowEarlyPayoff,
            }
            : { enabled: false },
          // subscription-like
          subscriptionPrice:
            product.pricing?.model === "subscription"
              ? product.pricing?.basePrice
              : undefined,
          interval: (product.pricing as any)?.interval,
          intervalCount: product.pricing?.intervalCount,
          trialDays: product.pricing?.trialDays,
          setupFee: product.pricing?.setupFee,
          proration: product.pricing?.proration,
        }
        : undefined,

      // Product details for booking
      deliveryMode: product.deliveryMode,
      sessionType: product.sessionType,
      isRecurring: product.isRecurring,
      programLength: product.programLength,
      mode: product.mode,
      durationInMinutes: product.durationInMinutes,
      minutesPerSession: product.minutesPerSession,
      hasClassroom: product.hasClassroom,
      hasSession: product.hasSession,
      hasAssessment: product.hasAssessment,
      hasCertificate: product.hasCertificate,
      requiresEnrollment: product.requiresEnrollment,
      isBookableService: product.isBookableService,
      isAttachmentRequired: product.isAttachmentRequired || false,
      instructorId: product.instructorId,
      instructorName: product.instructorName,
      virtualPlatform: product.virtualPlatform,
      classroomCapacity: product.classroomCapacity,
      classroomRequirements: product.classroomRequirements,

      // NEW: Add booking details for bookable services
      bookingDetails: requiresBooking
        ? {
          fullName: "", // Will be filled in cart
          email: "", // Will be filled in cart
          phone: "", // Will be filled in cart
          preferredDate: undefined, // Will be filled in cart
          preferredTime: "", // Will be filled in cart
          numberOfParticipants: 1,
          participantType: "individual" as const,
          userNotes: "",
          bookingId: "", // Will be generated during payment intent creation
          bookingData: {
            productId: product._id,
            productType: product.productType,
            instructorId: product.instructorId,
            bookingPurpose: product.service,
            minutesPerSession: product.minutesPerSession,
            durationInMinutes: product.durationInMinutes,
            numberOfExpectedParticipants: 1,
            isClassroom: product.hasClassroom,
            isSession: product.hasSession,
            participantType: "individual",
            platformRole: "student", // Will be updated based on user role
            email: "", // Will be filled in cart
            fullName: "", // Will be filled in cart
            createdBy: "", // Will be filled in cart
            profileId: "", // Will be filled in cart
            participants: [], // Will be filled in cart
            actualDaysAndTime: [], // Will be filled in cart
          },
        }
        : undefined,
    };
    addToCart(cartItem);
  };

  const formatDuration = () => {
    if (product.mode === "days") {
      return `${product.programLength} day${product.programLength > 1 ? "s" : ""
        }`;
    } else if (product.mode === "weeks") {
      return `${product.programLength} week${product.programLength > 1 ? "s" : ""
        }`;
    } else if (product.mode === "months") {
      return `${product.programLength} month${product.programLength > 1 ? "s" : ""
        }`;
    }
    return `${product.programLength} ${product.mode}`;
  };

  const formatSessionInfo = () => {
    const parts = [];
    if (product.hasSession) {
      parts.push(`${product.minutesPerSession}min sessions`);
    }
    if (product.hasClassroom) {
      parts.push("Classroom available");
    }
    if (product.deliveryMode) {
      parts.push(
        product.deliveryMode.charAt(0).toUpperCase() +
        product.deliveryMode.slice(1)
      );
    }
    return parts.join(" • ");
  };

  return (
    <section className="max-w-6xl mx-auto py-12 px-4 md:px-0 mt-24">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 w-full md:w-1/2">
          <div className="relative w-full aspect-square bg-gray-100 rounded-[12px] overflow-hidden">
            <Image
              src={
                product.thumbnailUrl ||
                product.iconUrl ||
                "/assets/techedusolution.jpg"
              }
              alt={product.service}
              fill
              className="object-cover rounded-[12px]"
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {product.service}
          </h1>
          <p className="text-gray-700 text-lg mb-2">
            <div
              className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </p>

          <div className="flex flex-wrap gap-2 mb-2">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
              {product.productCategoryTitle}
            </span>
            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
              {product.productType}
            </span>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
              {product.productSubcategoryName}
            </span>
            {product.hasCertificate && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                Certificate
              </span>
            )}
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">Duration:</span>
              <span>{formatDuration()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Session Type:</span>
              <span>{product.sessionType}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Format:</span>
              <span>{formatSessionInfo()}</span>
            </div>
          </div>

          <div className="flex items-start justify-between mt-auto">
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-baseline gap-1">
                <div className="flex flex-col">
                  {effectiveDiscount > 0 && (
                    <span className="text-sm text-gray-400 line-through">
                      {getCurrencySymbol(product.currency || "gbp")}{" "}
                      {originalAmount}
                    </span>
                  )}
                  <span className="text-lg font-bold text-blue-600">
                    {getCurrencySymbol(product.currency || "gbp")} {displayAmount}
                    {showSlash(product.pricing as Pricing) ? " /" : ""}
                  </span>
                </div>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                  {pricingBadgeLabel(product.pricing as Pricing)}
                </span>
              </div>

              {isVolume(product.pricing as Pricing) && (
                <span className="text-xs text-gray-500">
                  team total for {qtyMultiplier} persons (members + admin)
                </span>
              )}
              {isStairstep(product.pricing as Pricing) && (
                <span className="text-xs text-gray-500">
                  flat band picked by {membersCount} member(s)
                </span>
              )}
            </div>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-[10px] px-6 py-2"
              onClick={handleEnroll}
              disabled={isInCart(product._id)}
            >
              {isInCart(product._id)
                ? "In Cart"
                : product.requiresBooking || product.isBookableService
                  ? "Book Now"
                  : "Enroll Now"}
            </Button>
            <Button variant="outline" className="rounded-[10px] px-6 py-2">
              Add to Wishlist
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}


