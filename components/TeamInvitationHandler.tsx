"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { apiRequest, getApiRequest, postApiRequest } from "@/lib/apiFetch";

interface InvitationData {
  teamName: string;
  teamLead: string;
  role: string;
  invitedBy: string;
  invitedAt: string;
}

export default function TeamInvitationHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [invitationData, setInvitationData] = useState<InvitationData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState<"accepted" | "declined" | null>(null);

  const invitationToken = searchParams.get("token");

  useEffect(() => {
    if (!invitationToken) {
      setError("No invitation token provided");
      setLoading(false);
      return;
    }

    // Validate the invitation token and get invitation details
    validateInvitation();
  }, [invitationToken]);

  const validateInvitation = async () => {
    try {
      // This would be a GET endpoint to validate the token and get invitation details
      const response = await getApiRequest(
        `/api/teams/invite/validate?token=${invitationToken}`,
        "GET"
      );

      if (response.data) {
        setInvitationData(response.data);
      } else {
        setError(response.message || "Invalid or expired invitation");
      }
    } catch (error) {
      console.error("Error validating invitation:", error);
      setError("Failed to validate invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!invitationToken) return;

    setProcessing(true);
    try {
      const response = await postApiRequest("/api/teams/invite/accept", {
        method: "POST",
        body: JSON.stringify({ invitationToken }),
      });

      if (response.data) {
        setAction("accepted");
        toast.success("Successfully joined the team!");
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard/team-tech-professional");
        }, 2000);
      } else {
        toast.error(response.message || "Failed to accept invitation");
      }
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error("Failed to accept invitation");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeclineInvitation = async () => {
    if (!invitationToken) return;

    setProcessing(true);
    try {
      const response = await postApiRequest("/api/teams/invite/decline", {
        method: "POST",
        body: JSON.stringify({ invitationToken }),
      });

      if (response.data) {
        setAction("declined");
        toast.success("Invitation declined");
        // Redirect to home page after a short delay
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        toast.error(response.message || "Failed to accept invitation");
      }
    } catch (error) {
      console.error("Error declining invitation:", error);
      toast.error("Failed to decline invitation");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Validating invitation...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Invalid Invitation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => router.push("/")} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (action === "accepted") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Welcome to the Team!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You have successfully joined {invitationData?.teamName}.
              Redirecting to your dashboard...
            </p>
            <div className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (action === "declined") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-600">
              <XCircle className="h-5 w-5" />
              Invitation Declined
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You have declined the invitation to join{" "}
              {invitationData?.teamName}. Redirecting to home...
            </p>
            <div className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Team Invitation</CardTitle>
          <CardDescription className="text-center">
            You've been invited to join a team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {invitationData && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  {invitationData.teamName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Team Lead: {invitationData.teamLead}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Role:</span>
                  <Badge variant="secondary">{invitationData.role}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Invited by:
                  </span>
                  <span className="text-sm">{invitationData.invitedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Invited on:
                  </span>
                  <span className="text-sm">
                    {new Date(invitationData.invitedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleAcceptInvitation}
              disabled={processing}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Accepting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept Invitation
                </>
              )}
            </Button>

            <Button
              onClick={handleDeclineInvitation}
              disabled={processing}
              variant="outline"
              className="w-full"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Declining...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Decline Invitation
                </>
              )}
            </Button>
          </div>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-sm text-muted-foreground"
            >
              Go to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
