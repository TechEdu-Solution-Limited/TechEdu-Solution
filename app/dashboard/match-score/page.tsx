"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Target,
  TrendingUp,
  Star,
  Clock,
  Plus,
  Edit,
  Download,
  Share2,
  RefreshCw,
  BookOpen,
  Code,
  Building,
  Globe,
  Shield,
  Database,
  Cloud,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  ExternalLink,
  BarChart3,
  Zap,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Award,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  Briefcase,
  Filter,
  Search,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";

interface JobMatch {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  postedDate: string;
  matchScore: number;
  overallScore: number;
  skillMatch: number;
  experienceMatch: number;
  cultureMatch: number;
  locationMatch: number;
  salaryMatch: number;
  matchedSkills: string[];
  missingSkills: string[];
  requiredSkills: string[];
  experience: {
    required: string;
    yourLevel: string;
    match: number;
  };
  culture: {
    companySize: string;
    workStyle: string;
    values: string[];
    match: number;
  };
  benefits: string[];
  applicationStatus:
    | "not-applied"
    | "applied"
    | "interviewing"
    | "offered"
    | "rejected";
  lastUpdated: string;
}

interface MatchInsight {
  id: string;
  category: string;
  title: string;
  description: string;
  impact: "positive" | "negative" | "neutral";
  recommendations: string[];
  data: any;
}

interface SkillAlignment {
  skill: string;
  jobDemand: number;
  yourLevel: number;
  match: number;
  priority: "high" | "medium" | "low";
  trend: "up" | "down" | "stable";
}

