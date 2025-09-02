"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getApiRequestWithRefresh } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Calendar,
  Clock,
  BookOpen,
  Users,
  Video,
  ExternalLink,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Plus,
  User,
  Eye,
  Edit,
  Award,
  GraduationCap,
  TrendingUp,
  Star,
  Filter,
  Grid3X3,
  List,
  ChevronRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface TrainingBooking {
  _id: string;
  productId: string;
  productType: string;
  instructorId?: string;
  instructorName?: string;
  bookingPurpose: string;
  scheduleAt: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  participantType: "individual" | "team";
  durationInMinutes?: number;
  meetingLink?: string;
}

export default function TrainingPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<TrainingBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTrainingBookings();
  }, []);

  const fetchTrainingBookings = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    const token = getTokenFromCookies();
    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const response = await getApiRequestWithRefresh(
        "/api/bookings/user/my-bookings",
        token
      );

      if (response?.data?.success) {
        const allBookings = response.data.data || [];
        const trainingBookings = allBookings.filter(
          (booking: TrainingBooking) =>
            booking.productType?.toLowerCase().includes("training") ||
            booking.productType?.toLowerCase().includes("certification") ||
            booking.productType?.toLowerCase().includes("course") ||
            booking.productType?.toLowerCase().includes("workshop")
        );
        setBookings(trainingBookings);
      } else {
        setError(response?.data?.message || "Failed to load training bookings");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load training bookings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = booking.bookingPurpose
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: {
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        label: "Pending",
      },
      confirmed: {
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        label: "Confirmed",
      },
      completed: {
        color: "text-green-600",
        bgColor: "bg-green-50",
        label: "Completed",
      },
      cancelled: {
        color: "text-red-600",
        bgColor: "bg-red-50",
        label: "Cancelled",
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
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

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Error</AlertTitle>
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 rounded-3xl"></div>
          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Training Dashboard
                  </h1>
                  <p className="text-gray-600 text-lg mt-2">
                    Manage your training sessions and track progress
                  </p>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-3">
                <Button
                  onClick={() => fetchTrainingBookings(true)}
                  disabled={refreshing}
                  variant="outline"
                  className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
                >
                  {refreshing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Refresh
                </Button>
                <Button
                  onClick={() => router.push("/training/catalog")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Book Training
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Total Training
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {bookings.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">All sessions</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Completed</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">
                    {bookings.filter((b) => b.status === "completed").length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Finished sessions
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Upcoming</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                    {
                      bookings.filter(
                        (b) =>
                          b.status === "confirmed" || b.status === "pending"
                      ).length
                    }
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Scheduled sessions
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Cancelled</p>
                  <p className="text-2xl sm:text-3xl font-bold text-red-600">
                    {bookings.filter((b) => b.status === "cancelled").length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Cancelled sessions
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-xl group-hover:bg-red-200 transition-colors">
                  <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search training sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48 bg-white/50 border-gray-200">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="px-3"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="px-3"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Training Sessions */}
        {filteredBookings.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                No training sessions found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your filters to see more results"
                  : "You haven't booked any training sessions yet."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => router.push("/training/catalog")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Book Training
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/training/catalog")}
                  className="bg-white/50 border-gray-200"
                >
                  Browse Catalog
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                : "space-y-4"
            }
          >
            {filteredBookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              return viewMode === "grid" ? (
                <Card
                  key={booking._id}
                  className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col items-start gap-3">
                        <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl group-hover:from-blue-200 group-hover:to-purple-200 transition-colors">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                            {booking.bookingPurpose}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            {booking.productType}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={`${statusConfig.color} ${statusConfig.bgColor} border-0 shadow-sm`}
                      >
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-700">
                          {formatDate(booking.scheduleAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-700">
                          {booking.participantType === "individual"
                            ? "Individual"
                            : "Team"}{" "}
                          Session
                        </span>
                      </div>
                      {booking.instructorName && (
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-700 truncate">
                            {booking.instructorName}
                          </span>
                        </div>
                      )}
                    </div>

                    {booking.meetingLink && booking.status === "confirmed" && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-700 font-medium">
                              Meeting Ready
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                            className="bg-white border-green-200 hover:bg-green-50"
                          >
                            <Link
                              href={booking.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Join
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-white/50 border-gray-200 hover:bg-white"
                        onClick={() =>
                          router.push(`/dashboard/training/${booking._id}`)
                        }
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      {booking.status === "confirmed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/50 border-gray-200 hover:bg-white"
                          onClick={() =>
                            router.push(
                              `/dashboard/bookings/${booking._id}/edit`
                            )
                          }
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card
                  key={booking._id}
                  className="group hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
                          <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {booking.bookingPurpose}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {booking.productType}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(booking.scheduleAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>
                                {booking.participantType === "individual"
                                  ? "Individual"
                                  : "Team"}
                              </span>
                            </div>
                            {booking.instructorName && (
                              <div className="flex items-center gap-1">
                                <GraduationCap className="w-4 h-4" />
                                <span>{booking.instructorName}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          className={`${statusConfig.color} ${statusConfig.bgColor} border-0 shadow-sm`}
                        >
                          {statusConfig.label}
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/50 border-gray-200 hover:bg-white"
                            onClick={() =>
                              router.push(`/dashboard/training/${booking._id}`)
                            }
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          {booking.meetingLink &&
                            booking.status === "confirmed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                asChild
                                className="bg-green-50 border-green-200 hover:bg-green-100"
                              >
                                <Link
                                  href={booking.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="w-4 h-4 mr-1" />
                                  Join
                                </Link>
                              </Button>
                            )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Enhanced Quick Actions */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Quick Actions
            </CardTitle>
            <p className="text-gray-600">
              Get started with your training journey
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Button
                className="h-auto p-6 sm:p-8 flex flex-col items-center gap-4 text-white rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => router.push("/training/catalog")}
              >
                <div className="p-4 bg-white/20 rounded-xl">
                  <Plus className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg">Book New Training</div>
                  <div className="text-sm opacity-90 mt-1">
                    Schedule a training session
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-6 sm:p-8 flex flex-col items-center gap-4 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/50 border-gray-200 hover:bg-white"
                onClick={() => router.push("/training/catalog")}
              >
                <div className="p-4 bg-blue-100 rounded-xl">
                  <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg text-gray-900">
                    Browse Catalog
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Explore available training
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-6 sm:p-8 flex flex-col items-center gap-4 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/50 border-gray-200 hover:bg-white"
                onClick={() => router.push("/dashboard/certifications")}
              >
                <div className="p-4 bg-green-100 rounded-xl">
                  <Award className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg text-gray-900">
                    Certifications
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    View your certificates
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
