"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Users,
  MapPin,
  Code,
  Briefcase,
  GraduationCap,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { postApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { toast } from "react-toastify";
import { safeConsole } from "@/lib/console";

interface TeamFormData {
  teamName: string;
  teamSize: number;
  location: {
    country: string;
    state: string;
    city: string;
  };
  primarySpecialization: string;
  programmingLanguages: string[];
  frameworksAndTools: string[];
  softSkills: string[];
  preferredTechStack: string[];
  experienceLevel: string;
  currentJobTitle: string;
  yearsOfExperience: number;
  industryFocus: string;
  employmentStatus: string;
  remoteWorkExperience: boolean;
  trainingAvailability: string;
  contactEmail: string;
  contactPhone: string;
  lookingForJobs: boolean;
  interestedInTraining: boolean;
}

const initialFormData: TeamFormData = {
  teamName: "",
  teamSize: 1,
  location: {
    country: "",
    state: "",
    city: "",
  },
  primarySpecialization: "",
  programmingLanguages: [],
  frameworksAndTools: [],
  softSkills: [],
  preferredTechStack: [],
  experienceLevel: "",
  currentJobTitle: "",
  yearsOfExperience: 0,
  industryFocus: "",
  employmentStatus: "",
  remoteWorkExperience: false,
  trainingAvailability: "",
  contactEmail: "",
  contactPhone: "",
  lookingForJobs: true,
  interestedInTraining: true,
};

const programmingLanguages = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C#",
  "C++",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "Dart",
  "R",
  "MATLAB",
  "Scala",
  "Perl",
  "Haskell",
  "Clojure",
  "Elixir",
  "Erlang",
  "F#",
  "OCaml",
  "Lua",
];

const frameworksAndTools = [
  "React",
  "Vue.js",
  "Angular",
  "Node.js",
  "Express",
  "Next.js",
  "Nuxt.js",
  "Django",
  "Flask",
  "FastAPI",
  "Spring Boot",
  "Laravel",
  "Symfony",
  "Rails",
  "ASP.NET",
  "Gin",
  "Fiber",
  "Echo",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "Elasticsearch",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
  "Firebase",
  "Supabase",
  "Prisma",
  "TypeORM",
  "Sequelize",
  "Mongoose",
];

const softSkills = [
  "Communication",
  "Leadership",
  "Problem Solving",
  "Critical Thinking",
  "Teamwork",
  "Time Management",
  "Adaptability",
  "Creativity",
  "Emotional Intelligence",
  "Negotiation",
  "Presentation",
  "Mentoring",
  "Project Management",
  "Strategic Thinking",
  "Decision Making",
  "Conflict Resolution",
  "Active Listening",
  "Empathy",
];

const preferredTechStacks = [
  "MERN Stack",
  "MEAN Stack",
  "LAMP Stack",
  "Django/PostgreSQL",
  "Ruby on Rails",
  "Spring Boot/MySQL",
  "ASP.NET/SQL Server",
  "Vue.js/Node.js",
  "Angular/Java",
  "React Native",
  "Flutter",
  "Xamarin",
  "Ionic",
  "Cordova",
  "Electron",
  "Next.js/TypeScript",
  "Nuxt.js/Vue",
  "Svelte/SvelteKit",
  "Solid.js",
];

const experienceLevels = [
  "Entry Level",
  "Junior",
  "Mid-Level",
  "Senior",
  "Lead",
  "Principal",
  "Architect",
];

const industryFocuses = [
  "Technology",
  "Healthcare",
  "Finance",
  "E-commerce",
  "Education",
  "Gaming",
  "Media & Entertainment",
  "Manufacturing",
  "Retail",
  "Real Estate",
  "Travel",
  "Automotive",
  "Aerospace",
  "Energy",
  "Government",
  "Non-profit",
  "Consulting",
];

const employmentStatuses = [
  "Employed",
  "Freelancer",
  "Contractor",
  "Unemployed",
  "Student",
  "Retired",
];

