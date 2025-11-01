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
  Inbox,
  ExternalLink,
} from "lucide-react";
import { getTokenFromCookies } from "@/lib/cookies";

type Subscription = {
  _id: string;
  provider: string;
  providerSubscriptionId: string;
  providerCustomerId: string;
  providerProductId: string;
  providerPriceId: string;
  userId: string;
  productId: string;
  status: "active" | "trialing" | "past_due" | "canceled" | string;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
  trialStart?: string | null;
  trialEnd?: string | null;
  prorationBehavior?: string | null;
  invoices?: Array<{
    invoiceId: string;
    amountPaid: number;
    currency: string;
    hostedInvoiceUrl?: string;
    status: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

// EU/UK date formatting
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
    }).format(new Date(value));
  } catch {
    return value ?? "—";
  }
}

function EmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="py-16 text-center">
      <Inbox className="mx-auto h-10 w-10 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">No subscriptions</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        You don’t have any active subscriptions yet. Browse plans or refresh if you think this is a mistake.
      </p>
      <div className="mt-6 flex items-center justify-center gap-2">
        <Button asChild className="text-white hover:text-black">
          <Link href="/pricing">Browse plans</Link>
        </Button>
        <Button variant="outline" onClick={onRefresh}>
          Refresh
        </Button>
      </div>
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
  const [data, setData] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("active");

  const fetchEntitlements = useCallback(async () => {
    const token = getTokenFromCookies();
    setError(null);
    setLoading(true);
    try {
      const response = await getApiRequest(`/api/me/subscriptions?status=${statusFilter}`, token || "");
      console.log("Subscriptions response:", response);
      console.log("Subscriptions data:", response?.data);
      const r: any = response?.data;
      const items: Subscription[] = Array.isArray(r?.data)
        ? (r.data as Subscription[])
        : Array.isArray(r?.items)
        ? (r.items as Subscription[])
        : Array.isArray(r)
        ? (r as Subscription[])
        : [];
      setData(items);
    } catch (err: any) {
      setError(err?.message || "Unable to fetch subscriptions.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchEntitlements();
  }, [fetchEntitlements]);

  // Filter data by status
  const filteredData = useMemo(() => {
    if (statusFilter === "all") return data;
    return data.filter((s) => s.status === statusFilter);
  }, [data, statusFilter]);

  const stats = useMemo(() => {
    const total = data.length;
    const active = data.filter((d) => d.status === "active" || d.status === "trialing").length;
    const trialing = data.filter((d) => d.trialEnd && d.status === "trialing").length;
    const nextRenewal = data
      .map((d) => d.currentPeriodEnd)
      .filter(Boolean)
      .map((d) => new Date(d as string).getTime())
      .sort((a, b) => a - b)[0];
    return {
      total,
      active,
      trialing,
      nextRenewal: nextRenewal ? formatDate(new Date(nextRenewal).toISOString()) : "—",
    };
  }, [data]);

  const statusBadge = (status: string) => {
    const base = "px-2 py-1 rounded-full text-xs capitalize";
    if (status === "active") return <Badge className={base}>Active</Badge>;
    if (status === "trialing") return <Badge className={base}>Trialing</Badge>;
    if (status === "past_due") return <Badge variant="destructive" className={base}>Past due</Badge>;
    if (status === "canceled") return <Badge variant="secondary" className={base}>Canceled</Badge>;
    return <Badge variant="secondary" className={base}>{status}</Badge>;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEntitlements();
    setRefreshing(false);
  };

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
              Total Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats.total}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Active
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats.active}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Trialing
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats.trialing}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Next Renewal
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-semibold">
            {stats.nextRenewal}
          </CardContent>
        </Card>
      </div>

      {/* Content / Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            <CardTitle>My Subscriptions</CardTitle>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="trialing">Trialing</option>
              <option value="past_due">Past Due</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Price ID</TableHead>
                    <TableHead className="text-right">Invoices</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-28" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-5 w-12 ml-auto" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-24 ml-auto" />
                    </TableCell>
                  </TableRow>
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
                    <TableHead>Subscription</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Price ID</TableHead>
                    <TableHead className="text-right">Invoices</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((s) => (
                    <TableRow key={s._id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{s.providerSubscriptionId}</span>
                          <span className="text-xs text-muted-foreground">
                            product: {s.providerProductId}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{statusBadge(s.status)}</TableCell>
                      <TableCell className="capitalize">{s.provider}</TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div>Start: {formatDate(s.currentPeriodStart)}</div>
                          <div>End: {formatDate(s.currentPeriodEnd)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs">{s.providerPriceId}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        {(s.invoices?.length || 0).toString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/my-subscriptions/${s._id}`}>
                            <Button size="sm" variant="outline">View</Button>
                          </Link>
                          {s.invoices && s.invoices[0]?.hostedInvoiceUrl && (
                            <a
                              href={s.invoices[0].hostedInvoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button size="sm" variant="ghost">
                                Invoice <ExternalLink className="w-3 h-3 ml-1" />
                              </Button>
                            </a>
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