export default function MatchScorePage() {
  const { userData } = useRole();
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [insights, setInsights] = useState<MatchInsight[]>([]);
  const [skillAlignments, setSkillAlignments] = useState<SkillAlignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("matchScore");

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockJobMatches: JobMatch[] = [
      {
        id: "1",
        jobTitle: "Senior Software Engineer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        salary: "$130,000 - $160,000",
        postedDate: "2024-01-18",
        matchScore: 92,
        overallScore: 88,
        skillMatch: 95,
        experienceMatch: 90,
        cultureMatch: 85,
        locationMatch: 80,
        salaryMatch: 90,
        matchedSkills: [
          "JavaScript",
          "React",
          "Node.js",
          "AWS",
          "TypeScript",
          "Docker",
        ],
        missingSkills: ["Kubernetes", "GraphQL"],
        requiredSkills: [
          "JavaScript",
          "React",
          "Node.js",
          "AWS",
          "TypeScript",
          "Docker",
          "Kubernetes",
          "GraphQL",
        ],
        experience: {
          required: "5+ years",
          yourLevel: "6 years",
          match: 90,
        },
        culture: {
          companySize: "500-1000 employees",
          workStyle: "Hybrid",
          values: ["Innovation", "Collaboration", "Growth"],
          match: 85,
        },
        benefits: ["Health Insurance", "401k", "Stock Options", "Flexible PTO"],
        applicationStatus: "not-applied",
        lastUpdated: "2024-01-20",
      },
      {
        id: "2",
        jobTitle: "Full Stack Developer",
        company: "StartupXYZ",
        location: "Austin, TX",
        salary: "$110,000 - $140,000",
        postedDate: "2024-01-16",
        matchScore: 87,
        overallScore: 82,
        skillMatch: 88,
        experienceMatch: 85,
        cultureMatch: 90,
        locationMatch: 75,
        salaryMatch: 85,
        matchedSkills: ["JavaScript", "React", "Node.js", "MongoDB", "Express"],
        missingSkills: ["TypeScript", "Docker", "AWS"],
        requiredSkills: [
          "JavaScript",
          "React",
          "Node.js",
          "MongoDB",
          "Express",
          "TypeScript",
          "Docker",
        ],
        experience: {
          required: "3+ years",
          yourLevel: "6 years",
          match: 85,
        },
        culture: {
          companySize: "50-100 employees",
          workStyle: "Remote-first",
          values: ["Innovation", "Autonomy", "Fast-paced"],
          match: 90,
        },
        benefits: [
          "Health Insurance",
          "Unlimited PTO",
          "Remote Work",
          "Learning Budget",
        ],
        applicationStatus: "applied",
        lastUpdated: "2024-01-19",
      },
      {
        id: "3",
        jobTitle: "Frontend Engineer",
        company: "BigTech Company",
        location: "Seattle, WA",
        salary: "$120,000 - $150,000",
        postedDate: "2024-01-19",
        matchScore: 78,
        overallScore: 75,
        skillMatch: 80,
        experienceMatch: 70,
        cultureMatch: 75,
        locationMatch: 60,
        salaryMatch: 85,
        matchedSkills: ["JavaScript", "React", "HTML", "CSS", "TypeScript"],
        missingSkills: ["Next.js", "GraphQL", "Testing"],
        requiredSkills: [
          "JavaScript",
          "React",
          "HTML",
          "CSS",
          "TypeScript",
          "Next.js",
          "GraphQL",
        ],
        experience: {
          required: "4+ years",
          yourLevel: "6 years",
          match: 70,
        },
        culture: {
          companySize: "10,000+ employees",
          workStyle: "Hybrid",
          values: ["Excellence", "Innovation", "Diversity"],
          match: 75,
        },
        benefits: [
          "Health Insurance",
          "401k",
          "Stock Options",
          "Gym Membership",
        ],
        applicationStatus: "not-applied",
        lastUpdated: "2024-01-20",
      },
      {
        id: "4",
        jobTitle: "DevOps Engineer",
        company: "CloudTech Solutions",
        location: "Remote",
        salary: "$125,000 - $155,000",
        postedDate: "2024-01-17",
        matchScore: 85,
        overallScore: 80,
        skillMatch: 82,
        experienceMatch: 85,
        cultureMatch: 88,
        locationMatch: 95,
        salaryMatch: 90,
        matchedSkills: ["AWS", "Docker", "Linux", "CI/CD", "Python"],
        missingSkills: ["Kubernetes", "Terraform", "Ansible"],
        requiredSkills: [
          "AWS",
          "Docker",
          "Linux",
          "CI/CD",
          "Python",
          "Kubernetes",
          "Terraform",
        ],
        experience: {
          required: "4+ years",
          yourLevel: "6 years",
          match: 85,
        },
        culture: {
          companySize: "200-500 employees",
          workStyle: "Remote",
          values: ["Innovation", "Work-life balance", "Continuous learning"],
          match: 88,
        },
        benefits: [
          "Health Insurance",
          "401k",
          "Remote Work",
          "Conference Budget",
        ],
        applicationStatus: "interviewing",
        lastUpdated: "2024-01-20",
      },
    ];

    const mockInsights: MatchInsight[] = [
      {
        id: "1",
        category: "Skill Gap",
        title: "Kubernetes Skills in High Demand",
        description:
          "Kubernetes appears in 60% of your target jobs but is missing from your profile.",
        impact: "negative",
        recommendations: [
          "Complete Kubernetes certification",
          "Build containerized applications",
          "Practice with minikube or kind",
        ],
        data: { demand: 60, yourLevel: 0, gap: 60 },
      },
      {
        id: "2",
        category: "Location Preference",
        title: "Remote Opportunities Abound",
        description:
          "Your location flexibility opens up 40% more job opportunities.",
        impact: "positive",
        recommendations: [
          "Focus on remote-first companies",
          "Highlight remote work experience",
          "Emphasize communication skills",
        ],
        data: { remoteJobs: 40, totalOpportunities: 100 },
      },
      {
        id: "3",
        category: "Salary Range",
        title: "Competitive Salary Expectations",
        description:
          "Your salary expectations align well with current market rates.",
        impact: "positive",
        recommendations: [
          "Maintain current salary expectations",
          "Research company-specific ranges",
          "Consider total compensation package",
        ],
        data: { marketAverage: 130000, yourRange: "120000-150000" },
      },
    ];

    const mockSkillAlignments: SkillAlignment[] = [
      {
        skill: "JavaScript",
        jobDemand: 95,
        yourLevel: 90,
        match: 95,
        priority: "high",
        trend: "stable",
      },
      {
        skill: "React",
        jobDemand: 88,
        yourLevel: 85,
        match: 88,
        priority: "high",
        trend: "up",
      },
      {
        skill: "TypeScript",
        jobDemand: 82,
        yourLevel: 70,
        match: 75,
        priority: "high",
        trend: "up",
      },
      {
        skill: "AWS",
        jobDemand: 78,
        yourLevel: 75,
        match: 78,
        priority: "medium",
        trend: "up",
      },
      {
        skill: "Docker",
        jobDemand: 72,
        yourLevel: 65,
        match: 70,
        priority: "medium",
        trend: "up",
      },
      {
        skill: "Kubernetes",
        jobDemand: 68,
        yourLevel: 30,
        match: 35,
        priority: "high",
        trend: "up",
      },
    ];

    setTimeout(() => {
      setJobMatches(mockJobMatches);
      setInsights(mockInsights);
      setSkillAlignments(mockSkillAlignments);
      setLoading(false);
    }, 1000);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-green-100";
    if (score >= 80) return "bg-blue-100";
    if (score >= 70) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "interviewing":
        return "bg-yellow-100 text-yellow-800";
      case "offered":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      case "neutral":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return TrendingUp;
      case "down":
        return TrendingUp; // Rotate 180deg in CSS
      default:
        return BarChart3;
    }
  };

  const filteredJobs =
    selectedFilter === "all"
      ? jobMatches
      : jobMatches.filter((job) => job.applicationStatus === selectedFilter);

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case "matchScore":
        return b.matchScore - a.matchScore;
      case "salary":
        return (
          parseInt(b.salary.split("-")[1].replace(/[^0-9]/g, "")) -
          parseInt(a.salary.split("-")[1].replace(/[^0-9]/g, ""))
        );
      case "postedDate":
        return (
          new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        );
      default:
        return b.matchScore - a.matchScore;
    }
  });

  const averageMatchScore =
    jobMatches.length > 0
      ? jobMatches.reduce((sum, job) => sum + job.matchScore, 0) /
        jobMatches.length
      : 0;

  const highMatchJobs = jobMatches.filter((job) => job.matchScore >= 85);
  const appliedJobs = jobMatches.filter(
    (job) => job.applicationStatus !== "not-applied"
  );
  const interviewJobs = jobMatches.filter(
    (job) => job.applicationStatus === "interviewing"
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Match Score</h1>
          <p className="text-gray-600 mt-2">
            AI-powered job matching and compatibility analysis
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Matches
          </Button>
          <Button>
            <Search className="w-4 h-4 mr-2" />
            Find More Jobs
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Match Score
                </p>
                <p
                  className={`text-2xl font-bold ${getScoreColor(
                    averageMatchScore
                  )}`}
                >
                  {averageMatchScore.toFixed(0)}%
                </p>
              </div>
              <div
                className={`p-2 rounded-[10px] ${getScoreBgColor(
                  averageMatchScore
                )}`}
              >
                <Target
                  className={`w-6 h-6 ${getScoreColor(averageMatchScore)}`}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  High Match Jobs
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {highMatchJobs.length}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-[10px]">
                <Star className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Applied Jobs
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {appliedJobs.length}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  In Interviews
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {interviewJobs.length}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-[10px]">
                <MessageCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Match Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-blue-600" />
            Match Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {insights.map((insight) => (
              <div key={insight.id} className="p-4 border rounded-[10px]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{insight.title}</h3>
                  <Badge className={getImpactColor(insight.impact)}>
                    {insight.impact}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {insight.description}
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Recommendations:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {insight.recommendations.slice(0, 2).map((rec, index) => (
                      <li key={index} className="flex items-center">
                        <ArrowRight className="w-3 h-3 mr-2 text-blue-500" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skill Alignment */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Alignment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skillAlignments.map((skill) => {
              const TrendIcon = getTrendIcon(skill.trend);
              return (
                <div key={skill.skill} className="p-4 border rounded-[10px]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold">{skill.skill}</h3>
                      <TrendIcon
                        className={`w-4 h-4 ${
                          skill.trend === "up"
                            ? "text-green-500"
                            : skill.trend === "down"
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      />
                    </div>
                    <Badge className={getScoreBgColor(skill.match)}>
                      {skill.match}% match
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Job Demand</p>
                      <p className="font-medium">{skill.jobDemand}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Your Level</p>
                      <p className="font-medium">{skill.yourLevel}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Match</p>
                      <p
                        className={`font-medium ${getScoreColor(skill.match)}`}
                      >
                        {skill.match}%
                      </p>
                    </div>
                  </div>
                  <Progress value={skill.match} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Job Matches */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Job Matches</CardTitle>
            <div className="flex space-x-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-1 border rounded text-sm"
              >
                <option value="all">All Jobs</option>
                <option value="not-applied">Not Applied</option>
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offered">Offered</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border rounded text-sm"
              >
                <option value="matchScore">Sort by Match Score</option>
                <option value="salary">Sort by Salary</option>
                <option value="postedDate">Sort by Date Posted</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedJobs.map((job) => (
              <JobMatchCard key={job.id} job={job} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function JobMatchCard({ job }: { job: JobMatch }) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-green-100";
    if (score >= 80) return "bg-blue-100";
    if (score >= 70) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "interviewing":
        return "bg-yellow-100 text-yellow-800";
      case "offered":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{job.jobTitle}</h3>
              <p className="text-gray-600">{job.company}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                className={`${getScoreBgColor(job.matchScore)} ${getScoreColor(
                  job.matchScore
                )}`}
              >
                {job.matchScore}% match
              </Badge>
              <Badge className={getStatusColor(job.applicationStatus)}>
                {job.applicationStatus.replace("-", " ")}
              </Badge>
            </div>
          </div>

          {/* Location and Salary */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gray-500" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
              <span>{job.salary}</span>
            </div>
          </div>

          {/* Match Breakdown */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Match Breakdown:</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Skills:</span>
                <span
                  className={`font-medium ${getScoreColor(job.skillMatch)}`}
                >
                  {job.skillMatch}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Experience:</span>
                <span
                  className={`font-medium ${getScoreColor(
                    job.experienceMatch
                  )}`}
                >
                  {job.experienceMatch}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Culture:</span>
                <span
                  className={`font-medium ${getScoreColor(job.cultureMatch)}`}
                >
                  {job.cultureMatch}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Location:</span>
                <span
                  className={`font-medium ${getScoreColor(job.locationMatch)}`}
                >
                  {job.locationMatch}%
                </span>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <p className="text-sm font-medium mb-2">Matched Skills:</p>
            <div className="flex flex-wrap gap-1">
              {job.matchedSkills.slice(0, 4).map((skill) => (
                <Badge
                  key={skill}
                  className="bg-green-100 text-green-800 text-xs"
                >
                  {skill}
                </Badge>
              ))}
              {job.matchedSkills.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{job.matchedSkills.length - 4} more
                </Badge>
              )}
            </div>
          </div>

          {job.missingSkills.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Missing Skills:</p>
              <div className="flex flex-wrap gap-1">
                {job.missingSkills.slice(0, 3).map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="text-red-600 border-red-300 text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
                {job.missingSkills.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{job.missingSkills.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2 pt-4 border-t">
            <Button size="sm" className="flex-1">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Job
            </Button>
            {job.applicationStatus === "not-applied" && (
              <Button size="sm" variant="outline">
                <CheckCircle className="w-4 h-4 mr-2" />
                Apply
              </Button>
            )}
            <Button size="sm" variant="outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