const trainingAvailabilityOptions = [
  "full-time",
  "part-time",
  "weekends",
  "evenings",
  "flexible",
  "custom",
];

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Australia",
  "New Zealand",
  "Japan",
  "South Korea",
  "Singapore",
  "India",
  "Brazil",
  "Mexico",
  "Argentina",
  "Chile",
  "South Africa",
  "Nigeria",
  "Kenya",
  "Ghana",
  "Egypt",
  "Morocco",
  "Tunisia",
  "Algeria",
];

export default function CreateTeamPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<TeamFormData>(initialFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as any;

    if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value,
        },
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleArrayChange = (
    field: keyof TeamFormData,
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter((item) => item !== value),
    }));

    // Clear error when user makes selection
    if (errors[field as string]) {
      setErrors((prev) => ({ ...prev, [field as string]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.teamName.trim())
        newErrors.teamName = "Team name is required";
      if (formData.teamSize < 1)
        newErrors.teamSize = "Team size must be at least 1";
      if (!formData.location.country) newErrors.country = "Country is required";
      if (!formData.location.state) newErrors.state = "State is required";
      if (!formData.location.city) newErrors.city = "City is required";
      if (!formData.primarySpecialization)
        newErrors.primarySpecialization = "Primary specialization is required";
    }

    if (step === 2) {
      if (formData.programmingLanguages.length === 0)
        newErrors.programmingLanguages =
          "Select at least one programming language";
      if (formData.frameworksAndTools.length === 0)
        newErrors.frameworksAndTools = "Select at least one framework or tool";
      if (formData.softSkills.length === 0)
        newErrors.softSkills = "Select at least one soft skill";
      if (formData.preferredTechStack.length === 0)
        newErrors.preferredTechStack =
          "Select at least one preferred tech stack";
    }

    if (step === 3) {
      if (!formData.experienceLevel)
        newErrors.experienceLevel = "Experience level is required";
      if (!formData.currentJobTitle.trim())
        newErrors.currentJobTitle = "Current job title is required";
      if (formData.yearsOfExperience < 0)
        newErrors.yearsOfExperience =
          "Years of experience must be 0 or greater";
      if (!formData.industryFocus)
        newErrors.industryFocus = "Industry focus is required";
      if (!formData.employmentStatus)
        newErrors.employmentStatus = "Employment status is required";
    }

    if (step === 4) {
      if (!formData.trainingAvailability)
        newErrors.trainingAvailability = "Training availability is required";
      if (!formData.contactEmail.trim())
        newErrors.contactEmail = "Contact email is required";
      if (!formData.contactPhone.trim())
        newErrors.contactPhone = "Contact phone is required";

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
        newErrors.contactEmail = "Please enter a valid email address";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(4)) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = getTokenFromCookies();
      if (!token) {
        throw new Error("Authentication required");
      }

      // Prepare payload with flattened location fields
      const payload = {
        teamName: formData.teamName,
        teamSize: formData.teamSize,
        "location.country": formData.location.country,
        "location.state": formData.location.state,
        "location.city": formData.location.city,
        primarySpecialization: formData.primarySpecialization,
        programmingLanguages: formData.programmingLanguages,
        frameworksAndTools: formData.frameworksAndTools,
        softSkills: formData.softSkills,
        preferredTechStack: formData.preferredTechStack,
        experienceLevel: formData.experienceLevel,
        currentJobTitle: formData.currentJobTitle,
        yearsOfExperience: formData.yearsOfExperience,
        industryFocus: formData.industryFocus,
        employmentStatus: formData.employmentStatus,
        remoteWorkExperience: formData.remoteWorkExperience,
        trainingAvailability: formData.trainingAvailability,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        lookingForJobs: formData.lookingForJobs,
        interestedInTraining: formData.interestedInTraining,
      };

      safeConsole.log("Creating team with payload:", payload);

      const response = await postApiRequest("/api/teams", payload, {
        Authorization: `Bearer ${token}`,
      });

      if (response.status >= 400) {
        throw new Error(response.data?.message || "Failed to create team");
      }

      toast.success("Team created successfully!");
      router.push("/dashboard/my-teams");
    } catch (error: any) {
      safeConsole.error("Error creating team:", error);
      toast.error(error.message || "Failed to create team. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">
          Basic Team Information
        </h2>
        <p className="text-gray-600">
          Let's start with the essential details about your team
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label
            htmlFor="teamName"
            className="text-sm font-medium text-gray-700"
          >
            Team Name *
          </Label>
          <Input
            id="teamName"
            name="teamName"
            value={formData.teamName}
            onChange={handleInputChange}
            placeholder="e.g., Tech Avengers, Code Warriors"
            className={`mt-1 ${errors.teamName ? "border-red-500" : ""}`}
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
            value={formData.teamSize}
            onChange={handleInputChange}
            className={`mt-1 ${errors.teamSize ? "border-red-500" : ""}`}
          />
          {errors.teamSize && (
            <p className="text-red-500 text-xs mt-1">{errors.teamSize}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="primarySpecialization"
            className="text-sm font-medium text-gray-700"
          >
            Primary Specialization *
          </Label>
          <Input
            id="primarySpecialization"
            name="primarySpecialization"
            value={formData.primarySpecialization}
            onChange={handleInputChange}
            placeholder="e.g., Full Stack Development, Data Science"
            className={`mt-1 ${
              errors.primarySpecialization ? "border-red-500" : ""
            }`}
          />
          {errors.primarySpecialization && (
            <p className="text-red-500 text-xs mt-1">
              {errors.primarySpecialization}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-600" />
          Team Location
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label
              htmlFor="location.country"
              className="text-sm font-medium text-gray-700"
            >
              Country *
            </Label>
            <Select
              value={formData.location.country}
              onValueChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  location: { ...prev.location, country: value },
                }));
                if (errors.country) {
                  setErrors((prev) => ({ ...prev, country: "" }));
                }
              }}
            >
              <SelectTrigger
                className={`mt-1 ${errors.country ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-red-500 text-xs mt-1">{errors.country}</p>
            )}
          </div>

          <div>
            <Label
              htmlFor="location.state"
              className="text-sm font-medium text-gray-700"
            >
              State/Province *
            </Label>
            <Input
              id="location.state"
              name="location.state"
              value={formData.location.state}
              onChange={handleInputChange}
              placeholder="e.g., California, Ontario"
              className={`mt-1 ${errors.state ? "border-red-500" : ""}`}
            />
            {errors.state && (
              <p className="text-red-500 text-xs mt-1">{errors.state}</p>
            )}
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
              value={formData.location.city}
              onChange={handleInputChange}
              placeholder="e.g., San Francisco, Toronto"
              className={`mt-1 ${errors.city ? "border-red-500" : ""}`}
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Code className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Technical Skills</h2>
        <p className="text-gray-600">
          Define your team's technical capabilities and preferences
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Programming Languages * (Select all that apply)
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {programmingLanguages.map((lang) => (
              <div key={lang} className="flex items-center space-x-2">
                <Checkbox
                  id={`lang-${lang}`}
                  checked={formData.programmingLanguages.includes(lang)}
                  onCheckedChange={(checked) =>
                    handleArrayChange(
                      "programmingLanguages",
                      lang,
                      checked as boolean
                    )
                  }
                />
                <Label
                  htmlFor={`lang-${lang}`}
                  className="text-sm text-gray-700"
                >
                  {lang}
                </Label>
              </div>
            ))}
          </div>
          {errors.programmingLanguages && (
            <p className="text-red-500 text-xs mt-1">
              {errors.programmingLanguages}
            </p>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Frameworks & Tools * (Select all that apply)
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {frameworksAndTools.map((tool) => (
              <div key={tool} className="flex items-center space-x-2">
                <Checkbox
                  id={`tool-${tool}`}
                  checked={formData.frameworksAndTools.includes(tool)}
                  onCheckedChange={(checked) =>
                    handleArrayChange(
                      "frameworksAndTools",
                      tool,
                      checked as boolean
                    )
                  }
                />
                <Label
                  htmlFor={`tool-${tool}`}
                  className="text-sm text-gray-700"
                >
                  {tool}
                </Label>
              </div>
            ))}
          </div>
          {errors.frameworksAndTools && (
            <p className="text-red-500 text-xs mt-1">
              {errors.frameworksAndTools}
            </p>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Soft Skills * (Select all that apply)
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {softSkills.map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <Checkbox
                  id={`skill-${skill}`}
                  checked={formData.softSkills.includes(skill)}
                  onCheckedChange={(checked) =>
                    handleArrayChange("softSkills", skill, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`skill-${skill}`}
                  className="text-sm text-gray-700"
                >
                  {skill}
                </Label>
              </div>
            ))}
          </div>
          {errors.softSkills && (
            <p className="text-red-500 text-xs mt-1">{errors.softSkills}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Preferred Tech Stacks * (Select all that apply)
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {preferredTechStacks.map((stack) => (
              <div key={stack} className="flex items-center space-x-2">
                <Checkbox
                  id={`stack-${stack}`}
                  checked={formData.preferredTechStack.includes(stack)}
                  onCheckedChange={(checked) =>
                    handleArrayChange(
                      "preferredTechStack",
                      stack,
                      checked as boolean
                    )
                  }
                />
                <Label
                  htmlFor={`stack-${stack}`}
                  className="text-sm text-gray-700"
                >
                  {stack}
                </Label>
              </div>
            ))}
          </div>
          {errors.preferredTechStack && (
            <p className="text-red-500 text-xs mt-1">
              {errors.preferredTechStack}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Briefcase className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">
          Professional Experience
        </h2>
        <p className="text-gray-600">
          Tell us about your team's professional background
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label
            htmlFor="experienceLevel"
            className="text-sm font-medium text-gray-700"
          >
            Experience Level *
          </Label>
          <Select
            value={formData.experienceLevel}
            onValueChange={(value) => {
              setFormData((prev) => ({ ...prev, experienceLevel: value }));
              if (errors.experienceLevel) {
                setErrors((prev) => ({ ...prev, experienceLevel: "" }));
              }
            }}
          >
            <SelectTrigger
              className={`mt-1 ${
                errors.experienceLevel ? "border-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              {experienceLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.experienceLevel && (
            <p className="text-red-500 text-xs mt-1">
              {errors.experienceLevel}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="currentJobTitle"
            className="text-sm font-medium text-gray-700"
          >
            Current Job Title *
          </Label>
          <Input
            id="currentJobTitle"
            name="currentJobTitle"
            value={formData.currentJobTitle}
            onChange={handleInputChange}
            placeholder="e.g., Senior Developer, Team Lead"
            className={`mt-1 ${errors.currentJobTitle ? "border-red-500" : ""}`}
          />
          {errors.currentJobTitle && (
            <p className="text-red-500 text-xs mt-1">
              {errors.currentJobTitle}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="yearsOfExperience"
            className="text-sm font-medium text-gray-700"
          >
            Years of Experience *
          </Label>
          <Input
            id="yearsOfExperience"
            name="yearsOfExperience"
            type="number"
            min="0"
            value={formData.yearsOfExperience}
            onChange={handleInputChange}
            className={`mt-1 ${
              errors.yearsOfExperience ? "border-red-500" : ""
            }`}
          />
          {errors.yearsOfExperience && (
            <p className="text-red-500 text-xs mt-1">
              {errors.yearsOfExperience}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="industryFocus"
            className="text-sm font-medium text-gray-700"
          >
            Industry Focus *
          </Label>
          <Select
            value={formData.industryFocus}
            onValueChange={(value) => {
              setFormData((prev) => ({ ...prev, industryFocus: value }));
              if (errors.industryFocus) {
                setErrors((prev) => ({ ...prev, industryFocus: "" }));
              }
            }}
          >
            <SelectTrigger
              className={`mt-1 ${errors.industryFocus ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Select industry focus" />
            </SelectTrigger>
            <SelectContent>
              {industryFocuses.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.industryFocus && (
            <p className="text-red-500 text-xs mt-1">{errors.industryFocus}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="employmentStatus"
            className="text-sm font-medium text-gray-700"
          >
            Employment Status *
          </Label>
          <Select
            value={formData.employmentStatus}
            onValueChange={(value) => {
              setFormData((prev) => ({ ...prev, employmentStatus: value }));
              if (errors.employmentStatus) {
                setErrors((prev) => ({ ...prev, employmentStatus: "" }));
              }
            }}
          >
            <SelectTrigger
              className={`mt-1 ${
                errors.employmentStatus ? "border-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Select employment status" />
            </SelectTrigger>
            <SelectContent>
              {employmentStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.employmentStatus && (
            <p className="text-red-500 text-xs mt-1">
              {errors.employmentStatus}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remoteWorkExperience"
              name="remoteWorkExperience"
              checked={formData.remoteWorkExperience}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  remoteWorkExperience: checked as boolean,
                }))
              }
            />
            <Label
              htmlFor="remoteWorkExperience"
              className="text-sm font-medium text-gray-700"
            >
              Team has remote work experience
            </Label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <GraduationCap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Training & Contact</h2>
        <p className="text-gray-600">
          Set up training preferences and contact information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label
            htmlFor="trainingAvailability"
            className="text-sm font-medium text-gray-700"
          >
            Training Availability *
          </Label>
          <Select
            value={formData.trainingAvailability}
            onValueChange={(value) => {
              setFormData((prev) => ({ ...prev, trainingAvailability: value }));
              if (errors.trainingAvailability) {
                setErrors((prev) => ({ ...prev, trainingAvailability: "" }));
              }
            }}
          >
            <SelectTrigger
              className={`mt-1 ${
                errors.trainingAvailability ? "border-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Select training availability" />
            </SelectTrigger>
            <SelectContent>
              {trainingAvailabilityOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() +
                    option.slice(1).replace("-", " ")}
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
            value={formData.contactEmail}
            onChange={handleInputChange}
            placeholder="team@example.com"
            className={`mt-1 ${errors.contactEmail ? "border-red-500" : ""}`}
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
            value={formData.contactPhone}
            onChange={handleInputChange}
            placeholder="+1234567890"
            className={`mt-1 ${errors.contactPhone ? "border-red-500" : ""}`}
          />
          {errors.contactPhone && (
            <p className="text-red-500 text-xs mt-1">{errors.contactPhone}</p>
          )}
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="lookingForJobs"
              name="lookingForJobs"
              checked={formData.lookingForJobs}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  lookingForJobs: checked as boolean,
                }))
              }
            />
            <Label
              htmlFor="lookingForJobs"
              className="text-sm font-medium text-gray-700"
            >
              Team is actively looking for job opportunities
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="interestedInTraining"
              name="interestedInTraining"
              checked={formData.interestedInTraining}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  interestedInTraining: checked as boolean,
                }))
              }
            />
            <Label
              htmlFor="interestedInTraining"
              className="text-sm font-medium text-gray-700"
            >
              Team is interested in training and skill development
            </Label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProgressBar = () => (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
      />
    </div>
  );

  const renderStepIndicator = () => (
    <div className="flex justify-center space-x-4 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step <= currentStep
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create New Team
            </h1>
            <p className="text-gray-600">
              Build your dream tech team and start collaborating
            </p>
          </div>
        </div>

        {/* Progress */}
        {renderProgressBar()}
        {renderStepIndicator()}

        {/* Form */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}

              {/* Navigation */}
              <div className="flex justify-between pt-8 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="px-6"
                >
                  Previous
                </Button>

                <div className="flex space-x-4">
                  {currentStep < totalSteps ? (
                    <Button type="button" onClick={handleNext} className="px-6">
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating Team...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Create Team
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Selected Skills Summary */}
        {(formData.programmingLanguages.length > 0 ||
          formData.frameworksAndTools.length > 0) && (
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Selected Skills Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.programmingLanguages.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Programming Languages
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.programmingLanguages.map((lang) => (
                        <Badge key={lang} variant="secondary">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {formData.frameworksAndTools.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Frameworks & Tools
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.frameworksAndTools.map((tool) => (
                        <Badge key={tool} variant="outline">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
