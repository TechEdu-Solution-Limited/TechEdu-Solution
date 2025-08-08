"use client";
import React, { useEffect, useState } from "react";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  Plus,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  Edit,
  Trash2,
  CalendarDays,
  UserCheck,
  AlertCircle,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RefreshCw,
  Download,
  Upload,
  Settings,
  MoreHorizontal,
  Video,
  MessageSquare,
  User,
  GraduationCap,
  CalendarRange,
} from "lucide-react";
import Link from "next/link";

interface LedBy {
  _id: string;
  fullName: string;
  email: string;
}

interface Participant {
  participantType: string;
  platformRole: string;
  email: string;
  fullName: string;
  profileId?: string;
}

interface Calendar {
  eventId: string;
  joinUrl: string;
  synced: boolean;
}

interface Attendance {
  _id: string;
  sessionId?: string;
  classroomId?: string;
  productType: string;
  ledBy: LedBy;
  scheduleAt: string;
  endAt: string;
  durationInMinutes: number;
  status: string;
  title: string;
  participants: Participant[];
  numberOfExpectedParticipants: number;
  calendar?: Calendar;
  remarks?: string;
  isPostponed?: boolean;
  postponedTo?: {
    date: string;
    reason: string;
  };
  rescheduledFrom?: string;
  rescheduledMeetingLink?: string;
  createdAt: string;
  updatedAt: string;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function InstructorAttendancePage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProductType, setFilterProductType] = useState("all");
  const [filterInstructor, setFilterInstructor] = useState("all");
  const [dateRangeStart, setDateRangeStart] = useState("");
  const [dateRangeEnd, setDateRangeEnd] = useState("");
  const [sortBy, setSortBy] = useState("scheduleAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [instructors, setInstructors] = useState<string[]>([]);

  const PRODUCT_TYPE_OPTIONS = [
    "AcademicService",
    "TrainingProgram",
    "Workshop",
    "Seminar",
    "Course",
    "Bootcamp",
    "Certification",
    "Mentoring",
    "Consultation",
  ];

  const STATUS_OPTIONS = [
    "upcoming",
    "in_progress",
    "completed",
    "missed",
    "postponed",
  ];

  useEffect(() => {
    fetchAttendances();
  }, [
    page,
    limit,
    sortBy,
    sortOrder,
    filterStatus,
    filterProductType,
    filterInstructor,
    dateRangeStart,
    dateRangeEnd,
  ]);

  const fetchAttendances = async () => {
    setLoading(true);
    setError(null);

    const token = getTokenFromCookies();
    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
        ...(filterStatus !== "all" && { status: filterStatus }),
        ...(filterProductType !== "all" && { productType: filterProductType }),
        ...(filterInstructor !== "all" && { instructor: filterInstructor }),
        ...(dateRangeStart && { startDate: dateRangeStart }),
        ...(dateRangeEnd && { endDate: dateRangeEnd }),
        ...(searchTerm && { search: searchTerm }),
      });

      const endpoint = `/api/attendance/my-attendances?${params}`;
      const response = await getApiRequest(endpoint, token);
      console.log("Attendance API response:", response);

      if (response?.data?.success) {
        setAttendances(response.data.data.attendances || []);
        setMeta(response.data.data.meta);

        // Extract unique instructors for filter dropdown
        const uniqueInstructors = [
          ...new Set(
            response.data.data.attendances?.map(
              (attendance: Attendance) => attendance.ledBy.fullName
            ) || []
          ),
        ] as string[];
        setInstructors(uniqueInstructors);
      } else {
        setError(response?.data?.message || "Failed to load attendances");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load attendances");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200";
      case "in_progress":
        return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200";
      case "missed":
        return "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200";
      case "postponed":
        return "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200";
      default:
        return "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return <Calendar className="w-4 h-4" />;
      case "in_progress":
        return <Play className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "missed":
        return <XCircle className="w-4 h-4" />;
      case "postponed":
        return <Pause className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getProductTypeColor = (productType: string) => {
    switch (productType) {
      case "TrainingProgram":
        return "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200";
      case "AcademicService":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200";
      case "Workshop":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200";
      case "Seminar":
        return "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200";
      case "Course":
        return "bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 border-pink-200";
      case "Bootcamp":
        return "bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border-indigo-200";
      case "Certification":
        return "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-emerald-200";
      case "Mentoring":
        return "bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-800 border-cyan-200";
      case "Consultation":
        return "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border-slate-200";
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchAttendances();
  };

  const handleRefresh = () => {
    fetchAttendances();
  };

  const handleJoinSession = (attendance: Attendance) => {
    if (attendance.calendar?.joinUrl) {
      window.open(attendance.calendar.joinUrl, "_blank");
    } else {
      alert("No meeting link available for this session");
    }
  };

  const handleMarkAttendance = async (
    attendanceId: string,
    participantEmail: string,
    present: boolean
  ) => {
    // TODO: Implement attendance marking functionality
    console.log(
      `Marking ${participantEmail} as ${
        present ? "present" : "absent"
      } for attendance ${attendanceId}`
    );
  };

  const handleAddFeedback = async (
    attendanceId: string,
    participantEmail: string
  ) => {
    // TODO: Implement feedback functionality
    console.log(
      `Adding feedback for ${participantEmail} in attendance ${attendanceId}`
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterProductType("all");
    setFilterInstructor("all");
    setDateRangeStart("");
    setDateRangeEnd("");
    setPage(1);
  };

  const isCurrentUserInstructor = (attendance: Attendance) => {
    // This would need to be implemented based on how you identify the current user
    // For now, we'll assume the current user is the instructor if they're in the ledBy field
    const currentUserEmail = getTokenFromCookies()
      ? "current.user@example.com"
      : ""; // Replace with actual current user email
    return attendance.ledBy.email === currentUserEmail;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                My Sessions & Attendance
              </h1>
              <p className="text-slate-600 text-lg">
                Manage attendance for your assigned sessions and track student
                participation
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleRefresh}
                className="group relative px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                  Refresh
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="space-y-6">
            {/* Search and Basic Filters */}
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
              <div className="flex flex-col lg:flex-row gap-4 flex-1">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search sessions, students..."
                    className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-slate-400"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-8 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() +
                          status.slice(1).replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product Type Filter */}
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={filterProductType}
                    onChange={(e) => setFilterProductType(e.target.value)}
                    className="pl-10 pr-8 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="all">All Types</option>
                    {PRODUCT_TYPE_OPTIONS.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="group relative px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search
                </span>
              </button>
            </div>

            {/* Advanced Filters */}
            <div className="border-t border-slate-200 pt-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Instructor Filter */}
                <div className="relative flex-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={filterInstructor}
                    onChange={(e) => setFilterInstructor(e.target.value)}
                    className="w-full pl-10 pr-8 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="all">All Instructors</option>
                    {instructors.map((instructor) => (
                      <option key={instructor} value={instructor}>
                        {instructor}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range Start */}
                <div className="relative flex-1">
                  <CalendarRange className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    value={dateRangeStart}
                    onChange={(e) => setDateRangeStart(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Start Date"
                  />
                </div>

                {/* Date Range End */}
                <div className="relative flex-1">
                  <CalendarRange className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    value={dateRangeEnd}
                    onChange={(e) => setDateRangeEnd(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="End Date"
                  />
                </div>

                {/* Sort Options */}
                <div className="relative">
                  <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split("-");
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                    className="pl-10 pr-8 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="scheduleAt-desc">Date (Newest First)</option>
                    <option value="scheduleAt-asc">Date (Oldest First)</option>
                    <option value="title-asc">Title (A-Z)</option>
                    <option value="title-desc">Title (Z-A)</option>
                    <option value="status-asc">Status (A-Z)</option>
                    <option value="status-desc">Status (Z-A)</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="px-6 py-4 bg-slate-100 text-slate-700 font-semibold rounded-2xl hover:bg-slate-200 transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 text-lg">{error}</p>
            </div>
          ) : attendances.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">No sessions found</p>
              <p className="text-slate-500">
                You don't have any assigned sessions yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Sessions List */}
              {attendances.map((attendance) => (
                <div
                  key={attendance._id}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-6 hover:shadow-lg transition-all duration-300"
                >
                  {/* Session Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-slate-900">
                          {attendance.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            attendance.status
                          )}`}
                        >
                          <span className="flex items-center gap-1">
                            {getStatusIcon(attendance.status)}
                            {attendance.status.charAt(0).toUpperCase() +
                              attendance.status.slice(1).replace("_", " ")}
                          </span>
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getProductTypeColor(
                            attendance.productType
                          )}`}
                        >
                          {attendance.productType}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(attendance.scheduleAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {attendance.durationInMinutes} minutes
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {attendance.participants.length}/
                          {attendance.numberOfExpectedParticipants} participants
                        </span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-4 h-4" />
                          {attendance.ledBy.fullName}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      {attendance.status === "upcoming" &&
                        attendance.calendar?.joinUrl && (
                          <button
                            onClick={() => handleJoinSession(attendance)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                          >
                            <Video className="w-4 h-4" />
                            Join Session
                          </button>
                        )}
                      {attendance.status === "in_progress" && (
                        <button
                          onClick={() => handleJoinSession(attendance)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                        >
                          <Play className="w-4 h-4" />
                          Continue Session
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Participants List */}
                  <div className="border-t border-slate-200 pt-4">
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">
                      Participants
                    </h4>
                    <div className="grid gap-3">
                      {attendance.participants.map((participant, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {participant.fullName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">
                                {participant.fullName}
                              </p>
                              <p className="text-sm text-slate-600">
                                {participant.email} • {participant.platformRole}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Attendance Marking (for completed sessions) */}
                            {attendance.status === "completed" && (
                              <button
                                onClick={() =>
                                  handleMarkAttendance(
                                    attendance._id,
                                    participant.email,
                                    true
                                  )
                                }
                                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                title="Mark Present"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}

                            {/* Feedback Button */}
                            <button
                              onClick={() =>
                                handleAddFeedback(
                                  attendance._id,
                                  participant.email
                                )
                              }
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Add Feedback"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Session Notes */}
                  {attendance.remarks && (
                    <div className="border-t border-slate-200 pt-4 mt-4">
                      <h4 className="text-lg font-semibold text-slate-900 mb-2">
                        Session Notes
                      </h4>
                      <p className="text-slate-700 bg-slate-50 p-3 rounded-xl">
                        {attendance.remarks}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                  <div className="text-sm text-slate-600">
                    Showing {(meta.page - 1) * meta.limit + 1} to{" "}
                    {Math.min(meta.page * meta.limit, meta.total)} of{" "}
                    {meta.total} sessions
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === meta.totalPages}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
