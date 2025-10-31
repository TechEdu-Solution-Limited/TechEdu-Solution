"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { safeConsole } from "@/lib/console";

interface NonBookableServiceDetails {
  _id: string;
  productType: string;
  productCategoryId: string;
  productCategoryTitle: string;
  productSubCategoryId: string;
  productSubcategoryName: string;
  service: string;
  description: string;
  isBookableService: boolean;
  mediaType?: string;
  materialUrl?: string;
  thumbnailUrl?: string;
  iconUrl?: string;
  deliveryMode?: string;
  sessionType?: string;
  durationInMinutes?: number;
  minutesPerSession?: number;
  programLength?: number;
  mode?: string;
  pricing?: {
    model: string;
    priceBasis: string;
    currency: string;
    basePrice: number;
    vatPercentage?: number;
    taxInclusive?: boolean;
    minQty?: number;
    maxQty?: number;
  };
  requiresBooking?: boolean;
  requiresEnrollment?: boolean;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  hasAccess: boolean;
}

export default function NonBookableServiceDetailsPage() {
  const params = useParams();
  const serviceId = (params?.id as string) || "";
  const [service, setService] = useState<NonBookableServiceDetails | null>(null);
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
        <Button onClick={() => fetchDetails()}>Try Again</Button>
      </div>
    );
  }

  if (!service) return null;

  const price = service?.pricing?.basePrice ?? 0;
  const currency = (service?.pricing?.currency || "gbp").toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">{service.service}</h1>
          <p className="text-gray-600 mt-2">{service.productType} • {service.productCategoryTitle} • {service.productSubcategoryName}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/non-booked-services">
            <Button variant="outline">Back</Button>
          </Link>
          {service.hasAccess && service.materialUrl ? (
            <a href={service.materialUrl} target="_blank" rel="noopener noreferrer">
              <Button>Open</Button>
            </a>
          ) : (
            <Button variant="secondary">Get Access</Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="capitalize">{service.mediaType || "n/a"}</Badge>
            {service.enabled ? (
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            ) : (
              <Badge className="bg-gray-100 text-gray-800">Disabled</Badge>
            )}
            {service.hasAccess ? (
              <Badge className="bg-emerald-100 text-emerald-700">Access granted</Badge>
            ) : (
              <Badge className="bg-amber-100 text-amber-700">Access required</Badge>
            )}
          </div>
          <p className="text-gray-700 leading-relaxed">{service.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 rounded border">
              <div className="text-xs text-gray-500">Price</div>
              <div className="font-medium">{price > 0 ? `${currency} ${price.toFixed(2)}` : "Free"}</div>
            </div>
            <div className="p-3 rounded border">
              <div className="text-xs text-gray-500">Created</div>
              <div className="font-medium">{new Date(service.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="p-3 rounded border">
              <div className="text-xs text-gray-500">Updated</div>
              <div className="font-medium">{new Date(service.updatedAt).toLocaleDateString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

