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
  School,
  BookOpenCheck,
  Users2,
  UserPlus,
  FileSpreadsheet,
  Upload,
  Download as DownloadIcon,
  BarChart,
  LineChart,
  PieChart as PieChartIcon,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";

interface InstitutionMetrics {
  totalStudents: number;
  totalProfessionals: number;
  activeCourses: number;
  completedCourses: number;
  totalRevenue: number;
  revenueGrowth: number;
  studentSatisfaction: number;
  placementRate: number;
  averageCompletionTime: number;
  budgetUtilization: number;
  newEnrollments: number;
  graduationRate: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  program: string;
  enrollmentDate: string;
  status: "active" | "graduated" | "suspended" | "withdrawn";
  progress: number;
  gpa: number;
  coursesCompleted: number;
  totalCourses: number;
  lastActive: string;
  mentor: string;
}

interface Professional {
  id: string;
  name: string;
  email: string;
  avatar: string;
  specialization: string;
  experience: number;
  status: "active" | "inactive" | "pending";
  rating: number;
  projectsCompleted: number;
  totalEarnings: number;
  joinDate: string;
  lastActive: string;
  skills: string[];
}

interface Course {
  id: string;
  name: string;
  description: string;
  instructor: string;
  category: string;
  status: "active" | "inactive" | "draft";
  enrollmentCount: number;
  maxCapacity: number;
  completionRate: number;
  rating: number;
  duration: string;
  price: number;
  startDate: string;
  endDate: string;
}

interface Department {
  id: string;
  name: string;
  head: string;
  studentCount: number;
  professionalCount: number;
  courseCount: number;
  performance: number;
  budget: number;
  spent: number;
  status: "excellent" | "good" | "average" | "needs-improvement";
}

