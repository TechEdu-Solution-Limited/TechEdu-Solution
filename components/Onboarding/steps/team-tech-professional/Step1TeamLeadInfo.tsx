import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Step1TeamLeadInfoProps {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

export function Step1TeamLeadInfo({
  form,
  errors,
  handleChange,
}: Step1TeamLeadInfoProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="fullName"
            className="text-sm font-medium text-gray-700"
          >
            Full Name *
          </Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            value={form.fullName}
            onChange={handleChange}
            className={`mt-1 ${
              errors.fullName ? "border-red-500" : "rounded-[10px]"
            }`}
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
            Gender *
          </Label>
          <select
            id="gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.gender ? "border-red-500" : ""
            }`}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="dateOfBirth"
            className="text-sm font-medium text-gray-700"
          >
            Date of Birth *
          </Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange}
            className={`mt-1 ${
              errors.dateOfBirth ? "border-red-500" : "rounded-[10px]"
            }`}
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="nationality"
            className="text-sm font-medium text-gray-700"
          >
            Nationality *
          </Label>
          <Input
            id="nationality"
            name="nationality"
            type="text"
            value={form.nationality}
            onChange={handleChange}
            className={`mt-1 ${
              errors.nationality ? "border-red-500" : "rounded-[10px]"
            }`}
            placeholder="Enter your nationality"
          />
          {errors.nationality && (
            <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="currentLocation"
            className="text-sm font-medium text-gray-700"
          >
            Current Location *
          </Label>
          <Input
            id="currentLocation"
            name="currentLocation"
            type="text"
            value={form.currentLocation}
            onChange={handleChange}
            className={`mt-1 ${
              errors.currentLocation ? "border-red-500" : "rounded-[10px]"
            }`}
            placeholder="e.g., Lagos, Nigeria"
          />
          {errors.currentLocation && (
            <p className="text-red-500 text-xs mt-1">
              {errors.currentLocation}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="linkedIn"
            className="text-sm font-medium text-gray-700"
          >
            LinkedIn Profile
          </Label>
          <Input
            id="linkedIn"
            name="linkedIn"
            type="url"
            value={form.linkedIn}
            onChange={handleChange}
            className="mt-1 rounded-[10px]"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        <div>
          <Label htmlFor="github" className="text-sm font-medium text-gray-700">
            GitHub Profile
          </Label>
          <Input
            id="github"
            name="github"
            type="url"
            value={form.github}
            onChange={handleChange}
            className="mt-1 rounded-[10px]"
            placeholder="https://github.com/yourusername"
          />
        </div>

        <div>
          <Label
            htmlFor="portfolioUrl"
            className="text-sm font-medium text-gray-700"
          >
            Portfolio Website
          </Label>
          <Input
            id="portfolioUrl"
            name="portfolioUrl"
            type="url"
            value={form.portfolioUrl}
            onChange={handleChange}
            className="mt-1 rounded-[10px]"
            placeholder="https://yourportfolio.com"
          />
        </div>

        <div>
          <Label
            htmlFor="highestQualification"
            className="text-sm font-medium text-gray-700"
          >
            Highest Qualification *
          </Label>
          <select
            id="highestQualification"
            name="highestQualification"
            value={form.highestQualification}
            onChange={handleChange}
            className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.highestQualification ? "border-red-500" : ""
            }`}
          >
            <option value="">Select qualification</option>
            <option value="High School">High School</option>
            <option value="Diploma">Diploma</option>
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Master's Degree">Master's Degree</option>
            <option value="PhD">PhD</option>
            <option value="Professional Certificate">
              Professional Certificate
            </option>
          </select>
          {errors.highestQualification && (
            <p className="text-red-500 text-xs mt-1">
              {errors.highestQualification}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="fieldOfStudy"
            className="text-sm font-medium text-gray-700"
          >
            Field of Study *
          </Label>
          <Input
            id="fieldOfStudy"
            name="fieldOfStudy"
            type="text"
            value={form.fieldOfStudy}
            onChange={handleChange}
            className={`mt-1 ${
              errors.fieldOfStudy ? "border-red-500" : "rounded-[10px]"
            }`}
            placeholder="e.g., Computer Science, Software Engineering"
          />
          {errors.fieldOfStudy && (
            <p className="text-red-500 text-xs mt-1">{errors.fieldOfStudy}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="graduationYear"
            className="text-sm font-medium text-gray-700"
          >
            Graduation Year *
          </Label>
          <Input
            id="graduationYear"
            name="graduationYear"
            type="text"
            value={form.graduationYear}
            onChange={handleChange}
            className={`mt-1 ${
              errors.graduationYear ? "border-red-500" : "rounded-[10px]"
            }`}
            placeholder="e.g., 2020"
          />
          {errors.graduationYear && (
            <p className="text-red-500 text-xs mt-1">{errors.graduationYear}</p>
          )}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Certifications (Select all that apply)
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            "AWS Certified Solutions Architect",
            "Microsoft Azure Fundamentals",
            "Google Cloud Professional",
            "Cisco CCNA",
            "CompTIA Security+",
            "PMP (Project Management Professional)",
            "Scrum Master",
            "ITIL Foundation",
            "Other",
          ].map((cert) => (
            <div key={cert} className="flex items-center space-x-2">
              <Checkbox
                id={`cert-${cert}`}
                checked={form.certifications?.includes(cert) || false}
                onCheckedChange={(checked) => {
                  const currentCerts = form.certifications || [];
                  const newCerts = checked
                    ? [...currentCerts, cert]
                    : currentCerts.filter((item: string) => item !== cert);

                  const event = {
                    target: {
                      name: "certifications",
                      value: newCerts,
                    },
                  } as any;
                  handleChange(event);
                }}
                className="rounded-[5px]"
              />
              <Label htmlFor={`cert-${cert}`} className="text-sm text-gray-700">
                {cert}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4">
        <h4 className="font-medium text-blue-900 mb-2">
          Team Lead Information
        </h4>
        <p className="text-sm text-blue-800">
          This information will be used to identify the primary contact person
          for your team. The team lead will be responsible for managing team
          activities and communications.
        </p>
      </div>
    </div>
  );
}
