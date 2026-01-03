// components/CatalogPage.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationLink,
} from "@/components/ui/pagination";

import { useCart } from "@/contexts/CartContext";
import { useRole } from "@/contexts/RoleContext";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

import { getApiRequest } from "@/lib/apiFetch";
import { safeConsole } from "@/lib/console";
import { toast } from "react-toastify";
import type { Pricing } from "@/lib/constants/pricing";
import { normalizeCartModel, normalizeTierType } from "@/utils/helpers";
import { getCurrencySymbol } from "@/lib/constants/currencies";

// ⬇️ NEW: team hook
import { teamFetcher } from "@/utils/teamFetcher";
import { number } from "framer-motion";
import Link from "next/link";

interface CatalogPageProps {
  productType?: string;
  title?: string;
  description?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  category?: string;
  subcategory?: string;
  service?: string;
  onBookNow?: (productId: string, productName: string) => void;
}

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
  let bestPrice: number | null = null;
  let bestIndex = -1;

  let maxUpTo = -Infinity;
  let maxPrice: number | null = null;
  let maxIndex = -1;

  for (let i = 0; i < tiers.length; i++) {
    const t = tiers[i];
    if (!t) continue;
    const cap = getUpTo(t);
    const price = Number(t.unitPrice);

    if (typeof cap !== "number" || !Number.isFinite(price)) continue;

    // candidate hit tier
    if (cap >= qty && (bestUpTo === null || cap < bestUpTo)) {
      bestUpTo = cap;
      bestPrice = price;
      bestIndex = i;
    }

    // track max tier (for qty above all caps)
    if (cap > maxUpTo) {
      maxUpTo = cap;
      maxPrice = price;
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
    pricing.priceBasis === "per_unit" ||
    (pricing.model as any) === "per_unit"
  );
};

const isStairstep = (pricing: Partial<Pricing> | null): boolean =>
  pricing ? isPerUnit(pricing) && (pricing.tierType ?? "volume") === "stairstep" : false;

const isVolume = (pricing?: Partial<Pricing> | null): boolean =>
  pricing ? isPerUnit(pricing) && (pricing.tierType ?? "volume") !== "stairstep" : false;

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
  if (pricing.model === "subscription") {
    // Respect basis for subscriptions: per-unit → unit label, flat → person
    return pricing.priceBasis === "per_unit"
      ? (pricing.unitName || "unit")
      : "person";
  }
  return "unit";
};

/** For our totals view, we never append "/". Keep slash only for one_time. */
const showSlash = (pricing: Pricing | undefined): boolean =>
  pricing?.model === "one_time";

/**
 * Check if product requires teamTechProfessional role
 * Products with unitName = "team" and tierType = "volume" | "stairstep" require teamTechProfessional
 */
const requiresTeamTechProfessional = (product: Product): boolean => {
  const pricing = product.pricing;
  if (!pricing) return false;

  const unitName = (pricing as any)?.unitName || pricing.unitName;
  const tierType = pricing.tierType;

  return (
    unitName === "team" &&
    (tierType === "volume" || tierType === "stairstep")
  );
};

