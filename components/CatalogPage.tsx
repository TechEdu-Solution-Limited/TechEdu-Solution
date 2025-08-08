"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { Award, Clock, ChevronDown, Heart, Check, X } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { useCart } from "@/contexts/CartContext";
import { useRole } from "@/contexts/RoleContext";
import { toast } from "react-toastify";
import Link from "next/link";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import { getApiRequest } from "@/lib/apiFetch";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const PRODUCT_TYPE_OPTIONS = [
  "Training & Certification",
  "Academic Support Services",
  "Career Development & Mentorship",
  "Institutional & Team Services",
  "AI-Powered or Automation Services",
  "Career Connect",
  "Marketing, Consultation & Free Services",
];

const DIFFICULTY_LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced"];
const SORT_OPTIONS = [
  { value: "price", label: "Price" },
  { value: "service", label: "Name" },
  { value: "category", label: "Category" },
];

interface CatalogPageProps {
  productType?: string;
  title?: string;
  description?: string;
}

export default function CatalogPage({
  productType = "Training & Certification",
  title = "Training & Certification Programs",
  description = "Discover comprehensive training programs and certifications to advance your career",
}: CatalogPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [deliveryMode, setDeliveryMode] = useState("all");
  const [sessionType, setSessionType] = useState("all");
  const [difficulty, setDifficulty] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const perPage = 12;
  const { addToCart, isInCart } = useCart();
  const [flyingItem, setFlyingItem] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});

  // Fetch categories from products API
  useEffect(() => {
    setCategoriesLoading(true);
    getApiRequest<any>("/api/products/public", undefined, {
      limit: 1000,
      productType: productType, // Use the prop value
    })
      .then((data) => {
        const products = data?.data?.data?.products || [];
        // Extract unique subcategories from Training & Certification products
        const categoryMap: Record<string, string> = {};
        const uniqueCategories = [
          ...new Set(
            products
              .map((product: any) => {
                // New structure - use subcategory name and store ID mapping
                if (
                  product.productSubcategoryName &&
                  product.productSubCategoryId
                ) {
                  // Handle both string and object ID formats
                  const categoryId =
                    typeof product.productSubCategoryId === "string"
                      ? product.productSubCategoryId
                      : product.productSubCategoryId._id ||
                        product.productSubCategoryId.id;

                  if (categoryId) {
                    categoryMap[product.productSubcategoryName] = categoryId;
                  }
                  return product.productSubcategoryName;
                }
                // Old structure - use subcategories array
                if (product.subcategories && product.subcategories.length > 0) {
                  return product.subcategories[0]; // Use first subcategory
                }
                // Fallback to category
                if (product.productCategoryTitle) {
                  return product.productCategoryTitle;
                }
                if (product.category) {
                  return product.category;
                }
                return null;
              })
              .filter(Boolean)
          ),
        ] as string[];
        setCategories(uniqueCategories);
        setCategoryMap(categoryMap);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setCategories([]);
      })
      .finally(() => setCategoriesLoading(false));
  }, [productType]);

  // Fetch products from API
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
        // Validate that the ID is a valid MongoDB ObjectId (24 hex characters)
        if (
          typeof categoryId === "string" &&
          categoryId.length === 24 &&
          /^[0-9a-fA-F]{24}$/.test(categoryId)
        ) {
          params.productSubCategoryId = categoryId;
        } else {
          console.warn("Invalid category ID format:", categoryId);
          // Fallback to name-based filtering
          params.productSubcategoryName = category;
        }
      } else {
        // Fallback to name-based filtering if no ID mapping exists
        params.productSubcategoryName = category;
      }
    }
    if (productType) params.productType = productType;
    if (deliveryMode && deliveryMode !== "all")
      params.deliveryMode = deliveryMode;
    if (sessionType && sessionType !== "all") params.sessionType = sessionType;
    if (difficulty) params.difficultyLevel = difficulty;
    if (sortBy && sortBy !== "default") params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    getApiRequest<any>("/api/products/public", undefined, params)
      .then((data) => {
        setProducts(data?.data?.data?.products || []);
        setTotalPages(data?.data?.data?.pagination?.totalPages || 1);
      })
      .catch((err) => {
        console.error("API Error details:", err);
        setError(err);
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
  ]);

  const handleAddToCart = (product: Product, event: React.MouseEvent) => {
    // Check if product requires booking
    const requiresBooking =
      product.requiresBooking || product.isBookableService || false;

    if (requiresBooking) {
      // Redirect to public bookings page for bookable products
      const bookingUrl = `/bookings?productId=${
        product._id
      }&productName=${encodeURIComponent(
        product.service
      )}&productType=${encodeURIComponent(
        product.productType
      )}&deliveryMode=${encodeURIComponent(
        product.deliveryMode
      )}&sessionType=${encodeURIComponent(
        product.sessionType
      )}&duration=${encodeURIComponent(
        `${product.programLength} ${product.mode}`
      )}&minutesPerSession=${product.minutesPerSession}&price=${
        product.price
      }&instructorId=${product.instructorId}&isClassroom=${
        product.hasClassroom
      }&isSession=${product.hasSession}&durationInMinutes=${
        product.durationInMinutes
      }`;
      window.location.href = bookingUrl;
      return;
    }

    // For non-bookable products, add directly to cart with animation
    const button = event.currentTarget as HTMLElement;
    const buttonRect = button.getBoundingClientRect();
    // Find cart icon in header
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
    const endPos = cartPos;
    setFlyingItem({
      id: product._id,
      title: product.service,
      image: product.thumbnailUrl || "/assets/default-product.png",
      startPos,
      endPos,
    });
    setTimeout(() => {
      const cartItem: CartItem = {
        id: product._id,
        title: product.service,
        description: product.description || "",
        price: product.price,
        discountPercentage: product.discountPercentage || 0,
        category:
          product.productCategoryTitle || product.category || "Uncategorized",
        productType: product.productType,
        image: product.thumbnailUrl || "/assets/default-product.png",
        duration: `${product.programLength} ${product.mode}`,
        certificate: product.hasCertificate,
        status: product.enabled ? "active" : "inactive",
        level: product.productSubcategoryName || "",
        requiresBooking: false,

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
        instructorId: product.instructorId,
        instructorName: product.instructorName,
        virtualPlatform: product.virtualPlatform,
        classroomCapacity: product.classroomCapacity,
        classroomRequirements: product.classroomRequirements,
      };
      addToCart(cartItem);
      setFlyingItem(null);
    }, 800);
  };

  const handleViewDetails = async (id: string) => {
    setDetailsLoading(true);
    setShowDetailsModal(true);
    try {
      const data = await getApiRequest<any>(`/api/products/public/${id}`);
      setSelectedProduct(data?.data?.data || null);
    } catch (error) {
      console.error("Error fetching product details:", error);
      setSelectedProduct(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-6 px-4 py-16 md:py-20 md:px-8 bg-white">
      {/* Main Heading and Description */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white">
          {title}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">{description}</p>
      </div>

      {/* Latest Programs Section */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Latest {productType} Programs
          </h2>
          <p className="text-gray-600 text-sm">
            Discover our most latest {productType.toLowerCase()} programs
          </p>
        </div>

        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 px-4 md:px-0 scrollbar-hide">
            {products.slice(0, 6).map((product, index) => (
              <div
                key={product._id}
                className="flex-shrink-0 bg-white border border-gray-200 rounded-xl p-4 w-[240px] cursor-pointer group hover:shadow-lg hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => handleViewDetails(product._id)}
              >
                {/* Product Image */}
                <div className="relative w-full h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg mb-3 overflow-hidden">
                  <Image
                    src={
                      product.thumbnailUrl ||
                      product.iconUrl ||
                      "/assets/default-product.png"
                    }
                    alt={product.service}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Icon Overlay */}
                  {product.thumbnailUrl && product.iconUrl && (
                    <div className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center">
                      <Image
                        src={product.iconUrl}
                        alt={`${product.service} icon`}
                        width={12}
                        height={12}
                        className="object-contain"
                      />
                    </div>
                  )}
                  {/* Discount Badge */}
                  {(product.discountPercentage ?? 0) > 0 && (
                    <div className="absolute top-1 left-1 bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                      -{product.discountPercentage ?? 0}%
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.service}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {product.description ||
                        "Comprehensive training program designed to enhance your skills."}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">
                      {product.productCategoryTitle ||
                        product.category ||
                        "Training"}
                    </span>
                    {product.hasCertificate && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                        Certificate
                      </span>
                    )}
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-blue-600">
                        ${product.price.toFixed(2)}
                      </span>
                      {(product.discountPercentage ?? 0) > 0 && (
                        <span className="text-xs text-gray-500 line-through">
                          $
                          {(
                            product.price /
                            (1 - (product.discountPercentage ?? 0) / 100)
                          ).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                      <span className="text-xs font-medium mr-1">View</span>
                      <svg
                        className="w-3 h-3 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Training Categories Navigation */}
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
          <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 md:pb-0 w-full max-w-4xl">
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

      {/* Simple Search */}
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
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <Select
          value={deliveryMode}
          onValueChange={(value) => {
            setDeliveryMode(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40 rounded-xl border-gray-200">
            <SelectValue placeholder="Delivery" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Modes</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="physical">Physical</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sessionType}
          onValueChange={(value) => {
            setSessionType(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40 rounded-xl border-gray-200">
            <SelectValue placeholder="Session Type" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Sessions</SelectItem>
            <SelectItem value="1-on-1">1-on-1</SelectItem>
            <SelectItem value="group">Group</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value) => {
            setSortBy(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40 rounded-xl border-gray-200">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="default">Default</SelectItem>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortOrder}
          onValueChange={(value: "asc" | "desc") => {
            setSortOrder(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-32 rounded-xl border-gray-200">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Product Grid */}
      <main className="flex-1">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden border shadow-none p-2 group h-[340px] rounded-[10px] animate-pulse bg-gray-100"
              >
                <div className="aspect-video bg-gray-200 rounded-[10px] mb-4" />
                <div className="px-0 space-y-3 py-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="flex items-center justify-between mt-2">
                    <div className="h-6 bg-gray-200 rounded w-1/4" />
                    <div className="h-8 bg-gray-200 rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p>Error loading products: {error.message}</p>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center max-w-md mx-auto">
              {/* Empty State Icon */}
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              </div>

              {/* Empty State Text */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Training Programs Found
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We couldn't find any training programs matching your current
                filters. Try adjusting your search criteria or browse our
                complete catalog.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => {
                    setSearch("");
                    setCategory("");
                    setDeliveryMode("all");
                    setSessionType("all");
                    setDifficulty("");
                    setSortBy("default");
                    setPage(1);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Clear All Filters
                </Button>

                {/* <Button
                  variant="outline"
                  onClick={() => setSearch(productType)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
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
                  Browse All Programs
                </Button> */}
              </div>

              {/* Additional Help */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-3">
                  Need help finding the right program?
                </p>
                <div className="flex flex-wrap justify-center gap-3 text-sm">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                    Try different keywords
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                    Adjust filters
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                    Contact support
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card
                  key={product._id}
                  className="flex flex-col h-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 group cursor-pointer"
                  onClick={(e) => {
                    // Prevent modal if Add to Cart button is clicked
                    if (
                      (e.target as HTMLElement).closest(
                        "button[data-add-to-cart]"
                      ) ||
                      (e.target as HTMLElement).closest("svg")
                    )
                      return;
                    handleViewDetails(product._id);
                  }}
                >
                  <div className="relative w-full aspect-square bg-gray-100 rounded-t-xl overflow-hidden">
                    {/* Main Product Image */}
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

                    {/* Icon Overlay (if both thumbnail and icon exist) */}
                    {/* {product.thumbnailUrl && product.iconUrl && (
                      <div className="absolute top-2 left-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                        <Image
                          src={product.iconUrl}
                          alt={`${product.service} icon`}
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      </div>
                    )} */}

                    {/* Discount Badge */}
                    {(product.discountPercentage ?? 0) > 0 && (
                      <span className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                        -{product.discountPercentage ?? 0}%
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
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="flex flex-col items-baseline gap-1">
                        <span className="text-lg font-bold text-blue-600">
                          £{product.price.toFixed(2)}
                        </span>
                        {(product.discountPercentage ?? 0) > 0 && (
                          <span className="text-xs text-gray-500 line-through">
                            £
                            {(
                              product.price /
                              (1 - (product.discountPercentage ?? 0) / 100)
                            ).toFixed(2)}
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
                            <Check size={16} className="mr-2" /> In Cart
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
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-2 pt-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <span>
                    Showing page {page} of {totalPages}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span>
                    {products.length} of {totalPages * perPage} programs
                  </span>
                </div>
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
                    {/* Render page numbers */}
                    {totalPages > 0 && (
                      <>
                        {/* Always show first page */}
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
                        {/* Show ellipsis if current page is far from the start */}
                        {page > 3 && totalPages > 3 && (
                          <PaginationItem className="text-gray-700">
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        {/* Show pages around the current page */}
                        {totalPages > 1 &&
                          Array.from({ length: totalPages }, (_, i) => i + 1)
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
                        {/* Show ellipsis if current page is far from the end */}
                        {page < totalPages - 2 && totalPages > 5 && (
                          <PaginationItem className="text-gray-700">
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        {/* Always show last page if more than one page */}
                        {totalPages > 1 && (
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
                        )}
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
                      className="w-full aspect-video bg-gray-200 rounded-xl"
                      style={{ minHeight: 180 }}
                    />
                    <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                    <div className="flex gap-2 justify-center">
                      <div className="h-5 w-16 bg-gray-200 rounded-full" />
                      <div className="h-5 w-20 bg-gray-200 rounded-full" />
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto" />
                    <div className="pt-4 flex justify-end">
                      <div className="h-10 w-32 bg-gray-200 rounded" />
                    </div>
                  </div>
                ) : selectedProduct ? (
                  <div className="space-y-4">
                    <div
                      className="relative w-full aspect-video bg-gray-100 rounded-xl overflow-hidden"
                      style={{ minHeight: 180 }}
                    >
                      {/* Main Product Image */}
                      <Image
                        src={
                          selectedProduct.thumbnailUrl ||
                          selectedProduct.iconUrl ||
                          "/assets/default-product.png"
                        }
                        alt={selectedProduct.service}
                        fill
                        className="object-cover rounded-xl"
                      />

                      {/* Icon Overlay (if both thumbnail and icon exist) */}
                      {selectedProduct.thumbnailUrl &&
                        selectedProduct.iconUrl && (
                          <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                            <Image
                              src={selectedProduct.iconUrl}
                              alt={`${selectedProduct.service} icon`}
                              width={28}
                              height={28}
                              className="object-contain"
                            />
                          </div>
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
                    </div>
                    <div className="space-y-3">
                      <div className="text-xl font-bold text-blue-900">
                        ${selectedProduct.price.toFixed(2)}
                        {(selectedProduct.discountPercentage ?? 0) > 0 && (
                          <span className="ml-2 text-xs text-green-600">
                            -{selectedProduct.discountPercentage ?? 0}%
                          </span>
                        )}
                      </div>

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
                          <span className="text-gray-600">Session Type:</span>
                          <p className="font-medium">
                            {selectedProduct.sessionType}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Certificate:</span>
                          <p className="font-medium">
                            {selectedProduct.hasCertificate ? "Yes" : "No"}
                          </p>
                        </div>
                      </div>

                      {selectedProduct.tags &&
                        selectedProduct.tags.length > 0 && (
                          <div>
                            <span className="text-gray-600 text-sm">Tags:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedProduct.tags.map(
                                (tag: string, index: number) => (
                                  <span
                                    key={index}
                                    className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                    <div className="pt-4 flex justify-end">
                      {selectedProduct?.slug ? (
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
