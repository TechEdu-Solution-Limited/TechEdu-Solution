"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import Link from "next/link";
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
  const [mediaFilter, setMediaFilter] = useState<string>("all");

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
        "/api/non-bookable-services/my-services",
        token
      );
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
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

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
        <Button onClick={() => fetchServices()}>Try Again</Button>
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
          <Button variant="outline" onClick={fetchServices} disabled={loading}>
            <Calendar className="w-4 h-4 mr-2" />
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-4">
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
                <option value="all">All media</option>
                <option value="file">File</option>
                <option value="video">Video</option>
                <option value="link">Link</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-600">No services found.</div>
          ) : (
            <div className="w-full overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-12 px-4 py-3 text-xs font-semibold uppercase text-gray-500 bg-gray-50 rounded-t-md">
                  <div className="col-span-4">Service</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-1">Media</div>
                  <div className="col-span-1">Access</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {filtered.map((s) => {
                    const price = s?.pricing?.basePrice ?? 0;
                    const currency = (s?.pricing?.currency || "gbp").toUpperCase();
                    return (
                      <div key={s._id} className="grid grid-cols-12 px-4 py-4 items-center">
                        <div className="col-span-4">
                          <div className="font-medium">{s.service}</div>
                          <div className="text-sm text-gray-600 line-clamp-1">{s.description}</div>
                          <div className="mt-1 flex gap-2 text-xs text-gray-500">
                            <Badge variant="secondary" className="text-[10px]">{s.productType}</Badge>
                            {s.enabled ? (
                              <Badge className="bg-green-100 text-green-800 text-[10px]">Enabled</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800 text-[10px]">Disabled</Badge>
                            )}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-sm">{s.productCategoryTitle}</div>
                          <div className="text-xs text-gray-600">{s.productSubcategoryName}</div>
                        </div>
                        <div className="col-span-1">
                          <Badge variant="outline" className="text-xs capitalize">{s.mediaType || "-"}</Badge>
                        </div>
                        <div className="col-span-1">
                          {s.hasAccess ? (
                            <Badge className="bg-emerald-100 text-emerald-700">Granted</Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-700">Restricted</Badge>
                          )}
                        </div>
                        <div className="col-span-2">
                          {price > 0 ? (
                            <span className="font-medium">{currency} {price.toFixed(2)}</span>
                          ) : (
                            <span className="text-gray-600">Free</span>
                          )}
                        </div>
                        <div className="col-span-2 flex justify-end gap-2">
                          <Link href={`/dashboard/non-booked-services/${s._id}`}>
                            <Button size="sm" variant="outline">View</Button>
                          </Link>
                          {s.hasAccess && s.materialUrl ? (
                            <a href={s.materialUrl} target="_blank" rel="noopener noreferrer">
                              <Button size="sm">Open</Button>
                            </a>
                          ) : (
                            <Button size="sm" variant="secondary">Get Access</Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
