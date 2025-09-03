"use client";
import React, { useEffect, useState } from "react";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  Calendar,
  Clock,
  Video,
  BookOpen,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  XCircle,
  Play,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

interface Classroom {
  _id: string;
  bookingId: string;
  productId: string;
  productType: string;
  bookingPurpose?: string;
  instructorId?: string;
  scheduleAt: string;
  endAt?: string;
  minutesPerSession?: number;
  numberOfExpectedParticipants?: number;
  meetingLink?: string;
  status: string;
  sessionType?: string;
  participantType?: string;
  sessionsCompleted?: number;
  sessionsRemaining?: number;
  participants?: Array<{
    participantType: string;
    platformRole: string;
    profileId: string;
    email: string;
    fullName: string;
    _id: string;
  }>;
  instructorNotes?: string;
  internalNotes?: string;
  actualDaysAndTime?: Array<{
    day: string;
    time: string;
  }>;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function StudentClassroomsPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortKey, setSortKey] = useState("scheduleAt");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchClassrooms = async () => {
      setLoading(true);
      setError(null);

      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const endpoint = "/api/classrooms/student/my-classrooms";
        const response = await getApiRequest(endpoint, token);

        if (response?.data?.success) {
          setClassrooms(response.data.data);
        } else {
          setError(response?.data?.message || "Failed to load classrooms");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load classrooms");
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  // Filter and sort logic
  const filteredClassrooms = classrooms.filter((classroom) => {
    const matchesSearch =
      classroom.bookingPurpose
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      classroom.productType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classroom.status.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || classroom.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const sortedClassrooms = [...filteredClassrooms].sort((a, b) => {
    let aVal = a[sortKey as keyof Classroom];
    let bVal = b[sortKey as keyof Classroom];

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }

    return 0;
  });

  const totalPages = Math.ceil(sortedClassrooms.length / itemsPerPage);
  const paginatedClassrooms = sortedClassrooms.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    if (!status) {
      return "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border-slate-200";
    }
    switch (status.toLowerCase()) {
      case "upcoming":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200";
      case "active":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200";
      case "completed":
        return "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200";
      case "cancelled":
        return "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200";
      default:
        return "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    if (!status) {
      return <Clock className="w-4 h-4" />;
    }
    switch (status.toLowerCase()) {
      case "upcoming":
        return <Calendar className="w-4 h-4" />;
      case "active":
        return <Play className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getParticipantInfo = (classroom: Classroom) => {
    if (classroom.participants && classroom.participants.length > 0) {
      const participantCount = classroom.participants.length;
      const participantType =
        classroom.participants[0]?.participantType || "Individual";
      return { count: participantCount, type: participantType };
    }

    return {
      count: classroom.numberOfExpectedParticipants || 1,
      type: classroom.participantType || "Individual",
    };
  };

  const getSessionProgress = (classroom: Classroom) => {
    const completed = classroom.sessionsCompleted || 0;
    const remaining = classroom.sessionsRemaining || 0;
    const total = completed + remaining;

    if (total === 0) return "No sessions scheduled";

    return `${completed}/${total} completed`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                My Classrooms
              </h1>
              <p className="text-slate-600 text-lg">
                View and join your enrolled training sessions
              </p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
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
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search classrooms..."
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-slate-400"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10 pr-8 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sort Controls */}
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                  className="px-6 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="scheduleAt">Sort by Date</option>
                  <option value="status">Sort by Status</option>
                  <option value="productType">Sort by Type</option>
                  <option value="sessionType">Sort by Session Type</option>
                  <option value="sessionsCompleted">Sort by Progress</option>
                  <option value="createdAt">Sort by Created Date</option>
                </select>
              </div>
              <button
                onClick={() =>
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                }
                className="px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl hover:bg-white/80 transition-all duration-300 flex items-center justify-center"
              >
                {sortDirection === "asc" ? (
                  <SortAsc className="h-5 w-5 text-slate-600" />
                ) : (
                  <SortDesc className="h-5 w-5 text-slate-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Classrooms Cards */}
        <div className="space-y-6">
          {loading ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 text-center">
              <div className="inline-flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-slate-600 text-lg">Loading classrooms...</p>
              </div>
            </div>
          ) : paginatedClassrooms.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedClassrooms.map((classroom) => (
                <div
                  key={classroom._id}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300 mb-1">
                        {classroom.bookingPurpose || "Training Session"}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>ID: {classroom._id.slice(-8)}</span>
                        {classroom.bookingId && (
                          <>
                            <span>•</span>
                            <span>
                              Booking: {String(classroom.bookingId).slice(-8)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <Link href={`/dashboard/classrooms/${classroom._id}`}>
                      <button className="p-2 rounded-full hover:bg-blue-100 transition-all duration-300">
                        <Eye className="w-5 h-5 text-slate-600 hover:text-blue-600 transition-colors duration-300" />
                      </button>
                    </Link>
                  </div>

                  {/* Status and Type Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
                        classroom.status
                      )}`}
                    >
                      {getStatusIcon(classroom.status)}
                      {classroom.status || "Unknown"}
                    </span>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
                      {classroom.productType}
                    </span>
                    {classroom.sessionType && (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border border-purple-200">
                        {classroom.sessionType}
                      </span>
                    )}
                  </div>

                  {/* Schedule Information */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">Schedule</span>
                    </div>
                    <div className="text-sm text-slate-900">
                      {formatDate(classroom.scheduleAt)}
                    </div>
                    {classroom.actualDaysAndTime &&
                    classroom.actualDaysAndTime.length > 0 ? (
                      <div className="text-xs text-slate-500 mt-1">
                        {classroom.actualDaysAndTime.length} recurring sessions
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 mt-1">
                        Single session
                      </div>
                    )}
                  </div>

                  {/* Progress Information */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Progress</span>
                    </div>
                    <div className="text-sm text-slate-900">
                      {getSessionProgress(classroom)}
                    </div>
                    {((classroom.sessionsCompleted ?? 0) > 0 ||
                      (classroom.sessionsRemaining ?? 0) > 0) && (
                      <div className="text-xs text-slate-500">
                        {classroom.sessionsRemaining || 0} remaining
                      </div>
                    )}
                  </div>

                  {/* Participants Information */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm font-medium">Participants</span>
                    </div>
                    <div className="text-sm text-slate-900">
                      {getParticipantInfo(classroom).count} participant(s)
                    </div>
                    <div className="text-xs text-slate-500">
                      {getParticipantInfo(classroom).type}
                    </div>
                  </div>

                  {/* Meeting Link */}
                  <div className="pt-4 border-t border-slate-200">
                    {classroom.meetingLink &&
                    classroom.meetingLink.trim() !== "" ? (
                      <a
                        href={classroom.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 hover:from-green-200 hover:to-emerald-200 transition-all duration-300 w-full justify-center"
                      >
                        <Video className="w-4 h-4" />
                        Join Meeting
                      </a>
                    ) : (
                      <div className="text-center py-2">
                        <div className="flex items-center justify-center gap-2 text-amber-600 mb-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Link Pending
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">
                          Instructor will provide link before session
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-16 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-r from-slate-100 to-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    No classrooms found
                  </h3>
                  <p className="text-slate-600">
                    You haven't joined any classrooms yet
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-slate-600">
                Showing{" "}
                <span className="font-semibold text-slate-900">
                  {Math.min(
                    (page - 1) * itemsPerPage + 1,
                    sortedClassrooms.length
                  )}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-900">
                  {Math.min(page * itemsPerPage, sortedClassrooms.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-900">
                  {sortedClassrooms.length}
                </span>{" "}
                classrooms
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-6 py-3 text-slate-700 bg-white/50 border border-slate-200 hover:bg-white/80 font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                  aria-label="Previous page"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-6 py-3 text-slate-700 bg-white/50 border border-slate-200 hover:bg-white/80 font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
