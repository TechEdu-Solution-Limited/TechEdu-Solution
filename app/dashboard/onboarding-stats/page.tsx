"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Filter,
  Eye,
  Edit,
  Share2,
  ArrowUp,
  ArrowDown,
  Star,
  Award,
  Trophy,
  Medal,
  GraduationCap,
  BookOpen,
  School,
  Building2,
  Globe,
  MapPin,
  DollarSign,
  Briefcase,
  Brain,
  Rocket,
  Zap,
  Activity,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  MessageCircle,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";

interface OnboardingMetrics {
  totalApplications: number;
  applicationsThisMonth: number;
  applicationsLastMonth: number;
  conversionRate: number;
  conversionRateLastMonth: number;
  averageTimeToComplete: number;
  averageTimeLastMonth: number;
  completionRate: number;
  completionRateLastMonth: number;
  dropoffRate: number;
  dropoffRateLastMonth: number;
  totalEnrollments: number;
  enrollmentsThisMonth: number;
  enrollmentsLastMonth: number;
}

interface OnboardingStage {
  id: string;
  name: string;
  description: string;
  totalStarted: number;
  totalCompleted: number;
  averageTime: number;
  dropoffRate: number;
  conversionRate: number;
  status: "excellent" | "good" | "average" | "needs-improvement";
}

interface OnboardingTrend {
  date: string;
  applications: number;
  completions: number;
  enrollments: number;
  conversionRate: number;
}

interface ProgramPerformance {
  id: string;
  name: string;
  applications: number;
  completions: number;
  enrollments: number;
  conversionRate: number;
  averageTime: number;
  satisfaction: number;
  status: "excellent" | "good" | "average" | "needs-improvement";
}

interface UserJourney {
  id: string;
  name: string;
  email: string;
  avatar: string;
  program: string;
  startDate: string;
  completionDate: string;
  totalTime: number;
  stages: {
    name: string;
    status: "completed" | "in-progress" | "abandoned";
    timeSpent: number;
    completedAt?: string;
  }[];
  status: "completed" | "in-progress" | "abandoned";
}

