"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Plus,
  Mail,
  Calendar,
  UserCheck,
  UserX,
  Clock,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import {
  getApiRequest,
  postApiRequest,
  deleteApiRequest,
} from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { toast } from "react-toastify";

interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: "pending" | "accepted" | "declined";
  invitedAt: string;
  joinedAt?: string;

  invitedBy: {
    id: string;
    fullName: string;
  };
}

interface TeamData {
  teamId: string;
  teamName: string;
  teamSize: number;
  contactEmail: string;
  contactPhone: string;
  location: {
    country: string;
    state: string;
    city: string;
  };
  preferredTechStack: string[];
  learningGoals: {
    goalType: string;
    priorityAreas: string[];
    trainingTimeline: string;
  };
}

export default function TeamManagementPage() {
  const { userData } = useRole();
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [revokeLoading, setRevokeLoading] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "",
  });

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const token = getTokenFromCookies();

      // Get user data to extract team ID
      const userResponse = await getApiRequest(
        "/api/users/me",
        token || undefined
      );

      if (userResponse.status >= 400) {
        throw new Error("Failed to fetch user data");
      }

      const teamId = userResponse.data?.data?.data?.profile?._id;

      if (!teamId) {
        throw new Error("No team ID found in user profile");
      }

      // Fetch team data and members in parallel
      const [teamResponse, membersResponse] = await Promise.all([
        getApiRequest(`/api/teams/${teamId}`, token || undefined),
        getApiRequest(`/api/teams/${teamId}/members`, token || undefined),
      ]);

      if (teamResponse.status >= 400) {
        throw new Error("Failed to fetch team data");
      }

      if (membersResponse.status >= 400) {
        throw new Error("Failed to fetch team members");
      }

      setTeamData(teamResponse.data?.data);
      setMembers(membersResponse.data?.data?.members || []);
    } catch (error: any) {
      console.error("Error fetching team data:", error);
      toast.error(error.message || "Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async () => {
    if (!inviteForm.email || !inviteForm.role) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setInviteLoading(true);
      const token = getTokenFromCookies();

      // Get team ID from user data
      const userResponse = await getApiRequest(
        "/api/users/me",
        token || undefined
      );
      const teamId = userResponse.data?.data?.data?.profile?._id;

      const response = await postApiRequest(
        `/api/teams/${teamId}/invite`,
        inviteForm,
        { Authorization: `Bearer ${token}` }
      );

      if (response.status >= 400) {
        throw new Error(response.data?.message || "Failed to invite member");
      }

      toast.success("Invitation sent successfully!");
      setInviteForm({ email: "", role: "" });
      setShowInviteModal(false);
      fetchTeamData(); // Refresh the members list
    } catch (error: any) {
      console.error("Error inviting member:", error);
      toast.error(error.message || "Failed to invite member");
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRevokeInvitation = async (memberId: string) => {
    try {
      setRevokeLoading(memberId);
      const token = getTokenFromCookies();

      // Get team ID from user data
      const userResponse = await getApiRequest(
        "/api/users/me",
        token || undefined
      );
      const teamId = userResponse.data?.data?.data?.profile?._id;

      const response = await deleteApiRequest(
        `/api/teams/${teamId}/invite/${memberId}`,
        token ?? ""
      );

      if (response.status >= 400) {
        throw new Error(
          response.data?.message || "Failed to revoke invitation"
        );
      }

      toast.success("Invitation revoked successfully!");
      fetchTeamData(); // Refresh the members list
    } catch (error: any) {
      console.error("Error revoking invitation:", error);
      toast.error(error.message || "Failed to revoke invitation");
    } finally {
      setRevokeLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-green-100 text-green-800">Accepted</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "declined":
        return <Badge className="bg-red-100 text-red-800">Declined</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading team data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your team members and invitations
          </p>
        </div>
        <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-[10px]">
              <Plus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white rounded-[10px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your team. The member will receive an
                email with the invitation link.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={inviteForm.email}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, email: e.target.value })
                  }
                  className="rounded-[10px]"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  type="text"
                  placeholder="Senior Developer"
                  value={inviteForm.role}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, role: e.target.value })
                  }
                  className="rounded-[10px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowInviteModal(false)}
                disabled={inviteLoading}
                className="rounded-[10px]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleInviteMember}
                disabled={inviteLoading}
                className="bg-blue-600 hover:bg-blue-700 rounded-[10px]"
              >
                {inviteLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invitation
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Overview */}
      {teamData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Team Details</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {teamData.teamName}
                  </p>
                  <p>
                    <span className="font-medium">Size:</span>{" "}
                    {teamData.teamSize} members
                  </p>
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {teamData.location.city}, {teamData.location.state}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Contact</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {teamData.contactEmail}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {teamData.contactPhone}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tech Stack</h4>
                <div className="flex flex-wrap gap-1">
                  {teamData.preferredTechStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Members ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No team members found</p>
              <p className="text-sm text-gray-400">
                Invite members to get started
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invited At</TableHead>
                  <TableHead>Invited By</TableHead>
                  {/* <TableHead>Joined</TableHead> */}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {member.fullName
                              ? member.fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.fullName}</p>
                          <p className="text-sm text-gray-500">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{getStatusBadge(member.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        {formatDate(member.invitedAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <span>{member.invitedBy.fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {member.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevokeInvitation(member.id)}
                          disabled={revokeLoading === member.id}
                          className="text-red-600 hover:text-red-700"
                        >
                          {revokeLoading === member.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
