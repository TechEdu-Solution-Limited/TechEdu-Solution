"use client";

import React, { useState, useEffect, useRef } from "react";
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
import Image from "next/image";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import { getApiRequest } from "@/lib/apiFetch";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { safeConsole } from "@/lib/console";
import { SORT_OPTIONS } from "@/lib/constants/productTypes";

// ✅ Pricing types + helpers
// If your file is "@/lib/constant/pricing", change this import path accordingly.
import type {
  Pricing,
  PricingModel,
  Currency,
  TierType,
} from "@/lib/constants/pricing";
import {
  getPrimaryPrice,
  getDiscountPercent,
  inferCurrency,
  formatMoneySafe,
} from "@/utils/pricingDisplay";

interface CatalogPageProps {
  productType?: string;
  title?: string;
  description?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
}

export default function CatalogPage({
  productType = "Training & Certification",
  title = "Training & Certification Programs",
  description = "Discover comprehensive training programs and certifications to advance your career",
  emptyStateTitle = "No Training Programs Found",
  emptyStateDescription = "We couldn't find any training programs matching your current filters. Try adjusting your search criteria or browse our complete catalog.",
}: CatalogPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [deliveryMode, setDeliveryMode] = useState("all");
  const [sessionType, setSessionType] = useState("all");
  const [difficulty, setDifficulty] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Additional filters
  const [isRecurring, setIsRecurring] = useState<boolean | null>(null);
  const [requiresBooking, setRequiresBooking] = useState<boolean | null>(null);
  const [hasCertificate, setHasCertificate] = useState<boolean | null>(null);
  const [hasClassroom, setHasClassroom] = useState<boolean | null>(null);
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [hasAssessment, setHasAssessment] = useState<boolean | null>(null);
  const [isBookableService, setIsBookableService] = useState<boolean | null>(
    null
  );
  const [requiresEnrollment, setRequiresEnrollment] = useState<boolean | null>(
    null
  );
  const [mode, setMode] = useState("all");
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minDiscount, setMinDiscount] = useState<number | null>(null);
  const [maxDiscount, setMaxDiscount] = useState<number | null>(null);
  const [minDuration, setMinDuration] = useState<number | null>(null);
  const [maxDuration, setMaxDuration] = useState<number | null>(null);
  const [minProgramLength, setMinProgramLength] = useState<number | null>(null);
  const [maxProgramLength, setMaxProgramLength] = useState<number | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const perPage = 12;

  const { addToCart, isInCart } = useCart();
  const [flyingItem, setFlyingItem] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});

  const scrollRef = useRef<HTMLDivElement>(null);

  /* ---------------------- Pricing helpers (TS-safe) ---------------------- */

  // Normalize pricing for helper calls (helpers expect pricing?: Partial<Pricing> | undefined, not null)
  function toHelperShape(p: Product) {
    return {
      ...p,
      pricing: p.pricing ?? undefined,
      // Some helpers look for top-level fallbacks too
      discountPercentage: p.discountPercentage,
      currency: p.currency,
      price: p.price,
    };
  }

  // Get display currency (lowercase Currency literal)
  function pickCurrency(p: Product): Currency {
    const helperIn = toHelperShape(p);
    const inferred = inferCurrency(helperIn) as Currency | undefined;
    const top = (p.currency || inferred || "usd").toLowerCase();
    return top as string as Currency;
  }

  // Return base/final/pricing label safely
  const priceParts = (p: Product) => {
    const helperIn = toHelperShape(p);
    const cur = pickCurrency(p);

    // Base/original (prefer explicit originalPrice; else helper; else top-level)
    const helperBase = Number(getPrimaryPrice(helperIn) || 0);
    const base =
      typeof p.originalPrice === "number"
        ? p.originalPrice
        : helperBase > 0
        ? helperBase
        : typeof p.price === "number"
        ? p.price
        : 0;

    // Discount % (prefer top-level, else helper, else derive)
    let pct =
      typeof p.discountPercentage === "number"
        ? p.discountPercentage
        : getDiscountPercent(helperIn) || 0;
    if (
      !pct &&
      typeof p.originalPrice === "number" &&
      typeof p.price === "number" &&
      p.originalPrice > p.price
    ) {
      pct = Math.round((1 - p.price / p.originalPrice) * 100);
    }

    // Final price (prefer explicit top-level discounted, else apply pct to base)
    const final =
      typeof p.price === "number" && p.price > 0
        ? p.price
        : pct
        ? base * (1 - pct / 100)
        : base;

    return {
      base,
      pct,
      cur,
      final,
      fmtBase: formatMoneySafe(base, cur),
      fmtFinal: formatMoneySafe(final, cur),
    };
  };

  // Is per-unit (used as “per person” when unitName suggests that)
  const modelOf = (p: Product): PricingModel | "one_time" => {
    const m = p.pricing?.model;
    if (!m) return p.isRecurring ? "subscription" : "one_time";
    return m;
  };

  const unitName = (p: Product): string => {
    const u = p.pricing?.unitName;
    if (u) return u;
    // fall back to program mode for a reasonable label
    const m = (p.mode || "").toLowerCase();
    if (m === "hours") return "hour";
    if (m === "days") return "day";
    if (m === "weeks") return "week";
    if (m === "months") return "month";
    if (m === "sessions") return "session";
    return "unit";
  };

  const isPerUnit = (p: Product) => modelOf(p) === "per_unit";
  const isPerPerson = (p: Product) => {
    if (!isPerUnit(p)) return false;
    const u = unitName(p).toLowerCase();
    return ["person", "participant", "seat", "member"].includes(u);
  };

  type BillingDescription = { key: string; label: string };
  const describeBilling = (p: Product): BillingDescription => {
    const m = modelOf(p);
    if (m === "subscription") {
      const count = p.pricing?.intervalCount || 1;
      const interval = (p.pricing?.interval || "month") as string;
      const pretty = count > 1 ? `${count} ${interval}s` : interval;
      return { key: "subscription", label: `/${pretty}` };
    }
    if (m === "per_unit") {
      const label = isPerPerson(p) ? "per person" : `per ${unitName(p)}`;
      return { key: "per_unit", label };
    }
    return { key: "one_time", label: "one-time" };
  };

  /* ---------------------------- Categories ---------------------------- */

  useEffect(() => {
    setCategoriesLoading(true);
    getApiRequest<any>("/api/products/public", undefined, {
      limit: 1000,
      productType,
    })
      .then((data) => {
        const products = (data?.data?.data?.products || []) as Product[];
        const map: Record<string, string> = {};
        const unique = [
          ...new Set(
            products
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
    const params: Record<string, any> = {
      page,
      limit: perPage,
    };
    if (search) params.search = search;
    if (category) {
      if (categoryMap[category]) {
        const categoryId = categoryMap[category];
        if (
          typeof categoryId === "string" &&
          /^[0-9a-fA-F]{24}$/.test(categoryId)
        ) {
          params.productSubCategoryId = categoryId;
        } else {
          safeConsole.warn("Invalid category ID format:", categoryId);
          params.productSubcategoryName = category;
        }
      } else {
        params.productSubcategoryName = category;
      }
    }
    if (productType) params.productType = productType;
    if (deliveryMode !== "all") params.deliveryMode = deliveryMode;
    if (sessionType !== "all") params.sessionType = sessionType;
    if (difficulty) params.difficultyLevel = difficulty;
    if (sortBy !== "default") params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;

    // Additional filters
    if (isRecurring !== null) params.isRecurring = isRecurring;
    if (requiresBooking !== null) params.requiresBooking = requiresBooking;
    if (hasCertificate !== null) params.hasCertificate = hasCertificate;
    if (hasClassroom !== null) params.hasClassroom = hasClassroom;
    if (hasSession !== null) params.hasSession = hasSession;
    if (hasAssessment !== null) params.hasAssessment = hasAssessment;
    if (isBookableService !== null)
      params.isBookableService = isBookableService;
    if (requiresEnrollment !== null)
      params.requiresEnrollment = requiresEnrollment;
    if (mode !== "all") params.mode = mode;
    if (minPrice !== null) params.minPrice = minPrice;
    if (maxPrice !== null) params.maxPrice = maxPrice;
    if (minDiscount !== null) params.minDiscount = minDiscount;
    if (maxDiscount !== null) params.maxDiscount = maxDiscount;
    if (minDuration !== null) params.minDuration = minDuration;
    if (maxDuration !== null) params.maxDuration = maxDuration;
    if (minProgramLength !== null) params.minProgramLength = minProgramLength;
    if (maxProgramLength !== null) params.maxProgramLength = maxProgramLength;

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
    categoryMap,
    productType,
    deliveryMode,
    sessionType,
    difficulty,
    sortBy,
    sortOrder,
    isRecurring,
    requiresBooking,
    hasCertificate,
    hasClassroom,
    hasSession,
    hasAssessment,
    isBookableService,
    requiresEnrollment,
    mode,
    minPrice,
    maxPrice,
    minDiscount,
    maxDiscount,
    minDuration,
    maxDuration,
    minProgramLength,
    maxProgramLength,
    totalItems,
    totalPages,
  ]);

  /* ------------------------ Add to cart (TS-safe) ------------------------ */

  // Normalize tier type for cart (if your CartItem only allows "none" | "volume" | "graduated")
  const normalizeTierType = (
    t?: TierType
  ): "none" | "volume" | "graduated" | undefined => {
    if (!t) return undefined;
    if (t === "stairstep") return "graduated";
    if (t === "none" || t === "volume" || t === "graduated") return t;
    return undefined;
  };

  const normalizedCartModel = (m: PricingModel | "one_time") =>
    m === "subscription" ? "subscription" : "one_time"; // treat per_unit as one_time by default

  const handleAddToCart = (product: Product, event: React.MouseEvent) => {
    const requiresBooking =
      product.requiresBooking || product.isBookableService || false;

    // Flying animation origin/target
    const button = event.currentTarget as HTMLElement;
    const buttonRect = button.getBoundingClientRect();
    const cartIcon = document.querySelector(
      '[aria-controls="cart-dropdown"]'
    ) as HTMLElement;
    let cartPos = { x: window.innerWidth - 80, y: 60 };
    if (cartIcon) {
      const cartRect = cartIcon.getBoundingClientRect();
      cartPos = {
        x: cartRect.left + cartRect.width / 2,
        y: cartRect.top + cartRect.height / 2,
      };
    }
    const startPos = {
      x: buttonRect.left + buttonRect.width / 2,
      y: buttonRect.top + buttonRect.height / 2,
    };

    const pp = priceParts(product);

    setFlyingItem({
      id: product._id,
      title: product.service,
      image: product.thumbnailUrl || "/assets/default-product.png",
      startPos,
      endPos: cartPos,
    });

    setTimeout(() => {
      const cartItem: CartItem = {
        id: product._id,
        title: product.service,
        description: product.description || "",
        price: pp.base, // snapshot; server preview will compute totals
        currency: pp.cur, // NOTE: if your CartItem expects string, you can cast: pp.cur as unknown as string
        discountPercentage:
          typeof product.discountPercentage === "number"
            ? product.discountPercentage
            : 0,
        category:
          product.productCategoryTitle || product.category || "Uncategorized",
        productType: product.productType,
        image: product.thumbnailUrl || "/assets/default-product.png",
        duration: `${product.programLength} ${product.mode}`,
        certificate: product.hasCertificate,
        status: product.enabled ? "active" : "inactive",
        level: product.productSubcategoryName || "",
        requiresBooking,

        // ➕ Pricing metadata for Cart; keep within Cart types
        // ✅ AFTER (compiles cleanly)
        pricing: {
          model: normalizedCartModel(modelOf(product)),
          currency: pp.cur as unknown as string as any,
          allowQuantity: !!product.pricing?.allowQuantity,
          minQty:
            typeof product.pricing?.minQty === "number"
              ? product.pricing!.minQty!
              : 1,
          maxQty:
            typeof product.pricing?.maxQty === "number"
              ? product.pricing!.maxQty!
              : 0,
          tierType: normalizeTierType(product.pricing?.tierType),
          taxInclusive: !!product.pricing?.taxInclusive,
          // interval: product.pricing?.interval,
          // intervalCount: product.pricing?.intervalCount,
          installments: product.pricing?.installments?.enabled
            ? {
                enabled: true,
                count: product.pricing?.installments?.count || 2,
                downPaymentType: product.pricing?.installments?.downPaymentType,
                downPaymentValue:
                  product.pricing?.installments?.downPaymentValue || 0,
                interval: product.pricing?.installments?.interval,
                intervalCount: product.pricing?.installments?.intervalCount,
                allowEarlyPayoff:
                  product.pricing?.installments?.allowEarlyPayoff,
              }
            : { enabled: false },
        },

        // Booking-side metadata your Cart expects
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

        bookingDetails: requiresBooking
          ? {
              fullName: "",
              email: "",
              phone: "",
              preferredDate: undefined,
              preferredTime: "",
              numberOfParticipants: 1,
              participantType: "individual" as const,
              userNotes: "",
              bookingId: "",
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
    } catch (error) {
      safeConsole.error("Error fetching product details:", error);
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
                setCategory("");
                setPage(1);
              }}
              className={`px-4 md:px-6 py-2.5 font-medium transition-all whitespace-nowrap flex-shrink-0 rounded-full border ${
                category === ""
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
              categories.map((cat: string) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setPage(1);
                  }}
                  className={`px-4 md:px-6 py-2.5 font-medium transition-all whitespace-nowrap flex-shrink-0 rounded-full border ${
                    category === cat
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
        <div className="relative w-full max-w-md">
          <Input
            placeholder="Search for skills, topics, or courses..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="rounded-full pl-4 pr-12 py-3 text-lg"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
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

      {/* Advanced Filters */}
      {/* ... (unchanged UI from your last version; omitted here for brevity if desired) ... */}

      {/* Product Grid */}
      <main className="flex-1">
        {loading ? (
          /* skeletons ... */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden border p-2 h-[340px] rounded-[10px] animate-pulse bg-gray-100"
              />
            ))}
          </div>
        ) : error ? (
          <p>Error loading products: {error.message}</p>
        ) : products.length === 0 ? (
          /* empty state ... */
          <div className="text-center py-16">No products.</div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const pp = priceParts(product);
                const bill = describeBilling(product);

                return (
                  <Card
                    key={product._id}
                    className="flex flex-col h-full bg-white border border-gray-200 rounded-[12px] shadow-sm hover:shadow-lg transition-all duration-200 group cursor-pointer"
                    onClick={(e) => {
                      if (
                        (e.target as HTMLElement).closest(
                          "button[data-add-to-cart]"
                        ) ||
                        (e.target as HTMLElement).closest("svg")
                      )
                        return;
                      if (product.slug) {
                        window.location.href = `/training/catalog/${product.slug}`;
                      } else {
                        handleViewDetails(product._id);
                      }
                    }}
                  >
                    <div className="relative w-full aspect-square bg-gray-100 rounded-t-xl overflow-hidden">
                      <Image
                        src={
                          product.thumbnailUrl ||
                          product.iconUrl ||
                          "/assets/default-product.png"
                        }
                        alt={product.service}
                        fill
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      {!!pp.pct && pp.pct > 0 && (
                        <span className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                          -{pp.pct}%
                        </span>
                      )}
                    </div>

                    <CardContent className="flex flex-col flex-1 p-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">
                        {product.service}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                        {product.description || "No description."}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                          {product.productCategoryTitle ||
                            product.category ||
                            "Uncategorized"}
                        </span>
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                          {product.productType}
                        </span>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                          {product.sessionType}
                        </span>
                        {/* billing pill */}
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                          {bill.key === "subscription"
                            ? "subscription"
                            : bill.label}
                        </span>
                      </div>

                      <div className="flex items-end justify-between mt-auto">
                        <div className="flex flex-col items-baseline gap-1">
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-blue-600">
                              {pp.fmtFinal}
                            </span>
                            <span className="text-xs text-gray-500">
                              {bill.label}
                            </span>
                          </div>
                          {!!pp.pct && pp.pct > 0 && (
                            <span className="text-xs text-gray-500 line-through">
                              {pp.fmtBase}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {isInCart(product._id) ? (
                            <Button
                              className="bg-green-500 hover:bg-green-600 rounded-[10px] text-white px-4 py-2"
                              disabled
                              data-add-to-cart
                            >
                              In Cart
                            </Button>
                          ) : (
                            <Button
                              className="bg-blue-600 hover:bg-blue-700 rounded-[10px] text-white px-4 py-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product, e);
                              }}
                              data-add-to-cart
                            >
                              {product.requiresBooking ||
                              product.isBookableService
                                ? "Book Now"
                                : "Add to Cart"}
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Per-unit limits hint (covers per-person when unitName matches) */}
                      {isPerUnit(product) && (
                        <div className="mt-2 text-xs text-gray-500">
                          {typeof product.pricing?.minQty === "number" &&
                            product.pricing.minQty > 1 && (
                              <span>Min: {product.pricing.minQty}</span>
                            )}
                          {typeof product.pricing?.maxQty === "number" &&
                            product.pricing.maxQty > 0 && (
                              <span className="ml-2">
                                Max: {product.pricing.maxQty}
                              </span>
                            )}
                        </div>
                      )}
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
                        className={`cursor-pointer ${
                          page === 1 ? "pointer-events-none opacity-50" : ""
                        }`}
                      />
                    </PaginationItem>

                    {totalPages > 0 && (
                      <>
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => setPage(1)}
                            isActive={page === 1}
                            className={`cursor-pointer ${
                              page === 1 ? "rounded-[10px]" : ""
                            }`}
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
                                className={`cursor-pointer ${
                                  page === p
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
                            className={`cursor-pointer ${
                              page === totalPages ? "rounded-[10px]" : ""
                            }`}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage((p) => p + 1)}
                        className={`cursor-pointer ${
                          page >= totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            {/* Product Details Modal */}
            <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
              <DialogContent className="max-w-lg w-full bg-white overflow-y-auto h-screen">
                {detailsLoading ? (
                  <div className="space-y-4 animate-pulse">
                    <div
                      className="w-full aspect-video bg-gray-200 rounded-[12px]"
                      style={{ minHeight: 180 }}
                    />
                    <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                  </div>
                ) : selectedProduct ? (
                  (() => {
                    const ppSel = priceParts(selectedProduct);
                    const billSel = describeBilling(selectedProduct);
                    return (
                      <div className="space-y-4">
                        <div
                          className="relative w-full aspect-video bg-gray-100 rounded-[12px] overflow-hidden"
                          style={{ minHeight: 180 }}
                        >
                          <Image
                            src={
                              selectedProduct.thumbnailUrl ||
                              selectedProduct.iconUrl ||
                              "/assets/default-product.png"
                            }
                            alt={selectedProduct.service}
                            fill
                            className="object-cover rounded-[12px]"
                          />
                          {!!ppSel.pct && ppSel.pct > 0 && (
                            <span className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                              -{ppSel.pct}%
                            </span>
                          )}
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900">
                          {selectedProduct.service}
                        </h2>
                        <p className="text-gray-700">
                          {selectedProduct.description || "No description."}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                            {selectedProduct.productCategoryTitle ||
                              selectedProduct.category ||
                              "Training"}
                          </span>
                          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                            {selectedProduct.productType}
                          </span>
                          {selectedProduct.hasCertificate && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                              Certificate
                            </span>
                          )}
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                            {billSel.key === "subscription"
                              ? "subscription"
                              : billSel.label}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div className="text-xl font-bold text-blue-900 flex items-baseline gap-2">
                            <span>{ppSel.fmtFinal}</span>
                            <span className="text-xs text-gray-500">
                              {billSel.label}
                            </span>
                            {!!ppSel.pct && ppSel.pct > 0 && (
                              <>
                                <span className="ml-2 text-xs text-green-600">
                                  -{ppSel.pct}%
                                </span>
                                <span className="ml-2 text-xs text-gray-500 line-through">
                                  {ppSel.fmtBase}
                                </span>
                              </>
                            )}
                          </div>

                          {/* Friendly hint for team charging on per-unit/“per person” */}
                          {isPerPerson(selectedProduct) && (
                            <p className="text-xs text-gray-600">
                              Team checkouts are charged for team members plus
                              the team admin.
                            </p>
                          )}

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Duration:</span>
                              <p className="font-medium">
                                {selectedProduct.programLength}{" "}
                                {selectedProduct.mode}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">Delivery:</span>
                              <p className="font-medium capitalize">
                                {selectedProduct.deliveryMode}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">
                                Session Type:
                              </span>
                              <p className="font-medium">
                                {selectedProduct.sessionType}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">
                                Certificate:
                              </span>
                              <p className="font-medium">
                                {selectedProduct.hasCertificate ? "Yes" : "No"}
                              </p>
                            </div>
                          </div>

                          {!!selectedProduct.pricing?.minQty ||
                          !!selectedProduct.pricing?.maxQty ? (
                            <div className="text-xs text-gray-500">
                              {typeof selectedProduct.pricing?.minQty ===
                                "number" &&
                                selectedProduct.pricing.minQty > 1 && (
                                  <span>
                                    Min: {selectedProduct.pricing.minQty}
                                  </span>
                                )}
                              {typeof selectedProduct.pricing?.maxQty ===
                                "number" &&
                                selectedProduct.pricing.maxQty > 0 && (
                                  <span className="ml-2">
                                    Max: {selectedProduct.pricing.maxQty}
                                  </span>
                                )}
                            </div>
                          ) : null}
                        </div>

                        <div className="pt-4 flex justify-end">
                          {selectedProduct.slug ? (
                            <Link
                              href={`/training/catalog/${selectedProduct.slug}`}
                            >
                              <Button
                                variant="outline"
                                className="rounded-[10px] px-4 py-2"
                              >
                                View Full Details
                              </Button>
                            </Link>
                          ) : (
                            <span className="text-red-500">
                              No details available
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No product details found.
                  </div>
                )}
              </DialogContent>
            </Dialog>
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
