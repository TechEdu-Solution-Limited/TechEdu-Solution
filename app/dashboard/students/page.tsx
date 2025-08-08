"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Filter,
  Eye,
  Edit,
  ArrowUp,
  ArrowDown,
  Star,
  Award,
  Trophy,
  Medal,
  GraduationCap,
  BookOpen,
  School,
  Building2,
  Globe,
  MapPin,
  DollarSign,
  Briefcase,
  Brain,
  Rocket,
  Zap,
  Activity,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Search,
  Plus,
  MessageCircle,
  Phone,
  Mail,
  Linkedin,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Code,
  Database,
  Cloud,
  Shield,
  Layers,
  Settings,
  Bell,
  CheckCircle2,
  XCircle as XCircleIcon,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Timer,
  CalendarDays,
  FileText,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Bookmark,
  Share,
  MoreHorizontal,
  BookOpenCheck,
  UserMinus,
  UserPlus as UserPlusIcon,
  GraduationCap as GraduationCapIcon,
  BookOpen as BookOpenIcon,
  Target as TargetIcon,
  Award as AwardIcon,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  MapPin as MapPinIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";

interface StudentMetrics {
  totalStudents: number;
  activeStudents: number;
  graduatedStudents: number;
  graduationRate: number;
  averageGPA: number;
  averageCompletionTime: number;
  totalRevenue: number;
  revenueGrowth: number;
  studentSatisfaction: number;
  retentionRate: number;
  newEnrollmentsThisMonth: number;
  dropoutsThisMonth: number;
  averageAttendance: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  program: string;
  enrollmentDate: string;
  expectedGraduation: string;
  status: "active" | "graduated" | "suspended" | "withdrawn" | "on-hold";
  gpa: number;
  creditsCompleted: number;
  totalCredits: number;
  progress: number;
  attendance: number;
  mentor: string;
  advisor: string;
  location: string;
  phone: string;
  emergencyContact: string;
  lastActive: string;
  coursesEnrolled: number;
  coursesCompleted: number;
  coursesInProgress: number;
  academicStanding: "excellent" | "good" | "probation" | "warning";
  financialStatus: "current" | "past-due" | "scholarship" | "financial-aid";
  notes: string;
}

interface Program {
  id: string;
  name: string;
  code: string;
  department: string;
  totalStudents: number;
  activeStudents: number;
  graduatedStudents: number;
  averageGPA: number;
  completionRate: number;
  averageTimeToGraduate: number;
  status: "active" | "inactive" | "suspended";
}

interface EnrollmentTrend {
  date: string;
  enrollments: number;
  graduations: number;
  dropouts: number;
  activeStudents: number;
}

interface AcademicPerformance {
  id: string;
  studentName: string;
  studentAvatar: string;
  program: string;
  gpa: number;
  creditsCompleted: number;
  progress: number;
  academicStanding: string;
  lastSemesterGPA: number;
  improvement: number;
  status: "improving" | "declining" | "stable";
}

