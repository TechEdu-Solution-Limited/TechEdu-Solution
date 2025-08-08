"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { postApiRequest, getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Video,
  Phone,
  MessageCircle,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Download,
  Share2,
  Plus,
  Filter,
  Search,
  TrendingUp,
  Users,
  BookOpen,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CalendarDays,
  Timer,
  DollarSign,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import Link from "next/link";
import { BookingListSkeleton } from "@/components/BookingSkeletons";

// Modal UI
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";

type Service = {
  _id: string;
  title: string;
  price?: number;
  instructor?: string;
  instructorId?: string;
  instructorName?: string;
  category?: string;
  level?: string;
  description?: string;
};

type Instructor = {
  _id: string;
  fullName: string;
  email: string;
  title?: string;
  specializationAreas?: string[];
};

// API response types
export interface Booking {
  _id: string;
  productId: string;
  productType: "AcademicService" | "TrainingProgram";
  instructorId: string;
  bookingPurpose: string;
  scheduleAt: string;
  endAt: string;
  minutesPerSession: number;
  durationInMinutes: number;
  numberOfExpectedParticipants: number;
  isClassroom: boolean;
  isSession: boolean;
  status: string;
  paymentStatus: string;
  meetingLink?: string;
  userNotes?: string;
  participantType: "individual" | "team";
  platformRole: string;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingsResponse {
  success: boolean;
  message: string;
  data: Booking[];
  meta?: any;
}

export interface CreateBookingResponse {
  success: boolean;
  message: string;
  data: Booking;
  meta?: any;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: string[];
  meta?: any;
}

export interface LevelsResponse {
  success: boolean;
  message: string;
  data: string[];
  meta?: any;
}

export default function AcademicServicesBookingsPage() {
  // Booking form state
  const [productId, setProductId] = useState("");
  const [productType, setProductType] = useState<
    "AcademicService" | "TrainingProgram"
  >("AcademicService");
  const [instructorId, setInstructorId] = useState("");
  const [bookingPurpose, setBookingPurpose] = useState("");
  const [scheduleAt, setScheduleAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [minutesPerSession, setMinutesPerSession] = useState(60);
  const [durationInMinutes, setDurationInMinutes] = useState(60);
  const [numberOfExpectedParticipants, setNumberOfExpectedParticipants] =
    useState(1);
  const [isClassroom, setIsClassroom] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [meetingLink, setMeetingLink] = useState("");
  const [userNotes, setUserNotes] = useState("");
  const [participantType, setParticipantType] = useState<"individual" | "team">(
    "individual"
  );
  const [attachments, setAttachments] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<null | {
    meetingLink: string;
    bookingId: string;
    message: string;
  }>(null);
  const [error, setError] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [instructorsLoading, setInstructorsLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);

  // Booked services state
  const { userData } = useRole();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookedLoading, setBookedLoading] = useState(true);
  const [bookedError, setBookedError] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch available services for booking
  useEffect(() => {
    async function fetchServices() {
      setServicesLoading(true);
      try {
        const res = await getApiRequest<any>("/api/academic-services");
        const list = res?.data?.data || res?.data || [];
        setServices(
          list.map((s: any) => ({
            _id: s._id || s.id,
            title: s.title,
            price: s.price,
            instructor: s.instructor,
            instructorId: s.instructorId,
            instructorName: s.instructorName,
            category: s.category,
            level: s.level,
            description: s.description,
          }))
        );
      } catch (err) {
        setServices([]);
      } finally {
        setServicesLoading(false);
      }
    }
    fetchServices();
  }, []);

  // Fetch instructors
  useEffect(() => {
    async function fetchInstructors() {
      setInstructorsLoading(true);
      try {
        const token = getTokenFromCookies();
        if (!token) {
          return;
        }

        const response = await getApiRequest(
          "/api/users?role=instructor",
          token
        );
        if (response?.data?.success) {
          const instructorData =
            response.data.data?.users || response.data.users || [];
          setInstructors(instructorData);
          console.log("Fetched instructors:", instructorData);
        } else {
          console.error(
            "Failed to fetch instructors:",
            response?.data?.message
          );
        }
      } catch (err: any) {
        console.error("Error fetching instructors:", err);
      } finally {
        setInstructorsLoading(false);
      }
    }
    fetchInstructors();
  }, []);

  // Fetch categories and levels
  useEffect(() => {
    async function fetchMeta() {
      try {
        const catRes = await getApiRequest<any>(
          "/api/academic-services/categories"
        );
        setCategories(catRes.data?.data || []);
        const lvlRes = await getApiRequest<any>(
          "/api/academic-services/levels"
        );
        setLevels(lvlRes.data?.data || []);
      } catch {}
    }
    fetchMeta();
  }, []);

  // Fetch bookings
  const fetchBookings = async () => {
    setBookedLoading(true);
    setBookedError(null);
    try {
      const token = getTokenFromCookies();
      const res = await getApiRequest<any>("/api/bookings", "", {
        Authorization: `Bearer ${token}`,
      });
      setBookings(res.data?.data || []);
      setBookedLoading(false);
    } catch (err: any) {
      setBookedError(err.message || "Failed to load bookings.");
      setBookedLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle booking form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(null);

    try {
      const token = getTokenFromCookies() || undefined;
      if (!token) {
        setError("Please login to book a service.");
        setLoading(false);
        return;
      }

      // Get instructor ID from selected service or direct selection
      const selectedService = services.find((s) => s._id === productId);
      const finalInstructorId =
        instructorId === "default"
          ? selectedService?.instructorId
          : instructorId;

      const bookingData = {
        productId,
        productType,
        instructorId: finalInstructorId,
        bookingPurpose,
        scheduleAt: new Date(scheduleAt).toISOString(),
        endAt: new Date(endAt).toISOString(),
        minutesPerSession,
        durationInMinutes,
        numberOfExpectedParticipants,
        isClassroom,
        isSession,
        meetingLink,
        userNotes,
        attachments,
        participantType,
        platformRole: userData?.role || "student",
        email: userData?.email || "",
        fullName: userData?.fullName || "",
      };

      const response = await postApiRequest("/api/bookings", bookingData, {
        Authorization: `Bearer ${token}`,
      });

      if (response.data?.success) {
        const data = response.data?.data;
        setSuccess({
          meetingLink: data.meetingLink || "",
          bookingId: data._id,
          message: response.data?.message || "Booking created successfully!",
        });
        setShowModal(false);
        // Refresh bookings after successful booking
        fetchBookings();
        toast.success("Booking created successfully!");
      } else {
        setError(response.data?.message || "Booking failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Cancel booking
  const handleCancelBooking = async (bookingId: string) => {
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Please login to cancel a booking.");
        return;
      }
      await postApiRequest(
        `/api/bookings/${bookingId}/cancel`,
        {},
        { Authorization: `Bearer ${token}` }
      );
      fetchBookings();
      toast.success("Booking cancelled successfully!");
    } catch (err) {
      toast.error("Failed to cancel booking.");
    }
  };

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "rescheduled":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "unpaid":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Filtered bookings
  const filteredBookings = bookings.filter(
    (b) =>
      (selectedCategory && selectedCategory !== "all"
        ? b.productType === selectedCategory
        : true) &&
      (searchQuery
        ? b.bookingPurpose.toLowerCase().includes(searchQuery.toLowerCase())
        : true)
  );

  // Stats
  const pendingCount = filteredBookings.filter(
    (b) => b.status === "pending"
  ).length;
  const confirmedCount = filteredBookings.filter(
    (b) => b.status === "confirmed"
  ).length;
  const completedCount = filteredBookings.filter(
    (b) => b.status === "completed"
  ).length;
  const cancelledCount = filteredBookings.filter(
    (b) => b.status === "cancelled"
  ).length;
  const totalSpent = filteredBookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + (b.durationInMinutes * 0.5 || 0), 0); // Assuming £0.5 per minute

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">
            Manage your academic services and training program bookings
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Booking
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-white">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full lg:w-48 rounded-xl border-gray-200">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="AcademicService">
                  Academic Service
                </SelectItem>
                <SelectItem value="TrainingProgram">
                  Training Program
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">
                  Pending
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {pendingCount}
                </p>
              </div>
              <div className="p-3 bg-blue-200 rounded-xl">
                <Clock className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">
                  Confirmed
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {confirmedCount}
                </p>
              </div>
              <div className="p-3 bg-green-200 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">
                  Completed
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {completedCount}
                </p>
              </div>
              <div className="p-3 bg-purple-200 rounded-xl">
                <Star className="w-6 h-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 mb-1">
                  Cancelled
                </p>
                <p className="text-2xl font-bold text-red-900">
                  {cancelledCount}
                </p>
              </div>
              <div className="p-3 bg-red-200 rounded-xl">
                <XCircle className="w-6 h-6 text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 mb-1">
                  Total Spent
                </p>
                <p className="text-2xl font-bold text-emerald-900">
                  £{totalSpent.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-emerald-200 rounded-xl">
                <DollarSign className="w-6 h-6 text-emerald-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-100 p-1 rounded-xl">
          <TabsTrigger
            value="all"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            All ({filteredBookings.length})
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Pending ({pendingCount})
          </TabsTrigger>
          <TabsTrigger
            value="confirmed"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Confirmed ({confirmedCount})
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Completed ({completedCount})
          </TabsTrigger>
          <TabsTrigger
            value="cancelled"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Cancelled ({cancelledCount})
          </TabsTrigger>
        </TabsList>

        {["all", "pending", "confirmed", "completed", "cancelled"].map(
          (tab) => (
            <TabsContent key={tab} value={tab} className="space-y-6">
              {bookedLoading ? (
                <BookingListSkeleton />
              ) : filteredBookings.filter(
                  (b) => tab === "all" || b.status === tab
                ).length === 0 ? (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No {tab === "all" ? "" : tab} bookings found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {tab === "all"
                        ? "You haven't made any bookings yet."
                        : `You don't have any ${tab} bookings.`}
                    </p>
                    <Button
                      onClick={() => setShowModal(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Booking
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {filteredBookings
                    .filter((b) => tab === "all" || b.status === tab)
                    .map((booking) => (
                      <Card
                        key={booking._id}
                        className="border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  {booking.productType === "AcademicService" ? (
                                    <GraduationCap className="w-5 h-5 text-blue-600" />
                                  ) : (
                                    <BookOpen className="w-5 h-5 text-blue-600" />
                                  )}
                                </div>
                                <div>
                                  <CardTitle className="text-lg text-gray-900">
                                    {booking.bookingPurpose}
                                  </CardTitle>
                                  <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {booking.productType === "AcademicService"
                                        ? "Academic Service"
                                        : "Training Program"}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {booking.participantType}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(
                                    booking.scheduleAt
                                  ).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {new Date(
                                    booking.scheduleAt
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}{" "}
                                  -{" "}
                                  {new Date(booking.endAt).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" }
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Timer className="w-4 h-4" />
                                  {booking.minutesPerSession} min
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {booking.numberOfExpectedParticipants}{" "}
                                  participant
                                  {booking.numberOfExpectedParticipants > 1
                                    ? "s"
                                    : ""}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                              <Badge
                                className={getPaymentStatusColor(
                                  booking.paymentStatus
                                )}
                              >
                                {booking.paymentStatus}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {booking.userNotes && (
                              <div className="bg-gray-50 p-4 rounded-xl">
                                <div className="text-sm font-medium text-gray-700 mb-1">
                                  Notes:
                                </div>
                                <div className="text-sm text-gray-600">
                                  {booking.userNotes}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex items-center gap-4">
                                {booking.meetingLink && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      window.open(booking.meetingLink, "_blank")
                                    }
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                  >
                                    <Video className="w-4 h-4 mr-2" />
                                    Join Meeting
                                  </Button>
                                )}
                                <div className="text-sm text-gray-500">
                                  Created:{" "}
                                  {new Date(
                                    booking.createdAt
                                  ).toLocaleDateString()}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {(booking.status === "pending" ||
                                  booking.status === "confirmed") && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleCancelBooking(booking._id)
                                    }
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                  >
                                    Cancel
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-gray-600 border-gray-200 hover:bg-gray-50"
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </TabsContent>
          )
        )}
      </Tabs>

      {/* Booking Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl w-full max-h-[90vh] bg-white rounded-2xl shadow-2xl p-0 overflow-hidden flex flex-col">
          <DialogHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex-shrink-0">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Create New Booking
            </DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 text-white hover:bg-white/20"
              >
                <XCircle className="w-5 h-5" />
              </Button>
            </DialogClose>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-6 overflow-y-auto flex-1"
          >
            {/* Product Type Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  productType === "AcademicService"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setProductType("AcademicService")}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Academic Service
                    </div>
                    <div className="text-sm text-gray-500">
                      One-on-one mentoring
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  productType === "TrainingProgram"
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setProductType("TrainingProgram")}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Training Program
                    </div>
                    <div className="text-sm text-gray-500">
                      Group training sessions
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Selection */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Service
              </Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger className="w-full rounded-xl border-gray-200">
                  <SelectValue
                    placeholder={
                      servicesLoading
                        ? "Loading services..."
                        : "Choose a service"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service._id} value={service._id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{service.title}</span>
                        {service.price && (
                          <span className="text-sm text-gray-500">
                            £{service.price}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Instructor Selection */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Instructor (Optional - will use service default if not
                selected)
              </Label>
              <Select value={instructorId} onValueChange={setInstructorId}>
                <SelectTrigger className="w-full rounded-xl border-gray-200">
                  <SelectValue
                    placeholder={
                      instructorsLoading
                        ? "Loading instructors..."
                        : "Choose an instructor (optional)"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">
                    Use service default instructor
                  </SelectItem>
                  {instructors.map((instructor) => (
                    <SelectItem key={instructor._id} value={instructor._id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{instructor.fullName}</span>
                        {instructor.title && (
                          <span className="text-sm text-gray-500">
                            {instructor.title}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Booking Purpose */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Booking Purpose
              </Label>
              <Input
                placeholder="e.g., PhD Mentoring Session, Data Science Training"
                value={bookingPurpose}
                onChange={(e) => setBookingPurpose(e.target.value)}
                className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Start Date & Time
                </Label>
                <Input
                  type="datetime-local"
                  value={scheduleAt}
                  onChange={(e) => setScheduleAt(e.target.value)}
                  className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  End Date & Time
                </Label>
                <Input
                  type="datetime-local"
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                  className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Session Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Minutes per Session
                </Label>
                <Input
                  type="number"
                  min={15}
                  max={480}
                  value={minutesPerSession}
                  onChange={(e) => setMinutesPerSession(Number(e.target.value))}
                  className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Total Duration (minutes)
                </Label>
                <Input
                  type="number"
                  min={15}
                  max={2880}
                  value={durationInMinutes}
                  onChange={(e) => setDurationInMinutes(Number(e.target.value))}
                  className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Participants
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={numberOfExpectedParticipants}
                  onChange={(e) =>
                    setNumberOfExpectedParticipants(Number(e.target.value))
                  }
                  className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Session Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Session Type
                </Label>
                <Select
                  value={isSession ? "session" : "classroom"}
                  onValueChange={(value) => setIsSession(value === "session")}
                >
                  <SelectTrigger className="w-full rounded-xl border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="session">Individual Session</SelectItem>
                    <SelectItem value="classroom">
                      Classroom Training
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Participant Type
                </Label>
                <Select
                  value={participantType}
                  onValueChange={(value: "individual" | "team") =>
                    setParticipantType(value)
                  }
                >
                  <SelectTrigger className="w-full rounded-xl border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Meeting Link */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Meeting Link (optional)
              </Label>
              <Input
                placeholder="https://meet.google.com/..."
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Notes */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Additional Notes
              </Label>
              <Textarea
                placeholder="Any specific requirements or notes for your booking..."
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating Booking...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Create Booking
                </div>
              )}
            </Button>

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  {success.message}
                </h3>
                {success.meetingLink && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-green-700 mb-1">
                      Meeting Link:
                    </div>
                    <a
                      href={success.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline break-all hover:text-blue-700"
                    >
                      {success.meetingLink}
                    </a>
                  </div>
                )}
                <div className="text-sm text-green-700">
                  Check your email for confirmation details.
                </div>
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
