// components/CatalogPage.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

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
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

import { getApiRequest } from "@/lib/apiFetch";
import { safeConsole } from "@/lib/console";
import type { Pricing } from "@/lib/constants/pricing";
import { normalizeCartModel, normalizeTierType } from "@/utils/helpers";
import { getCurrencySymbol } from "@/lib/constants/currencies";

// ⬇️ NEW: team hook
import { teamFetcher } from "@/utils/teamFetcher";
import { number } from "framer-motion";

interface CatalogPageProps {
  productType?: string;
  title?: string;
  description?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
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
  const idx = tiers.findIndex((t) => {
    const upTo = getUpTo(t);
    return typeof upTo === "number" ? qty <= upTo : false;
  });
  const index = idx >= 0 ? idx : tiers.length - 1;
  return { tier: tiers[index], index };
};

const isStairstep = (pricing: Pricing) =>
  pricing?.model === "per_unit" &&
  (pricing.tierType ?? "volume") === "stairstep";

const isVolume = (pricing?: Pricing) =>
  pricing?.model === "per_unit" &&
  (pricing.tierType ?? "volume") !== "stairstep";

/**
 * Display amount rules:
 * - one_time → basePrice
 * - subscription → subscriptionPrice
 * - per_unit / volume → (per-unit price at tier picked by membersCount) × (membersCount + 1 admin)
 * - per_unit / stairstep → flat band price (tier picked by membersCount), no multiplication
 */
const teamAwareDisplayAmount = (
  pricing: Partial<Pricing> | null,
  membersCount: number // ← number of team members (EXCLUDING admin)
): number => {
  if (!pricing) return 0;

  switch (pricing.model) {
    case "one_time":
      return Number(pricing.basePrice) ?? 0;

    case "subscription":
      return Number(pricing.subscriptionPrice) ?? 0;

    case "per_unit": {
      const tierQty = Math.max(1, membersCount);
      const { tier } = pickTier(pricing.tiers ?? [], tierQty);
      const unitOrFlat = tier?.unitPrice ?? pricing.basePrice ?? 0;

      if (isStairstep(pricing as Pricing)) {
        // flat band total
        return Number(unitOrFlat);
      }
      // volume → multiply by (members + admin)
      const qtyMultiplier = Math.max(1, membersCount + 1);
      return Number(unitOrFlat * qtyMultiplier);
    }

    default:
      return 0;
  }
};

const pricingBadgeLabel = (pricing: Pricing | undefined): string => {
  if (!pricing) return "unit";
  if (pricing.model === "per_unit") {
    return isStairstep(pricing) ? "flat" : pricing.unitName || "unit";
  }
  if (pricing.model === "one_time") return "person";
  if (pricing.model === "subscription") return "team";
  return "unit";
};

/** For our totals view, we never append "/". Keep slash only for one_time. */
const showSlash = (pricing: Pricing | undefined): boolean =>
  pricing?.model === "one_time";

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

  // Basic filters
  const [deliveryMode, setDeliveryMode] = useState("all");
  const [sessionType, setSessionType] = useState("all");
  const [difficulty, setDifficulty] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const perPage = 12;

  const { addToCart, isInCart } = useCart();

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
    categoryMap,
    productType,
    deliveryMode,
    sessionType,
    difficulty,
    sortBy,
    sortOrder,
    perPage,
  ]);

  /* ------------------------ Add to cart handle ------------------------ */

  const handleAddToCart = (product: Product, event: React.MouseEvent) => {
    event.stopPropagation();

    const requiresBooking = !!(
      product.requiresBooking || product.isBookableService
    );

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
      image: product.thumbnailUrl || "/assets/default-product.png",
      startPos,
      endPos: cartPos,
    });

    setTimeout(() => {
      const cartItem: CartItem = {
        id: product._id,
        title: product.service,
        description: product.description || "",
        price: product.pricing?.basePrice || 0, // snapshot; server will recompute
        currency: (product.currency || "gbp").toUpperCase(),
        discountPercentage:
          typeof product.discountPercentage === "number"
            ? product.discountPercentage
            : 0,
        category:
          product.productCategoryTitle || product.category || "Uncategorized",
        productType: product.productType,
        image: product.thumbnailUrl || "/assets/default-product.png",
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
          tierType: normalizeTierType(product.pricing?.tierType) ?? "none",
          taxInclusive: !!product.pricing?.taxInclusive,
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

          // optional subscription-ish
          subscriptionPrice: product.pricing?.basePrice,
          interval: product.pricing?.interval,
          intervalCount: product.pricing?.intervalCount,
          trialDays: product.pricing?.trialDays,
          setupFee: product.pricing?.setupFee,
          proration: product.pricing?.proration,
          vatPercentage: product.pricing?.vatPercentage,
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
              categories.map((cat) => (
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
      <main className="flex-1">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const displayAmount = teamAwareDisplayAmount(
                  (product.pricing as Pricing) || null,
                  membersCount
                );

                return (
                  <Card
                    key={product._id}
                    className="flex flex-col h-full bg-white border border-gray-200 rounded-[12px] shadow-sm hover:shadow-lg transition-all duration-200 group cursor-pointer"
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
                      {(product.pricing?.discountPercent || 0) > 0 && (
                        <span className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                          -{product.pricing?.discountPercent}%
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
                          {product.productCategoryTitle || ""}
                        </span>
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                          {product.productType}
                        </span>
                        {product.sessionType && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                            {product.sessionType}
                          </span>
                        )}
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                          {product.pricing?.model || ""}
                        </span>
                      </div>

                      <div className="flex items-start justify-between mt-auto">
                        <div className="flex flex-col items-start gap-1">
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-blue-600">
                              {getCurrencySymbol(product.currency || "gbp")}{" "}
                              {displayAmount}
                              {showSlash(product.pricing as Pricing)
                                ? " /"
                                : ""}
                            </span>
                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                              {pricingBadgeLabel(product.pricing as Pricing)}
                            </span>
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
                        ) : (
                          <Button
                            className="bg-blue-600 hover:bg-blue-700 rounded-[10px] text-white px-4 py-2 w-full"
                            onClick={(e) => handleAddToCart(product, e)}
                            data-add-to-cart
                          >
                            {product.requiresBooking ||
                            product.isBookableService
                              ? "Book Now"
                              : "Add to Cart"}
                          </Button>
                        )}
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
