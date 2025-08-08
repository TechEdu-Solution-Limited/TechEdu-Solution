"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
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
  ArrowRight,
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
  Users,
  UserCheck,
  UserX,
  UserPlus,
  FileText,
  Layers,
  Settings,
  Bell,
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Timer,
  CalendarDays,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";

interface UsageMetrics {
  totalActiveUsers: number;
  activeUsersThisMonth: number;
  activeUsersLastMonth: number;
  averageSessionDuration: number;
  averageSessionDurationLastMonth: number;
  pageViews: number;
  pageViewsLastMonth: number;
  bounceRate: number;
  bounceRateLastMonth: number;
  featureAdoption: number;
  featureAdoptionLastMonth: number;
  mobileUsage: number;
  mobileUsageLastMonth: number;
  desktopUsage: number;
  desktopUsageLastMonth: number;
}

interface UsageTrend {
  date: string;
  activeUsers: number;
  sessions: number;
  pageViews: number;
  averageSessionDuration: number;
  bounceRate: number;
}

interface FeatureUsage {
  id: string;
  name: string;
  description: string;
  totalUsers: number;
  activeUsers: number;
  usageRate: number;
  averageTimeSpent: number;
  satisfaction: number;
  status: "popular" | "growing" | "stable" | "declining";
}

interface UserSegment {
  id: string;
  name: string;
  description: string;
  userCount: number;
  percentage: number;
  averageSessionDuration: number;
  featureAdoption: number;
  retentionRate: number;
  status: "high-value" | "medium-value" | "low-value" | "at-risk";
}

interface PlatformUsage {
  id: string;
  platform: string;
  users: number;
  percentage: number;
  averageSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  trend: "up" | "down" | "stable";
}

