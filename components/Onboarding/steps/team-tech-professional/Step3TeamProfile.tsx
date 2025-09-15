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
import { Checkbox } from "@/components/ui/checkbox";

interface Step3TeamProfileProps {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const techStackOptions = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "TypeScript",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "React",
  "Vue.js",
  "Angular",
  "Node.js",
  "Express",
  "Django",
  "Flask",
  "Spring Boot",
  "Laravel",
  "Ruby on Rails",
  "Next.js",
  "Nuxt.js",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Google Cloud",
  "Git",
  "Jenkins",
  "Jira",
  "Figma",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Other",
];

const trainingAvailabilityOptions = ["full-time", "weekends", "custom"];

export function Step3TeamProfile({
  form,
  errors,
  handleChange,
}: Step3TeamProfileProps) {
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

    console.log("Team location change:", field, value, event.target.value);
    handleChange(event);
  };

  const handleTechStackChange = (tech: string, checked: boolean) => {
    const currentTechStack = form.techStack || [];
    const newTechStack = checked
      ? [...currentTechStack, tech]
      : currentTechStack.filter((item: string) => item !== tech);

    const event = {
      target: {
        name: "techStack",
        value: newTechStack,
      },
    } as any;
    handleChange(event);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="teamName"
            className="text-sm font-medium text-gray-700"
          >
            Team Name *
          </Label>
          <Input
            id="teamName"
            name="teamName"
            type="text"
            value={form.teamName}
            onChange={handleChange}
            className={`mt-1 ${
              errors.teamName ? "border-red-500" : "rounded-[10px]"
            }`}
            placeholder="Enter team name"
          />
          {errors.teamName && (
            <p className="text-red-500 text-xs mt-1">{errors.teamName}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="teamSize"
            className="text-sm font-medium text-gray-700"
          >
            Team Size *
          </Label>
          <Input
            id="teamSize"
            name="teamSize"
            type="number"
            min="1"
            value={form.teamSize}
            onChange={handleChange}
            className={`mt-1 ${
              errors.teamSize ? "border-red-500" : "rounded-[10px]"
            }`}
            placeholder="Enter team size"
          />
          {errors.teamSize && (
            <p className="text-red-500 text-xs mt-1">{errors.teamSize}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="contactEmail"
            className="text-sm font-medium text-gray-700"
          >
            Team Contact Email *
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
            placeholder="Enter team contact email"
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
            Team Contact Phone *
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
          Team Location *
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>
        {errors.location && (
          <p className="text-red-500 text-xs mt-1">{errors.location}</p>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Tech Stack * (Select all that apply)
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {techStackOptions.map((tech) => (
            <div key={tech} className="flex items-center space-x-2">
              <Checkbox
                id={`tech-${tech}`}
                checked={form.techStack?.includes(tech) || false}
                onCheckedChange={(checked) =>
                  handleTechStackChange(tech, checked as boolean)
                }
                className="rounded-[5px]"
              />
              <Label htmlFor={`tech-${tech}`} className="text-sm text-gray-700">
                {tech}
              </Label>
            </div>
          ))}
        </div>
        {errors.techStack && (
          <p className="text-red-500 text-xs mt-1">{errors.techStack}</p>
        )}
      </div>

      <div>
        <Label
          htmlFor="trainingAvailability"
          className="text-sm font-medium text-gray-700"
        >
          Training Availability *
        </Label>
        <Select
          value={form.trainingAvailability}
          onValueChange={(value) => {
            const event = {
              target: {
                name: "trainingAvailability",
                value: value,
              },
            } as any;
            handleChange(event);
          }}
        >
          <SelectTrigger
            className={`mt-1 ${
              errors.trainingAvailability ? "border-red-500" : "rounded-[10px]"
            }`}
          >
            <SelectValue placeholder="Select training availability" />
          </SelectTrigger>
          <SelectContent className="rounded-[10px] bg-white">
            {trainingAvailabilityOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.trainingAvailability && (
          <p className="text-red-500 text-xs mt-1">
            {errors.trainingAvailability}
          </p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4">
        <h4 className="font-medium text-blue-900 mb-2">Team Profile</h4>
        <p className="text-sm text-blue-800">
          This information helps us understand your team's composition and
          technical capabilities. It will be used to match your team with
          appropriate training programs and opportunities.
        </p>
      </div>
    </div>
  );
}
