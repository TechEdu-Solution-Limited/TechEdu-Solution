"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
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
  Users,
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
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";

interface RoleDetails {
  title: string;
  department: string;
  level: string;
  startDate: string;
  manager: string;
  team: string;
  location: string;
  salary: number;
  currency: string;
  responsibilities: string[];
  requiredSkills: string[];
  niceToHaveSkills: string[];
  performanceMetrics: {
    overall: number;
    technical: number;
    communication: number;
    leadership: number;
    innovation: number;
  };
  goals: {
    id: string;
    title: string;
    description: string;
    status: "not-started" | "in-progress" | "completed" | "overdue";
    progress: number;
    dueDate: string;
    priority: "low" | "medium" | "high" | "critical";
  }[];
  achievements: {
    id: string;
    title: string;
    description: string;
    date: string;
    impact: "low" | "medium" | "high";
    category: string;
  }[];
  training: {
    id: string;
    title: string;
    type: "course" | "certification" | "workshop" | "conference";
    status: "not-started" | "in-progress" | "completed";
    progress: number;
    dueDate: string;
    cost: number;
    provider: string;
  }[];
  feedback: {
    id: string;
    from: string;
    type: "manager" | "peer" | "self";
    rating: number;
    comment: string;
    date: string;
    category: string;
  }[];
}

