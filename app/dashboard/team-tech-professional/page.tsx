"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  User,
  BookOpen,
  FileText,
  Briefcase,
  ClipboardList,
  Layers,
  ShoppingCart,
  MessageCircle,
  Bell,
  Building2,
  Users,
  Target,
  Settings,
  Calendar,
  CheckCircle,
  UserCheck,
  Search,
  FileCheck,
  Clipboard,
  BarChart3,
  Award,
  TrendingUp,
  Clock,
  Plus,
  Edit,
  Download,
  Share2,
  RefreshCw,
  Globe,
  Shield,
  Database,
  Cloud,
  Zap,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MapPin,
  DollarSign,
  Filter,
  Brain,
  Rocket,
  Bookmark,
  Heart,
  Star,
  AlertCircle,
  CheckCircle2,
  XCircle,
  PlayCircle,
  PauseCircle,
  Code,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";

import { safeConsole } from "@/lib/console";
interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "online" | "offline" | "busy" | "away";
  skills: string[];
  performance: number;
  projects: number;
  lastActive: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: "planning" | "in-progress" | "review" | "completed" | "on-hold";
  progress: number;
  priority: "low" | "medium" | "high" | "critical";
  teamMembers: string[];
  deadline: string;
  budget: number;
  spent: number;
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
  };
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: "pending" | "in-progress" | "review" | "completed";
  priority: "low" | "medium" | "high" | "critical";
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  project: string;
  tags: string[];
}

interface TeamMetrics {
  totalMembers: number;
  activeProjects: number;
  completedProjects: number;
  averagePerformance: number;
  totalTasks: number;
  completedTasks: number;
  upcomingDeadlines: number;
  budgetUtilization: number;
}

interface TeamData {
  teamId: string;
  teamName: string;
  teamSize: number;
  companyId: string;
  location: {
    country: string;
    state: string;
    city: string;
  };
  programmingLanguages: string[];
  frameworksAndTools: string[];
  softSkills: string[];
  preferredTechStack: string[];
  remoteWorkExperience: boolean;
  trainingAvailability: string;
  contactEmail: string;
  contactPhone: string;
  learningGoals: {
    goalType: string;
    priorityAreas: string[];
    trainingTimeline: string;
  };
  members: Array<{
    role: string;
    status: string;
    _id: string;
    invitedAt: string;
  }>;
  company: {
    name: string;
    type: string;
    industry: string;
    website: string;
    logoUrl: string;
    location: {
      country: string;
      state: string;
      city: string;
    };
    contactPerson: {
      email: string;
      phone: string;
    };
  };
}

