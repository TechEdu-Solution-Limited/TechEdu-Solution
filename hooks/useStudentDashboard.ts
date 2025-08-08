import { useState, useEffect, useCallback } from "react";
import { getTokenFromCookies } from "@/lib/cookies";
import { getApiRequestWithRefresh } from "@/lib/apiFetch";
import {
  StudentDashboardData,
  DashboardStats,
} from "@/types/student-dashboard";

interface UseStudentDashboardReturn {
  data: StudentDashboardData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  stats: DashboardStats | null;
}

export function useStudentDashboard(
  userId?: string
): UseStudentDashboardReturn {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!userId) {
      setError("User ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required");
        return;
      }

      // Fetch main dashboard data
      const response = await getApiRequestWithRefresh(
        `/api/students/${userId}/dashboard`,
        token
      );

      if (response.status === 200 && response.data?.success) {
        const dashboardData = response.data.data;
        setData(dashboardData);

        // Calculate stats
        const calculatedStats = calculateDashboardStats(dashboardData);
        setStats(calculatedStats);
      } else {
        setError(response.message || "Failed to fetch dashboard data");
      }
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const refresh = useCallback(async () => {
    await fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    loading,
    error,
    refresh,
    stats,
  };
}

function calculateDashboardStats(data: StudentDashboardData): DashboardStats {
  const totalCourses = data.courses.length;
  const completedCourses = data.courses.filter(
    (c) => c.status === "Completed"
  ).length;
  const activeCourses = data.courses.filter(
    (c) => c.status === "Enrolled"
  ).length;

  const totalDocuments = data.documents.length;
  const approvedDocuments = data.documents.filter(
    (d) => d.status === "Approved"
  ).length;
  const pendingDocuments = data.documents.filter(
    (d) => d.status === "Pending"
  ).length;

  const totalServices = data.services.length;
  const activeServices = data.services.filter(
    (s) => s.status === "Active"
  ).length;
  const completedServices = data.services.filter(
    (s) => s.status === "Completed"
  ).length;

  const totalGoals = data.learningGoals.length;
  const completedGoals = data.learningGoals.filter(
    (g) => g.status === "Completed"
  ).length;
  const inProgressGoals = data.learningGoals.filter(
    (g) => g.status === "In Progress"
  ).length;

  const openTickets = data.supportTickets.filter(
    (t) => t.status === "Open"
  ).length;
  const unreadNotifications = data.notifications.filter((n) => !n.read).length;
  const unreadAnnouncements = data.announcements.filter((a) => !a.read).length;

  return {
    totalCourses,
    completedCourses,
    activeCourses,
    totalDocuments,
    approvedDocuments,
    pendingDocuments,
    totalServices,
    activeServices,
    completedServices,
    totalGoals,
    completedGoals,
    inProgressGoals,
    openTickets,
    unreadNotifications,
    unreadAnnouncements,
  };
}
