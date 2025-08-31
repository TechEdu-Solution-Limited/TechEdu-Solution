"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  MessageCircle,
  Star,
  CheckCircle,
  XCircle,
  Download,
  Share2,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import Link from "next/link";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";

interface BookedService {
  _id: string;
  title: string;
  description: string;
  targetRoles: string[];
  deliveryMode: "online" | "offline" | "hybrid";
  sessionType: "1-on-1" | "group" | "workshop";
  durationMinutes: number;
  price: number;
  isActive: boolean;
  calendarAvailability: any[];
  category: string[];
  tags: string[];
  discounts: any[];
  visibility: "public" | "private" | "restricted";
  maxParticipants: number;
  prerequisites: string;
  learningObjectives: string[];
  rating: number;
  totalReviews: number;
  thumbnailUrl?: string;
  mediaUrls: string[];
  serviceLevel: "basic" | "standard" | "premium";
  createdAt: string;
  updatedAt: string;
  __v: number;

  // Booking-specific fields
  status: "upcoming" | "completed" | "cancelled" | "rescheduled";
  bookingId: string;
  bookingDate: string;
  sessionDate: string;
  sessionTime: string;
  providerId: string;
  providerName: string;
  providerAvatar?: string;
  providerTitle: string;
  providerRating: number;
  providerTotalReviews: number;

  // Payment and receipt fields
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: string;
  receiptUrl?: string;

  // Session management fields
  meetingLink?: string;
  meetingPassword?: string;
  location?: string;
  notes?: string;
  cancellationReason?: string;
  rescheduleReason?: string;

  // User interaction fields
  userRating?: number;
  userReview?: string;
  userFeedback?: string;
  contactHistory: Array<{
    date: string;
    message: string;
    sender: "user" | "provider";
  }>;
}

