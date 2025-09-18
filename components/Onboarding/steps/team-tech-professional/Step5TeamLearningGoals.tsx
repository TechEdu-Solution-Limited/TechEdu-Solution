import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface Step5TeamLearningGoalsProps {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const goalTypes = [
  { label: "Specific Training", value: "specific_training" },
  {
    label: "Roadmap Upskill",
    value: "roadmap_upskill",
  },
  {
    label: "Custom",
    value: "custom",
  },
];

const priorityAreas = [
  "Cloud Computing",
  "DevOps",
  "Data Science",
  "Machine Learning",
  "Cybersecurity",
  "Mobile Development",
  "Web Development",
  "UI/UX Design",
  "Database Management",
  "API Development",
  "Microservices",
  "Blockchain",
  "IoT",
  "AI/ML",
  "Big Data",
  "Software Architecture",
  "Testing & QA",
  "Agile & Scrum",
  "Product Management",
  "Business Analysis",
];

const trainingTimelines = [
  "Q1 2025",
  "Q2 2025",
  "Q3 2025",
  "Q4 2025",
  "Q1 2026",
  "Q2 2026",
  "Q3 2026",
  "Q4 2026",
  "Immediate",
  "Within 3 months",
  "Within 6 months",
  "Within 1 year",
  "Flexible",
];

const trainingAvailabilityOptions = ["full-time", "weekends", "custom"];

export function Step5TeamLearningGoals({
  form,
  errors,
  handleChange,
}: Step5TeamLearningGoalsProps) {
  const handlePriorityAreasChange = (area: string, checked: boolean) => {
    const currentAreas = form.priorityAreas || [];
    const newAreas = checked
      ? [...currentAreas, area]
      : currentAreas.filter((item: string) => item !== area);

    const event = {
      target: {
        name: "priorityAreas",
        value: newAreas,
      },
    } as any;
    handleChange(event);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4">
        <h4 className="font-medium text-blue-900 mb-2">Team Learning Goals</h4>
        <p className="text-sm text-blue-800">
          Define your team's learning objectives and priorities. This
          information will help us customize training programs and resources
          that align with your team's goals.
        </p>
      </div>

      <div>
        <Label htmlFor="goalType" className="text-sm font-medium text-gray-700">
          Primary Goal Type *
        </Label>
        <Select
          value={form.goalType || ""}
          onValueChange={(value) => {
            const event = {
              target: {
                name: "goalType",
                value: value,
              },
            } as any;
            handleChange(event);
          }}
        >
          <SelectTrigger
            className={`mt-1 rounded-[10px] ${
              errors.goalType ? "border-red-500" : ""
            }`}
          >
            <SelectValue placeholder="Select primary goal type" />
          </SelectTrigger>
          <SelectContent className="rounded-[10px] bg-white">
            {goalTypes.map((goal) => (
              <SelectItem key={goal.value} value={goal.value}>
                {goal.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.goalType && (
          <p className="text-red-500 text-xs mt-1">{errors.goalType}</p>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Priority Learning Areas * (Select all that apply)
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {priorityAreas.map((area) => (
            <div key={area} className="flex items-center space-x-2">
              <Checkbox
                id={`priority-${area}`}
                checked={form.priorityAreas?.includes(area) || false}
                onCheckedChange={(checked) =>
                  handlePriorityAreasChange(area, checked as boolean)
                }
                className="rounded-[5px]"
              />
              <Label
                htmlFor={`priority-${area}`}
                className="text-sm text-gray-700"
              >
                {area}
              </Label>
            </div>
          ))}
        </div>
        {errors.priorityAreas && (
          <p className="text-red-500 text-xs mt-1">{errors.priorityAreas}</p>
        )}
      </div>

      <div>
        <Label
          htmlFor="trainingTimeline"
          className="text-sm font-medium text-gray-700"
        >
          Training Timeline *
        </Label>
        <Select
          value={form.trainingTimeline || ""}
          onValueChange={(value) => {
            const event = {
              target: {
                name: "trainingTimeline",
                value: value,
              },
            } as any;
            handleChange(event);
          }}
        >
          <SelectTrigger
            className={`mt-1 rounded-[10px] ${
              errors.trainingTimeline ? "border-red-500" : ""
            }`}
          >
            <SelectValue placeholder="Select training timeline" />
          </SelectTrigger>
          <SelectContent className="rounded-[10px] bg-white">
            {trainingTimelines.map((timeline) => (
              <SelectItem key={timeline} value={timeline}>
                {timeline}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.trainingTimeline && (
          <p className="text-red-500 text-xs mt-1">{errors.trainingTimeline}</p>
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
            className={`mt-1 rounded-[10px] ${
              errors.trainingAvailability ? "border-red-500" : ""
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="bg-green-50 border border-green-200 rounded-[10px] p-4">
        <h4 className="font-medium text-green-900 mb-2">Learning Benefits</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Customized training programs tailored to your team's needs</li>
          <li>• Access to industry experts and mentors</li>
          <li>• Hands-on projects and real-world applications</li>
          <li>• Certification opportunities and career advancement</li>
          <li>• Networking with other tech professionals</li>
          <li>• Continuous learning and skill development</li>
        </ul>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-[10px] p-4">
        <h4 className="font-medium text-yellow-900 mb-2">Next Steps</h4>
        <p className="text-sm text-yellow-800">
          After completing this onboarding, our team will review your
          information and create a personalized learning plan for your team.
          You'll receive detailed recommendations and access to relevant
          training resources.
        </p>
      </div>
    </div>
  );
}