export default function TeamTechProfessionalDashboard() {
  const { userData } = useRole();
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [metrics, setMetrics] = useState<TeamMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<string>("overview");

  // New data states for real API data
  const [bookings, setBookings] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        const token = getTokenFromCookies();

        // Get user data to extract team ID
        const userResponse = await getApiRequest(
          "/api/users/me",
          token || undefined
        );

        if (userResponse.status >= 400) {
          throw new Error("Failed to fetch user data");
        }

        const teamId = userResponse.data?.data?.data?.profile?._id;

        if (!teamId) {
          throw new Error("No team ID found in user profile");
        }

        // Fetch all team-related data in parallel
        const [
          teamResponse,
          bookingsResponse,
          sessionsResponse,
          classroomsResponse,
          attendanceResponse,
          notificationsResponse,
          teamMembersResponse,
        ] = await Promise.allSettled([
          getApiRequest(`/api/teams/${teamId}`, token || undefined),
          getApiRequest(
            "/api/bookings/team-tech-professional/my-bookings",
            token || undefined
          ),
          getApiRequest(
            "/api/sessions/team-tech-professional/my-sessions",
            token || undefined
          ),
          getApiRequest(
            "/api/classrooms/team-tech-professional/my-classrooms",
            token || undefined
          ),
          getApiRequest(
            "/api/attendance/team-tech-professional/my-attendances",
            token || undefined
          ),
          getApiRequest("/api/notifications", token || undefined),
          getApiRequest(`/api/teams/${teamId}/members`, token || undefined),
        ]);

        // Process team data
        if (
          teamResponse.status === "fulfilled" &&
          teamResponse.value.status < 400
        ) {
          const team = teamResponse.value.data?.data;
          setTeamData(team);
        }

        // Process bookings data
        if (
          bookingsResponse.status === "fulfilled" &&
          bookingsResponse.value.status < 400
        ) {
          const bookingsData =
            bookingsResponse.value.data?.data?.bookings || [];
          setBookings(bookingsData.slice(0, 5)); // Show only recent 5
        }

        // Process sessions data
        if (
          sessionsResponse.status === "fulfilled" &&
          sessionsResponse.value.status < 400
        ) {
          const sessionsData = sessionsResponse.value.data?.data || [];
          setSessions(sessionsData.slice(0, 5)); // Show only recent 5
        }

        // Process classrooms data
        if (
          classroomsResponse.status === "fulfilled" &&
          classroomsResponse.value.status < 400
        ) {
          const classroomsData = classroomsResponse.value.data?.data || [];
          setClassrooms(classroomsData.slice(0, 5)); // Show only recent 5
        }

        // Process attendance data
        if (
          attendanceResponse.status === "fulfilled" &&
          attendanceResponse.value.status < 400
        ) {
          const attendanceData = attendanceResponse.value.data?.data || [];
          setAttendance(
            Array.isArray(attendanceData) ? attendanceData.slice(0, 5) : []
          ); // Show only recent 5
        }

        // Process notifications data
        if (
          notificationsResponse.status === "fulfilled" &&
          notificationsResponse.value.status < 400
        ) {
          const notificationsData =
            notificationsResponse.value.data?.data || [];
          setNotifications(
            Array.isArray(notificationsData)
              ? notificationsData.slice(0, 5)
              : []
          ); // Show only recent 5
        }

        // Process team members data
        if (
          teamMembersResponse.status === "fulfilled" &&
          teamMembersResponse.value.status < 400
        ) {
          const membersData =
            teamMembersResponse.value.data?.data?.members || [];
          // Transform team members data to match TeamMember interface
          const transformedMembers: TeamMember[] = membersData.map(
            (member: any) => ({
              id: member.id || member._id,
              name: member.fullName,
              role: member.role,
              avatar: "/avatars/default.jpg",
              status: member.status === "accepted" ? "online" : "offline",
              skills: teamData?.preferredTechStack || [],
              performance: Math.floor(Math.random() * 20) + 80, // Random performance between 80-100
              projects: Math.floor(Math.random() * 5) + 1,
              lastActive: member.joinedAt
                ? new Date(member.joinedAt).toLocaleDateString()
                : "Unknown",
            })
          );
          setTeamMembers(transformedMembers);
        }

        // Calculate metrics from real data
        const calculatedMetrics: TeamMetrics = {
          totalMembers:
            teamMembersResponse.status === "fulfilled"
              ? teamMembersResponse.value.data?.data?.members?.length || 0
              : 0,
          activeProjects: sessions.length + classrooms.length,
          completedProjects: attendance.filter((a) => a.status === "completed")
            .length,
          averagePerformance: 85, // Default value
          totalTasks: sessions.length + classrooms.length,
          completedTasks: attendance.filter((a) => a.status === "completed")
            .length,
          upcomingDeadlines: sessions.filter((s) => {
            const scheduleDate = new Date(s.scheduleAt);
            const now = new Date();
            const diffDays = Math.ceil(
              (scheduleDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            );
            return diffDays <= 7 && diffDays >= 0;
          }).length,
          budgetUtilization: 0,
        };

        setMetrics(calculatedMetrics);

        // Transform sessions and classrooms into projects for display
        const transformedProjects: Project[] = [
          ...sessions.map((session, index) => ({
            id: `session-${session._id || index}`,
            name: session.bookingPurpose || "Team Session",
            description: `Session for ${teamData?.teamName || "Team"}`,
            status: (session.status === "confirmed"
              ? "in-progress"
              : "planning") as
              | "in-progress"
              | "planning"
              | "review"
              | "completed"
              | "on-hold",
            progress: 65,
            priority: "high" as const,
            teamMembers: teamMembers.map((m) => m.id),
            deadline: session.scheduleAt
              ? new Date(session.scheduleAt).toISOString().split("T")[0]
              : "2024-03-15",
            budget: 5000,
            spent: 3250,
            tasks: {
              total: 8,
              completed: 5,
              inProgress: 2,
              pending: 1,
            },
          })),
          ...classrooms.map((classroom, index) => ({
            id: `classroom-${classroom._id || index}`,
            name: classroom.bookingPurpose || "Team Classroom",
            description: `Classroom for ${teamData?.teamName || "Team"}`,
            status: (classroom.status === "confirmed"
              ? "in-progress"
              : "planning") as
              | "in-progress"
              | "planning"
              | "review"
              | "completed"
              | "on-hold",
            progress: 45,
            priority: "medium" as const,
            teamMembers: teamMembers.map((m) => m.id),
            deadline: classroom.scheduleAt
              ? new Date(classroom.scheduleAt).toISOString().split("T")[0]
              : "2024-04-15",
            budget: 8000,
            spent: 3600,
            tasks: {
              total: 12,
              completed: 6,
              inProgress: 3,
              pending: 3,
            },
          })),
        ];

        setProjects(transformedProjects);

        // Transform attendance into tasks for display
        const transformedTasks: Task[] = attendance.map(
          (attendance, index) => ({
            id: `task-${attendance._id || index}`,
            title: attendance.title || "Team Task",
            description: `Task related to ${
              attendance.productType || "Team Activity"
            }`,
            assignee: teamMembers[0]?.name || "Team Member",
            status:
              attendance.status === "completed" ? "completed" : "in-progress",
            priority: "medium" as const,
            dueDate: attendance.scheduleAt
              ? new Date(attendance.scheduleAt).toISOString().split("T")[0]
              : "2024-02-15",
            estimatedHours: 4,
            actualHours: 3,
            project: attendance.productType || "Team Project",
            tags: teamData?.preferredTechStack || ["Development", "Team"],
          })
        );

        setTasks(transformedTasks);
      } catch (error: any) {
        safeConsole.error("Error fetching team data:", error);
        // Fallback to mock data if API fails
        setTeamData({
          teamId: "fallback",
          teamName: userData?.fullName || "Team",
          teamSize: 1,
          companyId: "",
          location: { country: "", state: "", city: "" },
          programmingLanguages: [],
          frameworksAndTools: [],
          softSkills: [],
          preferredTechStack: [],
          remoteWorkExperience: false,
          trainingAvailability: "",
          contactEmail: "",
          contactPhone: "",
          learningGoals: {
            goalType: "",
            priorityAreas: [],
            trainingTimeline: "",
          },
          members: [],
          company: {
            name: "",
            type: "",
            industry: "",
            website: "",
            logoUrl: "",
            location: { country: "", state: "", city: "" },
            contactPerson: { email: "", phone: "" },
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [userData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800";
      case "busy":
        return "bg-red-100 text-red-800";
      case "away":
        return "bg-yellow-100 text-yellow-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      case "planning":
        return "bg-purple-100 text-purple-800";
      case "on-hold":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const activeProjects = projects.filter((p) => p.status !== "completed");
  const completedProjects = projects.filter((p) => p.status === "completed");
  const upcomingDeadlines = projects.filter((p) => {
    const deadline = new Date(p.deadline);
    const now = new Date();
    const diffDays = Math.ceil(
      (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 7 && diffDays >= 0;
  });

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
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {userData?.fullName || "Team Admin"}! 👋
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mb-4">
                Manage your team as an administrator and track progress
              </p>
              {teamData && (
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-[10px]">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">
                      {teamData.teamName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-[10px]">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="text-green-900">
                      {teamData.location.city}, {teamData.location.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-[10px]">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-purple-900">
                      {teamData.teamSize} members
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="rounded-[12px] text-sm sm:text-base px-4 py-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button className="rounded-[12px] text-sm sm:text-base px-4 py-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Invite Members</span>
              </Button>
              <Button className="rounded-[12px] text-sm sm:text-base px-4 py-2 bg-green-600 hover:bg-green-700">
                <Settings className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-medium text-blue-700">
                    Team Members
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900">
                    {teamMembers.length}
                  </p>
                  <p className="text-xs text-blue-600">Active members</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-[12px]">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-medium text-green-700">
                    Active Sessions
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-900">
                    {sessions.length}
                  </p>
                  <p className="text-xs text-green-600">Ongoing sessions</p>
                </div>
                <div className="p-3 bg-green-200 rounded-[12px]">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-medium text-purple-700">
                    Classrooms
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-900">
                    {classrooms.length}
                  </p>
                  <p className="text-xs text-purple-600">Learning spaces</p>
                </div>
                <div className="p-3 bg-purple-200 rounded-[12px]">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-medium text-yellow-700">
                    Attendance Rate
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-900">
                    {attendance.length > 0
                      ? Math.round(
                          (attendance.filter((a) => a.status === "completed")
                            .length /
                            attendance.length) *
                            100
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-yellow-600">Completion rate</p>
                </div>
                <div className="p-3 bg-yellow-200 rounded-[12px]">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Info Card */}
        {teamData && (
          <Card className="bg-white shadow-sm border-0 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <div className="p-2 bg-white/20 rounded-[10px]">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                Team Information (Admin View)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    Team Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-medium text-gray-600 text-sm">
                        Name:
                      </span>
                      <span className="text-gray-900 font-medium">
                        {teamData.teamName}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-medium text-gray-600 text-sm">
                        Size:
                      </span>
                      <span className="text-gray-900 font-medium">
                        {teamData.teamSize} members
                      </span>
                    </div>
                    {/* <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-medium text-gray-600 text-sm">
                        Location:
                      </span>
                      <span className="text-gray-900 font-medium">
                        {teamData.location.city}, {teamData.location.state},{" "}
                        {teamData.location.country}
                      </span>
                    </div> */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-medium text-gray-600 text-sm">
                        Training:
                      </span>
                      <span className="text-gray-900 font-medium">
                        {teamData.trainingAvailability}
                      </span>
                    </div>
                    {/* <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-medium text-gray-600 text-sm">
                        Email:
                      </span>
                      <span className="text-gray-900 font-medium">
                        {teamData.contactEmail}
                      </span>
                    </div> */}
                    {/* <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-medium text-gray-600 text-sm">
                        Phone:
                      </span>
                      <span className="text-gray-900 font-medium">
                        {teamData.contactPhone}
                      </span>
                    </div> */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-medium text-gray-600 text-sm">
                        Status:
                      </span>
                      <Badge className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        Active Admin
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                    <Code className="w-5 h-5 text-purple-600" />
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {teamData.preferredTechStack.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    Learning Goals
                  </h4>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-medium text-gray-600 text-sm">
                        Goal Type:
                      </span>
                      <span className="text-gray-900 font-medium">
                        {teamData.learningGoals.goalType}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-medium text-gray-600 text-sm">
                        Timeline:
                      </span>
                      <span className="text-gray-900 font-medium">
                        {teamData.learningGoals.trainingTimeline}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600 text-sm block mb-2">
                        Priority Areas:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {teamData.learningGoals.priorityAreas.map((area) => (
                          <Badge
                            key={area}
                            variant="outline"
                            className="text-xs px-3 py-1 rounded-full border-green-200 text-green-800 hover:bg-green-50 transition-colors"
                          >
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-600" />
                  Admin Actions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2 h-12 rounded-[12px] hover:bg-blue-50 hover:border-blue-300 transition-all"
                  >
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">Manage Members</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2 h-12 rounded-[12px] hover:bg-green-50 hover:border-green-300 transition-all"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Edit Team Profile
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2 h-12 rounded-[12px] hover:bg-purple-50 hover:border-purple-300 transition-all sm:col-span-2 lg:col-span-1"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Export Team Data
                    </span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <Tabs defaultValue="overview" className="w-full">
            <div className="border-b border-gray-200 px-4 sm:px-6">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-transparent h-auto p-0">
                <TabsTrigger
                  value="overview"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600"
                >
                  <Briefcase className="w-4 h-4" />
                  <span className="hidden sm:inline">Projects</span>
                </TabsTrigger>
                <TabsTrigger
                  value="team"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600"
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Team</span>
                </TabsTrigger>
                <TabsTrigger
                  value="tasks"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span className="hidden sm:inline">Tasks</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Bell className="w-5 h-5 text-blue-600" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 3).map((notification, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 p-3 bg-white rounded-[10px] border border-blue-100 hover:shadow-sm transition-shadow"
                          >
                            <Avatar className="w-10 h-10 ring-2 ring-blue-100">
                              <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                                {notification.title?.charAt(0) || "N"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {notification.title || "New Notification"}
                              </p>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {notification.message || "Team activity update"}
                              </p>
                              <span className="text-xs text-gray-500 mt-1 block">
                                {notification.createdAt
                                  ? new Date(
                                      notification.createdAt
                                    ).toLocaleDateString()
                                  : "Recently"}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 text-sm">
                            No recent activity
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Sessions & Classrooms */}
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="w-5 h-5 text-green-600" />
                      Upcoming Sessions & Classrooms
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[...sessions, ...classrooms]
                        .slice(0, 3)
                        .map((item, index) => {
                          const scheduleDate = new Date(item.scheduleAt);
                          const now = new Date();
                          const diffDays = Math.ceil(
                            (scheduleDate.getTime() - now.getTime()) /
                              (1000 * 60 * 60 * 24)
                          );

                          return (
                            <div
                              key={`${item._id || index}`}
                              className="flex items-center justify-between p-4 bg-white rounded-[10px] border border-green-100 hover:shadow-sm transition-shadow"
                            >
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">
                                  {item.bookingPurpose || "Team Activity"}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {diffDays > 0
                                    ? `Due in ${diffDays} day${
                                        diffDays !== 1 ? "s" : ""
                                      }`
                                    : diffDays === 0
                                    ? "Due today"
                                    : "Overdue"}
                                </p>
                              </div>
                              <Badge
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  item.status === "confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {item.status}
                              </Badge>
                            </div>
                          );
                        })}
                      {sessions.length === 0 && classrooms.length === 0 && (
                        <div className="text-center py-8">
                          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 text-sm">
                            No upcoming sessions or classrooms
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Team Activities Progress */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Team Activities Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.slice(0, 3).map((project) => (
                      <div
                        key={project.id}
                        className="p-4 bg-white rounded-[12px] border border-purple-100 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {project.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {project.description}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <Badge
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getProjectStatusColor(
                                project.status
                              )}`}
                            >
                              {project.status}
                            </Badge>
                            <Badge
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                project.priority
                              )}`}
                            >
                              {project.priority}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium text-gray-900">
                              {project.progress}%
                            </span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-sm">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                            <span className="text-gray-600">Tasks:</span>
                            <span className="font-medium text-gray-900">
                              {project.tasks.completed}/{project.tasks.total}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                            <span className="text-gray-600">Budget:</span>
                            <span className="font-medium text-gray-900">
                              ${project.spent.toLocaleString()}/$
                              {project.budget.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                            <span className="text-gray-600">Deadline:</span>
                            <span className="font-medium text-gray-900">
                              {new Date(project.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {projects.length === 0 && (
                      <div className="text-center py-8">
                        <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">
                          No team activities found
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className="bg-white hover:shadow-lg transition-all duration-300 border-0 rounded-2xl overflow-hidden group"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                              {project.name}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                              {project.description}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <Badge
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getProjectStatusColor(
                                project.status
                              )}`}
                            >
                              {project.status}
                            </Badge>
                            <Badge
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                project.priority
                              )}`}
                            >
                              {project.priority}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium text-gray-900">
                              {project.progress}%
                            </span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                            <span className="text-gray-600">Tasks:</span>
                            <span className="font-medium text-gray-900">
                              {project.tasks.completed}/{project.tasks.total}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                            <span className="text-gray-600">Budget:</span>
                            <span className="font-medium text-gray-900">
                              ${project.spent.toLocaleString()}/$
                              {project.budget.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                            <span className="text-gray-600">Members:</span>
                            <span className="font-medium text-gray-900">
                              {project.teamMembers.length}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                            <span className="text-gray-600">Deadline:</span>
                            <span className="font-medium text-gray-900">
                              {new Date(project.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-100">
                          <Button
                            size="sm"
                            className="flex-1 h-10 rounded-[12px] bg-blue-600 hover:bg-blue-700"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-10 rounded-[12px] hover:bg-gray-50"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {projects.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">
                      No projects found
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Create your first project to get started
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="team" className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {teamMembers.map((member) => (
                  <Card
                    key={member.id}
                    className="bg-white hover:shadow-lg transition-all duration-300 border-0 rounded-2xl overflow-hidden group"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-16 h-16 ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700 font-semibold">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                              {member.name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {member.role}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                              <Badge
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  member.status
                                )}`}
                              >
                                {member.status}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {member.lastActive}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Performance</span>
                            <span className="font-medium text-gray-900">
                              {member.performance}%
                            </span>
                          </div>
                          <Progress
                            value={member.performance}
                            className="h-2"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                            <span className="text-gray-600">Projects:</span>
                            <span className="font-medium text-gray-900">
                              {member.projects}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                            <span className="text-gray-600">Skills:</span>
                            <span className="font-medium text-gray-900">
                              {member.skills.length}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {member.skills.slice(0, 3).map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {member.skills.length > 3 && (
                            <Badge
                              variant="secondary"
                              className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600"
                            >
                              +{member.skills.length - 3} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-100">
                          <Button
                            size="sm"
                            className="flex-1 h-10 rounded-[12px] bg-blue-600 hover:bg-blue-700"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-10 rounded-[12px] hover:bg-gray-50"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Profile
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {teamMembers.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">
                      No team members found
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Invite members to build your team
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {tasks.map((task) => (
                  <Card
                    key={task.id}
                    className="bg-white hover:shadow-lg transition-all duration-300 border-0 rounded-2xl overflow-hidden group"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                              {task.title}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <Badge
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(
                                task.status
                              )}`}
                            >
                              {task.status}
                            </Badge>
                            <Badge
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                            <span className="text-gray-600">Assignee:</span>
                            <span className="font-medium text-gray-900 truncate">
                              {task.assignee}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                            <span className="text-gray-600">Project:</span>
                            <span className="font-medium text-gray-900 truncate">
                              {task.project}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                            <span className="text-gray-600">Due Date:</span>
                            <span className="font-medium text-gray-900">
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                            <span className="text-gray-600">Hours:</span>
                            <span className="font-medium text-gray-900">
                              {task.actualHours}/{task.estimatedHours}h
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {task.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-100">
                          <Button
                            size="sm"
                            className="flex-1 h-10 rounded-[12px] bg-blue-600 hover:bg-blue-700"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Update
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-10 rounded-[12px] hover:bg-gray-50"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {tasks.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">
                      No tasks found
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Create tasks to organize your work
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