export default function BookedServicesPage() {
  const { userData } = useRole();
  const [services, setServices] = useState<BookedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookedServices();
  }, []);

  const fetchBookedServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      const response = await getApiRequest(
        "/api/bookings/user/my-bookings",
        token
      );

      if (response?.data?.success) {
        const bookingsData = response.data.data || [];

        // Transform booking data to match our BookedService interface
        const transformedServices: BookedService[] = bookingsData.map(
          (booking: any) => ({
            _id: booking._id,
            title: booking.serviceTitle || booking.productTitle || "Service",
            description:
              booking.serviceDescription ||
              booking.productDescription ||
              "No description available",
            targetRoles: booking.targetRoles || ["student"],
            deliveryMode: booking.deliveryMode || "online",
            sessionType: booking.sessionType || "1-on-1",
            durationMinutes: booking.duration || 60,
            price: booking.price || 0,
            isActive: true,
            calendarAvailability: [],
            category: booking.category || ["general"],
            tags: booking.tags || [],
            discounts: [],
            visibility: "public",
            maxParticipants: 1,
            prerequisites: booking.requirements?.join(", ") || "None",
            learningObjectives: [],
            rating: 0,
            totalReviews: 0,
            thumbnailUrl: booking.thumbnailUrl || "",
            mediaUrls: [],
            serviceLevel: "standard",
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
            __v: 0,

            // Booking-specific fields
            status: mapBookingStatus(booking.status),
            bookingId: booking._id,
            bookingDate: booking.createdAt,
            sessionDate: booking.scheduledDate || booking.createdAt,
            sessionTime: formatSessionTime(booking.scheduledDate),
            providerId: booking.instructorId || booking.providerId || "",
            providerName:
              booking.instructorName || booking.providerName || "Provider",
            providerAvatar:
              booking.instructorAvatar || booking.providerAvatar || "",
            providerTitle:
              booking.instructorTitle || booking.providerTitle || "Instructor",
            providerRating: booking.instructorRating || 0,
            providerTotalReviews: booking.instructorTotalReviews || 0,

            // Payment and receipt fields
            paymentStatus: mapPaymentStatus(booking.paymentStatus || "pending"),
            paymentMethod: booking.paymentMethod || "Not specified",
            receiptUrl: booking.receiptUrl || "",

            // Session management fields
            meetingLink: booking.meetingLink || "",
            meetingPassword: "",
            location: booking.classroomDetails?.address || "",
            notes: booking.notes || "",
            cancellationReason: booking.cancellationReason || "",
            rescheduleReason: "",

            // User interaction fields
            userRating: 0,
            userReview: "",
            userFeedback: "",
            contactHistory: [],
          })
        );

        setServices(transformedServices);
      } else {
        console.error(
          "Failed to fetch booked services:",
          response?.data?.message
        );
        setError("Failed to fetch booked services");
      }
    } catch (err) {
      setError("Failed to fetch booked services");
      console.error("Error fetching booked services:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions optimized with useCallback
  const mapBookingStatus = useCallback(
    (
      status: string
    ): "upcoming" | "completed" | "cancelled" | "rescheduled" => {
      switch (status) {
        case "confirmed":
        case "pending":
          return "upcoming";
        case "completed":
          return "completed";
        case "cancelled":
          return "cancelled";
        case "rescheduled":
          return "rescheduled";
        default:
          return "upcoming";
      }
    },
    []
  );

  const mapPaymentStatus = useCallback(
    (status: string): "pending" | "completed" | "failed" | "refunded" => {
      switch (status) {
        case "completed":
          return "completed";
        case "failed":
          return "failed";
        case "refunded":
          return "refunded";
        default:
          return "pending";
      }
    },
    []
  );

  const formatSessionTime = useCallback((dateString: string): string => {
    if (!dateString) return "TBD";
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "TBD";
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "rescheduled":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Memoize filtered services to avoid recalculation on every render
  const upcomingServices = useMemo(
    () => services.filter((service) => service.status === "upcoming"),
    [services]
  );

  const completedServices = useMemo(
    () => services.filter((service) => service.status === "completed"),
    [services]
  );

  const cancelledServices = useMemo(
    () => services.filter((service) => service.status === "cancelled"),
    [services]
  );

  const totalSpent = useMemo(
    () => completedServices.reduce((sum, service) => sum + service.price, 0),
    [completedServices]
  );

  const upcomingCount = useMemo(
    () => upcomingServices.length,
    [upcomingServices]
  );
  const completedCount = useMemo(
    () => completedServices.length,
    [completedServices]
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Services</h1>
          <p className="text-gray-600 mt-2">
            Manage your booked services and upcoming sessions
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={fetchBookedServices}
            disabled={loading}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
          <Link href="/dashboard/academic-services/bookings">
            <Button className="text-white hover:bg-blue-600 rounded-[10px]">
              <Calendar className="w-4 h-4 mr-2" />
              Book New Service
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Upcoming Sessions
                </p>
                <p className="text-2xl font-bold">{upcomingCount}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Completed Sessions
                </p>
                <p className="text-2xl font-bold">{completedCount}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-[10px]">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold">${totalSpent}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingCount})</TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedCount})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledServices.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {upcomingServices.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Upcoming Sessions
                </h3>
                <p className="text-gray-600 mb-4">
                  You don't have any upcoming sessions scheduled.
                </p>
                <Button>Book Your First Session</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingServices.map((service) => (
                <Card
                  key={service._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-[10px]">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {service.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {new Date(service.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(service.status || "")}>
                        {service.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Provider Info */}
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={service.providerAvatar || ""} />
                          <AvatarFallback>
                            {service.providerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{service.providerName}</p>
                          <p className="text-sm text-gray-600">
                            {service.providerTitle}
                          </p>
                          <div className="flex items-center text-sm">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            {service.providerRating}
                          </div>
                        </div>
                      </div>

                      {/* Service Details */}
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          <strong>Description:</strong> {service.description}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {service.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Prerequisites:</strong>{" "}
                          {service.prerequisites}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Session Date:</strong>{" "}
                            {new Date(service.sessionDate).toLocaleDateString()}
                          </div>
                          <div>
                            <strong>Session Time:</strong> {service.sessionTime}
                          </div>
                          <div>
                            <strong>Duration:</strong> {service.durationMinutes}{" "}
                            minutes
                          </div>
                          <div>
                            <strong>Price:</strong> ${service.price}
                          </div>
                          <div>
                            <strong>Booking ID:</strong> {service.bookingId}
                          </div>
                          <div>
                            <strong>Payment:</strong> {service.paymentStatus}
                          </div>
                        </div>
                        {service.location && (
                          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                            <strong>Location:</strong> {service.location}
                          </div>
                        )}
                        {service.notes && (
                          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                            <strong>Notes:</strong> {service.notes}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2 pt-4 border-t">
                        <Button size="sm" variant="outline" className="flex-1">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Contact Provider
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="w-4 h-4 mr-2" />
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {completedServices.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Completed Sessions
                </h3>
                <p className="text-gray-600">
                  Your completed sessions will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedServices.map((service) => (
                <Card
                  key={service._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-[10px]">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {service.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            Completed on{" "}
                            {new Date(service.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Provider Info */}
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={service.providerAvatar} />
                          <AvatarFallback>
                            {service.providerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{service.providerName}</p>
                          <p className="text-sm text-gray-600">
                            {service.providerTitle}
                          </p>
                          <div className="flex items-center text-sm">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            {service.providerRating}
                          </div>
                        </div>
                      </div>

                      {/* Session Details */}
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          <strong>Description:</strong> {service.description}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {service.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2 pt-4 border-t">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download Receipt
                        </Button>
                        <Button size="sm" variant="outline">
                          <Star className="w-4 h-4 mr-2" />
                          Rate Session
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Feedback
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-6">
          {cancelledServices.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Cancelled Sessions
                </h3>
                <p className="text-gray-600">
                  Great! You haven't cancelled any sessions.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {cancelledServices.map((service) => (
                <Card
                  key={service._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-100 rounded-[10px]">
                          <XCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {service.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            Cancelled on{" "}
                            {new Date(service.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Service Info */}
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          <strong>Description:</strong> {service.description}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {service.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2 pt-4 border-t">
                        <Button size="sm" variant="outline">
                          <Calendar className="w-4 h-4 mr-2" />
                          Rebook Session
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
