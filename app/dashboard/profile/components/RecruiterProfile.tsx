"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Building,
  MapPin,
  Users,
  FileText,
  Save,
  Edit2,
  X,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";
import { useProfileData } from "@/hooks/useProfileData";

import { safeConsole } from "@/lib/console";
interface RecruiterProfileProps {
  userProfile: any;
  onUpdate: (data: any) => Promise<{ success: boolean; error?: string }>;
  userId: string;
  token: string;
}

export default function RecruiterProfile({
  userProfile,
  onUpdate,
  userId,
  token,
}: RecruiterProfileProps) {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Initialize draft with proper structure including nested company object
  const initializeDraft = () => {
    const profile = userProfile?.profile || {};
    return {
      ...profile,
      // Ensure company object exists in draft
      company: profile.company || {},
    };
  };
  
  const [draft, setDraft] = useState(initializeDraft());
  
  // Update draft when userProfile changes
  useEffect(() => {
    if (userProfile?.profile) {
      setDraft(initializeDraft());
    }
  }, [userProfile]);
  // Expanded stepFieldMapping to include all fields rendered in the UI
  const stepFieldMapping = {
    2: ["recruitingName", "positionAtCompany", "contactEmail", "phoneNumber"],
    3: [
      "companyId",
      "companyName",
      "companyType",
      "rcNumber",
      "industry",
      "website",
      "companySize",
      "companyAddress",
    ],
    4: ["recruitmentFocusAreas", "preferredHiringModel", "hiringGoals"],
    5: ["hiringRegions"],
    6: ["agreeToTerms", "referralSource", "referralCodeOrName"],
    7: [
      "jobTitle",
      "jobDescription",
      "employmentType",
      "location",
      "salaryRange",
      "skipForNow",
    ],
  };

  // Add onboarding progress, skipped/completed steps, and editability logic
  const [onboardingProgress, setOnboardingProgress] = useState<any>(null);
  const [skippedSteps, setSkippedSteps] = useState<Set<number>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const { getOnboardingProgress, completeStep } = useOnboardingStatus(token);
  const { profile: contextProfile, updateProfile } = useProfileData();

  useEffect(() => {
    const fetchOnboardingProgress = async () => {
      if (!userId || !token) return;
      try {
        const progressRes = await getOnboardingProgress(userId);
        const progressData = progressRes?.data?.data || progressRes?.data;
        if (progressData && progressData.steps) {
          setOnboardingProgress(progressData);
          const skipped = new Set<number>();
          const completed = new Set<number>();
          progressData.steps.forEach((step: any, index: number) => {
            if (step.skipped && !step.completed) skipped.add(index);
            else if (step.completed) completed.add(index);
          });
          setSkippedSteps(skipped);
          setCompletedSteps(completed);
        }
      } catch (error) {
        safeConsole.error("Failed to fetch onboarding progress:", error);
      }
    };
    fetchOnboardingProgress();
  }, [userId, token, getOnboardingProgress]);

  const isFieldEditable = (fieldName: string): boolean => {
    if (!onboardingProgress) return true;
    for (const [stepNum, fields] of Object.entries(stepFieldMapping)) {
      if (fields.includes(fieldName)) {
        const stepIndex = parseInt(stepNum) - 1;
        return skippedSteps.has(stepIndex);
      }
    }
    return false;
  };
  const isFieldCompleted = (fieldName: string): boolean => {
    if (!onboardingProgress) return false;
    for (const [stepNum, fields] of Object.entries(stepFieldMapping)) {
      if (fields.includes(fieldName)) {
        const stepIndex = parseInt(stepNum) - 1;
        return completedSteps.has(stepIndex);
      }
    }
    return false;
  };
  const areAllStepsCompleted = () => {
    if (!onboardingProgress?.steps) return false;
    return onboardingProgress.steps.every((step: any) => step.completed);
  };
  const getSkippedSteps = () => {
    if (!onboardingProgress?.steps) return [];
    return onboardingProgress.steps
      .map((step: any, index: number) => ({ ...step, index }))
      .filter((step: any) => step.skipped && !step.completed)
      .map((step: any) => ({ ...step, stepNumber: step.index + 1 }));
  };

  const handleEdit = () => {
    const profile = userProfile?.profile || {};
    setDraft({
      ...profile,
      company: profile.company || {},
    });
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleSave = async () => {
    setLoading(true);
    const result = await onUpdate(draft);
    if (result.success) {
      setEditMode(false);
    } else {
      alert(result.error || "Failed to update profile");
    }
    setLoading(false);
  };

  const handleChange = (field: string, value: any) => {
    setDraft((prev: any) => ({ ...prev, [field]: value }));
  };
  
  // Helper to handle company field changes
  const handleCompanyChange = (field: string, value: any) => {
    setDraft((prev: any) => ({
      ...prev,
      company: {
        ...(prev.company || {}),
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (field: string, value: string[]) => {
    setDraft((prev: any) => ({ ...prev, [field]: value }));
  };

  // Get current profile data with proper company access
  const getCurrentProfile = () => {
    const profile = editMode ? draft : (userProfile?.profile || {});
    return {
      ...profile,
      // Ensure company object is always available
      company: profile.company || {},
    };
  };
  
  const currentProfile = getCurrentProfile();

  const companySizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1000+ employees",
  ];

  const hiringGoals = [
    "Entry-level positions",
    "Mid-level positions",
    "Senior-level positions",
    "Executive positions",
    "Contract/Freelance",
    "Internships",
  ];

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
    "Consulting",
    "Non-profit",
    "Government",
    "Other",
  ];

  const recruitmentFocusAreas = [
    "Software Development",
    "Data Science",
    "Product Management",
    "UX/UI Design",
    "Marketing",
    "Sales",
    "Operations",
    "Finance",
    "HR",
    "Legal",
    "Other",
  ];

  const preferredHiringModels = [
    "Direct Hire",
    "Contract/Freelance",
    "Internship",
    "Temporary/Contract-to-Hire",
    "Other",
  ];

  const employmentTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Internship",
    "Other",
  ];

  const skippedStepsList = getSkippedSteps();

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full lg:w-1/3 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border border-blue-100">
        <div className="w-32 h-32 rounded-full bg-[#0D1140] flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-md">
          {userProfile.fullName.charAt(0).toUpperCase()}
        </div>

        {!editMode ? (
          <>
            <h2 className="text-xl font-bold text-[#011F72] mb-1 text-center">
              {userProfile.fullName}
            </h2>
            <p className="text-sm text-gray-500 mb-2 text-center">
              {currentProfile.positionAtCompany || "Recruiter"}
            </p>
            <p className="text-xs text-gray-400 mb-4 text-center">
              {currentProfile.company?.name || currentProfile.recruitingName || "Company not specified"}
            </p>

            <div className="flex flex-col gap-2 w-full mt-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={16} />
                <span className="text-sm">{userProfile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone size={16} />
                <span className="text-sm">
                  {currentProfile.phoneNumber || "Not provided"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Building size={16} />
                <span className="text-sm">
                  {currentProfile.company?.name || "Not provided"}
                </span>
              </div>
              {currentProfile.hiringRegions && currentProfile.hiringRegions.length > 0 && (
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin size={16} />
                  <span className="text-sm">
                    {currentProfile.hiringRegions.join(", ")}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={handleEdit}
              className="mt-8 w-full bg-[#0D1140] hover:bg-blue-700 text-white font-semibold py-2 rounded-[10px] transition flex items-center justify-center gap-2"
            >
              <Edit2 size={18} /> Edit Profile
            </button>
          </>
        ) : (
          <>
            <input
              value={draft.positionAtCompany || ""}
              onChange={(e) => handleChange("positionAtCompany", e.target.value)}
              placeholder="Position at Company"
              disabled={!isFieldEditable("positionAtCompany")}
              className={`w-full text-xl font-bold text-[#011F72] mb-1 text-center border-b border-blue-100 focus:outline-none ${
                isFieldCompleted("positionAtCompany") ? "bg-gray-100 text-gray-400" : ""
              }`}
            />
            <input
              value={draft.company?.name || ""}
              onChange={(e) => handleCompanyChange("name", e.target.value)}
              placeholder={
                isFieldCompleted("companyName") ? "Completed" : "Company Name"
              }
              disabled={isFieldCompleted("companyName")}
              className={`w-full text-sm text-gray-500 mb-2 text-center border-b border-blue-100 focus:outline-none ${
                isFieldCompleted("companyName")
                  ? "bg-gray-100 text-gray-400"
                  : ""
              }`}
            />

            <div className="flex flex-col gap-2 w-full mt-4">
              <input
                value={draft.phoneNumber || ""}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                placeholder="Phone Number"
                disabled={!isFieldEditable("phoneNumber")}
                className={`border-b border-blue-100 focus:outline-none text-sm ${
                  isFieldCompleted("phoneNumber")
                    ? "bg-gray-100 text-gray-400"
                    : ""
                }`}
              />
              <input
                value={draft.hiringRegions?.join(", ") || ""}
                onChange={(e) => {
                  const regions = e.target.value
                    .split(",")
                    .map((r: string) => r.trim())
                    .filter((r: string) => r);
                  handleArrayChange("hiringRegions", regions);
                }}
                placeholder="Hiring Regions (comma-separated)"
                disabled={!isFieldEditable("hiringRegions")}
                className={`border-b border-blue-100 focus:outline-none text-sm ${
                  isFieldCompleted("hiringRegions")
                    ? "bg-gray-100 text-gray-400"
                    : ""
                }`}
              />
            </div>

            <div className="flex gap-2 mt-8 w-full">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-[10px] transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save size={18} /> Save
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-[10px] transition flex items-center justify-center gap-2"
              >
                <X size={18} /> Cancel
              </button>
            </div>
          </>
        )}
      </aside>

      {/* Main Content */}
      <section className="flex-1 bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
        {/* Company Information */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
            <Building size={20} /> Company Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50/60 rounded-[10px] p-4">
              <label className="text-sm font-medium text-gray-700">
                Company Name
              </label>
              {!editMode ? (
                <p className="text-blue-900">
                  {currentProfile.company?.name || "Not specified"}
                </p>
              ) : (
                <input
                  value={draft.company?.name || ""}
                  onChange={(e) => handleCompanyChange("name", e.target.value)}
                  placeholder={
                    isFieldCompleted("companyName")
                      ? "Completed"
                      : "Company Name"
                  }
                  disabled={isFieldCompleted("companyName")}
                  className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isFieldCompleted("companyName")
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                />
              )}
            </div>
            <div className="bg-blue-50/60 rounded-[10px] p-4">
              <label className="text-sm font-medium text-gray-700">
                Company Size
              </label>
              {!editMode ? (
                <p className="text-blue-900">
                  {currentProfile.company?.size || "Not specified"}
                </p>
              ) : (
                <select
                  value={draft.company?.size || ""}
                  onChange={(e) => handleCompanyChange("size", e.target.value)}
                  disabled={!isFieldEditable("companySize")}
                  className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isFieldCompleted("companySize")
                      ? "bg-gray-100 text-gray-400"
                      : ""
                  }`}
                >
                  <option value="">Select Company Size</option>
                  {companySizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="bg-blue-50/60 rounded-[10px] p-4">
              <label className="text-sm font-medium text-gray-700">
                Industry
              </label>
              {!editMode ? (
                <p className="text-blue-900">
                  {currentProfile.company?.industry || "Not specified"}
                </p>
              ) : (
                <select
                  value={draft.company?.industry || ""}
                  onChange={(e) => handleCompanyChange("industry", e.target.value)}
                  disabled={!isFieldEditable("industry")}
                  className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isFieldCompleted("industry")
                      ? "bg-gray-100 text-gray-400"
                      : ""
                  }`}
                >
                  <option value="">Select Industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="bg-blue-50/60 rounded-[10px] p-4">
              <label className="text-sm font-medium text-gray-700">
                Company Website
              </label>
              {!editMode ? (
                <p className="text-blue-900">
                  {currentProfile.company?.website ? (
                    <a
                      href={
                        currentProfile.company.website.startsWith("http")
                          ? currentProfile.company.website
                          : `https://${currentProfile.company.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {currentProfile.company.website}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>
              ) : (
                <input
                  value={draft.company?.website || ""}
                  onChange={(e) =>
                    handleCompanyChange("website", e.target.value)
                  }
                  type="url"
                  placeholder="https://company.com"
                  disabled={!isFieldEditable("companyWebsite")}
                  className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isFieldCompleted("companyWebsite")
                      ? "bg-gray-100 text-gray-400"
                      : ""
                  }`}
                />
              )}
            </div>
          </div>
        </div>

        {/* Hiring Information */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
            <Users size={20} /> Hiring Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Hiring Goals
              </label>
              {!editMode ? (
                <div className="flex flex-wrap gap-2">
                  {currentProfile.hiringGoals?.map((goal: string) => (
                    <span
                      key={goal}
                      className="bg-green-50 text-green-800 px-2 py-1 rounded text-xs font-medium"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {recruitmentFocusAreas.map((area) => (
                    <label key={area} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={draft.recruitmentFocusAreas?.includes(area) || false}
                        onChange={(e) => {
                          if (isFieldCompleted("recruitmentFocusAreas")) return;
                          const current = draft.recruitmentFocusAreas || [];
                          if (e.target.checked) {
                            handleArrayChange("recruitmentFocusAreas", [
                              ...current,
                              area,
                            ]);
                          } else {
                            handleArrayChange(
                              "recruitmentFocusAreas",
                              current.filter((a: string) => a !== area)
                            );
                          }
                        }}
                        disabled={isFieldCompleted("recruitmentFocusAreas")}
                        className={`rounded border-green-300 text-green-600 focus:ring-green-500 ${
                          isFieldCompleted("recruitmentFocusAreas")
                            ? "bg-gray-100 cursor-not-allowed"
                            : ""
                        }`}
                      />
                      <span className="text-sm">{area}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Preferred Hiring Model
              </label>
              {!editMode ? (
                <div className="flex flex-wrap gap-2">
                  {currentProfile.preferredHiringModel ? (
                    <span className="bg-blue-50 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      {currentProfile.preferredHiringModel}
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm">Not specified</span>
                  )}
                </div>
              ) : (
                <select
                  value={draft.preferredHiringModel || ""}
                  onChange={(e) => handleChange("preferredHiringModel", e.target.value)}
                  disabled={!isFieldEditable("preferredHiringModel")}
                  className={`w-full border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isFieldCompleted("preferredHiringModel")
                      ? "bg-gray-100 text-gray-400"
                      : ""
                  }`}
                >
                  <option value="">Select Hiring Model</option>
                  {preferredHiringModels.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Recruiting Preferences */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
            <Users size={20} /> Recruiting Preferences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50/60 rounded-[10px] p-4">
              <label className="text-sm font-medium text-gray-700">
                Preferred Contact Method
              </label>
              {!editMode ? (
                <p className="text-blue-900 capitalize">
                  {currentProfile.preferredContactMethod || "Not specified"}
                </p>
              ) : (
                <select
                  value={draft.preferredContactMethod || ""}
                  onChange={(e) =>
                    handleChange("preferredContactMethod", e.target.value)
                  }
                  disabled={!isFieldEditable("preferredContactMethod")}
                  className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isFieldCompleted("preferredContactMethod")
                      ? "bg-gray-100 text-gray-400"
                      : ""
                  }`}
                >
                  <option value="">Select Contact Method</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              )}
            </div>
            <div className="bg-blue-50/60 rounded-[10px] p-4">
              <label className="text-sm font-medium text-gray-700">
                Hiring Regions
              </label>
              {!editMode ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {currentProfile.hiringRegions?.length > 0 ? (
                    currentProfile.hiringRegions.map((region: string) => (
                      <span
                        key={region}
                        className="bg-blue-50 text-blue-800 px-2 py-1 rounded text-xs font-medium"
                      >
                        {region}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">Not specified</span>
                  )}
                </div>
              ) : (
                <input
                  value={draft.hiringRegions?.join(", ") || ""}
                  onChange={(e) => {
                    const regions = e.target.value
                      .split(",")
                      .map((r: string) => r.trim())
                      .filter((r: string) => r);
                    handleArrayChange("hiringRegions", regions);
                  }}
                  placeholder="Enter regions separated by commas (e.g., Africa, Europe, Asia)"
                  disabled={!isFieldEditable("hiringRegions")}
                  className={`w-full mt-1 border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isFieldCompleted("hiringRegions")
                      ? "bg-gray-100 text-gray-400"
                      : ""
                  }`}
                />
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
              <FileText size={20} /> Referral Information
            </h3>
            {!editMode ? (
              <div className="bg-blue-50/60 rounded-[10px] p-4 space-y-2">
                <p className="text-blue-900">
                  <span className="font-medium">Referral Source:</span>{" "}
                  {currentProfile.referralSource || "Not specified"}
                </p>
                {currentProfile.referralCodeOrName && (
                  <p className="text-blue-900">
                    <span className="font-medium">Referral Code/Name:</span>{" "}
                    {currentProfile.referralCodeOrName}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Referral Source
                  </label>
                  <input
                    value={draft.referralSource || ""}
                    onChange={(e) => handleChange("referralSource", e.target.value)}
                    placeholder="How did you hear about us?"
                    disabled={!isFieldEditable("referralSource")}
                    className={`w-full border border-blue-200 rounded-[10px] p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isFieldCompleted("referralSource")
                        ? "bg-gray-100 text-gray-400"
                        : ""
                    }`}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Referral Code/Name (Optional)
                  </label>
                  <input
                    value={draft.referralCodeOrName || ""}
                    onChange={(e) => handleChange("referralCodeOrName", e.target.value)}
                    placeholder="Enter referral code or name if applicable"
                    disabled={!isFieldEditable("referralCodeOrName")}
                    className={`w-full border border-blue-200 rounded-[10px] p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isFieldCompleted("referralCodeOrName")
                        ? "bg-gray-100 text-gray-400"
                        : ""
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#011F72] flex items-center gap-2 mb-4">
              <Briefcase size={20} /> Company Details
            </h3>
            {!editMode ? (
              <div className="bg-blue-50/60 rounded-[10px] p-4 space-y-2">
                {currentProfile.company?.rcNumber && (
                  <p className="text-blue-900">
                    <span className="font-medium">RC Number:</span>{" "}
                    {currentProfile.company.rcNumber}
                  </p>
                )}
                {currentProfile.company?.type && (
                  <p className="text-blue-900">
                    <span className="font-medium">Company Type:</span>{" "}
                    {currentProfile.company.type}
                  </p>
                )}
                {!currentProfile.company?.rcNumber && !currentProfile.company?.type && (
                  <p className="text-blue-900">No additional company details</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    RC Number
                  </label>
                  <input
                    value={draft.company?.rcNumber || ""}
                    onChange={(e) => handleCompanyChange("rcNumber", e.target.value)}
                    placeholder="Enter RC Number"
                    disabled={!isFieldEditable("rcNumber")}
                    className={`w-full border border-blue-200 rounded-[10px] p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isFieldCompleted("rcNumber")
                        ? "bg-gray-100 text-gray-400"
                        : ""
                    }`}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Company Type
                  </label>
                  <input
                    value={draft.company?.type || ""}
                    onChange={(e) => handleCompanyChange("type", e.target.value)}
                    placeholder="Enter Company Type"
                    disabled={!isFieldEditable("companyType")}
                    className={`w-full border border-blue-200 rounded-[10px] p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isFieldCompleted("companyType")
                        ? "bg-gray-100 text-gray-400"
                        : ""
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {skippedStepsList.length > 0 && (
          <div className="w-full mb-6 p-4 bg-orange-50 border border-orange-200 rounded-[10px]">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h3 className="text-orange-800 font-semibold">
                Complete Skipped Steps
              </h3>
            </div>
            <p className="text-orange-700 text-sm mb-3">
              The following onboarding steps were skipped and need to be
              completed:
            </p>
            <div className="flex flex-wrap gap-2">
              {skippedStepsList.map((step: any) => (
                <span
                  key={step.stepNumber}
                  className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium border border-orange-300"
                >
                  Step {step.stepNumber}: {step.title}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
