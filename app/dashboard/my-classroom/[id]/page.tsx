"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiRequestWithRefresh } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  Calendar,
  Clock,
  Video,
  BookOpen,
  Users,
  FileText,
  ExternalLink,
  ArrowLeft,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  Check,
  Share2,
  Zap,
  Shield,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  Bell,
  Settings,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Globe,
  Wifi,
  Headphones,
  Camera,
  Keyboard,
  Monitor,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  instructorNotes?: string;
  internalNotes?: string;
  actualDaysAndTime?: Array<{
    day: string;
    time: string;
  }>;
  createdAt: string;
  updatedAt?: string;
}

export default function SingleClassroomPage() {
  const params = useParams();
  const router = useRouter();
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAdvancedInfo, setShowAdvancedInfo] = useState(false);

  useEffect(() => {
    const fetchClassroom = async () => {
      setLoading(true);
      setError(null);

      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await getApiRequestWithRefresh(
          `/api/classrooms/${params.id}`,
          token || ""
        );

        if (response?.data?.success) {
          setClassroom(response.data.data);
        } else {
          setError(response?.data?.message || "Failed to load classroom");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load classroom");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchClassroom();
    }
  }, [params.id]);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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

  const getStatusConfig = (status: string) => {
    const configs = {
      upcoming: {
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        icon: Calendar,
        label: "Upcoming",
        description: "Session scheduled",
      },
      active: {
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        icon: Play,
        label: "Active",
        description: "Currently in progress",
      },
      completed: {
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        icon: CheckCircle,
        label: "Completed",
        description: "Session finished",
      },
      cancelled: {
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: XCircle,
        label: "Cancelled",
        description: "Session cancelled",
      },
    };

    return (
      configs[status.toLowerCase() as keyof typeof configs] || configs.upcoming
    );
  };

  const getProductTypeIcon = (productType: string) => {
    const icons = {
      TrainingProgram: BookOpen,
      Workshop: Users,
      Seminar: TrendingUp,
      Course: BookOpen,
      Bootcamp: Zap,
      Certification: Shield,
    };

    return icons[productType as keyof typeof icons] || BookOpen;
  };

  const calculateTimeUntil = (dateString: string) => {
    const now = new Date();
    const target = new Date(dateString);
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const timeUntil = classroom ? calculateTimeUntil(classroom.scheduleAt) : null;
  const statusConfig = classroom ? getStatusConfig(classroom.status) : null;
  const ProductTypeIcon = classroom
    ? getProductTypeIcon(classroom.productType)
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-32 w-full rounded-2xl" />
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-32 w-full rounded-2xl" />
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !classroom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Error</AlertTitle>
            <AlertDescription className="text-red-700">
              {error || "Classroom not found"}
            </AlertDescription>
          </Alert>
          <div className="mt-6 flex gap-3">
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="hover:bg-white/80 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Classrooms
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Classroom Details
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Comprehensive view of your training session
                </p>
              </div>
            </div>
          </div>

          {/* Status Banner */}
          {statusConfig && (
            <div
              className={`p-4 rounded-2xl border ${statusConfig.bgColor} ${statusConfig.borderColor} mb-6`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${statusConfig.bgColor}`}>
                    <statusConfig.icon
                      className={`w-5 h-5 ${statusConfig.color}`}
                    />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${statusConfig.color}`}>
                      {statusConfig.label}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {statusConfig.description}
                    </p>
                  </div>
                </div>
                {timeUntil && classroom.status === "upcoming" && (
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Starts in</div>
                    <div className="text-lg font-bold text-blue-600">
                      {timeUntil}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Overview Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
                      {ProductTypeIcon && (
                        <ProductTypeIcon className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">
                        {classroom.bookingPurpose || "Training Session"}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {classroom.productType} • ID: {classroom._id.slice(-8)}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(classroom._id, "classroom-id")
                            }
                          >
                            {copiedId === "classroom-id" ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy classroom ID</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Session Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">
                        Schedule
                      </span>
                    </div>
                    <div className="text-sm text-blue-700">
                      <div>{formatDate(classroom.scheduleAt)}</div>
                      {classroom.endAt && (
                        <div className="text-xs opacity-75">
                          Ends: {formatTime(classroom.endAt)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">
                        Duration
                      </span>
                    </div>
                    <div className="text-sm text-green-700">
                      {classroom.minutesPerSession || 60} minutes per session
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-purple-800">
                        Participants
                      </span>
                    </div>
                    <div className="text-sm text-purple-700">
                      {classroom.numberOfExpectedParticipants || "Unlimited"}{" "}
                      expected
                    </div>
                  </div>
                </div>

                {/* Meeting Link */}
                {classroom.meetingLink && (
                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Video className="w-5 h-5 text-emerald-600" />
                        <div>
                          <div className="font-semibold text-emerald-800">
                            Meeting Link
                          </div>
                          <div className="text-sm text-emerald-700 truncate max-w-xs">
                            {classroom.meetingLink}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              classroom.meetingLink!,
                              "meeting-link"
                            )
                          }
                          variant="outline"
                        >
                          {copiedId === "meeting-link" ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                        <Button size="sm" asChild>
                          <Link
                            href={classroom.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Join
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Schedule Details */}
            {classroom.actualDaysAndTime &&
              classroom.actualDaysAndTime.length > 0 && (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      Recurring Schedule
                    </CardTitle>
                    <CardDescription>
                      {classroom.actualDaysAndTime.length} scheduled sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {classroom.actualDaysAndTime.map((session, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-all duration-300"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-100 rounded-full">
                              <Clock className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-semibold text-slate-800">
                              {session.day}
                            </span>
                          </div>
                          <div className="text-sm text-slate-600">
                            {session.time}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Instructor Notes */}
            {classroom.instructorNotes && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Instructor Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                    <p className="text-slate-700 leading-relaxed">
                      {classroom.instructorNotes}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Advanced Information */}
            <Collapsible
              open={showAdvancedInfo}
              onOpenChange={setShowAdvancedInfo}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-blue-600" />
                        Advanced Information
                      </CardTitle>
                      {showAdvancedInfo ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-xl">
                        <div className="text-sm font-medium text-slate-600 mb-1">
                          Booking ID
                        </div>
                        <div className="font-mono text-sm text-slate-800">
                          {classroom.bookingId}
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl">
                        <div className="text-sm font-medium text-slate-600 mb-1">
                          Product ID
                        </div>
                        <div className="font-mono text-sm text-slate-800">
                          {classroom.productId}
                        </div>
                      </div>
                    </div>

                    {classroom.internalNotes && (
                      <div className="p-4 bg-slate-50 rounded-xl">
                        <div className="text-sm font-medium text-slate-600 mb-2">
                          Internal Notes
                        </div>
                        <p className="text-sm text-slate-700">
                          {classroom.internalNotes}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-xl">
                        <div className="text-sm font-medium text-slate-600 mb-1">
                          Created
                        </div>
                        <div className="text-sm text-slate-800">
                          {formatDate(classroom.createdAt)}
                        </div>
                      </div>
                      {classroom.updatedAt && (
                        <div className="p-4 bg-slate-50 rounded-xl">
                          <div className="text-sm font-medium text-slate-600 mb-1">
                            Last Updated
                          </div>
                          <div className="text-sm text-slate-800">
                            {formatDate(classroom.updatedAt)}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {classroom.meetingLink && (
                  <Button
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    asChild
                  >
                    <Link
                      href={classroom.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Join Meeting
                    </Link>
                  </Button>
                )}

                <Button variant="outline" className="w-full">
                  <Bell className="w-4 h-4 mr-2" />
                  Set Reminder
                </Button>

                <Button variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Instructor
                </Button>

                <Button variant="outline" className="w-full">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Get Help
                </Button>
              </CardContent>
            </Card>

            {/* Session Progress */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Session Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completion</span>
                    <span className="font-medium text-gray-900">
                      {classroom.status === "completed"
                        ? "100%"
                        : classroom.status === "active"
                        ? "50%"
                        : "0%"}
                    </span>
                  </div>
                  <Progress
                    value={
                      classroom.status === "completed"
                        ? 100
                        : classroom.status === "active"
                        ? 50
                        : 0
                    }
                    className="h-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <div className="text-lg font-bold text-blue-600">
                      {classroom.minutesPerSession || 60}
                    </div>
                    <div className="text-xs text-blue-600">Minutes</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-xl">
                    <div className="text-lg font-bold text-green-600">
                      {classroom.numberOfExpectedParticipants || "∞"}
                    </div>
                    <div className="text-xs text-green-600">Participants</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Requirements */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-blue-600" />
                  Technical Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                  <Wifi className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700">
                    Stable internet connection
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <Headphones className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700">
                    Audio device (headphones/mic)
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                  <Camera className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-700">
                    Webcam (optional)
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                  <Keyboard className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-orange-700">
                    Keyboard for interaction
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Support Information */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Mail className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-700">
                    support@techeduk.com
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Phone className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-700">
                    +1 (555) 123-4567
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Globe className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-700">24/7 Live Chat</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
