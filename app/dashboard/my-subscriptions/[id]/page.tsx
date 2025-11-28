"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getApiRequest, apiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { toast } from "react-toastify";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const id = params?.id as string;
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canceling, setCanceling] = useState(false);
  const [cancelDialog, setCancelDialog] = useState<{
    open: boolean;
    cancelImmediately: boolean;
  }>({
    open: false,
    cancelImmediately: false,
  });

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

  const handleCancelSubscription = async (cancelImmediately: boolean = false) => {
    if (!sub?._id) return;

    const token = getTokenFromCookies();
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    setCanceling(true);
    try {
      const response = await apiRequest(
        `/api/me/subscriptions/${sub._id}`,
        "DELETE",
        { cancelImmediately },
        token
      );

      if (response.data?.success) {
        toast.success(response.data?.message || "Subscription canceled successfully");
        // Update the subscription state
        if (response.data?.data) {
          setSub({
            ...sub,
            status: response.data.data.status || "canceled",
            cancelAtPeriodEnd: response.data.data.cancelAtPeriodEnd || false,
          });
        }
        setCancelDialog({ open: false, cancelImmediately: false });
        // Optionally redirect after a delay
        setTimeout(() => {
          router.push("/dashboard/my-subscriptions");
        }, 2000);
      } else {
        throw new Error(response.data?.message || "Failed to cancel subscription");
      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || err?.message || "Failed to cancel subscription";
      toast.error(errorMessage);
    } finally {
      setCanceling(false);
    }
  };

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
          {sub.status !== "canceled" && sub.status !== "incomplete" && (
            <Button
              variant="destructive"
              onClick={() => setCancelDialog({ open: true, cancelImmediately: false })}
              disabled={canceling}
              className="text-white bg-red-500 hover:bg-red-600"
            >
              {canceling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Canceling...
                </>
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel Subscription
                </>
              )}
            </Button>
          )}
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
            <div className="mt-1"><Badge className="capitalize text-blue-500">{sub.status}</Badge></div>
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

      {/* Cancel Subscription Confirmation Dialog */}
      {cancelDialog.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <X className="w-5 h-5 text-red-600" />
                Cancel Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to cancel this subscription?
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800 font-medium mb-2">
                  Cancellation Options:
                </p>
                <div className="space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="cancelOption"
                      checked={!cancelDialog.cancelImmediately}
                      onChange={() => setCancelDialog({ ...cancelDialog, cancelImmediately: false })}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Cancel at period end (Recommended)
                      </p>
                      <p className="text-xs text-gray-600">
                        Your subscription will remain active until {formatDate(sub.currentPeriodEnd)}. 
                        You'll continue to have access until then.
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="cancelOption"
                      checked={cancelDialog.cancelImmediately}
                      onChange={() => setCancelDialog({ ...cancelDialog, cancelImmediately: true })}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Cancel immediately
                      </p>
                      <p className="text-xs text-gray-600">
                        Your subscription will be canceled right away. Access will end immediately.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setCancelDialog({ open: false, cancelImmediately: false })}
                  disabled={canceling}
                >
                  Keep Subscription
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleCancelSubscription(cancelDialog.cancelImmediately)}
                  disabled={canceling}
                >
                  {canceling ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Canceling...
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Confirm Cancellation
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


