"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  FileText,
  ClipboardList,
  User,
  Bell,
  ArrowRight,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  Star,
  Sparkles,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { getApiRequestWithRefresh } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";

import { logger } from "@/lib/logger";
const MOCK_AVATAR = "/assets/placeholder-avatar.jpg";

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    confirmed: {
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: CheckCircle,
    },
    completed: {
      color: "bg-blue-100 text-blue-700 border-blue-200",
      icon: CheckCircle,
    },
    pending: {
      color: "bg-amber-100 text-amber-700 border-amber-200",
      icon: Clock,
    },
    cancelled: { color: "bg-red-100 text-red-700 border-red-200", icon: Clock },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const IconComponent = config.icon;

  return (
    <Badge
      variant="outline"
      className={`${config.color} border flex items-center gap-1 px-2 py-1`}
    >
      <IconComponent size={12} />
      {status}
    </Badge>
  );
}

function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg ${className}`}
    />
  );
}

export default function StudentDashboard() {
  const { userData } = useRole();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);
  const [onboardingProgress, setOnboardingProgress] = useState<any>(null);
  const [activeServices, setActiveServices] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);
  const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);

  // Fetch onboarding progress to calculate profile completion
  useEffect(() => {
    async function fetchOnboardingProgress() {
      if (!userData?.email) return;

      try {
        const token = getTokenFromCookies();
        if (!token) return;

        // First, get the user ID from /api/users/me
        const userResponse = await getApiRequestWithRefresh(
          "/api/users/me",
          token
        );
        const userId =
          userResponse.data?.data?.data?._id ||
          userResponse.data?.data?.data?.id;

        if (!userId) {
          logger.error("No user ID found in response");
          return;
        }

        // Then fetch onboarding progress using the user ID
        const response = await getApiRequestWithRefresh(
          `/api/onboarding/${userId}/progress`,
          token
        );

        if (response.status === 200 && response.data?.data) {
          setOnboardingProgress(response.data.data);
        }
      } catch (error: any) {
        // Enhanced error logging to help debug API issues
        logger.error("Error fetching onboarding progress details:", {
          error: error,
          message: error?.message,
          status: error?.status,
          data: error?.data,
          stack: error?.stack,
          response: error?.response,
        });
        // Don't set error state here as it's not critical for dashboard display
      }
    }

    fetchOnboardingProgress();
  }, [userData?.email]);

  // Fetch active services from bookings API
  useEffect(() => {
    async function fetchActiveServices() {
      if (!userData?.email) return;

      try {
        setServicesLoading(true);
        const token = getTokenFromCookies();
        if (!token) return;

        const response = await getApiRequestWithRefresh(
          "/api/bookings/user/my-bookings",
          token
        );

        if (response.status === 200 && response.data?.data) {
          const bookings = response.data.data;
          // Filter for active services and transform data
          const services = bookings
            .filter(
              (booking: any) =>
                booking.status === "confirmed" ||
                booking.status === "pending" ||
                booking.status === "completed"
            )
            .map((booking: any) => ({
              id: booking._id || booking.id,
              name: booking.bookingPurpose || "Service",
              status: booking.status,
              bookedAt: new Date(
                booking.createdAt || booking.scheduleAt
              ).toLocaleDateString(),
              link: `/dashboard/bookings/${booking._id || booking.id}`,
            }));

          setActiveServices(services);
        }
      } catch (error: any) {
        // Enhanced error logging to help debug API issues
        logger.error("Error fetching active services details:", {
          error: error,
          message: error?.message,
          status: error?.status,
          data: error?.data,
          stack: error?.stack,
          response: error?.response,
        });
        setActiveServices([]);
      } finally {
        setServicesLoading(false);
      }
    }

    fetchActiveServices();
  }, [userData?.email]);

  // Fetch notifications from notifications API
  useEffect(() => {
    async function fetchNotifications() {
      if (!userData?.email) return;

      try {
        setNotificationsLoading(true);
        const token = getTokenFromCookies();
        if (!token) return;

        const response = await getApiRequestWithRefresh(
          "/api/notifications?page=1&limit=5&unreadOnly=true",
          token
        );

        if (response.status === 200 && response.data?.data?.notifications) {
          const notifications = response.data.data.notifications;
          // Transform notifications data
          const transformedNotifications = notifications
            .filter((notification: any) => !notification.isRead)
            .map((notification: any) => ({
              title:
                notification.title || notification.message || "Notification",
              content: notification.message || "No content",
              date: new Date(notification.createdAt).toLocaleDateString(),
              id: notification._id || notification.id,
            }));

          setAnnouncements(transformedNotifications);
        }
      } catch (error: any) {
        // Enhanced error logging to help debug API issues
        logger.error("Error fetching notifications details:", {
          error: error,
          message: error?.message,
          status: error?.status,
          data: error?.data,
          stack: error?.stack,
          response: error?.response,
        });
        setAnnouncements([]);
      } finally {
        setNotificationsLoading(false);
      }
    }

    fetchNotifications();
  }, [userData?.email]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/studentDashboardData.json");
        if (!res.ok) throw new Error("Failed to load dashboard data");
        const json = await res.json();
        setData(json);
      } catch (e: any) {
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Get profile completion from onboarding progress API response
  const progressPercentage = useMemo(() => {
    if (!onboardingProgress?.progressPercentage) return 0;
    return Math.round(onboardingProgress.progressPercentage);
  }, [onboardingProgress]);

  // Memoize derived data
  const quickStats = useMemo(
    () => [
      {
        label: "Courses Enrolled",
        value:
          activeServices.filter(
            (s: any) =>
              s.name.toLowerCase().includes("course") ||
              s.name.toLowerCase().includes("training")
          ).length || 0,
        icon: <BookOpen className="text-blue-600" size={24} />,
        href: "/dashboard/booked-services",
        gradient: "from-blue-500 to-blue-600",
        bgGradient: "from-blue-50 to-blue-100",
      },
      {
        label: "Documents Uploaded",
        value: data?.documents?.length || 0,
        icon: <FileText className="text-emerald-600" size={24} />,
        href: "/dashboard/upload-documents",
        gradient: "from-emerald-500 to-emerald-600",
        bgGradient: "from-emerald-50 to-emerald-100",
      },
      {
        label: "Services Booked",
        value: activeServices.length || 0,
        icon: <ClipboardList className="text-purple-600" size={24} />,
        href: "/dashboard/booked-services",
        gradient: "from-purple-500 to-purple-600",
        bgGradient: "from-purple-50 to-purple-100",
      },
    ],
    [data, activeServices]
  );

  const servicesToShow = showAllServices
    ? activeServices
    : activeServices.slice(0, 2);

  const shortcuts = [
    {
      label: "My Profile",
      icon: <User size={20} />,
      href: "/dashboard/profile-progress",
      description: "Complete your profile",
      color: "text-blue-600 bg-blue-50 hover:bg-blue-100",
    },
    {
      label: "My Courses",
      icon: <BookOpen size={20} />,
      href: "/dashboard/booked-services",
      description: "View enrolled courses",
      color: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100",
    },
    {
      label: "Upload Documents",
      icon: <FileText size={20} />,
      href: "/dashboard/upload-documents",
      description: "Manage your documents",
      color: "text-purple-600 bg-purple-50 hover:bg-purple-100",
    },
    {
      label: "Support",
      icon: <Bell size={20} />,
      href: "/dashboard/support",
      description: "Get help & support",
      color: "text-orange-600 bg-orange-50 hover:bg-orange-100",
    },
  ];

  const announcementsToShow = showAllAnnouncements
    ? announcements
    : announcements.slice(0, 2);

  // Skeletons
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <Skeleton className="h-32 w-full" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-center">
            <div className="text-red-600 text-lg font-medium mb-2">
              Error Loading Dashboard
            </div>
            <div className="text-red-500">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="pt-6 text-center">
            <div className="text-gray-600 text-lg font-medium">
              No data found
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      {/* Welcome Message */}
      <div className="flex items-center gap-6 mb-6">
        <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
          <AvatarImage src={MOCK_AVATAR} alt="Profile" />
          <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {userData?.fullName?.charAt(0) || "S"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome back, {userData?.fullName || "Student"}! 👋
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <Calendar size={16} />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
          <Sparkles size={16} />
          Ready to learn!
        </div>
      </div>

      {/* Profile Completion */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="text-blue-600" size={24} />
            Profile Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <Progress
                value={progressPercentage}
                className="h-3 transition-all duration-700"
              />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {progressPercentage}%
              </div>
              <div className="text-xs text-gray-500">Complete</div>
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-3">
            Complete your profile to unlock all features and get personalized
            recommendations.
          </div>
          {onboardingProgress?.steps && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle size={16} className="text-green-500" />
              {
                onboardingProgress.steps.filter((step: any) => step.completed)
                  .length
              }{" "}
              of {onboardingProgress.steps.length} steps completed
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => (
          <Link key={stat.label} href={stat.href} className="block group">
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 group-hover:from-gray-50 group-hover:to-white">
              <div
                className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.bgGradient} rounded-bl-full opacity-20`}
              />
              <CardContent className="relative pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgGradient}`}
                  >
                    {stat.icon}
                  </div>
                  <ArrowRight
                    size={20}
                    className="text-gray-400 group-hover:text-gray-600 transition-colors"
                  />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Services */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ClipboardList className="text-purple-600" size={24} />
              Active Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            {servicesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <div className="text-gray-500 font-medium mb-2">
                  Loading services...
                </div>
              </div>
            ) : activeServices.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardList
                  size={48}
                  className="text-gray-300 mx-auto mb-4"
                />
                <div className="text-gray-500 font-medium mb-2">
                  No active services
                </div>
                <div className="text-sm text-gray-400">
                  Book a service to get started!
                </div>
                <Link
                  href={(() => {
                    switch (userData?.role) {
                      case "student":
                        return "/academic-services";
                      case "individualTechProfessional":
                      case "teamTechProfessional":
                        return "/training/catalog";
                      case "institution":
                        return "/corporate-consultancy";
                      case "recruiter":
                        return "/career-connect";
                      default:
                        return "/academic-services"; // fallback for unknown roles
                    }
                  })()}
                >
                  <Button className="mt-4 text-white hover:text-black">
                    {(() => {
                      switch (userData?.role) {
                        case "student":
                          return "Book Academic Service";
                        case "individualTechProfessional":
                        case "teamTechProfessional":
                          return "Book Training Program";
                        case "institution":
                          return "Corporate Consultancy";
                        case "recruiter":
                          return "Career Connect";
                        default:
                          return "Book a Service";
                      }
                    })()}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {servicesToShow.map((service: any) => (
                  <div
                    key={service.id}
                    className="group p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                          {service.name}
                          <StatusBadge status={service.status} />
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar size={14} />
                          Booked: {service.bookedAt}
                        </div>
                      </div>
                      <Link
                        href={service.link}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
                      >
                        View <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
                {activeServices.length > 2 && (
                  <Button
                    variant="ghost"
                    className="w-full mt-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    onClick={() => setShowAllServices(!showAllServices)}
                  >
                    {showAllServices
                      ? "Show Less"
                      : `Show ${activeServices.length - 2} More`}
                  </Button>
                )}
                {activeServices.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link
                      href="/dashboard/bookings"
                      className="w-full text-center text-purple-600 hover:text-purple-700 text-sm font-medium hover:bg-purple-50 py-2 rounded-lg transition-colors"
                    >
                      View All Bookings →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Bell className="text-orange-600" size={24} />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notificationsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
                <div className="text-gray-500 font-medium mb-2">
                  Loading notifications...
                </div>
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-8">
                <Bell size={48} className="text-gray-300 mx-auto mb-4" />
                <div className="text-gray-500 font-medium mb-2">
                  No notifications
                </div>
                <div className="text-sm text-gray-400">
                  Check back later for updates
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {announcementsToShow.map((a: any, index: number) => (
                  <div
                    key={a.title}
                    className="group p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1 group-hover:text-orange-700 transition-colors">
                          {a.title}
                        </div>
                        <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                          <Calendar size={12} />
                          {a.date}
                        </div>
                        <div className="text-sm text-gray-600 leading-relaxed">
                          {a.content}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {announcements.length > 2 && (
                  <Button
                    variant="ghost"
                    className="w-full mt-3 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                    onClick={() =>
                      setShowAllAnnouncements(!showAllAnnouncements)
                    }
                  >
                    {showAllAnnouncements
                      ? "Show Less"
                      : `Show ${announcements.length - 2} More`}
                  </Button>
                )}
                {announcements.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link
                      href="/dashboard/notifications"
                      className="w-full text-center text-orange-600 hover:text-orange-700 text-sm font-medium hover:bg-orange-50 py-2 rounded-lg transition-colors"
                    >
                      View All Notifications →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="text-indigo-600" size={24} />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {shortcuts.map((shortcut) => (
              <Link
                key={shortcut.label}
                href={shortcut.href}
                className="block group"
              >
                <div
                  className={`p-6 rounded-xl border-2 border-transparent hover:border-gray-200 transition-all duration-200 group-hover:shadow-md ${shortcut.color}`}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 rounded-full bg-white shadow-sm group-hover:shadow-md transition-shadow">
                      {shortcut.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">
                        {shortcut.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {shortcut.description}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
