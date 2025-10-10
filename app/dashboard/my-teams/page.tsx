"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Calendar,
  MapPin,
  Code,
  Briefcase,
  GraduationCap,
  Eye,
  LogOut,
  Loader2,
  AlertCircle,
  Crown,
  User,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { getApiRequest, postApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { toast } from "react-toastify";
import Link from "next/link";

interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  role: string;
  primarySpecialization: string;
  experienceLevel: string;
  yearsOfExperience: number;
  programmingLanguages: string[];
  frameworksAndTools: string[];
  preferredTechStack: string[];
  currentJobTitle: string;
  industryFocus: string;
  employmentStatus: string;
  remoteWorkExperience: boolean;
  lookingForJobs: boolean;
  interestedInTraining: boolean;
  joinedAt: string;
}

interface Team {
  id: string;
  teamName: string;
  role: "team_lead" | "member";
  teamSize: number;
  primarySpecialization: string;
  experienceLevel: string;
  preferredTechStack: string[];
  lookingForJobs: boolean;
  interestedInTraining: boolean;
  joinedAt: string;
}

interface TeamMembersResponse {
  teamId: string;
  teamName: string;
  members: TeamMember[];
  totalMembers: number;
}

export default function MyTeamsPage() {
  const { userData } = useRole();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState<string | null>(null);
  const [leaveLoading, setLeaveLoading] = useState<string | null>(null);
  const [selectedTeamMembers, setSelectedTeamMembers] =
    useState<TeamMembersResponse | null>(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [teamToLeave, setTeamToLeave] = useState<Team | null>(null);

  useEffect(() => {
    fetchMyTeams();
  }, []);

  const fetchMyTeams = async () => {
    try {
      setLoading(true);
      const token = getTokenFromCookies();

      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

      const response = await getApiRequest("/api/teams/my-teams", token);

      if (response?.data?.success) {
        setTeams(response.data.data.teams);
      } else {
        throw new Error(response?.data?.message || "Failed to load teams");
      }
    } catch (error: any) {
      console.error("Error fetching teams:", error);
      toast.error(error.message || "Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async (teamId: string) => {
    try {
      setMembersLoading(teamId);
      const token = getTokenFromCookies();
      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

      const response = await getApiRequest(
        `/api/teams/${teamId}/members/public-profiles`,
        token || undefined
      );

      if (response?.data?.success) {
        setSelectedTeamMembers(response.data.data);
        setShowMembersModal(true);
      } else {
        throw new Error(
          response?.data?.message || "Failed to load team members"
        );
      }
    } catch (error: any) {
      console.error("Error fetching team members:", error);
      toast.error(error.message || "Failed to load team members");
    } finally {
      setMembersLoading(null);
    }
  };

  const handleLeaveTeam = async () => {
    if (!teamToLeave) return;

    try {
      setLeaveLoading(teamToLeave.id);
      const token = getTokenFromCookies();
      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }
      const response = await postApiRequest(
        `/api/teams/${teamToLeave.id}/leave`,
        {},
        { Authorization: `Bearer ${token}` }
      );

      if (response?.data?.success) {
        toast.success("Successfully left the team!");
        setShowLeaveModal(false);
        setTeamToLeave(null);
        fetchMyTeams(); // Refresh the teams list
      } else {
        throw new Error(response?.data?.message || "Failed to leave team");
      }
    } catch (error: any) {
      console.error("Error leaving team:", error);
      toast.error(error.message || "Failed to leave team");
    } finally {
      setLeaveLoading(null);
    }
  };

  const openLeaveModal = (team: Team) => {
    setTeamToLeave(team);
    setShowLeaveModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleBadge = (role: string) => {
    if (role === "team_lead") {
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
          <Crown className="w-3 h-3 mr-1" />
          Team Lead
        </Badge>
      );
    }
    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
        <User className="w-3 h-3 mr-1" />
        Member
      </Badge>
    );
  };

  const getExperienceBadge = (level: string) => {
    const colors = {
      Senior: "bg-green-100 text-green-800 border-green-200",
      "Mid-level": "bg-yellow-100 text-yellow-800 border-yellow-200",
      Junior: "bg-blue-100 text-blue-800 border-blue-200",
      "Entry-level": "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
      <Badge
        className={
          colors[level as keyof typeof colors] || colors["Entry-level"]
        }
      >
        {level}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading your teams...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Teams</h1>
          <p className="text-gray-600 mt-2">
            View and manage all teams you're a member of
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {teams.length} team{teams.length !== 1 ? "s" : ""} found
        </div>
      </div>

      {/* Teams Grid */}
      {teams.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No teams found
            </h3>
            <p className="text-gray-500 mb-4">
              You're not currently a member of any teams.
            </p>
            {/* <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/dashboard/my-teams/create">
                Create Your First Team
              </Link>
            </Button> */}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card key={team.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      {team.teamName}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      {getRoleBadge(team.role)}
                      {getExperienceBadge(team.experienceLevel)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchTeamMembers(team.id)}
                      disabled={membersLoading === team.id}
                      className="rounded-[10px]"
                    >
                      {membersLoading === team.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    {team.role === "member" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openLeaveModal(team)}
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 rounded-[10px]"
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Team Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>{team.teamSize} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Joined {formatDate(team.joinedAt)}</span>
                    </div>
                  </div>

                  {/* Specialization */}
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Briefcase className="w-4 h-4" />
                      <span className="font-medium">Specialization</span>
                    </div>
                    <p className="text-sm text-gray-900">
                      {team.primarySpecialization}
                    </p>
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Code className="w-4 h-4" />
                      <span className="font-medium">Tech Stack</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {team.preferredTechStack.slice(0, 3).map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {team.preferredTechStack.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{team.preferredTechStack.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Status Indicators */}
                  <div className="flex gap-2">
                    {team.lookingForJobs && (
                      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                        <Briefcase className="w-3 h-3 mr-1" />
                        Job Seeking
                      </Badge>
                    )}
                    {team.interestedInTraining && (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                        <GraduationCap className="w-3 h-3 mr-1" />
                        Training
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Team Members Modal */}
      <Dialog open={showMembersModal} onOpenChange={setShowMembersModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedTeamMembers?.teamName} - Team Members
            </DialogTitle>
            <DialogDescription>
              View public profiles of all team members
            </DialogDescription>
          </DialogHeader>

          {selectedTeamMembers && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                {selectedTeamMembers.totalMembers} member
                {selectedTeamMembers.totalMembers !== 1 ? "s" : ""}
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role & Experience</TableHead>
                    <TableHead>Tech Stack</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedTeamMembers.members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src="" />
                            <AvatarFallback>
                              {member.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.fullName}</p>
                            <p className="text-sm text-gray-500">
                              {member.email}
                            </p>
                            <p className="text-sm text-gray-600">
                              {member.currentJobTitle}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-xs">
                            {member.role}
                          </Badge>
                          <div className="text-sm">
                            {getExperienceBadge(member.experienceLevel)}
                          </div>
                          <p className="text-xs text-gray-500">
                            {member.yearsOfExperience} years exp.
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex flex-wrap gap-1">
                            {member.programmingLanguages
                              .slice(0, 2)
                              .map((lang) => (
                                <Badge
                                  key={lang}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {lang}
                                </Badge>
                              ))}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {member.frameworksAndTools
                              .slice(0, 2)
                              .map((tool) => (
                                <Badge
                                  key={tool}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tool}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {member.lookingForJobs && (
                            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                              Job Seeking
                            </Badge>
                          )}
                          {member.interestedInTraining && (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                              Training
                            </Badge>
                          )}
                          <p className="text-xs text-gray-500">
                            {member.employmentStatus}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {formatDate(member.joinedAt)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowMembersModal(false)}
              className="rounded-[10px]"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave Team Confirmation Modal */}
      <Dialog open={showLeaveModal} onOpenChange={setShowLeaveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Leave Team</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave "{teamToLeave?.teamName}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-[10px]">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              You will lose access to all team resources and will need to be
              re-invited to rejoin.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLeaveModal(false)}
              disabled={leaveLoading === teamToLeave?.id}
              className="rounded-[10px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLeaveTeam}
              disabled={leaveLoading === teamToLeave?.id}
              className="bg-red-600 hover:bg-red-700 rounded-[10px]"
            >
              {leaveLoading === teamToLeave?.id ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Leaving...
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Leave Team
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
