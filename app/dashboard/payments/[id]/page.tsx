"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiRequestWithRefresh } from "@/lib/apiFetch";
import { Payment } from "@/types/payment";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  CreditCard,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Receipt,
  Tag,
  User,
  Package,
  Building,
  BookOpen,
  Users,
  Target,
  Megaphone,
  Handshake,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Zap,
  Award,
  Loader2,
  AlertCircle,
  Info,
  ChevronRight,
  Star,
  TrendingDown,
  Activity,
  BarChart3,
} from "lucide-react";
import { toast } from "react-toastify";
import { getTokenFromCookies } from "@/lib/cookies";

export default function PaymentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.id as string;

  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const fetchPayment = async () => {
    try {
      setLoading(true);
      const token = getTokenFromCookies();
      const response = await getApiRequestWithRefresh(
        `/api/payments/${paymentId}`,
        token || undefined
      );

      if (response.data && response.data.success) {
        setPayment(response.data.data);
      } else {
        toast.error("Failed to fetch payment details");
        router.push("/dashboard/payments");
      }
    } catch (error) {
      console.error("Error fetching payment:", error);
      toast.error("Failed to fetch payment details");
      router.push("/dashboard/payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paymentId) {
      fetchPayment();
    }
  }, [paymentId]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      success: "default",
      failed: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status}
      </Badge>
    );
  };

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "stripe":
        return <CreditCard className="w-5 h-5" />;
      case "flutterwave":
        return <TrendingUp className="w-5 h-5" />;
      case "paystack":
        return <DollarSign className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getProductTypeIcon = (productType: string) => {
    switch (productType) {
      case "Training & Certification":
        return <BookOpen className="w-5 h-5" />;
      case "Academic Support Services":
        return <Building className="w-5 h-5" />;
      case "Career Development & Mentorship":
        return <Target className="w-5 h-5" />;
      case "Institutional & Team Services":
        return <Users className="w-5 h-5" />;
      case "AI-Powered or Automation Services":
        return <TrendingUp className="w-5 h-5" />;
      case "Recruitment & Job Matching":
        return <User className="w-5 h-5" />;
      case "Marketing":
        return <Megaphone className="w-5 h-5" />;
      case "Consultation & Free Services":
        return <Handshake className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount / 100); // Assuming amount is in cents
  };

  const CopyableField = ({
    label,
    value,
    field,
  }: {
    label: string;
    value: string;
    field: string;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-500">{label}</label>
      <div className="flex items-center gap-2">
        <p className="font-mono text-sm bg-gray-100 p-2 rounded flex-1 truncate">
          {value}
        </p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(value, field)}
                className="h-8 w-8 p-0"
              >
                {copiedField === field ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copiedField === field ? "Copied!" : "Copy to clipboard"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-20" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="space-y-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-24" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-6 w-full" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="text-center py-12">
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-pink-100 rounded-full"></div>
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Payment not found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              The payment you're looking for doesn't exist or you don't have
              access to it.
            </p>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => router.push("/dashboard/payments")}
            >
              View All Payments
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Payments
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Payment Details
              </h1>
              <p className="text-gray-600 mt-1">
                Transaction ID: {payment.transactionId}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {payment.receiptUrl && (
              <Button
                variant="outline"
                asChild
                className="bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <a
                  href={payment.receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  View Receipt
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Payment Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Overview */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  Payment Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      Amount
                    </label>
                    <div className="text-3xl font-bold text-green-600">
                      {formatCurrency(payment.amount, payment.currency)}
                    </div>
                    <p className="text-sm text-gray-500">{payment.currency}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      Status
                    </label>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      {getStatusBadge(payment.status)}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      Provider
                    </label>
                    <div className="flex items-center gap-2">
                      {getProviderIcon(payment.provider)}
                      <span className="capitalize font-medium">
                        {payment.provider}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      Product Type
                    </label>
                    <div className="flex items-center gap-2">
                      {getProductTypeIcon(payment.productType)}
                      <span className="font-medium">{payment.productType}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Details */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Activity className="w-5 h-5 text-purple-600" />
                  </div>
                  Transaction Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <CopyableField
                    label="Transaction ID"
                    value={payment.transactionId}
                    field="transactionId"
                  />
                  <CopyableField
                    label="Payment ID"
                    value={payment._id}
                    field="paymentId"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <CopyableField
                    label="Product ID"
                    value={payment.productId}
                    field="productId"
                  />
                  {payment.bookingId && (
                    <CopyableField
                      label="Booking ID"
                      value={payment.bookingId}
                      field="bookingId"
                    />
                  )}
                </div>

                {payment.jobApplicationId && (
                  <CopyableField
                    label="Job Application ID"
                    value={payment.jobApplicationId}
                    field="jobApplicationId"
                  />
                )}

                {payment.couponCode && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      Coupon Code
                    </label>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{payment.couponCode}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Info className="w-5 h-5 text-green-600" />
                  </div>
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      Platform Role
                    </label>
                    <p className="font-medium">{payment.platformRole}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      Webhook Received
                    </label>
                    <div className="flex items-center gap-2">
                      {payment.webhookReceived ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span>{payment.webhookReceived ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>

                {payment.bookingService && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      Booking Service
                    </label>
                    <p className="font-medium">{payment.bookingService}</p>
                  </div>
                )}

                {payment.profileId && (
                  <CopyableField
                    label="Profile ID"
                    value={payment.profileId}
                    field="profileId"
                  />
                )}

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      Is Session
                    </label>
                    <p className="font-medium">
                      {payment.isSession ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      Is Classroom
                    </label>
                    <p className="font-medium">
                      {payment.isClassroom ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timestamps */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  Timestamps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Created
                  </label>
                  <p className="text-sm">{formatDate(payment.createdAt)}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Updated
                  </label>
                  <p className="text-sm">{formatDate(payment.updatedAt)}</p>
                </div>
                {payment.deletedAt && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      Deleted
                    </label>
                    <p className="text-sm">{formatDate(payment.deletedAt)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stripe Details (if applicable) */}
            {(payment.stripeProductId || payment.stripePriceId) && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Zap className="w-5 h-5 text-blue-600" />
                    </div>
                    Stripe Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {payment.stripeProductId && (
                    <CopyableField
                      label="Product ID"
                      value={payment.stripeProductId}
                      field="stripeProductId"
                    />
                  )}
                  {payment.stripePriceId && (
                    <CopyableField
                      label="Price ID"
                      value={payment.stripePriceId}
                      field="stripePriceId"
                    />
                  )}
                  {payment.clientSecret && (
                    <CopyableField
                      label="Client Secret"
                      value={payment.clientSecret}
                      field="clientSecret"
                    />
                  )}
                </CardContent>
              </Card>
            )}

            {/* Security Info */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>256-bit SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>PCI DSS Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>Secure Payment Processing</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
