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
  User,
  BookOpen,
  Video,
  FileText,
  Send,
  Loader2,
  GraduationCap,
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

import { safeConsole } from "@/lib/console";
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
  const minutesPerSession = searchParams.get("minutesPerSession");
  const price = searchParams.get("price");
  const instructorId = searchParams.get("instructorId");
  const isClassroom = searchParams.get("isClassroom") === "true";
  const isSession = searchParams.get("isSession") === "true";
  const durationInMinutes = searchParams.get("durationInMinutes");

  // Determine service types
  const isAcademicService = productType?.includes("Academic Support Services");
  const isTrainingService = productType?.includes("Training & Certification");

  // Product data state
  const [productData, setProductData] = useState<any>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
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
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    bookingPurpose: "",
    numberOfExpectedParticipants: 1,
    scheduledStart: "",
    scheduledEnd: "",
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
    attachments: [] as Array<{
      id: number;
      file: File;
      name: string;
      size: number;
      type: string;
      cloudinaryUrl?: string;
      publicId?: string;
      format?: string;
      uploadProgress?: number;
      uploadStartTime?: number;
    }>,
  });

  // Time slot state
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
  const [hasPrefetchedAvailability, setHasPrefetchedAvailability] =
    useState(false);
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

  // Fetch instructor availability
  const fetchInstructorAvailability = useCallback(async () => {
    if (!instructorId) {
      toast.warning("No instructor assigned to this product");
      return;
    }

    const token = getTokenFromCookies();
    if (!token) {
      toast.error("Authentication token not found. Please login again.");
      return;
    }

    setIsLoadingSlots(true);
    setAvailabilityChecked(false);

    try {
      const availabilityUrl = `/api/instructor-availability/${instructorId}`;
      const availabilityResponse = await getApiRequest(availabilityUrl, token);

      if (availabilityResponse.status >= 400) {
        if (availabilityResponse.status === 404) {
          setAvailableSlots([]);
          setAvailabilityChecked(true);
          toast.info(
            "Instructor availability not configured. Please contact support for scheduling."
          );
          return;
        }

        // Gracefully handle validation errors like "Start date cannot be in the past"
        const apiError = availabilityResponse.data?.error;
        const details = availabilityResponse.data?.details;
        const validationMsg = Array.isArray(details) ? details[0] : undefined;
        const message =
          validationMsg ||
          apiError ||
          availabilityResponse.message ||
          "Unknown error";
        // Avoid spamming users with validation errors during initial attempts
        safeConsole.warn("Availability fetch error:", message);
        setAvailableSlots([]);
        setAvailabilityChecked(true);
        return;
      }

      const availabilityData = availabilityResponse.data;
      const isActive = availabilityData.data?.isActive;

      if (!isActive) {
        setAvailableSlots([]);
        setAvailabilityChecked(true);
        toast.info("Instructor is currently not available for scheduling");
        return;
      }

      const availableSlots = availabilityData.data?.availableSlots || [];
      const durationMinutes =
        availabilityData.data?.slotsInfo?.durationMinutes || 60;

      // safeConsole.log(
      //   "Processing available slots:",
      //   availableSlots.length,
      //   "slots"
      // );
      // safeConsole.log("Duration minutes:", durationMinutes);

      const transformedSlots = availableSlots
        .map((slotTime: string, index: number) => {
          try {
            // Debug first few slots
            if (index < 3) {
              safeConsole.log(`Processing slot ${index}:`, slotTime);
            }

            const startDateTime = new Date(slotTime);

            // Validate the date is valid
            if (isNaN(startDateTime.getTime())) {
              // safeConsole.warn("Invalid date string:", slotTime);
              return null;
            }

            const endDateTime = new Date(
              startDateTime.getTime() + durationMinutes * 60000
            );

            const result = {
              startTime: startDateTime.toTimeString().slice(0, 5),
              endTime: endDateTime.toTimeString().slice(0, 5),
              date: startDateTime.toISOString().split("T")[0],
              available: true, // All slots in the array are available
            };

            // Debug first few results
            // if (index < 3) {
            //   safeConsole.log(`Result for slot ${index}:`, result);
            // }

            return result;
          } catch (error) {
            safeConsole.warn("Error processing slot:", slotTime, error);
            return null;
          }
        })
        .filter(Boolean); // Remove null entries

      setAvailableSlots(transformedSlots);
      setAvailabilityChecked(true);

      if (transformedSlots.length === 0) {
        toast.info("No available time slots found for this instructor");
      } else {
        toast.success(`Found ${transformedSlots.length} available time slots`);
      }
    } catch (error) {
      safeConsole.error("Failed to fetch instructor availability:", error);

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

      setAvailableSlots([]);
      setAvailabilityChecked(true);
    } finally {
      setIsLoadingSlots(false);
    }
  }, [instructorId]);

  // Fetch product data when component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      setLoadingProduct(true);
      try {
        const token = getTokenFromCookies();
        if (!token) {
          toast.error("Authentication token not found. Please login again.");
          return;
        }

        const response = await getApiRequest(
          `/api/products/public/${productId}`,
          token
        );
        if (response.status >= 400) {
          throw new Error(`Failed to fetch product: ${response.message}`);
        }

        setProductData(response.data);
      } catch (error) {
        safeConsole.error("Failed to fetch product:", error);
        toast.error("Failed to load product details. Please try again.");
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Prefetch availability once after mount when instructorId is ready
  useEffect(() => {
    if (instructorId && !hasPrefetchedAvailability) {
      setHasPrefetchedAvailability(true);
      fetchInstructorAvailability();
    }
  }, [instructorId, hasPrefetchedAvailability, fetchInstructorAvailability]);

  // Handle time slot selection
  const handleTimeSlotSelect = useCallback(
    (slot: { startTime: string; endTime: string; date: string }) => {
      setSelectedTimeSlot(slot);

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
    []
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
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
        setLoading(false);
        return;
      }

      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        router.push("/login");
        return;
      }

      // Calculate schedule times
      let scheduleDate: Date;
      let endDate: Date;

      if (formData.scheduledStart && formData.scheduledEnd) {
        scheduleDate = new Date(formData.scheduledStart);
        endDate = new Date(formData.scheduledEnd);
      } else {
        scheduleDate = new Date(
          `${formData.preferredDate}T${formData.preferredTime}`
        );
        endDate = new Date(
          scheduleDate.getTime() +
            parseInt(durationInMinutes || minutesPerSession || "60") * 60000
        );
      }

      // Create booking payload
      let bookingPayload: any = {
        productId,
        instructorId: instructorId || undefined,
        bookingPurpose: service,
        scheduleAt: scheduleDate.toISOString(),
        endAt: endDate.toISOString(),
        timezone: formData.timezone,
        minutesPerSession: parseInt(minutesPerSession || "60"),
        durationInMinutes: parseInt(durationInMinutes || "60"),
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
        scheduledStart: formData.scheduledStart,
        scheduledEnd: formData.scheduledEnd,

        // Required fields that were missing:
        createdBy: (userData as any)?._id,
        profileId: (userData as any)?.profileId,

        // Participants array (denormalized data)
        participants: [
          {
            participantType: formData.participantType,
            platformRole: userData?.role || "student",
            profileId: (userData as any)?.profileId,
            email: userData?.email || formData.email,
            fullName: userData?.fullName || formData.fullName,
          },
        ],

        // Classroom-specific fields
        actualDaysAndTime: formData.actualDaysAndTime || [],
      };

      // Add product type specific fields
      if (isAcademicService) {
        const unuploadedFiles = formData.attachments.filter(
          (att) => !att.cloudinaryUrl
        );
        if (unuploadedFiles.length > 0) {
          toast.error(
            "Please wait for all files to finish uploading before creating the booking."
          );
          setLoading(false);
          return;
        }

        const processedAttachments = formData.attachments.map(
          (fileObj) => fileObj.cloudinaryUrl!
        );
        bookingPayload = {
          ...bookingPayload,
          productType: "Academic Support Services",
          attachments: processedAttachments,
        };
      } else if (isTrainingService) {
        bookingPayload = {
          ...bookingPayload,
          productType: "Training & Certification",
        };
      }

      // Create booking
      const response = await postApiRequest(
        "/api/bookings",
        token,
        bookingPayload
      );

      if (response.status >= 400) {
        if (response.data?.error) {
          throw new Error(`Failed to create booking: ${response.data.error}`);
        } else if (response.data?.message) {
          throw new Error(`Failed to create booking: ${response.data.message}`);
        } else {
          throw new Error("Failed to create booking");
        }
      }

      const createdBookingId =
        response.data?.data?._id || response.data?._id || response.data?.id;

      if (!createdBookingId) {
        throw new Error(
          "Booking created but no ID returned. Please check the API response."
        );
      }

      // Create cart item from product data
      const cartItem = {
        id: productId!,
        title: productData?.title || productName!,
        description: `${productData?.title || productName} - ${
          formData.sessionType || sessionType
        } Session`,
        price: parseFloat(productData?.price || price || "50"),
        currency: productData.currency || "usd",
        discountPercentage: productData?.discountPercentage || 0,
        category: productData?.category || productType || "Service",
        productType:
          productData?.productType || productType || "Training & Certification",
        image: productData?.image || "/assets/default-product.png",
        certificate: productData?.certificate || false,
        status: productData?.status || "active",
        level: formData.sessionType || sessionType || "1-on-1",
        requiresBooking: productData?.requiresBooking || true,
        deliveryMode: productData?.deliveryMode || deliveryMode || "Virtual",
        sessionType: (formData.sessionType ||
          sessionType ||
          "1-on-1") as string,
        isRecurring: productData?.isRecurring || false,
        programLength: productData?.programLength || 1,
        mode: productData?.mode || "session",
        duration: productData?.duration || durationInMinutes || "60",
        durationInMinutes: parseInt(
          productData?.durationInMinutes || durationInMinutes || "60"
        ),
        minutesPerSession: parseInt(
          productData?.minutesPerSession || minutesPerSession || "60"
        ),
        hasClassroom: productData?.hasClassroom || isClassroom,
        hasSession: productData?.hasSession || isSession,
        hasAssessment: productData?.hasAssessment || false,
        hasCertificate: productData?.hasCertificate || false,
        requiresEnrollment: productData?.requiresEnrollment || false,
        isBookableService: productData?.isBookableService || true,
        instructorId: productData?.instructorId || instructorId || undefined,
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
          bookingId: createdBookingId,
          bookingData: bookingPayload,
          attachments: formData.attachments.map((att) => att.cloudinaryUrl),
          // Additional fields for payment intent
          profileId: (userData as any)?.profileId,
          platformRole: userData?.role || "student",
          customerId: (userData as any)?.stripeCustomerId,
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

  if (loadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading product details...</p>
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
            className="p-2 hover:bg-white/50 rounded-[12px]"
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
                              safeConsole.error(
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
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-[12px] shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {new Date(
                                selectedTimeSlot.date
                              ).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </div>
                            <div className="text-sm text-gray-600">
                              {selectedTimeSlot.startTime} -{" "}
                              {selectedTimeSlot.endTime}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={clearTimeSlotSelection}
                            className="text-gray-500 hover:text-gray-700 hover:bg-white/50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
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
                        onOpenChange={(open) => {
                          setShowTimeSlotModal(open);
                          if (open) {
                            // Lazy-load availability when user opens the modal
                            fetchInstructorAvailability();
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            View Available Time Slots
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden bg-white p-0">
                          <DialogHeader className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                  <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <DialogTitle className="text-xl font-semibold text-gray-900">
                                    Choose a time
                                  </DialogTitle>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Select from available time slots
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={fetchInstructorAvailability}
                                disabled={isLoadingSlots}
                                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                              >
                                {isLoadingSlots ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <RefreshCw className="w-4 h-4" />
                                )}
                                <span className="ml-2">Refresh</span>
                              </Button>
                            </div>
                          </DialogHeader>

                          <div className="flex-1 overflow-y-auto max-h-[60vh]">
                            {isLoadingSlots ? (
                              <div className="flex flex-col items-center justify-center py-16">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                  Loading available times
                                </h3>
                                <p className="text-gray-600 text-center max-w-sm">
                                  We're fetching the instructor's available time
                                  slots for you.
                                </p>
                              </div>
                            ) : availableSlots.length > 0 ? (
                              <div className="p-6">
                                {/* Group slots by date */}
                                {(() => {
                                  const groupedSlots = availableSlots.reduce(
                                    (acc, slot) => {
                                      const date = slot.date;
                                      if (!acc[date]) {
                                        acc[date] = [];
                                      }
                                      acc[date].push(slot);
                                      return acc;
                                    },
                                    {} as Record<string, typeof availableSlots>
                                  );

                                  return Object.entries(groupedSlots).map(
                                    ([date, slots]) => (
                                      <div key={date} className="mb-8">
                                        <div className="flex items-center gap-3 mb-4">
                                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                            <Calendar className="w-4 h-4 text-white" />
                                          </div>
                                          <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                              {new Date(
                                                date
                                              ).toLocaleDateString("en-US", {
                                                weekday: "long",
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                              })}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                              {slots.length} available time
                                              {slots.length !== 1 ? "s" : ""}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                          {slots.map((slot, index) => {
                                            const isSelected = Boolean(
                                              selectedTimeSlot &&
                                                (selectedTimeSlot as any)
                                                  .date === slot.date &&
                                                (selectedTimeSlot as any)
                                                  .startTime === slot.startTime
                                            );

                                            return (
                                              <button
                                                key={`${date}-${index}`}
                                                type="button"
                                                onClick={() => {
                                                  handleTimeSlotSelect(slot);
                                                  setShowTimeSlotModal(false);
                                                }}
                                                className={`group relative p-4 text-left rounded-[12px] border-2 transition-all duration-200 ${
                                                  isSelected
                                                    ? "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200"
                                                    : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm"
                                                }`}
                                              >
                                                <div className="flex items-center justify-between">
                                                  <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-gray-900 mb-1">
                                                      {slot.startTime}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                      {slot.endTime}
                                                    </div>
                                                  </div>
                                                  {isSelected && (
                                                    <div className="flex-shrink-0 ml-2">
                                                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                                        <svg
                                                          className="w-3 h-3 text-white"
                                                          fill="currentColor"
                                                          viewBox="0 0 20 20"
                                                        >
                                                          <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                          />
                                                        </svg>
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>

                                                {/* Hover effect overlay */}
                                                <div
                                                  className={`absolute inset-0 rounded-[12px] transition-opacity duration-200 ${
                                                    isSelected
                                                      ? "bg-blue-100 opacity-20"
                                                      : "bg-blue-50 opacity-0 group-hover:opacity-20"
                                                  }`}
                                                />
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )
                                  );
                                })()}
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-16 px-6">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                  <Calendar className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                  No available times
                                </h3>
                                <p className="text-gray-600 text-center max-w-sm mb-6">
                                  There are no available time slots for this
                                  instructor at the moment.
                                </p>
                                <div className="flex gap-3">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      toast.info(
                                        "Please contact support for scheduling assistance"
                                      );
                                    }}
                                    className="text-gray-700 border-gray-300 hover:bg-gray-50"
                                  >
                                    Contact Support
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      router.push("/training/catalog")
                                    }
                                    className="text-gray-700 border-gray-300 hover:bg-gray-50"
                                  >
                                    Browse Other Options
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Footer */}
                          {availableSlots.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                  {selectedTimeSlot ? (
                                    <span className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                      Selected:{" "}
                                      {new Date(
                                        (selectedTimeSlot as any).date
                                      ).toLocaleDateString()}{" "}
                                      at {(selectedTimeSlot as any).startTime}
                                    </span>
                                  ) : (
                                    "Click on a time slot to select it"
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => setShowTimeSlotModal(false)}
                                    className="text-gray-700 border-gray-300 hover:bg-gray-50"
                                  >
                                    Cancel
                                  </Button>
                                  {selectedTimeSlot && (
                                    <Button
                                      onClick={() =>
                                        setShowTimeSlotModal(false)
                                      }
                                      className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                      Confirm Selection
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
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
                    <p className="font-medium text-slate-700">
                      Total Duration:
                    </p>
                    <p className="text-slate-600">
                      {durationInMinutes || "60"} minutes
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">
                      Minutes per Session:
                    </p>
                    <p className="text-slate-600">
                      {minutesPerSession || "60"} minutes
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