export default function UsageTrendsPage() {
  const { userData } = useRole();
  const [metrics, setMetrics] = useState<UsageMetrics | null>(null);
  const [trends, setTrends] = useState<UsageTrend[]>([]);
  const [features, setFeatures] = useState<FeatureUsage[]>([]);
  const [segments, setSegments] = useState<UserSegment[]>([]);
  const [platforms, setPlatforms] = useState<PlatformUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockMetrics: UsageMetrics = {
      totalActiveUsers: 2847,
      activeUsersThisMonth: 2156,
      activeUsersLastMonth: 1987,
      averageSessionDuration: 24.5,
      averageSessionDurationLastMonth: 22.3,
      pageViews: 156789,
      pageViewsLastMonth: 142345,
      bounceRate: 32.5,
      bounceRateLastMonth: 35.2,
      featureAdoption: 783,
      featureAdoptionLastMonth: 75.1,
      mobileUsage: 65.2,
      mobileUsageLastMonth: 62.8,
      desktopUsage: 34.8,
      desktopUsageLastMonth: 37.2,
    };

    const mockTrends: UsageTrend[] = [
      {
        date: "2023-10-01",
        activeUsers: 1456,
        sessions: 2345,
        pageViews: 12345,
        averageSessionDuration: 22.1,
        bounceRate: 35.2,
      },
      {
        date: "2023-10-08",
        activeUsers: 1523,
        sessions: 2456,
        pageViews: 13456,
        averageSessionDuration: 23.4,
        bounceRate: 34.1,
      },
      {
        date: "2023-10-15",
        activeUsers: 1589,
        sessions: 2567,
        pageViews: 14567,
        averageSessionDuration: 24.2,
        bounceRate: 33.5,
      },
      {
        date: "2023-10-22",
        activeUsers: 1645,
        sessions: 2678,
        pageViews: 15678,
        averageSessionDuration: 24.8,
        bounceRate: 32.8,
      },
      {
        date: "2023-10-29",
        activeUsers: 1712,
        sessions: 2789,
        pageViews: 16789,
        averageSessionDuration: 25.1,
        bounceRate: 32.1,
      },
      {
        date: "2023-11-05",
        activeUsers: 1789,
        sessions: 2890,
        pageViews: 17890,
        averageSessionDuration: 25.3,
        bounceRate: 31.5,
      },
      {
        date: "2023-11-12",
        activeUsers: 1856,
        sessions: 2991,
        pageViews: 18991,
        averageSessionDuration: 25.6,
        bounceRate: 30.8,
      },
    ];

    const mockFeatures: FeatureUsage[] = [
      {
        id: "1",
        name: "Course Dashboard",
        description: "Main course management interface",
        totalUsers: 2847,
        activeUsers: 2456,
        usageRate: 86.3,
        averageTimeSpent: 15.2,
        satisfaction: 4.6,
        status: "popular",
      },
      {
        id: "2",
        name: "Assignment Submission",
        description: "Submit and track assignments",
        totalUsers: 2847,
        activeUsers: 1987,
        usageRate: 69.8,
        averageTimeSpent: 8.5,
        satisfaction: 4.4,
        status: "growing",
      },
      {
        id: "3",
        name: "Discussion Forums",
        description: "Student and instructor discussions",
        totalUsers: 2847,
        activeUsers: 1678,
        usageRate: 58.9,
        averageTimeSpent: 12.3,
        satisfaction: 4.2,
        status: "stable",
      },
      {
        id: "4",
        name: "Progress Tracking",
        description: "Track academic progress and grades",
        totalUsers: 2847,
        activeUsers: 2234,
        usageRate: 78.5,
        averageTimeSpent: 6.8,
        satisfaction: 4.7,
        status: "popular",
      },
      {
        id: "5",
        name: "Resource Library",
        description: "Access course materials and resources",
        totalUsers: 2847,
        activeUsers: 1890,
        usageRate: 66.4,
        averageTimeSpent: 18.7,
        satisfaction: 4.3,
        status: "growing",
      },
      {
        id: "6",
        name: "Calendar & Scheduling",
        description: "Manage academic calendar and appointments",
        totalUsers: 2847,
        activeUsers: 1456,
        usageRate: 51.1,
        averageTimeSpent: 4.2,
        satisfaction: 4.1,
        status: "declining",
      },
    ];

    const mockSegments: UserSegment[] = [
      {
        id: "1",
        name: "Active Learners",
        description: "Students who engage daily with the platform",
        userCount: 856,
        percentage: 30.1,
        averageSessionDuration: 35.2,
        featureAdoption: 85.3,
        retentionRate: 94.2,
        status: "high-value",
      },
      {
        id: "2",
        name: "Regular Users",
        description: "Students who use the platform 3 times per week",
        userCount: 1234,
        percentage: 43.3,
        averageSessionDuration: 22.1,
        featureAdoption: 72.8,
        retentionRate: 87.5,
        status: "medium-value",
      },
      {
        id: "3",
        name: "Occasional Users",
        description: "Students who use the platform 1 times per week",
        userCount: 567,
        percentage: 19.9,
        averageSessionDuration: 12.8,
        featureAdoption: 45.2,
        retentionRate: 68.9,
        status: "low-value",
      },
      {
        id: "4",
        name: "At-Risk Users",
        description: "Students who haven't used the platform in 2 weeks",
        userCount: 190,
        percentage: 6.7,
        averageSessionDuration: 5.4,
        featureAdoption: 18.7,
        retentionRate: 32.1,
        status: "at-risk",
      },
    ];

    const mockPlatforms: PlatformUsage[] = [
      {
        id: "1",
        platform: "Mobile Web",
        users: 1856,
        percentage: 65.2,
        averageSessionDuration: 180.7,
        bounceRate: 28.5,
        conversionRate: 720.3,
        trend: "up",
      },
      {
        id: "2",
        platform: "Desktop Web",
        users: 991,
        percentage: 34.8,
        averageSessionDuration: 320.1,
        bounceRate: 18.9,
        conversionRate: 850.7,
        trend: "stable",
      },
      {
        id: "3",
        platform: "iOS App",
        users: 456,
        percentage: 16.0,
        averageSessionDuration: 250.3,
        bounceRate: 15.2,
        conversionRate: 890.1,
        trend: "up",
      },
      {
        id: "4",
        platform: "Android App",
        users: 389,
        percentage: 13.7,
        averageSessionDuration: 230.8,
        bounceRate: 16.8,
        conversionRate: 870.4,
        trend: "up",
      },
    ];

    setTimeout(() => {
      setMetrics(mockMetrics);
      setTrends(mockTrends);
      setFeatures(mockFeatures);
      setSegments(mockSegments);
      setPlatforms(mockPlatforms);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high-value":
      case "popular":
        return "bg-green-100 text-green-800";
      case "medium-value":
      case "growing":
        return "bg-blue-100 text-blue-800";
      case "low-value":
      case "stable":
        return "bg-yellow-100 text-yellow-800";
      case "at-risk":
      case "declining":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUpIcon className="w-4 h-4 text-green-50" />;
      case "down":
        return <TrendingDownIcon className="w-4 h-4 text-red-50" />;
      case "stable":
        return <Activity className="w-4 h-4 text-gray-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendIconForMetrics = (current: number, previous: number) => {
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
        <h3 className="text-lg font-semibold mb-2">Data not available</h3>
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
          <h1 className="text-3xl font-bold">Usage Trends</h1>
          <p className="text-gray-600 mt-2">
            Analyze platform usage patterns and user behavior metrics
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
                  Active Users
                </p>
                <p className="text-2xl font-bold">
                  {metrics.activeUsersThisMonth.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  {getTrendIconForMetrics(
                    metrics.activeUsersThisMonth,
                    metrics.activeUsersLastMonth
                  )}
                  <span className="text-sm text-gray-600 ml-1">
                    {metrics.activeUsersThisMonth > metrics.activeUsersLastMonth
                      ? "+"
                      : ""}
                    {(
                      ((metrics.activeUsersThisMonth -
                        metrics.activeUsersLastMonth) /
                        metrics.activeUsersLastMonth) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
              <div className="p-2 bg-blue-100">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg. Session Duration
                </p>
                <p className="text-2xl font-bold">
                  {metrics.averageSessionDuration} min
                </p>
                <div className="flex items-center mt-1">
                  {getTrendIconForMetrics(
                    metrics.averageSessionDuration,
                    metrics.averageSessionDurationLastMonth
                  )}
                  <span className="text-sm text-gray-600 ml-1">
                    {metrics.averageSessionDuration >
                    metrics.averageSessionDurationLastMonth
                      ? "+"
                      : ""}
                    {(
                      ((metrics.averageSessionDuration -
                        metrics.averageSessionDurationLastMonth) /
                        metrics.averageSessionDurationLastMonth) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
              <div className="p-2">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Page Views</p>
                <p className="text-2xl font-bold">
                  {metrics.pageViews.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  {getTrendIconForMetrics(
                    metrics.pageViews,
                    metrics.pageViewsLastMonth
                  )}
                  <span className="text-sm text-gray-600 ml-1">
                    {metrics.pageViews > metrics.pageViewsLastMonth ? "+" : ""}
                    {(
                      ((metrics.pageViews - metrics.pageViewsLastMonth) /
                        metrics.pageViewsLastMonth) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
              <div className="p-2">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                <p className="text-2xl font-bold">{metrics.bounceRate}%</p>
                <div className="flex items-center mt-1">
                  {getTrendIconForMetrics(
                    metrics.bounceRateLastMonth,
                    metrics.bounceRate
                  )}
                  <span className="text-sm text-gray-600 ml-1">
                    {metrics.bounceRate < metrics.bounceRateLastMonth
                      ? "-"
                      : "+"}
                    {Math.abs(
                      ((metrics.bounceRate - metrics.bounceRateLastMonth) /
                        metrics.bounceRateLastMonth) *
                        100
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
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="segments">User Segments</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Usage Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600">Total Active Users:</span>
                      <span className="ml-2 font-medium">
                        {metrics.totalActiveUsers.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Feature Adoption:</span>
                      <span className="ml-2 font-medium">
                        {metrics.featureAdoption}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Mobile Usage:</span>
                      <span className="ml-2 font-medium">
                        {metrics.mobileUsage}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Desktop Usage:</span>
                      <span className="ml-2 font-medium">
                        {metrics.desktopUsage}%
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
                          {trend.activeUsers} active users, {trend.sessions}{" "}
                          sessions
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">
                          {trend.averageSessionDuration} min
                        </span>
                        <p className="text-xs text-gray-600">Avg. Session</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {feature.name}
                        </h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                      <Badge className={getStatusColor(feature.status)}>
                        {feature.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Total Users:</span>
                        <span className="ml-2 font-medium">
                          {feature.totalUsers.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Active Users:</span>
                        <span className="ml-2 font-medium">
                          {feature.activeUsers.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Usage Rate:</span>
                        <span className="ml-2 font-medium">
                          {feature.usageRate}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Avg. Time:</span>
                        <span className="ml-2 font-medium">
                          {feature.averageTimeSpent} min
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Satisfaction:</span>
                        <span className="ml-2 font-medium">
                          {feature.satisfaction}/5
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Usage Rate</span>
                        <span>{feature.usageRate}%</span>
                      </div>
                      <Progress value={feature.usageRate} className="h-2" />
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

        <TabsContent value="segments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {segments.map((segment) => (
              <Card
                key={segment.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {segment.name}
                        </h3>
                        <p className="text-gray-600">{segment.description}</p>
                      </div>
                      <Badge className={getStatusColor(segment.status)}>
                        {segment.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">User Count:</span>
                        <span className="ml-2 font-medium">
                          {segment.userCount.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Percentage:</span>
                        <span className="ml-2 font-medium">
                          {segment.percentage}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Avg. Session:</span>
                        <span className="ml-2 font-medium">
                          {segment.averageSessionDuration} min
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Feature Adoption:</span>
                        <span className="ml-2 font-medium">
                          {segment.featureAdoption}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Retention Rate:</span>
                        <span className="ml-2 font-medium">
                          {segment.retentionRate}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Retention Rate</span>
                        <span>{segment.retentionRate}%</span>
                      </div>
                      <Progress value={segment.retentionRate} className="h-2" />
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View Users
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

        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {platforms.map((platform) => (
              <Card
                key={platform.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {platform.platform}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(platform.trend)}
                        <span className="text-sm font-medium">
                          {platform.percentage}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Users:</span>
                        <span className="ml-2 font-medium">
                          {platform.users.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Avg. Session:</span>
                        <span className="ml-2 font-medium">
                          {platform.averageSessionDuration} min
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Bounce Rate:</span>
                        <span className="ml-2 font-medium">
                          {platform.bounceRate}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Conversion:</span>
                        <span className="ml-2 font-medium">
                          {platform.conversionRate}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Conversion Rate</span>
                        <span>{platform.conversionRate}%</span>
                      </div>
                      <Progress
                        value={platform.conversionRate}
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
      </Tabs>
    </div>
  );
}
