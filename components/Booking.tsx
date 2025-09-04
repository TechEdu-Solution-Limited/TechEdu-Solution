"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  BookOpen,
  Video,
  Users,
  FileText,
  Send,
  Loader2,
  GraduationCap,
  Building,
  Mail,
  Phone,
  MapPin,
  Target,
  X,
  RefreshCw,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useRole } from "@/contexts/RoleContext";
import { toast } from "react-toastify";
import { getApiRequest, postApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { uploadFileToCloudinary } from "@/lib/cloudinary";

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const { userData, isAuthenticated, loading: authLoading } = useRole();
  const [loading, setLoading] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);

  // Get product details from URL parameters
  const productId = searchParams.get("productId");
  const productName = searchParams.get("productName");
  const productType = searchParams.get("productType");
  const service = searchParams.get("service");
  const deliveryMode = searchParams.get("deliveryMode");
  const sessionType = searchParams.get("sessionType");
  const duration = searchParams.get("duration");
  const minutesPerSession = searchParams.get("minutesPerSession");
  const price = searchParams.get("price");
  const instructorId = searchParams.get("instructorId");
  const isClassroom = searchParams.get("isClassroom") === "true";
  const isSession = searchParams.get("isSession") === "true";
  const durationInMinutes = searchParams.get("durationInMinutes");

  // Debug logging for instructor ID
  useEffect(() => {
    console.log("Booking Component Debug Info:", {
      instructorId,
      productId,
      productName,
      productType,
      isClassroom,
      isSession,
      hasInstructorId: !!instructorId,
      instructorIdType: typeof instructorId,
      instructorIdLength: instructorId?.length,
    });
  }, [
    instructorId,
    productId,
    productName,
    productType,
    isClassroom,
    isSession,
  ]);

  // Determine if this is an academic or training service
  // const isAcademicService = productType === "Academic Support Services";
  // const isTrainingService =
  //   productType === "Training & Certification" ||
  //   productType === "Training & Certfication";

  // Determine if this is an academic or training service
  const isAcademicService = productType?.includes("Academic Support Services");
  const isTrainingService = productType?.includes("Training & Certification");

  // Add debugging
  // console.log("Product Type from URL:", productType);
  // console.log("Is Academic Service:", isAcademicService);
  // console.log("Is Training Service:", isTrainingService);

  // Dynamic form state based on product type
  const [formData, setFormData] = useState({
    // Common fields
    fullName: userData?.fullName || "",
    email: userData?.email || "",
    phone: "",
    sessionType: sessionType || "1-on-1",
    preferredDate: undefined as string | undefined,
    preferredTime: "",
    numberOfParticipants: 1,
    participantType: "individual" as
      | "individual"
      | "team"
      | "institution"
      | "recruiter"
      | "visitor",
    userNotes: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Auto-detect user timezone

    // Academic-specific fields
    attachments: [] as Array<{
      id: number;
      file: File;
      name: string;
      size: number;
      type: string;
      cloudinaryUrl?: string;
      publicId?: string;
      format?: string;
      uploadProgress?: number; // Add upload progress tracking
      uploadStartTime?: number; // Track upload start time for speed calculation
    }>,

    // Training-specific fields
    bookingPurpose: "",
    numberOfExpectedParticipants: 1,

    // Classroom-specific fields
    actualDaysAndTime: [] as Array<{
      dayOfWeek:
        | "Monday"
        | "Tuesday"
        | "Wednesday"
        | "Thursday"
        | "Friday"
        | "Saturday"
        | "Sunday";
      startTime: string;
      endTime: string;
    }>,

    // Scheduling fields
    scheduledStart: "", // Actual scheduled start time
    scheduledEnd: "", // Actual scheduled end time
  });

  // Time slot selection state
  const [availableSlots, setAvailableSlots] = useState<
    Array<{
      startTime: string;
      endTime: string;
      date: string;
      available: boolean;
    }>
  >([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    startTime: string;
    endTime: string;
    date: string;
  } | null>(null);

  // Redirect if no product details
  useEffect(() => {
    if (!productId || !productName || !productType) {
      toast.error("Invalid booking request");
      router.push("/");
    }
  }, [productId, productName, productType, router]);

  // Check authentication status after loading is complete
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please login to create a booking");
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Update form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        fullName: userData.fullName || prev.fullName,
        email: userData.email || prev.email,
      }));
    }
  }, [userData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Fetch instructor availability and available time slots
  const fetchInstructorAvailability = useCallback(async () => {
    if (!instructorId) {
      console.warn("No instructorId provided, cannot fetch availability");
      toast.warning("No instructor assigned to this product");
      return;
    }

    // Get authentication token
    const token = getTokenFromCookies();
    console.log(
      "Token retrieved:",
      token ? `${token.substring(0, 20)}...` : "NO TOKEN"
    );

    if (!token) {
      toast.error("Authentication token not found. Please login again.");
      return;
    }

    setIsLoadingSlots(true);
    setAvailabilityChecked(false);
    try {
      console.log("Fetching availability for instructor:", instructorId);
      console.log(
        "Using token:",
        token ? `${token.substring(0, 20)}...` : "NO TOKEN"
      );

      // Calculate date range for the next 15 days (using UTC to avoid timezone issues)
      const startDate = new Date();
      startDate.setUTCHours(0, 0, 0, 0); // Set to start of today in UTC
      const endDate = new Date();
      endDate.setUTCDate(startDate.getUTCDate() + 14); // Add 14 days to stay within 15-day limit
      endDate.setUTCHours(23, 59, 59, 999); // Set to end of day in UTC

      // Get instructor availability for the next 15 days
      const availabilityUrl = `/api/instructors/${instructorId}/availability?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      console.log("Fetching instructor availability from:", availabilityUrl);

      const availabilityResponse = await getApiRequest(availabilityUrl, token);

      console.log("Availability response:", availabilityResponse);
      console.log("Availability response status:", availabilityResponse.status);

      if (availabilityResponse.status >= 400) {
        console.error(
          "Availability API error:",
          availabilityResponse.status,
          availabilityResponse.message
        );

        // Handle 404 specifically - instructor availability not found
        if (availabilityResponse.status === 404) {
          console.log(
            "Instructor availability not found, skipping availability check"
          );
          setAvailableSlots([]);
          setAvailabilityChecked(true);
          toast.info(
            "Instructor availability not configured. Please contact support for scheduling."
          );
          return;
        }

        // Check if the response contains error details
        if (availabilityResponse.data && availabilityResponse.data.error) {
          throw new Error(
            `Failed to fetch instructor availability: ${availabilityResponse.data.error}`
          );
        }

        throw new Error(
          `Failed to fetch instructor availability: ${
            availabilityResponse.status
          } - ${availabilityResponse.message || "Unknown error"}`
        );
      }

      const availabilityData = availabilityResponse.data;
      console.log("Availability data:", availabilityData);
      console.log("Availability data keys:", Object.keys(availabilityData));

      // Check if instructor is active
      const isActive = availabilityData.isActive;
      if (!isActive) {
        console.log("Instructor is not active:", availabilityData.isActive);
        setAvailableSlots([]);
        setAvailabilityChecked(true);
        toast.info("Instructor is currently not available for scheduling");
        return;
      }

      // Use availableSlots from the instructor availability response
      const availableSlots = availabilityData.availableSlots || [];
      console.log(
        "Available slots from instructor availability:",
        availableSlots
      );

      // Transform the availableSlots to match our component state
      const transformedSlots = availableSlots.map((slot: any) => {
        // Convert ISO datetime to date and time format
        const startDateTime = new Date(slot.startTime);
        const endDateTime = new Date(slot.endTime);

        return {
          startTime: startDateTime.toTimeString().slice(0, 5), // HH:MM format
          endTime: endDateTime.toTimeString().slice(0, 5), // HH:MM format
          date: startDateTime.toISOString().split("T")[0], // YYYY-MM-DD format
          available: slot.isAvailable,
        };
      });

      console.log("Transformed slots:", transformedSlots);
      setAvailableSlots(transformedSlots);
      setAvailabilityChecked(true);

      if (transformedSlots.length === 0) {
        toast.info("No available time slots found for this instructor");
      } else {
        toast.success(`Found ${transformedSlots.length} available time slots`);
      }
    } catch (error) {
      console.error("Failed to fetch instructor availability:", error);

      if (error instanceof Error) {
        if (error.message.includes("404")) {
          toast.error(
            "Instructor availability not found. Please contact support."
          );
        } else if (error.message.includes("500")) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error(`Failed to load available time slots: ${error.message}`);
        }
      } else {
        toast.error("Failed to load available time slots");
      }

      // Set empty availability when API fails
      setAvailableSlots([]);
      setAvailabilityChecked(true);
    } finally {
      setIsLoadingSlots(false);
    }
  }, [instructorId]);

  // Fetch instructor availability when component mounts
  useEffect(() => {
    if (instructorId) {
      fetchInstructorAvailability();
    }
  }, [instructorId, fetchInstructorAvailability]);

  // Handle time slot selection
  const handleTimeSlotSelect = useCallback(
    async (slot: { startTime: string; endTime: string; date: string }) => {
      setSelectedTimeSlot(slot);

      // Update form data with selected times
      const startDateTime = new Date(`${slot.date}T${slot.startTime}`);
      const endDateTime = new Date(`${slot.date}T${slot.endTime}`);

      setFormData((prev) => ({
        ...prev,
        scheduledStart: startDateTime.toISOString(),
        scheduledEnd: endDateTime.toISOString(),
        preferredDate: slot.date,
        preferredTime: slot.startTime,
      }));

      toast.success("Time slot selected successfully!");
    },
    [
      instructorId,
      formData.timezone,
      formData.email,
      formData.fullName,
      service,
    ]
  );

  // Clear selected time slot
  const clearTimeSlotSelection = useCallback(() => {
    setSelectedTimeSlot(null);
    setFormData((prev) => ({
      ...prev,
      scheduledStart: "",
      scheduledEnd: "",
      preferredDate: undefined,
      preferredTime: "",
    }));
    toast.info("Time slot selection cleared. You can choose a different time.");
  }, []);

  const handleReviewBooking = () => {
    // Validate required fields before showing summary
    const requiredFields = [
      "fullName",
      "email",
      "preferredDate",
      "preferredTime",
    ];

    if (isTrainingService) {
      requiredFields.push("bookingPurpose");
    }

    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]
    );

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    setShowSummaryModal(true);
  };

  // ... existing code ...

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields based on product type
      const requiredFields = [
        "fullName",
        "email",
        "preferredDate",
        "preferredTime",
      ];

      if (isAcademicService) {
      } else if (isTrainingService) {
        requiredFields.push("preferredDate", "preferredTime");
      }

      const missingFields = requiredFields.filter(
        (field) => !formData[field as keyof typeof formData]
      );

      if (missingFields.length > 0) {
        toast.error(
          `Please fill in all required fields: ${missingFields.join(", ")}`
        );
        setLoading(false);
        return;
      }

      // Get authentication token
      const token = getTokenFromCookies();
      console.log(
        "Final booking creation - Token retrieved:",
        token ? `${token.substring(0, 20)}...` : "NO TOKEN"
      );

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        router.push("/login");
        return;
      }

      // Use Calendly scheduled times if available, otherwise calculate
      let scheduleDate: Date;
      let endDate: Date;

      if (formData.scheduledStart && formData.scheduledEnd) {
        // Use Calendly confirmed times
        scheduleDate = new Date(formData.scheduledStart);
        endDate = new Date(formData.scheduledEnd);
      } else {
        // Fallback to calculated times
        scheduleDate = new Date(
          `${formData.preferredDate}T${formData.preferredTime}`
        );
        endDate = new Date(
          scheduleDate.getTime() +
            parseInt(durationInMinutes || minutesPerSession || "60") * 60000
        );
      }

      // Create booking payload based on product type
      let bookingPayload: any = {
        productId,
        instructorId: instructorId || undefined,
        bookingPurpose: service,
        scheduleAt: scheduleDate.toISOString(),
        endAt: endDate.toISOString(),
        timezone: formData.timezone,
        minutesPerSession: parseInt(minutesPerSession || "60"),
        durationInMinutes: parseInt(
          durationInMinutes || minutesPerSession || "60"
        ),
        numberOfExpectedParticipants: isTrainingService
          ? formData.numberOfExpectedParticipants
          : formData.numberOfParticipants,
        isClassroom: isClassroom,
        isSession: isSession,
        userNotes: formData.userNotes,
        participantType: formData.participantType,
        platformRole: userData?.role || "student",
        email: userData?.email || formData.email,
        fullName: userData?.fullName || formData.fullName,
        schedulingStatus: "awaiting-payment",

        // Scheduling fields
        scheduledStart: formData.scheduledStart,
        scheduledEnd: formData.scheduledEnd,
      };

      // Add product type specific fields
      if (isAcademicService) {
        if (formData.attachments.length > 0) {
          // Check if all files are uploaded to Cloudinary
          const unuploadedFiles = formData.attachments.filter(
            (att) => !att.cloudinaryUrl
          );
          if (unuploadedFiles.length > 0) {
            toast.error(
              `Please wait for all files to finish uploading before creating the booking.`
            );
            setLoading(false);
            return;
          }

          // Process attachments - send only the Cloudinary URLs
          const processedAttachments = formData.attachments.map(
            (fileObj) => fileObj.cloudinaryUrl!
          );
          bookingPayload = {
            ...bookingPayload,
            productType: "Academic Support Services",
            attachments: processedAttachments,
          };
        } else {
          bookingPayload = {
            ...bookingPayload,
            productType: "Academic Support Services",
            attachments: [],
          };
        }
      } else if (isTrainingService) {
        bookingPayload = {
          ...bookingPayload,
          productType: "Training & Certification",
        };
      }
      let response;
      try {
        console.log("Creating booking with payload:", bookingPayload);
        response = await postApiRequest("/api/bookings", token, bookingPayload);
        console.log("Booking response:", response);

        if (response.status >= 400) {
          console.error("Booking creation failed:", response);

          // Check if the response contains error details
          if (response.data && response.data.error) {
            throw new Error(`Failed to create booking: ${response.data.error}`);
          } else if (response.data && response.data.message) {
            throw new Error(
              `Failed to create booking: ${response.data.message}`
            );
          } else {
            throw new Error("Failed to create booking");
          }
        }
      } catch (apiError: any) {
        throw apiError;
      }

      // Extract the created booking ID from the response
      const createdBookingId =
        response.data?.data?._id ||
        response.data?._id ||
        response.data?.id ||
        (response as any)._id;

      if (!createdBookingId) {
        throw new Error(
          "Booking created but no ID returned. Please check the API response."
        );
      }

      // Create cart item for payment
      const cartItem = {
        id: productId!,
        title: productName!,
        description: `${productName} - ${
          formData.sessionType || sessionType
        } Session`,
        price: parseFloat(price || "50"),
        discountPercentage: 0,
        category: productType || "Service",
        productType: productType || "Training & Certfication",
        image: "/assets/default-product.png",
        duration: duration || "1 Session",
        certificate: false,
        status: "active",
        level: formData.sessionType || sessionType || "1-on-1",
        requiresBooking: true,
        deliveryMode: deliveryMode || "Virtual",
        sessionType: (formData.sessionType ||
          sessionType ||
          "1-on-1") as string,
        isRecurring: false,
        programLength: 1,
        mode: "session",
        durationInMinutes: parseInt(
          durationInMinutes || minutesPerSession || "60"
        ),
        minutesPerSession: parseInt(minutesPerSession || "60"),
        hasClassroom: isClassroom,
        hasSession: isSession,
        hasAssessment: false,
        hasCertificate: false,
        requiresEnrollment: false,
        isBookableService: true,
        instructorId: instructorId || undefined,
        bookingDetails: {
          fullName: userData?.fullName,
          email: userData?.email,
          phone: formData.phone,
          preferredDate: formData.preferredDate
            ? new Date(formData.preferredDate)
            : undefined,
          preferredTime: formData.preferredTime,
          numberOfParticipants: formData.numberOfParticipants,
          participantType: formData.participantType,
          userNotes: formData.userNotes,
          bookingId: createdBookingId, // Use the correct booking ID
          bookingData: bookingPayload,
          attachments: formData.attachments.map((att) => att.cloudinaryUrl),
        },
      };

      addToCart(cartItem);
      toast.success("Booking created and added to cart successfully!");
      router.push("/cart");
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  if (!productId || !productName || !productType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading booking form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6 pt-32">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-2 hover:bg-white/50 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Book {productName}
            </h1>
            <p className="text-slate-600">
              {isAcademicService
                ? "Schedule your academic support session"
                : "Schedule your training program"}
            </p>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {productType}
              </Badge>
              <Badge variant="outline">{deliveryMode || "Virtual"}</Badge>
              <Badge variant="outline">${price || "50"}</Badge>
            </div>
          </div>
        </div>

        {/* Debug Information - Remove in production */}
        {/* {process.env.NODE_ENV === "development" && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-800 text-sm">
                Debug Info (Development Only)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <strong>Product ID:</strong> {productId}
                </div>
                <div>
                  <strong>Instructor ID:</strong> {instructorId || "MISSING"}
                </div>
                <div>
                  <strong>Is Classroom:</strong> {isClassroom.toString()}
                </div>
                <div>
                  <strong>Is Session:</strong> {isSession.toString()}
                </div>
                <div>
                  <strong>Product Type:</strong> {productType}
                </div>
                <div>
                  <strong>Service:</strong> {service}
                </div>
              </div>
              {!instructorId && (
                <div className="mt-2 p-2 bg-red-100 rounded text-red-800 text-xs">
                  ⚠️ Instructor ID is missing! This will prevent Calendly
                  integration from working.
                </div>
              )}
            </CardContent>
          </Card>
        )} */}

        {/* Smart Scheduling Interface */}
        {isClassroom && (
          <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">Classroom Program</h4>
            </div>
            <p className="text-sm text-blue-700">
              This is a recurring classroom program. Select your preferred time
              slot below, and the instructor will confirm the final schedule
              after payment.
            </p>
          </div>
        )}

        {isSession && !isClassroom && (
          <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-green-900">Single Session</h4>
            </div>
            <p className="text-sm text-green-700">
              This is a one-time session. Please select your preferred date and
              time above.
            </p>
          </div>
        )}

        <form className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <User className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="fullName"
                    className="text-sm font-semibold text-slate-700"
                  >
                    {isAcademicService ? "Student Name" : "Contact Person"} *
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    placeholder={
                      isAcademicService
                        ? "Enter your full name"
                        : "Enter contact person name"
                    }
                    className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={!!userData?.fullName}
                    readOnly={!!userData?.fullName}
                  />
                  {userData?.fullName && (
                    <p className="text-xs text-slate-500 mt-1">
                      Using your profile name: {userData.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter email address"
                    className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={!!userData?.email}
                    readOnly={!!userData?.email}
                  />
                  {userData?.email && (
                    <p className="text-xs text-slate-500 mt-1">
                      Using your profile email: {userData.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="phone"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter phone number"
                    className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="numberOfParticipants"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Number of Participants
                  </Label>
                  <Input
                    id="numberOfParticipants"
                    type="number"
                    value={formData.numberOfParticipants}
                    onChange={(e) =>
                      handleInputChange(
                        "numberOfParticipants",
                        parseInt(e.target.value)
                      )
                    }
                    min="1"
                    max="100"
                    className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {formData.participantType === "individual" &&
                      "Individual session"}
                    {formData.participantType === "team" &&
                      "Team session (2+ people)"}
                    {formData.participantType === "institution" &&
                      "Institutional booking (2+ people)"}
                    {formData.participantType === "recruiter" &&
                      "Recruiter session"}
                    {formData.participantType === "visitor" &&
                      "Visitor session"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product-Specific Information */}
          {isAcademicService && (
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <GraduationCap className="w-5 h-5" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label
                    htmlFor="userNotes"
                    className="text-sm font-semibold text-slate-700"
                  >
                    User Note
                  </Label>
                  <Textarea
                    id="userNotes"
                    value={formData.userNotes}
                    onChange={(e) =>
                      handleInputChange("userNotes", e.target.value)
                    }
                    placeholder="Any specific academic requirements, research questions, or areas you'd like to focus on..."
                    className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="attachments"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Document Attachments
                  </Label>
                  <div className="space-y-3">
                    <Input
                      id="attachments"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const newFiles = Array.from(e.target.files || []);

                        // Validate file sizes (10MB limit for better API compatibility)
                        const validFiles = newFiles.filter((file) => {
                          if (file.size > 10 * 1024 * 1024) {
                            // 10MB in bytes
                            toast.error(
                              `${file.name} is too large. Maximum size is 10MB. Please compress or use a smaller file.`
                            );
                            return false;
                          }
                          return true;
                        });

                        if (validFiles.length > 0) {
                          // Create file objects with metadata (initially without Cloudinary URLs)
                          const newFileObjects = validFiles.map((file) => ({
                            id: Date.now() + Math.random(), // Unique ID for removal
                            file: file,
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            uploadProgress: 0, // Start with 0% progress
                            uploadStartTime: Date.now(), // Track when upload started
                          }));

                          // Add new files to existing attachments
                          setFormData((prev) => ({
                            ...prev,
                            attachments: [
                              ...prev.attachments,
                              ...newFileObjects,
                            ],
                          }));

                          // Upload files to Cloudinary in the background with progress simulation
                          validFiles.forEach(async (file, index) => {
                            try {
                              // Simulate upload progress
                              const progressInterval = setInterval(() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  attachments: prev.attachments.map((att) =>
                                    att.id === newFileObjects[index].id
                                      ? {
                                          ...att,
                                          uploadProgress: Math.min(
                                            (att.uploadProgress || 0) +
                                              Math.random() * 15,
                                            90
                                          ), // Simulate progress up to 90%
                                        }
                                      : att
                                  ),
                                }));
                              }, 200); // Update every 200ms

                              const cloudinaryResult =
                                await uploadFileToCloudinary(file);

                              // Clear the progress interval
                              clearInterval(progressInterval);

                              // Set progress to 100% and update with Cloudinary data
                              setFormData((prev) => ({
                                ...prev,
                                attachments: prev.attachments.map((att) =>
                                  att.id === newFileObjects[index].id
                                    ? {
                                        ...att,
                                        uploadProgress: 100,
                                        cloudinaryUrl: cloudinaryResult.url,
                                        publicId: cloudinaryResult.publicId,
                                        format: cloudinaryResult.format,
                                      }
                                    : att
                                ),
                              }));

                              toast.success(
                                `${file.name} uploaded successfully!`
                              );
                            } catch (error) {
                              console.error(
                                `Failed to upload ${file.name}:`,
                                error
                              );
                              toast.error(`Failed to upload ${file.name}`);

                              // Remove the failed upload from attachments
                              setFormData((prev) => ({
                                ...prev,
                                attachments: prev.attachments.filter(
                                  (att) => att.id !== newFileObjects[index].id
                                ),
                              }));
                            }
                          });
                        }

                        // Reset the input to allow selecting the same file again
                        e.target.value = "";
                      }}
                      className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-slate-500">
                      Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB
                      per file)
                    </p>
                    {/* <p className="text-xs text-amber-600 font-medium">
                      💡 Tip: Large files may cause upload delays. Consider
                      compressing PDFs or using smaller files.
                    </p> */}

                    {/* Overall Upload Progress */}
                    {formData.attachments.length > 0 && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between text-xs text-blue-700 mb-1">
                          <span>Overall Upload Progress</span>
                          <span>
                            {
                              formData.attachments.filter(
                                (att) => att.cloudinaryUrl
                              ).length
                            }{" "}
                            / {formData.attachments.length} completed
                          </span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                            style={{
                              width: `${
                                (formData.attachments.filter(
                                  (att) => att.cloudinaryUrl
                                ).length /
                                  formData.attachments.length) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-blue-600 mt-1">
                          <span>
                            {
                              formData.attachments.filter(
                                (att) =>
                                  !att.cloudinaryUrl && att.uploadProgress === 0
                              ).length
                            }{" "}
                            queued
                          </span>
                          <span>
                            {
                              formData.attachments.filter(
                                (att) =>
                                  !att.cloudinaryUrl &&
                                  (att.uploadProgress || 0) > 0
                              ).length
                            }{" "}
                            uploading
                          </span>
                        </div>
                      </div>
                    )}

                    {/* File List with Remove Buttons */}
                    {formData.attachments.length > 0 && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-xs font-medium text-slate-700 mb-2">
                          Selected files ({formData.attachments.length}):
                        </p>
                        <div className="space-y-2">
                          {formData.attachments.map((fileObj, index) => (
                            <div
                              key={fileObj.id}
                              className="flex items-center justify-between p-2 bg-white rounded border border-slate-200"
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="text-blue-600">📎</span>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-medium text-slate-700 truncate">
                                    {fileObj.name}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {(fileObj.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                  {fileObj.cloudinaryUrl ? (
                                    <p className="text-xs text-green-600">
                                      ✅ Uploaded
                                    </p>
                                  ) : (
                                    <div className="space-y-1">
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="text-amber-600">
                                          ⏳ Uploading...{" "}
                                          {fileObj.uploadProgress || 0}%
                                        </span>
                                        {fileObj.uploadProgress &&
                                          fileObj.uploadProgress > 0 &&
                                          fileObj.uploadStartTime && (
                                            <span className="text-slate-500">
                                              {Math.ceil(
                                                (Date.now() -
                                                  fileObj.uploadStartTime) /
                                                  1000
                                              )}
                                              s
                                            </span>
                                          )}
                                      </div>
                                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                                        <div
                                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                                          style={{
                                            width: `${
                                              fileObj.uploadProgress || 0
                                            }%`,
                                          }}
                                        ></div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // Remove file from attachments
                                  setFormData((prev) => ({
                                    ...prev,
                                    attachments: prev.attachments.filter(
                                      (f) => f.id !== fileObj.id
                                    ),
                                  }));
                                }}
                                className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-200">
                          <p className="text-xs text-slate-500">
                            Total: {formData.attachments.length} file(s)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isTrainingService && (
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Target className="w-5 h-5" />
                  Training Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="bookingPurpose"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Booking Purpose *
                    </Label>
                    <Input
                      id="bookingPurpose"
                      value={formData.bookingPurpose}
                      onChange={(e) =>
                        handleInputChange("bookingPurpose", e.target.value)
                      }
                      placeholder="e.g., Data Science Fundamentals Training"
                      className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="numberOfExpectedParticipants"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Number of Participants
                    </Label>
                    <Input
                      id="numberOfExpectedParticipants"
                      type="number"
                      value={formData.numberOfExpectedParticipants}
                      onChange={(e) =>
                        handleInputChange(
                          "numberOfExpectedParticipants",
                          parseInt(e.target.value)
                        )
                      }
                      min="1"
                      max="100"
                      className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Scheduling */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Calendar className="w-5 h-5" />
                Scheduling Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Calendly Integration - Time Slot Selection Button */}
              {instructorId && (
                <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <h4 className="font-medium text-blue-900">
                        Available Time Slots
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedTimeSlot && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={clearTimeSlotSelection}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                          <span className="ml-2">Clear</span>
                        </Button>
                      )}
                    </div>
                  </div>

                  {selectedTimeSlot ? (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">Selected Time Slot:</span>
                      </div>
                      <div className="mt-1 text-green-700">
                        <div className="font-medium">
                          {new Date(selectedTimeSlot.date).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </div>
                        <div className="text-sm">
                          {selectedTimeSlot.startTime} -{" "}
                          {selectedTimeSlot.endTime}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-blue-700 mb-3">
                        Click the button below to view and select from available
                        time slots:
                      </p>
                      <Dialog
                        open={showTimeSlotModal}
                        onOpenChange={setShowTimeSlotModal}
                      >
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="text-blue-600 border-blue-200 hover:bg-blue-100"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            View Available Time Slots
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-blue-600" />
                              Available Time Slots
                            </DialogTitle>
                          </DialogHeader>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-600">
                                Select from the instructor's available time
                                slots:
                              </p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={fetchInstructorAvailability}
                                disabled={isLoadingSlots}
                                className="text-blue-600 border-blue-200 hover:bg-blue-100"
                              >
                                {isLoadingSlots ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <RefreshCw className="w-4 h-4" />
                                )}
                                <span className="ml-2">Refresh</span>
                              </Button>
                            </div>

                            {isLoadingSlots ? (
                              <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                <span className="ml-2 text-blue-700">
                                  Loading available slots...
                                </span>
                              </div>
                            ) : availableSlots.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {availableSlots.map((slot, index) => {
                                  const isSelected = Boolean(
                                    selectedTimeSlot &&
                                      (selectedTimeSlot as any).date ===
                                        slot.date &&
                                      (selectedTimeSlot as any).startTime ===
                                        slot.startTime
                                  );

                                  return (
                                    <button
                                      key={index}
                                      type="button"
                                      onClick={() => {
                                        handleTimeSlotSelect(slot);
                                        setShowTimeSlotModal(false);
                                      }}
                                      className={`p-4 text-left rounded-lg border transition-all ${
                                        isSelected
                                          ? "border-blue-500 bg-blue-100 ring-2 ring-blue-200"
                                          : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                                      }`}
                                    >
                                      <div className="font-medium text-slate-900">
                                        {new Date(slot.date).toLocaleDateString(
                                          "en-US",
                                          {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                          }
                                        )}
                                      </div>
                                      <div className="text-sm text-slate-600">
                                        {slot.startTime} - {slot.endTime}
                                      </div>
                                      {isSelected && (
                                        <div className="text-xs text-blue-600 mt-1">
                                          ✓ Selected
                                        </div>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-slate-600">
                                <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                                <p className="font-medium">
                                  No available time slots found.
                                </p>
                                <p className="text-sm">
                                  Please contact the instructor for scheduling.
                                </p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              )}

              {/* Message when instructorId is missing or availability not configured */}
              {(!instructorId ||
                (availabilityChecked && availableSlots.length === 0)) && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 text-amber-700 mb-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {!instructorId
                        ? "Instructor Information Missing"
                        : "Scheduling Not Available"}
                    </span>
                  </div>
                  <p className="text-sm text-amber-600 mb-3">
                    {!instructorId
                      ? "This product doesn't have an assigned instructor. Please contact support or choose a different product."
                      : "The instructor's availability is not configured yet. Please contact support to schedule your session."}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-amber-700 border-amber-300 hover:bg-amber-100"
                      onClick={() => {
                        // You can add a contact support action here
                        toast.info(
                          "Please contact support for scheduling assistance"
                        );
                      }}
                    >
                      Contact Support
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-amber-700 border-amber-300 hover:bg-amber-100"
                      onClick={() => router.push("/training/catalog")}
                    >
                      Browse Other Options
                    </Button>
                  </div>
                </div>
              )}

              {/* Note for classroom bookings */}
              {instructorId && isClassroom && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Classroom Program
                    </span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    This is a recurring classroom program. You can select your
                    preferred time slot above, and the instructor will confirm
                    the final schedule after payment.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="preferredDate"
                    className="text-sm font-semibold text-slate-700"
                  >
                    {selectedTimeSlot ? "Selected Date" : "Preferred Date"} *
                  </Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) =>
                      handleInputChange("preferredDate", e.target.value)
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className={`mt-1 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      selectedTimeSlot
                        ? "bg-blue-50 border-blue-200"
                        : "bg-white/50 border-slate-200"
                    }`}
                    required
                    disabled={!!selectedTimeSlot}
                  />
                  {selectedTimeSlot && (
                    <p className="text-xs text-blue-600 mt-1">
                      ✓ Date selected from available slots
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="preferredTime"
                    className="text-sm font-semibold text-slate-700"
                  >
                    {selectedTimeSlot ? "Selected Time" : "Preferred Time"} *
                  </Label>
                  <Input
                    id="preferredTime"
                    type="time"
                    value={formData.preferredTime}
                    onChange={(e) =>
                      handleInputChange("preferredTime", e.target.value)
                    }
                    className={`mt-1 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      selectedTimeSlot
                        ? "bg-blue-50 border-blue-200"
                        : "bg-white/50 border-slate-200"
                    }`}
                    required
                    disabled={!!selectedTimeSlot}
                  />
                  {selectedTimeSlot && (
                    <p className="text-xs text-blue-600 mt-1">
                      ✓ Time selected from available slots
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="sessionType"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Session Type
                  </Label>
                  <Select
                    value={formData.sessionType || sessionType || "1-on-1"}
                    onValueChange={(value) =>
                      handleInputChange("sessionType", value)
                    }
                  >
                    <SelectTrigger className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="1-on-1">1-on-1 Session</SelectItem>
                      <SelectItem value="group">Group Session</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="seminar">Seminar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="participantType"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Participant Type
                  </Label>
                  <Select
                    value={formData.participantType}
                    onValueChange={(
                      value:
                        | "individual"
                        | "team"
                        | "institution"
                        | "recruiter"
                        | "visitor"
                    ) => handleInputChange("participantType", value)}
                  >
                    <SelectTrigger className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                      <SelectItem value="institution">Institution</SelectItem>
                      <SelectItem value="recruiter">Recruiter</SelectItem>
                      <SelectItem value="visitor">Visitor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Timezone Selection */}
              <div className="space-y-2">
                <Label
                  htmlFor="timezone"
                  className="text-sm font-semibold text-slate-700"
                >
                  Your Timezone
                </Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) =>
                    handleInputChange("timezone", value)
                  }
                >
                  <SelectTrigger className="mt-1 bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">
                      Eastern Time (ET)
                    </SelectItem>
                    <SelectItem value="America/Chicago">
                      Central Time (CT)
                    </SelectItem>
                    <SelectItem value="America/Denver">
                      Mountain Time (MT)
                    </SelectItem>
                    <SelectItem value="America/Los_Angeles">
                      Pacific Time (PT)
                    </SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                    <SelectItem value="Asia/Shanghai">
                      Shanghai (CST)
                    </SelectItem>
                    <SelectItem value="Australia/Sydney">
                      Sydney (AEST)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">
                  All scheduling times will be shown in your selected timezone
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Review Booking Button */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <BookOpen className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">
                    Ready to Review Your Booking?
                  </h3>
                </div>
                <p className="text-slate-600">
                  Click below to review all your booking details before creating
                  the final booking.
                </p>
                <Button
                  type="button"
                  onClick={handleReviewBooking}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Review Booking Details
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="px-8 py-3"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>

      {/* Booking Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Booking Summary
                    </h2>
                    <p className="text-slate-600">
                      Review your booking details before confirming
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSummaryModal(false)}
                  className="hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-4 space-y-6">
              {/* Service Information */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Service Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-slate-700">Service:</p>
                    <p className="text-slate-600">{service}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Type:</p>
                    <p className="text-slate-600">{formData.participantType}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Participants:</p>
                    <p className="text-slate-600">
                      {isTrainingService
                        ? formData.numberOfExpectedParticipants
                        : formData.numberOfParticipants}{" "}
                      people
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Duration:</p>
                    <p className="text-slate-600">
                      {durationInMinutes || minutesPerSession} minutes
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Delivery:</p>
                    <p className="text-slate-600">
                      {deliveryMode || "Virtual"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Price:</p>
                    <p className="font-semibold text-green-600">
                      ${price || "50"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-slate-700">Name:</p>
                    <p className="text-slate-600">{formData.fullName}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Email:</p>
                    <p className="text-slate-600">{formData.email}</p>
                  </div>
                  {formData.phone && (
                    <div>
                      <p className="font-medium text-slate-700">Phone:</p>
                      <p className="text-slate-600">{formData.phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-slate-700">Timezone:</p>
                    <p className="text-slate-600">{formData.timezone}</p>
                  </div>
                </div>
              </div>

              {/* Scheduling Information */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Scheduling Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-slate-700">Date:</p>
                    <p className="text-slate-600">
                      {formData.preferredDate
                        ? new Date(formData.preferredDate).toLocaleDateString()
                        : "Not selected"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Time:</p>
                    <p className="text-slate-600">
                      {formData.preferredTime || "Not selected"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Session Type:</p>
                    <p className="text-slate-600">{formData.sessionType}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">
                      Participant Type:
                    </p>
                    <p className="text-slate-600">{formData.participantType}</p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {(formData.userNotes || formData.attachments.length > 0) && (
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Additional Information
                  </h3>
                  <div className="space-y-3">
                    {formData.userNotes && (
                      <div>
                        <p className="font-medium text-slate-700 text-sm">
                          User Notes:
                        </p>
                        <p className="text-slate-600 text-sm bg-white p-2 rounded border">
                          {formData.userNotes}
                        </p>
                      </div>
                    )}

                    {formData.attachments.length > 0 && (
                      <div>
                        <p className="font-medium text-slate-700 text-sm">
                          Attachments:
                        </p>
                        <ul className="text-slate-600 text-sm bg-white p-2 rounded border space-y-1">
                          {formData.attachments.map((fileObj, index) => (
                            <li
                              key={fileObj.id}
                              className="flex items-center gap-2"
                            >
                              <span>📎</span>
                              <span className="truncate">{fileObj.name}</span>
                              <span className="text-xs text-slate-400">
                                ({(fileObj.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                              {fileObj.cloudinaryUrl ? (
                                <span className="text-xs text-green-600">
                                  ✅
                                </span>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-amber-600">
                                    ⏳ {fileObj.uploadProgress || 0}%
                                  </span>
                                  <div className="w-16 bg-slate-200 rounded-full h-1">
                                    <div
                                      className="bg-blue-600 h-1 rounded-full transition-all duration-300 ease-out"
                                      style={{
                                        width: `${
                                          fileObj.uploadProgress || 0
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Training Specific */}
              {isTrainingService && formData.bookingPurpose && (
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Training Purpose
                  </h3>
                  <p className="text-slate-600 text-sm bg-white p-2 rounded border">
                    {formData.bookingPurpose}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 rounded-b-2xl">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setShowSummaryModal(false)}
                  className="px-6 py-2"
                >
                  Go Back & Edit
                </Button>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Total Amount:</p>
                    <p className="text-xl font-bold text-green-600">
                      ${price || "50"}
                    </p>
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Booking...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Create Booking
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
