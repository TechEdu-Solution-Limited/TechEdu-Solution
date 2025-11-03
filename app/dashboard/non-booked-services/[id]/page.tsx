"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { safeConsole } from "@/lib/console";
import { getCurrencySymbol } from "@/lib/constants/currencies";

interface NonBookableServiceDetails {
  _id: string;
  productType: string;
  productCategoryTitle: string;
  productSubcategoryName: string;
  service: string;
  description: string;
  mediaType?: string;
  materialUrl?: string;
  thumbnailUrl?: string;
  iconUrl?: string;
  pricing?: {
    model: string;
    priceBasis: string;
    currency: string;
    basePrice: number;
    vatPercentage?: number;
    taxInclusive?: boolean;
  };
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  hasAccess: boolean;
  tags?: string[];
}

export default function NonBookableServiceDetailsPage() {
  const params = useParams();
  const serviceId = (params?.id as string) || "";
  const [service, setService] = useState<NonBookableServiceDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }
      const response = await getApiRequest(
        `/api/non-bookable-services/my-services/${serviceId}`,
        token
      );
      if (response?.data?.success) {
        setService(response.data.data as NonBookableServiceDetails);
      } else {
        setError("Failed to fetch service details");
        safeConsole.error("Failed to fetch service:", response?.data?.message);
      }
    } catch (err) {
      setError("Failed to fetch service details");
      safeConsole.error("Error fetching service details:", err);
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    if (serviceId) fetchDetails();
  }, [serviceId, fetchDetails]);

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => fetchDetails()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!service) return null;

  const price = service?.pricing?.basePrice ?? 0;
  const currency = service?.pricing?.currency || "gbp";
  const fileExt = service.materialUrl?.split(".").pop()?.toLowerCase() || "";
  const filename = service.materialUrl?.split("/").pop() || "download";

  // Get media icon SVG
  const getMediaIconSVG = () => {
    if (fileExt === "pdf") {
      return (
        <svg
          className="w-20 h-20 text-red-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      );
    } else if (["doc", "docx"].includes(fileExt)) {
      return (
        <svg
          className="w-20 h-20 text-blue-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      );
    } else if (["mp3", "wav", "m4a"].includes(fileExt)) {
      return (
        <svg
          className="w-20 h-20 text-purple-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12,3V13.55C11.41,13.21 10.73,13 10,13A4,4 0 0,0 6,17A4,4 0 0,0 10,21A4,4 0 0,0 14,17V7H18V5H12M10,19A2,2 0 0,1 8,17A2,2 0 0,1 10,15A2,2 0 0,1 12,17A2,2 0 0,1 10,19Z" />
        </svg>
      );
    } else if (["mp4", "avi", "mov", "webm"].includes(fileExt)) {
      return (
        <svg
          className="w-20 h-20 text-green-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
        </svg>
      );
    }
    return (
      <svg
        className="w-20 h-20 text-gray-600"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <a
          href="/dashboard/non-booked-services"
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 inline-flex items-center gap-2"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </a>
        {service.hasAccess && service.materialUrl && (
          <button
            onClick={() => handleDownload(service.materialUrl!, filename)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-flex items-center gap-2"
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Icon */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
              {getMediaIconSVG()}
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {service.service}
              </h1>
              <p className="text-gray-600">
                {service.productType} • {service.productCategoryTitle}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full capitalize">
                {service.mediaType || "file"}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                {service.enabled ? "Enabled" : "Disabled"}
              </span>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  service.hasAccess
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {service.hasAccess ? "Access Granted" : "Access Required"}
              </span>
            </div>

            <div className="text-gray-700 leading-relaxed">
              {service.description}
            </div>

            {/* Tags */}
            {service.tags && service.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <div className="text-xs text-gray-500 mb-1">Price</div>
                <div className="text-lg font-semibold text-gray-900">
                  {price > 0
                    ? `${getCurrencySymbol(currency)}${price.toFixed(2)}`
                    : "Free"}
                </div>
              </div>
              <button onClick={() => handleDownload(service.materialUrl!, filename)} className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-flex items-center gap-2">
                Download
              </button>
              {/* <div>
                <div className="text-xs text-gray-500 mb-1">Created</div>
                <div className="text-sm font-medium text-gray-900">
                  {new Date(service.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Updated</div>
                <div className="text-sm font-medium text-gray-900">
                  {new Date(service.updatedAt).toLocaleDateString()}
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
