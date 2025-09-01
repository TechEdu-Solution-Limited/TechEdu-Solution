"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Calendar, Clock, User, MessageSquare } from "lucide-react";
import { toast } from "react-toastify";
import { BookingService } from "@/lib/api/bookingService";
import { getTokenFromCookies } from "@/lib/cookies";
import type { RescheduleRequest, CreateRescheduleRequestData } from "@/types";

interface RescheduleRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  currentStartTime: string;
  currentEndTime: string;
  instructorId: string;
  requestorId: string;
  onSuccess?: () => void;
}

interface RescheduleRequestActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  rescheduleRequest: RescheduleRequest;
  action: "approve" | "reject";
  onSuccess?: () => void;
}

export function CreateRescheduleRequestModal({
  isOpen,
  onClose,
  bookingId,
  currentStartTime,
  currentEndTime,
  instructorId,
  requestorId,
  onSuccess,
}: RescheduleRequestModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    newStartTime: "",
    newEndTime: "",
    reason: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      const rescheduleData: CreateRescheduleRequestData = {
        attendanceId: bookingId,
        oldStartTime: currentStartTime,
        oldEndTime: currentEndTime,
        newStartTime: formData.newStartTime,
        newEndTime: formData.newEndTime,
        reason: formData.reason,
        instructorId,
        requestorId,
      };

      const response = await BookingService.createRescheduleRequest(
        rescheduleData,
        token
      );

      if (response.data?.success) {
        toast.success("Reschedule request created successfully");
        onSuccess?.();
        onClose();
        setFormData({ newStartTime: "", newEndTime: "", reason: "" });
      } else {
        toast.error(
          response.data?.message || "Failed to create reschedule request"
        );
      }
    } catch (error) {
      console.error("Error creating reschedule request:", error);
      toast.error("Error creating reschedule request");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Request Reschedule
          </DialogTitle>
          <DialogDescription>
            Submit a request to reschedule your booking. The instructor will
            review and respond to your request.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currentStartTime">Current Start Time</Label>
              <Input
                id="currentStartTime"
                value={new Date(currentStartTime).toLocaleString()}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="currentEndTime">Current End Time</Label>
              <Input
                id="currentEndTime"
                value={new Date(currentEndTime).toLocaleString()}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="newStartTime">New Start Time *</Label>
              <Input
                id="newStartTime"
                type="datetime-local"
                value={formData.newStartTime}
                onChange={(e) =>
                  handleInputChange("newStartTime", e.target.value)
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="newEndTime">New End Time *</Label>
              <Input
                id="newEndTime"
                type="datetime-local"
                value={formData.newEndTime}
                onChange={(e) =>
                  handleInputChange("newEndTime", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="reason">Reason for Reschedule *</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
              placeholder="Please explain why you need to reschedule this booking..."
              rows={3}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function RescheduleRequestActionModal({
  isOpen,
  onClose,
  rescheduleRequest,
  action,
  onSuccess,
}: RescheduleRequestActionModalProps) {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getTokenFromCookies();
      if (!token) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      let response;
      if (action === "approve") {
        response = await BookingService.approveRescheduleRequest(
          rescheduleRequest._id,
          token
        );
      } else {
        response = await BookingService.rejectRescheduleRequest(
          rescheduleRequest._id,
          token,
          reason
        );
      }

      if (response.data?.success) {
        toast.success(
          action === "approve"
            ? "Reschedule request approved"
            : "Reschedule request rejected"
        );
        onSuccess?.();
        onClose();
        setReason("");
      } else {
        toast.error(
          response.data?.message || `Failed to ${action} reschedule request`
        );
      }
    } catch (error) {
      console.error(`Error ${action}ing reschedule request:`, error);
      toast.error(`Error ${action}ing reschedule request`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {action === "approve" ? (
              <>
                <Calendar className="w-5 h-5 text-green-600" />
                Approve Reschedule Request
              </>
            ) : (
              <>
                <MessageSquare className="w-5 h-5 text-red-600" />
                Reject Reschedule Request
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {action === "approve"
              ? "Are you sure you want to approve this reschedule request?"
              : "Are you sure you want to reject this reschedule request?"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Request Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Current Time:</span>
                <span>
                  {new Date(rescheduleRequest.oldStartTime).toLocaleString()} -{" "}
                  {new Date(rescheduleRequest.oldEndTime).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Requested Time:</span>
                <span>
                  {new Date(rescheduleRequest.newStartTime).toLocaleString()} -{" "}
                  {new Date(rescheduleRequest.newEndTime).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Reason:</span>
                <span className="text-gray-600">
                  {rescheduleRequest.reason}
                </span>
              </div>
            </div>
          </div>

          {action === "reject" && (
            <div>
              <Label htmlFor="rejectionReason">
                Rejection Reason (Optional)
              </Label>
              <Textarea
                id="rejectionReason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                rows={3}
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant={action === "approve" ? "default" : "destructive"}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : action === "approve" ? (
                "Approve Request"
              ) : (
                "Reject Request"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
