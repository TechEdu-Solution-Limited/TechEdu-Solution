import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadAssetImage } from "@/lib/firebase";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "react-toastify";

interface Step2CompanyDetailsProps {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const industries = [
  "Technology",
  "Fintech",
  "Healthtech",
  "E-commerce",
  "Edtech",
  "SaaS",
  "Gaming",
  "AI/ML",
  "IoT",
  "Blockchain",
  "Other",
];

export function Step2CompanyDetails({
  form,
  errors,
  handleChange,
}: Step2CompanyDetailsProps) {
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    form.logoUrl || null
  );

  const handleLocationChange = (field: string, value: string) => {
    // Ensure location object exists
    const currentLocation = form.location || {};

    // Create a synthetic event that properly handles nested objects
    const event = {
      target: {
        name: "location",
        value: {
          ...currentLocation,
          [field]: value,
        },
      },
    } as any;

    console.log("Location change:", field, value, event.target.value);
    handleChange(event);
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.trim();

    // Normalize website URL
    if (
      value &&
      !value.startsWith("http://") &&
      !value.startsWith("https://")
    ) {
      // If it starts with www., add https://
      if (value.startsWith("www.")) {
        value = `https://${value}`;
      } else {
        // Otherwise, add https://
        value = `https://${value}`;
      }
    }

    const event = {
      target: {
        name: "website",
        value: value,
      },
    } as any;
    handleChange(event);
  };

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploadingLogo(true);
    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);

      // Upload to Firebase
      const downloadURL = await uploadAssetImage(file, "company-logos");

      // Update form with the uploaded URL
      const event = {
        target: {
          name: "logoUrl",
          value: downloadURL,
        },
      } as any;
      handleChange(event);

      toast.success("Company logo uploaded successfully");
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo. Please try again.");
      setLogoPreview(null);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    const event = {
      target: {
        name: "logoUrl",
        value: "",
      },
    } as any;
    handleChange(event);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="companyName"
            className="text-sm font-medium text-gray-700"
          >
            Company Name *
          </Label>
          <Input
            id="companyName"
            name="companyName"
            type="text"
            value={form.companyName}
            onChange={handleChange}
            className={`mt-1 ${
              errors.companyName ? "border-red-500" : "rounded-[10px]"
            }`}
            placeholder="Enter company name"
          />
          {errors.companyName && (
            <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="rcNumber"
            className="text-sm font-medium text-gray-700"
          >
            RC Number *
          </Label>
          <Input
            id="rcNumber"
            name="rcNumber"
            type="text"
            value={form.rcNumber}
            onChange={handleChange}
            className={`mt-1 ${
              errors.rcNumber ? "border-red-500" : "rounded-[10px]"
            }`}
            placeholder="Enter RC number"
          />
          {errors.rcNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.rcNumber}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="industry"
            className="text-sm font-medium text-gray-700"
          >
            Industry *
          </Label>
          <Select
            value={form.industry}
            onValueChange={(value) => {
              const event = {
                target: {
                  name: "industry",
                  value: value,
                },
              } as any;
              handleChange(event);
            }}
          >
            <SelectTrigger
              className={`mt-1 ${
                errors.industry ? "border-red-500" : "rounded-[10px]"
              }`}
            >
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent className="rounded-[10px] bg-white">
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.industry && (
            <p className="text-red-500 text-xs mt-1">{errors.industry}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="website"
            className="text-sm font-medium text-gray-700"
          >
            Website
          </Label>
          <Input
            id="website"
            name="website"
            type="url"
            value={form.website}
            onChange={handleWebsiteChange}
            className="mt-1 rounded-[10px]"
            placeholder="yourcompany.com or www.yourcompany.com"
          />
        </div>

        <div>
          <Label
            htmlFor="contactEmail"
            className="text-sm font-medium text-gray-700"
          >
            Contact Email *
          </Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={form.contactEmail}
            onChange={handleChange}
            className={`mt-1 ${
              errors.contactEmail ? "border-red-500" : "rounded-[10px]"
            }`}
            placeholder="Enter contact email"
          />
          {errors.contactEmail && (
            <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="contactPhone"
            className="text-sm font-medium text-gray-700"
          >
            Contact Phone *
          </Label>
          <Input
            id="contactPhone"
            name="contactPhone"
            type="tel"
            value={form.contactPhone}
            onChange={handleChange}
            className={`mt-1 ${
              errors.contactPhone ? "border-red-500" : "rounded-[10px]"
            }`}
            placeholder="+2348012345678"
          />
          {errors.contactPhone && (
            <p className="text-red-500 text-xs mt-1">{errors.contactPhone}</p>
          )}
        </div>
      </div>

      {/* Company Logo Upload */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Company Logo
        </Label>
        <div className="flex items-center gap-4">
          {/* Logo Preview */}
          {logoPreview && (
            <div className="relative">
              <img
                src={logoPreview}
                alt="Company logo preview"
                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={removeLogo}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Upload Button */}
          <div className="flex-1">
            <input
              type="file"
              id="logoUpload"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
              disabled={isUploadingLogo}
            />
            <label
              htmlFor="logoUpload"
              className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                isUploadingLogo ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isUploadingLogo ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    {logoPreview ? "Change Logo" : "Upload Company Logo"}
                  </span>
                </>
              )}
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 200x200px, max 5MB. Supports JPG, PNG, GIF
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Company Location *
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* City */}
          <div>
            <Label
              htmlFor="location.city"
              className="text-sm font-medium text-gray-700"
            >
              City
            </Label>
            <Input
              id="location.city"
              name="location.city"
              value={form.location?.city || ""}
              onChange={(e) => handleLocationChange("city", e.target.value)}
              placeholder="Enter city name"
              className={`mt-1 ${
                errors.location ? "border-red-500" : "rounded-[10px]"
              }`}
              autoComplete="off"
            />
          </div>

          {/* State */}
          <div>
            <Label
              htmlFor="location.state"
              className="text-sm font-medium text-gray-700"
            >
              State
            </Label>
            <Input
              id="location.state"
              name="location.state"
              value={form.location?.state || ""}
              onChange={(e) => handleLocationChange("state", e.target.value)}
              placeholder="Enter state name"
              className={`mt-1 ${
                errors.location ? "border-red-500" : "rounded-[10px]"
              }`}
              autoComplete="off"
            />
          </div>

          {/* Country */}
          <div>
            <Label
              htmlFor="location.country"
              className="text-sm font-medium text-gray-700"
            >
              Country
            </Label>
            <Input
              id="location.country"
              name="location.country"
              value={form.location?.country || ""}
              onChange={(e) => handleLocationChange("country", e.target.value)}
              placeholder="Enter country name"
              className={`mt-1 ${
                errors.location ? "border-red-500" : "rounded-[10px]"
              }`}
              autoComplete="off"
            />
          </div>
        </div>
        {errors.location && (
          <p className="text-red-500 text-xs mt-1">{errors.location}</p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4">
        <h4 className="font-medium text-blue-900 mb-2">Company Information</h4>
        <p className="text-sm text-blue-800">
          Please provide accurate company details. This information will be used
          for verification and to connect your team with relevant opportunities
          and resources.
        </p>
      </div>
    </div>
  );
}
