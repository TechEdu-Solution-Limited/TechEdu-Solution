"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ClipboardList,
  Plus,
  Filter,
  Search,
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  XCircle,
  PlayCircle,
  PauseCircle,
  Edit,
  Eye,
  MessageCircle,
  Share2,
  Download,
  RefreshCw,
  BarChart3,
  Target,
  TrendingUp,
  Star,
  ArrowRight,
  ExternalLink,
  Zap,
  ThumbsUp,
  ThumbsDown,
  Award,
  MapPin,
  DollarSign,
  Briefcase,
  Brain,
  Rocket,
  Bookmark,
  Heart,
  FileText,
  Layers,
  Settings,
  Bell,
  CheckCircle2,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Tag,
  Flag,
  Timer,
  Users,
  MessageSquare,
  Paperclip,
  Link,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "review" | "completed" | "blocked";
  priority: "low" | "medium" | "high" | "critical";
  assignee: {
    id: string;
    name: string;
    avatar: string;
  };
  project: string;
  projectId: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  tags: string[];
  dependencies: string[];
  comments: {
    id: string;
    author: string;
    content: string;
    date: string;
  }[];
  attachments: {
    id: string;
    name: string;
    type: string;
    size: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface TaskMetrics {
  total: number;
  pending: number;
  inProgress: number;
  review: number;
  completed: number;
  blocked: number;
  overdue: number;
  dueToday: number;
  dueThisWeek: number;
}

export default function TasksPage() {
  const { userData } = useRole();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [metrics, setMetrics] = useState<TaskMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Implement User Authentication System",
        description:
          "Create a secure authentication system with JWT tokens, password hashing, and role-based access control,",
        status: "in-progress",
        priority: "high",
        assignee: {
          id: "1",
          name: "Sarah Johnson",
          avatar: "/avatars/sarah.jpg",
        },
        project: "E-commerce Platform Redesign",
        projectId: "proj-1",
        dueDate: "2024-12-31",
        estimatedHours: 16,
        actualHours: 12,
        progress: 75,
        tags: ["Authentication", "Security", "Backend"],
        dependencies: ["task-3"],
        comments: [
          {
            id: "1",
            author: "Mike Chen",
            content: "Great progress! The JWT implementation looks solid.",
            date: "2024-12-01",
          },
          {
            id: "2",
            author: "Sarah Johnson",
            content: "Added password hashing with bcrypt. Ready for review.",
            date: "2024-12-02",
          },
        ],
        attachments: [
          {
            id: "1",
            name: "auth-system-design.pdf",
            type: "pdf",
            size: "2.3MB",
          },
        ],
        createdAt: "2024-11-01",
        updatedAt: "2024-11-01",
      },
      {
        id: "2",
        title: "Design Mobile App Wireframes",
        description:
          "Create comprehensive wireframes for all mobile app screens including user flows and interactions,",
        status: "review",
        priority: "medium",
        assignee: {
          id: "2",
          name: "Emily Rodriguez",
          avatar: "/avatars/emily.jpg",
        },
        project: "Mobile App Development",
        projectId: "proj-2",
        dueDate: "2024-12-31",
        estimatedHours: 20,
        actualHours: 18,
        progress: 90,
        tags: ["Design", "Wireframes"],
        dependencies: [],
        comments: [
          {
            id: "3",
            author: "David Kim",
            content:
              "Wireframes look great! Just need some adjustments to the checkout flow.",
            date: "2024-12-03",
          },
        ],
        attachments: [
          {
            id: "2",
            name: "mobile-wireframes.fig",
            type: "fig",
            size: "15.7MB",
          },
        ],
        createdAt: "2024-11-02",
        updatedAt: "2024-11-02",
      },
      {
        id: "3",
        title: "Set up CI/CD Pipeline",
        description:
          "Configure automated testing and deployment pipeline with GitHub Actions,",
        status: "completed",
        priority: "critical",
        assignee: {
          id: "3",
          name: "David Kim",
          avatar: "/avatars/david.jpg",
        },
        project: "API Integration Project",
        projectId: "proj-3",
        dueDate: "2024-12-31",
        estimatedHours: 12,
        actualHours: 14,
        progress: 100,
        tags: ["DevOps", "CI/CD", "Automation"],
        dependencies: [],
        comments: [
          {
            id: "4",
            author: "Sarah Johnson",
            content:
              "Pipeline is working perfectly! Deployments are now automated.",
            date: "2024-12-04",
          },
        ],
        attachments: [
          {
            id: "3",
            name: "ci-cd-config.yml",
            type: "yml",
            size: "4.2KB",
          },
        ],
        createdAt: "2024-11-03",
        updatedAt: "2024-11-03",
      },
      {
        id: "4",
        title: "Write Unit Tests for Core Modules",
        description:
          "Create comprehensive unit tests for authentication, user management, and payment modules,",
        status: "pending",
        priority: "high",
        assignee: {
          id: "4",
          name: "Lisa Wang",
          avatar: "/avatars/lisa.jpg",
        },
        project: "E-commerce Platform Redesign",
        projectId: "proj-1",
        dueDate: "2024-12-31",
        estimatedHours: 24,
        actualHours: 0,
        progress: 0,
        tags: ["Testing", "Unit Tests"],
        dependencies: ["task-1"],
        comments: [],
        attachments: [],
        createdAt: "2024-11-04",
        updatedAt: "2024-11-04",
      },
      {
        id: "5",
        title: "Database Schema Optimization",
        description:
          "Optimize database queries and indexes for better performance,",
        status: "blocked",
        priority: "medium",
        assignee: {
          id: "1",
          name: "Sarah Johnson",
          avatar: "/avatars/sarah.jpg",
        },
        project: "API Integration Project",
        projectId: "proj-3",
        dueDate: "2024-12-31",
        estimatedHours: 8,
        actualHours: 2,
        progress: 25,
        tags: ["Database", "Performance"],
        dependencies: ["task-3"],
        comments: [
          {
            id: "5",
            author: "Sarah Johnson",
            content:
              "Waiting for database access credentials from DevOps team.",
            date: "2024-12-03",
          },
        ],
        attachments: [],
        createdAt: "2024-11-03",
        updatedAt: "2024-11-03",
      },
      {
        id: "6",
        title: "API Documentation Update",
        description:
          "Update API documentation with new endpoints and examples,",
        status: "in-progress",
        priority: "low",
        assignee: {
          id: "2",
          name: "Emily Rodriguez",
          avatar: "/avatars/emily.jpg",
        },
        project: "API Integration Project",
        projectId: "proj-3",
        dueDate: "2024-12-31",
        estimatedHours: 6,
        actualHours: 3,
        progress: 50,
        tags: ["Documentation", "API"],
        dependencies: [],
        comments: [
          {
            id: "6",
            author: "Emily Rodriguez",
            content:
              "Halfway through the documentation. Will complete by end of week.",
            date: "2024-12-03",
          },
        ],
        attachments: [
          {
            id: "4",
            name: "api-docs.md",
            type: "md",
            size: "12.8KB",
          },
        ],
        createdAt: "2024-11-03",
        updatedAt: "2024-11-03",
      },
    ];

    const mockMetrics: TaskMetrics = {
      total: 6,
      pending: 1,
      inProgress: 2,
      review: 1,
      completed: 1,
      blocked: 1,
      overdue: 0,
      dueToday: 0,
      dueThisWeek: 2,
    };

    setTimeout(() => {
      setTasks(mockTasks);
      setMetrics(mockMetrics);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "blocked":
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "in-progress":
        return <PlayCircle className="w-4 h-4" />;
      case "review":
        return <Eye className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "blocked":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4" />;
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    const matchesProject =
      projectFilter === "all" || task.projectId === projectFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  const projects = Array.from(
    new Set(tasks.map((task) => ({ id: task.projectId, name: task.project })))
  );

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-gray-600 mt-2">
            Manage and track your team's tasks and progress
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Task Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold">{metrics?.total}</p>
              </div>
              <div className="p-2 bg-blue-100">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">{metrics?.inProgress}</p>
              </div>
              <div className="p-2 bg-green-100">
                <PlayCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{metrics?.completed}</p>
              </div>
              <div className="p-2 bg-purple-100">
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
                  Due This Week
                </p>
                <p className="text-2xl font-bold">{metrics?.dueThisWeek}</p>
              </div>
              <div className="p-2 bg-yellow-100">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Task Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{task.title}</h3>
                      <Badge className={getStatusColor(task.status)}>
                        {getStatusIcon(task.status)}
                        <span className="ml-1">{task.status}</span>
                      </Badge>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{task.description}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>

                {/* Task Details */}
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Assignee:</span>
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={task.assignee.avatar} />
                        <AvatarFallback>
                          {task.assignee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{task.assignee.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Project:</span>
                    <span className="font-medium">{task.project}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Progress and Hours */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2">
                    <div>
                      <span className="text-gray-600">Estimated:</span>
                      <span className="ml-2 font-medium">
                        {task.estimatedHours}h
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Actual:</span>
                      <span className="ml-2 font-medium">
                        {task.actualHours}h
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tags and Dependencies */}
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {task.dependencies.length > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Link className="w-4 h-4" />
                    <span>Dependencies: {task.dependencies.join(", ")}</span>
                  </div>
                )}

                {/* Comments and Attachments */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{task.comments.length} comments</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Paperclip className="w-4 h-4" />
                      <span>{task.attachments.length} attachments</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      Updated {new Date(task.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Comment
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <Card>
          <CardContent className="p-12 center">
            <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-4">
              No tasks match your current filters. Try adjusting your search
              criteria.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setPriorityFilter("all");
                setProjectFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