export default function StudentManagementPage() {
  const { userData } = useRole();
  const [metrics, setMetrics] = useState<StudentMetrics | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [trends, setTrends] = useState<EnrollmentTrend[]>([]);
  const [performance, setPerformance] = useState<AcademicPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockMetrics: StudentMetrics = {
      totalStudents: 2847,
      activeStudents: 2156,
      graduatedStudents: 691,
      graduationRate: 89.2,
      averageGPA: 3.4,
      averageCompletionTime: 4.2,
      totalRevenue: 28500,
      revenueGrowth: 15.8,
      studentSatisfaction: 92.5,
      retentionRate: 94.1,
      newEnrollmentsThisMonth: 156,
      dropoutsThisMonth: 12,
      averageAttendance: 87.3,
    };

    const mockStudents: Student[] = [
      {
        id: "1",
        name: "Sarah Johnson",
        email: "sarah.johnson@university.edu",
        avatar: "/avatars/sarah.jpg",
        program: "Computer Science",
        enrollmentDate: "2023-01-01",
        expectedGraduation: "2024-05-01",
        status: "active",
        gpa: 3.8,
        creditsCompleted: 72,
        totalCredits: 120,
        progress: 60,
        attendance: 95,
        mentor: "Dr. Michael Chen",
        advisor: "Dr. Emily Rodriguez",
        location: "San Francisco, CA",
        phone: "+1-555-123-4567",
        emergencyContact: "John Johnson (+1-555-246-8012)",
        lastActive: "2 hours ago",
        coursesEnrolled: 5,
        coursesCompleted: 24,
        coursesInProgress: 5,
        academicStanding: "excellent",
        financialStatus: "current",
        notes: "High performing student, excellent attendance",
      },
      {
        id: "2",
        name: "Mike Chen",
        email: "mike.chen@university.edu",
        avatar: "/avatars/mike.jpg",
        program: "Data Science",
        enrollmentDate: "2023-05-01",
        expectedGraduation: "2024-05-01",
        status: "active",
        gpa: 3.6,
        creditsCompleted: 60,
        totalCredits: 120,
        progress: 50,
        attendance: 88,
        mentor: "Dr. Sarah Johnson",
        advisor: "Dr. David Kim",
        location: "New York, NY",
        phone: "+1-555-234-5678",
        emergencyContact: "Lisa Chen (+1-555-268-0123)",
        lastActive: "1 day ago",
        coursesEnrolled: 4,
        coursesCompleted: 20,
        coursesInProgress: 4,
        academicStanding: "good",
        financialStatus: "scholarship",
        notes: "Good progress, needs support in advanced statistics",
      },
      {
        id: "3",
        name: "Emily Rodriguez",
        email: "emily.rodriguez@university.edu",
        avatar: "/avatars/emily.jpg",
        program: "Software Engineering",
        enrollmentDate: "2023-01-01",
        expectedGraduation: "2024-05-01",
        status: "graduated",
        gpa: 3.9,
        creditsCompleted: 120,
        totalCredits: 120,
        progress: 100,
        attendance: 98,
        mentor: "Dr. Alex Thompson",
        advisor: "Dr. Sarah Johnson",
        location: "Austin, TX",
        phone: "+1-555-345-6789",
        emergencyContact: "Carlos Rodriguez (+1-555-280-1234)",
        lastActive: "1 week ago",
        coursesEnrolled: 0,
        coursesCompleted: 30,
        coursesInProgress: 0,
        academicStanding: "excellent",
        financialStatus: "current",
        notes: "Graduated with honors, excellent job placement",
      },
      {
        id: "4",
        name: "David Kim",
        email: "david.kim@university.edu",
        avatar: "/avatars/david.jpg",
        program: "Cybersecurity",
        enrollmentDate: "2023-01-01",
        expectedGraduation: "2024-05-01",
        status: "active",
        gpa: 3.2,
        creditsCompleted: 48,
        totalCredits: 120,
        progress: 40,
        attendance: 75,
        mentor: "Dr. Sarah Johnson",
        advisor: "Dr. Mike Chen",
        location: "Seattle, WA",
        phone: "+1-555-456-7890",
        emergencyContact: "Grace Kim (+1-555-301-2345)",
        lastActive: "3 hours ago",
        coursesEnrolled: 4,
        coursesCompleted: 16,
        coursesInProgress: 4,
        academicStanding: "warning",
        financialStatus: "past-due",
        notes: "Needs academic support, attendance issues",
      },
      {
        id: "5",
        name: "Lisa Wang",
        email: "lisa.wang@university.edu",
        avatar: "/avatars/lisa.jpg",
        program: "Artificial Intelligence",
        enrollmentDate: "2023-01-01",
        expectedGraduation: "2024-05-01",
        status: "active",
        gpa: 3.7,
        creditsCompleted: 84,
        totalCredits: 120,
        progress: 70,
        attendance: 92,
        mentor: "Dr. David Kim",
        advisor: "Dr. Emily Rodriguez",
        location: "Boston, MA",
        phone: "+1-555-567-8901",
        emergencyContact: "Peter Wang (+1-555-321-2345)",
        lastActive: "5 hours ago",
        coursesEnrolled: 3,
        coursesCompleted: 28,
        coursesInProgress: 3,
        academicStanding: "good",
        financialStatus: "financial-aid",
        notes: "Strong in AI/ML courses, good research potential",
      },
    ];

    const mockPrograms: Program[] = [
      {
        id: "1",
        name: "Computer Science",
        code: "CS",
        department: "Computer Science",
        totalStudents: 856,
        activeStudents: 645,
        graduatedStudents: 211,
        averageGPA: 3.5,
        completionRate: 89.2,
        averageTimeToGraduate: 40.1,
        status: "active",
      },
      {
        id: "2",
        name: "Data Science",
        code: "DS",
        department: "Data Science",
        totalStudents: 634,
        activeStudents: 498,
        graduatedStudents: 136,
        averageGPA: 3.6,
        completionRate: 91.5,
        averageTimeToGraduate: 40,
        status: "active",
      },
      {
        id: "3",
        name: "Software Engineering",
        code: "SE",
        department: "Computer Science",
        totalStudents: 445,
        activeStudents: 356,
        graduatedStudents: 89,
        averageGPA: 3.4,
        completionRate: 87.8,
        averageTimeToGraduate: 40.3,
        status: "active",
      },
      {
        id: "4",
        name: "Cybersecurity",
        code: "CYB",
        department: "Information Security",
        totalStudents: 234,
        activeStudents: 187,
        graduatedStudents: 47,
        averageGPA: 3.3,
        completionRate: 85.9,
        averageTimeToGraduate: 40.5,
        status: "active",
      },
      {
        id: "5",
        name: "Artificial Intelligence",
        code: "AI",
        department: "Computer Science",
        totalStudents: 678,
        activeStudents: 470,
        graduatedStudents: 208,
        averageGPA: 3.7,
        completionRate: 92.1,
        averageTimeToGraduate: 30.9,
        status: "active",
      },
    ];

    const mockTrends: EnrollmentTrend[] = [
      {
        date: "2023-10-01",
        enrollments: 45,
        graduations: 38,
        dropouts: 3,
        activeStudents: 2156,
      },
      {
        date: "2023-10-02",
        enrollments: 52,
        graduations: 44,
        dropouts: 2,
        activeStudents: 2162,
      },
      {
        date: "2023-10-03",
        enrollments: 48,
        graduations: 41,
        dropouts: 4,
        activeStudents: 2165,
      },
      {
        date: "2023-10-04",
        enrollments: 61,
        graduations: 52,
        dropouts: 1,
        activeStudents: 2173,
      },
      {
        date: "2023-10-05",
        enrollments: 55,
        graduations: 47,
        dropouts: 3,
        activeStudents: 2178,
      },
      {
        date: "2023-10-06",
        enrollments: 58,
        graduations: 50,
        dropouts: 2,
        activeStudents: 2184,
      },
      {
        date: "2023-10-07",
        enrollments: 62,
        graduations: 54,
        dropouts: 1,
        activeStudents: 2191,
      },
    ];

    const mockPerformance: AcademicPerformance[] = [
      {
        id: "1",
        studentName: "Sarah Johnson",
        studentAvatar: "/avatars/sarah.jpg",
        program: "Computer Science",
        gpa: 3.8,
        creditsCompleted: 72,
        progress: 60,
        academicStanding: "excellent",
        lastSemesterGPA: 3.7,
        improvement: 20.7,
        status: "improving",
      },
      {
        id: "2",
        studentName: "Mike Chen",
        studentAvatar: "/avatars/mike.jpg",
        program: "Data Science",
        gpa: 3.6,
        creditsCompleted: 60,
        progress: 50,
        academicStanding: "good",
        lastSemesterGPA: 3.5,
        improvement: 20.9,
        status: "improving",
      },
      {
        id: "3",
        studentName: "Emily Rodriguez",
        studentAvatar: "/avatars/emily.jpg",
        program: "Software Engineering",
        gpa: 3.9,
        creditsCompleted: 120,
        progress: 100,
        academicStanding: "excellent",
        lastSemesterGPA: 3.8,
        improvement: 20.6,
        status: "improving",
      },
      {
        id: "4",
        studentName: "David Kim",
        studentAvatar: "/avatars/david.jpg",
        program: "Cybersecurity",
        gpa: 3.2,
        creditsCompleted: 48,
        progress: 40,
        academicStanding: "warning",
        lastSemesterGPA: 3.4,
        improvement: -50.9,
        status: "declining",
      },
      {
        id: "5",
        studentName: "Lisa Wang",
        studentAvatar: "/avatars/lisa.jpg",
        program: "Artificial Intelligence",
        gpa: 3.7,
        creditsCompleted: 84,
        progress: 70,
        academicStanding: "good",
        lastSemesterGPA: 3.7,
        improvement: 0,
        status: "stable",
      },
    ];

    setTimeout(() => {
      setMetrics(mockMetrics);
      setStudents(mockStudents);
      setPrograms(mockPrograms);
      setTrends(mockTrends);
      setPerformance(mockPerformance);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "graduated":
        return "bg-blue-100 text-blue-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "withdrawn":
        return "bg-gray-100 text-gray-800";
      case "on-hold":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAcademicStandingColor = (standing: string) => {
    switch (standing) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "probation":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFinancialStatusColor = (status: string) => {
    switch (status) {
      case "current":
        return "bg-green-100 text-green-800";
      case "past-due":
        return "bg-red-100 text-red-800";
      case "scholarship":
        return "bg-blue-100 text-blue-800";
      case "financial-aid":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgramStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPerformanceStatusColor = (status: string) => {
    switch (status) {
      case "improving":
        return "bg-green-100 text-green-800";
      case "declining":
        return "bg-red-100 text-red-800";
      case "stable":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse"></div>
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
        <h3 className="text-lg font-semibold mb-2">Data not available</h3>
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
          <h1 className="text-3xl font-bold text-[#011F72]">
            Student Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage student enrollment, track academic progress, and monitor
            performance
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {metrics.totalStudents.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUpIcon className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600 ml-1">
                    +{metrics.newEnrollmentsThisMonth} this month
                  </span>
                </div>
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
                  Graduation Rate
                </p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {metrics.graduationRate}%
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUpIcon className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600 ml-1">
                    +{metrics.retentionRate}% retention
                  </span>
                </div>
              </div>
              <div className="p-2 bg-green-100 rounded-[10px]">
                <GraduationCapIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average GPA</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {metrics.averageGPA}
                </p>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">
                    {metrics.studentSatisfaction}% satisfaction
                  </span>
                </div>
              </div>
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <AwardIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Attendance Rate
                </p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {metrics.averageAttendance}%
                </p>
                <div className="flex items-center mt-1">
                  <ClockIcon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600 ml-1">
                    {metrics.averageCompletionTime} years avg
                  </span>
                </div>
              </div>
              <div className="p-2 bg-orange-100 rounded-[10px]">
                <CalendarIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="students" className="space-y-6">
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {students.map((student: Student) => (
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
                          <p className="text-gray-600">{student.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(student.status)}>
                          {student.status}
                        </Badge>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium ml-1">
                            {student.gpa}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Credits:</span>
                        <span className="ml-2 font-medium">
                          {student.creditsCompleted}/{student.totalCredits}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Progress:</span>
                        <span className="ml-2 font-medium">
                          {student.progress}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Attendance:</span>
                        <span className="ml-2 font-medium">
                          {student.attendance}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <span className="ml-2 font-medium">
                          {student.location}
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Badge
                          className={getAcademicStandingColor(
                            student.academicStanding
                          )}
                        >
                          {student.academicStanding}
                        </Badge>
                      </div>
                      <div>
                        <Badge
                          className={getFinancialStatusColor(
                            student.financialStatus
                          )}
                        >
                          {student.financialStatus}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-3">
                      <div className="text-center">
                        <div className="font-medium">
                          {student.coursesEnrolled}
                        </div>
                        <div className="text-gray-600">Enrolled</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">
                          {student.coursesCompleted}
                        </div>
                        <div className="text-gray-600">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">
                          {student.coursesInProgress}
                        </div>
                        <div className="text-gray-600">In Progress</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="programs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {programs.map((program: Program) => (
              <Card
                key={program.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {program.name}
                        </h3>
                        <p className="text-gray-600">
                          {program.department} - {program.code}
                        </p>
                      </div>
                      <Badge className={getProgramStatusColor(program.status)}>
                        {program.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Total Students:</span>
                        <span className="ml-2 font-medium">
                          {program.totalStudents}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Active Students:</span>
                        <span className="ml-2 font-medium">
                          {program.activeStudents}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Graduated:</span>
                        <span className="ml-2 font-medium">
                          {program.graduatedStudents}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Average GPA:</span>
                        <span className="ml-2 font-medium">
                          {program.averageGPA}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Completion Rate:</span>
                        <span className="ml-2 font-medium">
                          {program.completionRate}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Avg. Time:</span>
                        <span className="ml-2 font-medium">
                          {program.averageTimeToGraduate} years
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Completion Rate</span>
                        <span>{program.completionRate}%</span>
                      </div>
                      <Progress
                        value={program.completionRate}
                        className="h-2"
                      />
                    </div>

                    <div className="flex space-x-2">
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

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {performance.map((perf: AcademicPerformance) => (
              <Card key={perf.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={perf.studentAvatar} />
                          <AvatarFallback>
                            {perf.studentName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {perf.studentName}
                          </h3>
                          <p className="text-gray-600">{perf.program}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={getPerformanceStatusColor(perf.status)}
                        >
                          {perf.status}
                        </Badge>
                        <div className="flex items-center mt-1">
                          <span className="text-sm font-medium">
                            {perf.gpa}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">
                          Credits Completed:
                        </span>
                        <span className="ml-2 font-medium">
                          {perf.creditsCompleted}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Progress:</span>
                        <span className="ml-2 font-medium">
                          {perf.progress}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          Last Semester GPA:
                        </span>
                        <span className="ml-2 font-medium">
                          {perf.lastSemesterGPA}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Improvement:</span>
                        <span className="ml-2 font-medium">
                          {perf.improvement > 0
                            ? `+${perf.improvement}%`
                            : `${perf.improvement}%`}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{perf.progress}%</span>
                      </div>
                      <Progress value={perf.progress} className="h-2" />
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enrollment Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Enrollment Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trends
                    .slice(-5)
                    .map((trend: EnrollmentTrend, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-[10px]"
                      >
                        <div>
                          <h4 className="font-medium">
                            {new Date(trend.date).toLocaleDateString()}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {trend.enrollments} enrollments, {trend.graduations}{" "}
                            graduations
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">
                            {trend.activeStudents}
                          </span>
                          <p className="text-xs text-gray-600">
                            Active Students
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Academic Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600">Graduation Rate:</span>
                      <span className="ml-2 font-medium">
                        {metrics.graduationRate}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Retention Rate:</span>
                      <span className="ml-2 font-medium">
                        {metrics.retentionRate}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Average GPA:</span>
                      <span className="ml-2 font-medium">
                        {metrics.averageGPA}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Attendance:</span>
                      <span className="ml-2 font-medium">
                        {metrics.averageAttendance}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Completion Time:</span>
                      <span className="ml-2 font-medium">
                        {metrics.averageCompletionTime} years
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Satisfaction:</span>
                      <span className="ml-2 font-medium">
                        {metrics.studentSatisfaction}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
