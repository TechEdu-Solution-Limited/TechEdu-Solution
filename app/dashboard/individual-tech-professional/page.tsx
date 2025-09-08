"use client";

import React, { useEffect, useState } from "react";
import {
  BadgeCheck,
  FileText,
  Briefcase,
  PlusCircle,
  User2,
  TrendingUp,
  Calendar,
  ArrowRight,
  Download,
  HelpCircle,
  Video,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  BookOpen,
  Award,
  Bell,
  ShoppingCart,
} from "lucide-react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";
import Image from "next/image";
import Link from "next/link";
import { useRole } from "@/contexts/RoleContext";
import { getApiRequest, getApiRequestWithRefresh } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { toast } from "react-toastify";

import { logger } from "@/lib/logger";
// Types for dashboard data
interface DashboardStats {
  totalBookings: number;
  totalCertifications: number;
  upcomingInterviews: number;
  totalPayments: number;
  recentNotifications: number;
  skillsProgress: number;
}

interface Booking {
  _id: string;
  bookingPurpose: string;
  status: string;
  createdAt: string;
  productType: string;
  schedulingStatus?: string;
}

interface Notification {
  _id: string;
  type: string;
  message: string;
  createdAt: string;
  read: boolean;
  priority: string;
}

interface Payment {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  productType: string;
}

interface Application {
  _id: string;
  jobTitle: string;
  company: string;
  status: string;
  appliedAt: string;
  interviewDate?: string;
}

interface Certification {
  _id: string;
  name: string;
  status: string;
  completedAt?: string;
  progress: number;
}