const stripHtml = (html: string): string =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export default function CatalogPage({
  productType = "Training & Certification",
  title = "Training & Certification Programs",
  description = "Discover comprehensive training programs and certifications to advance your career",
  emptyStateTitle = "No Training Programs Found",
  emptyStateDescription = "We couldn't find any training programs matching your current filters. Try adjusting your search criteria or browse our complete catalog.",
  category,
  subcategory,
  service,
  onBookNow,
}: CatalogPageProps) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Basic filters
  const [deliveryMode, setDeliveryMode] = useState("all");
  const [sessionType, setSessionType] = useState("all");
  const [difficulty, setDifficulty] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const perPage = 12;

  const { addToCart, isInCart } = useCart();
  const { userData } = useRole();

  const [flyingItem, setFlyingItem] = useState<{
    id: string;
    title: string;
    image: string;
    startPos: { x: number; y: number };
    endPos: { x: number; y: number };
  } | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});

  const scrollRef = useRef<HTMLDivElement>(null);

  // ⬇️ Pull team data (members + admin)
  const { members, loading: teamLoading, fetchTeamData } = teamFetcher();

  // Update search when URL param changes
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== search) {
      setSearch(urlSearch);
    }
  }, [searchParams]);

  // Scroll to catalog section when hash is present
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#catalog") {
      // Small delay to ensure the component is rendered
      setTimeout(() => {
        const catalogElement = document.getElementById("catalog");
        if (catalogElement) {
          catalogElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, []);

  useEffect(() => {
    fetchTeamData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const membersCount = Math.max(0, members?.length || 0); // excludes admin
  const qtyMultiplier = Math.max(1, membersCount + 1); // includes admin

  /* ---------------------------- Categories ---------------------------- */

  useEffect(() => {
    setCategoriesLoading(true);
    getApiRequest<any>("/api/products/public", undefined, {
      limit: 1000,
      productType,
    })
      .then((data) => {
        const prods = (data?.data?.data?.products || []) as Product[];
        const map: Record<string, string> = {};
        const unique = [
          ...new Set(
            prods
              .map((product) => {
                if (
                  product.productSubcategoryName &&
                  product.productSubCategoryId
                ) {
                  const idObj = product.productSubCategoryId as any;
                  const catId =
                    typeof idObj === "string" ? idObj : idObj?._id || idObj?.id;
                  if (catId) map[product.productSubcategoryName] = catId;
                  return product.productSubcategoryName;
                }
                if (product.subcategories?.length)
                  return product.subcategories[0];
                if (product.productCategoryTitle)
                  return product.productCategoryTitle;
                if (product.category) return product.category;
                return null;
              })
              .filter(Boolean)
          ),
        ] as string[];
        setCategories(unique);
        setCategoryMap(map);
      })
      .catch((err) => {
        safeConsole.error("Error fetching categories:", err);
        setCategories([]);
        setCategoryMap({});
      })
      .finally(() => setCategoriesLoading(false));
  }, [productType]);

  /* ----------------------------- Listing ----------------------------- */

  function extractListPayload(resp: any) {
    const payload = resp?.data?.data ?? resp?.data ?? resp ?? {};
    const items = payload.products ?? payload.items ?? payload.results ?? [];
    const pg = payload.pagination ?? payload.meta ?? {};
    const headersTotal = Number(resp?.headers?.["x-total-count"]) || 0;

    const total =
      pg.totalItems ??
      pg.total ??
      pg.count ??
      payload.total ??
      headersTotal ??
      0;
    const pages =
      pg.totalPages ??
      pg.pages ??
      pg.pageCount ??
      (total ? Math.ceil(total / perPage) : 1);

    return { items, total, pages };
  }

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params: Record<string, any> = { page, limit: perPage };
    if (search) params.search = search;
    // Handle passed-in category from props (for filtering)
    if (category) {
      if (categoryMap[category]) {
        const categoryId = categoryMap[category];
        if (
          typeof categoryId === "string" &&
          /^[0-9a-fA-F]{24}$/.test(categoryId)
        ) {
          params.productSubCategoryId = categoryId;
        } else {
          params.productSubcategoryName = category;
        }
      } else {
        params.productSubcategoryName = category;
      }
    }
    // Handle selected category from UI
    if (selectedCategory) {
      if (categoryMap[selectedCategory]) {
        const categoryId = categoryMap[selectedCategory];
        if (
          typeof categoryId === "string" &&
          /^[0-9a-fA-F]{24}$/.test(categoryId)
        ) {
          params.productSubCategoryId = categoryId;
        } else {
          params.productSubcategoryName = selectedCategory;
        }
      } else {
        params.productSubcategoryName = selectedCategory;
      }
    }
    // Handle subcategory and service from props
    if (subcategory) params.subcategory = subcategory;
    if (service) params.service = service;
    if (productType) params.productType = productType;
    if (deliveryMode !== "all") params.deliveryMode = deliveryMode;
    if (sessionType !== "all") params.sessionType = sessionType;
    if (difficulty) params.difficultyLevel = difficulty;
    if (sortBy !== "default") params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;

    getApiRequest<any>("/api/products/public", undefined, params)
      .then((resp) => {
        const { items, total, pages } = extractListPayload(resp);
        setProducts((items || []) as Product[]);
        setTotalItems(total || 0);
        setTotalPages(pages || 1);
      })
      .catch((err) => {
        safeConsole.error("API Error details:", err);
        setError(err);
        setProducts([]);
        setTotalItems(0);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  }, [
    page,
    search,
    category,
    selectedCategory,
    categoryMap,
    productType,
    deliveryMode,
    sessionType,
    difficulty,
    sortBy,
    sortOrder,
    perPage,
    subcategory,
    service,
  ]);

  /* ------------------------ Add to cart handle ------------------------ */

  const handleAddToCart = (product: Product, event: React.MouseEvent) => {
    event.stopPropagation();

    // Check if product requires teamTechProfessional role
    if (requiresTeamTechProfessional(product)) {
      const userRole = userData?.role;
      if (userRole !== "teamTechProfessional") {
        safeConsole.warn("Only team tech professionals can purchase team products");
        toast.error("This product is only available for Team Tech Professionals. Please switch to your team account to purchase.");
        return;
      }
    }

    const requiresBooking = !!(
      product.requiresBooking || product.isBookableService
    );

    // If onBookNow callback is provided and product requires booking, use the callback instead
    if (onBookNow && requiresBooking) {
      onBookNow(product._id, product.service);
      return;
    }

    // fly animation
    const button = event.currentTarget as HTMLElement;
    const buttonRect = button.getBoundingClientRect();
    const cartIcon = document.querySelector(
      '[aria-controls="cart-dropdown"]'
    ) as HTMLElement | null;

    const cartPos = cartIcon
      ? (() => {
        const cartRect = cartIcon.getBoundingClientRect();
        return {
          x: cartRect.left + cartRect.width / 2,
          y: cartRect.top + cartRect.height / 2,
        };
      })()
      : { x: window.innerWidth - 80, y: 60 };

    const startPos = {
      x: buttonRect.left + buttonRect.width / 2,
      y: buttonRect.top + buttonRect.height / 2,
    };

    setFlyingItem({
      id: product._id,
      title: product.service,
      image: product.thumbnailUrl || "/assets/techedusolution.jpg",
      startPos,
      endPos: cartPos,
    });

    const effectiveDiscount =
      product.pricing?.discountPercentage || product.discountPercentage || 0;

    setTimeout(() => {
      const cartItem: CartItem = {
        id: product._id,
        title: product.service,
        description: product.description || "",
        price: product.pricing?.basePrice || 0, // snapshot; server will recompute
        currency: (product.currency || "gbp").toUpperCase(),
        discountPercentage: effectiveDiscount,
        category:
          product.productCategoryTitle || product.category || "Uncategorized",
        productType: product.productType,
        image: product.thumbnailUrl || "/assets/techedusolution.jpg",
        duration:
          typeof product.programLength === "number" && product.mode
            ? `${product.programLength} ${product.mode}`
            : `${product.durationInMinutes}` || "",
        certificate: !!product.hasCertificate,
        status: product.enabled ? "active" : "inactive",
        level: product.productSubcategoryName || "",
        requiresBooking,

        pricing: {
          model: normalizeCartModel(product.pricing?.model),
          priceBasis: (product.pricing as any)?.priceBasis,
          unitName:
            ((product.pricing as any)?.priceBasis === "per_unit")
              ? ((product.pricing as any)?.unitName || "team")
              : undefined,
          currency: (product.currency || "gbp").toLowerCase(),
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
          // include tiers for per-unit pricing
          tiers: Array.isArray((product.pricing as any)?.tiers)
            ? (product.pricing as any).tiers
            : undefined,
          // include basePrice; treat free as 0
          basePrice:
            product.pricing?.model === "free"
              ? 0
              : product.pricing?.basePrice ?? Number(product.price ?? 0),
          installments: product.pricing?.installments?.enabled
            ? {
              enabled: true,
              count: product.pricing?.installments?.count || 2,
              downPaymentType: product.pricing?.installments?.downPaymentType,
              downPaymentValue:
                product.pricing?.installments?.downPaymentValue || 0,
              // Allow hour/day/week/month/year for installments
              interval: (product.pricing?.installments as any)?.interval,
              intervalCount: product.pricing?.installments?.intervalCount,
              allowEarlyPayoff:
                product.pricing?.installments?.allowEarlyPayoff,
            }
            : { enabled: false },

          // optional subscription-ish
          subscriptionPrice: product.pricing?.basePrice,
          interval:
            product.pricing?.interval &&
              (product.pricing.interval === "day" ||
                product.pricing.interval === "week" ||
                product.pricing.interval === "month" ||
                product.pricing.interval === "year")
              ? product.pricing.interval
              : undefined,
          intervalCount: product.pricing?.intervalCount,
          trialDays: product.pricing?.trialDays,
          setupFee: product.pricing?.setupFee,
          proration: product.pricing?.proration,
          vatPercentage: product.pricing?.vatPercentage,
          // keep discount at pricing level for calculators
          discountPercentage: effectiveDiscount,
        },

        // Booking metadata
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
        isAttachmentRequired: !!product.isAttachmentRequired,
        instructorId: product.instructorId,
        instructorName: product.instructorName,
        virtualPlatform: product.virtualPlatform,
        classroomCapacity: product.classroomCapacity,
        classroomRequirements: product.classroomRequirements,

        bookingDetails: requiresBooking
          ? {
            fullName: "",
            email: "",
            phone: "",
            preferredDate: undefined,
            preferredTime: "",
            // ⬇️ For volume, participants = members + admin; for others default to 1
            numberOfParticipants: isVolume(product.pricing as Pricing)
              ? qtyMultiplier
              : 1,
            participantType: "individual",
            userNotes: "",
            bookingId: "",
            bookingData: {
              productId: product._id,
              productType: product.productType,
              instructorId: product.instructorId,
              bookingPurpose: product.service,
              minutesPerSession: product.minutesPerSession,
              durationInMinutes: product.durationInMinutes,
              numberOfExpectedParticipants: isVolume(
                product.pricing as Pricing
              )
                ? qtyMultiplier
                : 1,
              isClassroom: product.hasClassroom,
              isSession: product.hasSession,
              participantType: "individual",
              platformRole: "student",
              email: "",
              fullName: "",
              createdBy: "",
              profileId: "",
              participants: [],
              actualDaysAndTime: [],
            },
          }
          : undefined,
      };

      addToCart(cartItem);
      setFlyingItem(null);
    }, 800);
  };

  /* ------------------------ Product details modal ------------------------ */

  const handleViewDetails = async (id: string) => {
    setDetailsLoading(true);
    setShowDetailsModal(true);
    try {
      const data = await getApiRequest<any>(`/api/products/public/${id}`);
      setSelectedProduct((data?.data?.data || null) as Product | null);
    } catch (err) {
      safeConsole.error("Error fetching product details:", err);
      setSelectedProduct(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  /* -------------------------------- Render -------------------------------- */

  return (
    <section className="flex flex-col gap-6 px-4 py-16 md:py-20 md:px-8 bg-white">
      {/* Header */}
      <header className="text-center max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {title}
        </h1>
        <p className="text-gray-600 mt-2">{description}</p>
      </header>

      {/* Category strip */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Browse by Category
          </h3>
          <p className="text-sm text-gray-500">
            Explore different types of training programs
          </p>
        </div>
        <div className="flex justify-center px-4 md:px-0">
          <div
            ref={scrollRef}
            className="flex gap-3 md:gap-4 overflow-x-auto pb-2 md:pb-0 w-full scrollbar-hide"
          >
            <button
              onClick={() => {
                setSelectedCategory("");
                setPage(1);
              }}
              className={`px-4 md:px-6 py-2.5 font-medium transition-all whitespace-nowrap flex-shrink-0 rounded-full border ${selectedCategory === ""
                ? "text-white bg-[#0D1140] border-[#0D1140] shadow-md"
                : "text-gray-600 hover:text-gray-900 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
            >
              All Programs
            </button>

            {categoriesLoading ? (
              <div className="px-4 md:px-6 py-2.5 font-medium text-gray-400 border border-gray-200 rounded-full">
                Loading categories...
              </div>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setPage(1);
                  }}
                  className={`px-4 md:px-6 py-2.5 font-medium transition-all whitespace-nowrap flex-shrink-0 rounded-full border ${selectedCategory === cat
                    ? "text-white bg-[#0D1140] border-[#0D1140] shadow-md"
                    : "text-gray-600 hover:text-gray-900 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {cat}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-8">
        <div className="relative w/full max-w-md">
          <Input
            placeholder="Search for skills, topics, or courses..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="rounded-full pl-4 pr-12 py-3 text-lg"
          />
          <button
            aria-label="Search"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <main id="catalog" className="flex-1">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden border p-2 h-[340px] rounded-[10px] animate-pulse bg-gray-100"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-600">{error.message}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-lg font-semibold text-gray-800">
              {emptyStateTitle}
            </h3>
            <p className="text-gray-500 mt-1">{emptyStateDescription}</p>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {products.map((product) => {
                const effectiveDiscount =
                  product.pricing?.discountPercentage ||
                  product.discountPercentage ||
                  0;

                const displayAmount = teamAwareDisplayAmount(
                  (product.pricing as Pricing) || null,
                  membersCount,
                  effectiveDiscount
                );

                const originalAmount = teamAwareDisplayAmount(
                  (product.pricing as Pricing) || null,
                  membersCount,
                  0
                );

                const plainDescription = stripHtml(
                  product.description || ""
                );
                const shortDescription =
                  plainDescription.length > 200
                    ? `${plainDescription.slice(0, 197)}...`
                    : plainDescription;

                return (
                  <Card
                    key={product._id}
                    className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-[12px] shadow-sm hover:shadow-lg cursor-pointer"
                    onClick={(e) => {
                      const origin = e.target as HTMLElement;
                      if (
                        origin.closest("button[data-add-to-cart]") ||
                        origin.closest("svg")
                      )
                        return;

                      if (product.slug) {
                        window.location.href = `/training/catalog/${product.slug}`;
                      } else {
                        handleViewDetails(product._id);
                      }
                    }}
                  >
                    <div className="relative w-full md:w-[40%] h-[200px] md:h-auto bg-gray-100 rounded-t-xl md:rounded-l-xl md:rounded-tr-none overflow-hidden shrink-0">
                      <Image
                        src={
                          product.thumbnailUrl ||
                          product.iconUrl ||
                          "/assets/techedusolution.jpg"
                        }
                        alt={product.service}
                        fill
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      {effectiveDiscount > 0 && (
                        <span className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                          -{effectiveDiscount}%
                        </span>
                      )}
                    </div>

                    <CardContent className="flex flex-col flex-1 p-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {product.service}
                      </h3>
                      {shortDescription && (
                        <>
                          <p className="text-sm text-gray-500 mb-1 line-clamp-2">
                            {shortDescription}
                          </p>
                          {product.slug && (
                            <Link
                              href={`/training/catalog/${product.slug}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline text-xs font-bold mb-3"
                            >
                              Read more
                            </Link>
                          )}
                        </>
                      )}

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                          {product.productCategoryTitle || ""}
                        </span>
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                          {product.productType}
                        </span>
                        {/* Show mediaType for Tools non-bookable, sessionType for others */}
                        {product.productType === "Tools" && !product.isBookableService && product.mediaType ? (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full capitalize">
                            {product.mediaType}
                          </span>
                        ) : product.sessionType ? (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                            {product.sessionType}
                          </span>
                        ) : null}
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                          {product.pricing?.model || ""}
                        </span>
                      </div>

                      <div className="flex items-start justify-between mt-auto">
                        <div className="flex flex-col items-start gap-1">
                          <div className="flex items-baseline gap-1">
                            {displayAmount === 0 ? (
                              <span className="text-lg font-bold text-green-600">
                                Free
                              </span>
                            ) : (
                              <>
                                <div className="flex flex-col">
                                  {effectiveDiscount > 0 && (
                                    <span className="text-sm text-gray-400 line-through">
                                      {getCurrencySymbol(
                                        product.currency || "gbp"
                                      )}{" "}
                                      {originalAmount}
                                    </span>
                                  )}
                                  <span className="text-lg font-bold text-blue-600">
                                    {getCurrencySymbol(
                                      product.currency || "gbp"
                                    )}{" "}
                                    {displayAmount}
                                    {(product.pricing as any)?.model ===
                                      "subscription"
                                      ? (() => {
                                        const ic = Number(
                                          (product.pricing as any)
                                            ?.intervalCount || 1
                                        );
                                        const interval =
                                          (product.pricing as any)
                                            ?.interval || "month";
                                        const label =
                                          ic > 1
                                            ? `${ic} ${interval}s`
                                            : `${interval}`;
                                        return ` / ${label}`;
                                      })()
                                      : showSlash(product.pricing as Pricing)
                                        ? " /"
                                        : ""}
                                  </span>
                                </div>
                                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                                  {pricingBadgeLabel(product.pricing as Pricing)}
                                </span>
                                {(product.pricing as any)?.model === "subscription" && (
                                  <span className="text-xs text-gray-500 ml-2">
                                    {((product.pricing as any)?.autoRenew === false)
                                      ? "No renewal"
                                      : (() => {
                                        const ic = Number((product.pricing as any)?.intervalCount || 1);
                                        const interval = (product.pricing as any)?.interval || "month";
                                        const label = ic > 1 ? `${ic} ${interval}s` : `${interval}`;
                                        return `Auto-renews every ${label}`;
                                      })()}
                                  </span>
                                )}
                              </>
                            )}
                          </div>

                          {isVolume(product.pricing as Pricing) && (
                            <span className="text-xs text-gray-500">
                              team total for {qtyMultiplier} persons (members +
                              admin)
                            </span>
                          )}
                          {isStairstep(product.pricing as Pricing) && (
                            <span className="text-xs text-gray-500">
                              flat band picked by {membersCount} member(s)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        {isInCart(product._id) ? (
                          <Button
                            className="bg-green-500 hover:bg-green-600 rounded-[10px] text-white px-4 py-2 w-full"
                            disabled
                            data-add-to-cart
                          >
                            In Cart
                          </Button>
                        ) : (() => {
                          const requiresTeam = requiresTeamTechProfessional(product);
                          const hasPermission = userData?.role === "teamTechProfessional";
                          const isRestricted = requiresTeam && !hasPermission;

                          return (
                            <Button
                              className={`rounded-[10px] text-white px-4 py-2 w-full ${isRestricted
                                ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                                }`}
                              onClick={(e) => handleAddToCart(product, e)}
                              disabled={isRestricted}
                              data-add-to-cart
                              title={
                                isRestricted
                                  ? "Only Team Tech Professionals can purchase this product"
                                  : undefined
                              }
                            >
                              {isRestricted
                                ? "Team Only"
                                : product.requiresBooking ||
                                  product.isBookableService
                                  ? "Book Now"
                                  : "Add to Cart"}
                            </Button>
                          );
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-2 pt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className={`cursor-pointer ${page === 1 ? "pointer-events-none opacity-50" : ""
                          }`}
                      />
                    </PaginationItem>

                    {totalPages > 0 && (
                      <>
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => setPage(1)}
                            isActive={page === 1}
                            className="cursor-pointer"
                          >
                            1
                          </PaginationLink>
                        </PaginationItem>

                        {page > 3 && totalPages > 3 && (
                          <PaginationItem className="text-gray-700">
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter((p) => p > 1 && p < totalPages)
                          .filter((p) => p >= page - 1 && p <= page + 1)
                          .map((p) => (
                            <PaginationItem key={p}>
                              <PaginationLink
                                onClick={() => setPage(p)}
                                isActive={page === p}
                                className={`cursor-pointer ${page === p
                                  ? "rounded-[10px] bg-[#0D1140] text-white border-0"
                                  : ""
                                  }`}
                              >
                                {p}
                              </PaginationLink>
                            </PaginationItem>
                          ))}

                        {page < totalPages - 2 && totalPages > 5 && (
                          <PaginationItem className="text-gray-700">
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}

                        <PaginationItem>
                          <PaginationLink
                            onClick={() => setPage(totalPages)}
                            isActive={page === totalPages}
                            className="cursor-pointer"
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        className={`cursor-pointer ${page >= totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                          }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </main>

      {/* Flying Item Animation */}
      {flyingItem && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: flyingItem.startPos.x,
            top: flyingItem.startPos.y,
            transform: "translate(-50%, -50%)",
            animation: "flyToCart 0.8s ease-in-out forwards",
          }}
        >
          <div className="bg-white rounded-[10px] shadow-lg p-2 border-2 border-blue-500">
            <Image
              src={flyingItem.image}
              alt={flyingItem.title}
              width={60}
              height={60}
              className="rounded object-cover"
            />
            <div className="text-xs text-center mt-1 font-medium text-gray-800 max-w-[60px] truncate">
              {flyingItem.title}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
