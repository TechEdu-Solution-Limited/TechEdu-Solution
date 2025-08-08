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
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";

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

        // Fetch team data using the team ID
        const teamResponse = await getApiRequest(
          `/api/teams/${teamId}`,
          token || undefined
        );

        if (teamResponse.status >= 400) {
          throw new Error("Failed to fetch team data");
        }

        const team = teamResponse.data?.data;
        setTeamData(team);

        // Calculate metrics from team data
        const calculatedMetrics: TeamMetrics = {
          totalMembers: team.teamSize || 0,
          activeProjects: 0, // Will be updated when projects API is available
          completedProjects: 0,
          averagePerformance: 85, // Default value
          totalTasks: 0,
          completedTasks: 0,
          upcomingDeadlines: 0,
          budgetUtilization: 0,
        };

        setMetrics(calculatedMetrics);

        // For now, keep some mock data for team members, projects, and tasks
        // These should be replaced with actual API calls when available
        const mockTeamMembers: TeamMember[] = [
          {
            id: "1",
            name: "Sarah Johnson",
            role: "Senior Developer",
            avatar: "/avatars/sarah.jpg",
            status: "online",
            skills: team.preferredTechStack || [
              "React",
              "TypeScript",
              "Node.js",
            ],
            performance: 92,
            projects: 3,
            lastActive: "2 minutes ago",
          },
          {
            id: "2",
            name: "Mike Chen",
            role: "Full Stack Developer",
            avatar: "/avatars/mike.jpg",
            status: "busy",
            skills: team.preferredTechStack || [
              "JavaScript",
              "Python",
              "Django",
            ],
            performance: 88,
            projects: 2,
            lastActive: "5 minutes ago",
          },
        ];

        setTeamMembers(mockTeamMembers);

        // Mock projects and tasks for now
        const mockProjects: Project[] = [
          {
            id: "1",
            name: `${team.teamName} Platform Development`,
            description: `Building the main platform for ${team.teamName} team`,
            status: "in-progress",
            progress: 65,
            priority: "high",
            teamMembers: ["1", "2"],
            deadline: "2024-03-15",
            budget: 50000,
            spent: 32500,
            tasks: {
              total: 24,
              completed: 16,
              inProgress: 5,
              pending: 3,
            },
          },
        ];

        setProjects(mockProjects);

        const mockTasks: Task[] = [
          {
            id: "1",
            title: "Implement Core Features",
            description: "Set up the main functionality for the platform",
            assignee: "Sarah Johnson",
            status: "in-progress",
            priority: "high",
            dueDate: "2024-02-15",
            estimatedHours: 8,
            actualHours: 7,
            project: `${team.teamName} Platform Development`,
            tags: team.preferredTechStack || ["Development", "Backend"],
          },
        ];

        setTasks(mockTasks);
      } catch (error: any) {
        console.error("Error fetching team data:", error);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {userData?.fullName || "Team Admin"}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your team as an administrator
          </p>
          {teamData && (
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {teamData.teamName}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {teamData.location.city}, {teamData.location.state}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {teamData.teamSize} members
              </span>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="rounded-[10px]">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="rounded-[10px] text-white  hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Invite Members
          </Button>
          <Button className="rounded-[10px] text-white bg-green-600 hover:bg-green-700">
            <Settings className="w-4 h-4 mr-2" />
            Team Settings
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Team Members
                </p>
                <p className="text-2xl font-bold">{metrics?.totalMembers}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-[10px]">
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
                  Active Projects
                </p>
                <p className="text-2xl font-bold">{metrics?.activeProjects}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-[10px]">
                <Layers className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tasks Completed
                </p>
                <p className="text-2xl font-bold">
                  {metrics?.completedTasks}/{metrics?.totalTasks}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Performance
                </p>
                <p className="text-2xl font-bold">
                  {metrics?.averagePerformance}%
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-[10px]">
                <Target className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Info Card */}
      {teamData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Team Information (Admin View)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Team Details</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {teamData.teamName}
                  </p>
                  <p>
                    <span className="font-medium">Size:</span>{" "}
                    {teamData.teamSize} members
                  </p>
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {teamData.location.city}, {teamData.location.state},{" "}
                    {teamData.location.country}
                  </p>
                  <p>
                    <span className="font-medium">Training Availability:</span>{" "}
                    {teamData.trainingAvailability}
                  </p>
                  <p>
                    <span className="font-medium">Contact Email:</span>{" "}
                    {teamData.contactEmail}
                  </p>
                  <p>
                    <span className="font-medium">Contact Phone:</span>{" "}
                    {teamData.contactPhone}
                  </p>
                  <p>
                    <span className="font-medium">Admin Status:</span>{" "}
                    <Badge className="bg-green-100 text-green-800">
                      Active Admin
                    </Badge>
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tech Stack</h4>
                <div className="flex flex-wrap gap-1">
                  {teamData.preferredTechStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Learning Goals</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Goal Type:</span>{" "}
                    {teamData.learningGoals.goalType}
                  </p>
                  <p>
                    <span className="font-medium">Timeline:</span>{" "}
                    {teamData.learningGoals.trainingTimeline}
                  </p>
                  <div>
                    <span className="font-medium">Priority Areas:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {teamData.learningGoals.priorityAreas.map((area) => (
                        <Badge key={area} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold mb-3">Admin Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Manage Members
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Team Profile
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Team Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/avatars/sarah.jpg" />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Sarah Johnson completed task
                      </p>
                      <p className="text-xs text-gray-600">
                        Implement Core Features
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">2 min ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/avatars/mike.jpg" />
                      <AvatarFallback>MC</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Mike Chen updated project
                      </p>
                      <p className="text-xs text-gray-600">
                        {teamData?.teamName} Platform Development
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">15 min ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingDeadlines.map((project) => {
                    const deadline = new Date(project.deadline);
                    const now = new Date();
                    const diffDays = Math.ceil(
                      (deadline.getTime() - now.getTime()) /
                        (1000 * 60 * 60 * 24)
                    );

                    return (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-3 border rounded-[10px]"
                      >
                        <div>
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-gray-600">
                            Due in {diffDays} day{diffDays !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <Badge className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                      </div>
                    );
                  })}
                  {upcomingDeadlines.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      No upcoming deadlines
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Project Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeProjects.map((project) => (
                  <div key={project.id} className="p-4 border rounded-[10px]">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{project.name}</h3>
                        <p className="text-sm text-gray-600">
                          {project.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={getProjectStatusColor(project.status)}
                        >
                          {project.status}
                        </Badge>
                        <Badge className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                      <div>
                        <span className="text-gray-600">Tasks:</span>
                        <span className="ml-2 font-medium">
                          {project.tasks.completed}/{project.tasks.total}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Budget:</span>
                        <span className="ml-2 font-medium">
                          ${project.spent.toLocaleString()}/$
                          {project.budget.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Deadline:</span>
                        <span className="ml-2 font-medium">
                          {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {activeProjects.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No active projects
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {project.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {project.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={getProjectStatusColor(project.status)}
                        >
                          {project.status}
                        </Badge>
                        <Badge className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Tasks:</span>
                        <span className="ml-2 font-medium">
                          {project.tasks.completed}/{project.tasks.total}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Budget:</span>
                        <span className="ml-2 font-medium">
                          ${project.spent.toLocaleString()}/$
                          {project.budget.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Team Members:</span>
                        <span className="ml-2 font-medium">
                          {project.teamMembers.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Deadline:</span>
                        <span className="ml-2 font-medium">
                          {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-4 border-t">
                      <Button size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {projects.length === 0 && (
              <div className="col-span-2 text-center py-8">
                <p className="text-gray-500">No projects found</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {teamMembers.map((member) => (
              <Card
                key={member.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <p className="text-gray-600">{member.role}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getStatusColor(member.status)}>
                            {member.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {member.lastActive}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Performance</span>
                        <span>{member.performance}%</span>
                      </div>
                      <Progress value={member.performance} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Projects:</span>
                        <span className="ml-2 font-medium">
                          {member.projects}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Skills:</span>
                        <span className="ml-2 font-medium">
                          {member.skills.length}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 3).map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {member.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{member.skills.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex space-x-2 pt-4 border-t">
                      <Button size="sm" className="flex-1">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {teamMembers.length === 0 && (
              <div className="col-span-2 text-center py-8">
                <p className="text-gray-500">No team members found</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{task.title}</h3>
                        <p className="text-gray-600 text-sm">
                          {task.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Badge className={getTaskStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Assignee:</span>
                        <span className="ml-2 font-medium">
                          {task.assignee}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Project:</span>
                        <span className="ml-2 font-medium">{task.project}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Due Date:</span>
                        <span className="ml-2 font-medium">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Hours:</span>
                        <span className="ml-2 font-medium">
                          {task.actualHours}/{task.estimatedHours}h
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {task.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex space-x-2 pt-4 border-t">
                      <Button size="sm" className="flex-1">
                        <Edit className="w-4 h-4 mr-2" />
                        Update
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {tasks.length === 0 && (
              <div className="col-span-2 text-center py-8">
                <p className="text-gray-500">No tasks found</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
