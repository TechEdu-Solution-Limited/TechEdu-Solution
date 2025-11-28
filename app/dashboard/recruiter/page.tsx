"use client";

import {
  Briefcase,
  Users,
  FileText,
  PlusCircle,
  TrendingUp,
  Calendar,
  ClipboardList,
  ShoppingBasket,
  BookOpen,
  Building2,
  Bell,
  SubscriptIcon,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { UpcomingInterviewsWidget } from "@/components/UpcomingInterviewsWidget";
import { RecruiterAnalyticsWidget } from "@/components/RecruiterAnalyticsWidget";
import { getApiRequest, getUserMe } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { safeConsole } from "@/lib/console";
import { toast } from "react-toastify";

export default function RecruiterDashboard() {
  const { userData } = useRole();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    jobsPosted: 0,
    applications: 0,
    talents: 0,
    subscriptions: 0,
    bookings: 0,
  });
  const [applicationsData, setApplicationsData] = useState<
    { job: string; applications: number }[]
  >([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      // Fetch current user ID to filter jobs by recruiterId
      let userId: string | null = null;
      try {
        const userResponse = await getUserMe(token);
        userId =
          userResponse?.data?.data?._id ||
          userResponse?.data?._id ||
          userResponse?.data?.data?.id ||
          userResponse?.data?.id ||
          null;
      } catch (error) {
        safeConsole.error("Failed to fetch current user:", error);
      }

      // Fetch jobs posted by recruiter
      const jobsResponse = await getApiRequest<any>("/api/ats/job-posts", token);

      // Fetch applications
      const applicationsResponse = await getApiRequest<any>("/api/ats/job-applications", token);

      // Fetch subscriptions
      const subscriptionsResponse = await getApiRequest<any>("/api/me/subscriptions", token);

      // Fetch bookings using recruiter-specific endpoint
      let bookingsCount = 0;
      try {
        const bookingsResponse = await getApiRequest<any>(
          "/api/bookings/recruiter/my-bookings",
          token
        );
        if (bookingsResponse.status >= 200 && bookingsResponse.status < 300) {
          const bookingsData = bookingsResponse.data as any;
          const bookings = Array.isArray(bookingsData?.data?.data)
            ? bookingsData.data.data
            : Array.isArray(bookingsData?.data)
            ? bookingsData.data
            : Array.isArray(bookingsData)
            ? bookingsData
            : [];
          bookingsCount = bookings.length;
        }
      } catch (error) {
        safeConsole.log("Bookings endpoint not available or error:", error);
      }

      // Process jobs data
      let jobsCount = 0;
      let jobsData: any[] = [];
      if (
        jobsResponse.status >= 200 &&
        jobsResponse.status < 300 &&
        jobsResponse.data?.success
      ) {
        const jobsDataRaw = jobsResponse.data as any;
        const jobs = Array.isArray(jobsDataRaw?.data?.data)
          ? jobsDataRaw.data.data
          : Array.isArray(jobsDataRaw?.data)
          ? jobsDataRaw.data
          : [];
        // Filter jobs to only show those posted by the current recruiter
        const filteredJobs = userId
          ? jobs.filter((job: any) => job.recruiterId === userId)
          : jobs;
        jobsCount = filteredJobs.length;
        jobsData = filteredJobs;

        safeConsole.log("📊 Jobs filtered by recruiter:", {
          totalJobs: jobs.length,
          filteredJobs: filteredJobs.length,
          currentUserId: userId,
        });
      }

      // Process applications data - filter by recruiter's jobs
      let applicationsCount = 0;
      let applicationsByJob: { [key: string]: number } = {};
      if (
        applicationsResponse.status >= 200 &&
        applicationsResponse.status < 300 &&
        applicationsResponse.data?.success
      ) {
        const applicationsDataRaw = applicationsResponse.data as any;
        const allApplications = Array.isArray(applicationsDataRaw?.data?.data)
          ? applicationsDataRaw.data.data
          : Array.isArray(applicationsDataRaw?.data)
          ? applicationsDataRaw.data
          : [];

        // Get list of job IDs posted by this recruiter
        const recruiterJobIds = new Set(jobsData.map((job: any) => job._id));

        // Filter applications to only those for jobs posted by this recruiter
        const filteredApplications = allApplications.filter((app: any) => {
          const jobId =
            app.jobPostId?._id ||
            app.jobPostId ||
            app.jobId ||
            null;
          return jobId && recruiterJobIds.has(jobId);
        });

        applicationsCount = filteredApplications.length;

        // Group applications by job
        filteredApplications.forEach((app: any) => {
          const jobTitle = app.jobPostId?.title || app.jobTitle || "Unknown Job";
          applicationsByJob[jobTitle] =
            (applicationsByJob[jobTitle] || 0) + 1;
        });
      }

      // Process subscriptions data
      let subscriptionsCount = 0;
      if (
        subscriptionsResponse.status >= 200 &&
        subscriptionsResponse.status < 300 &&
        subscriptionsResponse.data?.success
      ) {
        const subscriptionsDataRaw = subscriptionsResponse.data as any;
        const subscriptions = Array.isArray(subscriptionsDataRaw?.data?.data)
          ? subscriptionsDataRaw.data.data
          : Array.isArray(subscriptionsDataRaw?.data)
          ? subscriptionsDataRaw.data
          : [];
        // Count active subscriptions
        subscriptionsCount = subscriptions.filter(
          (sub: any) =>
            sub.status !== "canceled" && sub.status !== "incomplete"
        ).length;
      }

      // Build applications chart data from jobs
      const chartData = jobsData
        .slice(0, 5)
        .map((job: any) => ({
          job: job.title || "Untitled Job",
          applications: applicationsByJob[job.title] || 0,
        }));

      setStats({
        jobsPosted: jobsCount,
        applications: applicationsCount,
        talents: 0, // Will need a separate endpoint for talents count
        subscriptions: subscriptionsCount,
        bookings: bookingsCount,
      });

      setApplicationsData(chartData);
    } catch (error: any) {
      safeConsole.error("Error fetching dashboard data:", error);
      // toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      icon: <Briefcase size={32} className="text-blue-400 mb-2" />,
      value: stats.jobsPosted,
      label: "Jobs Posted",
      href: "/dashboard/jobs-management",
    },
    {
      icon: <ClipboardList size={32} className="text-blue-400 mb-2" />,
      value: stats.applications,
      label: "Applications",
      href: "/dashboard/applications",
    },
    {
      icon: <Users size={32} className="text-blue-400 mb-2" />,
      value: stats.talents,
      label: "Talents",
      href: "/dashboard/talents",
    },
    {
      icon: <SubscriptIcon size={32} className="text-blue-400 mb-2" />,
      value: stats.subscriptions,
      label: "Active Subscriptions",
      href: "/dashboard/my-subscriptions",
    },
  ];

  const quickLinks = [
    {
      icon: <PlusCircle size={18} />,
      label: "Post a Job",
      href: "/dashboard/jobs-management/new",
    },
    {
      icon: <ClipboardList size={18} />,
      label: "Applications",
      href: "/dashboard/applications",
    },
    {
      icon: <Users size={18} />,
      label: "Talents",
      href: "/dashboard/talents",
    },
    {
      icon: <ShoppingBasket size={18} />,
      label: "Paid-for Product",
      href: "/dashboard/my-entitlements",
    },
    {
      icon: <SubscriptIcon size={18} />,
      label: "My Subscriptions",
      href: "/dashboard/my-subscriptions",
    },
    {
      icon: <BookOpen size={18} />,
      label: "My Bookings",
      href: "/dashboard/bookings",
    },
    {
      icon: <Building2 size={18} />,
      label: "Company Profile",
      href: "/dashboard/profile",
    },
    {
      icon: <Bell size={18} />,
      label: "Notifications",
      href: "/dashboard/notifications",
    },
  ];

  return (
    <div className="min-h-screen ">
      <div className="max-w-5xl mx-auto py-10 px-4">
        {/* Personalized Welcome */}
        <div className="flex items-center gap-4 mb-6">
          <Image
            src={userData?.avatar || "/assets/placeholder-avatar.jpg"}
            alt={userData?.fullName || "Recruiter"}
            width={56}
            height={56}
            className="rounded-full border-4 border-[#011F72] shadow-md"
          />
          <div>
            <h1 className="text-2xl font-bold text-[#011F72]">
              Welcome back, {userData?.fullName || "Recruiter"}!
            </h1>
            <div className="text-blue-400 text-sm font-medium mt-1 flex items-center gap-2">
              <TrendingUp size={16} /> "Great teams start with great hires!"
            </div>
          </div>
        </div>
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, i) => (
            <Link
              key={i}
              href={stat.href}
              className="bg-blue-50 border border-blue-100 rounded-[12px] p-6 flex flex-col items-center shadow hover:shadow-lg transition cursor-pointer"
            >
              {stat.icon}
              <div className="text-2xl font-bold text-[#011F72]">
                {loading ? "..." : stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </Link>
          ))}
        </div>
        {/* Applications Chart */}
        <div className="bg-white border border-blue-100 rounded-[12px] shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#011F72] mb-4">
            Applications Per Job
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={applicationsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="job" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="applications"
                fill="#011F72"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>

          {applicationsData.length > 0 && (
            <Link
              href="/dashboard/applications"
              className="text-blue-600 hover:underline text-sm text-right mt-4 block"
            >
              View All Applications →
            </Link>
          )}
        </div>
        {/* Upcoming Interviews & Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Upcoming Interviews */}
          <div className="md:col-span-2">
            <UpcomingInterviewsWidget />
          </div>
          {/* Quick Links */}
          <div className="bg-white border border-blue-100 rounded-[12px] shadow p-6 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-[#011F72] mb-4">
              Quick Links
            </h2>
            {quickLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-[#011F72] font-medium px-4 py-2 rounded-[10px] transition"
              >
                {link.icon} {link.label}
              </Link>
            ))}
          </div>
        </div>
        {/* Recent Activity Feed - Optional, can be removed or populated with real data */}
        {stats.bookings > 0 && (
          <div className="bg-white border border-blue-100 rounded-[12px] shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#011F72]">
                My Bookings
              </h2>
              <Link
                href="/dashboard/bookings"
                className="text-blue-600 hover:underline text-sm"
              >
                View All →
              </Link>
            </div>
            <p className="text-gray-600">
              You have {stats.bookings} active booking{stats.bookings !== 1 ? "s" : ""}
            </p>
          </div>
        )}
        {/* Main Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <Link
            href="/dashboard/jobs-management/new"
            className="bg-[#0D1140] hover:bg-blue-400 text-white font-semibold py-2 px-6 rounded-[10px] flex items-center gap-2 transition"
          >
            <PlusCircle size={18} /> Post a Job
          </Link>
          <Link
            href="/dashboard/applications"
            className="bg-blue-100 hover:bg-blue-200 text-[#011F72] font-semibold py-2 px-6 rounded-[10px] flex items-center gap-2 transition"
          >
            <ClipboardList size={18} /> Applications
          </Link>
          <Link
            href="/dashboard/talents"
            className="bg-blue-100 hover:bg-blue-200 text-[#011F72] font-semibold py-2 px-6 rounded-[10px] flex items-center gap-2 transition"
          >
            <Users size={18} /> Talents
          </Link>
          <Link
            href="/dashboard/my-subscriptions"
            className="bg-blue-100 hover:bg-blue-200 text-[#011F72] font-semibold py-2 px-6 rounded-[10px] flex items-center gap-2 transition"
          >
            <SubscriptIcon size={18} /> Subscriptions
          </Link>
        </div>
      </div>
    </div>
  );
}
