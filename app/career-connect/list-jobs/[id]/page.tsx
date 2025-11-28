"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
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
import {
  ArrowLeft,
  Eye,
  Edit,
  MoreHorizontal,
  MapPin,
  Calendar,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  DollarSign,
  Users,
  Download,
  Trash2,
  Target,
  TrendingUp,
  Activity,
  FileText,
  MessageSquare,
  Phone,
  Mail,
  ExternalLink,
  Bookmark,
  Share2,
  Archive,
  RefreshCw,
  Plus,
  ChevronRight,
  ChevronDown,
  Clock3,
  CalendarDays,
  UserCheck,
  UserX,
  Award,
  GraduationCap,
  BriefcaseIcon,
  Save,
  X,
  Video,
  PhoneCall,
  MapPinIcon,
  FileTextIcon,
  CheckCircle2,
  Circle,
  Play,
  Pause,
  BookOpen,
  TargetIcon,
  MessageCircle,
  Send,
  Copy,
  Link as LinkIcon,
  Globe,
  Zap,
  Heart,
  BookmarkPlus,
  BookmarkCheck,
  SendHorizontal,
  Upload,
  FileTextIcon as FileTextIcon2,
  CheckSquare,
  XSquare,
  Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getApiRequest } from "@/lib/apiFetch";
import { getCookie } from "@/lib/cookies";

interface Job {
  _id: string;
  companyId: {
    _id: string;
    name: string;
  };
  recruiterId: string;
  title: string;
  description: string;
  location: string;
  employmentType:
    | "full-time"
    | "part-time"
    | "contract"
    | "internship"
    | "remote";
  experienceLevel: "entry" | "mid" | "senior" | "lead" | "executive";
  requiredSkills: string[];
  salaryRange: string;
  tags: string[];
  isDeleted: boolean;
  version: number;
  previousVersions: any[];
  slug: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  companyLogo: string | null;
  companyName: string;
  isSaved?: boolean; // Optional since API doesn't provide it
}

