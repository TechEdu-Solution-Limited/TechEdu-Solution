"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  MapPin,
  Building2,
  Clock,
  DollarSign,
  Users,
  Eye,
  Briefcase,
  Star,
  Bookmark,
  BookmarkX,
  Calendar,
  CheckCircle,
  Clock as ClockIcon,
  XCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Job, AppliedJob } from "@/types/jobs";
import { getApiRequest } from "@/lib/apiFetch";
import { getCookie } from "@/lib/cookies";
import Link from "next/link";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    location: "all-locations",
    type: "all-types",
    experience: "all-levels",
    salary: "",
  });

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getCookie("token");

      if (!token) {
        setError("Authentication required");
        return;
      }

      // Use getApiRequest to call the external API endpoint
      const response = await getApiRequest<{
        success: boolean;
        message: string;
        data: any[];
        meta?: any;
      }>("/api/ats/job-posts", token);

      if (response.status >= 200 && response.status < 300) {
        // Handle the actual API response structure
        const jobsData = response.data?.data || [];

        // Transform the API data to match our Job interface
        const transformedJobs = jobsData.map((job: any) => ({
          _id: job._id,
          title: job.title,
          description: job.description,
          location: job.location,
          employmentType: job.employmentType,
          requiredSkills: job.requiredSkills || [],
          tags: job.tags || [],
          salaryRange: job.salaryRange || "",
          company: job.companyName || job.companyId?.name || "", // Use companyName or fallback to companyId.name
          companyId: job.companyId?._id || "", // Extract company ID from nested object
          department: job.department || "",
          contactEmail: job.contactEmail || "",
          contactPhone: job.contactPhone || "",
          website: job.website || "",
          recruiter: job.recruiter || "",
          isFeatured: job.isFeatured || false,
          isUrgent: job.isUrgent || false,
          expiryDate: job.expiryDate || "",
          isDeleted: job.isDeleted || false,
          deletedAt: job.deletedAt || "",
          createdAt: job.createdAt,
          updatedAt: job.updatedAt,
          slug: job.slug || "",
          // Additional fields from API
          experienceLevel: job.experienceLevel || "",
          companyLogo: job.companyLogo || "",
          version: job.version || 1,
          previousVersions: job.previousVersions || [],
          recruiterId: job.recruiterId || "",
        }));
        setJobs(transformedJobs);
      } else {
        setError(response.message || "Failed to fetch jobs");
      }
    } catch (error: any) {
      console.error("❌ Error fetching jobs:", error);
      setError(error.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  // Fetch applied jobs (you can implement this when you have the API endpoint)
  const fetchAppliedJobs = async () => {
    // TODO: Implement when you have the applied jobs API endpoint
    setAppliedJobs([]);
  };

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, []);

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.company?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      !selectedFilters.location ||
      selectedFilters.location === "all-locations" ||
      job.location === selectedFilters.location;

    const matchesType =
      !selectedFilters.type ||
      selectedFilters.type === "all-types" ||
      job.employmentType === selectedFilters.type;

    const matchesExperience =
      !selectedFilters.experience ||
      selectedFilters.experience === "all-levels" ||
      job.experienceLevel === selectedFilters.experience;

    const matchesSalary =
      !selectedFilters.salary ||
      job.salaryRange.includes(selectedFilters.salary);

    return (
      matchesSearch &&
      matchesLocation &&
      matchesType &&
      matchesExperience &&
      matchesSalary
    );
  });

  // Get unique values for filters
  const uniqueLocations = [...new Set(jobs.map((job) => job.location))];
  const uniqueTypes = [...new Set(jobs.map((job) => job.employmentType))];
  const uniqueExperienceLevels = [
    ...new Set(jobs.map((job) => job.experienceLevel).filter(Boolean)),
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Jobs
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchJobs} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Find Your Next Opportunity
        </h1>
        <p className="text-gray-600">
          Discover and apply to the best tech jobs in the industry
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search jobs, companies, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 text-lg"
          />
        </div>

        {/* Filter Options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Select
            value={selectedFilters.location}
            onValueChange={(value) =>
              setSelectedFilters((prev) => ({ ...prev, location: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-locations">All Locations</SelectItem>
              {uniqueLocations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedFilters.type}
            onValueChange={(value) =>
              setSelectedFilters((prev) => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-types">All Types</SelectItem>
              {uniqueTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedFilters.experience}
            onValueChange={(value) =>
              setSelectedFilters((prev) => ({ ...prev, experience: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-levels">All Levels</SelectItem>
              {uniqueExperienceLevels.map((level) => (
                <SelectItem key={level} value={level || "unknown"}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" className="w-full">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Jobs Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            All Jobs ({filteredJobs.length})
          </TabsTrigger>
          <TabsTrigger value="applied">
            Applied ({appliedJobs.length})
          </TabsTrigger>
          <TabsTrigger value="saved">Saved (0)</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="applied" className="space-y-6">
          {appliedJobs.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No applications yet
              </h3>
              <p className="text-gray-500">
                Start applying to jobs to see them here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appliedJobs.map((job) => (
                <AppliedJobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <div className="text-center py-12">
            <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No saved jobs
            </h3>
            <p className="text-gray-500">
              Save interesting jobs to view them later
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Job Card Component
function JobCard({ job }: { job: Job }) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={job.companyLogo || "/assets/logo.png"}
                alt={job.company}
              />
              <AvatarFallback>{job.company?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {job.title}
              </CardTitle>
              <p className="text-gray-600 font-medium">{job.company}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsSaved(!isSaved);
            }}
            className="text-gray-400 hover:text-blue-600"
          >
            {isSaved ? (
              <BookmarkX className="h-5 w-5" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{job.employmentType}</span>
          </div>
        </div>

        <p className="text-gray-700 line-clamp-3">{job.description}</p>

        <div className="flex flex-wrap gap-2">
          {job.requiredSkills.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {job.requiredSkills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{job.requiredSkills.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-gray-900">
              {job.salaryRange}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 gap-2">
          <Button
            className="w-full text-white hover:text-black"
            size="sm"
            asChild
          >
            <Link href={`/dashboard/jobs/${job._id}/apply`}>Apply Now</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/jobs/${job._id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Applied Job Card Component
function AppliedJobCard({ job }: { job: AppliedJob }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied":
        return <ClockIcon className="h-4 w-4 text-blue-600" />;
      case "reviewing":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "shortlisted":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "interviewed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "offered":
        return <Star className="h-4 w-4 text-purple-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "reviewing":
        return "bg-yellow-100 text-yellow-800";
      case "shortlisted":
        return "bg-green-100 text-green-800";
      case "interviewed":
        return "bg-green-100 text-green-800";
      case "offered":
        return "bg-purple-100 text-purple-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={job.companyLogo || "/assets/logo.png"}
                alt={job.company}
              />
              <AvatarFallback>{job.company?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {job.title}
              </CardTitle>
              <p className="text-gray-600 font-medium">{job.company}</p>
            </div>
          </div>
          <Badge className={getStatusColor(job.applicationStatus)}>
            <div className="flex items-center space-x-1">
              {getStatusIcon(job.applicationStatus)}
              <span className="capitalize">{job.applicationStatus}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{job.employmentType}</span>
          </div>
        </div>

        <p className="text-gray-700 line-clamp-3">{job.description}</p>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Applied: {new Date(job.applicationDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-600">
              Application ID: {job.applicationId}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a href={`/dashboard/jobs/${job._id}`}>View Details</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
