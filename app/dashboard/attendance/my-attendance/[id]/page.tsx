"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  Users,
  User,
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar as CalendarIcon,
  Video,
  FileText,
  RefreshCw,
} from "lucide-react";
import { getTokenFromCookies } from "@/lib/cookies";
import { getApiRequest } from "@/lib/apiFetch";
import { toast } from "react-toastify";

import { safeConsole } from "@/lib/console";
interface AttendanceRecord {
  _id: string;
  sessionId: string | any; // Can be object or "[object Object]" string
  productType: string;
  ledBy:
    | {
        _id: string;
        fullName: string;
        email: string;
      }
    | string
    | any; // Can be object, string "[object Object]", or other
  scheduleAt: string;
  endAt: string;
  durationInMinutes: number;
  status:
    | "upcoming"
    | "ongoing"
    | "completed"
    | "cancelled"
    | "postponed"
    | string;
  title: string;
  calendar?: {
    eventId: string;
    joinUrl: string;
    synced: boolean;
  };
  participants: Array<{
    participantType: string;
    platformRole: string;
    email: string;
    fullName: string;
  }>;
  numberOfExpectedParticipants: number;
  remarks?: string;
  isPostponed: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AttendanceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const attendanceId = params.id as string;

  const [attendance, setAttendance] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendance = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const token = getTokenFromCookies();
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await getApiRequest(
        `/api/attendance/my-attendances/${attendanceId}`,
        token
      );