export default function TalentDashboard() {
  const { userData } = useRole();

  // State for dashboard data
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalCertifications: 0,
    upcomingInterviews: 0,
    totalPayments: 0,
    recentNotifications: 0,
    skillsProgress: 0,
  });

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      // Fetch all data in parallel
      const [
        bookingsResponse,
        notificationsResponse,
        paymentsResponse,
        applicationsResponse,
        certificationsResponse,
      ] = await Promise.allSettled([
        getApiRequestWithRefresh(
          "/api/bookings/individual-tech-professional/my-bookings",
          token
        ),
        getApiRequestWithRefresh(
          `/api/notifications/${(userData as any)?._id}`,
          token
        ),
        getApiRequestWithRefresh("/api/payments/user/my-payments", token),
        getApiRequestWithRefresh(
          "/api/applications/user/my-applications",
          token
        ),
        getApiRequestWithRefresh(
          "/api/certifications/user/my-certifications",
          token
        ),
      ]);

      // Process bookings data
      if (
        bookingsResponse.status === "fulfilled" &&
        bookingsResponse.value.data?.success
      ) {
        const bookingsData = bookingsResponse.value.data.data || [];
        setBookings(bookingsData);
      }

      // Process notifications data
      if (
        notificationsResponse.status === "fulfilled" &&
        notificationsResponse.value.data?.success
      ) {
        const notificationsData = notificationsResponse.value.data.data || [];
        setNotifications(notificationsData);
      }

      // Process payments data
      if (
        paymentsResponse.status === "fulfilled" &&
        paymentsResponse.value.data?.success
      ) {
        const paymentsData = paymentsResponse.value.data.data || [];
        setPayments(paymentsData);
      }

      // Process applications data
      if (
        applicationsResponse.status === "fulfilled" &&
        applicationsResponse.value.data?.success
      ) {
        const applicationsData = applicationsResponse.value.data.data || [];
        setApplications(applicationsData);
      }

      // Process certifications data
      if (
        certificationsResponse.status === "fulfilled" &&
        certificationsResponse.value.data?.success
      ) {
        const certificationsData = certificationsResponse.value.data.data || [];
        setCertifications(certificationsData);
      }

      // Calculate stats
      updateStats();
    } catch (error) {
      logger.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const updateStats = () => {
    const upcomingInterviewsCount = applications.filter(
      (app) => app.status === "interview_scheduled" && app.interviewDate
    ).length;

    const recentNotificationsCount = notifications.filter(
      (notif) =>
        !notif.read &&
        new Date(notif.createdAt) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    const completedCertifications = certifications.filter(
      (cert) => cert.status === "completed"
    ).length;

    const totalCertifications = certifications.length;
    const certificationsProgress =
      totalCertifications > 0
        ? completedCertifications / totalCertifications
        : 0;

    setStats({
      totalBookings: bookings.length,
      totalCertifications: completedCertifications,
      upcomingInterviews: upcomingInterviewsCount,
      totalPayments: payments.length,
      recentNotifications: recentNotificationsCount,
      skillsProgress: certificationsProgress,
    });
  };

  // Update stats when data changes
  useEffect(() => {
    updateStats();
  }, [bookings, notifications, payments, applications, certifications]);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Generate skills data for chart (mock data for now)
  // const skillsData = [
  //   { month: "Jan", skills: Math.floor(stats.skillsProgress * 2) },
  //   { month: "Feb", skills: Math.floor(stats.skillsProgress * 3) },
  //   { month: "Mar", skills: Math.floor(stats.skillsProgress * 4) },
  //   { month: "Apr", skills: Math.floor(stats.skillsProgress * 5) },
  //   { month: "May", skills: Math.floor(stats.skillsProgress * 6) },
  // ];

  // Get upcoming interviews from applications
  const upcomingInterviews = applications
    .filter((app) => app.status === "interview_scheduled" && app.interviewDate)
    .map((app) => ({
      title: app.jobTitle,
      date: app.interviewDate!,
      company: app.company,
    }));

  // Get recent activity from various sources
  const recentActivity = [
    ...notifications.slice(0, 2).map((notif) => ({
      type: "notification",
      text: notif.message,
      date: new Date(notif.createdAt).toLocaleDateString(),
    })),
    ...bookings.slice(0, 1).map((booking) => ({
      type: "booking",
      text: `Booked ${booking.productType}`,
      date: new Date(booking.createdAt).toLocaleDateString(),
    })),
    ...certifications.slice(0, 1).map((cert) => ({
      type: "certification",
      text: `Completed ${cert.name}`,
      date: cert.completedAt
        ? new Date(cert.completedAt).toLocaleDateString()
        : "In Progress",
    })),
  ].slice(0, 3);

  const quickLinks = [
    {
      icon: <BookOpen size={18} />,
      label: "My Bookings",
      href: "/dashboard/bookings",
    },
    {
      icon: <Briefcase size={18} />,
      label: "View Jobs",
      href: "/dashboard/jobs",
    },
    {
      icon: <Award size={18} />,
      label: "My Certifications",
      href: "/dashboard/certifications",
    },
    {
      icon: <Bell size={18} />,
      label: "Notifications",
      href: "/dashboard/notifications",
    },
    {
      icon: <ShoppingCart size={18} />,
      label: "Payments",
      href: "/dashboard/payments",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-5xl mx-auto py-10 px-4">
        {/* Header with Refresh Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Image
              src={userData?.avatar || "/assets/placeholder-avatar.jpg"}
              alt={userData?.fullName || "User"}
              width={56}
              height={56}
              className="rounded-full border-4 border-[#011F72] shadow-md"
            />
            <div>
              <h1 className="text-2xl font-bold text-[#011F72]">
                Welcome back, {userData?.fullName || "Tech Professional"}!
              </h1>
              <div className="text-blue-400 text-sm font-medium mt-1 flex items-center gap-2">
                <TrendingUp size={16} /> "Keep learning, keep growing!"
              </div>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-[#011F72] rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition">
            <BookOpen size={32} className="text-blue-400 mb-2" />
            <div className="text-2xl font-bold text-[#011F72]">
              {stats.totalBookings}
            </div>
            <div className="text-sm text-gray-600">Bookings</div>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition">
            <Award size={32} className="text-green-400 mb-2" />
            <div className="text-2xl font-bold text-[#011F72]">
              {stats.totalCertifications}
            </div>
            <div className="text-sm text-gray-600">Certifications</div>
          </div>

          <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition">
            <Calendar size={32} className="text-purple-400 mb-2" />
            <div className="text-2xl font-bold text-[#011F72]">
              {stats.upcomingInterviews}
            </div>
            <div className="text-sm text-gray-600">Interviews</div>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition">
            <DollarSign size={32} className="text-orange-400 mb-2" />
            <div className="text-2xl font-bold text-[#011F72]">
              {stats.totalPayments}
            </div>
            <div className="text-sm text-gray-600">Payments</div>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition">
            <Bell size={32} className="text-red-400 mb-2" />
            <div className="text-2xl font-bold text-[#011F72]">
              {stats.recentNotifications}
            </div>
            <div className="text-sm text-gray-600">Notifications</div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition">
            <TrendingUp size={32} className="text-indigo-400 mb-2" />
            <div className="text-2xl font-bold text-[#011F72]">
              {Math.round(stats.skillsProgress * 100)}%
            </div>
            <div className="text-sm text-gray-600">Progress</div>
          </div>
        </div>
        {/* Certifications Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#011F72] font-semibold">
              Certifications Progress
            </span>
            <span className="text-blue-400 font-medium">
              {Math.round(stats.skillsProgress * 100)}%
            </span>
          </div>
          <div className="w-full h-4 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#011F72] to-blue-400 transition-all"
              style={{ width: `${stats.skillsProgress * 100}%` }}
            />
          </div>
        </div>
        {/* Skills Acquired Chart - COMMENTED OUT */}
        {/* <div className="bg-white border border-blue-100 rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#011F72] mb-4">
            Skills Acquired Over Time
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={skillsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="skills"
                stroke="#011F72"
                strokeWidth={3}
                dot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div> */}
        {/* Upcoming Interviews & Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Upcoming Interviews */}
          <div className="md:col-span-2 bg-white border border-blue-100 rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-[#011F72] mb-4">
              Upcoming Interviews
            </h2>
            {upcomingInterviews.length === 0 ? (
              <div className="text-gray-500 flex items-center gap-2">
                <Calendar size={16} />
                No upcoming interviews scheduled
              </div>
            ) : (
              <ul className="space-y-3">
                {upcomingInterviews.map((interview, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between bg-blue-50 rounded-[10px] px-4 py-3 border border-blue-100 hover:bg-blue-100 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-[#011F72]">
                        {interview.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {interview.company}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-blue-400" />
                      <span className="text-sm text-blue-700 font-medium">
                        {new Date(interview.date).toLocaleDateString()}
                      </span>
                      <Link
                        href="/dashboard/applications"
                        className="ml-2 text-blue-400 hover:text-[#011F72] font-semibold flex items-center gap-1 text-xs transition-colors"
                      >
                        View <ArrowRight size={14} />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Quick Links */}
          <div className="bg-white border border-blue-100 rounded-xl shadow p-6 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-[#011F72] mb-4">
              Quick Links
            </h2>
            {quickLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-[#011F72] font-medium px-4 py-2 rounded-[10px] transition-colors"
              >
                {link.icon} {link.label}
              </Link>
            ))}
          </div>
        </div>
        {/* Recent Activity Feed */}
        <div className="bg-white border border-blue-100 rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#011F72] mb-4">
            Recent Activity
          </h2>
          {recentActivity.length === 0 ? (
            <div className="text-gray-500 flex items-center gap-2">
              <Clock size={16} />
              No recent activity
            </div>
          ) : (
            <ul className="space-y-3">
              {recentActivity.map((activity, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      activity.type === "notification"
                        ? "bg-red-400"
                        : activity.type === "booking"
                        ? "bg-blue-400"
                        : activity.type === "certification"
                        ? "bg-green-400"
                        : "bg-gray-400"
                    }`}
                  />
                  <span className="text-[#011F72] font-medium">
                    {activity.text}
                  </span>
                  <span className="text-xs text-gray-400 ml-auto">
                    {activity.date}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Main Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <Link href="/dashboard/bookings">
            <button className="bg-[#0D1140] hover:bg-blue-400 text-white font-semibold py-2 px-6 rounded-[10px] flex items-center gap-2 transition">
              <BookOpen size={18} /> My Bookings
            </button>
          </Link>
          <Link href="/dashboard/jobs">
            <button className="bg-blue-100 hover:bg-blue-200 text-[#011F72] font-semibold py-2 px-6 rounded-[10px] flex items-center gap-2 transition">
              <Briefcase size={18} /> View Jobs
            </button>
          </Link>
          <Link href="/dashboard/certifications">
            <button className="bg-blue-100 hover:bg-blue-200 text-[#011F72] font-semibold py-2 px-6 rounded-[10px] flex items-center gap-2 transition">
              <Award size={18} /> My Certifications
            </button>
          </Link>
          <Link href="/dashboard/notifications">
            <button className="bg-blue-100 hover:bg-blue-200 text-[#011F72] font-semibold py-2 px-6 rounded-[10px] flex items-center gap-2 transition">
              <Bell size={18} /> Notifications
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
