import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    const event = {
      target: {
        name: `location.${field}`,
        value: value,
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
            onChange={handleChange}
            className="mt-1 rounded-[10px]"
            placeholder="https://yourcompany.com"
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

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Company Location *
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Country */}
          <div>
            <Label
              htmlFor="location.country"
              className="text-sm font-medium text-gray-700"
            >
              Country
            </Label>
            <Input
              list="country-options"
              id="location.country"
              name="location.country"
              value={form.location.country}
              onChange={(e) => handleLocationChange("country", e.target.value)}
              placeholder="Select or type a country"
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
              list="state-options"
              id="location.state"
              name="location.state"
              value={form.location.state}
              onChange={(e) => handleLocationChange("state", e.target.value)}
              placeholder="Select or type a state"
              className={`mt-1 ${
                errors.location ? "border-red-500" : "rounded-[10px]"
              }`}
              autoComplete="off"
            />
          </div>

          {/* City */}
          <div>
            <Label
              htmlFor="location.city"
              className="text-sm font-medium text-gray-700"
            >
              City
            </Label>
            <Input
              list="city-options"
              id="location.city"
              name="location.city"
              value={form.location.city}
              onChange={(e) => handleLocationChange("city", e.target.value)}
              placeholder="Select or type a city"
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
