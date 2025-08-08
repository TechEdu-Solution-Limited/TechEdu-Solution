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
        console.error("Error fetching invitation token:", error);
        toast.error("Failed to load invitation details");
      } finally {
        setLoading(false);
      }
    };

    fetchInvitationToken();
  }, [urlToken]);

  const handleAcceptInvitation = async () => {
    if (!invitationToken) {
      toast.error("No invitation token found");
      return;
    }

    try {
      setProcessingAction("accept");
      const token = getTokenFromCookies();

      const response = await postApiRequest(
        "/api/teams/invite/accept",
        { invitationToken },
        { Authorization: `Bearer ${token}` }
      );

      if (response.status >= 400) {
        throw response.data;
      }

      toast.success("Invitation accepted successfully!");
    } catch (error: any) {
      console.error("Error accepting invitation:", error);
      toast.error(
        error?.error?.details?.[0] ||
          error?.message ||
          "Failed to accept invitation"
      );
    } finally {
      setProcessingAction(null);
    }
  };

  const handleDeclineInvitation = async () => {
    if (!invitationToken) {
      toast.error("No invitation token found");
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

      if (response.status >= 400) {
        throw response.data;
      }

      toast.success("Invitation declined successfully!");
    } catch (error: any) {
      console.error("Error declining invitation:", error);
      toast.error(
        error?.error?.details?.[0] ||
          error?.message ||
          "Failed to decline invitation"
      );
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
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
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

            <div className="flex gap-4 justify-center">
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
