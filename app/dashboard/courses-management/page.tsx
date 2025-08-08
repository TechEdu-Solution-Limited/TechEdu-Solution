"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Users,
  UserCheck,
  UserPlus,
  Edit,
  Eye,
  BarChart3,
  Calendar,
  Clock,
  Star,
  Award,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Plus,
  MessageCircle,
  Download,
  AlertCircle,
  Layers,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";

interface CourseMetrics {
  totalCourses: number;
  activeCourses: number;
  completedCourses: number;
  averageRating: number;
  averageCompletionRate: number;
  totalEnrollments: number;
  newCoursesThisMonth: number;
  revenue: number;
  revenueGrowth: number;
}

interface Course {
  id: string;
  name: string;
  description: string;
  instructor: string;
  instructorAvatar: string;
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

interface Instructor {
  id: string;
  name: string;
  avatar: string;
  email: string;
  courses: string[];
  status: "active" | "inactive";
  rating: number;
  students: number;
}

interface Enrollment {
  id: string;
  studentName: string;
  studentAvatar: string;
  courseName: string;
  status: "enrolled" | "completed" | "dropped";
  enrollmentDate: string;
  completionDate?: string;
  progress: number;
  grade?: string;
}

export default function CoursesManagementPage() {
  const { userData } = useRole();
  const [metrics, setMetrics] = useState<CourseMetrics | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockMetrics: CourseMetrics = {
      totalCourses: 45,
      activeCourses: 32,
      completedCourses: 13,
      averageRating: 4.7,
      averageCompletionRate: 89.2,
      totalEnrollments: 1247,
      newCoursesThisMonth: 3,
      revenue: 285000,
      revenueGrowth: 12.5,
    };

    const mockCourses: Course[] = [
      {
        id: "1",
        name: "Advanced Web Development",
        description:
          "Comprehensive course covering modern web development technologies and best practices.",
        instructor: "Dr. Michael Chen",
        instructorAvatar: "/avatars/mike.jpg",
        category: "Computer Science",
        status: "active",
        enrollmentCount: 45,
        maxCapacity: 50,
        completionRate: 92,
        rating: 4.8,
        duration: "12 weeks",
        price: 1200,
        startDate: "2024-01-01",
        endDate: "2024-04-01",
      },
      {
        id: "2",
        name: "Data Science Fundamentals",
        description:
          "Introduction to data science, machine learning, and statistical analysis.",
        instructor: "Dr. Emily Rodriguez",
        instructorAvatar: "/avatars/emily.jpg",
        category: "Data Science",
        status: "active",
        enrollmentCount: 38,
        maxCapacity: 40,
        completionRate: 89,
        rating: 4.6,
        duration: "10 weeks",
        price: 1000,
        startDate: "2024-02-01",
        endDate: "2024-04-15",
      },
      {
        id: "3",
        name: "Cybersecurity Essentials",
        description:
          "Comprehensive overview of cybersecurity principles and practices.",
        instructor: "Dr. Sarah Johnson",
        instructorAvatar: "/avatars/sarah.jpg",
        category: "Cybersecurity",
        status: "active",
        enrollmentCount: 32,
        maxCapacity: 35,
        completionRate: 94,
        rating: 4.9,
        duration: "8 weeks",
        price: 900,
        startDate: "2024-01-15",
        endDate: "2024-03-30",
      },
      {
        id: "4",
        name: "Artificial Intelligence & Machine Learning",
        description: "Advanced course on AI/ML algorithms and applications.",
        instructor: "Dr. David Kim",
        instructorAvatar: "/avatars/david.jpg",
        category: "Artificial Intelligence",
        status: "active",
        enrollmentCount: 28,
        maxCapacity: 30,
        completionRate: 87,
        rating: 4.7,
        duration: "14 weeks",
        price: 1500,
        startDate: "2024-01-20",
        endDate: "2024-05-01",
      },
    ];

    const mockInstructors: Instructor[] = [
      {
        id: "1",
        name: "Dr. Michael Chen",
        avatar: "/avatars/mike.jpg",
        email: "michael.chen@university.edu",
        courses: ["Advanced Web Development"],
        status: "active",
        rating: 4.8,
        students: 45,
      },
      {
        id: "2",
        name: "Dr. Emily Rodriguez",
        avatar: "/avatars/emily.jpg",
        email: "emily.rodriguez@university.edu",
        courses: ["Data Science Fundamentals"],
        status: "active",
        rating: 4.6,
        students: 38,
      },
      {
        id: "3",
        name: "Dr. Sarah Johnson",
        avatar: "/avatars/sarah.jpg",
        email: "sarah.johnson@university.edu",
        courses: ["Cybersecurity Essentials"],
        status: "active",
        rating: 4.9,
        students: 32,
      },
      {
        id: "4",
        name: "Dr. David Kim",
        avatar: "/avatars/david.jpg",
        email: "david.kim@university.edu",
        courses: ["Artificial Intelligence & Machine Learning"],
        status: "active",
        rating: 4.7,
        students: 28,
      },
    ];

    const mockEnrollments: Enrollment[] = [
      {
        id: "1",
        studentName: "Sarah Johnson",
        studentAvatar: "/avatars/sarah.jpg",
        courseName: "Advanced Web Development",
        status: "enrolled",
        enrollmentDate: "2024-01-01",
        progress: 75,
      },
      {
        id: "2",
        studentName: "Mike Chen",
        studentAvatar: "/avatars/mike.jpg",
        courseName: "Data Science Fundamentals",
        status: "completed",
        enrollmentDate: "2024-02-01",
        completionDate: "2024-04-10",
        progress: 100,
        grade: "A",
      },
      {
        id: "3",
        studentName: "Emily Rodriguez",
        studentAvatar: "/avatars/emily.jpg",
        courseName: "Cybersecurity Essentials",
        status: "enrolled",
        enrollmentDate: "2024-01-15",
        progress: 60,
      },
      {
        id: "4",
        studentName: "Lisa Wang",
        studentAvatar: "/avatars/lisa.jpg",
        courseName: "Artificial Intelligence & Machine Learning",
        status: "enrolled",
        enrollmentDate: "2024-01-20",
        progress: 85,
      },
    ];

    setTimeout(() => {
      setMetrics(mockMetrics);
      setCourses(mockCourses);
      setInstructors(mockInstructors);
      setEnrollments(mockEnrollments);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
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
          Course data not available
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
          <h1 className="text-3xl font-bold">Courses Management</h1>
          <p className="text-gray-600 mt-2">
            Manage courses, instructors, and student enrollments
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Course
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
                  Total Courses
                </p>
                <p className="text-2xl font-bold">{metrics.totalCourses}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600 ml-1">
                    +{metrics.newCoursesThisMonth} this month
                  </span>
                </div>
              </div>
              <div className="p-2 bg-blue-100">
                <BookOpen className="w-6 h-6 text-blue-600" />
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
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600 ml-1">
                    {metrics.averageCompletionRate}% completion
                  </span>
                </div>
              </div>
              <div className="p-2 bg-green-100">
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
                  Average Rating
                </p>
                <p className="text-2xl font-bold">{metrics.averageRating}</p>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">
                    {metrics.completedCourses} completed
                  </span>
                </div>
              </div>
              <div className="p-2 bg-yellow-100">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Enrollments
                </p>
                <p className="text-2xl font-bold">{metrics.totalEnrollments}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600 ml-1">
                    ${metrics.revenue.toLocaleString()} revenue
                  </span>
                </div>
              </div>
              <div className="p-2 bg-purple-100">
                <Layers className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="instructors">Instructors</TabsTrigger>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
        </TabsList>

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
                      <div>
                        <h3 className="font-semibold text-lg">{course.name}</h3>
                        <p className="text-gray-600">{course.description}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Badge className={getStatusColor(course.status)}>
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

                    <div className="grid grid-cols-2 gap-4">
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
          </div>
        </TabsContent>

        <TabsContent value="instructors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {instructors.map((instructor) => (
              <Card
                key={instructor.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={instructor.avatar} />
                          <AvatarFallback>
                            {instructor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {instructor.name}
                          </h3>
                          <p className="text-gray-600">{instructor.email}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(instructor.status)}>
                        {instructor.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Courses:</span>
                        <span className="ml-2 font-medium">
                          {instructor.courses.join(", ")}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Students:</span>
                        <span className="ml-2 font-medium">
                          {instructor.students}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Rating:</span>
                        <span className="ml-2 font-medium">
                          {instructor.rating}
                        </span>
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

        <TabsContent value="enrollments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {enrollments.map((enrollment) => (
              <Card
                key={enrollment.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={enrollment.studentAvatar} />
                          <AvatarFallback>
                            {enrollment.studentName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {enrollment.studentName}
                          </h3>
                          <p className="text-gray-600">
                            {enrollment.courseName}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(enrollment.status)}>
                        {enrollment.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Enrollment Date:</span>
                        <span className="ml-2 font-medium">
                          {new Date(
                            enrollment.enrollmentDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Progress:</span>
                        <span className="ml-2 font-medium">
                          {enrollment.progress}%
                        </span>
                      </div>
                      {enrollment.completionDate && (
                        <div>
                          <span className="text-gray-600">Completed:</span>
                          <span className="ml-2 font-medium">
                            {new Date(
                              enrollment.completionDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {enrollment.grade && (
                        <div>
                          <span className="text-gray-600">Grade:</span>
                          <span className="ml-2 font-medium">
                            {enrollment.grade}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{enrollment.progress}%</span>
                      </div>
                      <Progress value={enrollment.progress} className="h-2" />
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
      </Tabs>
    </div>
  );
}
