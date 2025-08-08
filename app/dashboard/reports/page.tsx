"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  RefreshCw,
  Users,
  BookOpen,
  Award,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

// Institution Reports
interface ReportMetrics {
  totalStudents: number;
  totalProfessionals: number;
  totalCourses: number;
  graduationRate: number;
  placementRate: number;
  revenue: number;
  revenueGrowth: number;
  satisfaction: number;
}

// Usage Trends
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

// Onboarding Stats
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

export default function ReportsPage() {
  // Institution Reports
  const [metrics, setMetrics] = useState<ReportMetrics | null>(null);
  // Usage Trends
  const [usage, setUsage] = useState<UsageMetrics | null>(null);
  // Onboarding Stats
  const [onboarding, setOnboarding] = useState<OnboardingMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    setTimeout(() => {
      setMetrics({
        totalStudents: 1247,
        totalProfessionals: 89,
        totalCourses: 45,
        graduationRate: 89,
        placementRate: 87,
        revenue: 285000,
        revenueGrowth: 18.5,
        satisfaction: 94,
      });
      setUsage({
        totalActiveUsers: 2847,
        activeUsersThisMonth: 2156,
        activeUsersLastMonth: 1987,
        averageSessionDuration: 24.5,
        averageSessionDurationLastMonth: 22.3,
        pageViews: 156789,
        pageViewsLastMonth: 142345,
        bounceRate: 32.5,
        bounceRateLastMonth: 35.2,
        featureAdoption: 78.3,
        featureAdoptionLastMonth: 75.1,
        mobileUsage: 65.2,
        mobileUsageLastMonth: 62.8,
        desktopUsage: 34.8,
        desktopUsageLastMonth: 37.2,
      });
      setOnboarding({
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
      });
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse"></div>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            View all institution analytics and key performance indicators in one
            place.
          </p>
        </div>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      <Tabs defaultValue="institution" className="space-y-6">
        <TabsList>
          <TabsTrigger value="institution">Institution Reports</TabsTrigger>
          <TabsTrigger value="usage">Usage Trends</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding Stats</TabsTrigger>
        </TabsList>
        {/* Institution Reports */}
        <TabsContent value="institution" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Students
                    </p>
                    <p className="text-2xl font-bold">
                      {metrics?.totalStudents}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Professionals
                    </p>
                    <p className="text-2xl font-bold">
                      {metrics?.totalProfessionals}
                    </p>
                  </div>
                  <Award className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Courses
                    </p>
                    <p className="text-2xl font-bold">
                      {metrics?.totalCourses}
                    </p>
                  </div>
                  <BookOpen className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold">
                      ${metrics?.revenue.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600 ml-1">
                        +{metrics?.revenueGrowth}%
                      </span>
                    </div>
                  </div>
                  <DollarSign className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Graduation Rate</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {metrics?.graduationRate}%
                  </Badge>
                </div>
                <div className="h-32 flex items-center justify-center bg-gray-50 rounded">
                  <PieChart className="w-16 h-16 text-blue-400" />
                  <span className="ml-4 text-gray-400">
                    [Chart Placeholder]
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Placement Rate</span>
                  <Badge className="bg-green-100 text-green-800">
                    {metrics?.placementRate}%
                  </Badge>
                </div>
                <div className="h-32 flex items-center justify-center bg-gray-50 rounded">
                  <BarChart3 className="w-16 h-16 text-green-400" />
                  <span className="ml-4 text-gray-400">
                    [Chart Placeholder]
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Satisfaction</span>
                  <Badge className="bg-purple-100 text-purple-800">
                    {metrics?.satisfaction}%
                  </Badge>
                </div>
                <div className="h-32 flex items-center justify-center bg-gray-50 rounded">
                  <PieChart className="w-16 h-16 text-purple-400" />
                  <span className="ml-4 text-gray-400">
                    [Chart Placeholder]
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Revenue Growth</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    +{metrics?.revenueGrowth}%
                  </Badge>
                </div>
                <div className="h-32 flex items-center justify-center bg-gray-50 rounded">
                  <TrendingUp className="w-16 h-16 text-yellow-400" />
                  <span className="ml-4 text-gray-400">
                    [Chart Placeholder]
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        {/* Usage Trends */}
        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Users
                    </p>
                    <p className="text-2xl font-bold">
                      {usage?.activeUsersThisMonth}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
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
                      {usage?.averageSessionDuration} min
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Page Views
                    </p>
                    <p className="text-2xl font-bold">
                      {usage?.pageViews.toLocaleString()}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Bounce Rate
                    </p>
                    <p className="text-2xl font-bold">{usage?.bounceRate}%</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Feature Adoption</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {usage?.featureAdoption}%
                  </Badge>
                </div>
                <div className="h-32 flex items-center justify-center bg-gray-50 rounded">
                  <PieChart className="w-16 h-16 text-blue-400" />
                  <span className="ml-4 text-gray-400">
                    [Chart Placeholder]
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Mobile Usage</span>
                  <Badge className="bg-green-100 text-green-800">
                    {usage?.mobileUsage}%
                  </Badge>
                </div>
                <div className="h-32 flex items-center justify-center bg-gray-50 rounded">
                  <BarChart3 className="w-16 h-16 text-green-400" />
                  <span className="ml-4 text-gray-400">
                    [Chart Placeholder]
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Desktop Usage</span>
                  <Badge className="bg-purple-100 text-purple-800">
                    {usage?.desktopUsage}%
                  </Badge>
                </div>
                <div className="h-32 flex items-center justify-center bg-gray-50 rounded">
                  <PieChart className="w-16 h-16 text-purple-400" />
                  <span className="ml-4 text-gray-400">
                    [Chart Placeholder]
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        {/* Onboarding Stats */}
        <TabsContent value="onboarding" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Conversion Rate
                    </p>
                    <p className="text-2xl font-bold">
                      {onboarding?.conversionRate}%
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
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
                    <p className="text-2xl font-bold">
                      {onboarding?.completionRate}%
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-blue-600" />
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
                      {onboarding?.averageTimeToComplete} days
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-600" />
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
                    <p className="text-2xl font-bold">
                      {onboarding?.dropoffRate}%
                    </p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Total Applications</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {onboarding?.totalApplications}
                  </Badge>
                </div>
                <div className="h-32 flex items-center justify-center bg-gray-50 rounded">
                  <PieChart className="w-16 h-16 text-blue-400" />
                  <span className="ml-4 text-gray-400">
                    [Chart Placeholder]
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Total Enrollments</span>
                  <Badge className="bg-green-100 text-green-800">
                    {onboarding?.totalEnrollments}
                  </Badge>
                </div>
                <div className="h-32 flex items-center justify-center bg-gray-50 rounded">
                  <BarChart3 className="w-16 h-16 text-green-400" />
                  <span className="ml-4 text-gray-400">
                    [Chart Placeholder]
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
