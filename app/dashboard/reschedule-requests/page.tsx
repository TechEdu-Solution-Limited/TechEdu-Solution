"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  Calendar,
  Clock,
  User,
  MessageSquare,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { BookingService } from "@/lib/api/bookingService";
import { getTokenFromCookies } from "@/lib/cookies";
import { useRole } from "@/contexts/RoleContext";
import type { RescheduleRequest } from "@/types";

import { safeConsole } from "@/lib/console";
export default function RescheduleRequestsPage() {
  const { userData } = useRole();
  const [loading, setLoading] = useState(true);
  const [rescheduleRequests, setRescheduleRequests] = useState<
    RescheduleRequest[]
  >([]);
  const [selectedRequest, setSelectedRequest] =
    useState<RescheduleRequest | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    fetchRescheduleRequests();
  }, []);

  const fetchRescheduleRequests = async () => {
    setLoading(true);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      const response = await BookingService.getUserRescheduleRequests(token, {
        status: activeTab,
      });

      if (response.data?.requests) {
        setRescheduleRequests(response.data.requests);
      } else {
        toast.error("Failed to fetch reschedule requests");
      }
    } catch (error) {
      safeConsole.error("Error fetching reschedule requests:", error);
      toast.error("Error fetching reschedule requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request: RescheduleRequest) => {
    // Removed approve functionality
  };

  const handleReject = async (request: RescheduleRequest) => {
    // Removed reject functionality
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "approved":
        return (
          <Badge variant="default" className="bg-green-600">
            Approved
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "completed":
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const canTakeAction = (request: RescheduleRequest) => {
    // Removed action functionality
    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reschedule Requests
          </h1>
          <p className="text-gray-600">
            Manage and review reschedule requests for your bookings
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {rescheduleRequests.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <p className="text-gray-500">
                    No {activeTab} reschedule requests found
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {rescheduleRequests.map((request) => (
                  <Card
                    key={request._id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold text-lg">
                              Reschedule Request
                            </h3>
                            {getStatusBadge(request.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-1">
                                Current Schedule
                              </p>
                              <p className="text-sm">
                                {new Date(
                                  request.oldStartTime
                                ).toLocaleString()}{" "}
                                -{" "}
                                {new Date(request.oldEndTime).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-1">
                                Requested Schedule
                              </p>
                              <p className="text-sm">
                                {new Date(
                                  request.newStartTime
                                ).toLocaleString()}{" "}
                                -{" "}
                                {new Date(request.newEndTime).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-600 mb-1">
                              Reason
                            </p>
                            <p className="text-sm text-gray-700">
                              {request.reason}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>
                              Requested:{" "}
                              {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                            {request.updatedAt !== request.createdAt && (
                              <span>
                                Updated:{" "}
                                {new Date(
                                  request.updatedAt
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowDetails(true);
                            }}
                          >
                            View Details
                          </Button>

                          {canTakeAction(request) && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApprove(request)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(request)}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Details Dialog */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Reschedule Request Details</DialogTitle>
              <DialogDescription>
                Detailed information about this reschedule request
              </DialogDescription>
            </DialogHeader>

            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Current Schedule
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm">
                        <strong>Start:</strong>{" "}
                        {new Date(
                          selectedRequest.oldStartTime
                        ).toLocaleString()}
                      </p>
                      <p className="text-sm">
                        <strong>End:</strong>{" "}
                        {new Date(selectedRequest.oldEndTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Requested Schedule
                    </h4>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm">
                        <strong>Start:</strong>{" "}
                        {new Date(
                          selectedRequest.newStartTime
                        ).toLocaleString()}
                      </p>
                      <p className="text-sm">
                        <strong>End:</strong>{" "}
                        {new Date(selectedRequest.newEndTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Reason for Reschedule
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm">{selectedRequest.reason}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Request Information
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Status:</strong>{" "}
                        {getStatusBadge(selectedRequest.status)}
                      </p>
                      <p>
                        <strong>Requested:</strong>{" "}
                        {new Date(selectedRequest.createdAt).toLocaleString()}
                      </p>
                      <p>
                        <strong>Last Updated:</strong>{" "}
                        {new Date(selectedRequest.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">IDs</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Request ID:</strong> {selectedRequest._id}
                      </p>
                      <p>
                        <strong>Attendance ID:</strong>{" "}
                        {selectedRequest.attendanceId}
                      </p>
                      <p>
                        <strong>Instructor ID:</strong>{" "}
                        {selectedRequest.instructorId}
                      </p>
                      <p>
                        <strong>Requestor ID:</strong>{" "}
                        {selectedRequest.requestorId}
                      </p>
                    </div>
                  </div>
                </div>

                {canTakeAction(selectedRequest) && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      onClick={() => handleApprove(selectedRequest)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Request
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(selectedRequest)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Request
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
