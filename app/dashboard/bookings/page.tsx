"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock,
  User,
  BookOpen,
  Video,
  Users,
  MapPin,
} from "lucide-react";
import { getApiRequest, deleteApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { toast } from "react-toastify";
import { useRole } from "@/contexts/RoleContext";
import { BookingListSkeleton } from "@/components/BookingSkeletons";

// User Booking Interface based on API response
interface UserBooking {
  _id: string;
  productId: string;
  productType: string;
  instructorId?: string;
  bookingPurpose: string;
  scheduleAt: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded";
  participantType: "individual" | "team";
  platformRole: string;
  email: string;
  fullName: string;
  createdAt: string;
  durationInMinutes?: number;
  numberOfExpectedParticipants?: number;
  meetingLink?: string;
  userNotes?: string;
}

export default function UserBookingsPage() {
  const { userData } = useRole();
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Determine which booking button to show based on user role
  const isStudent = userData?.role === "student";
  const isTechProfessional =
    userData?.role === "individualTechProfessional" ||
    userData?.role === "teamTechProfessional";

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    setLoading(true);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      const response = await getApiRequest(
        "/api/bookings/user/my-bookings",
        token
      );
      if (response?.data?.success) {
        const bookingsData = response.data.data || [];
        setBookings(bookingsData);
      } else {
        console.error(
          "Failed to fetch user bookings:",
          response?.data?.message
        );
        toast.error("Failed to fetch your bookings");
      }
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      toast.error("Error fetching your bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setCancellingId(bookingId);
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
        fetchUserBookings(); // Refresh the list
      } else {
        toast.error(response?.data?.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Error cancelling booking");
    } finally {
      setCancellingId(null);
    }
  };

  // Check if booking can be cancelled based on status and role
  const canCancelBooking = (booking: UserBooking) => {
    // Cannot cancel if already cancelled or completed
    if (booking.status === "cancelled" || booking.status === "completed") {
      return false;
    }

    // Students and tech professionals can cancel their own bookings
    return true;
  };

  // Check if booking can be edited based on status and role
  const canEditBooking = (booking: UserBooking) => {
    // Cannot edit if cancelled or completed
    if (booking.status === "cancelled" || booking.status === "completed") {
      return false;
    }

    // Cannot edit if confirmed and less than 24 hours before session
    if (booking.status === "confirmed") {
      const sessionTime = new Date(booking.scheduleAt);
      const now = new Date();
      const hoursUntilSession =
        (sessionTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursUntilSession < 24) {
        return false;
      }
    }

    // Students and tech professionals can edit their own bookings
    return true;
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingPurpose.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    const matchesType =
      typeFilter === "all" || booking.productType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

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
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.unpaid;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDurationText = (minutes?: number) => {
    if (!minutes) return "Duration not specified";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              My Bookings
            </h1>
            <p className="text-slate-600">
              View and manage your academic and training bookings
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-3">
            <Button
              onClick={fetchUserBookings}
              disabled={loading}
              className="group relative px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-2">
                <RefreshCw
                  className={`w-4 h-4 ${
                    loading
                      ? "animate-spin"
                      : "group-hover:rotate-180 transition-transform duration-300"
                  }`}
                />
                Refresh
              </span>
            </Button>
            {/* <div className="flex flex-col lg:flex-row gap-3"> */}
            {/* Show Academic Service button only for students */}
            {/* {isStudent && (
                <Link href="/dashboard/bookings/academic/new">
                  <Button className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full">
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                      Book Academic Service
                    </span>
                  </Button>
                </Link>
              )} */}

            {/* Show Training Program button only for tech professionals */}
            {/* {isTechProfessional && (
                <Link href="/dashboard/bookings/training/new">
                  <Button className="group relative px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full">
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                      Book Training Program
                    </span>
                  </Button>
                </Link>
              )} */}
            {/* </div> */}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Total Bookings
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {bookings.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {bookings.filter((b) => b.status === "pending").length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Confirmed
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {bookings.filter((b) => b.status === "confirmed").length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {bookings.filter((b) => b.status === "completed").length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search your bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {isStudent && (
                    <>
                      <SelectItem
                        value="Academic Support Services"
                        disabled
                        className="text-black"
                      >
                        Academic Support Services
                      </SelectItem>
                    </>
                  )}
                  {isTechProfessional && (
                    <>
                      <SelectItem
                        value="Training & Certification"
                        disabled
                        className="text-black"
                      >
                        Training & Certification
                      </SelectItem>
                    </>
                  )}
                  {/* <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="CareerDevelopment">
                    Career Development
                  </SelectItem>
                  <SelectItem value="InstitutionalService">
                    Institutional Service
                  </SelectItem>
                  <SelectItem value="AIService">AI Service</SelectItem>
                  <SelectItem value="RecruitmentService">
                    Recruitment Service
                  </SelectItem>
                  <SelectItem value="MarketingService">
                    Marketing Service
                  </SelectItem> */}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        {loading ? (
          <BookingListSkeleton />
        ) : filteredBookings.length === 0 ? (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No bookings found
                </h3>
                <p className="text-slate-600 mb-6">
                  {bookings.length === 0
                    ? "You haven't made any bookings yet."
                    : "No bookings match your current filters."}
                </p>
                {isStudent ? (
                  <Link href="/academic-services">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Book Your First Academic Service
                    </Button>
                  </Link>
                ) : isTechProfessional ? (
                  <Link href="/training/catalog">
                    <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-[5px]">
                      <Plus className="w-4 h-4 mr-2" />
                      Book Your First Training Program
                    </Button>
                  </Link>
                ) : (
                  <Link href="/dashboard/bookings/academic/new">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-[5px]">
                      <Plus className="w-4 h-4 mr-2" />
                      Book Your First Service
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <Card
                key={booking._id}
                className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-slate-900 mb-2">
                        {booking.bookingPurpose}
                      </CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-600">
                          {booking.fullName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            booking.productType === "AcademicService"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {booking.productType === "AcademicService"
                            ? "Academic"
                            : booking.productType === "TrainingProgram"
                            ? "Training"
                            : booking.productType}
                        </Badge>
                        {getStatusBadge(booking.status)}
                        {getPaymentStatusBadge(booking.paymentStatus)}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDateTime(booking.scheduleAt)}</span>
                  </div>

                  {booking.durationInMinutes && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>{getDurationText(booking.durationInMinutes)}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4" />
                    <span>
                      {booking.participantType === "individual"
                        ? "Individual"
                        : "Team"}{" "}
                      session
                    </span>
                  </div>

                  {booking.meetingLink && (
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="flex items-center gap-2 rounded-[10px]"
                    >
                      <a
                        href={booking.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate"
                      >
                        <Video className="w-4 h-4 mr-1" />
                        Join Meeting
                      </a>
                    </Button>
                  )}

                  {booking.userNotes && (
                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                      <p className="font-medium mb-1">Notes:</p>
                      <p className="line-clamp-2">{booking.userNotes}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
                    {/* <Link href={`/dashboard/bookings/${booking._id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 rounded-[5px]"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link> */}
                    {/* {canEditBooking(booking) ? (
                      <Link href={`/dashboard/bookings/${booking._id}/edit`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-[5px]"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled
                        className="text-gray-400 cursor-not-allowed rounded-[5px]"
                        title={
                          booking.status === "cancelled" ||
                          booking.status === "completed"
                            ? "Cannot edit cancelled or completed bookings"
                            : "Cannot edit confirmed bookings within 24 hours of session"
                        }
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )} */}
                    {canCancelBooking(booking) ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-[5px]"
                      >
                        {cancellingId === booking._id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled
                        className="text-gray-400 cursor-not-allowed"
                        title={
                          booking.status === "cancelled" ||
                          booking.status === "completed"
                            ? "Cannot cancel cancelled or completed bookings"
                            : "Cannot cancel booking in progress"
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
