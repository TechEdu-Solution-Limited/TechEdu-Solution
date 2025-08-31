"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Clock,
  DollarSign,
  Users,
  Briefcase,
  Bookmark,
  BookmarkX,
  Calendar,
  Clock as ClockIcon,
  AlertCircle,
  Globe,
  Mail,
  Phone,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Job, AppliedJob } from "@/types/jobs";
import { getApiRequest } from "@/lib/apiFetch";
import { getCookie } from "@/lib/cookies";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-mobile";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedFilters, setSelectedFilters] = useState({
    location: "all-locations",
    type: "all-types",
    experience: "all-levels",
    salary: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10);

  const isTablet = useMediaQuery("(max-width: 1024px)");

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

        // Set first job as selected by default
        if (transformedJobs.length > 0 && !isTablet) {
          setSelectedJob(transformedJobs[0]);
        }
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

  const handleJobClick = (job: Job) => {
    if (isTablet) {
      // On tablet/mobile, route to single job page
      window.location.href = `/career-connect/list-jobs/${job._id}`;
    } else {
      // On desktop, set selected job for view card
      setSelectedJob(job);
    }
  };

  // if (loading) {
  //   return (
  //     <div className="container mx-auto px-4 py-8">
  //       <div className="animate-pulse">
  //         <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
  //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //           {[...Array(6)].map((_, i) => (
  //             <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="container mx-auto px-4 py-8">
  //       <div className="text-center">
  //         <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
  //         <h2 className="text-xl font-semibold text-gray-900 mb-2">
  //           Error Loading Jobs
  //         </h2>
  //         <p className="text-gray-600 mb-4">{error}</p>
  //         <Button onClick={fetchJobs} variant="outline">
  //           Try Again
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      {/* Header - Always visible */}
      <header className="mx-auto px-4 md:px-16 pt-24 pb-16 flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#0D1140] via-[#1e3a8a] to-[#0D1140] h-full w-full md:h-[80vh]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white pb-6 leading-tight pt-12">
            Find Your Dream Tech Job
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover thousands of opportunities from top tech companies. From
            startups to enterprise, find the perfect role that matches your
            skills and career goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="text-white font-medium">Remote & On-site</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-white font-medium">Verified Companies</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="text-white font-medium">Fast Apply</span>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters - Always visible */}
      <div className="py-8 space-y-4 px-4 md:px-16 mx-auto relative w-full">
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
            <SelectContent className="bg-white">
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
            <SelectContent className="bg-white">
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
            <SelectContent className="bg-white">
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

      {/* Jobs List with View Card - Shows loading state only for jobs */}
      <div className="px-4 md:px-16 mx-auto mb-10">
        {loading ? (
          // Loading state only for jobs section
          <div className="space-y-4">
            <div className="mb-6">
              <p className="text-gray-600">Loading jobs...</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Loading skeleton for jobs list */}
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-48"></div>
                            <div className="h-3 bg-gray-200 rounded w-32"></div>
                          </div>
                        </div>
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                        <div className="h-6 bg-gray-200 rounded w-14"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Loading skeleton for view card */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <Card className="animate-pulse">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-5 bg-gray-200 rounded w-40"></div>
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="h-4 bg-gray-200 rounded w-full"
                          ></div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          // Error state only for jobs section
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error Loading Jobs
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchJobs} variant="outline">
              Try Again
            </Button>
          </div>
        ) : filteredJobs.length === 0 ? (
          // No jobs found state
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
          // Jobs content
          <>
            {/* Jobs Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {(currentPage - 1) * jobsPerPage + 1}-
                {Math.min(currentPage * jobsPerPage, filteredJobs.length)} of{" "}
                {filteredJobs.length} jobs
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Jobs List - Left Side */}
              <div className="space-y-4">
                {filteredJobs
                  .slice(
                    (currentPage - 1) * jobsPerPage,
                    currentPage * jobsPerPage
                  )
                  .map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      isSelected={selectedJob?._id === job._id}
                      onClick={() => handleJobClick(job)}
                    />
                  ))}
              </div>

              {/* Sticky View Card - Right Side (Desktop Only) */}
              {!isTablet && (
                <div className="lg:col-span-1">
                  <div className="sticky top-8">
                    {selectedJob ? (
                      <JobViewCard job={selectedJob} />
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Select a Job
                        </h3>
                        <p className="text-gray-500">
                          Click on any job to view its details here
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {Math.ceil(filteredJobs.length / jobsPerPage) > 1 && (
              <div className="mt-8 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center space-x-1">
                    {Array.from(
                      { length: Math.ceil(filteredJobs.length / jobsPerPage) },
                      (_, index) => {
                        const pageNumber = index + 1;
                        const isCurrentPage = pageNumber === currentPage;

                        if (
                          pageNumber === 1 ||
                          pageNumber ===
                            Math.ceil(filteredJobs.length / jobsPerPage) ||
                          (pageNumber >= currentPage - 1 &&
                            pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={pageNumber}
                              variant={isCurrentPage ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNumber)}
                              className="min-w-[40px]"
                            >
                              {pageNumber}
                            </Button>
                          );
                        } else if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return (
                            <span
                              key={pageNumber}
                              className="px-2 text-gray-500"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      }
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          Math.ceil(filteredJobs.length / jobsPerPage),
                          prev + 1
                        )
                      )
                    }
                    disabled={
                      currentPage ===
                      Math.ceil(filteredJobs.length / jobsPerPage)
                    }
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

// Job Card Component
function JobCard({
  job,
  isSelected,
  onClick,
}: {
  job: Job;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={onClick}
    >
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
              <BookmarkX size={30} className="h-10 w-10" />
            ) : (
              <Bookmark size={30} className="h-10 w-10" />
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
          {/* <Button
            className="w-full text-white hover:text-black"
            size="sm"
            asChild
          >
            <Link href={`/career-connect/list-jobs/${job._id}/apply`}>
              Apply Now
            </Link>
          </Button> */}
          <Button variant="outline" size="sm" asChild>
            <Link href={`/career-connect/list-jobs/${job._id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Job View Card Component (Right Side)
function JobViewCard({ job }: { job: Job }) {
  return (
    <Card className="sticky top-8">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={job.companyLogo || "/assets/logo.png"}
              alt={job.company}
            />
            <AvatarFallback className="text-lg">
              {job.company?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">
              {job.title}
            </CardTitle>
            <p className="text-lg font-semibold text-blue-600">{job.company}</p>
            {job.department && (
              <p className="text-sm text-gray-600">{job.department}</p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Info */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{job.employmentType}</span>
          </div>
          {job.experienceLevel && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{job.experienceLevel}</span>
            </div>
          )}
          {job.salaryRange && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <DollarSign className="h-4 w-4" />
              <span>{job.salaryRange}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Job Description</h4>
          <p className="text-gray-700 text-sm leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Required Skills */}
        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Required Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Company Contact Info */}
        {(job.contactEmail || job.contactPhone || job.website) && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Contact Information
            </h4>
            <div className="space-y-2 text-sm">
              {job.contactEmail && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{job.contactEmail}</span>
                </div>
              )}
              {job.contactPhone && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{job.contactPhone}</span>
                </div>
              )}
              {job.website && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Globe className="h-4 w-4" />
                  <a
                    href={job.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Job Details */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Job Details</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Posted:</span>
              <span>{new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
            {job.expiryDate && (
              <div className="flex justify-between">
                <span>Expires:</span>
                <span>{new Date(job.expiryDate).toLocaleDateString()}</span>
              </div>
            )}
            {job.isUrgent && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Urgent Hiring</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Link href={`/career-connect/list-jobs/${job._id}/apply`}>
            <Button className="w-full bg-[#0D1140] hover:bg-blue-700 text-white">
              <ExternalLink className="h-4 w-4 mr-2" />
              Apply Now
            </Button>
          </Link>
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/career-connect/list-jobs/${job._id}`}>
              View Full Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
