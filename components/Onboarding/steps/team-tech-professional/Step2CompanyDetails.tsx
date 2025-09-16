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

  const handleContactPersonChange = (field: string, value: string) => {
    // Ensure contactPerson object exists
    const currentContactPerson = form.contactPerson || {};

    // Create a synthetic event that properly handles nested objects
    const event = {
      target: {
        name: "contactPerson",
        value: {
          ...currentContactPerson,
          [field]: value,
        },
      },
    } as any;

    console.log("Contact person change:", field, value, event.target.value);
    handleChange(event);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4">
        <h4 className="font-medium text-blue-900 mb-2">Company Selection</h4>
        <p className="text-sm text-blue-800">
          Select an existing company from our database or provide company
          details to create a new company profile.
        </p>
      </div>

      <div>
        <Label
          htmlFor="companyId"
          className="text-sm font-medium text-gray-700"
        >
          Company *
        </Label>
        <select
          id="companyId"
          name="companyId"
          value={form.companyId}
          onChange={handleChange}
          className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.companyId ? "border-red-500" : ""
          }`}
        >
          <option value="">Select a company</option>
          <option value="new">Create new company</option>
          {/* TODO: Add dynamic company list from API */}
        </select>
        {errors.companyId && (
          <p className="text-red-500 text-xs mt-1">{errors.companyId}</p>
        )}
      </div>

      {form.companyId === "new" && (
        <div className="space-y-4 p-4 border border-gray-200 rounded-[10px] bg-gray-50">
          <h5 className="font-medium text-gray-900">New Company Details</h5>
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
                value={form.companyName || ""}
                onChange={handleChange}
                className="mt-1 rounded-[10px]"
                placeholder="Enter company name"
              />
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
                value={form.rcNumber || ""}
                onChange={handleChange}
                className="mt-1 rounded-[10px]"
                placeholder="Enter RC number"
              />
            </div>

            <div>
              <Label
                htmlFor="companyType"
                className="text-sm font-medium text-gray-700"
              >
                Company Type *
              </Label>
              <Select
                value={form.companyType || ""}
                onValueChange={(value) => {
                  const event = {
                    target: {
                      name: "companyType",
                      value: value,
                    },
                  } as any;
                  handleChange(event);
                }}
              >
                <SelectTrigger className="mt-1 rounded-[10px]">
                  <SelectValue placeholder="Select company type" />
                </SelectTrigger>
                <SelectContent className="rounded-[10px] bg-white">
                  <SelectItem value="tech_professional">
                    Tech Professional
                  </SelectItem>
                  <SelectItem value="recruiter">Recruiter</SelectItem>
                  <SelectItem value="institution">Institution</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor="industry"
                className="text-sm font-medium text-gray-700"
              >
                Industry *
              </Label>
              <Select
                value={form.industry || ""}
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
                <SelectTrigger className="mt-1 rounded-[10px]">
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
                value={form.website || ""}
                onChange={handleChange}
                className="mt-1 rounded-[10px]"
                placeholder="yourcompany.com"
              />
            </div>

            <div>
              <Label
                htmlFor="companyLinkedIn"
                className="text-sm font-medium text-gray-700"
              >
                LinkedIn
              </Label>
              <Input
                id="companyLinkedIn"
                name="companyLinkedIn"
                type="url"
                value={form.companyLinkedIn || ""}
                onChange={handleChange}
                className="mt-1 rounded-[10px]"
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>

            <div>
              <Label
                htmlFor="contactPerson.name"
                className="text-sm font-medium text-gray-700"
              >
                Contact Person Name
              </Label>
              <Input
                id="contactPerson.name"
                name="contactPerson.name"
                type="text"
                value={form.contactPerson?.name || ""}
                onChange={(e) =>
                  handleContactPersonChange("name", e.target.value)
                }
                className="mt-1 rounded-[10px]"
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label
                htmlFor="contactPerson.email"
                className="text-sm font-medium text-gray-700"
              >
                Contact Email *
              </Label>
              <Input
                id="contactPerson.email"
                name="contactPerson.email"
                type="email"
                value={form.contactPerson?.email || ""}
                onChange={(e) =>
                  handleContactPersonChange("email", e.target.value)
                }
                className="mt-1 rounded-[10px]"
                placeholder="info@company.com"
              />
            </div>

            <div>
              <Label
                htmlFor="contactPerson.phone"
                className="text-sm font-medium text-gray-700"
              >
                Contact Phone *
              </Label>
              <Input
                id="contactPerson.phone"
                name="contactPerson.phone"
                type="tel"
                value={form.contactPerson?.phone || ""}
                onChange={(e) =>
                  handleContactPersonChange("phone", e.target.value)
                }
                className="mt-1 rounded-[10px]"
                placeholder="+2348012345678"
              />
            </div>

            <div>
              <Label
                htmlFor="contactPerson.jobTitle"
                className="text-sm font-medium text-gray-700"
              >
                Job Title
              </Label>
              <Input
                id="contactPerson.jobTitle"
                name="contactPerson.jobTitle"
                type="text"
                value={form.contactPerson?.jobTitle || ""}
                onChange={(e) =>
                  handleContactPersonChange("jobTitle", e.target.value)
                }
                className="mt-1 rounded-[10px]"
                placeholder="HR Manager"
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Company Location *
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label
              htmlFor="location.country"
              className="text-sm font-medium text-gray-700"
            >
              Country *
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

          <div>
            <Label
              htmlFor="location.state"
              className="text-sm font-medium text-gray-700"
            >
              State *
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

          <div>
            <Label
              htmlFor="location.city"
              className="text-sm font-medium text-gray-700"
            >
              City *
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
        </div>
        {errors.location && (
          <p className="text-red-500 text-xs mt-1">{errors.location}</p>
        )}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-[10px] p-4">
        <h4 className="font-medium text-green-900 mb-2">Company Information</h4>
        <p className="text-sm text-green-800">
          This information will be used to connect your team with the
          appropriate company profile and ensure proper verification.
        </p>
      </div>
    </div>
  );
}
