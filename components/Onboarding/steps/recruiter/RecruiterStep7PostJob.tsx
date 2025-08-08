import React from "react";
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
import { Checkbox } from "@/components/ui/checkbox";

interface Step7FormValues {
  jobTitle: string;
  jobDescription: string;
  employmentType: string;
  location: string;
  salaryRange: string;
  requiredSkills: string[]; // if not used directly in this component, it's fine to keep it here for validation or preview
  tags: string[]; // same as above
  skipForNow: boolean;
  tagsInput: string; // Added for quick fix
}

interface RecruiterStep7PostJobProps {
  form: Step7FormValues;
  errors: { [key: string]: string };
  handleChange: (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | {
          target: {
            name: keyof Step7FormValues;
            value: any;
            type?: string;
            checked?: boolean;
          };
        }
  ) => void;
}

const employmentTypes = [
  "full-time",
  // "part-time",
  "contract",
  "freelance",
  "internship",
];

export default function RecruiterStep7PostJob({
  form,
  errors,
  handleChange,
}: RecruiterStep7PostJobProps) {
  const handleCheckboxChange = (checked: boolean) => {
    handleChange({
      target: { name: "skipForNow", type: "checkbox", checked },
    } as any);
  };

  const triggerChange = <K extends keyof Step7FormValues>(
    name: K,
    value: Step7FormValues[K]
  ) =>
    handleChange({
      target: { name, value },
    });
  console.log("Submitting data:", form.requiredSkills, form.tags);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="skipForNow"
            checked={form.skipForNow || false}
            onCheckedChange={handleCheckboxChange}
            className="mt-1 rounded-[5px]"
          />
          <div>
            <Label
              htmlFor="skipForNow"
              className="text-sm font-normal cursor-pointer"
            >
              Skip job posting for now
            </Label>
            <p className="text-xs text-gray-600 mt-1">
              You can create job postings later from your dashboard
            </p>
          </div>
        </div>
      </div>

      {!form.skipForNow && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                value={form.jobTitle}
                onChange={handleChange}
                placeholder="e.g., Senior Backend Engineer"
                className={
                  errors.jobTitle ? "border-red-500" : "rounded-[10px]"
                }
              />
              {errors.jobTitle && (
                <p className="text-red-500 text-sm">{errors.jobTitle}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type *</Label>
              <Select
                name="employmentType"
                value={form.employmentType}
                onValueChange={(value) =>
                  triggerChange("employmentType", value)
                }
              >
                <SelectTrigger
                  className={
                    errors.employmentType ? "border-red-500" : "rounded-[10px]"
                  }
                >
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent className="rounded-[10px] bg-white">
                  {employmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() +
                        type.slice(1).replace("-", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.employmentType && (
                <p className="text-red-500 text-sm">{errors.employmentType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="requiredSkills">Required Skills *</Label>
              <Input
                id="requiredSkills"
                name="requiredSkills"
                placeholder="e.g., React, Node.js, PostgreSQL"
                value={form.requiredSkills?.join(", ") || ""}
                onChange={(e) => {
                  const skillsArray = e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s);
                  handleChange({
                    target: { name: "requiredSkills", value: skillsArray },
                  });
                }}
                className={
                  errors.requiredSkills ? "border-red-500" : "rounded-[10px]"
                }
              />
              {errors.requiredSkills && (
                <p className="text-red-500 text-sm">{errors.requiredSkills}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags *</Label>
              <Input
                id="tags"
                name="tags"
                placeholder="e.g., Full-time, Remote, Fintech"
                value={form.tagsInput || ""}
                onChange={(e) => {
                  handleChange({
                    target: { name: "tagsInput", value: e.target.value },
                  });
                }}
                onBlur={(e) => {
                  const tagsArray = e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter((t) => t);
                  handleChange({
                    target: { name: "tags", value: tagsArray },
                  });
                }}
                className={errors.tags ? "border-red-500" : "rounded-[10px]"}
              />
              {errors.tags && (
                <p className="text-red-500 text-sm">{errors.tags}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g., Lagos, Nigeria or Remote"
                className={
                  errors.location ? "border-red-500" : "rounded-[10px]"
                }
              />
              {errors.location && (
                <p className="text-red-500 text-sm">{errors.location}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryRange">Salary Range</Label>
              <Input
                id="salaryRange"
                name="salaryRange"
                value={form.salaryRange}
                onChange={handleChange}
                placeholder="e.g., 50000-80000 USD"
                className="rounded-[10px]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description *</Label>
            <Textarea
              id="jobDescription"
              name="jobDescription"
              value={form.jobDescription}
              onChange={handleChange}
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={6}
              className={
                errors.jobDescription ? "border-red-500" : "rounded-[10px]"
              }
            />
            {errors.jobDescription && (
              <p className="text-red-500 text-sm">{errors.jobDescription}</p>
            )}
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-[10px]">
        <h4 className="font-semibold text-blue-900 mb-2">
          Job posting benefits:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Reach qualified candidates in your focus areas</li>
          <li>• AI-powered candidate matching</li>
          <li>• Application management tools</li>
          <li>• Analytics and performance tracking</li>
        </ul>
      </div>

      <div className="bg-green-50 p-4 rounded-[10px]">
        <h4 className="font-semibold text-green-900 mb-2">
          Tips for a great job posting:
        </h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Be specific about requirements and responsibilities</li>
          <li>• Include salary range to attract the right candidates</li>
          <li>• Mention company culture and benefits</li>
          <li>• Use clear, professional language</li>
        </ul>
      </div>
    </div>
  );
}
