"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Video,
  Users,
  MapPin,
  BookOpen,
  GraduationCap,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  CalendarDays,
  Timer,
  User,
  FileText,
  Download,
  Share2,
} from "lucide-react";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { toast } from "react-toastify";
import { useRole } from "@/contexts/RoleContext";
import { BookingListSkeleton } from "@/components/BookingSkeletons";

// Classroom Interface based on API response
interface Classroom {
  _id: string;
  bookingId: string;
  productId: string;
  productType: "TrainingProgram" | "AcademicService";
  instructorId: string;
  scheduleAt: string;
  status: "upcoming" | "in-progress" | "completed" | "cancelled";
  meetingLink?: string;
  actualDaysAndTime: {
    day: string;
    time: string;
  }[];
  createdAt: string;
}

// Extended classroom data with instructor info
interface ClassroomWithInstructor extends Classroom {
  instructorName?: string;
  instructorEmail?: string;
  productTitle?: string;
  productDescription?: string;
}

export default function StudentClassroomsPage() {
  const { userData } = useRole();
  const [classrooms, setClassrooms] = useState<ClassroomWithInstructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchStudentClassrooms();
  }, []);

  const fetchStudentClassrooms = async () => {
    setLoading(true);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      const response = await getApiRequest(
        "/api/classrooms/student/my-classrooms",
        token
      );

      if (response?.data?.success) {
        const classroomsData = response.data.data || [];
        setClassrooms(classroomsData);
      } else {
        console.error(
          "Failed to fetch student classrooms:",
          response?.data?.message
        );
        toast.error("Failed to fetch your classrooms");
      }
    } catch (error) {
      console.error("Error fetching student classrooms:", error);
      toast.error("Error fetching your classrooms");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      upcoming: { color: "bg-blue-100 text-blue-800", label: "Upcoming" },
      "in-progress": {
        color: "bg-green-100 text-green-800",
        label: "In Progress",
      },
      completed: { color: "bg-gray-100 text-gray-800", label: "Completed" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.upcoming;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getProductTypeBadge = (productType: string) => {
    const typeConfig = {
      TrainingProgram: {
        color: "bg-purple-100 text-purple-800",
        label: "Training Program",
      },
      AcademicService: {
        color: "bg-orange-100 text-orange-800",
        label: "Academic Service",
      },
    };

    const config =
      typeConfig[productType as keyof typeof typeConfig] ||
      typeConfig.TrainingProgram;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getNextSession = (classroom: ClassroomWithInstructor) => {
    if (
      !classroom.actualDaysAndTime ||
      classroom.actualDaysAndTime.length === 0
    ) {
      return null;
    }

    const now = new Date();
    const today = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes

    // Find the next session
    for (const session of classroom.actualDaysAndTime) {
      const dayMap: { [key: string]: number } = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
      };

      const sessionDay = dayMap[session.day];
      const [startTime] = session.time.split("-");
      const [hours, minutes] = startTime.split(":").map(Number);
      const sessionTime = hours * 60 + minutes;

      if (
        sessionDay > today ||
        (sessionDay === today && sessionTime > currentTime)
      ) {
        return session;
      }
    }

    // If no future sessions this week, return the first session of next week
    return classroom.actualDaysAndTime[0];
  };

  const filteredClassrooms = classrooms.filter((classroom) => {
    const matchesSearch =
      classroom.productTitle
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      classroom.instructorName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      classroom.productType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || classroom.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusCount = (status: string) => {
    return classrooms.filter((c) =>
      status === "all" ? true : c.status === status
    ).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <BookingListSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              My Classrooms
            </h1>
            <p className="text-slate-600">
              Access your training programs and academic service classrooms
            </p>
          </div>
          <Button
            onClick={fetchStudentClassrooms}
            disabled={loading}
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span className="flex items-center gap-2">
              <RefreshCw
                className={`w-4 h-4 ${
                  loading
                    ? "animate-spin"
                    : "group-hover:rotate-180 transition-transform duration-300"
                }`}
              />
              Refresh
            </span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Total Classrooms
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {classrooms.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Upcoming</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {getStatusCount("upcoming")}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {getStatusCount("in-progress")}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-gray-600">
                    {getStatusCount("completed")}
                  </p>
                </div>
                <div className="p-3 bg-gray-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search classrooms, instructors, or programs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Tabs
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                  className="w-full"
                >
                  <TabsList className="bg-white/50 border-slate-200">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                    >
                      All ({getStatusCount("all")})
                    </TabsTrigger>
                    <TabsTrigger
                      value="upcoming"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                    >
                      Upcoming ({getStatusCount("upcoming")})
                    </TabsTrigger>
                    <TabsTrigger
                      value="in-progress"
                      className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                    >
                      In Progress ({getStatusCount("in-progress")})
                    </TabsTrigger>
                    <TabsTrigger
                      value="completed"
                      className="data-[state=active]:bg-gray-500 data-[state=active]:text-white"
                    >
                      Completed ({getStatusCount("completed")})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Classrooms List */}
        {filteredClassrooms.length === 0 ? (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12">
              <div className="text-center">
                <GraduationCap className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No classrooms found
                </h3>
                <p className="text-slate-600 mb-6">
                  {classrooms.length === 0
                    ? "You haven't joined any classrooms yet."
                    : "No classrooms match your current filters."}
                </p>
                <Button
                  onClick={() => (window.location.href = "/dashboard/bookings")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Book a Program
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredClassrooms.map((classroom) => {
              const nextSession = getNextSession(classroom);

              return (
                <Card
                  key={classroom._id}
                  className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {classroom.productType === "AcademicService" ? (
                              <GraduationCap className="w-5 h-5 text-blue-600" />
                            ) : (
                              <BookOpen className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-lg text-gray-900">
                              {classroom.productTitle ||
                                `${classroom.productType} Classroom`}
                            </CardTitle>
                            <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                              {getProductTypeBadge(classroom.productType)}
                              {getStatusBadge(classroom.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Instructor Info */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {classroom.instructorName || "Instructor"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {classroom.instructorEmail ||
                            "instructor@example.com"}
                        </p>
                      </div>
                    </div>

                    {/* Schedule Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Starts: {formatDate(classroom.scheduleAt)}</span>
                      </div>

                      {nextSession && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>
                            Next: {nextSession.day} {nextSession.time}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Session Schedule */}
                    {classroom.actualDaysAndTime &&
                      classroom.actualDaysAndTime.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">
                            Schedule:
                          </p>
                          <div className="space-y-1">
                            {classroom.actualDaysAndTime.map(
                              (session, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 text-xs text-gray-600"
                                >
                                  <CalendarDays className="w-3 h-3" />
                                  <span>
                                    {session.day} {session.time}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Meeting Link */}
                    {classroom.meetingLink &&
                      classroom.status === "upcoming" && (
                        <div className="pt-2">
                          <a
                            href={classroom.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            <Video className="w-4 h-4" />
                            Join Meeting
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <ClockIcon className="w-3 h-3" />
                        <span>
                          Created {formatDateTime(classroom.createdAt)}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        {classroom.meetingLink && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              window.open(classroom.meetingLink, "_blank")
                            }
                            className="text-xs"
                          >
                            <Video className="w-3 h-3 mr-1" />
                            Join
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            (window.location.href = `/dashboard/classroom/${classroom._id}`)
                          }
                          className="text-xs"
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