export default function InstitutionDashboard() {
  const { userData } = useRole();
  const [metrics, setMetrics] = useState<InstitutionMetrics | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockMetrics: InstitutionMetrics = {
      totalStudents: 1247,
      totalProfessionals: 89,
      activeCourses: 45,
      completedCourses: 156,
      totalRevenue: 285000,
      revenueGrowth: 180.5,
      studentSatisfaction: 94,
      placementRate: 87,
      averageCompletionTime: 2.8,
      budgetUtilization: 92,
      newEnrollments: 156,
      graduationRate: 89,
    };

    const mockStudents: Student[] = [
      {
        id: "1",
        name: "Sarah Johnson",
        email: "sarah.johnson@university.edu",
        avatar: "/avatars/sarah.jpg",
        program: "Computer Science",
        enrollmentDate: "2023-01-15",
        status: "active",
        progress: 75,
        gpa: 3.8,
        coursesCompleted: 18,
        totalCourses: 24,
        lastActive: "2 hours ago",
        mentor: "Dr. Michael Chen",
      },
      {
        id: "2",
        name: "David Kim",
        email: "david.kim@university.edu",
        avatar: "/avatars/david.jpg",
        program: "Data Science",
        enrollmentDate: "2023-05-20",
        status: "active",
        progress: 60,
        gpa: 3.6,
        coursesCompleted: 12,
        totalCourses: 20,
        lastActive: "1 day ago",
        mentor: "Dr. Emily Rodriguez",
      },
      {
        id: "3",
        name: "Lisa Wang",
        email: "lisa.wang@university.edu",
        avatar: "/avatars/lisa.jpg",
        program: "Software Engineering",
        enrollmentDate: "2023-05-20",
        status: "graduated",
        progress: 100,
        gpa: 3.9,
        coursesCompleted: 24,
        totalCourses: 24,
        lastActive: "1 week ago",
        mentor: "Dr. Alex Thompson",
      },
      {
        id: "4",
        name: "Mike Chen",
        email: "mike.chen@university.edu",
        avatar: "/avatars/mike.jpg",
        program: "Cybersecurity",
        enrollmentDate: "2023-01-15",
        status: "active",
        progress: 45,
        gpa: 3.4,
        coursesCompleted: 9,
        totalCourses: 20,
        lastActive: "3 hours ago",
        mentor: "Dr. Sarah Johnson",
      },
      {
        id: "5",
        name: "Emily Rodriguez",
        email: "emily.rodriguez@university.edu",
        avatar: "/avatars/emily.jpg",
        program: "Artificial Intelligence",
        enrollmentDate: "2023-01-15",
        status: "active",
        progress: 85,
        gpa: 3.7,
        coursesCompleted: 17,
        totalCourses: 20,
        lastActive: "5 hours ago",
        mentor: "Dr. David Kim",
      },
    ];

    const mockProfessionals: Professional[] = [
      {
        id: "1",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@techcorp.com",
        avatar: "/avatars/sarah.jpg",
        specialization: "Senior Software Engineer",
        experience: 8,
        status: "active",
        rating: 4.8,
        projectsCompleted: 24,
        totalEarnings: 125000,
        joinDate: "2023-05-15",
        lastActive: "2 hours ago",
        skills: ["React", "Node.js", "AWS", "TypeScript"],
      },
      {
        id: "2",
        name: "Mike Chen",
        email: "mike.chen@innovate.com",
        avatar: "/avatars/mike.jpg",
        specialization: "Full Stack Developer",
        experience: 5,
        status: "active",
        rating: 4.6,
        projectsCompleted: 18,
        totalEarnings: 95000,
        joinDate: "2023-05-20",
        lastActive: "1 day ago",
        skills: ["JavaScript", "Python", "ango", "PostgreSQL"],
      },
      {
        id: "3",
        name: "Emily Rodriguez",
        email: "emily.rodriguez@designstudio.com",
        avatar: "/avatars/emily.jpg",
        specialization: "UI/UX Designer",
        experience: 6,
        status: "active",
        rating: 4.9,
        projectsCompleted: 32,
        totalEarnings: 110000,
        joinDate: "2023-05-10",
        lastActive: "3 hours ago",
        skills: ["Figma", "Adobe XD", "HTML", "CSS"],
      },
      {
        id: "4",
        name: "David Kim",
        email: "david.kim@devops.com",
        avatar: "/avatars/david.jpg",
        specialization: "DevOps Engineer",
        experience: 7,
        status: "active",
        rating: 4.7,
        projectsCompleted: 21,
        totalEarnings: 115000,
        joinDate: "2023-05-05",
        lastActive: "5 hours ago",
        skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
      },
    ];

    const mockCourses: Course[] = [
      {
        id: "1",
        name: "Advanced Web Development",
        description:
          "Comprehensive course covering modern web development technologies and best practices",
        instructor: "Dr. Michael Chen",
        category: "Computer Science",
        status: "active",
        enrollmentCount: 45,
        maxCapacity: 50,
        completionRate: 92,
        rating: 4.8,
        duration: "12 weeks",
        price: 1200,
        startDate: "2024-01-01",
        endDate: "2024-04-30",
      },
      {
        id: "2",
        name: "Data Science Fundamentals",
        description:
          "Introduction to data science, machine learning, and statistical analysis",
        instructor: "Dr. Emily Rodriguez",
        category: "Data Science",
        status: "active",
        enrollmentCount: 38,
        maxCapacity: 40,
        completionRate: 89,
        rating: 4.6,
        duration: "10 weeks",
        price: 1000,
        startDate: "2024-02-01",
        endDate: "2024-04-30",
      },
      {
        id: "3",
        name: "Cybersecurity Essentials",
        description:
          "Comprehensive overview of cybersecurity principles and practices",
        instructor: "Dr. Sarah Johnson",
        category: "Cybersecurity",
        status: "active",
        enrollmentCount: 32,
        maxCapacity: 35,
        completionRate: 94,
        rating: 4.9,
        duration: "8 weeks",
        price: 900,
        startDate: "2024-01-01",
        endDate: "2024-03-30",
      },
      {
        id: "4",
        name: "Artificial Intelligence & Machine Learning",
        description: "Advanced course on AI/ML algorithms and applications",
        instructor: "Dr. David Kim",
        category: "Artificial Intelligence",
        status: "active",
        enrollmentCount: 28,
        maxCapacity: 30,
        completionRate: 87,
        rating: 4.7,
        duration: "14 weeks",
        price: 1500,
        startDate: "2024-01-01",
        endDate: "2024-05-15",
      },
    ];

    const mockDepartments: Department[] = [
      {
        id: "1",
        name: "Computer Science",
        head: "Dr. Michael Chen",
        studentCount: 245,
        professionalCount: 15,
        courseCount: 12,
        performance: 94,
        budget: 850000,
        spent: 780000,
        status: "excellent",
      },
      {
        id: "2",
        name: "Data Science",
        head: "Dr. Emily Rodriguez",
        studentCount: 189,
        professionalCount: 12,
        courseCount: 8,
        performance: 91,
        budget: 650000,
        spent: 590000,
        status: "excellent",
      },
      {
        id: "3",
        name: "Software Engineering",
        head: "Dr. Alex Thompson",
        studentCount: 156,
        professionalCount: 10,
        courseCount: 6,
        performance: 88,
        budget: 520000,
        spent: 480000,
        status: "good",
      },
      {
        id: "4",
        name: "Cybersecurity",
        head: "Dr. Sarah Johnson",
        studentCount: 134,
        professionalCount: 8,
        courseCount: 5,
        performance: 85,
        budget: 450000,
        spent: 420000,
        status: "good",
      },
      {
        id: "5",
        name: "Artificial Intelligence",
        head: "Dr. David Kim",
        studentCount: 98,
        professionalCount: 6,
        courseCount: 4,
        performance: 82,
        budget: 380000,
        spent: 360000,
        status: "good",
      },
    ];

    setTimeout(() => {
      setMetrics(mockMetrics);
      setStudents(mockStudents);
      setProfessionals(mockProfessionals);
      setCourses(mockCourses);
      setDepartments(mockDepartments);
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

  const getStudentStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "graduated":
        return "bg-blue-100 text-blue-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "withdrawn":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProfessionalStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCourseStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Institution data not available
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
          <h1 className="text-3xl font-bold">
            Welcome back, {userData?.fullName || "Institution Admin"}!
          </h1>
          <p className="text-gray-600 mt-2">
            Overview of institutional performance, student management, and
            academic metrics
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" /> Export Report
          </Button>
        </div>
      </div>

      {/* Institution Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Students
                </p>
                <p className="text-2xl font-bold">{metrics.totalStudents}</p>
              </div>
              <div className="p-2 bg-blue-100">
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
                  Active Courses
                </p>
                <p className="text-2xl font-bold">{metrics.activeCourses}</p>
              </div>
              <div className="p-2 bg-green-100">
                <BookOpen className="w-6 h-6 text-green-600" />
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
              <div className="p-2 bg-purple-100">
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
                  Placement Rate
                </p>
                <p className="text-2xl font-bold">{metrics.placementRate}%</p>
              </div>
              <div className="p-2 bg-yellow-100">
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
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="professionals">Professionals</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Institution Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Institution Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2">
                    <div>
                      <span className="text-gray-600">Total Revenue:</span>
                      <span className="ml-2 font-medium">
                        ${(metrics.totalRevenue / 10000).toLocaleString()}k
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Revenue Growth:</span>
                      <span className="ml-2 text-green-600 font-medium">
                        +{metrics.revenueGrowth}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        Student Satisfaction:
                      </span>
                      <span className="ml-2 font-medium">
                        {metrics.studentSatisfaction}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Graduation Rate:</span>
                      <span className="ml-2 font-medium">
                        {metrics.graduationRate}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">New Enrollments:</span>
                      <span className="ml-2 font-medium">
                        {metrics.newEnrollments}
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
                          {dept.studentCount} students
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
                      New student enrollment
                    </p>
                    <p className="text-xs text-gray-600">
                      Sarah Johnson enrolled in Computer Science program
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/avatars/mike.jpg" />
                    <AvatarFallback>MC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Course completion</p>
                    <p className="text-xs text-gray-600">
                      Advanced Web Development course completed by 45 students
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/avatars/emily.jpg" />
                    <AvatarFallback>ER</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Professional registration
                    </p>
                    <p className="text-xs text-gray-600">
                      Emily Rodriguez joined as UI/UX Designer
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">2 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {students.map((student) => (
              <Card
                key={student.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {student.name}
                          </h3>
                          <p className="text-gray-600">{student.program}</p>
                        </div>
                      </div>
                      <Badge className={getStudentStatusColor(student.status)}>
                        {student.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2">
                      <div>
                        <span className="text-gray-600">GPA:</span>
                        <span className="ml-2 font-medium">{student.gpa}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Progress:</span>
                        <span className="ml-2 font-medium">
                          {student.progress}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Courses:</span>
                        <span className="ml-2 font-medium">
                          {student.coursesCompleted}/{student.totalCourses}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Mentor:</span>
                        <span className="ml-2 font-medium">
                          {student.mentor}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{student.progress}%</span>
                      </div>
                      <Progress value={student.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        Enrolled:{" "}
                        {new Date(student.enrollmentDate).toLocaleDateString()}
                      </span>
                      <span>Last active: {student.lastActive}</span>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" /> View Profile
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4 mr-2" /> Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="professionals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {professionals.map((professional) => (
              <Card
                key={professional.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={professional.avatar} />
                          <AvatarFallback>
                            {professional.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {professional.name}
                          </h3>
                          <p className="text-gray-600">
                            {professional.specialization}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={getProfessionalStatusColor(
                            professional.status
                          )}
                        >
                          {professional.status}
                        </Badge>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="ml-1 text-sm font-medium">
                            {professional.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2">
                      <div>
                        <span className="text-gray-600">Experience:</span>
                        <span className="ml-2 font-medium">
                          {professional.experience} years
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Projects:</span>
                        <span className="ml-2 font-medium">
                          {professional.projectsCompleted}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Earnings:</span>
                        <span className="ml-2 font-medium">
                          ${professional.totalEarnings.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Join Date:</span>
                        <span className="ml-2 font-medium">
                          {new Date(professional.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {professional.skills.slice(0, 3).map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {professional.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{professional.skills.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Last active: {professional.lastActive}</span>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" /> View Profile
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4 mr-2" /> Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{course.name}</h3>
                        <p className="text-gray-600">{course.description}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Badge className={getCourseStatusColor(course.status)}>
                          {course.status}
                        </Badge>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="ml-1 text-sm font-medium">
                            {course.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2">
                      <div>
                        <span className="text-gray-600">Instructor:</span>
                        <span className="ml-2 font-medium">
                          {course.instructor}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Category:</span>
                        <span className="ml-2 font-medium">
                          {course.category}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Enrollment:</span>
                        <span className="ml-2 font-medium">
                          {course.enrollmentCount}/{course.maxCapacity}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <span className="ml-2 font-medium">
                          {course.duration}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Price:</span>
                        <span className="ml-2 font-medium">
                          ${course.price}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Completion:</span>
                        <span className="ml-2 font-medium">
                          {course.completionRate}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Enrollment</span>
                        <span>
                          {Math.round(
                            (course.enrollmentCount / course.maxCapacity) * 100
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          (course.enrollmentCount / course.maxCapacity) * 100
                        }
                        className="h-2"
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        Start: {new Date(course.startDate).toLocaleDateString()}
                      </span>
                      <span>
                        End: {new Date(course.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" /> View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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

                    <div className="grid grid-cols-2">
                      <div>
                        <span className="text-gray-600">Students:</span>
                        <span className="ml-2 font-medium">
                          {dept.studentCount}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Professionals:</span>
                        <span className="ml-2 font-medium">
                          {dept.professionalCount}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Courses:</span>
                        <span className="ml-2 font-medium">
                          {dept.courseCount}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Performance:</span>
                        <span className="ml-2 font-medium">
                          {dept.performance}%
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

                    <div className="grid grid-cols-2">
                      <div>
                        <span className="text-gray-600">Budget:</span>
                        <span className="ml-2 font-medium">
                          ${(dept.budget / 1000).toFixed(0)}k
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Spent:</span>
                        <span className="ml-2 font-medium">
                          ${(dept.spent / 1000).toFixed(0)}k
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" /> View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Users className="w-4 h-4 mr-2" /> Manage
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