export default function OnboardingStatsPage() {
  const { userData } = useRole();
  const [metrics, setMetrics] = useState<OnboardingMetrics | null>(null);
  const [stages, setStages] = useState<OnboardingStage[]>([]);
  const [trends, setTrends] = useState<OnboardingTrend[]>([]);
  const [programs, setPrograms] = useState<ProgramPerformance[]>([]);
  const [userJourneys, setUserJourneys] = useState<UserJourney[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockMetrics: OnboardingMetrics = {
      totalApplications: 2847,
      applicationsThisMonth: 156,
      applicationsLastMonth: 142,
      conversionRate: 78.5,
      conversionRateLastMonth: 75.2,
      averageTimeToComplete: 2.3,
      averageTimeLastMonth: 2.8,
      completionRate: 82.3,
      completionRateLastMonth: 79.1,
      dropoffRate: 17.7,
      dropoffRateLastMonth: 20.9,
      totalEnrollments: 2234,
      enrollmentsThisMonth: 123,
      enrollmentsLastMonth: 107,
    };

    const mockStages: OnboardingStage[] = [
      {
        id: "1",
        name: "Application Form",
        description: "Initial application submission",
        totalStarted: 2847,
        totalCompleted: 2847,
        averageTime: 2,
        dropoffRate: 0,
        conversionRate: 100,
        status: "excellent",
      },
      {
        id: "2",
        name: "Document Upload",
        description: "Upload required documents",
        totalStarted: 2847,
        totalCompleted: 2456,
        averageTime: 5,
        dropoffRate: 13.7,
        conversionRate: 86.3,
        status: "good",
      },
      {
        id: "3",
        name: "Profile Verification",
        description: "Identity and document verification",
        totalStarted: 2456,
        totalCompleted: 2312,
        averageTime: 12,
        dropoffRate: 5.9,
        conversionRate: 94.1,
        status: "excellent",
      },
      {
        id: "4",
        name: "Program Selection",
        description: "Choose academic program",
        totalStarted: 2312,
        totalCompleted: 2189,
        averageTime: 8,
        dropoffRate: 5.3,
        conversionRate: 94.7,
        status: "excellent",
      },
      {
        id: "5",
        name: "Payment Processing",
        description: "Complete payment and enrollment",
        totalStarted: 2189,
        totalCompleted: 2234,
        averageTime: 6,
        dropoffRate: -2.1,
        conversionRate: 102.1,
        status: "excellent",
      },
    ];

    const mockTrends: OnboardingTrend[] = [
      {
        date: "2024-01-01",
        applications: 45,
        completions: 38,
        enrollments: 35,
        conversionRate: 77.8,
      },
      {
        date: "2024-01-08",
        applications: 52,
        completions: 44,
        enrollments: 41,
        conversionRate: 78.8,
      },
      {
        date: "2024-01-15",
        applications: 48,
        completions: 41,
        enrollments: 38,
        conversionRate: 79.2,
      },
      {
        date: "2024-01-22",
        applications: 61,
        completions: 52,
        enrollments: 49,
        conversionRate: 80.3,
      },
      {
        date: "2024-01-29",
        applications: 55,
        completions: 47,
        enrollments: 44,
        conversionRate: 80.0,
      },
      {
        date: "2024-02-05",
        applications: 58,
        completions: 50,
        enrollments: 47,
        conversionRate: 81.0,
      },
      {
        date: "2024-02-12",
        applications: 62,
        completions: 54,
        enrollments: 51,
        conversionRate: 82.3,
      },
    ];

    const mockPrograms: ProgramPerformance[] = [
      {
        id: "1",
        name: "Computer Science",
        applications: 856,
        completions: 712,
        enrollments: 689,
        conversionRate: 80.5,
        averageTime: 2.1,
        satisfaction: 4.8,
        status: "excellent",
      },
      {
        id: "2",
        name: "Data Science",
        applications: 634,
        completions: 521,
        enrollments: 498,
        conversionRate: 78.5,
        averageTime: 2.4,
        satisfaction: 4.6,
        status: "good",
      },
      {
        id: "3",
        name: "Software Engineering",
        applications: 445,
        completions: 378,
        enrollments: 356,
        conversionRate: 80.0,
        averageTime: 2.2,
        satisfaction: 4.7,
        status: "excellent",
      },
      {
        id: "4",
        name: "Cybersecurity",
        applications: 234,
        completions: 198,
        enrollments: 187,
        conversionRate: 79.9,
        averageTime: 2.6,
        satisfaction: 4.5,
        status: "good",
      },
      {
        id: "5",
        name: "Artificial Intelligence",
        applications: 678,
        completions: 547,
        enrollments: 504,
        conversionRate: 74.3,
        averageTime: 2.8,
        satisfaction: 4.4,
        status: "average",
      },
    ];

    const mockUserJourneys: UserJourney[] = [
      {
        id: "1",
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        avatar: "/avatars/sarah.jpg",
        program: "Computer Science",
        startDate: "2024-01-15",
        completionDate: "2024-01-17",
        totalTime: 2.3,
        stages: [
          {
            name: "Application Form",
            status: "completed",
            timeSpent: 0.2,
            completedAt: "2024-01-15",
          },
          {
            name: "Document Upload",
            status: "completed",
            timeSpent: 0.5,
            completedAt: "2024-01-16",
          },
          {
            name: "Profile Verification",
            status: "completed",
            timeSpent: 10.1,
            completedAt: "2024-01-17",
          },
          {
            name: "Program Selection",
            status: "completed",
            timeSpent: 0.3,
            completedAt: "2024-01-17",
          },
          {
            name: "Payment Processing",
            status: "completed",
            timeSpent: 0.2,
            completedAt: "2024-01-17",
          },
        ],
        status: "completed",
      },
      {
        id: "2",
        name: "Mike Chen",
        email: "mike.chen@email.com",
        avatar: "/avatars/mike.jpg",
        program: "Data Science",
        startDate: "2024-01-20",
        completionDate: "2024-01-23",
        totalTime: 3.1,
        stages: [
          {
            name: "Application Form",
            status: "completed",
            timeSpent: 0.3,
            completedAt: "2024-01-20",
          },
          {
            name: "Document Upload",
            status: "completed",
            timeSpent: 0.8,
            completedAt: "2024-01-21",
          },
          {
            name: "Profile Verification",
            status: "completed",
            timeSpent: 10.5,
            completedAt: "2024-01-22",
          },
          {
            name: "Program Selection",
            status: "completed",
            timeSpent: 0.4,
            completedAt: "2024-01-23",
          },
          {
            name: "Payment Processing",
            status: "completed",
            timeSpent: 0.1,
            completedAt: "2024-01-23",
          },
        ],
        status: "completed",
      },
      {
        id: "3",
        name: "Emily Rodriguez",
        email: "emily.rodriguez@email.com",
        avatar: "/avatars/emily.jpg",
        program: "Software Engineering",
        startDate: "2024-01-25",
        completionDate: "",
        totalTime: 1.8,
        stages: [
          {
            name: "Application Form",
            status: "completed",
            timeSpent: 0.2,
            completedAt: "2024-01-25",
          },
          {
            name: "Document Upload",
            status: "completed",
            timeSpent: 0.6,
            completedAt: "2024-01-26",
          },
          {
            name: "Profile Verification",
            status: "in-progress",
            timeSpent: 1,
            completedAt: "",
          },
          {
            name: "Program Selection",
            status: "abandoned",
            timeSpent: 0,
            completedAt: "",
          },
          {
            name: "Payment Processing",
            status: "abandoned",
            timeSpent: 0,
            completedAt: "",
          },
        ],
        status: "in-progress",
      },
    ];

    setTimeout(() => {
      setMetrics(mockMetrics);
      setStages(mockStages);
      setTrends(mockTrends);
      setPrograms(mockPrograms);
      setUserJourneys(mockUserJourneys);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "average":
        return "bg-yellow-100 text-yellow-800";
      case "needs-improvement":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getJourneyStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "abandoned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStageStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "abandoned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUpIcon className="w-4 h-4 text-green-50" />;
    } else if (current < previous) {
      return <TrendingDownIcon className="w-4 h-4 text-red-500" />;
    }
    return <Activity className="w-4 h-4 text-gray-50" />;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-1 animate-pulse"></div>
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

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Onboarding data not available
        </h3>
        <p className="text-gray-600">
          Please contact your administrator for access.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Onboarding Statistics</h1>
          <p className="text-gray-600 mt-2">
            Track and analyze student onboarding performance and conversion
            rates
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Conversion Rate
                </p>
                <p className="text-2xl font-bold">{metrics.conversionRate}%</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(
                    metrics.conversionRate,
                    metrics.conversionRateLastMonth
                  )}
                  <span className="text-sm text-gray-600 ml-1">
                    {metrics.conversionRate > metrics.conversionRateLastMonth
                      ? "+"
                      : ""}
                    {(
                      metrics.conversionRate - metrics.conversionRateLastMonth
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
              <div className="p-2 bg-green-100">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Completion Rate
                </p>
                <p className="text-2xl font-bold">{metrics.completionRate}%</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(
                    metrics.completionRate,
                    metrics.completionRateLastMonth
                  )}
                  <span className="text-sm text-gray-600 ml-1">
                    {metrics.completionRate > metrics.completionRateLastMonth
                      ? "+"
                      : ""}
                    {(
                      metrics.completionRate - metrics.completionRateLastMonth
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
              <div className="p-2 bg-blue-100">
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
                  Avg. Completion Time
                </p>
                <p className="text-2xl font-bold">
                  {metrics.averageTimeToComplete} days
                </p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(
                    metrics.averageTimeLastMonth,
                    metrics.averageTimeToComplete
                  )}
                  <span className="text-sm text-gray-600 ml-1">
                    {metrics.averageTimeToComplete <
                    metrics.averageTimeLastMonth
                      ? "-"
                      : "+"}
                    {Math.abs(
                      metrics.averageTimeToComplete -
                        metrics.averageTimeLastMonth
                    ).toFixed(1)}{" "}
                    days
                  </span>
                </div>
              </div>
              <div className="p-2 bg-purple-100">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Dropoff Rate
                </p>
                <p className="text-2xl font-bold">{metrics.dropoffRate}%</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(
                    metrics.dropoffRateLastMonth,
                    metrics.dropoffRate
                  )}
                  <span className="text-sm text-gray-600 ml-1">
                    {metrics.dropoffRate < metrics.dropoffRateLastMonth
                      ? "-"
                      : "+"}
                    {Math.abs(
                      metrics.dropoffRate - metrics.dropoffRateLastMonth
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
              <div className="p-2 bg-red-100">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stages">Stages</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="journeys">User Journeys</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overall Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2">
                    <div>
                      <span className="text-gray-600">Total Applications:</span>
                      <span className="ml-2 font-medium">
                        {metrics.totalApplications.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">This Month:</span>
                      <span className="ml-2 font-medium">
                        {metrics.applicationsThisMonth}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Enrollments:</span>
                      <span className="ml-2 font-medium">
                        {metrics.totalEnrollments.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">This Month:</span>
                      <span className="ml-2 font-medium">
                        {metrics.enrollmentsThisMonth}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Conversion Rate:</span>
                      <span className="ml-2 font-medium">
                        {metrics.conversionRate}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Completion Rate:</span>
                      <span className="ml-2 font-medium">
                        {metrics.completionRate}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trends.slice(-5).map((trend, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-[10px]"
                    >
                      <div>
                        <h4 className="font-medium">
                          {new Date(trend.date).toLocaleDateString()}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {trend.applications} applications, {trend.enrollments}{" "}
                          enrollments
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">
                          {trend.conversionRate}%
                        </span>
                        <p className="text-xs text-gray-600">Conversion Rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stages" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {stages.map((stage) => (
              <Card
                key={stage.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{stage.name}</h3>
                        <p className="text-gray-600">{stage.description}</p>
                      </div>
                      <Badge className={getStatusColor(stage.status)}>
                        {stage.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2">
                      <div>
                        <span className="text-gray-600">Started:</span>
                        <span className="ml-2 font-medium">
                          {stage.totalStarted.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Completed:</span>
                        <span className="ml-2 font-medium">
                          {stage.totalCompleted.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Conversion:</span>
                        <span className="ml-2 font-medium">
                          {stage.conversionRate}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Avg. Time:</span>
                        <span className="ml-2 font-medium">
                          {stage.averageTime} days
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Conversion Rate</span>
                        <span>{stage.conversionRate}%</span>
                      </div>
                      <Progress value={stage.conversionRate} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Dropoff Rate: {stage.dropoffRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="programs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {programs.map((program) => (
              <Card
                key={program.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {program.name}
                        </h3>
                      </div>
                      <Badge className={getStatusColor(program.status)}>
                        {program.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2">
                      <div>
                        <span className="text-gray-600">Applications:</span>
                        <span className="ml-2 font-medium">
                          {program.applications}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Completions:</span>
                        <span className="ml-2 font-medium">
                          {program.completions}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Enrollments:</span>
                        <span className="ml-2 font-medium">
                          {program.enrollments}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Conversion:</span>
                        <span className="ml-2 font-medium">
                          {program.conversionRate}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Avg. Time:</span>
                        <span className="ml-2 font-medium">
                          {program.averageTime} days
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Satisfaction:</span>
                        <span className="ml-2 font-medium">
                          {program.satisfaction}/5
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Conversion Rate</span>
                        <span>{program.conversionRate}%</span>
                      </div>
                      <Progress
                        value={program.conversionRate}
                        className="h-2"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="journeys" className="space-y-6">
          <div className="space-y-4">
            {userJourneys.map((journey) => (
              <Card
                key={journey.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={journey.avatar} />
                          <AvatarFallback>
                            {journey.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {journey.name}
                          </h3>
                          <p className="text-gray-600">{journey.program}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={getJourneyStatusColor(journey.status)}
                        >
                          {journey.status}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          {journey.totalTime} days total
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3">
                      <div>
                        <span className="text-gray-600">Start Date:</span>
                        <span className="ml-2 font-medium">
                          {new Date(journey.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Completion:</span>
                        <span className="ml-2 font-medium">
                          {journey.completionDate
                            ? new Date(
                                journey.completionDate
                              ).toLocaleDateString()
                            : "In Progress"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Time:</span>
                        <span className="ml-2 font-medium">
                          {journey.totalTime} days
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Stage Progress</h4>
                      <div className="space-y-2">
                        {journey.stages.map((stage, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 border rounded"
                          >
                            <div className="flex items-center space-x-2">
                              <Badge
                                className={getStageStatusColor(stage.status)}
                              >
                                {stage.status}
                              </Badge>
                              <span className="text-sm">{stage.name}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {stage.timeSpent > 0
                                ? `${stage.timeSpent} days`
                                : "Not started"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
