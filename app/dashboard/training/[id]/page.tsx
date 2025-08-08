"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiRequestWithRefresh } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Clock,
  BookOpen,
  Users,
  Video,
  ExternalLink,
  ArrowLeft,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  GraduationCap,
  User,
  Eye,
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
  createdAt?: string;
  updatedAt?: string;
}

export default function SingleTrainingPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<TrainingBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchBooking();
    }
    // eslint-disable-next-line
  }, [params.id]);

  const fetchBooking = async () => {
    setLoading(true);
    setError(null);
    const token = getTokenFromCookies();
    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }
    try {
      // Fetch all bookings and find the one with the matching ID
      const response = await getApiRequestWithRefresh(
        "/api/bookings/user/my-bookings",
        token
      );
      if (response?.data?.success) {
        const allBookings = response.data.data || [];
        const found = allBookings.find(
          (b: TrainingBooking) => b._id === params.id
        );
        if (found) {
          setBooking(found);
        } else {
          setError("Training booking not found");
        }
      } else {
        setError(response?.data?.message || "Failed to load training booking");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load training booking");
    } finally {
      setLoading(false);
    }
  };

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-xl w-full">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-64 w-full rounded-2xl mb-6" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
              <p className="text-red-600 mb-6">
                {error || "Training booking not found"}
              </p>
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="mr-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
              </Button>
              <Button onClick={fetchBooking}>
                <RefreshCw className="w-4 h-4 mr-2" /> Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(booking.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="hover:bg-white/80 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Training
          </Button>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Training Details
            </h1>
          </div>
        </div>

        {/* Status Banner */}
        <div className={`p-4 rounded-2xl border ${statusConfig.bgColor} mb-6`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${statusConfig.bgColor}`}>
              {booking.status === "completed" ? (
                <CheckCircle className={`w-5 h-5 ${statusConfig.color}`} />
              ) : booking.status === "cancelled" ? (
                <XCircle className={`w-5 h-5 ${statusConfig.color}`} />
              ) : (
                <Calendar className={`w-5 h-5 ${statusConfig.color}`} />
              )}
            </div>
            <div>
              <h3 className={`font-semibold ${statusConfig.color}`}>
                {statusConfig.label}
              </h3>
              <p className="text-gray-600 text-sm">
                Current status of this training session
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl mb-2">
              {booking.bookingPurpose}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Badge className="bg-blue-100 text-blue-700 mr-2">
                {booking.productType}
              </Badge>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(booking.scheduleAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {booking.durationInMinutes || 60} min
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {booking.participantType === "individual"
                  ? "Individual"
                  : "Team"}
              </span>
              {booking.instructorName && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  {booking.instructorName}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Meeting Link */}
            {booking.meetingLink && booking.status === "confirmed" && (
              <div className="p-4 bg-green-50 rounded-xl border border-green-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-green-600" />
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
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() =>
                  router.push(`/dashboard/bookings/${booking._id}`)
                }
              >
                <Eye className="w-4 h-4 mr-2" />
                View
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
      </div>
    </div>
  );
}
