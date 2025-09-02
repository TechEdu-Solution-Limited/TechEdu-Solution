"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getApiRequestWithRefresh } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Calendar,
  Clock,
  BookOpen,
  Users,
  Video,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Loader2,
  User,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  FileText,
  Download,
  Star,
  Award,
  Play,
  Pause,
  RotateCcw,
  Share2,
  Edit,
  Trash2,
  MessageSquare,
  Clock3,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

interface TrainingBooking {
  _id: string;
  productId: string;
  productType: string;
  instructorId?: string;
  instructorName?: string;
  instructorEmail?: string;
  instructorPhone?: string;
  bookingPurpose: string;
  scheduleAt: string;
  endAt?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  participantType: "individual" | "team";
  durationInMinutes?: number;
  meetingLink?: string;
  userNotes?: string;
  attachments?: string[];
  calendlyEventUri?: string;
  calendlyInviteeUri?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TrainingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const trainingId = params.id as string;

  const [booking, setBooking] = useState<TrainingBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (trainingId) {
      fetchTrainingDetails();
    }
  }, [trainingId]);

  const fetchTrainingDetails = async (isRefresh = false) => {
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
        `/api/bookings/${trainingId}`,
        token
      );

      if (response?.data?.success) {
        setBooking(response.data.data);
      } else {
        setError(response?.data?.message || "Failed to load training details");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load training details");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: {
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        label: "Pending",
        icon: Clock3,
      },
      confirmed: {
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        label: "Confirmed",
        icon: CheckCircle,
      },
      completed: {
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        label: "Completed",
        icon: Award,
      },
      cancelled: {
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        label: "Cancelled",
        icon: XCircle,
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeUntilSession = (dateString: string) => {
    const now = new Date();
    const sessionDate = new Date(dateString);
    const diffMs = sessionDate.getTime() - now.getTime();

    if (diffMs < 0) return "Session has passed";

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0)
      return `${diffDays} day${diffDays > 1 ? "s" : ""} remaining`;
    if (diffHours > 0)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} remaining`;
    if (diffMinutes > 0)
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} remaining`;
    return "Starting soon";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-48 w-full rounded-lg" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="p-2 hover:bg-white/50 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              Training Details
            </h1>
          </div>
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Error</AlertTitle>
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
          <div className="mt-6 flex gap-3">
            <Button onClick={() => fetchTrainingDetails(true)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/training")}
            >
              Back to Training
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Training not found
            </h3>
            <p className="text-gray-600 mb-6">
              The training session you're looking for doesn't exist or has been
              removed.
            </p>
            <Button onClick={() => router.push("/dashboard/training")}>
              Back to Training Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(booking.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="p-2 hover:bg-white/50 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Training Details
              </h1>
              <p className="text-gray-600">
                View and manage your training session
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => fetchTrainingDetails(true)}
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
            {booking.status === "confirmed" && (
              <Button
                variant="outline"
                className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
                onClick={() =>
                  router.push(`/dashboard/bookings/${booking._id}/edit`)
                }
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Training Overview */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        {booking.bookingPurpose}
                      </CardTitle>
                      <p className="text-gray-600 mb-3">
                        {booking.productType}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          className={`${statusConfig.color} ${statusConfig.bgColor} ${statusConfig.borderColor} border flex items-center gap-1`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </Badge>
                        <Badge variant="outline" className="bg-white/50">
                          {booking.participantType === "individual"
                            ? "Individual"
                            : "Team"}{" "}
                          Session
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Session Timing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-900">
                        Session Date
                      </span>
                    </div>
                    <p className="text-blue-800">
                      {formatDate(booking.scheduleAt)}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-900">
                        Duration
                      </span>
                    </div>
                    <p className="text-green-800">
                      {booking.durationInMinutes
                        ? `${booking.durationInMinutes} minutes`
                        : "Not specified"}
                    </p>
                  </div>
                </div>

                {/* Time Until Session */}
                {booking.status === "confirmed" && (
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock3 className="w-5 h-5 text-amber-600" />
                      <span className="font-semibold text-amber-900">
                        Time Until Session
                      </span>
                    </div>
                    <p className="text-amber-800">
                      {getTimeUntilSession(booking.scheduleAt)}
                    </p>
                  </div>
                )}

                {/* Meeting Link */}
                {booking.meetingLink && booking.status === "confirmed" && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Video className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-900">
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
                          Join Meeting
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}

                {/* User Notes */}
                {booking.userNotes && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <span className="font-semibold text-gray-900">
                        Your Notes
                      </span>
                    </div>
                    <p className="text-gray-700">{booking.userNotes}</p>
                  </div>
                )}

                {/* Attachments */}
                {booking.attachments && booking.attachments.length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Download className="w-5 h-5 text-gray-600" />
                      <span className="font-semibold text-gray-900">
                        Attachments
                      </span>
                    </div>
                    <div className="space-y-2">
                      {booking.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-white rounded border"
                        >
                          <span className="text-sm text-gray-700">
                            📎 Attachment {index + 1}
                          </span>
                          <Button size="sm" variant="outline" asChild>
                            <Link
                              href={attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {booking.status === "confirmed" && (
                    <Button
                      className="h-auto p-4 flex flex-col items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                      asChild
                    >
                      <Link
                        href={booking.meetingLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Play className="w-6 h-6" />
                        <div className="text-center">
                          <div className="font-semibold">Join Session</div>
                          <div className="text-xs opacity-90">
                            Start your training
                          </div>
                        </div>
                      </Link>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 bg-white/50 border-gray-200 hover:bg-white"
                    onClick={() =>
                      router.push(`/dashboard/bookings/${booking._id}/edit`)
                    }
                  >
                    <Edit className="w-6 h-6" />
                    <div className="text-center">
                      <div className="font-semibold">Edit Details</div>
                      <div className="text-xs text-gray-600">
                        Modify booking
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 bg-white/50 border-gray-200 hover:bg-white"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: booking.bookingPurpose,
                          text: `Training session: ${booking.bookingPurpose}`,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        // You could add a toast notification here
                      }
                    }}
                  >
                    <Share2 className="w-6 h-6" />
                    <div className="text-center">
                      <div className="font-semibold">Share</div>
                      <div className="text-xs text-gray-600">Share details</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Instructor Info */}
            {booking.instructorName && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    Instructor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {booking.instructorName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Training Instructor
                      </p>
                    </div>
                  </div>

                  {booking.instructorEmail && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{booking.instructorEmail}</span>
                    </div>
                  )}

                  {booking.instructorPhone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{booking.instructorPhone}</span>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-white/50 border-gray-200 hover:bg-white"
                    onClick={() => {
                      if (booking.instructorEmail) {
                        window.location.href = `mailto:${booking.instructorEmail}`;
                      }
                    }}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Instructor
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Session Info */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Session Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge
                      className={`${statusConfig.color} ${statusConfig.bgColor} border-0`}
                    >
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="text-gray-900">
                      {booking.participantType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="text-gray-900">
                      {booking.durationInMinutes
                        ? `${booking.durationInMinutes} min`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="text-gray-900">
                      {formatDate(booking.createdAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <StatusIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600">Session Status</p>
                    <p className="font-semibold text-gray-900">
                      {statusConfig.label}
                    </p>
                  </div>

                  {booking.status === "completed" && (
                    <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <Award className="w-6 h-6 text-green-600 mx-auto mb-1" />
                      <p className="text-sm text-green-800 font-medium">
                        Training Completed!
                      </p>
                      <p className="text-xs text-green-600">
                        Great job on finishing your session
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
