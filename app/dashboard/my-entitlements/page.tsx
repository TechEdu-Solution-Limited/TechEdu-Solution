"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { getApiRequest } from "@/lib/apiFetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Loader2,
  RefreshCcw,
  ShieldCheck,
  AlertCircle,
  Info,
  Inbox,
} from "lucide-react";
import { getTokenFromCookies } from "@/lib/cookies";

type Entitlement = {
  _id: string;
  userId: string;
  subjectType: "feature" | "plan" | string;
  subjectId: string;
  subjectKey: string;
  status: "active" | "inactive" | "expired" | string;
  startsAt?: string | null;
  endsAt?: string | null;
  allocation: "per_user" | "per_team" | string;
  quantity: number; // -1 = unlimited
  consumed?: number;
  source?: {
    kind?: "subscription" | "promotion" | "manual" | string;
    id?: string;
    priceId?: string;
  };
};

// EU/UK date & time formatting
const LOCALE = "en-GB";
const TZ = "Europe/London";

function formatDate(value?: string | null) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat(LOCALE, {
      timeZone: TZ,
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short", // BST/GMT
    }).format(new Date(value));
  } catch {
    return value ?? "—";
  }
}

function remainingOf(e: Entitlement) {
  if (e.quantity === -1) return "Unlimited";
  const consumed = e.consumed ?? 0;
  return Math.max(e.quantity - consumed, 0);
}

/** Accepts multiple possible backend/wrapper shapes and returns items safely */
function extractItems(raw: unknown): Entitlement[] {
  const r = raw as any;
  // Direct: { ok, items }
  if (Array.isArray(r?.items)) return r.items as Entitlement[];
  // Wrapped: { success|ok, data: { items } }
  if (Array.isArray(r?.data?.items)) return r.data.items as Entitlement[];
  // Wrapped array: { success|ok, data: Entitlement[] }
  if (Array.isArray(r?.data)) return r.data as Entitlement[];
  // Bare array fallback
  if (Array.isArray(r)) return r as Entitlement[];
  return [];
}

function EmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="py-16 text-center">
      <Inbox className="mx-auto h-10 w-10 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">No active entitlements</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        You don’t have any paid features yet. Pick a plan to unlock features, or
        refresh if you think this is a mistake.
      </p>
      <div className="mt-6 flex items-center justify-center gap-2">
        <Button asChild className="text-white hover:text-black">
          <Link href="/pricing">Browse plans</Link>
        </Button>
        <Button variant="outline" onClick={onRefresh}>
          Refresh
        </Button>
      </div>
      {/* <p className="mt-3 text-xs text-muted-foreground">
        Need help?{" "}
        <a href="mailto:support@yourapp.com" className="underline">
          Contact support
        </a>
      </p> */}
    </div>
  );
}

function TableSkeletonRows({ rows = 6 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <div className="space-y-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-24" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-4 w-14 ml-auto" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-4 w-12 ml-auto" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-4 w-16 ml-auto" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-36" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-36" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-3 w-28" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function Page() {
  const [data, setData] = useState<Entitlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [subjectTypeFilter, setSubjectTypeFilter] = useState<string>("product");

  const fetchEntitlements = useCallback(async () => {
    const token = getTokenFromCookies();
    setError(null);
    setLoading(true);
    try {
      const response = await getApiRequest(`/api/me/entitlements?subjectType=${subjectTypeFilter}`, token || "");
      console.log("fetchEntitlements response", response);
      console.log("Entitlement Data", response?.data)
      const items = extractItems(response?.data);
      setData(items);
    } catch (err: any) {
      setError(err?.message || "Unable to fetch entitlements. " + subjectTypeFilter);
    } finally {
      setLoading(false);
    }
  }, [subjectTypeFilter]);

  // Filter data by subjectType
  const filteredData = useMemo(() => {
    if (subjectTypeFilter === "all") return data;
    return data.filter((e) => e.subjectType === subjectTypeFilter);
  }, [data, subjectTypeFilter]);

  const stats = useMemo(() => {
    const total = filteredData.length;
    const unlimitedCount = filteredData.filter((d) => d.quantity === -1).length;
    const finite = filteredData.filter((d) => d.quantity !== -1);
    const remaining = finite.reduce(
      (sum, e) => sum + Math.max(e.quantity - (e.consumed ?? 0), 0),
      0
    );
    const features = new Set(filteredData.map((d) => d.subjectKey)).size;
    const nextExpiry = filteredData
      .map((d) => d.endsAt)
      .filter(Boolean)
      .map((d) => new Date(d as string).getTime())
      .sort((a, b) => a - b)[0];

    return {
      total,
      unlimitedCount,
      remaining,
      features,
      nextExpiry: nextExpiry
        ? formatDate(new Date(nextExpiry).toISOString())
        : "—",
    };
  }, [filteredData]);

  const statusBadge = (status: string) => {
    const base = "px-2 rounded-full text-blue-400 text-xs";
    if (status === "active") return <Badge className={base}>Active</Badge>;
    if (status === "expired")
      return (
        <Badge variant="destructive" className={base}>
          Expired
        </Badge>
      );
    return (
      <Badge variant="secondary" className={base}>
        {status}
      </Badge>
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEntitlements();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchEntitlements();
  }, [fetchEntitlements]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header & Intro */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            My Paid Features & Entitlements
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            This page lists all your active entitlements—features unlocked via
            subscriptions, promotions, or manual credits.{" "}
            <strong>Quantity</strong> is your allowance,
            <strong> Consumed</strong> shows what you’ve used, and{" "}
            <strong>Remaining</strong> is what’s left.
            <em> Unlimited</em> means no usage cap. Times shown in{" "}
            <span className="font-medium">Europe/London</span> ({LOCALE}).
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={loading || refreshing}
          variant="outline"
        >
          {refreshing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Entitlements
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats.total}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Distinct Features
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats.features}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Unlimited
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats.unlimitedCount}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Next Expiry
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-semibold">
            {stats.nextExpiry}
          </CardContent>
        </Card>
      </div>

      {/* Content / Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            <CardTitle>Active Entitlements</CardTitle>
          </div>
          <div className="flex gap-2">
            <select
              value={subjectTypeFilter}
              onChange={(e) => setSubjectTypeFilter(e.target.value)}
              className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All subject types</option>
              <option value="product">Product</option>
              <option value="feature">Feature</option>
              <option value="tool">Tool</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Allocation</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Consumed</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead>Starts</TableHead>
                    <TableHead>Ends</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableSkeletonRows rows={6} />
                </TableBody>
              </Table>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-red-600 py-8">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          ) : data.length === 0 ? (
            <EmptyState onRefresh={handleRefresh} />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Allocation</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Consumed</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead>Starts</TableHead>
                    <TableHead>Ends</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((e) => (
                    <TableRow key={e._id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{e.subjectKey}</span>
                          <span className="text-xs text-muted-foreground">
                            {e.subjectType} · {e.subjectId}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{statusBadge(e.status)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {e.allocation.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {e.quantity === -1 ? "Unlimited" : e.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {e.consumed ?? 0}
                      </TableCell>
                      <TableCell className="text-right">
                        {remainingOf(e)}
                      </TableCell>
                      <TableCell>{formatDate(e.startsAt)}</TableCell>
                      <TableCell>{formatDate(e.endsAt)}</TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div className="capitalize">
                            {e.source?.kind || "—"}
                          </div>
                          {e.source?.priceId && (
                            <div className="text-muted-foreground">
                              price: {e.source.priceId}
                            </div>
                          )}
                          {e.source?.id && (
                            <div className="text-muted-foreground">
                              id: {e.source.id}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
