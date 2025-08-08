"use client";
import React, { useEffect, useState } from "react";
import { getApiRequest } from "@/lib/apiFetch";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { CartItem } from "@/types/cart";
import { useParams, notFound } from "next/navigation";

interface Product {
  _id: string;
  productType: string;
  productCategoryId: {
    _id: string;
    title: string;
    productType: string;
  };
  productCategoryTitle: string;
  productSubCategoryId: {
    _id: string;
    name: string;
    productType: string;
  };
  productSubcategoryName: string;
  service: string;
  deliveryMode: string;
  sessionType: string;
  isRecurring: boolean;
  programLength: number;
  mode: string;
  durationInMinutes: number;
  minutesPerSession: number;
  hasClassroom: boolean;
  hasSession: boolean;
  hasAssessment: boolean;
  hasCertificate: boolean;
  requiresBooking: boolean;
  requiresEnrollment: boolean;
  isBookableService: boolean;
  instructorId: string;
  instructorName?: string;
  virtualPlatform?: string;
  classroomCapacity?: number;
  classroomRequirements?: string[];
  price: number;
  discountPercentage?: number;
  description: string;
  tags: string[];
  slug: string;
  iconUrl?: string;
  thumbnailUrl?: string;
  enabled: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

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
        console.error("Error fetching product:", error);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!product) return notFound();

  const handleEnroll = () => {
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

    // For non-bookable products, add directly to cart
    const cartItem: CartItem = {
      id: product._id,
      title: product.service,
      description: product.description || "",
      price: product.price,
      discountPercentage: product.discountPercentage || 0,
      category: product.productCategoryTitle,
      productType: product.productType,
      image:
        product.thumbnailUrl ||
        product.iconUrl ||
        "/assets/default-product.png",
      duration: `${product.programLength} ${product.mode}`,
      certificate: product.hasCertificate,
      status: product.enabled ? "active" : "inactive",
      level: product.productSubcategoryName,
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
          <div className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden">
            <Image
              src={
                product.thumbnailUrl ||
                product.iconUrl ||
                "/assets/default-product.png"
              }
              alt={product.service}
              fill
              className="object-cover rounded-xl"
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
            <span className="text-2xl font-bold text-blue-900">
              ${product.price.toFixed(2)}
            </span>
            {product.discountPercentage && product.discountPercentage > 0 && (
              <span className="text-green-600 font-semibold text-lg">
                -{product.discountPercentage}%
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
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2"
              onClick={handleEnroll}
              disabled={isInCart(product._id)}
            >
              {isInCart(product._id)
                ? "In Cart"
                : product.requiresBooking || product.isBookableService
                ? "Book Now"
                : "Enroll Now"}
            </Button>
            <Button variant="outline" className="rounded-lg px-6 py-2">
              Add to Wishlist
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
