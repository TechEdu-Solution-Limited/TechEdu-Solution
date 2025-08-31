"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import {
  Calendar,
  Clock,
  User,
  Users,
  AlertCircle,
  ArrowLeft,
  Save,
  Loader2,
  Edit,
} from "lucide-react";
import { getApiRequest, putApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { toast } from "react-toastify";
import { useRole } from "@/contexts/RoleContext";
import { EditBookingFormSkeleton } from "@/components/BookingSkeletons";
import { BookingEditForm, UserBooking } from "@/types/booking";
import { getPrimaryDateTime } from "@/utils/helpers";

export default function EditBookingPage() {
  const router = useRouter();
  const params = useParams();
  const { userData } = useRole();
  const bookingId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [booking, setBooking] = useState<UserBooking | null>(null);
  const [formData, setFormData] = useState<BookingEditForm>({
    bookingPurpose: "",
    scheduleAt: "",
    endAt: "",
    durationInMinutes: 60,
    participantType: "individual",
    numberOfExpectedParticipants: 1,
    userNotes: "",
    internalNotes: "",
    schedulingStatus: "",
    timezone: "UTC",
    isClassroom: false,
    actualDaysAndTime: [],
    attachments: [],
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [criticalFieldChanged, setCriticalFieldChanged] = useState(false);

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
        setBooking(bookingData);

        // Check if booking can be edited
        if (!canEditBooking(bookingData)) {
          toast.error("This booking cannot be edited");
          router.push("/dashboard/bookings");
          return;
        }

        // Populate form with existing data
        const { start, end } = getPrimaryDateTime(bookingData);
        setFormData({
          bookingPurpose: bookingData.bookingPurpose || "",
          scheduleAt: start ? new Date(start).toISOString().slice(0, 16) : "",
          endAt: end ? new Date(end).toISOString().slice(0, 16) : "",
          durationInMinutes: bookingData.durationInMinutes || 60,
          participantType: bookingData.participantType || "individual",
          numberOfExpectedParticipants:
            bookingData.numberOfExpectedParticipants || 1,
          userNotes: bookingData.userNotes || "",
          internalNotes: bookingData.internalNotes || "",
          schedulingStatus: bookingData.schedulingStatus || "",
          timezone: bookingData.timezone || "UTC",
          isClassroom: bookingData.isClassroom || false,
          actualDaysAndTime: bookingData.actualDaysAndTime || [],
          attachments: bookingData.attachments || [],
        });
      } else {
        toast.error("Failed to fetch booking details");
        router.push("/dashboard/bookings");
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      toast.error("Error fetching booking details");
      router.push("/dashboard/bookings");
    } finally {
      setLoading(false);
    }
  };

  const canEditBooking = (booking: UserBooking) => {
    // Cannot edit if cancelled or completed
    if (booking.status === "cancelled" || booking.status === "completed") {
      return false;
    }

    // Cannot edit if confirmed and less than 24 hours before session
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!booking) return;

    // Show confirmation if critical fields changed
    if (criticalFieldChanged) {
      setShowConfirmation(true);
      return;
    }

    await submitForm();
  };

  const submitForm = async () => {
    if (!booking) return;

    setSaving(true);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      // Calculate end time based on start time and duration
      const startTime = new Date(formData.scheduleAt);
      const endTime = new Date(
        startTime.getTime() + formData.durationInMinutes * 60000
      );

      const updateData = {
        ...formData,
        scheduleAt: startTime.toISOString(),
        endAt: endTime.toISOString(),
      };

      const response = await putApiRequest(
        `/api/bookings/${bookingId}`,
        updateData,
        token
      );

      if (response?.data?.success) {
        toast.success("Booking updated successfully");
        router.push("/dashboard/bookings");
      } else {
        toast.error(response?.data?.message || "Failed to update booking");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Error updating booking");
    } finally {
      setSaving(false);
      setShowConfirmation(false);
    }
  };

  const handleInputChange = (
    field: keyof BookingEditForm,
    value: string | number | boolean
  ) => {
    // Check if critical fields are being changed
    if (
      field === "scheduleAt" ||
      field === "durationInMinutes" ||
      field === "timezone"
    ) {
      setCriticalFieldChanged(true);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <EditBookingFormSkeleton />
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
                  permission to edit it.
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
              Edit Booking
            </h1>
            <p className="text-slate-600">
              Update your booking details for {booking.bookingPurpose}
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

        {/* Booking Status Alert */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-blue-900">
                  Booking Status: {booking.status}
                </h4>
                <p className="text-sm text-blue-700">
                  {booking.status === "pending" &&
                    "Your booking is pending confirmation"}
                  {booking.status === "confirmed" &&
                    "Your booking has been confirmed"}

                  {booking.status === "completed" &&
                    "Your session has been completed"}
                  {booking.status === "cancelled" &&
                    "Your booking has been cancelled"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Booking Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Booking Purpose */}
              <div className="space-y-2">
                <Label htmlFor="bookingPurpose">Booking Purpose</Label>
                <Input
                  id="bookingPurpose"
                  value={formData.bookingPurpose}
                  onChange={(e) =>
                    handleInputChange("bookingPurpose", e.target.value)
                  }
                  placeholder="Describe the purpose of this booking"
                  required
                />
              </div>

              {/* Schedule Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduleAt">Schedule Date & Time</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      id="scheduleAt"
                      type="datetime-local"
                      value={formData.scheduleAt}
                      onChange={(e) =>
                        handleInputChange("scheduleAt", e.target.value)
                      }
                      className="pl-10"
                      required
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="durationInMinutes">Duration (minutes)</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      id="durationInMinutes"
                      type="number"
                      value={formData.durationInMinutes}
                      onChange={(e) =>
                        handleInputChange(
                          "durationInMinutes",
                          parseInt(e.target.value)
                        )
                      }
                      min="30"
                      max="480"
                      step="30"
                      className="pl-10"
                      required
                    />
                  </div>
                  {formData.scheduleAt && formData.durationInMinutes && (
                    <p className="text-xs text-slate-500">
                      Session will end at:{" "}
                      {new Date(
                        new Date(formData.scheduleAt).getTime() +
                          formData.durationInMinutes * 60000
                      ).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>

              {/* Timezone */}
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) =>
                    handleInputChange("timezone", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
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
              </div>

              {/* Participant Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="participantType">Session Type</Label>
                  <Select
                    value={formData.participantType}
                    onValueChange={(value) =>
                      handleInputChange(
                        "participantType",
                        value as
                          | "institution"
                          | "team"
                          | "individual"
                          | "recruiter"
                          | "visitor"
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select session type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">
                        Individual Session
                      </SelectItem>
                      <SelectItem value="team">Team Session</SelectItem>
                      <SelectItem value="institution">Institution</SelectItem>
                      <SelectItem value="recruiter">Recruiter</SelectItem>
                      <SelectItem value="visitor">Visitor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(formData.participantType === "team" ||
                  formData.participantType === "institution") && (
                  <div className="space-y-2">
                    <Label htmlFor="numberOfExpectedParticipants">
                      Number of Participants
                    </Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
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
                        min="2"
                        max="50"
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Scheduling Status */}
              <div className="space-y-2">
                <Label htmlFor="schedulingStatus">Scheduling Status</Label>
                <Select
                  value={formData.schedulingStatus}
                  onValueChange={(value) =>
                    handleInputChange("schedulingStatus", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select scheduling status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awaiting-payment">
                      Awaiting Payment
                    </SelectItem>
                    <SelectItem value="payment-failed">
                      Payment Failed
                    </SelectItem>
                    <SelectItem value="eligible-to-schedule">
                      Ready to Schedule
                    </SelectItem>
                    <SelectItem value="link-issued">Link Issued</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="meeting-created">
                      Meeting Created
                    </SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* User Notes */}
              <div className="space-y-2">
                <Label htmlFor="userNotes">Additional Notes</Label>
                <Textarea
                  id="userNotes"
                  value={formData.userNotes}
                  onChange={(e) =>
                    handleInputChange("userNotes", e.target.value)
                  }
                  placeholder="Any additional requirements or notes for the instructor..."
                  rows={4}
                />
              </div>

              {/* Internal Notes */}
              <div className="space-y-2">
                <Label htmlFor="internalNotes">Internal Notes</Label>
                <Textarea
                  id="internalNotes"
                  value={formData.internalNotes}
                  onChange={(e) =>
                    handleInputChange("internalNotes", e.target.value)
                  }
                  placeholder="Internal notes for staff and administrators..."
                  rows={3}
                />
              </div>

              {/* Attachments */}
              {formData.attachments && formData.attachments.length > 0 && (
                <div className="space-y-3">
                  <Label>Current Attachments</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formData.attachments.map(
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
                  <p className="text-xs text-slate-500">
                    Note: Attachments cannot be modified in this edit form.
                    Contact support if you need to change files.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Booking
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/bookings")}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Confirm Changes
            </h3>
            <p className="text-slate-600 mb-6">
              You're about to change critical booking details (schedule time,
              duration, or timezone). This may affect your instructor and other
              participants. Are you sure you want to continue?
            </p>
            <div className="flex gap-3">
              <Button
                onClick={submitForm}
                disabled={saving}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Yes, Update Booking"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
