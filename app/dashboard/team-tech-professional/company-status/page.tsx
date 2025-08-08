"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Building2,
  Users,
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
  Calendar,
  MapPin,
  DollarSign,
  Briefcase,
  Filter,
  Brain,
  Rocket,
  Bookmark,
  Heart,
  FileText,
  Layers,
  Settings,
  Bell,
  CheckCircle2,
  XCircle,
  PlayCircle,
  PauseCircle,
  GraduationCap,
  Trophy,
  Medal,
  PieChart,
  Activity,
  TrendingDown,
  UserCheck,
  UserX,
  GitBranch,
  GitCommit,
  GitPullRequest,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";

interface CompanyMetrics {
  totalEmployees: number;
  activeProjects: number;
  completedProjects: number;
  totalRevenue: number;
  revenueGrowth: number;
  customerSatisfaction: number;
  employeeSatisfaction: number;
  projectSuccessRate: number;
  averageProjectDuration: number;
  budgetUtilization: number;
}

interface Department {
  id: string;
  name: string;
  head: string;
  employeeCount: number;
  activeProjects: number;
  performance: number;
  budget: number;
  spent: number;
  status: "excellent" | "good" | "average" | "needs-improvement";
}

interface ProjectStatus {
  id: string;
  name: string;
  department: string;
  status: "on-track" | "at-risk" | "delayed" | "completed";
  progress: number;
  budget: number;
  spent: number;
  teamSize: number;
  deadline: string;
  priority: "low" | "medium" | "high" | "critical";
  risks: string[];
  milestones: {
    name: string;
    status: "completed" | "in-progress" | "pending";
    dueDate: string;
  }[];
}

interface TeamPerformance {
  id: string;
  name: string;
  department: string;
  members: number;
  performance: number;
  productivity: number;
  collaboration: number;
  innovation: number;
  projects: number;
  completedTasks: number;
  totalTasks: number;
}

interface CompanyAnnouncement {
  id: string;
  title: string;
  content: string;
  category: "general" | "project" | "policy" | "achievement" | "update";
  priority: "low" | "medium" | "high" | "urgent";
  author: string;
  date: string;
  isRead: boolean;
}