export default function MyRolePage() {
  const { userData } = useRole();
  const [roleDetails, setRoleDetails] = useState<RoleDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockRoleDetails: RoleDetails = {
      title: "Senior Software Engineer",
      department: "Engineering",
      level: "Senior",
      startDate: "2023-03-15",
      manager: "Alex Thompson",
      team: "Product Development",
      location: "San Francisco, CA",
      salary: 125000,
      currency: "USD",
      responsibilities: [
        "Lead development of new features and improvements",
        "Mentor junior developers and conduct code reviews",
        "Collaborate with product managers and designers",
        "Participate in technical architecture decisions",
        "Ensure code quality and best practices",
        "Contribute to team planning and estimation",
      ],
      requiredSkills: [
        "JavaScript/TypeScript",
        "React/Next.js",
        "Node.js",
        "AWS/Cloud Services",
        "Git/GitHub",
        "Agile/Scrum",
        "System Design",
        "API Development",
      ],
      niceToHaveSkills: [
        "Python",
        "Docker/Kubernetes",
        "GraphQL",
        "Machine Learning",
        "DevOps",
        "Mobile Development",
      ],
      performanceMetrics: {
        overall: 92,
        technical: 95,
        communication: 88,
        leadership: 85,
        innovation: 90,
      },
      goals: [
        {
          id: "1",
          title: "Complete AWS Solutions Architect Certification",
          description:
            "Obtain AWS Solutions Architect Professional certification to enhance cloud expertise",
          status: "in-progress",
          progress: 65,
          dueDate: "2024-04-30",
          priority: "high",
        },
        {
          id: "2",
          title: "Lead Technical Architecture Review",
          description:
            "Lead the quarterly technical architecture review for the team",
          status: "not-started",
          progress: 0,
          dueDate: "2024-03-31",
          priority: "medium",
        },
        {
          id: "3",
          title: "Mentor 2 Junior Developers",
          description: "Provide mentorship and guidance to 2 junior developers",
          status: "completed",
          progress: 100,
          dueDate: "2024-02-28",
          priority: "high",
        },
        {
          id: "4",
          title: "Improve Code Review Process",
          description: "Implement automated code review tools and processes",
          status: "in-progress",
          progress: 40,
          dueDate: "2024-05-15",
          priority: "medium",
        },
      ],
      achievements: [
        {
          id: "1",
          title: "Successfully Launched E-commerce Platform",
          description:
            "Led the development and launch of the new e-commerce platform, resulting in 40% increase in sales",
          date: "2024-01-15",
          impact: "high",
          category: "Project Delivery",
        },
        {
          id: "2",
          title: "Mentored 3 Junior Developers",
          description:
            "Provided mentorship to 3 junior developers, all of whom received promotions within 6 months",
          date: "2024-01-10",
          impact: "high",
          category: "Leadership",
        },
        {
          id: "3",
          title: "Implemented CI/CD Pipeline",
          description:
            "Designed and implemented automated CI/CD pipeline, reducing deployment time by 60%",
          date: "2023-12-20",
          impact: "medium",
          category: "Technical",
        },
        {
          id: "4",
          title: "Code Quality Improvement",
          description:
            "Improved code quality metrics by 25% through better practices and tooling",
          date: "2023-11-30",
          impact: "medium",
          category: "Technical",
        },
      ],
      training: [
        {
          id: "1",
          title: "AWS Solutions Architect Professional",
          type: "certification",
          status: "in-progress",
          progress: 65,
          dueDate: "2024-04-30",
          cost: 300,
          provider: "AWS",
        },
        {
          id: "2",
          title: "Advanced React Patterns",
          type: "course",
          status: "completed",
          progress: 100,
          dueDate: "2024-01-15",
          cost: 150,
          provider: "Frontend Masters",
        },
        {
          id: "3",
          title: "Leadership in Tech Workshop",
          type: "workshop",
          status: "not-started",
          progress: 0,
          dueDate: "2024-06-30",
          cost: 500,
          provider: "Tech Leadership Institute",
        },
        {
          id: "4",
          title: "React Conf 2024",
          type: "conference",
          status: "not-started",
          progress: 0,
          dueDate: "2024-05-15",
          cost: 800,
          provider: "React Foundation",
        },
      ],
      feedback: [
        {
          id: "1",
          from: "Alex Thompson",
          type: "manager",
          rating: 4.5,
          comment:
            "Excellent technical skills and leadership. Great mentor to junior developers. Could improve on cross-team communication.",
          date: "2024-01-15",
          category: "Quarterly Review",
        },
        {
          id: "2",
          from: "Sarah Johnson",
          type: "peer",
          rating: 4.8,
          comment:
            "Amazing collaborator and always willing to help. Great problem-solving skills and technical expertise.",
          date: "2024-01-10",
          category: "Peer Review",
        },
        {
          id: "3",
          from: "Mike Chen",
          type: "peer",
          rating: 4.2,
          comment:
            "Strong technical leader. Sometimes could be more patient when explaining complex concepts.",
          date: "2024-01-08",
          category: "Peer Review",
        },
      ],
    };

    setTimeout(() => {
      setRoleDetails(mockRoleDetails);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "not-started":
        return "bg-gray-100 text-gray-800";
      case "overdue":
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

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-purple-100 text-purple-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTrainingTypeColor = (type: string) => {
    switch (type) {
      case "certification":
        return "bg-blue-100 text-blue-800";
      case "course":
        return "bg-green-100 text-green-800";
      case "workshop":
        return "bg-purple-100 text-purple-800";
      case "conference":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFeedbackTypeColor = (type: string) => {
    switch (type) {
      case "manager":
        return "bg-blue-100 text-blue-800";
      case "peer":
        return "bg-green-100 text-green-800";
      case "self":
        return "bg-purple-100 text-purple-800";
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

  if (!roleDetails) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Role information not found
        </h3>
        <p className="text-gray-600">
          Please contact your manager to set up your role details.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Role</h1>
          <p className="text-gray-600 mt-2">
            Role details, performance metrics, and career development
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Update Role
          </Button>
        </div>
      </div>

      {/* Role Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Overall Performance
                </p>
                <p className="text-2xl font-bold">
                  {roleDetails.performanceMetrics.overall}%
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Goals
                </p>
                <p className="text-2xl font-bold">
                  {
                    roleDetails.goals.filter((g) => g.status === "in-progress")
                      .length
                  }
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-[10px]">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Training Progress
                </p>
                <p className="text-2xl font-bold">
                  {
                    roleDetails.training.filter(
                      (t) => t.status === "in-progress"
                    ).length
                  }
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Achievements
                </p>
                <p className="text-2xl font-bold">
                  {roleDetails.achievements.length}
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
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Role Details */}
            <Card>
              <CardHeader>
                <CardTitle>Role Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Title:</span>
                      <span className="ml-2 font-medium">
                        {roleDetails.title}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Department:</span>
                      <span className="ml-2 font-medium">
                        {roleDetails.department}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Level:</span>
                      <span className="ml-2 font-medium">
                        {roleDetails.level}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Team:</span>
                      <span className="ml-2 font-medium">
                        {roleDetails.team}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Manager:</span>
                      <span className="ml-2 font-medium">
                        {roleDetails.manager}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Location:</span>
                      <span className="ml-2 font-medium">
                        {roleDetails.location}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Start Date:</span>
                      <span className="ml-2 font-medium">
                        {new Date(roleDetails.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Salary:</span>
                      <span className="ml-2 font-medium">
                        ${roleDetails.salary.toLocaleString()}{" "}
                        {roleDetails.currency}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(roleDetails.performanceMetrics).map(
                    ([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="capitalize">{key}</span>
                          <span className="font-medium">{value}%</span>
                        </div>
                        <Progress value={value} className="h-2" />
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Responsibilities and Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {roleDetails.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {roleDetails.requiredSkills.map((skill) => (
                        <Badge
                          key={skill}
                          className="bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Nice to Have</h4>
                    <div className="flex flex-wrap gap-1">
                      {roleDetails.niceToHaveSkills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {roleDetails.goals.map((goal) => (
              <Card key={goal.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{goal.title}</h3>
                        <p className="text-gray-600 text-sm">
                          {goal.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Badge className={getStatusColor(goal.status)}>
                          {goal.status}
                        </Badge>
                        <Badge className={getPriorityColor(goal.priority)}>
                          {goal.priority}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span>Due Date:</span>
                      <span className="font-medium">
                        {new Date(goal.dueDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex space-x-2 pt-4 border-t">
                      <Button size="sm" className="flex-1">
                        <Edit className="w-4 h-4 mr-2" />
                        Update Progress
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
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(roleDetails.performanceMetrics).map(
                  ([key, value]) => (
                    <div key={key} className="p-4 border rounded-[10px]">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold capitalize">{key}</h3>
                        <span className="text-2xl font-bold">{value}%</span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {roleDetails.training.map((training) => (
              <Card
                key={training.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {training.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {training.provider}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Badge className={getTrainingTypeColor(training.type)}>
                          {training.type}
                        </Badge>
                        <Badge className={getStatusColor(training.status)}>
                          {training.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{training.progress}%</span>
                      </div>
                      <Progress value={training.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Due Date:</span>
                        <span className="ml-2 font-medium">
                          {new Date(training.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Cost:</span>
                        <span className="ml-2 font-medium">
                          ${training.cost.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-4 border-t">
                      <Button size="sm" className="flex-1">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Continue
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
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {roleDetails.achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {achievement.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {achievement.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Badge className={getImpactColor(achievement.impact)}>
                          {achievement.impact} impact
                        </Badge>
                        <Badge variant="secondary">
                          {achievement.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span>Achieved:</span>
                      <span className="font-medium">
                        {new Date(achievement.date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex space-x-2 pt-4 border-t">
                      <Button size="sm" variant="outline">
                        <Trophy className="w-4 h-4 mr-2" />
                        View Certificate
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

        <TabsContent value="feedback" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {roleDetails.feedback.map((feedback) => (
              <Card
                key={feedback.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {feedback.from}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {feedback.comment}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Badge className={getFeedbackTypeColor(feedback.type)}>
                          {feedback.type}
                        </Badge>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="ml-1 text-sm font-medium">
                            {feedback.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span>Category:</span>
                      <span className="font-medium">{feedback.category}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Date:</span>
                      <span className="font-medium">
                        {new Date(feedback.date).toLocaleDateString()}
                      </span>
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
