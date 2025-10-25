"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRole } from "@/contexts/RoleContext";
import { postApiRequest, getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { toast } from "react-toastify";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { safeConsole } from "@/lib/console";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  metadata: {
    teamId: string;
    teamName: string;
    adminName: string;
    invitationToken: string;
  };
}

type ApiResult =
  | {
      success: true;
      message: string;
      data?: {
        team?: { id: string; name: string };
        message?: string;
      };
      meta?: Record<string, any>;
    }
  | {
      success: false;
      message?: string;
    };

const ALREADY_ACCEPTED = "Invitation already accepted";
const ALREADY_DECLINED = "Invitation declined successfully"; // success path message
const ALREADY_DECLINED_ERROR = "Invitation already declined";

export default function TeamInvitesPage() {
  const { userData } = useRole();
  const searchParams = useSearchParams();

  const [processingAction, setProcessingAction] = useState<
    "accept" | "decline" | null
  >(null);
  const [invitationToken, setInvitationToken] = useState<string | null>(null);
  const [teamInfo, setTeamInfo] = useState<{
    teamName: string;
    adminName: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Holds success payload and switches UI to result view
  const [result, setResult] = useState<ApiResult | null>(null);

  // NEW: When a terminal server response (like "Invitation already accepted") is returned,
  // we hide the Accept/Decline buttons and show this message instead.
  const [finalMessage, setFinalMessage] = useState<string | null>(null);

  // Get invitation token from URL parameters first
  const urlToken = searchParams.get("token");

  useEffect(() => {
    const fetchInvitationToken = async () => {
      try {
        setLoading(true);
        const token = getTokenFromCookies();

        // If token is in URL, use it
        if (urlToken) {
          setInvitationToken(urlToken);
          setLoading(false);
          return;
        }

        // Otherwise, fetch notifications to find team invitation
        const response = await getApiRequest(
          "/api/notifications",
          token || undefined
        );

        if (response.status >= 400) {
          throw new Error(
            response.data?.message || "Failed to fetch notifications"
          );
        }

        const notifications = response.data?.data?.notifications || [];
        const teamInvitation = notifications.find(
          (notification: Notification) =>
            notification.type === "team_invitation" &&
            notification.metadata?.invitationToken
        );

        if (teamInvitation) {
          setInvitationToken(teamInvitation.metadata.invitationToken);
          setTeamInfo({
            teamName: teamInvitation.metadata.teamName,
            adminName: teamInvitation.metadata.adminName,
          });
        }
      } catch (error: any) {
        safeConsole.error("Error fetching invitation token:", error);
        toast.error("Failed to load invitation details");
      } finally {
        setLoading(false);
      }
    };

    fetchInvitationToken();
  }, [urlToken]);

  const getErrorDetail = (err: any): string | undefined => {
    const details = err?.error?.details;
    if (Array.isArray(details) && details.length > 0) return details[0];
    return err?.message || err?.error?.message;
  };

  const handleAcceptInvitation = async () => {
    if (!invitationToken) {
      toast.error(
        process.env.NEXT_PUBLIC_NODE_ENV === "production"
          ? "Something went wrong"
          : "No invitation token found"
      );
      return;
    }

    try {
      setProcessingAction("accept");
      const token = getTokenFromCookies();

      // Fetch user's full profile to get complete information
      const userResponse = await getApiRequest(
        "/api/users/me",
        token || undefined
      );

      if (userResponse.status >= 400) {
        throw new Error("Failed to fetch user profile");
      }

      const userProfile = userResponse.data?.data?.data?.profile;
      const fullName =
        userProfile?.fullName || userData?.fullName || "Unknown User";
      const email = userProfile?.email || userData?.email || "";

      if (!fullName || fullName === "Unknown User") {
        throw new Error("User full name is required but not available");
      }

      // Extract other profile data with defaults for TeamTechProfessional schema
      const trainingAvailability = "custom"; // Default for team members
      const contactEmail = email; // Use the user's email
      const contactPhone = userProfile?.phone || ""; // Individual profile might have phone

      const requestBody = {
        invitationToken,
        fullName,
        email,
        teamName: teamInfo?.teamName || "Unknown Team",
        goalType: "custom",
        priorityAreas: [],
        trainingTimeline: "Flexible",
        trainingAvailability,
        contactEmail,
        contactPhone,
      };

      const response = await postApiRequest(
        "/api/teams/invite/accept",
        requestBody,
        { Authorization: `Bearer ${token}` }
      );

      if (response.status >= 400) throw response.data;

      const payload: ApiResult = response.data;
      if ((payload as any)?.success) {
        setResult(payload);
        setInvitationToken(null);
        toast.success(payload.message || "Invitation accepted successfully!");
      } else {
        throw response.data;
      }
    } catch (error: any) {
      const detail = getErrorDetail(error);
      safeConsole.error("Error accepting invitation:", error);

      // NEW: if API says "Invitation already accepted", hide buttons and show that message instead
      if (detail === ALREADY_ACCEPTED) {
        setFinalMessage(detail);
        // We keep invitationToken intact so the page context is clear,
        // but the render branch below will hide the buttons.
        toast.info(detail);
      } else {
        toast.error(
          process.env.NEXT_PUBLIC_NODE_ENV === "production"
            ? "Something went wrong"
            : detail || "Failed to accept invitation"
        );
      }
    } finally {
      setProcessingAction(null);
    }
  };

  const handleDeclineInvitation = async () => {
    if (!invitationToken) {
      toast.error(
        process.env.NEXT_PUBLIC_NODE_ENV === "production"
          ? "Something went wrong"
          : "No invitation token found"
      );
      return;
    }

    try {
      setProcessingAction("decline");
      const token = getTokenFromCookies();

      const response = await postApiRequest(
        "/api/teams/invite/decline",
        { invitationToken },
        { Authorization: `Bearer ${token}` }
      );

      if (response.status >= 400) throw response.data;

      const payload: ApiResult = response.data;
      if ((payload as any)?.success) {
        setResult(payload);
        setInvitationToken(null);
        toast.success(payload.message || "Invitation declined successfully!");
      } else {
        throw response.data;
      }
    } catch (error: any) {
      const detail = getErrorDetail(error);
      safeConsole.error("Error declining invitation:", error);

      // Optional symmetry: treat "already declined" as terminal too
      if (detail === ALREADY_DECLINED_ERROR) {
        setFinalMessage(detail);
        toast.info(detail);
      } else {
        toast.error(detail || "Failed to decline invitation");
      }
    } finally {
      setProcessingAction(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardContent className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading invitation details...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // RESULT VIEW: replaces the invitation UI once accept/decline succeeds
  if (result && (result as any).success) {
    const teamName =
      (result as any)?.data?.team?.name ?? teamInfo?.teamName ?? undefined;

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-10 w-10 mx-auto mb-3 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {(result as any).message || "Success"}
              </h3>
              {teamName ? (
                <p className="text-gray-700">
                  Team: <span className="font-medium">{teamName}</span>
                </p>
              ) : null}
              {/* No accept/decline buttons here by design */}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // FINAL MESSAGE VIEW: when API returns a terminal error like "Invitation already accepted"
  if (finalMessage) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-10 w-10 mx-auto mb-3 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {finalMessage}
              </h3>
              {/* Intentionally no action buttons per requirement */}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!invitationToken) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Invitation Found
              </h3>
              <p className="text-gray-600">
                No active team invitation found. Please check your notifications
                or use the invitation link.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Team Invitation
          </h1>
          <p className="text-gray-600">Accept or decline the team invitation</p>
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                You've been invited to join a team
              </h3>
              {teamInfo && (
                <div className="mb-4 p-4 bg-blue-50 rounded-[10px]">
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Team:</span>{" "}
                    {teamInfo.teamName}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Invited by:</span>{" "}
                    {teamInfo.adminName}
                  </p>
                </div>
              )}
              <p className="text-gray-600">
                Please choose whether to accept or decline this invitation
              </p>
            </div>

            {/* Buttons are automatically hidden in result/finalMessage views */}
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button
                onClick={handleAcceptInvitation}
                disabled={processingAction === "accept"}
                className="bg-green-600 hover:bg-green-700 text-white rounded-[10px]"
              >
                {processingAction === "accept" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                Accept Invitation
              </Button>
              <Button
                variant="outline"
                onClick={handleDeclineInvitation}
                disabled={processingAction === "decline"}
                className="border-red-300 text-red-600 hover:bg-red-50 rounded-[10px]"
              >
                {processingAction === "decline" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                Decline Invitation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