      if (response.data && response.status < 400) {
        setAttendance(response.data);
        if (showRefreshLoader) {
          toast.success("Attendance record updated");
        }
      } else {
        setError(response.message || "Failed to fetch attendance record");
        if (showRefreshLoader) {
          toast.error(response.message || "Failed to fetch attendance record");
        }
      }
    } catch (err) {
      const errorMessage = "Failed to fetch attendance record";
      setError(errorMessage);
      if (showRefreshLoader) {
        toast.error(errorMessage);
      }
      safeConsole.error("Error fetching attendance:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (attendanceId) {
      fetchAttendance();
    }
  }, [attendanceId]);

  const getStatusColor = (status: string) => {
    if (!status) {
      return "bg-gray-100 text-gray-800 border-gray-200";
    }
    switch (status.toLowerCase()) {
      case "upcoming":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200";
      case "ongoing":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200";
      case "completed":
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200";
      case "postponed":
        return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    if (!status) {
      return <AlertCircle className="w-4 h-4" />;
    }
    switch (status.toLowerCase()) {
      case "upcoming":
        return <Calendar className="w-4 h-4" />;
      case "ongoing":
        return <Clock className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      case "postponed":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Helper function to safely parse object fields that might be "[object Object]" strings
  const safeParseObject = (field: any): any => {
    if (typeof field === "string" && field === "[object Object]") {
      return null;
    }
    if (typeof field === "object" && field !== null) {
      return field;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!attendance) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Attendance record not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Attendance
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {attendance?.title || "Untitled Session"}
            </h1>
            <p className="text-gray-600">
              Attendance Record • {attendance?.productType || "Unknown Type"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAttendance(true)}
              disabled={refreshing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>

            <Badge
              className={`${getStatusColor(
                attendance?.status || ""
              )} flex items-center gap-1`}
            >
              {getStatusIcon(attendance?.status || "")}
              {attendance?.status
                ? attendance.status.charAt(0).toUpperCase() +
                  attendance.status.slice(1)
                : "Unknown"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Session Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Session Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Date
                </label>
                <p className="text-lg font-semibold">
                  {attendance?.scheduleAt
                    ? formatDate(attendance.scheduleAt)
                    : "TBD"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Time
                </label>
                <p className="text-lg font-semibold">
                  {attendance?.scheduleAt
                    ? formatTime(attendance.scheduleAt)
                    : "TBD"}{" "}
                  - {attendance?.endAt ? formatTime(attendance.endAt) : "TBD"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Duration
                </label>
                <p className="text-lg font-semibold flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {attendance?.durationInMinutes
                    ? formatDuration(attendance.durationInMinutes)
                    : "TBD"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Session ID
                </label>
                <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {attendance?.sessionId || "N/A"}
                </p>
              </div>
            </div>

            {attendance?.remarks && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Remarks
                </label>
                <p className="text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
                  {attendance.remarks}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructor Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Session Leader
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {(() => {
                  const ledBy = safeParseObject(attendance?.ledBy);
                  if (ledBy && typeof ledBy === "object" && ledBy?.fullName) {
                    return ledBy.fullName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("");
                  }
                  return "?";
                })()}
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {(() => {
                    const ledBy = safeParseObject(attendance?.ledBy);
                    return ledBy && typeof ledBy === "object" && ledBy?.fullName
                      ? ledBy.fullName
                      : "Unknown Instructor";
                  })()}
                </h3>
                <p className="text-gray-600">
                  {(() => {
                    const ledBy = safeParseObject(attendance?.ledBy);
                    return ledBy && typeof ledBy === "object" && ledBy?.email
                      ? ledBy.email
                      : "No email available";
                  })()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Participants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Participants ({attendance?.participants?.length || 0}/
              {attendance?.numberOfExpectedParticipants || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(attendance?.participants || []).map((participant, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {participant?.fullName
                        ? participant.fullName
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                        : "?"}
                    </div>
                    <div>
                      <p className="font-medium">
                        {participant?.fullName || "Unknown Participant"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {participant?.email || "No email"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="text-xs">
                      {participant?.platformRole || "Unknown"}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {participant?.participantType || "Unknown"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Calendar Integration */}
        {attendance?.calendar ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Calendar Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <p className="font-medium text-blue-900">
                      Meeting Link Available
                    </p>
                    <p className="text-sm text-blue-700">
                      Event ID: {attendance.calendar?.eventId || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        attendance.calendar?.synced ? "default" : "secondary"
                      }
                      className={
                        attendance.calendar?.synced
                          ? "bg-green-100 text-green-800"
                          : ""
                      }
                    >
                      {attendance.calendar?.synced ? "Synced" : "Not Synced"}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() =>
                        window.open(attendance.calendar?.joinUrl, "_blank")
                      }
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Join Meeting
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Calendar Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No calendar integration</p>
                <p className="text-sm text-gray-400">
                  Meeting link will be provided closer to the session time
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {attendance?.calendar?.joinUrl && (
                <Button
                  onClick={() =>
                    window.open(attendance.calendar?.joinUrl, "_blank")
                  }
                  className="flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  Join Meeting
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(attendance?.sessionId || "");
                  toast.success("Session ID copied to clipboard");
                }}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Copy Session ID
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const meetingInfo = `Session: ${
                    attendance?.title || "Untitled"
                  }\nDate: ${
                    attendance?.scheduleAt
                      ? formatDate(attendance.scheduleAt)
                      : "TBD"
                  }\nTime: ${
                    attendance?.scheduleAt
                      ? formatTime(attendance.scheduleAt)
                      : "TBD"
                  } - ${
                    attendance?.endAt ? formatTime(attendance.endAt) : "TBD"
                  }\nSession ID: ${attendance?.sessionId || "N/A"}`;
                  navigator.clipboard.writeText(meetingInfo);
                  toast.success("Session details copied to clipboard");
                }}
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Copy Details
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-medium text-gray-500">Created</label>
                <p>
                  {attendance?.createdAt
                    ? formatDate(attendance.createdAt)
                    : "TBD"}{" "}
                  at{" "}
                  {attendance?.createdAt
                    ? formatTime(attendance.createdAt)
                    : "TBD"}
                </p>
              </div>
              <div>
                <label className="font-medium text-gray-500">
                  Last Updated
                </label>
                <p>
                  {attendance?.updatedAt
                    ? formatDate(attendance.updatedAt)
                    : "TBD"}{" "}
                  at{" "}
                  {attendance?.updatedAt
                    ? formatTime(attendance.updatedAt)
                    : "TBD"}
                </p>
              </div>
              <div>
                <label className="font-medium text-gray-500">Postponed</label>
                <p
                  className={
                    attendance?.isPostponed
                      ? "text-yellow-600 font-medium"
                      : "text-gray-600"
                  }
                >
                  {attendance?.isPostponed ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <label className="font-medium text-gray-500">Record ID</label>
                <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {attendance?._id || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
