"use client";
import React, { useEffect, useState } from "react";
import { getApiRequest } from "@/lib/apiFetch";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";
import { useParams, notFound } from "next/navigation";

import { safeConsole } from "@/lib/console";

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    setLoading(true);
    getApiRequest<any>(`/api/products/public/slug/${slug}`)
      .then((response) => {
        if (response?.data?.success) {
          setProduct(response.data.data || null);
        } else {
          setProduct(null);
        }
      })
      .catch((error) => {
        safeConsole.error("Error fetching product:", error);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading)
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 md:px-0 mt-24">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0 w-full md:w-1/2">
            <div className="w-full aspect-square bg-gray-200 rounded-[12px] animate-pulse" />
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20" />
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-24" />
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
            </div>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-32" />
            <div className="h-10 bg-gray-200 rounded animate-pulse w-40" />
          </div>
        </div>
      </div>
    );
  if (!product) return notFound();

  const handleEnroll = () => {
    // Check if product requires booking
    const requiresBooking =
      product.requiresBooking || product.isBookableService || false;

    // NEW FLOW: Add all products to cart (both bookable and non-bookable)
    const cartItem: CartItem = {
      id: product._id,
      title: product.service,
      description: product.description || "",
      price: product.price,
      currency: product.currency,
      discountPercentage: product.discountPercentage || 0,
      category:
        product.productCategoryTitle || product.category || "Uncategorized",
      productType: product.productType,
      image:
        product.thumbnailUrl ||
        product.iconUrl ||
        "/assets/default-product.png",
      duration: `${product.programLength} ${product.mode}`,
      certificate: product.hasCertificate,
      status: product.enabled ? "active" : "inactive",
      level: product.productSubcategoryName || "",
      requiresBooking: requiresBooking,

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
      return `${product.programLength} day${
        product.programLength > 1 ? "s" : ""
      }`;
    } else if (product.mode === "weeks") {
      return `${product.programLength} week${
        product.programLength > 1 ? "s" : ""
      }`;
    } else if (product.mode === "months") {
      return `${product.programLength} month${
        product.programLength > 1 ? "s" : ""
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
    <section className="max-w-3xl mx-auto py-12 px-4 md:px-0 mt-24">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 w-full md:w-1/2">
          <div className="relative w-full aspect-square bg-gray-100 rounded-[12px] overflow-hidden">
            <Image
              src={
                product.thumbnailUrl ||
                product.iconUrl ||
                "/assets/default-product.png"
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
            {product.description || "No description available."}
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

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-blue-900">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: product.currency || "USD",
                }).format(
                  product.price -
                    (product.price * (product.discountPercentage ?? 0)) / 100
                )}
              </span>
              {product.discountPercentage && product.discountPercentage > 0 && (
                <span className="text-green-600 font-semibold text-lg">
                  -{product.discountPercentage}%
                </span>
              )}
            </div>
            {product.discountPercentage && product.discountPercentage > 0 && (
              <span className="text-lg text-gray-500 line-through">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: product.currency || "USD",
                }).format(product.price)}
              </span>
            )}
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
