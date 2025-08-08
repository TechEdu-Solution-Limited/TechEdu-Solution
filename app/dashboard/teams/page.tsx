"use client";

import React, { useState, useEffect } from "react";
import { useRole } from "@/contexts/RoleContext";
import { useRouter } from "next/navigation";
import { getTokenFromCookies } from "@/lib/cookies";
import { TeamService } from "@/lib/api/teamService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Plus,
  Shield,
  MapPin,
  Briefcase,
  Eye,
  Mail,
  CheckCircle2,
  XCircle,
  LogOut,
} from "lucide-react";
import { toast } from "react-toastify";
import { Team, TeamInvitation, UserTeam } from "@/types";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function TeamsPage() {
  const { userData } = useRole();
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [myTeams, setMyTeams] = useState<UserTeam[]>([]);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"all" | "my-teams" | "invitations">(
    "all"
  );

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const token = getTokenFromCookies();
      const response = await TeamService.getTeams(
        undefined,
        token || undefined
      );

      if (response.data?.success) {
        setTeams(response.data.data.teams);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("Failed to fetch teams");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyTeams = async () => {
    try {
      const token = getTokenFromCookies();
      const response = await TeamService.getUserTeams(token || "");

      if (response.data?.success) {
        setMyTeams(response.data.data.teams);
      }
    } catch (error) {
      console.error("Error fetching my teams:", error);
    }
  };

  const fetchInvitations = async () => {
    try {
      const token = getTokenFromCookies();
      const response = await TeamService.getUserInvitations(token || "");

      if (response.data?.success) {
        setInvitations(response.data.data.invitations);
      }
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  };

  useEffect(() => {
    if (userData?.email) {
      fetchTeams();
      fetchMyTeams();
      fetchInvitations();
    }
  }, [userData?.email]);

  const handleAcceptInvitation = async (invitationToken: string) => {
    try {
      const token = getTokenFromCookies();
      const response = await TeamService.acceptInvitation(
        { invitationToken },
        token || ""
      );

      if (response.data?.success) {
        toast.success("Invitation accepted successfully!");
        fetchInvitations();
        fetchMyTeams();
      }
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error("Failed to accept invitation");
    }
  };

  const handleDeclineInvitation = async (invitationToken: string) => {
    try {
      const token = getTokenFromCookies();
      const response = await TeamService.declineInvitation(
        { invitationToken },
        token || ""
      );

      if (response.data?.success) {
        toast.success("Invitation declined");
        fetchInvitations();
      }
    } catch (error) {
      console.error("Error declining invitation:", error);
      toast.error("Failed to decline invitation");
    }
  };

  const handleLeaveTeam = async (teamId: string) => {
    if (!confirm("Are you sure you want to leave this team?")) return;

    try {
      const token = getTokenFromCookies();
      const response = await TeamService.leaveTeam(teamId, token || "");

      if (response.data?.success) {
        toast.success("Left team successfully");
        fetchMyTeams();
      }
    } catch (error) {
      console.error("Error leaving team:", error);
      toast.error("Failed to leave team");
    }
  };

  const getRoleBadge = (role: string) => {
    return (
      <Badge variant={role === "team_lead" ? "default" : "secondary"}>
        <Shield className="w-3 h-3 mr-1" />
        {role === "team_lead" ? "Team Lead" : "Member"}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      pending: "secondary",
      inactive: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Team Management
                </h1>
                <p className="text-gray-600">
                  Create, manage, and join teams of tech professionals
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2">
              <Button
                variant={viewMode === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("all")}
              >
                All Teams
              </Button>
              <Button
                variant={viewMode === "my-teams" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("my-teams")}
              >
                My Teams
              </Button>
              <Button
                variant={viewMode === "invitations" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("invitations")}
              >
                Invitations
              </Button>
            </div>

            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === "all" && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Available Teams</CardTitle>
              <CardDescription>
                Browse and join teams of tech professionals
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading teams...</p>
                </div>
              ) : teams.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No teams found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    No teams are available at the moment.
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Team
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teams.map((team) => (
                    <Card
                      key={team.id}
                      className="hover:shadow-lg transition-all duration-300"
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {team.teamName}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>
                            {team.location.city}, {team.location.state}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>
                            {team.currentMembers}/{team.teamSize} members
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium">
                            {team.primarySpecialization}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {team.teamLead.fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-600">
                              Lead by {team.teamLead.fullName}
                            </span>
                          </div>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {viewMode === "my-teams" && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">My Teams</CardTitle>
              <CardDescription>
                Teams you're a member of or lead
              </CardDescription>
            </CardHeader>
            <CardContent>
              {myTeams.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No teams yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You haven't joined any teams yet.
                  </p>
                  <Button onClick={() => setViewMode("all")}>
                    Browse Teams
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myTeams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-semibold">{team.teamName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            {getRoleBadge(team.role)}
                            <span className="text-sm text-gray-600">
                              {team.primarySpecialization} •{" "}
                              {team.experienceLevel}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLeaveTeam(team.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Leave
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {viewMode === "invitations" && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Team Invitations</CardTitle>
              <CardDescription>
                Pending invitations to join teams
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invitations.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No invitations
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You don't have any pending team invitations.
                  </p>
                  <Button onClick={() => setViewMode("all")}>
                    Browse Teams
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {invitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-semibold">
                          Invitation to join {invitation.teamName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Invited by {invitation.invitedBy.fullName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAcceptInvitation(invitation.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeclineInvitation(invitation.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
