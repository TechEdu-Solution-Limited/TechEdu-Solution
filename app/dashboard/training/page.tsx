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

  useEffect(() => {
    fetchTrainingBookings();
  }, []);

  const fetchTrainingBookings = async () => {
    setLoading(true);
    setError(null);

    const token = getTokenFromCookies();
    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Training Dashboard
            </h1>
            <p className="text-gray-600">Manage your training sessions</p>
          </div>
        </div>
        {/* <Button onClick={() => router.push("/dashboard/bookings/training/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Book Training
        </Button> */}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Training</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookings.filter((b) => b.status === "completed").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-blue-600">
                  {
                    bookings.filter(
                      (b) => b.status === "confirmed" || b.status === "pending"
                    ).length
                  }
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">
                  {bookings.filter((b) => b.status === "cancelled").length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search training sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
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
          </div>
        </CardContent>
      </Card>

      {/* Training Sessions */}
      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No training sessions found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters to see more results"
                : "You haven't booked any training sessions yet."}
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => router.push("/dashboard/training/catalog")}
                className="text-white hover:text-black"
              >
                <Plus className="w-4 h-4 mr-2" />
                Book Training
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/training/catalog")}
              >
                Browse Catalog
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => {
            const statusConfig = getStatusConfig(booking.status);
            return (
              <Card
                key={booking._id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {booking.bookingPurpose}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {booking.productType}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={`${statusConfig.color} ${statusConfig.bgColor}`}
                    >
                      {statusConfig.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{formatDate(booking.scheduleAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>
                        {booking.participantType === "individual"
                          ? "Individual"
                          : "Team"}{" "}
                        Session
                      </span>
                    </div>
                    {booking.instructorName && (
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-gray-500" />
                        <span>{booking.instructorName}</span>
                      </div>
                    )}
                  </div>

                  {booking.meetingLink && booking.status === "confirmed" && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">
                            Meeting Ready
                          </span>
                        </div>
                        <Button size="sm" variant="outline" asChild>
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
                      className="flex-1"
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
                        onClick={() =>
                          router.push(`/dashboard/bookings/${booking._id}/edit`)
                        }
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              className="h-auto p-6 flex flex-col items-center gap-3 text-white rounded-[10px] hover:bg-blue-600"
              onClick={() => router.push("/dashboard/training/catalog")}
            >
              <Plus className="w-20 h-20" />
              <div className="text-center">
                <div className="font-semibold">Book New Training</div>
                <div className="text-sm opacity-90">
                  Schedule a training session
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 rounded-[10px]"
              onClick={() => router.push("/training/catalog")}
            >
              <BookOpen className="w-20 h-20 text-blue-600" />
              <div className="text-center">
                <div className="font-semibold">Browse Catalog</div>
                <div className="text-sm text-gray-600">
                  Explore available training
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 rounded-[10px]"
              onClick={() => router.push("/dashboard/certifications")}
            >
              <Award className="w-20 h-20 text-green-600" />
              <div className="text-center">
                <div className="font-semibold">Certifications</div>
                <div className="text-sm text-gray-600">
                  View your certificates
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
