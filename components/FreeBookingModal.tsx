"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { postApiRequest } from "@/lib/apiFetch";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

interface FreeBookingModalProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
}

interface BookingFormData {
  productId: string;
  fullName: string;
  email: string;
  phone: string;
  category: string;
  userType: string;
  preferredDateTime: string;
  notes: string;
}

const CONSULTATION_CATEGORIES = [
  { value: "career_guidance", label: "Career Guidance & Transition" },
  { value: "tech_mentorship", label: "Tech Mentorship & Skill Development" },
  { value: "academic_support", label: "Academic Support & PhD Advisory" },
  { value: "business_strategy", label: "Business Strategy & Entrepreneurship" },
  { value: "ai_governance", label: "AI & Data Governance Consultation" },
];

const USER_TYPES = [
  { value: "student", label: "Student" },
  { value: "tech_professional", label: "Tech Professional" },
  { value: "team_leader", label: "Team Leader" },
  { value: "entrepreneur", label: "Entrepreneur" },
  { value: "researcher", label: "Researcher" },
];

export default function FreeBookingModal({
  open,
  onClose,
  productId,
  productName,
}: FreeBookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [bookingUrl, setBookingUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    productId,
    fullName: "",
    email: "",
    phone: "",
    category: "",
    userType: "",
    preferredDateTime: "",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!formData.category) {
      toast.error("Please select a consultation category");
      return;
    }
    if (!formData.userType) {
      toast.error("Please select your user type");
      return;
    }
    if (!formData.preferredDateTime) {
      toast.error("Please select your preferred date and time");
      return;
    }

    setLoading(true);

    try {
      const response = await postApiRequest<any>("/api/free-booking", formData);

      if (response?.data?.success && response.data?.data?.bookingUrl) {
        setBookingUrl(response.data.data.bookingUrl);
        toast.success("Booking created successfully!");
        // Reset form
        setFormData({
          productId,
          fullName: "",
          email: "",
          phone: "",
          category: "",
          userType: "",
          preferredDateTime: "",
          notes: "",
        });
      } else {
        toast.error("Failed to create booking. Please try again.");
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error(
        error?.message ||
          "An error occurred while creating your booking. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setBookingUrl(null);
    setFormData({
      productId,
      fullName: "",
      email: "",
      phone: "",
      category: "",
      userType: "",
      preferredDateTime: "",
      notes: "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Book Your Free Consultation
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            {productName}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="text-lg font-semibold text-gray-700">
              Please wait for your booking URL
            </p>
            <p className="text-sm text-gray-500">Processing your request...</p>
          </div>
        ) : bookingUrl ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="rounded-full bg-green-100 p-4">
              <svg
                className="h-16 w-16 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-gray-900">
                Booking Created Successfully!
              </h3>
              <p className="text-sm text-gray-600">
                Your free consultation booking is ready. Click the button below
                to schedule your session.
              </p>
            </div>
            <Button
              onClick={() => window.open(bookingUrl, "_blank")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg font-semibold shadow-lg"
              size="lg"
            >
              Click here to book freely
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
                className="w-full"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john.doe@example.com"
                required
                className="w-full"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1234567890"
                required
                className="w-full"
              />
            </div>

            {/* Consultation Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Consultation Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
                required
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CONSULTATION_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* User Type */}
            <div className="space-y-2">
              <Label htmlFor="userType" className="text-sm font-medium">
                User Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.userType}
                onValueChange={(value) =>
                  handleSelectChange("userType", value)
                }
                required
              >
                <SelectTrigger id="userType" className="w-full">
                  <SelectValue placeholder="Select your user type" />
                </SelectTrigger>
                <SelectContent>
                  {USER_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Preferred Date & Time */}
            <div className="space-y-2">
              <Label htmlFor="preferredDateTime" className="text-sm font-medium">
                Preferred Date & Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="preferredDateTime"
                name="preferredDateTime"
                type="datetime-local"
                value={formData.preferredDateTime}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Additional Notes
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="I need help with career transition to tech..."
                rows={4}
                className="w-full resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Submit Booking"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