export default function CompanyStatusPage() {
  const { userData } = useRole();
  const [metrics, setMetrics] = useState<CompanyMetrics | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [projectStatuses, setProjectStatuses] = useState<ProjectStatus[]>([]);
  const [teamPerformances, setTeamPerformances] = useState<TeamPerformance[]>(
    []
  );
  const [announcements, setAnnouncements] = useState<CompanyAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockMetrics: CompanyMetrics = {
      totalEmployees: 245,
      activeProjects: 18,
      completedProjects: 156,
      totalRevenue: 12500000,
      revenueGrowth: 15.8,
      customerSatisfaction: 92,
      employeeSatisfaction: 88,
      projectSuccessRate: 94,
      averageProjectDuration: 4.2,
      budgetUtilization: 87,
    };

    const mockDepartments: Department[] = [
      {
        id: "1",
        name: "Engineering",
        head: "Sarah Johnson",
        employeeCount: 85,
        activeProjects: 8,
        performance: 92,
        budget: 2500000,
        spent: 2150000,
        status: "excellent",
      },
      {
        id: "2",
        name: "Product",
        head: "Mike Chen",
        employeeCount: 45,
        activeProjects: 5,
        performance: 88,
        budget: 1200000,
        spent: 980000,
        status: "good",
      },
      {
        id: "3",
        name: "Design",
        head: "Emily Rodriguez",
        employeeCount: 32,
        activeProjects: 3,
        performance: 85,
        budget: 800000,
        spent: 720000,
        status: "good",
      },
      {
        id: "4",
        name: "Sales",
        head: "David Kim",
        employeeCount: 28,
        activeProjects: 2,
        performance: 78,
        budget: 600000,
        spent: 580000,
        status: "average",
      },
      {
        id: "5",
        name: "Marketing",
        head: "Lisa Wang",
        employeeCount: 25,
        activeProjects: 2,
        performance: 82,
        budget: 500000,
        spent: 420000,
        status: "good",
      },
    ];

    const mockProjectStatuses: ProjectStatus[] = [
      {
        id: "1",
        name: "E-commerce Platform Redesign",
        department: "Engineering",
        status: "on-track",
        progress: 65,
        budget: 500000,
        spent: 325000,
        teamSize: 12,
        deadline: "2024-03-15",
        priority: "high",
        risks: [
          "Third-party API integration delays",
          "UI/UX approval timeline",
        ],
        milestones: [
          {
            name: "Requirements Gathering",
            status: "completed",
            dueDate: "2024-01-15",
          },
          { name: "Design Phase", status: "completed", dueDate: "2024-01-30" },
          {
            name: "Development Phase",
            status: "in-progress",
            dueDate: "2024-02-28",
          },
          { name: "Testing Phase", status: "pending", dueDate: "2024-03-10" },
          { name: "Launch", status: "pending", dueDate: "2024-03-15" },
        ],
      },
      {
        id: "2",
        name: "Mobile App Development",
        department: "Engineering",
        status: "at-risk",
        progress: 25,
        budget: 750000,
        spent: 150000,
        teamSize: 8,
        deadline: "2024-04-30",
        priority: "medium",
        risks: ["Platform-specific requirements", "App store approval process"],
        milestones: [
          { name: "Planning", status: "completed", dueDate: "2024-01-20" },
          { name: "Design", status: "in-progress", dueDate: "2024-02-15" },
          { name: "Development", status: "pending", dueDate: "2024-03-30" },
          { name: "Testing", status: "pending", dueDate: "2024-04-15" },
          {
            name: "App Store Submission",
            status: "pending",
            dueDate: "2024-04-30",
          },
        ],
      },
      {
        id: "3",
        name: "API Integration Project",
        department: "Engineering",
        status: "on-track",
        progress: 90,
        budget: 300000,
        spent: 285000,
        teamSize: 6,
        deadline: "2024-02-28",
        priority: "critical",
        risks: ["API rate limiting", "Data migration complexity"],
        milestones: [
          { name: "API Analysis", status: "completed", dueDate: "2024-01-10" },
          {
            name: "Integration Development",
            status: "completed",
            dueDate: "2024-01-25",
          },
          { name: "Testing", status: "completed", dueDate: "2024-02-15" },
          { name: "Deployment", status: "in-progress", dueDate: "2024-02-28" },
        ],
      },
    ];

    const mockTeamPerformances: TeamPerformance[] = [
      {
        id: "1",
        name: "Frontend Team",
        department: "Engineering",
        members: 15,
        performance: 94,
        productivity: 92,
        collaboration: 88,
        innovation: 90,
        projects: 4,
        completedTasks: 156,
        totalTasks: 180,
      },
      {
        id: "2",
        name: "Backend Team",
        department: "Engineering",
        members: 12,
        performance: 91,
        productivity: 89,
        collaboration: 92,
        innovation: 85,
        projects: 3,
        completedTasks: 134,
        totalTasks: 150,
      },
      {
        id: "3",
        name: "DevOps Team",
        department: "Engineering",
        members: 8,
        performance: 96,
        productivity: 95,
        collaboration: 90,
        innovation: 88,
        projects: 2,
        completedTasks: 89,
        totalTasks: 95,
      },
      {
        id: "4",
        name: "Product Design Team",
        department: "Design",
        members: 10,
        performance: 88,
        productivity: 85,
        collaboration: 92,
        innovation: 94,
        projects: 3,
        completedTasks: 78,
        totalTasks: 90,
      },
    ];

    const mockAnnouncements: CompanyAnnouncement[] = [
      {
        id: "1",
        title: "Q4 Results: Record Revenue Achievement",
        content:
          "We're excited to announce that we've achieved record revenue of $12.5M in Q4, representing 15.8% growth year-over-year. This success is thanks to the hard work and dedication of our entire team.",
        category: "achievement",
        priority: "high",
        author: "CEO - John Smith",
        date: "2024-01-20",
        isRead: false,
      },
      {
        id: "2",
        title: "New Remote Work Policy Update",
        content:
          "Starting next month, we're implementing a hybrid work model with 3 days in office and 2 days remote. This policy aims to balance collaboration and flexibility for our team.",
        category: "policy",
        priority: "medium",
        author: "HR Director - Maria Garcia",
        date: "2024-01-18",
        isRead: true,
      },
      {
        id: "3",
        title: "E-commerce Platform Launch Success",
        content:
          "Our new e-commerce platform has successfully launched with 40% increase in conversion rates. Congratulations to the entire engineering and design teams for this achievement!",
        category: "project",
        priority: "high",
        author: "CTO - Alex Thompson",
        date: "2024-01-15",
        isRead: true,
      },
      {
        id: "4",
        title: "Annual Company Meeting - Save the Date",
        content:
          "Mark your calendars for our annual company meeting on March 15th, 2024. We'll be sharing strategic updates, recognizing achievements, and discussing our roadmap for the year ahead.",
        category: "general",
        priority: "medium",
        author: "Executive Assistant - Lisa Wang",
        date: "2024-01-12",
        isRead: false,
      },
    ];

    setTimeout(() => {
      setMetrics(mockMetrics);
      setDepartments(mockDepartments);
      setProjectStatuses(mockProjectStatuses);
      setTeamPerformances(mockTeamPerformances);
      setAnnouncements(mockAnnouncements);
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

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "bg-green-100 text-green-800";
      case "at-risk":
        return "bg-yellow-100 text-yellow-800";
      case "delayed":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
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

  const getAnnouncementPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
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

  const getAnnouncementCategoryColor = (category: string) => {
    switch (category) {
      case "achievement":
        return "bg-purple-100 text-purple-800";
      case "project":
        return "bg-blue-100 text-blue-800";
      case "policy":
        return "bg-green-100 text-green-800";
      case "general":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Company data not available
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
          <h1 className="text-3xl font-bold">Company Status</h1>
          <p className="text-gray-600 mt-2">
            Overview of company performance, projects, and organizational health
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

      {/* Company Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Employees
                </p>
                <p className="text-2xl font-bold">{metrics.totalEmployees}</p>
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
                <p className="text-2xl font-bold">{metrics.activeProjects}</p>
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
                  Revenue Growth
                </p>
                <p className="text-2xl font-bold">{metrics.revenueGrowth}%</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Success Rate
                </p>
                <p className="text-2xl font-bold">
                  {metrics.projectSuccessRate}%
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-[10px]">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Company Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Revenue:</span>
                      <span className="ml-2 font-medium">
                        ${(metrics.totalRevenue / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Revenue Growth:</span>
                      <span className="ml-2 font-medium text-green-600">
                        +{metrics.revenueGrowth}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        Customer Satisfaction:
                      </span>
                      <span className="ml-2 font-medium">
                        {metrics.customerSatisfaction}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        Employee Satisfaction:
                      </span>
                      <span className="ml-2 font-medium">
                        {metrics.employeeSatisfaction}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        Project Success Rate:
                      </span>
                      <span className="ml-2 font-medium">
                        {metrics.projectSuccessRate}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Budget Utilization:</span>
                      <span className="ml-2 font-medium">
                        {metrics.budgetUtilization}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Department Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Department Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments.slice(0, 3).map((dept) => (
                    <div
                      key={dept.id}
                      className="flex items-center justify-between p-3 border rounded-[10px]"
                    >
                      <div>
                        <h4 className="font-medium">{dept.name}</h4>
                        <p className="text-sm text-gray-600">
                          {dept.employeeCount} employees
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(dept.status)}>
                          {dept.status}
                        </Badge>
                        <span className="text-sm font-medium">
                          {dept.performance}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Announcements */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.slice(0, 3).map((announcement) => (
                  <div
                    key={announcement.id}
                    className="flex items-start space-x-3 p-3 border rounded-[10px]"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{announcement.title}</h4>
                        {!announcement.isRead && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {announcement.content}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>{announcement.author}</span>
                        <span>
                          {new Date(announcement.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={getAnnouncementPriorityColor(
                          announcement.priority
                        )}
                      >
                        {announcement.priority}
                      </Badge>
                      <Badge
                        className={getAnnouncementCategoryColor(
                          announcement.category
                        )}
                      >
                        {announcement.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {departments.map((dept) => (
              <Card key={dept.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{dept.name}</h3>
                        <p className="text-gray-600">Head: {dept.head}</p>
                      </div>
                      <Badge className={getStatusColor(dept.status)}>
                        {dept.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Employees:</span>
                        <span className="ml-2 font-medium">
                          {dept.employeeCount}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Active Projects:</span>
                        <span className="ml-2 font-medium">
                          {dept.activeProjects}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Performance:</span>
                        <span className="ml-2 font-medium">
                          {dept.performance}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Budget:</span>
                        <span className="ml-2 font-medium">
                          ${(dept.spent / 1000).toFixed(0)}k/$
                          {(dept.budget / 1000).toFixed(0)}k
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Budget Utilization</span>
                        <span>
                          {Math.round((dept.spent / dept.budget) * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={(dept.spent / dept.budget) * 100}
                        className="h-2"
                      />
                    </div>

                    <div className="flex space-x-2 pt-4 border-t">
                      <Button size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Users className="w-4 h-4 mr-2" />
                        Team
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projectStatuses.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {project.name}
                        </h3>
                        <p className="text-gray-600">{project.department}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
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
                        <span className="text-gray-600">Team Size:</span>
                        <span className="ml-2 font-medium">
                          {project.teamSize}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Budget:</span>
                        <span className="ml-2 font-medium">
                          ${(project.spent / 1000).toFixed(0)}k/$
                          {(project.budget / 1000).toFixed(0)}k
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Deadline:</span>
                        <span className="ml-2 font-medium">
                          {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Risks:</span>
                        <span className="ml-2 font-medium">
                          {project.risks.length}
                        </span>
                      </div>
                    </div>

                    {project.risks.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Risks:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {project.risks.slice(0, 2).map((risk, index) => (
                            <li key={index} className="flex items-center">
                              <AlertCircle className="w-3 h-3 text-yellow-500 mr-2" />
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-4 border-t">
                      <Button size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <GitBranch className="w-4 h-4 mr-2" />
                        Milestones
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {teamPerformances.map((team) => (
              <Card key={team.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{team.name}</h3>
                        <p className="text-gray-600">{team.department}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          {team.performance}%
                        </p>
                        <p className="text-sm text-gray-600">Performance</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Members:</span>
                        <span className="ml-2 font-medium">{team.members}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Projects:</span>
                        <span className="ml-2 font-medium">
                          {team.projects}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tasks:</span>
                        <span className="ml-2 font-medium">
                          {team.completedTasks}/{team.totalTasks}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Completion:</span>
                        <span className="ml-2 font-medium">
                          {Math.round(
                            (team.completedTasks / team.totalTasks) * 100
                          )}
                          %
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Productivity</span>
                        <span>{team.productivity}%</span>
                      </div>
                      <Progress value={team.productivity} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <p className="font-medium">{team.collaboration}%</p>
                        <p className="text-gray-600">Collaboration</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{team.innovation}%</p>
                        <p className="text-gray-600">Innovation</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{team.performance}%</p>
                        <p className="text-gray-600">Overall</p>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-4 border-t">
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

        <TabsContent value="announcements" className="space-y-6">
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card
                key={announcement.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">
                            {announcement.title}
                          </h3>
                          {!announcement.isRead && (
                            <Badge className="bg-blue-100 text-blue-800">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600">{announcement.content}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Badge
                          className={getAnnouncementPriorityColor(
                            announcement.priority
                          )}
                        >
                          {announcement.priority}
                        </Badge>
                        <Badge
                          className={getAnnouncementCategoryColor(
                            announcement.category
                          )}
                        >
                          {announcement.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>By {announcement.author}</span>
                      <span>
                        {new Date(announcement.date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex space-x-2 pt-4 border-t">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Mark as Read
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
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
