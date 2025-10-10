"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Users,
  ArrowLeft,
  Send,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Star,
  Briefcase,
  GraduationCap,
  Globe,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getApiRequest, postApiRequest } from "@/lib/apiFetch";
import { getCookie } from "@/lib/cookies";
import JobApplicationGuard from "@/components/JobApplicationGuard";

import { safeConsole } from "@/lib/console";
interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: string;
  salary: {
    min: number;
    max: number;
    currency: string;
    isNegotiable: boolean;
  };
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  applications: number;
}

interface UploadedFile {
  id: string;
  name: string;
  file: File;
  type: "cv" | "coverLetter";
  uploadedAt: Date;
}

export default function JobApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  return (
    <JobApplicationGuard jobId={jobId}>
      <JobApplicationContent />
    </JobApplicationGuard>
  );
}

function JobApplicationContent() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCV, setSelectedCV] = useState<string>("");
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<string>("");
  const [customCoverLetter, setCustomCoverLetter] = useState("");
  const [useCustomCoverLetter, setUseCustomCoverLetter] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [referrerId, setReferrerId] = useState("");
  const [hasReferral, setHasReferral] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      const token = getCookie("token");

      if (!token) {
        setError("Authentication required");
        return;
      }
      try {
        setLoading(true);

        const response = await postApiRequest(
          `/api/ats/job-applications`,
          {
            jobPostId: jobId,
            cvId: selectedCV,
          },
          { Authorization: `Bearer ${token}` }
        );

        if (!response) {
          throw new Error("Failed to fetch job details");
        }

        setJob(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  // Handle file upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "cv" | "coverLetter"
  ) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    const file = files[0]; // Only handle one file at a time

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors({ fileUpload: "Please upload a PDF, DOC, DOCX, or TXT file" });
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors({ fileUpload: "File size must be less than 5MB" });
      return;
    }

    try {
      setUploading(true);
      setErrors({});

      // Upload file to server
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const token = getCookie("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const result = await response.json();

      if (result.success && result.data?.id) {
        const newFile: UploadedFile = {
          id: result.data.id,
          name: file.name,
          file: file,
          type: type,
          uploadedAt: new Date(),
        };

        setUploadedFiles((prev) => [...prev, newFile]);

        // Auto-select the uploaded file
        if (type === "cv") {
          setSelectedCV(result.data.id);
        } else if (type === "coverLetter") {
          setSelectedCoverLetter(result.data.id);
        }

        // Clear any previous errors
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.fileUpload;
          return newErrors;
        });
      } else {
        throw new Error("Failed to get file ID from upload response");
      }
    } catch (error: any) {
      safeConsole.error("File upload error:", error);
      setErrors({ fileUpload: error.message || "Failed to upload file" });
    } finally {
      setUploading(false);
      // Clear the input
      event.target.value = "";
    }
  };

  // Remove uploaded file
  const removeUploadedFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));

    // Clear selection if this file was selected
    if (selectedCV === fileId) {
      setSelectedCV("");
    }
    if (selectedCoverLetter === fileId) {
      setSelectedCoverLetter("");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#011F72]">
              Loading Job...
            </h1>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-gray-200 rounded-[10px]"></div>
          <div className="h-32 bg-gray-200 rounded-[10px]"></div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#011F72]">Error</h1>
            <p className="text-red-600">{error || "Job not found"}</p>
          </div>
        </div>
        <Button onClick={() => router.back()} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!selectedCV) {
      newErrors.cv = "Please select or upload a CV";
    }

    if (useCustomCoverLetter && !customCoverLetter.trim()) {
      newErrors.coverLetter = "Please write a cover letter";
    }

    if (hasReferral && !referralCode.trim()) {
      newErrors.referralCode = "Please enter a referral code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare application data
      const applicationData: any = {
        jobPostId: jobId,
        cvId: selectedCV,
      };

      // Add cover letter if provided
      if (useCustomCoverLetter && customCoverLetter.trim()) {
        // For custom cover letter, we need to upload it first
        // This is a simplified approach - in production you might want to handle this differently
        applicationData.coverLetterContent = customCoverLetter;
      } else if (selectedCoverLetter) {
        applicationData.coverLetterId = selectedCoverLetter;
      }

      // Add referral information if provided
      if (hasReferral && referralCode.trim()) {
        applicationData.referralCode = referralCode;
        if (referrerId.trim()) {
          applicationData.referrerId = referrerId;
        }
      }

      const token = getCookie("token");
      if (!token) {
        throw new Error("No token found");
      }

      // Make API call to submit application using postApiRequest
      const result = await postApiRequest(
        "/api/ats/job-applications",
        applicationData,
        { Authorization: `Bearer ${token}` }
      );

      // Handle external API response structure
      if (result.data && result.data.success) {
        // Redirect to success page or show success message
        router.push(`/dashboard/jobs/${jobId}/application-success`);
      } else {
        throw new Error(
          result.data?.message ||
            result.message ||
            "Failed to submit application"
        );
      }
    } catch (error) {
      safeConsole.error("Error submitting application:", error);
      setErrors({ submit: "Failed to submit application. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSalary = (salary: any) => {
    if (!salary) return "Salary not specified";

    // Handle different salary formats from API
    if (typeof salary === "string") {
      return salary;
    }

    if (salary.min && salary.max) {
      const range = `${salary.currency || ""}${salary.min.toLocaleString()} - ${
        salary.currency || ""
      }${salary.max.toLocaleString()}`;
      return salary.isNegotiable ? `${range} (Negotiable)` : range;
    }

    if (salary.min) {
      return `${salary.currency || ""}${salary.min.toLocaleString()}+`;
    }

    return "Salary not specified";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get uploaded files by type
  const uploadedCVs = uploadedFiles.filter((f) => f.type === "cv");
  const uploadedCoverLetters = uploadedFiles.filter(
    (f) => f.type === "coverLetter"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 to-indigo-50/30">
      <div className="max-w-6xl mx-auto space-y-8 p-6">
        {/* Enhanced Header */}
        <div className="bg-white rounded-[12px] shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="p-3 hover:bg-blue-50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#011F72]" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#011F72] mb-2">
                Apply for Job
              </h1>
              <p className="text-gray-600 text-lg">
                Submit your application for this position and take the next step
                in your career
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-[10px]">
              <Briefcase className="w-5 h-5 text-[#011F72]" />
              <span className="text-sm font-medium text-[#011F72]">
                Job Application
              </span>
            </div>
          </div>
        </div>

        <div className="">
          {/* Enhanced Application Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Enhanced CV Selection */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="w-5 h-5 text-green-600" />
                    Select CV
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  {/* Uploaded CVs */}
                  {uploadedCVs.length > 0 && (
                    <div className="space-y-3">
                      {uploadedCVs.map((cv) => (
                        <div
                          key={cv.id}
                          className={`flex items-center gap-3 p-4 border-2 rounded-[12px] cursor-pointer transition-all duration-200 ${
                            selectedCV === cv.id
                              ? "border-green-500 bg-green-50 shadow-md scale-[1.02]"
                              : "border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.01]"
                          }`}
                          onClick={() => setSelectedCV(cv.id)}
                        >
                          <input
                            type="radio"
                            name="cv"
                            value={cv.id}
                            checked={selectedCV === cv.id}
                            onChange={() => setSelectedCV(cv.id)}
                            className="text-green-600 w-4 h-4"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-800">
                                {cv.name}
                              </span>
                              <Badge
                                variant="secondary"
                                className="text-xs bg-green-100 text-green-800"
                              >
                                Uploaded
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500">
                              Uploaded {formatDate(cv.uploadedAt.toISOString())}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeUploadedFile(cv.id);
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CV Upload */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="cv-upload"
                      className="text-green-800 font-medium"
                    >
                      Upload New CV
                    </Label>
                    <Input
                      id="cv-upload"
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => handleFileUpload(e, "cv")}
                      disabled={uploading}
                      className="border-2 hover:border-green-300 focus:border-green-500"
                    />
                    <p className="text-xs text-gray-500">
                      Supported formats: PDF, DOC, DOCX, TXT (Max 5MB)
                    </p>
                  </div>

                  {errors.cv && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-[10px]">
                      <p className="text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.cv}
                      </p>
                    </div>
                  )}

                  {errors.fileUpload && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-[10px]">
                      <p className="text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.fileUpload}
                      </p>
                    </div>
                  )}

                  {uploading && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-[10px]">
                      <p className="text-blue-600 text-sm flex items-center gap-1">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
                        Uploading file...
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Enhanced Cover Letter */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Cover Letter
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-[10px] border border-blue-100">
                    <Checkbox
                      id="useCustomCoverLetter"
                      checked={useCustomCoverLetter}
                      onCheckedChange={(checked) =>
                        setUseCustomCoverLetter(checked as boolean)
                      }
                      className="text-blue-600"
                    />
                    <Label
                      htmlFor="useCustomCoverLetter"
                      className="text-blue-800 font-medium cursor-pointer"
                    >
                      Write a custom cover letter
                    </Label>
                  </div>

                  {!useCustomCoverLetter ? (
                    <div className="space-y-3">
                      {/* Uploaded Cover Letters */}
                      {uploadedCoverLetters.length > 0 && (
                        <div className="space-y-3">
                          <Label className="text-blue-800 font-medium">
                            Select from uploaded cover letters:
                          </Label>
                          {uploadedCoverLetters.map((cl) => (
                            <div
                              key={cl.id}
                              className={`flex items-center gap-3 p-4 border-2 rounded-[12px] cursor-pointer transition-all duration-200 ${
                                selectedCoverLetter === cl.id
                                  ? "border-blue-500 bg-blue-50 shadow-md scale-[1.02]"
                                  : "border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.01]"
                              }`}
                              onClick={() => setSelectedCoverLetter(cl.id)}
                            >
                              <input
                                type="radio"
                                name="coverLetter"
                                value={cl.id}
                                checked={selectedCoverLetter === cl.id}
                                onChange={() => setSelectedCoverLetter(cl.id)}
                                className="text-blue-600 w-4 h-4"
                              />
                              <div className="flex-1">
                                <span className="font-semibold text-gray-800">
                                  {cl.name}
                                </span>
                                <p className="text-xs text-gray-500">
                                  Uploaded{" "}
                                  {formatDate(cl.uploadedAt.toISOString())}
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeUploadedFile(cl.id);
                                }}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Cover Letter Upload */}
                      <div className="space-y-3">
                        <Label
                          htmlFor="cover-letter-upload"
                          className="text-blue-800 font-medium"
                        >
                          Upload Cover Letter (Optional)
                        </Label>
                        <Input
                          id="cover-letter-upload"
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={(e) => handleFileUpload(e, "coverLetter")}
                          disabled={uploading}
                          className="border-2 hover:border-blue-300 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500">
                          Supported formats: PDF, DOC, DOCX, TXT (Max 5MB)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Label
                        htmlFor="customCoverLetter"
                        className="text-blue-800 font-medium"
                      >
                        Your Cover Letter
                      </Label>
                      <Textarea
                        id="customCoverLetter"
                        placeholder="Write a compelling cover letter explaining why you're the perfect fit for this position..."
                        value={customCoverLetter}
                        onChange={(e) => setCustomCoverLetter(e.target.value)}
                        rows={8}
                        className="resize-none border-2 focus:border-blue-500 focus:ring-blue-200"
                      />
                      {errors.coverLetter && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-[10px]">
                          <p className="text-red-600 text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.coverLetter}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Enhanced Referral Information */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                    Referral Information (Optional)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-[10px] border border-purple-100">
                    <Checkbox
                      id="hasReferral"
                      checked={hasReferral}
                      onCheckedChange={(checked) =>
                        setHasReferral(checked as boolean)
                      }
                      className="text-purple-600"
                    />
                    <Label
                      htmlFor="hasReferral"
                      className="text-purple-800 font-medium cursor-pointer"
                    >
                      I was referred to this position
                    </Label>
                  </div>

                  {hasReferral && (
                    <div className="space-y-4 p-4 bg-purple-50 rounded-[10px] border border-purple-100">
                      <div>
                        <Label
                          htmlFor="referralCode"
                          className="text-purple-800 font-medium"
                        >
                          Referral Code
                        </Label>
                        <Input
                          id="referralCode"
                          placeholder="Enter referral code"
                          value={referralCode}
                          onChange={(e) => setReferralCode(e.target.value)}
                          className="mt-2 border-2 focus:border-purple-500 focus:ring-purple-200"
                        />
                        {errors.referralCode && (
                          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-[10px]">
                            <p className="text-red-600 text-sm flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.referralCode}
                            </p>
                          </div>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="referrerId"
                          className="text-purple-800 font-medium"
                        >
                          Referrer ID (Optional)
                        </Label>
                        <Input
                          id="referrerId"
                          placeholder="Enter referrer ID if known"
                          value={referrerId}
                          onChange={(e) => setReferrerId(e.target.value)}
                          className="mt-2 border-2 focus:border-purple-500 focus:ring-purple-200"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Enhanced Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1 py-3 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </div>

              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-[10px]">
                  <p className="text-red-600 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.submit}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