export default function SingleJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [job, setJob] = useState<Job | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );
  const [isApplying, setIsApplying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicationData, setApplicationData] = useState({
    coverLetter: "",
    expectedSalary: "",
    startDate: "",
    portfolio: "",
    linkedin: "",
    github: "",
    agreeToTerms: false,
  });

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  // Fetch job data when params are resolved
  useEffect(() => {
    if (!resolvedParams?.id) return;

    const fetchJob = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get token from cookies for authentication
        const token = getCookie("token");

        const response = await getApiRequest(
          `/api/ats/job-posts/${resolvedParams.id}`,
          token
        );

        // getApiRequest returns the full API response, so we need to access response.data.data
        if (!response.data || !response.data.data) {
          throw new Error("No data received from API");
        }

        setJob(response.data.data);
      } catch (err) {
        // Handle different types of errors from getApiRequest
        let errorMessage = "Failed to fetch job";
        if (err && typeof err === "object" && "message" in err) {
          errorMessage = err.message as string;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [resolvedParams?.id]);

  if (!resolvedParams) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading parameters...</p>
        </div>
      </div>
    );
  }

  if (isLoading && !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 to-indigo-50/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">
              Error Loading Job
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-gray-600">{error}</p>
            <Button onClick={() => window.location.reload()} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 to-indigo-50/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Job Not Found
            </h3>
            <p className="text-gray-600 mb-4">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild className="w-full">
              <Link href="/dashboard/jobs">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Jobs
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-green-100 text-green-800";
      case "part-time":
        return "bg-blue-100 text-blue-800";
      case "contract":
        return "bg-purple-100 text-purple-800";
      case "internship":
        return "bg-orange-100 text-orange-800";
      case "remote":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getExperienceLevelColor = (level: string) => {
    switch (level) {
      case "entry":
        return "bg-blue-100 text-blue-800";
      case "mid":
        return "bg-purple-100 text-purple-800";
      case "senior":
        return "bg-orange-100 text-orange-800";
      case "lead":
        return "bg-red-100 text-red-800";
      case "executive":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatSalary = (salaryRange: string) => {
    // salaryRange is now a string like "95000" or "65000-85000"
    if (salaryRange.includes("-")) {
      return `£${salaryRange}`;
    }
    return `£${salaryRange}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const toggleSaveJob = () => {
    setJob((prev) => {
      if (!prev) return null;
      return { ...prev, isSaved: !(prev.isSaved || false) };
    });
  };

  const handleApply = () => {
    setIsApplying(true);
  };

  const handleInputChange = (field: string, value: any) => {
    setApplicationData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 mt-12 px-4 py-20 lg:px-20">
      {/* Enhanced Header with Hero Section */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="px-4 py-6 lg:px-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="hover:bg-gray-50"
              >
                <Link href="/career-connect/list-jobs">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Jobs
                </Link>
              </Button>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={toggleSaveJob}
                disabled={isLoading || !job}
                className="hover:bg-yellow-50 hover:border-yellow-200 transition-colors"
              >
                <Bookmark
                  className={`w-4 h-4 mr-2 transition-colors ${
                    job?.isSaved
                      ? "fill-yellow-400 text-yellow-500"
                      : "text-gray-600"
                  }`}
                />
                {isLoading ? "Loading..." : job?.isSaved ? "Saved" : "Save Job"}
              </Button>
              <Button
                variant="outline"
                disabled={isLoading || !job}
                className="hover:bg-blue-50 hover:border-blue-200"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                disabled={isLoading || !job}
                className="hover:bg-gray-50"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Hero Section */}
          <div className="mt-8 text-center lg:text-left hidden md:block">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              <Building2 className="w-4 h-4" />
              {job?.companyName || "Company"}
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {isLoading ? "Loading..." : job?.title || "Job Not Found"}
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="font-medium">
                  {job?.location || "Location"}
                </span>
              </div>
              <div className="hidden sm:block text-gray-300">•</div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <span>
                  Posted{" "}
                  {job?.createdAt ? formatDate(job.createdAt) : "Recently"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8 lg:px-20">
        {/* Job Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Enhanced Job Overview Card */}
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
                  <div className="relative">
                    <Image
                      src={
                        job.companyLogo || "/assets/logo.avif"
                      }
                      alt={job.companyName}
                      width={100}
                      height={100}
                      className="rounded-2xl object-cover border-2 border-gray-100 shadow-sm"
                    />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      {job.title}
                    </h2>
                    <div className="flex items-center gap-3 text-gray-600 mb-4">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{job.companyName}</span>
                      <span className="text-gray-300">•</span>
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 mb-6">
                      {job.employmentType && (
                        <Badge
                          className={`${getTypeColor(
                            job.employmentType
                          )} px-4 py-2 text-sm font-medium`}
                        >
                          {job.employmentType}
                        </Badge>
                      )}
                      {job.experienceLevel && (
                        <Badge
                          className={`${getExperienceLevelColor(
                            job.experienceLevel
                          )} px-4 py-2 text-sm font-medium`}
                        >
                          {job.experienceLevel}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {job.salaryRange && (
                        <div className="bg-gray-50 rounded-[10px] p-4 text-center">
                          <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                          <div className="text-sm text-gray-600">Salary</div>
                          <div className="font-bold text-gray-900">
                            {formatSalary(job.salaryRange)}
                          </div>
                        </div>
                      )}
                      {job.experienceLevel && (
                        <div className="bg-gray-50 rounded-[10px] p-4 text-center">
                          <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                          <div className="text-sm text-gray-600">Level</div>
                          <div className="font-bold text-gray-900 capitalize">
                            {job.experienceLevel}
                          </div>
                        </div>
                      )}
                      {job.createdAt && (
                        <div className="bg-gray-50 rounded-[10px] p-4 text-center">
                          <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                          <div className="text-sm text-gray-600">Posted</div>
                          <div className="font-bold text-gray-900">
                            {formatDate(job.createdAt)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Job Description
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed mb-8">
                    {job.description}
                  </p>
                </div>

                {/* Enhanced Job Details */}
                <div className="bg-gray-50 rounded-[12px] p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BriefcaseIcon className="w-5 h-5 text-gray-600" />
                    Job Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {job.companyName && (
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">
                          Company
                        </span>
                        <span className="font-semibold text-gray-900">
                          {job.companyName}
                        </span>
                      </div>
                    )}
                    {job.location && (
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">
                          Location
                        </span>
                        <span className="font-semibold text-gray-900">
                          {job.location}
                        </span>
                      </div>
                    )}
                    {job.employmentType && (
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">
                          Employment Type
                        </span>
                        <span className="font-semibold text-gray-900 capitalize">
                          {job.employmentType}
                        </span>
                      </div>
                    )}
                    {job.experienceLevel && (
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">
                          Experience Level
                        </span>
                        <span className="font-semibold text-gray-900 capitalize">
                          {job.experienceLevel}
                        </span>
                      </div>
                    )}
                    {job.salaryRange && (
                      <div className="flex justify-between items-center py-3">
                        <span className="text-gray-600 font-medium">
                          Salary Range
                        </span>
                        <span className="font-semibold text-green-600">
                          {formatSalary(job.salaryRange)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Enhanced Quick Apply Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-xl">
                  Quick Apply
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-4">
                    <Target className="w-4 h-4" />
                    95% Match Score
                  </div>
                  <p className="text-blue-100 mb-6">
                    Your profile matches this job perfectly! Apply now to get
                    started.
                  </p>
                </div>
                <Link href={`/career-connect/list-jobs/${job._id}/apply`}>
                  <Button className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 text-lg">
                    <Send className="w-5 h-5 mr-2" />
                    Apply Now
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Recruiter
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Company Info Card */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-gray-900 text-xl">
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Image
                    src={job.companyLogo || "/assets/logo.avif"}
                    alt={job.companyName}
                    width={64}
                    height={64}
                    className="rounded-2xl object-cover border-2 border-gray-100"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {job.companyName}
                    </h3>
                    <p className="text-sm text-gray-600">Technology Company</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-[10px]">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-[10px]">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">50-200 employees</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-[10px]">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">www.smartnova.com</span>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-[10px]">
                  <p className="text-sm text-blue-800">
                    SmartNOVA Innovation is a leading technology company focused
                    on cutting-edge software solutions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="requirements" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-transparent border-b-2 border-gray-200 h-16">
              <TabsTrigger
                value="requirements"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent text-lg font-medium h-full"
              >
                Requirements
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent text-lg font-medium h-full"
              >
                Skills
              </TabsTrigger>
              <TabsTrigger
                value="tags"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent text-lg font-medium h-full"
              >
                Tags
              </TabsTrigger>
              <TabsTrigger
                value="apply"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent text-lg font-medium h-full"
              >
                Apply
              </TabsTrigger>
            </TabsList>

            <TabsContent value="requirements" className="space-y-6">
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900 flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    Job Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {job.requiredSkills && job.requiredSkills.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {job.requiredSkills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-4 bg-gray-50 rounded-[10px]"
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">
                            {skill}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">
                        No specific requirements listed.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900 flex items-center gap-3">
                    <Target className="w-6 h-6 text-blue-600" />
                    Required Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {job.requiredSkills && job.requiredSkills.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {job.requiredSkills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-4 bg-blue-50 rounded-[10px]"
                        >
                          <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">
                            {skill}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">
                        No skills specified.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tags" className="space-y-6">
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900 flex items-center gap-3">
                    <Tag className="w-6 h-6 text-purple-600" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {job.tags && job.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {job.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="px-4 py-2 text-xs md:text-sm font-medium border-purple-200 text-purple-700 bg-purple-50"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">
                        No tags available.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="apply" className="space-y-6">
              {isApplying ? (
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader>
                    <CardTitle className="text-2xl text-gray-900 flex items-center gap-3">
                      <Send className="w-6 h-6 text-blue-600" />
                      Apply for {job.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="space-y-6">
                      <div>
                        <Label
                          htmlFor="coverLetter"
                          className="text-base font-medium"
                        >
                          Cover Letter
                        </Label>
                        <Textarea
                          id="coverLetter"
                          placeholder="Tell us why you're interested in this position..."
                          value={applicationData.coverLetter}
                          onChange={(e) =>
                            handleInputChange("coverLetter", e.target.value)
                          }
                          rows={6}
                          className="mt-2"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label
                            htmlFor="expectedSalary"
                            className="text-base font-medium"
                          >
                            Expected Salary
                          </Label>
                          <Input
                            id="expectedSalary"
                            placeholder="e.g., £70,000"
                            value={applicationData.expectedSalary}
                            onChange={(e) =>
                              handleInputChange(
                                "expectedSalary",
                                e.target.value
                              )
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="startDate"
                            className="text-base font-medium"
                          >
                            Available Start Date
                          </Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={applicationData.startDate}
                            onChange={(e) =>
                              handleInputChange("startDate", e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label
                            htmlFor="linkedin"
                            className="text-base font-medium"
                          >
                            LinkedIn Profile
                          </Label>
                          <Input
                            id="linkedin"
                            placeholder="https://linkedin.com/in/yourprofile"
                            value={applicationData.linkedin}
                            onChange={(e) =>
                              handleInputChange("linkedin", e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="github"
                            className="text-base font-medium"
                          >
                            GitHub Profile
                          </Label>
                          <Input
                            id="github"
                            placeholder="https://github.com/yourusername"
                            value={applicationData.github}
                            onChange={(e) =>
                              handleInputChange("github", e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="portfolio"
                          className="text-base font-medium"
                        >
                          Portfolio/Website
                        </Label>
                        <Input
                          id="portfolio"
                          placeholder="https://yourportfolio.com"
                          value={applicationData.portfolio}
                          onChange={(e) =>
                            handleInputChange("portfolio", e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-[10px]">
                        <Checkbox
                          id="agreeToTerms"
                          checked={applicationData.agreeToTerms}
                          onCheckedChange={(checked) =>
                            handleInputChange("agreeToTerms", checked)
                          }
                        />
                        <Label
                          htmlFor="agreeToTerms"
                          className="text-sm text-gray-700"
                        >
                          I agree to the terms and conditions
                        </Label>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        onClick={handleApply}
                        disabled={!applicationData.agreeToTerms}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium"
                      >
                        <Send className="w-5 h-5 mr-2" />
                        Submit Application
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsApplying(false)}
                        className="px-8 py-3 text-lg font-medium"
                      >
                        <X className="w-5 h-5 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-lg bg-white">
                  <CardContent className="p-16 text-center">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Send className="w-12 h-12 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Ready to Apply?
                    </h3>
                    <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                      Click the button below to start your application for this
                      position.
                    </p>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium"
                      onClick={() => setIsApplying(true)}
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Start Application
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
