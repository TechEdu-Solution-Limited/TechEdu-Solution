"use client";

import React, { useState, useEffect } from "react";
import { useRole } from "@/contexts/RoleContext";
import { useRouter } from "next/navigation";
import { getApiRequestWithRefresh } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  Filter,
  Download,
  Eye,
  CreditCard,
  Calendar,
  DollarSign,
  TrendingUp,
  Receipt,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  RefreshCw,
  BarChart3,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Share2,
  Printer,
  FilterX,
  Sparkles,
  Zap,
  Shield,
  Award,
  Smartphone,
  Monitor,
  Tablet,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Info,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";
import { Payment, PaymentsResponse, PaymentFilters } from "@/types/payment";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function PaymentsPage() {
  const { userData } = useRole();
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter states
  const [filters, setFilters] = useState<PaymentFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
    status: "all",
    provider: "all",
    productType: "all",
    platformRole: "all",
    currency: "",
    startDate: "",
    endDate: "",
    search: "",
  });

  const fetchPayments = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Build query parameters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") {
          queryParams.append(key, value.toString());
        }
      });

      const token = getTokenFromCookies();
      const response = await getApiRequestWithRefresh(
        `/api/payments/my-payments?${queryParams.toString()}`,
        token || ""
      );

      if (response.data && response.data.success) {
        const data = response.data as PaymentsResponse;
        setPayments(data.data);
        setMeta(data.meta);
        if (isRefresh) {
          toast.success("Payments refreshed successfully!");
        }
      } else {
        console.error("API returned error:", response.data);
        toast.error(response.data?.message || "Failed to fetch payments");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to fetch payments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (userData?.email) {
      fetchPayments();
    }
  }, [filters, userData?.email]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        variant: "secondary" as const,
        icon: Clock,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
      },
      success: {
        variant: "default" as const,
        icon: CheckCircle2,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
      },
      failed: {
        variant: "destructive" as const,
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <Badge
        variant={config.variant}
        className={`${config.bgColor} ${config.color} ${config.borderColor} border font-medium px-3 py-1 rounded-full`}
      >
        <IconComponent className="w-3 h-3 mr-1.5" />
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  const getProviderIcon = (provider: string) => {
    const providerConfig = {
      stripe: {
        icon: CreditCard,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      },
      flutterwave: {
        icon: TrendingUp,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
      },
      paystack: {
        icon: DollarSign,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
      },
    };

    const config =
      providerConfig[provider.toLowerCase() as keyof typeof providerConfig] ||
      providerConfig.stripe;
    const IconComponent = config.icon;

    return (
      <div
        className={`p-2.5 rounded-xl ${config.bgColor} ${config.borderColor} border`}
      >
        <IconComponent className={`w-4 h-4 ${config.color}`} />
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount / 100);
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
      status: "all",
      provider: "all",
      productType: "all",
      platformRole: "all",
      currency: "",
      startDate: "",
      endDate: "",
      search: "",
    });
    toast.success("Filters cleared!");
  };

  // Calculate stats
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const successfulPayments = payments.filter((p) => p.status === "success");
  const pendingPayments = payments.filter((p) => p.status === "pending");
  const failedPayments = payments.filter((p) => p.status === "failed");
  const successRate =
    payments.length > 0
      ? (successfulPayments.length / payments.length) * 100
      : 0;

  // Use the paginated data directly from the API response
  // The API should handle filtering and pagination server-side
  const displayPayments = payments;

  const PaymentCard = ({ payment }: { payment: Payment }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500 hover:border-l-blue-600 bg-white/90 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {getProviderIcon(payment.provider)}
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {payment.bookingService}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {payment.productType}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/payments/${payment._id}`)
                }
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  copyToClipboard(payment.transactionId, payment._id)
                }
              >
                {copiedId === payment._id ? (
                  <Check className="w-4 h-4 mr-2" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copiedId === payment._id ? "Copied!" : "Copy ID"}
              </DropdownMenuItem>
              {payment.receiptUrl && (
                <DropdownMenuItem asChild>
                  <Link
                    href={payment.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Receipt className="w-4 h-4 mr-2" />
                    Download Receipt
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Amount</span>
            <span className="font-bold text-lg text-gray-900">
              {formatCurrency(payment.amount, payment.currency)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            {getStatusBadge(payment.status)}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Date</span>
            <span className="text-sm text-gray-900">
              {formatDate(payment.createdAt)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Transaction ID</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1 text-xs text-gray-500 font-mono hover:bg-gray-100"
                    onClick={() =>
                      copyToClipboard(payment.transactionId, payment._id)
                    }
                  >
                    {payment.transactionId.slice(0, 8)}...
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to copy full ID</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/dashboard/payments/${payment._id}`)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            Details
          </Button>
          {payment.receiptUrl && (
            <Button size="sm" variant="outline" asChild>
              <Link
                href={payment.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Receipt className="w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center space-x-4 p-4 bg-white rounded-lg"
        >
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <Skeleton className="h-8 w-[100px]" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Payment Center
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Manage and track your payment history with advanced analytics
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Table</span>
              </Button>
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Cards</span>
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => fetchPayments(true)}
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">
                    Total Payments
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-900">
                    {loading ? <Skeleton className="h-8 w-16" /> : meta.total}
                  </p>
                  <p className="text-xs text-blue-600">All time transactions</p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-200 rounded-full">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">
                    Total Amount
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-green-900">
                    {loading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      formatCurrency(totalAmount, "USD")
                    )}
                  </p>
                  <p className="text-xs text-green-600">Lifetime value</p>
                </div>
                <div className="p-2 sm:p-3 bg-green-200 rounded-full">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">
                    Success Rate
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-900">
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      `${successRate.toFixed(1)}%`
                    )}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress
                      value={successRate}
                      className="w-12 sm:w-16 h-2"
                    />
                    <span className="text-xs text-purple-600">
                      {successfulPayments.length}/{payments.length}
                    </span>
                  </div>
                </div>
                <div className="p-2 sm:p-3 bg-purple-200 rounded-full">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Pending</p>
                  <p className="text-xl sm:text-2xl font-bold text-orange-900">
                    {loading ? (
                      <Skeleton className="h-8 w-12" />
                    ) : (
                      pendingPayments.length
                    )}
                  </p>
                  <p className="text-xs text-orange-600">
                    Awaiting confirmation
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-orange-200 rounded-full">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Filter className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Smart Filters</CardTitle>
                  <CardDescription>
                    Filter and search your payment history with precision
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  {showFilters ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {showFilters ? "Hide" : "Show"} Filters
                  </span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <FilterX className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <Collapsible open={showFilters}>
            <CollapsibleContent>
              <CardContent className="space-y-6 pt-0">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search by transaction ID, service, or product type..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    className="pl-12 pr-4 py-3 text-base sm:text-lg border-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {filters.search && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFilterChange("search", "")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Filter Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Status</Label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) =>
                        handleFilterChange("status", value)
                      }
                    >
                      <SelectTrigger className="border-2">
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Provider</Label>
                    <Select
                      value={filters.provider}
                      onValueChange={(value) =>
                        handleFilterChange("provider", value)
                      }
                    >
                      <SelectTrigger className="border-2">
                        <SelectValue placeholder="All providers" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="all">All providers</SelectItem>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="flutterwave">Flutterwave</SelectItem>
                        <SelectItem value="paystack">Paystack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Sort Order</Label>
                    <Select
                      value={filters.sortOrder}
                      onValueChange={(value: "asc" | "desc") =>
                        handleFilterChange("sortOrder", value)
                      }
                    >
                      <SelectTrigger className="border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="desc">Newest First</SelectItem>
                        <SelectItem value="asc">Oldest First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Start Date</Label>
                    <Input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) =>
                        handleFilterChange("startDate", e.target.value)
                      }
                      className="border-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">End Date</Label>
                    <Input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) =>
                        handleFilterChange("endDate", e.target.value)
                      }
                      className="border-2"
                    />
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Enhanced Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Payment History</CardTitle>
                <CardDescription>
                  Showing {displayPayments.length} of {meta.total} payments
                  (Page {meta.page} of {meta.totalPages})
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Secure & Encrypted</span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <LoadingSkeleton />
            ) : displayPayments.length === 0 ? (
              <div className="text-center py-12">
                <div className="relative mx-auto w-24 h-24 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full"></div>
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No payments found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {meta.total > 0 && meta.totalPages > 1
                    ? "No payments found on this page. Try navigating to other pages or adjusting your filters."
                    : filters.search ||
                      filters.status !== "all" ||
                      filters.provider !== "all" ||
                      filters.productType !== "all"
                    ? "Try adjusting your filters to see more results"
                    : "You haven't made any payments yet. Start your journey with our services!"}
                </p>
                {!filters.search &&
                  filters.status === "all" &&
                  filters.provider === "all" &&
                  filters.productType === "all" && (
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Explore Services
                    </Button>
                  )}
              </div>
            ) : viewMode === "table" ? (
              <>
                <div className="rounded-lg border overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="font-semibold">
                            Transaction
                          </TableHead>
                          <TableHead className="font-semibold">
                            Amount
                          </TableHead>
                          <TableHead className="font-semibold">
                            Status
                          </TableHead>
                          <TableHead className="font-semibold">
                            Provider
                          </TableHead>
                          <TableHead className="font-semibold">
                            Product Type
                          </TableHead>
                          <TableHead className="font-semibold">Date</TableHead>
                          <TableHead className="font-semibold text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {displayPayments.map((payment) => (
                          <TableRow
                            key={payment._id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium text-gray-900 truncate max-w-[200px]">
                                  {payment.bookingService}
                                </div>
                                <div className="text-sm text-gray-500 font-mono">
                                  {payment.transactionId}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-bold text-gray-900">
                                  {formatCurrency(
                                    payment.amount,
                                    payment.currency
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 uppercase">
                                  {payment.currency}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(payment.status)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getProviderIcon(payment.provider)}
                                <span className="capitalize font-medium">
                                  {payment.provider}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-[200px]">
                                <div
                                  className="truncate"
                                  title={payment.productType}
                                >
                                  {payment.productType}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium">
                                  {formatDate(payment.createdAt)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/payments/${payment._id}`
                                    )
                                  }
                                  className="flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span className="hidden sm:inline">View</span>
                                </Button>
                                {payment.receiptUrl && (
                                  <Button size="sm" variant="outline" asChild>
                                    <Link
                                      href={payment.receiptUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1"
                                    >
                                      <Receipt className="w-3 h-3" />
                                      <span className="hidden sm:inline">
                                        Receipt
                                      </span>
                                    </Link>
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Enhanced Pagination */}
                {meta.totalPages > 1 && (
                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-sm text-gray-600">
                      Showing {displayPayments.length} of {meta.total} payments
                      (Page {meta.page} of {meta.totalPages})
                      {meta.total > displayPayments.length && (
                        <span className="block text-xs text-blue-600 mt-1">
                          Use pagination below to view more payments
                        </span>
                      )}
                    </div>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              handlePageChange(Math.max(1, meta.page - 1))
                            }
                            className={
                              meta.page <= 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer hover:bg-gray-100"
                            }
                          />
                        </PaginationItem>

                        {/* Show page numbers with smart range */}
                        {(() => {
                          const totalPages = meta.totalPages;
                          const currentPage = meta.page;
                          const maxVisible = 5;

                          let startPage = Math.max(
                            1,
                            currentPage - Math.floor(maxVisible / 2)
                          );
                          let endPage = Math.min(
                            totalPages,
                            startPage + maxVisible - 1
                          );

                          // Adjust start if we're near the end
                          if (endPage - startPage < maxVisible - 1) {
                            startPage = Math.max(1, endPage - maxVisible + 1);
                          }

                          const pages = [];

                          // Add first page if not in range
                          if (startPage > 1) {
                            pages.push(
                              <PaginationItem key={1}>
                                <PaginationLink
                                  onClick={() => handlePageChange(1)}
                                  className="cursor-pointer hover:bg-gray-100"
                                >
                                  1
                                </PaginationLink>
                              </PaginationItem>
                            );
                            if (startPage > 2) {
                              pages.push(
                                <PaginationItem key="ellipsis1">
                                  <span className="px-2">...</span>
                                </PaginationItem>
                              );
                            }
                          }

                          // Add visible pages
                          for (let i = startPage; i <= endPage; i++) {
                            pages.push(
                              <PaginationItem key={i}>
                                <PaginationLink
                                  onClick={() => handlePageChange(i)}
                                  isActive={currentPage === i}
                                  className="cursor-pointer hover:bg-gray-100"
                                >
                                  {i}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }

                          // Add last page if not in range
                          if (endPage < totalPages) {
                            if (endPage < totalPages - 1) {
                              pages.push(
                                <PaginationItem key="ellipsis2">
                                  <span className="px-2">...</span>
                                </PaginationItem>
                              );
                            }
                            pages.push(
                              <PaginationItem key={totalPages}>
                                <PaginationLink
                                  onClick={() => handlePageChange(totalPages)}
                                  className="cursor-pointer hover:bg-gray-100"
                                >
                                  {totalPages}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }

                          return pages;
                        })()}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              handlePageChange(
                                Math.min(meta.totalPages, meta.page + 1)
                              )
                            }
                            className={
                              meta.page >= meta.totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer hover:bg-gray-100"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayPayments.map((payment) => (
                  <PaymentCard key={payment._id} payment={payment} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
