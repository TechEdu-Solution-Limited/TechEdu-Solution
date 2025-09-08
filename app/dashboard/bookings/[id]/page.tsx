"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Video,
  Users,
  MapPin,
  Edit,
  Trash2,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
} from "lucide-react";
import { getApiRequest, deleteApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { toast } from "react-toastify";
import { useRole } from "@/contexts/RoleContext";
import { BookingDetailsSkeleton } from "@/components/BookingSkeletons";
import { UserBooking } from "@/types/booking";
import {
  formatDateTime,
  getDurationText,
  getPrimaryDateTime,
} from "@/utils/helpers";
import Link from "next/link";

import { safeConsole } from "@/lib/console";
export default function BookingDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { userData } = useRole();
  const bookingId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [booking, setBooking] = useState<UserBooking | null>(null);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required. Please log in.");
        router.push("/login");
        return;
      }

      const response = await getApiRequest(`/api/bookings/${bookingId}`, token);

      if (response?.data?.success) {
        const bookingData = response.data.data;

        // Handle attachments - convert string to array if needed
        if (
          bookingData.attachments &&
          typeof bookingData.attachments === "string"
        ) {
          bookingData.attachments = [bookingData.attachments];
        }

        // Handle missing fields with fallbacks
        const processedBooking = {
          ...bookingData,
          fullName:
            bookingData.bookingSchedulerFullName ||
            bookingData.createdBy?.fullName ||
            "Unknown",
          email:
            bookingData.bookingSchedulerEmail ||
            bookingData.createdBy?.email ||
            "Unknown",
          platformRole: bookingData.bookingSchedulerPlatformRole || "Unknown",
          // Ensure arrays are properly handled
          participants: Array.isArray(bookingData.participants)
            ? bookingData.participants
            : [],
          actualDaysAndTime: Array.isArray(bookingData.actualDaysAndTime)
            ? bookingData.actualDaysAndTime
            : [],
          attachments: Array.isArray(bookingData.attachments)
            ? bookingData.attachments
            : [],
          // Handle schedulingMeta
          schedulingMeta: bookingData.schedulingMeta || null,
        };

        setBooking(processedBooking);
      } else {
        toast.error("Failed to fetch booking details");
        router.push("/dashboard/bookings");
      }
    } catch (error) {
      safeConsole.error("Error fetching booking details:", error);
      toast.error("Error fetching booking details");
      router.push("/dashboard/bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setCancelling(true);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      const response = await deleteApiRequest(
        `/api/bookings/${bookingId}/cancel`,
        token
      );

      if (response?.data?.success) {
        toast.success("Booking cancelled successfully");
        router.push("/dashboard/bookings");
      } else {
        toast.error(response?.data?.message || "Failed to cancel booking");
      }
    } catch (error) {
      safeConsole.error("Error cancelling booking:", error);
      toast.error("Error cancelling booking");
    } finally {
      setCancelling(false);
    }
  };

  const canCancelBooking = (booking: UserBooking) => {
    if (booking.status === "cancelled" || booking.status === "completed") {
      return false;
    }
    return true;
  };

  const canEditBooking = (booking: UserBooking) => {
    if (booking.status === "cancelled" || booking.status === "completed") {
      return false;
    }
    if (booking.status === "confirmed") {
      const { start } = getPrimaryDateTime(booking);
      const sessionTime = new Date(start);
      const now = new Date();
      const hoursUntilSession =
        (sessionTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      if (hoursUntilSession < 24) {
        return false;
      }
    }
    return true;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      confirmed: { color: "bg-green-100 text-green-800", label: "Confirmed" },
      completed: { color: "bg-blue-100 text-blue-800", label: "Completed" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      unpaid: { color: "bg-red-100 text-red-800", label: "Unpaid" },
      paid: { color: "bg-green-100 text-green-800", label: "Paid" },
      refunded: { color: "bg-gray-100 text-gray-800", label: "Refunded" },
      free: { color: "bg-blue-100 text-blue-800", label: "Free" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.unpaid;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getSchedulingStatusBadge = (status: string) => {
    const statusConfig = {
      "awaiting-payment": {
        color: "bg-orange-100 text-orange-800",
        label: "Awaiting Payment",
      },
      "payment-failed": {
        color: "bg-red-100 text-red-800",
        label: "Payment Failed",
      },
      "eligible-to-schedule": {
        color: "bg-blue-100 text-blue-800",
        label: "Ready to Schedule",
      },
      "link-issued": {
        color: "bg-purple-100 text-purple-800",
        label: "Link Issued",
      },
      scheduled: { color: "bg-green-100 text-green-800", label: "Scheduled" },
      "meeting-created": {
        color: "bg-indigo-100 text-indigo-800",
        label: "Meeting Created",
      },
      canceled: { color: "bg-red-100 text-red-800", label: "Canceled" },
      completed: { color: "bg-blue-100 text-blue-800", label: "Completed" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "bg-gray-100 text-gray-800",
      label: status || "Unknown",
    };

    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <BookingDetailsSkeleton />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Booking not found
                </h3>
                <p className="text-slate-600 mb-6">
                  The booking you're looking for doesn't exist or you don't have
                  permission to view it.
                </p>
                <Button onClick={() => router.push("/dashboard/bookings")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Bookings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Booking Details
            </h1>
            <p className="text-slate-600">
              View details for your {booking.bookingPurpose} booking
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/bookings")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bookings
          </Button>
        </div>

        {/* Status and Actions */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    {booking.bookingPurpose}
                  </h3>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(booking.status)}
                    {getPaymentStatusBadge(booking.paymentStatus)}
                    {booking.schedulingStatus &&
                      getSchedulingStatusBadge(booking.schedulingStatus)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {canEditBooking(booking) && booking.status === "pending" && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(`/dashboard/bookings/${bookingId}/edit`)
                    }
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
                {canCancelBooking(booking) && (
                  <Button
                    variant="outline"
                    onClick={handleCancelBooking}
                    disabled={cancelling}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {cancelling ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Schedule Information */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Schedule Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Date & Time
                  </p>
                  <p className="text-slate-600">
                    {(() => {
                      const { start, end } = getPrimaryDateTime(booking);
                      return formatDateTime(start);
                    })()}
                  </p>
                </div>
              </div>

              {(() => {
                const { end } = getPrimaryDateTime(booking);
                return end ? (
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        End Time
                      </p>
                      <p className="text-slate-600">{formatDateTime(end)}</p>
                    </div>
                  </div>
                ) : null;
              })()}

              {booking.durationInMinutes && (
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Duration
                    </p>
                    <p className="text-slate-600">
                      {getDurationText(booking.durationInMinutes)}
                    </p>
                  </div>
                </div>
              )}

              {booking.actualDaysAndTime &&
                Array.isArray(booking.actualDaysAndTime) &&
                booking.actualDaysAndTime.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-slate-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">
                        Scheduled Days & Times
                      </p>
                      <div className="space-y-2">
                        {booking.actualDaysAndTime.map((session, index) => (
                          <div
                            key={index}
                            className="text-sm text-slate-600 bg-slate-50 p-2 rounded"
                          >
                            <span className="font-medium">
                              {session.dayOfWeek}
                            </span>
                            : {session.startTime} - {session.endTime}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Session Type
                  </p>
                  <p className="text-slate-600">
                    {(() => {
                      const participantTypeLabels = {
                        individual: "Individual",
                        team: "Team",
                        institution: "Institution",
                        recruiter: "Recruiter",
                        visitor: "Visitor",
                      };
                      return `${
                        participantTypeLabels[
                          booking.participantType as keyof typeof participantTypeLabels
                        ] || booking.participantType
                      } Session`;
                    })()}
                  </p>
                </div>
              </div>

              {booking.participantType === "team" &&
                booking.numberOfExpectedParticipants && (
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Participants
                      </p>
                      <p className="text-slate-600">
                        {booking.numberOfExpectedParticipants} people
                      </p>
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* User Information */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Name</p>
                  <p className="text-slate-600">{booking.fullName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Email</p>
                  <p className="text-slate-600">{booking.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Platform Role
                  </p>
                  <p className="text-slate-600 capitalize">
                    {booking.platformRole}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Product Type
                  </p>
                  <p className="text-slate-600">{booking.productType}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meeting Information */}
        {(booking.meetingLink || booking.calendlyUrl || booking.bookingUrl) && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Meeting & Scheduling Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {booking.meetingLink && (
                <div className="flex items-center gap-3">
                  <Video className="w-4 h-4 text-slate-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      Meeting Link
                    </p>
                    <Link
                      href={booking.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
                    >
                      {booking.meetingLink}
                    </Link>
                  </div>
                </div>
              )}

              {booking.calendlyUrl && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      Reschedule Link
                    </p>
                    <Link
                      href={booking.calendlyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 underline flex items-center gap-1"
                    >
                      {booking.calendlyUrl}
                    </Link>
                  </div>
                </div>
              )}

              {booking.bookingUrl && (
                <div className="flex items-center gap-3">
                  <Video className="w-4 h-4 text-slate-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      Schedule your time
                    </p>
                    <Link
                      href={booking.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
                    >
                      {booking.bookingUrl}
                    </Link>
                  </div>
                </div>
              )}

              {booking.timezone && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Timezone
                    </p>
                    <p className="text-slate-600">{booking.timezone}</p>
                  </div>
                </div>
              )}

              {booking.issuedAt && (
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Link Issued
                    </p>
                    <p className="text-slate-600">
                      {formatDateTime(booking.issuedAt)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {booking.userNotes && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {/* <FileText className="w-5 h-5" /> */}
                Additional Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                {/* <FileText className="w-4 h-4 text-slate-500 mt-1" /> */}
                <div className="flex-1">
                  <p className="text-slate-600 whitespace-pre-wrap">
                    {booking.userNotes}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Participants Information */}
        {booking.participants &&
          Array.isArray(booking.participants) &&
          booking.participants.length > 0 && (
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">
                    People included in this booking:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {booking.participants.map((participant, index) => (
                      <div
                        key={participant._id}
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <div className="p-2 bg-blue-100 rounded-full">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate">
                            {participant.fullName}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {participant.email}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {participant.platformRole} •{" "}
                            {participant.participantType}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        {/* Attachments */}
        {booking.attachments &&
          Array.isArray(booking.attachments) &&
          booking.attachments.length > 0 && (
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📎 Attachments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">
                    Files uploaded with this booking:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {booking.attachments.map(
                      (attachment: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                        >
                          <div className="p-2 bg-blue-100 rounded-full">📎</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700 truncate">
                              File {index + 1}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {attachment}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        {/* Cancellation Details */}
        {booking.cancellation && booking.cancellation.isCancelled && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                ❌ Cancellation Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {booking.cancellation.reason && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-full">💬</div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Reason
                      </p>
                      <p className="text-slate-600">
                        {booking.cancellation.reason}
                      </p>
                    </div>
                  </div>
                )}
                {booking.cancellation.cancelledAt && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-full">🕒</div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Cancelled At
                      </p>
                      <p className="text-slate-600">
                        {formatDateTime(booking.cancellation.cancelledAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Booking Timeline */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Booking Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Booking Created
                  </p>
                  <p className="text-slate-600">
                    {formatDateTime(booking.createdAt)}
                  </p>
                </div>
              </div>

              {booking.updatedAt && booking.updatedAt !== booking.createdAt && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Last Updated
                    </p>
                    <p className="text-slate-600">
                      {formatDateTime(booking.updatedAt)}
                    </p>
                  </div>
                </div>
              )}

              {booking.cancellation?.cancelledAt && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Cancelled
                    </p>
                    <p className="text-slate-600">
                      {formatDateTime(booking.cancellation.cancelledAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
