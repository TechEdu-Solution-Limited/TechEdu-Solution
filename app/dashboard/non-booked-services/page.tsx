"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { safeConsole } from "@/lib/console";

interface NonBookableService {
  _id: string;
  productType: string;
  productCategoryId: string;
  productCategoryTitle: string;
  productSubCategoryId: string;
  productSubcategoryName: string;
  service: string;
  description: string;
  isBookableService: boolean;
  mediaType?: "file" | "video" | "link" | string;
  materialUrl?: string;
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
}

export default function NonBookableServicesPage() {
  const [services, setServices] = useState<NonBookableService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [mediaFilter, setMediaFilter] = useState<string>("file");

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }
      const response = await getApiRequest(
        `/api/non-bookable-services/my-services?mediaType=${mediaFilter}`,
        token
      );
      console.log("Non-booked services response:", response);
      console.log("Non-booked services data:", response?.data);
      if (response?.data?.success) {
        const data = (response.data.data || []) as NonBookableService[];
        setServices(data);
      } else {
        setError("Failed to fetch services");
        safeConsole.error("Failed to fetch services:", response?.data?.message);
      }
    } catch (err) {
      setError("Failed to fetch services");
      safeConsole.error("Error fetching non-bookable services:", err);
    } finally {
      setLoading(false);
    }
  }, [mediaFilter]);

  useEffect(() => {
    fetchServices();
  }, [mediaFilter]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services.filter((s) => {
      const matchesQuery = q
        ? [
            s.service,
            s.productType,
            s.productCategoryTitle,
            s.productSubcategoryName,
            s.description,
          ]
            .filter(Boolean)
            .some((v) => v.toLowerCase().includes(q))
        : true;
      const matchesMedia = mediaFilter === "all" ? true : (s.mediaType || "").toLowerCase() === mediaFilter;
      return matchesQuery && matchesMedia;
    });
  }, [services, query, mediaFilter]);

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => fetchServices()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">My Non-bookable Services</h1>
          <p className="text-gray-600 mt-2">
            Access tools, files, and videos available to your role
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchServices}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="col-span-2">
              <input
                className="w-full h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by name, type, category, description"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="w-full h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={mediaFilter}
                onChange={(e) => setMediaFilter(e.target.value)}
              >
                <option value="file">File</option>
                <option value="audio">Audio</option>
                <option value="video">Video</option>
              </select>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-600">No services found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((s) => {
              const price = s?.pricing?.basePrice ?? 0;
              const currency = (s?.pricing?.currency || "gbp").toUpperCase();
              const fileExt = s.materialUrl?.split('.').pop()?.toLowerCase() || '';
              const filename = s.materialUrl?.split('/').pop() || 'download';
              
              // Determine media icon
              const getMediaIcon = () => {
                if (fileExt === 'pdf') {
                  return (
                    <div className="w-16 h-16 flex items-center justify-center bg-red-100 rounded-lg">
                      <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                      </svg>
                    </div>
                  );
                } else if (['doc', 'docx'].includes(fileExt)) {
                  return (
                    <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-lg">
                      <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                      </svg>
                    </div>
                  );
                } else if (['mp3', 'wav', 'm4a'].includes(fileExt)) {
                  return (
                    <div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-lg">
                      <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12,3V13.55C11.41,13.21 10.73,13 10,13A4,4 0 0,0 6,17A4,4 0 0,0 10,21A4,4 0 0,0 14,17V7H18V5H12M10,19A2,2 0 0,1 8,17A2,2 0 0,1 10,15A2,2 0 0,1 12,17A2,2 0 0,1 10,19Z" />
                      </svg>
                    </div>
                  );
                } else if (['mp4', 'avi', 'mov', 'webm'].includes(fileExt)) {
                  return (
                    <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-lg">
                      <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
                      </svg>
                    </div>
                  );
                }
                return (
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg">
                    <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                  </div>
                );
              };

              return (
                <div key={s._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                  <div className="flex gap-3">
                    {getMediaIcon()}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{s.service}</h3>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="px-2 py-1 border border-gray-300 text-xs rounded capitalize">
                          {s.mediaType || "file"}
                        </span>
                        <span className="font-medium text-blue-600">
                          {price > 0 ? `${currency} ${price.toFixed(2)}` : "Free"}
                        </span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <a
                          href={`/dashboard/non-booked-services/${s._id}`}
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 text-center"
                        >
                          View Details
                        </a>
                        {s.hasAccess && s.materialUrl && (
                          <button
                            onClick={() => handleDownload(s.materialUrl!, filename)}
                            className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
  