"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getApiRequest } from "@/lib/apiFetch";
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
  status: string;
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

function formatDate(value?: string | null) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(new Date(value));
  } catch {
    return value ?? "—";
  }
}

export default function SubscriptionDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = getTokenFromCookies() || "";
        const resp = await getApiRequest(`/api/me/subscriptions/${id}`, token);
        const r: any = resp?.data;
        setSub(r?.data ?? null);
      } catch (e: any) {
        setError(e?.message || "Failed to load subscription");
      } finally {
        setLoading(false);
      }
    };
    if (id) run();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-40 w-full bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  if (error || !sub) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600 mb-4">{error || "Subscription not found"}</p>
        <Link href="/dashboard/my-subscriptions">
          <Button variant="outline">Back</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Subscription Details</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {sub.providerSubscriptionId} • {sub.provider}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/my-subscriptions">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 border rounded">
            <div className="text-xs text-muted-foreground">Status</div>
            <div className="mt-1"><Badge className="capitalize">{sub.status}</Badge></div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-xs text-muted-foreground">Price ID</div>
            <div className="mt-1 font-mono text-xs">{sub.providerPriceId}</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-xs text-muted-foreground">Current Period</div>
            <div className="mt-1 text-sm">{formatDate(sub.currentPeriodStart)} → {formatDate(sub.currentPeriodEnd)}</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-xs text-muted-foreground">Cancel at period end</div>
            <div className="mt-1 text-sm">{sub.cancelAtPeriodEnd ? "Yes" : "No"}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {(!sub.invoices || sub.invoices.length === 0) ? (
            <div className="text-sm text-muted-foreground">No invoices found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount Paid</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sub.invoices!.map((inv) => (
                    <TableRow key={inv.invoiceId}>
                      <TableCell className="font-mono text-xs">{inv.invoiceId}</TableCell>
                      <TableCell className="capitalize">{inv.status}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: (inv.currency || "USD").toUpperCase() }).format(inv.amountPaid || 0)}
                      </TableCell>
                      <TableCell>{formatDate(inv.createdAt)}</TableCell>
                      <TableCell>
                        {inv.hostedInvoiceUrl ? (
                          <a href={inv.hostedInvoiceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
                            View
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
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


